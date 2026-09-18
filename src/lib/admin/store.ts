"use client";

import { useCallback, useSyncExternalStore } from "react";
import { emptyDoc, type AdminDoc } from "./types";

/**
 * Úložiště adminu — jeden JSON dokument.
 *
 * Admin umí běžet ve dvou režimech a pozná to sám:
 *
 *   cloud  Data jsou v databázi (Supabase). Prohlížeč s ní nemluví přímo,
 *          chodí přes /api/admin/data, kde tajný klíč zůstává na serveru.
 *          localStorage se používá jako kopie pro případ výpadku sítě.
 *
 *   local  Databáze není nastavená (chybí proměnné prostředí). Všechno
 *          žije v localStorage toho prohlížeče, jako dřív.
 *
 * Ukládá se optimisticky: změna je na obrazovce hned, do databáze odchází
 * se zpožděním a několik rychlých úprav se spojí do jednoho zápisu.
 *
 * Souběh dvou zařízení hlídá číslo revize. Když někdo uloží dřív, databáze
 * naši verzi nepřepíše a vrátí conflict; my si stáhneme aktuální data a
 * přehrajeme na ně své neuložené úpravy (držíme si je jako funkce, ne jako
 * hotový výsledek — proto se cizí práce neztratí).
 */

const KEY = "knm-admin-v1";
/**
 * Kopie dokumentu s úpravami, o kterých víme, že do databáze nedošly.
 * Neuložené úpravy se jinak drží jen v paměti stránky jako funkce, takže
 * zavření záložky nebo obnovení stránky je ztratí. Sem se odkládají ve
 * chvíli, kdy je jisté, že zápis neprošel — ať je aspoň z čeho je vzít.
 */
const KEY_NEODESLANO = "knm-admin-neodeslano-v1";
/** Jak dlouho se čeká, jestli nepřijde další úprava, než se uloží. */
const SAVE_DEBOUNCE_MS = 700;

export type SyncMode = "local" | "cloud";
export type SyncStatus = "loading" | "ready" | "saving" | "offline" | "conflict" | "error";

export type Updater = (doc: AdminDoc) => AdminDoc;

type Snapshot = AdminDoc & {
  ready: boolean;
  mode: SyncMode;
  status: SyncStatus;
  /** Kdy se naposledy potvrdilo uložení do databáze. */
  syncedAt?: string;
  error?: string;
};

const SERVER_SNAPSHOT: Snapshot = {
  ...emptyDoc(),
  ready: false,
  mode: "local",
  status: "loading",
};

let snapshot: Snapshot | null = null;
/**
 * Číslo verze dat, na kterých stavíme. Dokud je null, nevíme, co je
 * v databázi — a nesmíme do ní zapisovat: ukládá se celý dokument
 * a co v něm není, se maže.
 */
let revision: number | null = null;
let loading = false;
/** Úpravy, které ještě databáze nepotvrdila. */
let pending: Updater[] = [];
let saving = false;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let started = false;

const listeners = new Set<() => void>();

/* ── localStorage ──────────────────────────────────────────────────── */

function readLocal(): AdminDoc {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? normalize(JSON.parse(raw) as Partial<AdminDoc>) : emptyDoc();
  } catch {
    return emptyDoc();
  }
}

function writeLocal(doc: AdminDoc) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(doc));
  } catch {
    // Plné úložiště nebo soukromé okno — v režimu cloud to nevadí,
    // přijdeme jen o zálohu pro offline.
  }
}

/** Odložit stranou dokument s úpravami, které se neuložily. */
function odlozitNeodeslane(doc: AdminDoc) {
  try {
    window.localStorage.setItem(KEY_NEODESLANO, JSON.stringify({ kdy: new Date().toISOString(), doc }));
  } catch {
    /* plné úložiště — víc se dělat nedá */
  }
}

export type Neodeslane = { kdy: string; doc: AdminDoc };

export function neodeslaneZmeny(): Neodeslane | null {
  try {
    const raw = window.localStorage.getItem(KEY_NEODESLANO);
    if (!raw) return null;
    const p = JSON.parse(raw) as { kdy?: string; doc?: Partial<AdminDoc> };
    return p.doc ? { kdy: p.kdy ?? "", doc: normalize(p.doc) } : null;
  } catch {
    return null;
  }
}

export function zapomenoutNeodeslane() {
  try {
    window.localStorage.removeItem(KEY_NEODESLANO);
  } catch {
    /* nic */
  }
}

/**
 * Srovnání dat do tvaru, který databáze přijme.
 *
 * Schéma má kontroly (hotový úkol musí mít čas dokončení, opakování dává
 * smysl jen s termínem, zaplacená faktura musí mít datum). Ukládá se celý
 * dokument najednou v jedné transakci, takže JEDEN špatný řádek by shodil
 * uložení úplně všeho. Proto se to srovná tady, ne až v databázi.
 */
function srovnat(doc: AdminDoc): AdminDoc {
  const ted = new Date().toISOString();
  return {
    ...doc,
    tasks: doc.tasks.map((t) => {
      const done = Boolean(t.done);
      const repeat = t.repeat ?? "zadne";
      return {
        ...t,
        done,
        doneAt: done ? t.doneAt ?? ted : undefined,
        // Opakovat se dá jen úkol, který má termín.
        repeat: repeat !== "zadne" && !t.due ? "zadne" : repeat,
      };
    }),
    shopping: doc.shopping.map((s) => {
      const bought = Boolean(s.bought);
      return { ...s, bought, boughtAt: bought ? s.boughtAt ?? ted : undefined };
    }),
    invoices: doc.invoices.map((i) => {
      const paid = Boolean(i.paid);
      return { ...i, paid, paidAt: paid ? i.paidAt ?? ted.slice(0, 10) : undefined };
    }),
    fixedCosts: (doc.fixedCosts ?? []).map((f) => ({
      ...f,
      amount: Number.isFinite(f.amount) ? f.amount : 0,
      // Konec dřív než začátek by tiše znamenal náklad, který nikdy neplatí.
      to: f.to && f.to < f.from ? undefined : f.to || undefined,
    })),
  };
}

/** Doplní chybějící pole — ať starší záloha neshodí novější admin. */
export function normalize(input: Partial<AdminDoc>): AdminDoc {
  const base = emptyDoc();
  const orders = Array.isArray(input.orders) ? input.orders : [];
  const maxCislo = orders.reduce((m, o) => Math.max(m, o.cislo ?? 0), 0);
  return srovnat({
    version: 1,
    savedAt: input.savedAt ?? base.savedAt,
    nextOrderNumber: Math.max(input.nextOrderNumber ?? 1, maxCislo + 1),
    orders,
    customers: Array.isArray(input.customers) ? input.customers : [],
    stock: Array.isArray(input.stock) ? input.stock : [],
    takings: Array.isArray(input.takings) ? input.takings : [],
    invoices: Array.isArray(input.invoices) ? input.invoices : [],
    fixedCosts: Array.isArray(input.fixedCosts) ? input.fixedCosts : [],
    tasks: Array.isArray(input.tasks) ? input.tasks : [],
    shopping: Array.isArray(input.shopping) ? input.shopping : [],
    settings: { ...base.settings, ...(input.settings ?? {}) },
  });
}

/* ── Stav ──────────────────────────────────────────────────────────── */

function emit() {
  listeners.forEach((l) => l());
}

function patch(next: Partial<Snapshot>) {
  snapshot = { ...(snapshot ?? SERVER_SNAPSHOT), ...next };
  emit();
}

function docOf(s: Snapshot): AdminDoc {
  const { ready, mode, status, syncedAt, error, ...doc } = s;
  void ready;
  void mode;
  void status;
  void syncedAt;
  void error;
  return doc;
}

function getSnapshot(): Snapshot {
  if (!snapshot) {
    snapshot = { ...readLocal(), ready: false, mode: "local", status: "loading" };
  }
  return snapshot;
}

function getServerSnapshot(): Snapshot {
  return SERVER_SNAPSHOT;
}

/* ── Spojení se serverem ───────────────────────────────────────────── */

type LoadResponse = { mode: SyncMode; doc?: Partial<AdminDoc> & { revision?: number }; error?: string };

async function load(): Promise<void> {
  if (loading) return;
  loading = true;
  try {
    const res = await fetch("/api/admin/data", { cache: "no-store" });
    const data = (await res.json()) as LoadResponse;

    if (!res.ok) {
      // Databáze je nastavená, ale neodpovídá — jedeme z místní kopie.
      patch({ ready: true, mode: "cloud", status: "offline", error: data.error });
      return;
    }

    if (data.mode === "local") {
      patch({ ...readLocal(), ready: true, mode: "local", status: "ready" });
      return;
    }

    const server = normalize(data.doc ?? {});
    revision = typeof data.doc?.revision === "number" ? data.doc.revision : 0;

    // Neuložené úpravy z tohohle zařízení přehrát na čerstvá data.
    const merged = pending.reduce((d, fn) => fn(d), server);
    writeLocal(merged);
    patch({ ...merged, ready: true, mode: "cloud", status: "ready", error: undefined });
    if (pending.length) scheduleSave();
  } catch (e) {
    patch({
      ...readLocal(),
      ready: true,
      mode: "cloud",
      status: "offline",
      error: e instanceof Error ? e.message : undefined,
    });
  } finally {
    loading = false;
  }
}

function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    void save();
  }, SAVE_DEBOUNCE_MS);
}

async function save(attempt = 0): Promise<void> {
  const current = getSnapshot();
  if (current.mode !== "cloud" || saving || pending.length === 0) return;

  /*
   * Bez známé revize nezapisovat.
   *
   * Server ukládá celý dokument naráz a řádky, které v něm nejsou, maže.
   * Když se načtení nepovedlo (vypadlá wifi, spící databáze), držíme v ruce
   * jen místní kopii — a ta je na cizím telefonu prázdná. Uložit ji by
   * znamenalo smazat všechno, co v databázi je.
   *
   * Úpravy zůstanou v pending jako funkce. Jakmile se načtení povede,
   * load() je přehraje na čerstvá data a uloží. Nic se neztratí, jen to
   * chvíli počká.
   */
  if (revision === null) {
    odlozitNeodeslane(docOf(getSnapshot()));
    patch({ status: "offline", error: "Zatím nevím, co je v databázi, tak do ní nezapisuju. Změny mám schované a odešlu je, jakmile se spojím." });
    void load();
    return;
  }

  saving = true;
  const sending = pending.length;
  patch({ status: "saving" });

  try {
    const res = await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doc: docOf(getSnapshot()), revision }),
    });
    const data = (await res.json()) as { ok?: boolean; conflict?: boolean; revision?: number; error?: string };

    if (res.ok && data.ok) {
      revision = data.revision ?? revision;
      zapomenoutNeodeslane();
      // Úpravy, které přibyly během ukládání, čekají na další kolo.
      pending = pending.slice(sending);
      patch({
        status: pending.length ? "ready" : "ready",
        syncedAt: new Date().toISOString(),
        error: undefined,
      });
      saving = false;
      if (pending.length) scheduleSave();
      return;
    }

    if (data.conflict && attempt < 2) {
      // Někdo uložil dřív. Načíst jeho verzi a přehrát na ni naše úpravy.
      saving = false;
      patch({ status: "conflict" });
      await load();
      return;
    }

    odlozitNeodeslane(docOf(getSnapshot()));
    patch({ status: "error", error: data.error ?? "Uložení se nepovedlo." });
    saving = false;
  } catch (e) {
    // Bez sítě: data zůstávají v prohlížeči a odešlou se při dalším pokusu.
    odlozitNeodeslane(docOf(getSnapshot()));
    patch({ status: "offline", error: e instanceof Error ? e.message : undefined });
    saving = false;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);

  if (!started) {
    started = true;
    void load();
  }

  const onStorage = (e: StorageEvent) => {
    // Změna v jiné záložce téhož prohlížeče (režim local).
    if (e.key === KEY && getSnapshot().mode === "local") {
      patch({ ...readLocal() });
    }
  };
  const onOnline = () => {
    if (getSnapshot().mode === "cloud" && pending.length) void save();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener("online", onOnline);

  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("online", onOnline);
  };
}

function commit(fn: Updater) {
  const next = srovnat({ ...fn(docOf(getSnapshot())), savedAt: new Date().toISOString() });
  writeLocal(next);
  patch(next);

  if (getSnapshot().mode === "cloud") {
    pending.push(fn);
    scheduleSave();
  }
}

/* ── Veřejné rozhraní ──────────────────────────────────────────────── */

export function useAdmin() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const update = useCallback((fn: Updater) => commit(fn), []);
  const replace = useCallback((next: Partial<AdminDoc>) => {
    const doc = normalize(next);
    commit(() => doc);
  }, []);
  /** Ruční „ulož hned" — pro tlačítko v nastavení. */
  const flush = useCallback(() => save(), []);
  /** Znovu se pokusit spojit s databází a načíst data. */
  const reload = useCallback(() => load(), []);

  return {
    doc: s,
    ready: s.ready,
    mode: s.mode,
    status: s.status,
    syncedAt: s.syncedAt,
    error: s.error,
    /** Počet úprav, které ještě nejsou v databázi. */
    unsaved: pending.length,
    /**
     * Máme skutečně data z databáze? V režimu cloud po nepovedeném načtení
     * je na obrazovce jen místní kopie, která může být prázdná — a podle
     * toho se nesmí ani zálohovat, ani zapisovat.
     */
    loaded: s.mode === "local" || revision !== null,
    update,
    replace,
    flush,
    reload,
  };
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

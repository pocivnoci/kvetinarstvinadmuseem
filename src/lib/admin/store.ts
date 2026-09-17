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
let revision: number | null = null;
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

/** Doplní chybějící pole — ať starší záloha neshodí novější admin. */
export function normalize(input: Partial<AdminDoc>): AdminDoc {
  const base = emptyDoc();
  const orders = Array.isArray(input.orders) ? input.orders : [];
  const maxCislo = orders.reduce((m, o) => Math.max(m, o.cislo ?? 0), 0);
  return {
    version: 1,
    savedAt: input.savedAt ?? base.savedAt,
    nextOrderNumber: Math.max(input.nextOrderNumber ?? 1, maxCislo + 1),
    orders,
    customers: Array.isArray(input.customers) ? input.customers : [],
    stock: Array.isArray(input.stock) ? input.stock : [],
    takings: Array.isArray(input.takings) ? input.takings : [],
    invoices: Array.isArray(input.invoices) ? input.invoices : [],
    settings: { ...base.settings, ...(input.settings ?? {}) },
  };
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

    patch({ status: "error", error: data.error ?? "Uložení se nepovedlo." });
    saving = false;
  } catch (e) {
    // Bez sítě: data zůstávají v prohlížeči a odešlou se při dalším pokusu.
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
  const next = { ...fn(docOf(getSnapshot())), savedAt: new Date().toISOString() };
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

  return {
    doc: s,
    ready: s.ready,
    mode: s.mode,
    status: s.status,
    syncedAt: s.syncedAt,
    error: s.error,
    /** Počet úprav, které ještě nejsou v databázi. */
    unsaved: pending.length,
    update,
    replace,
    flush,
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

"use client";

import { useCallback, useSyncExternalStore } from "react";
import { emptyDoc, type AdminDoc } from "./types";

/**
 * Úložiště adminu — jeden JSON dokument v localStorage prohlížeče.
 *
 * Proč lokálně: web je statický bez databáze a tohle běží hned, bez klíčů
 * a bez měsíčních poplatků. Daň je, že data žijí jen v tom prohlížeči,
 * kde se zadala — proto je v Nastavení export/import zálohy.
 *
 * Až bude potřeba víc zařízení najednou, stačí vyměnit `read()`/`write()`
 * za volání API (Supabase, Vercel KV…). Zbytek adminu jde přes `useAdmin()`.
 */

const KEY = "knm-admin-v1";

const EMPTY: AdminDoc & { ready: false } = { ...emptyDoc(), ready: false };

type Snapshot = AdminDoc & { ready: boolean };

let snapshot: Snapshot | null = null;
const listeners = new Set<() => void>();

function read(): Snapshot {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...emptyDoc(), ready: true };
    const parsed = JSON.parse(raw) as Partial<AdminDoc>;
    return { ...normalize(parsed), ready: true };
  } catch {
    return { ...emptyDoc(), ready: true };
  }
}

function write(doc: AdminDoc) {
  window.localStorage.setItem(KEY, JSON.stringify(doc));
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

function getSnapshot(): Snapshot {
  if (!snapshot) snapshot = read();
  return snapshot;
}

function getServerSnapshot(): Snapshot {
  return EMPTY;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  // Změna v jiné záložce téhož prohlížeče — načíst znovu.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      snapshot = read();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function commit(next: AdminDoc) {
  const doc: AdminDoc = { ...next, savedAt: new Date().toISOString() };
  write(doc);
  snapshot = { ...doc, ready: true };
  listeners.forEach((l) => l());
}

export type Updater = (doc: AdminDoc) => AdminDoc;

/** Hook: aktuální data + funkce na jejich změnu. */
export function useAdmin() {
  const doc = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const update = useCallback((fn: Updater) => {
    commit(fn(getSnapshot()));
  }, []);
  const replace = useCallback((next: Partial<AdminDoc>) => {
    commit(normalize(next));
  }, []);
  return { doc, ready: doc.ready, update, replace };
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

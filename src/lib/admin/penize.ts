import { monthDays, shiftMonth, todayIso, ymOf } from "./format";
import type { AdminDoc, Invoice, Takings } from "./types";

/**
 * Výpočty kolem peněz. Jedno pravidlo, na kterém všechno stojí:
 *
 *   PŘÍJMY  = denní tržby z krámu + vydané faktury
 *   VÝDAJE  = přijaté faktury
 *   ZISK    = příjmy − výdaje
 *
 * Co jde zákazníkovi na fakturu, se nesmí zároveň zapsat do denní tržby —
 * jinak by se ten samý příjem počítal dvakrát. Na to upozorňuje i text
 * u formuláře tržby.
 *
 * Faktura patří do měsíce podle data vystavení, ne podle zaplacení.
 */

export function takingsTotal(t: Takings): number {
  return (t.cash ?? 0) + (t.card ?? 0) + (t.other ?? 0);
}

export function takingsOn(takings: Takings[], date: string): Takings | undefined {
  return takings.find((t) => t.date === date);
}

export function invoicesInMonth(invoices: Invoice[], ym: string): Invoice[] {
  return invoices.filter((i) => ymOf(i.issuedAt) === ym);
}

export type DayRow = {
  date: string;
  takings?: Takings;
  total: number;
};

export type MonthSummary = {
  ym: string;
  days: DayRow[];
  /** Tržby z krámu za měsíc. */
  shopRevenue: number;
  /** Vydané faktury za měsíc (fakturovaný příjem). */
  invoicedRevenue: number;
  income: number;
  expenses: number;
  profit: number;
  /** Marže v procentech z příjmů (0–1). */
  margin: number;
  /** Dny, kdy se něco prodalo. */
  openDays: number;
  avgPerOpenDay: number;
  bestDay?: DayRow;
  /** Výdaje po kategoriích, sestupně. */
  byCategory: { category: string; amount: number }[];
  /** Nezaplacené faktury vystavené v tomto měsíci. */
  unpaidIssued: number;
  unpaidReceived: number;
  /** Nejvyšší denní tržba — pro měřítko grafu. */
  maxDay: number;
};

export function monthSummary(doc: AdminDoc, ym: string): MonthSummary {
  const days: DayRow[] = monthDays(ym).map((date) => {
    const t = takingsOn(doc.takings, date);
    return { date, takings: t, total: t ? takingsTotal(t) : 0 };
  });

  const shopRevenue = days.reduce((s, d) => s + d.total, 0);
  const inMonth = invoicesInMonth(doc.invoices, ym);
  const issued = inMonth.filter((i) => i.kind === "vydana");
  const received = inMonth.filter((i) => i.kind === "prijata");

  const invoicedRevenue = issued.reduce((s, i) => s + i.amount, 0);
  const expenses = received.reduce((s, i) => s + i.amount, 0);
  const income = shopRevenue + invoicedRevenue;
  const profit = income - expenses;

  const withSales = days.filter((d) => d.total > 0);
  const bestDay = withSales.reduce<DayRow | undefined>(
    (best, d) => (!best || d.total > best.total ? d : best),
    undefined
  );

  const catMap = new Map<string, number>();
  for (const i of received) {
    const key = i.category?.trim() || "Nezařazeno";
    catMap.set(key, (catMap.get(key) ?? 0) + i.amount);
  }

  return {
    ym,
    days,
    shopRevenue,
    invoicedRevenue,
    income,
    expenses,
    profit,
    margin: income > 0 ? profit / income : 0,
    openDays: withSales.length,
    avgPerOpenDay: withSales.length ? shopRevenue / withSales.length : 0,
    bestDay,
    byCategory: [...catMap.entries()]
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount),
    unpaidIssued: issued.filter((i) => !i.paid).reduce((s, i) => s + i.amount, 0),
    unpaidReceived: received.filter((i) => !i.paid).reduce((s, i) => s + i.amount, 0),
    maxDay: days.reduce((m, d) => Math.max(m, d.total), 0),
  };
}

/** Příjmy (tržby + vydané faktury) v rozsahu dat včetně obou krajů. */
export function incomeBetween(doc: AdminDoc, from: string, to: string): number {
  const takings = doc.takings
    .filter((t) => t.date >= from && t.date <= to)
    .reduce((s, t) => s + takingsTotal(t), 0);
  const invoiced = doc.invoices
    .filter((i) => i.kind === "vydana" && i.issuedAt >= from && i.issuedAt <= to)
    .reduce((s, i) => s + i.amount, 0);
  return takings + invoiced;
}

export type Comparison = {
  /** Poměrná změna, např. 0,18 = o 18 % víc. */
  ratio: number;
  /** true = běžící období se srovnává se stejně dlouhým úsekem minula. */
  partial: boolean;
  /** Poslední zahrnutý den (u běžícího období dnešek). */
  throughDay: number;
};

/**
 * Srovnání s předchozím měsícem. U rozjetého měsíce se porovnává stejně
 * dlouhý úsek (1.–dnešek proti 1.–témuž dni minulého měsíce), jinak by
 * rozdělaný měsíc vždycky vypadal jako propad.
 */
export function monthOverMonth(doc: AdminDoc, ym: string, today = todayIso()): Comparison | undefined {
  const partial = ym === today.slice(0, 7);
  const day = partial ? Number(today.slice(8)) : 31;
  const prevYm = shiftMonth(ym, -1);
  const cut = (m: string) => `${m}-${String(day).padStart(2, "0")}`;

  const prev = incomeBetween(doc, `${prevYm}-01`, cut(prevYm));
  if (prev <= 0) return undefined;
  const cur = incomeBetween(doc, `${ym}-01`, cut(ym));
  return { ratio: (cur - prev) / prev, partial, throughDay: day };
}

/** Totéž pro rok: běžící rok se srovnává s týmž obdobím loni. */
export function yearOverYear(doc: AdminDoc, year: number, today = todayIso()): Comparison | undefined {
  const partial = year === Number(today.slice(0, 4));
  const md = partial ? today.slice(5) : "12-31";
  const prev = incomeBetween(doc, `${year - 1}-01-01`, `${year - 1}-${md}`);
  if (prev <= 0) return undefined;
  const cur = incomeBetween(doc, `${year}-01-01`, `${year}-${md}`);
  return { ratio: (cur - prev) / prev, partial, throughDay: Number(today.slice(8)) };
}

export type YearMonth = {
  ym: string;
  month: number;
  income: number;
  expenses: number;
  profit: number;
};

export type YearSummary = {
  year: number;
  months: YearMonth[];
  income: number;
  expenses: number;
  profit: number;
  max: number;
};

export function yearSummary(doc: AdminDoc, year: number): YearSummary {
  const months: YearMonth[] = Array.from({ length: 12 }, (_, i) => {
    const ym = `${year}-${String(i + 1).padStart(2, "0")}`;
    const s = monthSummary(doc, ym);
    return { ym, month: i + 1, income: s.income, expenses: s.expenses, profit: s.profit };
  });
  return {
    year,
    months,
    income: months.reduce((s, m) => s + m.income, 0),
    expenses: months.reduce((s, m) => s + m.expenses, 0),
    profit: months.reduce((s, m) => s + m.profit, 0),
    max: months.reduce((m, x) => Math.max(m, x.income, x.expenses), 0),
  };
}

/** Nezaplacené faktury po splatnosti — nejnaléhavější první. */
export function overdueInvoices(invoices: Invoice[], today = todayIso()): Invoice[] {
  return invoices
    .filter((i) => !i.paid && i.dueAt && i.dueAt < today)
    .sort((a, b) => (a.dueAt ?? "").localeCompare(b.dueAt ?? ""));
}

/** Nezaplacené faktury, kterým splatnost teprve běží. */
export function unpaidInvoices(invoices: Invoice[], today = todayIso()): Invoice[] {
  return invoices
    .filter((i) => !i.paid && (!i.dueAt || i.dueAt >= today))
    .sort((a, b) => (a.dueAt ?? "9999").localeCompare(b.dueAt ?? "9999"));
}

/* ── Export pro účetní ─────────────────────────────────────────────── */

/** Číslo s desetinnou čárkou, jak ho čeká český Excel. */
function num(n: number): string {
  return n.toFixed(2).replace(".", ",");
}

function csvCell(v: string | number): string {
  const s = String(v);
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function csv(rows: (string | number)[][]): string {
  // BOM, aby Excel poznal UTF-8; středník je český oddělovač sloupců.
  return "﻿" + rows.map((r) => r.map(csvCell).join(";")).join("\r\n");
}

export function takingsCsv(doc: AdminDoc, ym: string): string {
  const s = monthSummary(doc, ym);
  const rows: (string | number)[][] = [
    ["Datum", "Hotovost", "Karta", "Ostatní", "Celkem", "Poznámka"],
    ...s.days
      .filter((d) => d.takings)
      .map((d) => [
        d.date,
        num(d.takings!.cash),
        num(d.takings!.card),
        num(d.takings!.other),
        num(d.total),
        d.takings!.note ?? "",
      ]),
    ["Celkem", "", "", "", num(s.shopRevenue), ""],
  ];
  return csv(rows);
}

export function invoicesCsv(doc: AdminDoc, ym: string): string {
  const list = invoicesInMonth(doc.invoices, ym).sort((a, b) => a.issuedAt.localeCompare(b.issuedAt));
  const rows: (string | number)[][] = [
    ["Typ", "Číslo", "Protistrana", "Vystaveno", "Splatnost", "Částka", "Kategorie", "Zaplaceno", "Zaplaceno dne", "Poznámka"],
    ...list.map((i) => [
      i.kind === "vydana" ? "Vydaná" : "Přijatá",
      i.number,
      i.party,
      i.issuedAt,
      i.dueAt ?? "",
      num(i.amount),
      i.category ?? "",
      i.paid ? "ano" : "ne",
      i.paidAt ?? "",
      i.note ?? "",
    ]),
  ];
  return csv(rows);
}

/** Stažení souboru z prohlížeče. */
export function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

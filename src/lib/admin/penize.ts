import { addDays, monthDays, shiftMonth, startOfWeek, todayIso, ymOf } from "./format";
import { GOODS_CATEGORIES, type AdminDoc, type FixedCost, type Invoice, type OwnerPayout, type Takings } from "./types";

/**
 * Výpočty kolem peněz. Jedno pravidlo, na kterém všechno stojí:
 *
 *   PŘÍJMY  = denní tržby z krámu + vydané faktury
 *   VÝDAJE  = přijaté faktury + pravidelné měsíční náklady
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

/**
 * Pravidelné výdaje platné v daném měsíci.
 *
 * Porovnává se text „YYYY-MM", takže stačí obyčejné porovnání řetězců.
 * Prázdné „do" znamená, že náklad pořád běží.
 */
export function fixedCostsInMonth(fixed: FixedCost[], ym: string): FixedCost[] {
  return fixed.filter((f) => f.from <= ym && (!f.to || ym <= f.to));
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
  /** Výdaje celkem = přijaté faktury + pravidelné náklady. */
  expenses: number;
  /** Z toho přijaté faktury. */
  invoiceExpenses: number;
  /** Z toho pravidelné měsíční náklady. */
  fixedExpenses: number;
  /** Pravidelné náklady platné v tomto měsíci, pro rozpis. */
  fixedCosts: FixedCost[];
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
  const invoiceExpenses = received.reduce((s, i) => s + i.amount, 0);
  const fixed = fixedCostsInMonth(doc.fixedCosts ?? [], ym);
  const fixedExpenses = fixed.reduce((s, f) => s + f.amount, 0);
  const expenses = invoiceExpenses + fixedExpenses;
  const income = shopRevenue + invoicedRevenue;
  const profit = income - expenses;

  const withSales = days.filter((d) => d.total > 0);
  const bestDay = withSales.reduce<DayRow | undefined>(
    (best, d) => (!best || d.total > best.total ? d : best),
    undefined
  );

  // Rozpad výdajů počítá faktury i pravidelné náklady — jinak by nájem
  // v přehledu chyběl, přestože je to největší jednotlivá položka.
  const catMap = new Map<string, number>();
  for (const i of received) {
    const key = i.category?.trim() || "Nezařazeno";
    catMap.set(key, (catMap.get(key) ?? 0) + i.amount);
  }
  for (const f of fixed) {
    const key = f.category?.trim() || "Nezařazeno";
    catMap.set(key, (catMap.get(key) ?? 0) + f.amount);
  }

  return {
    ym,
    days,
    shopRevenue,
    invoicedRevenue,
    income,
    expenses,
    invoiceExpenses,
    fixedExpenses,
    fixedCosts: fixed,
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

/* ── Moje výplata a kolik smí jít na zboží ─────────────────────────── */

/** Přijatá faktura za zboží na prodej (květiny, doplňky, obaly). */
export function isGoods(i: Invoice): boolean {
  return i.kind === "prijata" && GOODS_CATEGORIES.includes(i.category?.trim() ?? "");
}

/** Z kolika posledních celých měsíců se bere typická tržba. */
const PLAN_MONTHS = 3;

export type PayPlan = {
  /** Měsíce, ze kterých je průměr („2026-06"…), od nejstaršího. */
  refMonths: string[];
  /** Typický měsíční příjem — průměr refMonths. */
  income: number;
  /** Pravidelné výdaje, které platí tento měsíc (nájem, energie…). */
  fixed: number;
  /** Průměr ostatních přijatých faktur (ne za zboží) v refMonths. */
  other: number;
  /** Cíl výplaty. */
  pay: number;
  /** Kolik Kč měsíčně zbývá na zboží, než by se sáhlo na výplatu. Může být záporné. */
  free: number;
  /** Podíl příjmů, který smí jít na zboží (0 až `cap`). */
  goodsShare: number;
  /**
   * Strop podílu zboží: 1 / přirážka. S přirážkou 2,5× se z koruny
   * nákupu stane nejvýš 2,50 Kč tržby, takže víc než 40 % tržby do
   * zboží dávat nemá smysl — zbytek by zůstal ležet nebo uvadl.
   */
  cap: number;
  /** Co zbude nad strop zboží (Kč měsíčně) — prostor pro vyšší výplatu nebo rezervu. */
  spare: number;
  /** Kolik měsíčně chybí, aby se výplata vešla i bez zboží. */
  shortfall: number;
  /** Kolik tržby skutečně šlo na zboží v refMonths — jen když jsou faktury za zboží zapsané. */
  actualGoodsShare?: number;
};

/**
 * Jak se dělí typická měsíční tržba: provoz, výplata, zboží.
 *
 * Nejdřív se odečte, co se platí tak jako tak (pravidelné výdaje
 * a ostatní faktury), pak výplata. Co zbyde, smí jít do velkoobchodu.
 * Výplata se tu počítá dřív než zboží schválně — obráceně to dopadá
 * tak, že se nakoupí, co je potřeba, a na výplatu zbyde, co zbyde.
 *
 * Typická tržba je průměr posledních celých měsíců s nějakým příjmem,
 * ne rozjetý měsíc — ten by na začátku měsíce vycházel skoro nulový.
 */
export function payPlan(doc: AdminDoc, today = todayIso()): PayPlan | undefined {
  const current = ymOf(today);
  const refMonths: string[] = [];
  for (let back = 1; back <= 12 && refMonths.length < PLAN_MONTHS; back++) {
    const ym = shiftMonth(current, -back);
    if (monthSummary(doc, ym).income > 0) refMonths.unshift(ym);
  }
  if (refMonths.length === 0) return undefined;

  const months = refMonths.map((ym) => monthSummary(doc, ym));
  const received = (ym: string) => invoicesInMonth(doc.invoices, ym).filter((i) => i.kind === "prijata");
  const avg = (f: (ym: string, i: number) => number) =>
    refMonths.reduce((sum, ym, i) => sum + f(ym, i), 0) / refMonths.length;

  const income = avg((_, i) => months[i].income);
  const goods = avg((ym) => received(ym).filter(isGoods).reduce((s, i) => s + i.amount, 0));
  const other = avg((ym) => received(ym).filter((i) => !isGoods(i)).reduce((s, i) => s + i.amount, 0));
  const fixed = fixedCostsInMonth(doc.fixedCosts ?? [], current).reduce((s, f) => s + f.amount, 0);
  const pay = Math.max(0, doc.settings.ownerPay || 0);
  const markup = doc.settings.defaultMarkup > 1 ? doc.settings.defaultMarkup : 2.5;
  const cap = 1 / markup;

  const free = income - fixed - other - pay;
  const goodsShare = Math.min(cap, Math.max(0, free / income));

  return {
    refMonths,
    income,
    fixed,
    other,
    pay,
    free,
    goodsShare,
    cap,
    spare: Math.max(0, free - cap * income),
    shortfall: Math.max(0, -free),
    actualGoodsShare: goods > 0 ? goods / income : undefined,
  };
}

/** Z kolika posledních týdnů se bere průměrná týdenní tržba. */
const BUDGET_WEEKS = 4;

export type WeekBudget = {
  /** Pondělí a neděle tohoto týdne. */
  from: string;
  to: string;
  /** Průměrná týdenní tržba za poslední týdny, kdy bylo otevřeno. */
  avgWeekIncome: number;
  /** Z kolika týdnů je průměr (týdny bez tržby — dovolená — se nepočítají). */
  weeks: number;
  /** Kolik smí tento týden jít na zboží. */
  budget: number;
  /** Faktury za zboží vystavené tento týden. */
  invoices: Invoice[];
  spent: number;
  /** Kolik ještě zbývá. Záporné = přečerpáno. */
  left: number;
};

/**
 * Kolik smí tento týden (po–ne) jít do velkoobchodu.
 *
 * Týden proto, že se na burzu jezdí několikrát týdně a měsíční číslo
 * se v hlavě špatně dělí. Základ je průměrný týden za poslední čtyři,
 * ne jen ten minulý — jeden slabý nebo silný týden by limit rozhoupal.
 */
export function weekBudget(doc: AdminDoc, plan: PayPlan, today = todayIso()): WeekBudget {
  const from = startOfWeek(today);
  const to = addDays(from, 6);

  const weekly = Array.from({ length: BUDGET_WEEKS }, (_, i) => {
    const start = addDays(from, -7 * (i + 1));
    return incomeBetween(doc, start, addDays(start, 6));
  }).filter((x) => x > 0);
  const avgWeekIncome = weekly.length ? weekly.reduce((s, x) => s + x, 0) / weekly.length : 0;

  const invoices = doc.invoices
    .filter((i) => isGoods(i) && i.issuedAt >= from && i.issuedAt <= to)
    .sort((a, b) => a.issuedAt.localeCompare(b.issuedAt));
  const spent = invoices.reduce((s, i) => s + i.amount, 0);
  const budget = avgWeekIncome * plan.goodsShare;

  return { from, to, avgWeekIncome, weeks: weekly.length, budget, invoices, spent, left: budget - spent };
}

/** Výplaty za daný měsíc (podle toho, za který měsíc jsou, ne kdy odešly). */
export function payoutsFor(payouts: OwnerPayout[], ym: string): OwnerPayout[] {
  return payouts.filter((p) => p.forMonth === ym);
}

export type PayMonth = {
  ym: string;
  /** Zisk měsíce — nejvýš tolik si šlo vyplatit. */
  profit: number;
  /** Kolik si majitelka za ten měsíc opravdu vyplatila. */
  paid: number;
  /** Byly v měsíci zapsané nějaké výdaje? Bez nich je zisk nadsazený. */
  hasExpenses: boolean;
  hasIncome: boolean;
};

/** Výplata po měsících roku — kolik zbylo a kolik se opravdu vyplatilo. */
export function payYear(doc: AdminDoc, year: number): PayMonth[] {
  return Array.from({ length: 12 }, (_, i) => {
    const ym = `${year}-${String(i + 1).padStart(2, "0")}`;
    const s = monthSummary(doc, ym);
    return {
      ym,
      profit: s.profit,
      paid: payoutsFor(doc.payouts ?? [], ym).reduce((sum, p) => sum + p.amount, 0),
      hasExpenses: s.expenses > 0,
      hasIncome: s.income > 0,
    };
  });
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

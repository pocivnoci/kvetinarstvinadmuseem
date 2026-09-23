/**
 * Datový model adminu. Všechno je obyčejný JSON — ať se dá zálohovat
 * jedním souborem a časem přesunout do databáze bez převodů.
 */

export type OrderStatus =
  | "nova"
  | "potvrzena"
  | "v-priprave"
  | "hotova"
  | "predana"
  | "zrusena";

export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: string }> = {
  nova: { label: "Nová", tone: "gilt" },
  potvrzena: { label: "Potvrzená", tone: "dusk" },
  "v-priprave": { label: "V přípravě", tone: "terracotta" },
  hotova: { label: "Hotová", tone: "sage" },
  predana: { label: "Předaná", tone: "stone" },
  zrusena: { label: "Zrušená", tone: "noir" },
};

export const ORDER_STATUS_ORDER: OrderStatus[] = [
  "nova",
  "potvrzena",
  "v-priprave",
  "hotova",
  "predana",
  "zrusena",
];

export type Fulfillment = "vyzvednuti" | "rozvoz";

export const OCCASIONS = [
  "Narozeniny",
  "Svátek",
  "Výročí",
  "Svatba",
  "Pohřeb / smuteční",
  "Poděkování",
  "Omluva",
  "Promoce",
  "Narození miminka",
  "Firemní / event",
  "Jen tak pro radost",
  "Jiné",
] as const;

export type Order = {
  id: string;
  /** Pořadové číslo objednávky, roste o 1. */
  cislo: number;
  createdAt: string;
  updatedAt: string;

  customerName: string;
  customerPhone: string;
  customerEmail?: string;

  fulfillment: Fulfillment;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM, nepovinné */
  time?: string;
  address?: string;
  recipientName?: string;
  recipientPhone?: string;

  occasion: string;
  /** Co má v kytici být — květiny, barvy, styl, velikost. */
  description: string;
  price?: number;
  deposit?: number;
  paid: boolean;

  /** Text na kartičku k pytici. */
  cardMessage?: string;
  /** Interní poznámka (nezobrazuje se na kartičce). */
  note?: string;

  status: OrderStatus;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  /** Kde bydlí / kam se vozí. */
  address?: string;
  /** Oblíbené květiny, barvy, čeho se vyvarovat, alergie… */
  note?: string;
  /** MM-DD */
  birthday?: string;
  /** Jméno pro svátek podle kalendáře (např. „Jana“). */
  namedayName?: string;
  createdAt: string;
};

export type StockCategory = "rezane" | "hrnkove" | "susene" | "doplnky";

export const STOCK_CATEGORY: Record<StockCategory, string> = {
  rezane: "Řezané",
  hrnkove: "Hrnkové",
  susene: "Sušené",
  doplnky: "Doplňky",
};

export type StockItem = {
  id: string;
  name: string;
  category: StockCategory;
  qty: number;
  unit: string;
  /**
   * Nákupní cena za jednotku bez DPH, tak jak je na faktuře z velkoobchodu.
   * DPH k ní připočte kalkulačka podle `Settings.purchaseVatRate`.
   */
  costPrice: number;
  /** Prodejní cena za jednotku (pro kalkulaci kytice). */
  salePrice?: number;
  /** YYYY-MM-DD */
  receivedAt: string;
  /** Kolik dní vydrží od naskladnění (řezané). 0 = nesleduje se. */
  shelfLifeDays: number;
  supplier?: string;
  note?: string;
};

/** Denní tržba z krámu — jeden záznam na den. */
export type Takings = {
  id: string;
  /** YYYY-MM-DD. V dokumentu je na každé datum nejvýš jeden záznam. */
  date: string;
  /** Hotovost v kase. */
  cash: number;
  /** Platby kartou. */
  card: number;
  /** Ostatní — Wolt, převodem, poukazy. */
  other: number;
  note?: string;
};

export type InvoiceKind = "prijata" | "vydana";

export const INVOICE_KIND: Record<InvoiceKind, { label: string; short: string }> = {
  prijata: { label: "Přijatá (výdaj)", short: "Přijatá" },
  vydana: { label: "Vydaná (příjem)", short: "Vydaná" },
};

/** Kategorie výdajů — sčítají se v měsíčním přehledu. */
export const INVOICE_CATEGORIES = [
  "Nákup květin",
  "Nákup zboží a doplňků",
  "Obaly a stuhy",
  "Nájem",
  "Energie",
  "Doprava a rozvoz",
  "Marketing",
  "Služby a účetnictví",
  "Ostatní",
] as const;

/**
 * Kategorie výdajů, které jsou zboží na prodej — z nich se počítá, kolik
 * smí jít do velkoobchodu. Nájem, energie a služby se platí tak jako tak;
 * u zboží se dá rozhodnout, kolik ho koupit.
 */
export const GOODS_CATEGORIES: readonly string[] = [
  "Nákup květin",
  "Nákup zboží a doplňků",
  "Obaly a stuhy",
];

export type Invoice = {
  id: string;
  kind: InvoiceKind;
  /** Číslo faktury nebo variabilní symbol. */
  number: string;
  /** Dodavatel (u přijaté) nebo odběratel (u vydané). */
  party: string;
  /** YYYY-MM-DD — datum vystavení, podle něj se řadí do měsíce. */
  issuedAt: string;
  /** YYYY-MM-DD — splatnost. */
  dueAt?: string;
  /** Částka celkem včetně DPH. */
  amount: number;
  category?: string;
  paid: boolean;
  /** YYYY-MM-DD — kdy se zaplatila. */
  paidAt?: string;
  note?: string;
};

/* ── Úkoly ──────────────────────────────────────────────────────────── */

export type TaskRepeat = "zadne" | "denne" | "tydne" | "mesicne";

export const TASK_REPEAT: Record<TaskRepeat, string> = {
  zadne: "Jednorázově",
  denne: "Každý den",
  tydne: "Každý týden",
  mesicne: "Každý měsíc",
};

export type Task = {
  id: string;
  title: string;
  note?: string;
  /** YYYY-MM-DD — do kdy. Bez data = kdykoliv. */
  due?: string;
  done: boolean;
  /** ISO — kdy se odškrtl. */
  doneAt?: string;
  /** Opakovaný úkol se po odškrtnutí založí znovu na další termín. */
  repeat: TaskRepeat;
  createdAt: string;
};

/* ── Nákupní seznam ─────────────────────────────────────────────────── */

export type ShoppingItem = {
  id: string;
  name: string;
  /** Kolik koupit. Nepovinné — na burze se často kupuje „co bude". */
  qty?: number;
  unit?: string;
  /** U koho. Seznam se podle toho na nákupu seskupuje. */
  supplier?: string;
  note?: string;
  bought: boolean;
  boughtAt?: string;
  createdAt: string;
};

export type Settings = {
  /** Násobek nákupní ceny pro kalkulačku (např. 2.5). */
  defaultMarkup: number;
  /** Sazba DPH na prodej v %. Neplátce DPH má 0 — k prodejní ceně se nic nepřidává. */
  vatRate: number;
  /**
   * Sazba DPH v nákupu v %. Velkoobchod fakturuje bez DPH a krám jako
   * neplátce si ho neodečte, takže je to skutečný náklad: kalkulačka ho
   * k zadaným nákupním cenám připočte sama. 0 = ceny se zadávají už s DPH.
   */
  purchaseVatRate: number;
  /** Paušál za práci floristky v Kč. */
  laborFee: number;
  /** Paušál za obal/stuhu v Kč. */
  wrapFee: number;
  /** Zaokrouhlení výsledné ceny (na kolik Kč). */
  roundTo: number;
  /**
   * Kolik si majitelka chce měsíčně vyplatit (Kč). 0 = nenastaveno.
   * Z toho se počítá, kolik smí jít na zboží, aby na výplatu zbylo.
   */
  ownerPay: number;
};

/**
 * Pravidelný měsíční výdaj — nájem, energie, internet, účetní.
 *
 * Zadá se jednou a počítá se do každého měsíce sám, dokud platí. Bez
 * toho ukazoval admin zisk rovný tržbám a marži 100 %, protože nájem na
 * Vinohradské ani energie nemá kam zapsat — a to jsou desetitisíce
 * měsíčně, tedy víc než všechny faktury dohromady.
 */
export type FixedCost = {
  id: string;
  /** Co to je — „Nájem Vinohradská 6". */
  name: string;
  /** Kolik měsíčně. */
  amount: number;
  /** Kategorie ze stejného výčtu jako u faktur, ať sedí rozpad výdajů. */
  category: string;
  /** YYYY-MM — od kterého měsíce se počítá. */
  from: string;
  /** YYYY-MM — poslední měsíc, kdy se počítá. Prázdné = pořád běží. */
  to?: string;
  note?: string;
};

/**
 * Výplata sobě — peníze, které si majitelka převedla z krámu pro sebe.
 *
 * Není to výdaj: zisk se tím nemění. Výplata se platí ze zisku, a když
 * se nezapisuje, rozpustí se v další faktuře z velkoobchodu a na konci
 * měsíce není vidět, kam zmizela.
 */
export type OwnerPayout = {
  id: string;
  /** YYYY-MM-DD — kdy se peníze převedly. */
  date: string;
  /** YYYY-MM — za který měsíc je to výplata (za září se často platí až 2. října). */
  forMonth: string;
  amount: number;
  note?: string;
};

export type AdminDoc = {
  version: 1;
  /** Kdy se naposledy uložilo. */
  savedAt: string;
  nextOrderNumber: number;
  orders: Order[];
  customers: Customer[];
  stock: StockItem[];
  takings: Takings[];
  invoices: Invoice[];
  fixedCosts: FixedCost[];
  payouts: OwnerPayout[];
  tasks: Task[];
  shopping: ShoppingItem[];
  settings: Settings;
};

export const DEFAULT_SETTINGS: Settings = {
  defaultMarkup: 2.5,
  vatRate: 12,
  purchaseVatRate: 21,
  laborFee: 150,
  wrapFee: 60,
  roundTo: 10,
  ownerPay: 0,
};

export function emptyDoc(): AdminDoc {
  return {
    version: 1,
    savedAt: new Date(0).toISOString(),
    nextOrderNumber: 1,
    orders: [],
    customers: [],
    stock: [],
    takings: [],
    invoices: [],
    fixedCosts: [],
    payouts: [],
    tasks: [],
    shopping: [],
    settings: { ...DEFAULT_SETTINGS },
  };
}

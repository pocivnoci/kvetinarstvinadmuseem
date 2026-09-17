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
  /** Nákupní cena za jednotku (bez DPH nebo s — dle nastavení). */
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

export type Settings = {
  /** Násobek nákupní ceny pro kalkulačku (např. 2.5). */
  defaultMarkup: number;
  /** Sazba DPH v %. Řezané květiny jsou ve snížené sazbě. */
  vatRate: number;
  /** Paušál za práci floristky v Kč. */
  laborFee: number;
  /** Paušál za obal/stuhu v Kč. */
  wrapFee: number;
  /** Zaokrouhlení výsledné ceny (na kolik Kč). */
  roundTo: number;
};

export type AdminDoc = {
  version: 1;
  /** Kdy se naposledy uložilo. */
  savedAt: string;
  nextOrderNumber: number;
  orders: Order[];
  customers: Customer[];
  stock: StockItem[];
  settings: Settings;
};

export const DEFAULT_SETTINGS: Settings = {
  defaultMarkup: 2.5,
  vatRate: 12,
  laborFee: 150,
  wrapFee: 60,
  roundTo: 10,
};

export function emptyDoc(): AdminDoc {
  return {
    version: 1,
    savedAt: new Date(0).toISOString(),
    nextOrderNumber: 1,
    orders: [],
    customers: [],
    stock: [],
    settings: { ...DEFAULT_SETTINGS },
  };
}

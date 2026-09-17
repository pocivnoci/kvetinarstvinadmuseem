import { addDays, daysBetween, normalizePhone, todayIso } from "./format";
import { svatekJmena } from "./svatky";
import type { AdminDoc, Customer, Order, OrderStatus, StockItem } from "./types";

/** Objednávka, o kterou se ještě má někdo starat. */
export function isActive(status: OrderStatus): boolean {
  return status !== "predana" && status !== "zrusena";
}

export function sortByDateTime(orders: Order[]): Order[] {
  return [...orders].sort((a, b) =>
    a.date === b.date ? (a.time ?? "99").localeCompare(b.time ?? "99") : a.date.localeCompare(b.date)
  );
}

export function ordersOn(orders: Order[], iso: string): Order[] {
  return sortByDateTime(orders.filter((o) => o.date === iso && o.status !== "zrusena"));
}

export function ordersBetween(orders: Order[], from: string, to: string): Order[] {
  return sortByDateTime(orders.filter((o) => o.date >= from && o.date <= to && o.status !== "zrusena"));
}

export type StockAlert = { item: StockItem; expiresOn: string; daysLeft: number };

/** Řezané zboží, kterému dochází trvanlivost (dnes/zítra) nebo už prošlo. */
export function stockAlerts(stock: StockItem[], today = todayIso()): StockAlert[] {
  return stock
    .filter((s) => s.shelfLifeDays > 0 && s.qty > 0)
    .map((item) => {
      const expiresOn = addDays(item.receivedAt, item.shelfLifeDays);
      return { item, expiresOn, daysLeft: daysBetween(today, expiresOn) };
    })
    .filter((a) => a.daysLeft <= 1)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

export type CustomerEvent = {
  customer: Customer;
  date: string;
  kind: "svatek" | "narozeniny";
  label: string;
};

function nextOccurrence(mmdd: string, today: string): string {
  const year = Number(today.slice(0, 4));
  let candidate = `${year}-${mmdd}`;
  if (candidate < today) candidate = `${year + 1}-${mmdd}`;
  return candidate;
}

/** Svátky a narozeniny zákazníků v příštích N dnech — příležitost připomenout se. */
export function customerEvents(customers: Customer[], today = todayIso(), days = 14): CustomerEvent[] {
  const limit = addDays(today, days);
  const out: CustomerEvent[] = [];
  for (const c of customers) {
    if (c.namedayName) {
      const s = svatekJmena(c.namedayName);
      if (s) {
        const date = nextOccurrence(s.key, today);
        if (date <= limit) out.push({ customer: c, date, kind: "svatek", label: `svátek (${c.namedayName})` });
      }
    }
    if (c.birthday && /^\d{2}-\d{2}$/.test(c.birthday)) {
      const date = nextOccurrence(c.birthday, today);
      if (date <= limit) out.push({ customer: c, date, kind: "narozeniny", label: "narozeniny" });
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

export function monthStats(orders: Order[], today = todayIso()) {
  const ym = today.slice(0, 7);
  const inMonth = orders.filter((o) => o.date.startsWith(ym));
  const count = inMonth.filter((o) => o.status !== "zrusena").length;
  const revenue = inMonth
    .filter((o) => o.status === "predana")
    .reduce((s, o) => s + (o.price ?? 0), 0);
  const open = orders.filter((o) => isActive(o.status)).length;
  const unpaid = orders.filter((o) => isActive(o.status) && !o.paid && (o.price ?? 0) > 0).length;
  return { count, revenue, open, unpaid };
}

export function findCustomerByPhone(customers: Customer[], phone: string): Customer | undefined {
  const p = normalizePhone(phone);
  if (!p) return undefined;
  return customers.find((c) => normalizePhone(c.phone) === p);
}

export function customerOrders(orders: Order[], customer: Customer): Order[] {
  const p = normalizePhone(customer.phone);
  return sortByDateTime(orders.filter((o) => normalizePhone(o.customerPhone) === p)).reverse();
}

/** Po uložení objednávky založí zákazníka, pokud jeho telefon ještě neznáme. */
export function upsertCustomerFromOrder(doc: AdminDoc, order: Order, newId: () => string): AdminDoc {
  if (!order.customerPhone.trim() || !order.customerName.trim()) return doc;
  const existing = findCustomerByPhone(doc.customers, order.customerPhone);
  if (existing) {
    // Doplnit e-mail/adresu, když je zákazník zadal poprvé.
    const patched: Customer = {
      ...existing,
      email: existing.email || order.customerEmail || existing.email,
    };
    return { ...doc, customers: doc.customers.map((c) => (c.id === existing.id ? patched : c)) };
  }
  const c: Customer = {
    id: newId(),
    name: order.customerName.trim(),
    phone: order.customerPhone.trim(),
    email: order.customerEmail,
    createdAt: new Date().toISOString(),
  };
  return { ...doc, customers: [...doc.customers, c] };
}

export function stockValue(stock: StockItem[]): number {
  return stock.reduce((s, i) => s + i.qty * i.costPrice, 0);
}

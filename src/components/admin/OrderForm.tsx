"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useAdmin, newId, nowIso } from "@/lib/admin/store";
import { formatPhone, parseNumber, todayIso } from "@/lib/admin/format";
import { findCustomerByPhone, upsertCustomerFromOrder } from "@/lib/admin/select";
import {
  OCCASIONS,
  ORDER_STATUS,
  ORDER_STATUS_ORDER,
  type Fulfillment,
  type Order,
  type OrderStatus,
} from "@/lib/admin/types";
import { Field } from "./ui";

type Draft = Omit<Order, "id" | "cislo" | "createdAt" | "updatedAt" | "price" | "deposit"> & {
  price: string;
  deposit: string;
};

function toDraft(o?: Partial<Order>, prefill?: Partial<Order>): Draft {
  const src = { ...prefill, ...o };
  return {
    customerName: src.customerName ?? "",
    customerPhone: src.customerPhone ?? "",
    customerEmail: src.customerEmail ?? "",
    fulfillment: src.fulfillment ?? "vyzvednuti",
    date: src.date ?? todayIso(),
    time: src.time ?? "",
    address: src.address ?? "",
    recipientName: src.recipientName ?? "",
    recipientPhone: src.recipientPhone ?? "",
    occasion: src.occasion ?? OCCASIONS[0],
    description: src.description ?? "",
    price: src.price !== undefined ? String(src.price) : "",
    deposit: src.deposit !== undefined ? String(src.deposit) : "",
    paid: src.paid ?? false,
    cardMessage: src.cardMessage ?? "",
    note: src.note ?? "",
    status: src.status ?? "nova",
  };
}

export function OrderForm({
  order,
  prefill,
  onSaved,
}: {
  order?: Order;
  /** Předvyplnění (z kalkulačky, z kalendáře). */
  prefill?: Partial<Order>;
  onSaved: (o: Order) => void;
}) {
  const { doc, update } = useAdmin();
  const [d, setD] = useState<Draft>(() => toDraft(order, prefill));
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));

  const knownCustomer = useMemo(
    () => findCustomerByPhone(doc.customers, d.customerPhone),
    [doc.customers, d.customerPhone]
  );

  function pickCustomer(name: string) {
    set("customerName", name);
    const c = doc.customers.find((c) => c.name === name);
    if (c) {
      set("customerPhone", c.phone);
      if (c.email) set("customerEmail", c.email);
      if (c.address && d.fulfillment === "rozvoz" && !d.address) set("address", c.address);
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const now = nowIso();
    const base: Order = {
      id: order?.id ?? newId(),
      cislo: order?.cislo ?? 0,
      createdAt: order?.createdAt ?? now,
      updatedAt: now,
      customerName: d.customerName.trim(),
      customerPhone: d.customerPhone.trim(),
      customerEmail: d.customerEmail?.trim() || undefined,
      fulfillment: d.fulfillment,
      date: d.date,
      time: d.time || undefined,
      address: d.fulfillment === "rozvoz" ? d.address?.trim() || undefined : undefined,
      recipientName: d.recipientName?.trim() || undefined,
      recipientPhone: d.recipientPhone?.trim() || undefined,
      occasion: d.occasion,
      description: d.description.trim(),
      price: parseNumber(d.price),
      deposit: parseNumber(d.deposit),
      paid: d.paid,
      cardMessage: d.cardMessage?.trim() || undefined,
      note: d.note?.trim() || undefined,
      status: d.status,
    };

    let saved = base;
    update((doc) => {
      if (order) {
        const next = { ...doc, orders: doc.orders.map((o) => (o.id === order.id ? base : o)) };
        return upsertCustomerFromOrder(next, base, newId);
      }
      saved = { ...base, cislo: doc.nextOrderNumber };
      const next = {
        ...doc,
        nextOrderNumber: doc.nextOrderNumber + 1,
        orders: [...doc.orders, saved],
      };
      return upsertCustomerFromOrder(next, saved, newId);
    });
    onSaved(saved);
  }

  return (
    <form onSubmit={submit} className="card">
      <div className="form-grid">
        <Field label="Zákazník (jméno)">
          <input
            type="text"
            list="knm-customers"
            required
            value={d.customerName}
            onChange={(e) => pickCustomer(e.target.value)}
            placeholder="Jana Nováková"
          />
          <datalist id="knm-customers">
            {doc.customers.map((c) => (
              <option key={c.id} value={c.name}>{formatPhone(c.phone)}</option>
            ))}
          </datalist>
        </Field>
        <Field
          label="Telefon"
          hint={
            knownCustomer
              ? `Známý zákazník${knownCustomer.note ? ` — ${knownCustomer.note}` : ""}`
              : "Nový zákazník se po uložení založí sám."
          }
        >
          <input
            type="tel"
            required
            value={d.customerPhone}
            onChange={(e) => set("customerPhone", e.target.value)}
            placeholder="777 123 456"
          />
        </Field>
        <Field label="E-mail (nepovinné)">
          <input type="email" value={d.customerEmail} onChange={(e) => set("customerEmail", e.target.value)} />
        </Field>
        <Field label="Příležitost">
          <select value={d.occasion} onChange={(e) => set("occasion", e.target.value)}>
            {OCCASIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="form-section">
        <h3>Kdy a kam</h3>
        <div className="form-grid">
          <div className="field">
            <span className="field-label">Způsob předání</span>
            <div className="seg" role="group">
              {(["vyzvednuti", "rozvoz"] as Fulfillment[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={d.fulfillment === f}
                  onClick={() => set("fulfillment", f)}
                >
                  {f === "vyzvednuti" ? "Vyzvednutí v krámu" : "Rozvoz"}
                </button>
              ))}
            </div>
          </div>
          <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <Field label="Datum">
              <input type="date" required value={d.date} onChange={(e) => set("date", e.target.value)} />
            </Field>
            <Field label="Čas">
              <input type="time" value={d.time} onChange={(e) => set("time", e.target.value)} />
            </Field>
          </div>
          {d.fulfillment === "rozvoz" && (
            <>
              <Field label="Adresa doručení" className="span-2">
                <input
                  type="text"
                  required
                  value={d.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Ulice a číslo, patro, zvonek…"
                />
              </Field>
              <Field label="Příjemce (pokud je jiný než zákazník)">
                <input type="text" value={d.recipientName} onChange={(e) => set("recipientName", e.target.value)} />
              </Field>
              <Field label="Telefon na příjemce">
                <input type="tel" value={d.recipientPhone} onChange={(e) => set("recipientPhone", e.target.value)} />
              </Field>
            </>
          )}
        </div>
      </div>

      <div className="form-section">
        <h3>Kytice</h3>
        <div className="form-grid">
          <Field
            label="Co má v kytici být"
            className="span-2"
            hint="Květiny, barvy, velikost, styl, čeho se vyvarovat. Tohle se tiskne na průvodku."
          >
            <textarea
              required
              value={d.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Kulatá kytice v pastelových tónech, pivoňky a eustoma, bez lilií (alergie). Střední velikost, kraftový papír."
            />
          </Field>
          <Field label="Text na kartičku (nepovinné)" className="span-2" hint="Tiskne se na přáníčko k pytici.">
            <textarea
              value={d.cardMessage}
              onChange={(e) => set("cardMessage", e.target.value)}
              placeholder="Všechno nejlepší, mami! S láskou Petra a děti."
              style={{ minHeight: "4rem", fontStyle: "italic" }}
            />
          </Field>
          <Field label="Interní poznámka" className="span-2" hint="Jen pro vás — nikam se netiskne.">
            <input type="text" value={d.note} onChange={(e) => set("note", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="form-section">
        <h3>Platba a stav</h3>
        <div className="form-grid">
          <Field label="Cena (Kč)">
            <input type="text" inputMode="decimal" value={d.price} onChange={(e) => set("price", e.target.value)} placeholder="1 200" />
          </Field>
          <Field label="Záloha (Kč)">
            <input type="text" inputMode="decimal" value={d.deposit} onChange={(e) => set("deposit", e.target.value)} />
          </Field>
          <label className="check">
            <input type="checkbox" checked={d.paid} onChange={(e) => set("paid", e.target.checked)} />
            Zaplaceno v plné výši
          </label>
          <Field label="Stav">
            <select value={d.status} onChange={(e) => set("status", e.target.value as OrderStatus)}>
              {ORDER_STATUS_ORDER.map((s) => (
                <option key={s} value={s}>{ORDER_STATUS[s].label}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <div className="row" style={{ marginTop: "1.25rem", justifyContent: "flex-end" }}>
        <button type="submit" className="btn btn-primary">
          {order ? "Uložit změny" : "Založit objednávku"}
        </button>
      </div>
    </form>
  );
}

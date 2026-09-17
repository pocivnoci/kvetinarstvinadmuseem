"use client";

import { useState, type FormEvent } from "react";
import { newId, nowIso, useAdmin } from "@/lib/admin/store";
import { hledejSvatek } from "@/lib/admin/svatky";
import type { Customer } from "@/lib/admin/types";
import { Field } from "./ui";

type Draft = Omit<Customer, "id" | "createdAt" | "birthday"> & { birthDay: string; birthMonth: string };

function toDraft(c?: Customer): Draft {
  const [m, d] = (c?.birthday ?? "").split("-");
  return {
    name: c?.name ?? "",
    phone: c?.phone ?? "",
    email: c?.email ?? "",
    address: c?.address ?? "",
    note: c?.note ?? "",
    namedayName: c?.namedayName ?? "",
    birthDay: d ? String(Number(d)) : "",
    birthMonth: m ? String(Number(m)) : "",
  };
}

const MONTHS = ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince"];

export function CustomerForm({
  customer,
  onSaved,
  onCancel,
}: {
  customer?: Customer;
  onSaved: (c: Customer) => void;
  onCancel?: () => void;
}) {
  const { update } = useAdmin();
  const [d, setD] = useState<Draft>(() => toDraft(customer));
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));

  const svatekHint = d.namedayName ? hledejSvatek(d.namedayName).slice(0, 1)[0] : undefined;

  function submit(e: FormEvent) {
    e.preventDefault();
    const bd =
      d.birthDay && d.birthMonth
        ? `${String(Number(d.birthMonth)).padStart(2, "0")}-${String(Number(d.birthDay)).padStart(2, "0")}`
        : undefined;
    const c: Customer = {
      id: customer?.id ?? newId(),
      createdAt: customer?.createdAt ?? nowIso(),
      name: d.name.trim(),
      phone: d.phone.trim(),
      email: d.email?.trim() || undefined,
      address: d.address?.trim() || undefined,
      note: d.note?.trim() || undefined,
      namedayName: d.namedayName?.trim() || undefined,
      birthday: bd,
    };
    update((doc) => ({
      ...doc,
      customers: customer
        ? doc.customers.map((x) => (x.id === c.id ? c : x))
        : [...doc.customers, c],
    }));
    onSaved(c);
  }

  return (
    <form onSubmit={submit} className="card">
      <div className="form-grid">
        <Field label="Jméno">
          <input type="text" required value={d.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Telefon">
          <input type="tel" required value={d.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="E-mail">
          <input type="email" value={d.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Adresa (pro rozvoz)">
          <input type="text" value={d.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <Field
          label="Jméno pro svátek"
          hint={
            svatekHint
              ? `Svátek ${svatekHint.day}. ${MONTHS[svatekHint.month - 1]} (${svatekHint.text})`
              : "Podle kalendáře se vám připomene 14 dní předem."
          }
        >
          <input type="text" value={d.namedayName} onChange={(e) => set("namedayName", e.target.value)} placeholder="Jana" />
        </Field>
        <div className="field">
          <span className="field-label">Narozeniny</span>
          <div className="row" style={{ flexWrap: "nowrap" }}>
            <input
              type="number"
              min={1}
              max={31}
              placeholder="den"
              value={d.birthDay}
              onChange={(e) => set("birthDay", e.target.value)}
              style={{ width: "5rem" }}
            />
            <select value={d.birthMonth} onChange={(e) => set("birthMonth", e.target.value)}>
              <option value="">měsíc</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        <Field label="Co o něm víme" className="span-2" hint="Oblíbené květiny a barvy, alergie, čeho se vyvarovat, jak rád platí…">
          <textarea value={d.note} onChange={(e) => set("note", e.target.value)} placeholder="Má ráda pivoňky a pastel, nesnáší lilie. Kupuje pro maminku každý měsíc." />
        </Field>
      </div>
      <div className="row" style={{ marginTop: "1.25rem", justifyContent: "flex-end" }}>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Zrušit</button>
        )}
        <button type="submit" className="btn btn-primary">{customer ? "Uložit" : "Přidat zákazníka"}</button>
      </div>
    </form>
  );
}

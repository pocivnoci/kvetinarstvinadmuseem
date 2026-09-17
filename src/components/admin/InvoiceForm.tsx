"use client";

import { useState, type FormEvent } from "react";
import { newId, useAdmin } from "@/lib/admin/store";
import { addDays, parseNumber, todayIso } from "@/lib/admin/format";
import { INVOICE_CATEGORIES, INVOICE_KIND, type Invoice, type InvoiceKind } from "@/lib/admin/types";
import { Field } from "./ui";

function toDraft(i?: Invoice) {
  return {
    kind: i?.kind ?? ("prijata" as InvoiceKind),
    number: i?.number ?? "",
    party: i?.party ?? "",
    issuedAt: i?.issuedAt ?? todayIso(),
    dueAt: i?.dueAt ?? addDays(todayIso(), 14),
    amount: i ? String(i.amount) : "",
    category: i?.category ?? INVOICE_CATEGORIES[0],
    paid: i?.paid ?? false,
    paidAt: i?.paidAt ?? "",
    note: i?.note ?? "",
  };
}

export function InvoiceForm({
  invoice,
  onClose,
}: {
  invoice?: Invoice;
  onClose: () => void;
}) {
  const { update } = useAdmin();
  const [d, setD] = useState(() => toDraft(invoice));
  const set = <K extends keyof typeof d>(k: K, v: (typeof d)[K]) => setD((p) => ({ ...p, [k]: v }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Invoice = {
      id: invoice?.id ?? newId(),
      kind: d.kind,
      number: d.number.trim(),
      party: d.party.trim(),
      issuedAt: d.issuedAt,
      dueAt: d.dueAt || undefined,
      amount: parseNumber(d.amount) ?? 0,
      category: d.kind === "prijata" ? d.category : undefined,
      paid: d.paid,
      paidAt: d.paid ? d.paidAt || todayIso() : undefined,
      note: d.note.trim() || undefined,
    };
    update((doc) => ({
      ...doc,
      invoices: invoice ? doc.invoices.map((x) => (x.id === invoice.id ? next : x)) : [...doc.invoices, next],
    }));
    onClose();
  }

  return (
    <form onSubmit={submit} className="card" style={{ marginBottom: "1rem" }}>
      <div className="card-title">
        <h2>{invoice ? `Upravit fakturu ${invoice.number}` : "Nová faktura"}</h2>
      </div>
      <div className="form-grid">
        <div className="field">
          <span className="field-label">Typ</span>
          <div className="seg" role="group">
            {(["prijata", "vydana"] as InvoiceKind[]).map((k) => (
              <button key={k} type="button" aria-pressed={d.kind === k} onClick={() => set("kind", k)}>
                {INVOICE_KIND[k].label}
              </button>
            ))}
          </div>
        </div>
        <Field label="Částka celkem (Kč)" hint="Včetně DPH, jak je na faktuře.">
          <input type="text" inputMode="decimal" required value={d.amount} onChange={(e) => set("amount", e.target.value)} style={{ textAlign: "right" }} />
        </Field>
        <Field label={d.kind === "prijata" ? "Dodavatel" : "Odběratel"}>
          <input type="text" required value={d.party} onChange={(e) => set("party", e.target.value)} placeholder={d.kind === "prijata" ? "Květinová burza Praha" : "Ateliér Svoboda s.r.o."} />
        </Field>
        <Field label="Číslo faktury / VS">
          <input type="text" required value={d.number} onChange={(e) => set("number", e.target.value)} placeholder="2026-0142" />
        </Field>
        <Field label="Vystaveno" hint="Podle tohoto data patří faktura do měsíce.">
          <input type="date" required value={d.issuedAt} onChange={(e) => set("issuedAt", e.target.value)} />
        </Field>
        <Field label="Splatnost">
          <input type="date" value={d.dueAt} onChange={(e) => set("dueAt", e.target.value)} />
        </Field>
        {d.kind === "prijata" && (
          <Field label="Kategorie výdaje">
            <select value={d.category} onChange={(e) => set("category", e.target.value)}>
              {INVOICE_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
        )}
        <div className="field">
          <span className="field-label">Zaplaceno</span>
          <label className="check" style={{ paddingTop: "0.45rem" }}>
            <input type="checkbox" checked={d.paid} onChange={(e) => set("paid", e.target.checked)} />
            {d.kind === "prijata" ? "Už jsme ji zaplatili" : "Zákazník už zaplatil"}
          </label>
        </div>
        {d.paid && (
          <Field label="Zaplaceno dne">
            <input type="date" value={d.paidAt} onChange={(e) => set("paidAt", e.target.value)} />
          </Field>
        )}
        <Field label="Poznámka" className="span-2">
          <input type="text" value={d.note} onChange={(e) => set("note", e.target.value)} />
        </Field>
      </div>
      <div className="row" style={{ marginTop: "1.25rem", justifyContent: "flex-end" }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>Zrušit</button>
        <button type="submit" className="btn btn-primary">{invoice ? "Uložit" : "Přidat fakturu"}</button>
      </div>
    </form>
  );
}

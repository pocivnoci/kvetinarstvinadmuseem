"use client";

import { useEffect, useState, type FormEvent } from "react";
import { newId, useAdmin } from "@/lib/admin/store";
import { formatCzk, formatDateLong, parseNumber, todayIso } from "@/lib/admin/format";
import { takingsOn, takingsTotal } from "@/lib/admin/penize";
import type { Takings } from "@/lib/admin/types";
import { Field } from "./ui";

/**
 * Zápis tržby za jeden den. Na jedno datum existuje jediný záznam —
 * druhé uložení téhož dne ten první přepíše, ne přidá.
 */
export function TakingsForm({
  defaultDate,
  onSaved,
}: {
  defaultDate?: string;
  onSaved?: (t: Takings) => void;
}) {
  const { doc, update } = useAdmin();
  const [date, setDate] = useState(defaultDate ?? todayIso());
  const [cash, setCash] = useState("");
  const [card, setCard] = useState("");
  const [other, setOther] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  const existing = takingsOn(doc.takings, date);

  // Při přepnutí data ukázat, co už je zapsané, ať se to nepřepíše omylem.
  useEffect(() => {
    const t = takingsOn(doc.takings, date);
    setCash(t ? String(t.cash) : "");
    setCard(t ? String(t.card) : "");
    setOther(t ? String(t.other) : "");
    setNote(t?.note ?? "");
    setSaved(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const total = (parseNumber(cash) ?? 0) + (parseNumber(card) ?? 0) + (parseNumber(other) ?? 0);

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Takings = {
      id: existing?.id ?? newId(),
      date,
      cash: parseNumber(cash) ?? 0,
      card: parseNumber(card) ?? 0,
      other: parseNumber(other) ?? 0,
      note: note.trim() || undefined,
    };
    update((d) => ({
      ...d,
      takings: existing
        ? d.takings.map((t) => (t.date === date ? next : t))
        : [...d.takings, next],
    }));
    setSaved(`${formatDateLong(date)} · ${formatCzk(takingsTotal(next))} uloženo.`);
    onSaved?.(next);
  }

  return (
    <form onSubmit={submit}>
      <div className="form-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(7rem, 1fr))" }}>
        <Field label="Den">
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Hotovost">
          <input type="text" inputMode="decimal" value={cash} onChange={(e) => setCash(e.target.value)} placeholder="0" style={{ textAlign: "right" }} />
        </Field>
        <Field label="Karta">
          <input type="text" inputMode="decimal" value={card} onChange={(e) => setCard(e.target.value)} placeholder="0" style={{ textAlign: "right" }} />
        </Field>
        <Field label="Ostatní" hint="Wolt, převodem, poukazy.">
          <input type="text" inputMode="decimal" value={other} onChange={(e) => setOther(e.target.value)} placeholder="0" style={{ textAlign: "right" }} />
        </Field>
        <div className="field">
          <span className="field-label">Celkem</span>
          <div className="stat-value" style={{ fontSize: "1.6rem", paddingTop: "0.2rem" }}>{formatCzk(total)}</div>
        </div>
      </div>
      <div className="form-grid" style={{ gridTemplateColumns: "1fr auto", alignItems: "end", marginTop: "0.9rem" }}>
        <Field label="Poznámka">
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Silný den kvůli MDŽ" />
        </Field>
        <button type="submit" className="btn btn-primary">{existing ? "Přepsat den" : "Uložit tržbu"}</button>
      </div>
      {existing && !saved && (
        <p className="small muted" style={{ marginTop: "0.6rem" }}>
          Na tenhle den už je zapsáno {formatCzk(takingsTotal(existing))} — uložením se to přepíše.
        </p>
      )}
      {saved && <p className="small" style={{ marginTop: "0.6rem", color: "var(--sage-deep)" }}>{saved}</p>}
      <p className="small muted" style={{ marginTop: "0.6rem" }}>
        Do denní tržby nepatří to, co jde zákazníkovi na fakturu — tu zapište v záložce Faktury,
        ať se stejný příjem nepočítá dvakrát.
      </p>
    </form>
  );
}

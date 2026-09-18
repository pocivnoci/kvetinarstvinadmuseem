"use client";

import { useState, type FormEvent } from "react";
import { newId, useAdmin } from "@/lib/admin/store";
import { formatCzk, formatMonth, parseNumber, ymOf, todayIso } from "@/lib/admin/format";
import { fixedCostsInMonth } from "@/lib/admin/penize";
import { INVOICE_CATEGORIES, type FixedCost } from "@/lib/admin/types";
import { Badge, Card, Empty, Field } from "./ui";
import { Ico } from "./icons";

/**
 * Pravidelné měsíční výdaje — nájem, energie, účetní.
 *
 * Zadá se jednou a počítá se do každého měsíce sám. Bez toho admin
 * tvrdil, že zisk se rovná tržbám: v databázi je 266 tisíc příjmů a
 * nula přijatých faktur, protože nájem se nemá kam zapsat.
 */
export function FixedCosts() {
  const { doc, update } = useAdmin();
  const thisMonth = ymOf(todayIso());
  const [pridavam, setPridavam] = useState(false);

  const vse = [...(doc.fixedCosts ?? [])].sort((a, b) => b.amount - a.amount);
  const platne = fixedCostsInMonth(vse, thisMonth);
  const mesicne = platne.reduce((s, f) => s + f.amount, 0);

  function ulozit(f: FixedCost) {
    update((d) => ({
      ...d,
      fixedCosts: d.fixedCosts.some((x) => x.id === f.id)
        ? d.fixedCosts.map((x) => (x.id === f.id ? f : x))
        : [...d.fixedCosts, f],
    }));
  }

  /**
   * Ukončit, ne smazat.
   *
   * Smazáním by se náklad ztratil i ze všech minulých měsíců a loňský
   * zisk by se zpětně změnil. Nastavením „do" se přestane počítat od
   * příštího měsíce a historie zůstane, jak byla.
   */
  function ukoncit(f: FixedCost) {
    if (!confirm(`Ukončit „${f.name}"? V minulých měsících zůstane, od příštího se přestane počítat.`)) return;
    ulozit({ ...f, to: thisMonth });
  }

  function smazat(f: FixedCost) {
    if (!confirm(`Úplně smazat „${f.name}"? Zmizí i z minulých měsíců a zisk za ně se změní.`)) return;
    update((d) => ({ ...d, fixedCosts: d.fixedCosts.filter((x) => x.id !== f.id) }));
  }

  return (
    <Card
      title="Pravidelné měsíční výdaje"
      action={
        <button className="btn btn-ghost btn-sm" onClick={() => setPridavam((p) => !p)}>
          <Ico.plus className="" /> {pridavam ? "Zavřít" : "Přidat"}
        </button>
      }
    >
      <p className="small" style={{ fontFamily: "var(--font-body)", marginBottom: "0.9rem" }}>
        Nájem, energie, účetní — zadejte jednou a počítají se do každého měsíce samy.{" "}
        <strong>Nezadávejte je zároveň jako přijatou fakturu</strong>, počítaly by se dvakrát.
      </p>

      {pridavam && <FixedCostForm onSave={(f) => { ulozit(f); setPridavam(false); }} onClose={() => setPridavam(false)} />}

      {vse.length === 0 ? (
        <Empty>Zatím tu nic není. Bez nájmu a energií ukazuje zisk víc, než ve skutečnosti je.</Empty>
      ) : (
        <>
          <div className="list">
            {vse.map((f) => {
              const bezi = f.from <= thisMonth && (!f.to || thisMonth <= f.to);
              return (
                <div key={f.id} className="list-row" style={{ gridTemplateColumns: "1fr auto" }}>
                  <div>
                    <div className="list-title">
                      {f.name} {!bezi && <Badge tone="stone">{f.to && f.to < thisMonth ? "ukončeno" : "začne později"}</Badge>}
                    </div>
                    <div className="list-sub">
                      {f.category} · od {formatMonth(f.from)}
                      {f.to && ` do ${formatMonth(f.to)}`}
                      {f.note && ` · ${f.note}`}
                    </div>
                  </div>
                  <div className="list-end">
                    <span className="mono">{formatCzk(f.amount)}</span>
                    <div className="row">
                      {bezi && (
                        <button className="btn btn-ghost btn-sm" onClick={() => ukoncit(f)}>Ukončit</button>
                      )}
                      <button className="btn btn-ghost btn-sm" onClick={() => smazat(f)}>Smazat</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="small" style={{ marginTop: "0.8rem" }}>
            Tenhle měsíc se počítá <strong>{formatCzk(mesicne)}</strong>
            {platne.length !== vse.length && ` (${platne.length} z ${vse.length} položek)`}.
          </p>
        </>
      )}
    </Card>
  );
}

function FixedCostForm({ onSave, onClose }: { onSave: (f: FixedCost) => void; onClose: () => void }) {
  const thisMonth = ymOf(todayIso());
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("Nájem");
  const [from, setFrom] = useState(thisMonth);
  const [to, setTo] = useState("");
  const [note, setNote] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    onSave({
      id: newId(),
      name: name.trim(),
      amount: parseNumber(amount) ?? 0,
      category,
      from,
      to: to || undefined,
      note: note.trim() || undefined,
    });
  }

  return (
    <form onSubmit={submit} className="form-section" style={{ marginBottom: "1rem" }}>
      <div className="form-grid">
        <Field label="Co to je">
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nájem Vinohradská 6" />
        </Field>
        <Field label="Kolik měsíčně (Kč)">
          <input type="text" inputMode="decimal" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="32 000" />
        </Field>
        <Field label="Kategorie">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {INVOICE_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Platí od" hint="Do dřívějších měsíců se nepočítá.">
          <input type="month" required value={from} onChange={(e) => setFrom(e.target.value)} />
        </Field>
        <Field label="Platí do (nepovinné)" hint="Prázdné = běží dál.">
          <input type="month" value={to} min={from} onChange={(e) => setTo(e.target.value)} />
        </Field>
        <Field label="Poznámka (nepovinné)">
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
      </div>
      <div className="row" style={{ marginTop: "0.8rem" }}>
        <button type="submit" className="btn btn-primary btn-sm">Uložit</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Zrušit</button>
      </div>
    </form>
  );
}

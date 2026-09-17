"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { newId, useAdmin } from "@/lib/admin/store";
import { formatCzk, parseNumber } from "@/lib/admin/format";
import { Card, Field, Loading, PageHead } from "@/components/admin/ui";
import { Ico } from "@/components/admin/icons";

type Line = { id: string; name: string; qty: string; unitCost: string };

const emptyLine = (): Line => ({ id: newId(), name: "", qty: "1", unitCost: "" });

/**
 * Kalkulačka kytice: materiál v nákupu × marže + práce + obal, DPH, zaokrouhlení.
 * Výsledek jde jedním klikem do nové objednávky.
 */
export default function KalkulackaPage() {
  const { doc, ready } = useAdmin();
  const s = doc.settings;
  const [lines, setLines] = useState<Line[]>([emptyLine(), emptyLine(), emptyLine()]);
  const [markup, setMarkup] = useState<string | null>(null);
  const [labor, setLabor] = useState<string | null>(null);
  const [wrap, setWrap] = useState<string | null>(null);
  const [pick, setPick] = useState("");

  const markupN = parseNumber(markup ?? String(s.defaultMarkup)) ?? s.defaultMarkup;
  const laborN = parseNumber(labor ?? String(s.laborFee)) ?? s.laborFee;
  const wrapN = parseNumber(wrap ?? String(s.wrapFee)) ?? s.wrapFee;

  const calc = useMemo(() => {
    const material = lines.reduce((sum, l) => sum + (parseNumber(l.qty) ?? 0) * (parseNumber(l.unitCost) ?? 0), 0);
    const materialSale = material * markupN;
    const net = materialSale + laborN + wrapN;
    const gross = net * (1 + s.vatRate / 100);
    const round = Math.max(1, s.roundTo);
    const price = Math.ceil(gross / round) * round;
    const stems = lines.reduce((n, l) => n + (parseNumber(l.qty) ?? 0), 0);
    const margin = price > 0 ? (price / (1 + s.vatRate / 100) - material - laborN - wrapN) : 0;
    return { material, materialSale, net, gross, price, stems, margin };
  }, [lines, markupN, laborN, wrapN, s.vatRate, s.roundTo]);

  if (!ready) return <Loading />;

  const setLine = (id: string, patch: Partial<Line>) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  function addFromStock(id: string) {
    const item = doc.stock.find((x) => x.id === id);
    if (!item) return;
    const empty = lines.find((l) => !l.name && !l.unitCost);
    const line: Line = { id: empty?.id ?? newId(), name: item.name, qty: "1", unitCost: String(item.costPrice) };
    setLines((ls) => (empty ? ls.map((l) => (l.id === empty.id ? line : l)) : [...ls, line]));
    setPick("");
  }

  const description = lines
    .filter((l) => l.name.trim())
    .map((l) => `${l.qty}× ${l.name.trim()}`)
    .join(", ");

  const orderHref = `/admin/objednavky/nova?price=${calc.price}&description=${encodeURIComponent(description)}`;

  return (
    <>
      <PageHead
        title="Kalkulačka kytice"
        sub={`Materiál v nákupu × ${markupN} + práce + obal, plus ${s.vatRate} % DPH, zaokrouhleno na ${s.roundTo} Kč. Výchozí hodnoty jsou v Nastavení.`}
      />

      <div className="grid-2" style={{ gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)" }}>
        <Card title="Materiál">
          {doc.stock.length > 0 && (
            <div className="toolbar">
              <select value={pick} onChange={(e) => addFromStock(e.target.value)} style={{ minWidth: "16rem" }}>
                <option value="">+ přidat ze skladu…</option>
                {doc.stock.filter((x) => x.qty > 0).map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name} — {formatCzk(x.costPrice)} ({x.qty} {x.unit})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Květina / materiál</th>
                  <th className="num" style={{ width: "5.5rem" }}>Ks</th>
                  <th className="num" style={{ width: "7rem" }}>Nákup / ks</th>
                  <th className="num" style={{ width: "6.5rem" }}>Celkem</th>
                  <th style={{ width: "2rem" }}></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l) => (
                  <tr key={l.id}>
                    <td><input type="text" value={l.name} onChange={(e) => setLine(l.id, { name: e.target.value })} placeholder="Pivoňka Sarah Bernhardt" /></td>
                    <td><input type="text" inputMode="decimal" value={l.qty} onChange={(e) => setLine(l.id, { qty: e.target.value })} style={{ textAlign: "right" }} /></td>
                    <td><input type="text" inputMode="decimal" value={l.unitCost} onChange={(e) => setLine(l.id, { unitCost: e.target.value })} style={{ textAlign: "right" }} /></td>
                    <td className="num">{formatCzk((parseNumber(l.qty) ?? 0) * (parseNumber(l.unitCost) ?? 0))}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" style={{ padding: "0.3rem" }} onClick={() => setLines((ls) => ls.filter((x) => x.id !== l.id))} aria-label="Odebrat">
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: "0.75rem" }} onClick={() => setLines((ls) => [...ls, emptyLine()])}>
            <Ico.plus className="" /> Další řádek
          </button>

          <div className="form-section">
            <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
              <Field label="Marže (×)">
                <input type="text" inputMode="decimal" value={markup ?? String(s.defaultMarkup)} onChange={(e) => setMarkup(e.target.value)} />
              </Field>
              <Field label="Práce (Kč)">
                <input type="text" inputMode="decimal" value={labor ?? String(s.laborFee)} onChange={(e) => setLabor(e.target.value)} />
              </Field>
              <Field label="Obal (Kč)">
                <input type="text" inputMode="decimal" value={wrap ?? String(s.wrapFee)} onChange={(e) => setWrap(e.target.value)} />
              </Field>
            </div>
          </div>
        </Card>

        <div className="stack">
          <Card>
            <div className="stat">
              <span className="stat-label">Doporučená cena</span>
              <span className="stat-value" style={{ fontSize: "2.8rem" }}>{formatCzk(calc.price)}</span>
              <span className="stat-sub">{calc.stems} stonků · s DPH {s.vatRate} %</span>
            </div>
            <dl className="kv" style={{ marginTop: "1.25rem" }}>
              <dt>Materiál nákup</dt>
              <dd className="mono">{formatCzk(calc.material)}</dd>
              <dt>Materiál × {markupN}</dt>
              <dd className="mono">{formatCzk(calc.materialSale)}</dd>
              <dt>Práce + obal</dt>
              <dd className="mono">{formatCzk(laborN + wrapN)}</dd>
              <dt>Bez DPH</dt>
              <dd className="mono">{formatCzk(calc.net)}</dd>
              <dt>S DPH</dt>
              <dd className="mono">{formatCzk(calc.gross)}</dd>
              <dt>Hrubá marže</dt>
              <dd className="mono">
                {formatCzk(calc.margin)}{" "}
                {calc.price > 0 && (
                  <span className="muted small">({Math.round((calc.margin / (calc.price / (1 + s.vatRate / 100))) * 100)} %)</span>
                )}
              </dd>
            </dl>
            <Link href={orderHref} className="btn btn-primary" style={{ marginTop: "1.25rem", width: "100%", justifyContent: "center" }}>
              Založit objednávku za {formatCzk(calc.price)}
            </Link>
          </Card>
          <Card title="Rychlé odhady">
            <p className="small" style={{ fontFamily: "var(--font-body)" }}>
              Pro rychlou cenu na prodejně: <strong>malá kytice</strong> ≈ 5–7 stonků,{" "}
              <strong>střední</strong> ≈ 9–12, <strong>velká</strong> ≈ 15–20. Zeleň a výplň počítejte jako
              samostatný řádek — bývá 20–30 % materiálu.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}

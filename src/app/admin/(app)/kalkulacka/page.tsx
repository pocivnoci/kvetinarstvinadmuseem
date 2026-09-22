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
 *
 * Nákupní ceny se zadávají tak, jak jsou na faktuře z velkoobchodu — bez DPH.
 * Krám není plátce DPH, takže si ho neodečte a DPH v nákupu je skutečný
 * náklad. Kalkulačka ho k zadaným cenám připočte sama (sazba je v Nastavení),
 * aby se nemusela každá položka přepočítávat +21 % z hlavy.
 */
export default function KalkulackaPage() {
  const { doc, ready } = useAdmin();
  const s = doc.settings;
  const [lines, setLines] = useState<Line[]>([emptyLine(), emptyLine(), emptyLine()]);
  const [markup, setMarkup] = useState<string | null>(null);
  const [labor, setLabor] = useState<string | null>(null);
  const [wrap, setWrap] = useState<string | null>(null);
  /** Připočítat DPH z nákupu? Výchozí je ano; vypnutí platí jen pro tuhle kytici. */
  const [addVat, setAddVat] = useState<boolean | null>(null);
  const [pick, setPick] = useState("");

  const markupN = parseNumber(markup ?? String(s.defaultMarkup)) ?? s.defaultMarkup;
  const laborN = parseNumber(labor ?? String(s.laborFee)) ?? s.laborFee;
  const wrapN = parseNumber(wrap ?? String(s.wrapFee)) ?? s.wrapFee;
  const vatOn = s.purchaseVatRate > 0 && (addVat ?? true);
  /** Násobek, kterým se zadaná cena bez DPH převede na to, co se za ni doopravdy platí. */
  const vatFactor = vatOn ? 1 + s.purchaseVatRate / 100 : 1;

  const calc = useMemo(() => {
    const materialNet = lines.reduce((sum, l) => sum + (parseNumber(l.qty) ?? 0) * (parseNumber(l.unitCost) ?? 0), 0);
    const material = materialNet * vatFactor;
    const materialSale = material * markupN;
    const net = materialSale + laborN + wrapN;
    const gross = net * (1 + s.vatRate / 100);
    const round = Math.max(1, s.roundTo);
    const price = Math.ceil(gross / round) * round;
    const stems = lines.reduce((n, l) => n + (parseNumber(l.qty) ?? 0), 0);
    const margin = price > 0 ? (price / (1 + s.vatRate / 100) - material - laborN - wrapN) : 0;
    return { materialNet, material, materialSale, net, gross, price, stems, margin };
  }, [lines, vatFactor, markupN, laborN, wrapN, s.vatRate, s.roundTo]);

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

  const formula =
    `Materiál v nákupu${vatOn ? ` (+ ${s.purchaseVatRate} % DPH k cenám z faktury)` : ""} × ${markupN} + práce + obal` +
    `${s.vatRate > 0 ? `, plus ${s.vatRate} % DPH` : ""}, zaokrouhleno na ${s.roundTo} Kč. Výchozí hodnoty jsou v Nastavení.`;

  return (
    <>
      <PageHead title="Kalkulačka kytice" sub={formula} />

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
          {s.purchaseVatRate > 0 && (
            // Mimo .toolbar — ta dává všem inputům šířku auto a rámeček, checkbox by vypadal jako textové pole.
            <label className="check" style={{ marginBottom: "0.9rem" }}>
              <input type="checkbox" checked={vatOn} onChange={(e) => setAddVat(e.target.checked)} />
              Ceny jsou z faktury bez DPH — připočítat {s.purchaseVatRate} %
            </label>
          )}
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Květina / materiál</th>
                  <th className="num" style={{ width: "5.5rem" }}>Ks</th>
                  <th className="num" style={{ width: "7rem" }}>
                    Nákup / ks{vatOn && <><br />bez DPH</>}
                  </th>
                  <th className="num" style={{ width: "6.5rem" }}>
                    Celkem{vatOn && <><br />s DPH</>}
                  </th>
                  <th style={{ width: "2rem" }}></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l) => (
                  <tr key={l.id}>
                    <td><input type="text" value={l.name} onChange={(e) => setLine(l.id, { name: e.target.value })} placeholder="Pivoňka Sarah Bernhardt" /></td>
                    <td><input type="text" inputMode="decimal" value={l.qty} onChange={(e) => setLine(l.id, { qty: e.target.value })} style={{ textAlign: "right" }} /></td>
                    <td><input type="text" inputMode="decimal" value={l.unitCost} onChange={(e) => setLine(l.id, { unitCost: e.target.value })} style={{ textAlign: "right" }} /></td>
                    <td className="num">{formatCzk((parseNumber(l.qty) ?? 0) * (parseNumber(l.unitCost) ?? 0) * vatFactor)}</td>
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
              <span className="stat-sub">
                {calc.stems} stonků · {s.vatRate > 0 ? `s DPH ${s.vatRate} %` : "neplátce DPH"}
              </span>
            </div>
            <dl className="kv" style={{ marginTop: "1.25rem" }}>
              {vatOn ? (
                <>
                  <dt>Materiál bez DPH</dt>
                  <dd className="mono">{formatCzk(calc.materialNet)}</dd>
                  <dt>DPH v nákupu {s.purchaseVatRate} %</dt>
                  <dd className="mono">{formatCzk(calc.material - calc.materialNet)}</dd>
                  <dt>Materiál s DPH</dt>
                  <dd className="mono">{formatCzk(calc.material)}</dd>
                </>
              ) : (
                <>
                  <dt>Materiál nákup</dt>
                  <dd className="mono">{formatCzk(calc.material)}</dd>
                </>
              )}
              <dt>Materiál × {markupN}</dt>
              <dd className="mono">{formatCzk(calc.materialSale)}</dd>
              <dt>Práce + obal</dt>
              <dd className="mono">{formatCzk(laborN + wrapN)}</dd>
              {s.vatRate > 0 ? (
                <>
                  <dt>Prodej bez DPH</dt>
                  <dd className="mono">{formatCzk(calc.net)}</dd>
                  <dt>Prodej s DPH {s.vatRate} %</dt>
                  <dd className="mono">{formatCzk(calc.gross)}</dd>
                </>
              ) : (
                <>
                  <dt>Před zaokrouhlením</dt>
                  <dd className="mono">{formatCzk(calc.net)}</dd>
                </>
              )}
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

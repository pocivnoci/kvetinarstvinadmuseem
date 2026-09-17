"use client";

import { useMemo, useState } from "react";
import { PECE, PECE_OBECNE } from "@/lib/admin/pece";
import { Card, PageHead } from "@/components/admin/ui";
import { Ico } from "@/components/admin/icons";

/**
 * Péče o květiny: tahák pro floristku + tisk kartičky pro zákazníka
 * složené z květin, které v kytici skutečně jsou.
 */
export default function PecePage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    const n = q.trim().toLowerCase();
    return PECE.filter((p) => !n || p.name.toLowerCase().includes(n));
  }, [q]);

  const chosen = PECE.filter((p) => selected.has(p.id));

  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  return (
    <>
      <div className="no-print">
        <PageHead
          title="Péče o květiny"
          sub="Tahák na příjem zboží a text na kartičku pro zákazníka. Zaškrtněte, co je v kytici, a vytiskněte."
        >
          <button className="btn btn-primary btn-sm" disabled={chosen.length === 0} onClick={() => window.print()}>
            <Ico.print className="" /> Tisknout kartičku ({chosen.length})
          </button>
          {chosen.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={() => setSelected(new Set())}>Zrušit výběr</button>
          )}
        </PageHead>

        <div className="toolbar">
          <input type="search" placeholder="Hledat květinu…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <Card>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: "2rem" }}></th>
                  <th>Květina</th>
                  <th className="num">Ve váze</th>
                  <th>Voda</th>
                  <th>Řez</th>
                  <th>Pro floristku</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} aria-label={`Na kartičku: ${p.name}`} />
                    </td>
                    <td>
                      <button className="link" style={{ fontWeight: 600, textAlign: "left" }} onClick={() => setOpen(open === p.id ? null : p.id)}>
                        {p.name}
                      </button>
                      {p.warning && <div className="small" style={{ color: "var(--terracotta)" }}>⚠ {p.warning}</div>}
                      {open === p.id && (
                        <div className="small" style={{ marginTop: "0.5rem", fontFamily: "var(--font-body)", maxWidth: "40rem" }}>
                          <strong>Pro zákazníka:</strong> {p.customer}
                        </div>
                      )}
                    </td>
                    <td className="num">{p.vaseLife[0]}–{p.vaseLife[1]} d</td>
                    <td className="small">{p.water}</td>
                    <td className="small">{p.cut}</td>
                    <td className="small" style={{ fontFamily: "var(--font-body)", minWidth: "20rem", maxWidth: "32rem" }}>{p.florist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Kartička — na obrazovce jako náhled, při tisku jediný obsah. */}
      {chosen.length > 0 && (
        <div className="print-sheet" style={{ marginTop: "1rem" }}>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.4rem", marginBottom: "0.25rem" }}>
            Aby vám kytice vydržela
          </div>
          <div className="small" style={{ color: "#8c8579", marginBottom: "1rem" }}>Květiny nad museem · Vinohradská 6</div>
          <ol style={{ paddingLeft: "1.2rem", fontFamily: "var(--font-body)", lineHeight: 1.5, margin: 0 }}>
            {PECE_OBECNE.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
          <dl style={{ marginTop: "1.25rem", fontFamily: "var(--font-body)", lineHeight: 1.5 }}>
            {chosen.map((p) => (
              <div key={p.id} style={{ marginBottom: "0.75rem" }}>
                <dt style={{ fontWeight: 600, fontFamily: "var(--font-ui)", fontSize: "0.85rem" }}>
                  {p.name} <span style={{ color: "#8c8579", fontWeight: 400 }}>· vydrží {p.vaseLife[0]}–{p.vaseLife[1]} dní</span>
                </dt>
                <dd style={{ margin: 0 }}>{p.customer}</dd>
              </div>
            ))}
          </dl>
          <p className="small" style={{ marginTop: "1rem", color: "#8c8579" }}>
            Děkujeme, že jste si vybrali květiny od nás. Když něco nebude jasné, zavolejte — poradíme.
          </p>
        </div>
      )}
    </>
  );
}

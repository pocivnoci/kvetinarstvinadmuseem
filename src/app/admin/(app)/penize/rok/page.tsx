"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin/store";
import { MONTH_NOMINATIVE, formatCzk, formatDelta, todayIso, ymOf } from "@/lib/admin/format";
import { yearOverYear, yearSummary } from "@/lib/admin/penize";
import { YearColumns } from "@/components/admin/charts";
import { MoneyTabs } from "@/components/admin/MoneyTabs";
import { Card, Empty, Loading, PageHead, Stat } from "@/components/admin/ui";

export default function RokPage() {
  const { doc, ready } = useAdmin();
  const today = todayIso();
  const [year, setYear] = useState(() => Number(today.slice(0, 4)));

  if (!ready) return <Loading />;

  const y = yearSummary(doc, year);
  const yoy = yearOverYear(doc, year, today);
  const filled = y.months.filter((m) => m.income > 0 || m.expenses > 0);
  const best = filled.reduce<(typeof y.months)[number] | undefined>(
    (b, m) => (!b || m.income > b.income ? m : b),
    undefined
  );

  return (
    <>
      <PageHead title={`Rok ${year}`} sub="Příjmy, výdaje a zisk po měsících. Sčítá se z tržeb a faktur.">
        <button className="btn btn-ghost btn-sm" onClick={() => setYear((v) => v - 1)}>← {year - 1}</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setYear((v) => v + 1)}>{year + 1} →</button>
      </PageHead>

      <MoneyTabs />

      <div className="grid-3" style={{ marginBottom: "1rem" }}>
        <Card>
          <Stat
            label="Příjmy za rok"
            value={formatCzk(y.income)}
            sub={
              yoy
                ? `${formatDelta(yoy.ratio)} proti stejnému období ${year - 1}`
                : `${filled.length} měsíců se zápisem`
            }
          />
        </Card>
        <Card>
          <Stat label="Výdaje za rok" value={formatCzk(y.expenses)} />
        </Card>
        <Card>
          <Stat
            label="Zisk za rok"
            value={formatCzk(y.profit)}
            sub={y.income > 0 ? `marže ${Math.round((y.profit / y.income) * 100)} %` : undefined}
          />
        </Card>
      </div>

      <Card title="Příjmy a výdaje po měsících">
        {filled.length === 0 ? (
          <Empty>Za rok {year} zatím nejsou žádná data.</Empty>
        ) : (
          <YearColumns months={y.months} highlightYm={ymOf(today)} />
        )}
      </Card>

      <Card title="Měsíce">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Měsíc</th>
                <th className="num">Příjmy</th>
                <th className="num">Výdaje</th>
                <th className="num">Zisk</th>
                <th className="num">Marže</th>
              </tr>
            </thead>
            <tbody>
              {y.months.map((m) => {
                const empty = m.income === 0 && m.expenses === 0;
                return (
                  <tr key={m.ym} style={{ opacity: empty ? 0.45 : 1 }}>
                    <td style={{ fontWeight: m.ym === ymOf(today) ? 700 : 400 }}>
                      {MONTH_NOMINATIVE[m.month - 1]}
                      {m.ym === best?.ym && !empty && <span className="muted small"> nejsilnější</span>}
                    </td>
                    <td className="num">{empty ? "—" : formatCzk(m.income)}</td>
                    <td className="num">{empty ? "—" : formatCzk(m.expenses)}</td>
                    <td className="num"><strong>{empty ? "—" : formatCzk(m.profit)}</strong></td>
                    <td className="num">{m.income > 0 ? `${Math.round((m.profit / m.income) * 100)} %` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Celkem {year}</strong></td>
                <td className="num"><strong>{formatCzk(y.income)}</strong></td>
                <td className="num"><strong>{formatCzk(y.expenses)}</strong></td>
                <td className="num"><strong>{formatCzk(y.profit)}</strong></td>
                <td className="num">{y.income > 0 ? `${Math.round((y.profit / y.income) * 100)} %` : "—"}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </>
  );
}

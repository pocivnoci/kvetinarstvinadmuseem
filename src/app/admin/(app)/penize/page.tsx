"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdmin } from "@/lib/admin/store";
import {
  formatCzk,
  formatDate,
  formatDateShort,
  formatDelta,
  formatMonth,
  shiftMonth,
  todayIso,
  ymOf,
} from "@/lib/admin/format";
import {
  downloadCsv,
  invoicesCsv,
  monthOverMonth,
  monthSummary,
  overdueInvoices,
  takingsCsv,
} from "@/lib/admin/penize";
import { DayColumns } from "@/components/admin/charts";
import { MoneyTabs } from "@/components/admin/MoneyTabs";
import { TakingsForm } from "@/components/admin/TakingsForm";
import { Card, Empty, Loading, PageHead, Stat } from "@/components/admin/ui";

export default function PenizePage() {
  const { doc, ready, update } = useAdmin();
  const today = todayIso();
  const [ym, setYm] = useState(() => ymOf(today));

  if (!ready) return <Loading />;

  const s = monthSummary(doc, ym);
  const mom = monthOverMonth(doc, ym);
  const overdue = overdueInvoices(doc.invoices, today);
  const rows = s.days.filter((d) => d.takings).reverse();
  const isCurrentMonth = ym === ymOf(today);

  function removeDay(date: string) {
    if (!window.confirm(`Smazat zapsanou tržbu za ${formatDate(date)}?`)) return;
    update((d) => ({ ...d, takings: d.takings.filter((t) => t.date !== date) }));
  }

  return (
    <>
      <PageHead title="Peníze" sub="Denní tržby a faktury. Měsíční součty i zisk se počítají samy.">
        <button className="btn btn-ghost btn-sm" onClick={() => setYm(shiftMonth(ym, -1))}>← {formatMonth(shiftMonth(ym, -1)).split(" ")[0]}</button>
        {!isCurrentMonth && (
          <button className="btn btn-ghost btn-sm" onClick={() => setYm(ymOf(today))}>tento měsíc</button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => setYm(shiftMonth(ym, 1))}>{formatMonth(shiftMonth(ym, 1)).split(" ")[0]} →</button>
      </PageHead>

      <MoneyTabs />

      {overdue.length > 0 && (
        <div className="notice notice-danger">
          <strong>Po splatnosti:</strong>{" "}
          {overdue
            .slice(0, 4)
            .map((i) => `${i.party} ${formatCzk(i.amount)} (${formatDate(i.dueAt!)})`)
            .join(" · ")}
          {overdue.length > 4 && ` a další ${overdue.length - 4}`} —{" "}
          <Link href="/admin/penize/faktury" className="link">otevřít faktury</Link>
        </div>
      )}

      <div className="grid-3" style={{ marginBottom: "1rem" }}>
        <Card>
          <Stat
            label={`Příjmy — ${formatMonth(ym)}`}
            value={formatCzk(s.income)}
            sub={
              mom === undefined
                ? `${formatCzk(s.shopRevenue)} krám · ${formatCzk(s.invoicedRevenue)} faktury`
                : `${formatDelta(mom.ratio)} proti ${
                    mom.partial ? `1.–${mom.throughDay}. minulého měsíce` : "minulému měsíci"
                  }`
            }
          />
        </Card>
        <Card>
          <Stat label="Výdaje" value={formatCzk(s.expenses)} sub={`${s.byCategory.length} kategorií`} />
        </Card>
        <Card>
          <Stat
            label="Zisk"
            value={formatCzk(s.profit)}
            sub={s.income > 0 ? `marže ${Math.round(s.margin * 100)} % z příjmů` : "zatím bez příjmů"}
          />
        </Card>
      </div>

      <Card title={`Denní tržby — ${formatMonth(ym)}`}>
        {s.shopRevenue === 0 ? (
          <Empty>Za tenhle měsíc zatím není zapsaná žádná tržba.</Empty>
        ) : (
          <DayColumns days={s.days} bestDate={s.bestDay?.date} today={today} />
        )}
        <div className="row" style={{ marginTop: "1rem", gap: "1.5rem" }}>
          <span className="small">
            <span className="muted">Průměr na otevřený den </span>
            <strong>{formatCzk(s.avgPerOpenDay)}</strong>
          </span>
          <span className="small">
            <span className="muted">Dnů s tržbou </span>
            <strong>{s.openDays}</strong>
          </span>
          {s.bestDay && (
            <span className="small">
              <span className="muted">Nejsilnější den </span>
              <strong>
                {formatDateShort(s.bestDay.date)} · {formatCzk(s.bestDay.total)}
              </strong>
            </span>
          )}
        </div>
      </Card>

      <Card title="Zapsat tržbu">
        <TakingsForm defaultDate={isCurrentMonth ? today : `${ym}-01`} />
      </Card>

      <div className="grid-2">
        <Card
          title="Z čeho jsou příjmy"
          action={
            <button onClick={() => downloadCsv(`trzby-${ym}.csv`, takingsCsv(doc, ym))}>tržby do CSV</button>
          }
        >
          <dl className="kv">
            <dt>Tržby v krámu</dt>
            <dd className="mono">{formatCzk(s.shopRevenue)}</dd>
            <dt>Vydané faktury</dt>
            <dd className="mono">{formatCzk(s.invoicedRevenue)}</dd>
            <dt>Příjmy celkem</dt>
            <dd className="mono"><strong>{formatCzk(s.income)}</strong></dd>
          </dl>
          {(s.unpaidIssued > 0 || s.unpaidReceived > 0) && (
            <p className="small muted" style={{ marginTop: "0.9rem" }}>
              Z toho ještě nezaplaceno: {formatCzk(s.unpaidIssued)} nám dluží zákazníci,
              {" "}{formatCzk(s.unpaidReceived)} dlužíme my dodavatelům.
            </p>
          )}
        </Card>

        <Card
          title="Kam šly peníze"
          action={
            <button onClick={() => downloadCsv(`faktury-${ym}.csv`, invoicesCsv(doc, ym))}>faktury do CSV</button>
          }
        >
          {s.byCategory.length === 0 ? (
            <Empty>Za tenhle měsíc není zapsaná žádná přijatá faktura.</Empty>
          ) : (
            <div className="list">
              {s.byCategory.map((c) => (
                <div key={c.category} className="list-row" style={{ gridTemplateColumns: "1fr auto", padding: "0.5rem 0" }}>
                  <div>
                    <div className="list-title">{c.category}</div>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 3,
                        marginTop: "0.35rem",
                        background: "var(--terracotta)",
                        opacity: 0.85,
                        width: `${s.expenses > 0 ? Math.max(4, (c.amount / s.expenses) * 100) : 0}%`,
                      }}
                    />
                  </div>
                  <span className="mono small">
                    {formatCzk(c.amount)}
                    <span className="muted"> · {Math.round((c.amount / s.expenses) * 100)} %</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card title="Zapsané dny">
        {rows.length === 0 ? (
          <Empty>Zatím nic. Tržbu zapíšete formulářem výš.</Empty>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Den</th>
                  <th className="num">Hotovost</th>
                  <th className="num">Karta</th>
                  <th className="num">Ostatní</th>
                  <th className="num">Celkem</th>
                  <th>Poznámka</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.date}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {formatDateShort(d.date)}
                      {d.date === today && <span className="muted small"> dnes</span>}
                    </td>
                    <td className="num">{formatCzk(d.takings!.cash)}</td>
                    <td className="num">{formatCzk(d.takings!.card)}</td>
                    <td className="num">{formatCzk(d.takings!.other)}</td>
                    <td className="num"><strong>{formatCzk(d.total)}</strong></td>
                    <td className="small muted">{d.takings!.note}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => removeDay(d.date)}>smazat</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Celkem</strong></td>
                  <td className="num">{formatCzk(rows.reduce((x, d) => x + d.takings!.cash, 0))}</td>
                  <td className="num">{formatCzk(rows.reduce((x, d) => x + d.takings!.card, 0))}</td>
                  <td className="num">{formatCzk(rows.reduce((x, d) => x + d.takings!.other, 0))}</td>
                  <td className="num"><strong>{formatCzk(s.shopRevenue)}</strong></td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

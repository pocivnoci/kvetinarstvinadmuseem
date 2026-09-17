"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdmin } from "@/lib/admin/store";
import { MONTH_NAMES, MONTH_NOMINATIVE, addDays, formatDateShort, fromIso, relativeDay, todayIso } from "@/lib/admin/format";
import { SVATKY, hledejSvatek, svatekPro } from "@/lib/admin/svatky";
import { klicoveDnyRoku } from "@/lib/admin/klicove-dny";
import { customerEvents } from "@/lib/admin/select";
import { Badge, Card, Empty, Loading, PageHead } from "@/components/admin/ui";

export default function SvatkyPage() {
  const { doc, ready } = useAdmin();
  const today = todayIso();
  const [q, setQ] = useState("");
  const [month, setMonth] = useState(() => fromIso(today).getMonth() + 1);
  const [year, setYear] = useState(() => Number(today.slice(0, 4)));

  const results = useMemo(() => hledejSvatek(q), [q]);
  const week = Array.from({ length: 14 }, (_, i) => addDays(today, i));
  const klicove = klicoveDnyRoku(year);
  const events = customerEvents(doc.customers, today, 30);

  if (!ready) return <Loading />;

  return (
    <>
      <PageHead
        title="Svátky a sezóna"
        sub="Kdo má kdy svátek a které dny v roce jsou pro květinářství klíčové. Dobrý důvod dát vědět zákazníkům."
      />

      <div className="grid-2">
        <Card title="Kdo má svátek?">
          <input
            type="search"
            placeholder="Napište jméno… (Jana, Petr, Tereza)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
          {q.trim() && (
            <div className="list" style={{ marginTop: "0.75rem" }}>
              {results.length === 0 ? (
                <Empty>Takové jméno v kalendáři není.</Empty>
              ) : (
                results.slice(0, 12).map((s) => (
                  <div key={s.key} className="list-row" style={{ gridTemplateColumns: "auto 1fr" }}>
                    <div className="list-when">
                      {s.day}. {s.month}.
                    </div>
                    <div className="list-title">{s.text}</div>
                  </div>
                ))
              )}
            </div>
          )}
          {!q.trim() && (
            <div className="list" style={{ marginTop: "0.75rem" }}>
              {week.map((d) => {
                const s = svatekPro(d);
                if (!s) return null;
                return (
                  <div key={d} className="list-row" style={{ gridTemplateColumns: "auto 1fr", padding: "0.5rem 0" }}>
                    <div className="list-when" style={{ fontSize: "0.95rem" }}>
                      {formatDateShort(d).split(" ").slice(1).join(" ")}
                      <small>{d === today ? "dnes" : formatDateShort(d).split(" ")[0]}</small>
                    </div>
                    <div className={s.names.length ? "list-title" : "muted"} style={{ fontWeight: s.names.length ? 600 : 400 }}>
                      {s.text}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card title="Zákazníci s blížícím se svátkem">
          {events.length === 0 ? (
            <Empty>
              V příštích 30 dnech nikdo. U zákazníka vyplňte „jméno pro svátek“ nebo narozeniny —{" "}
              <Link href="/admin/zakaznici" className="link">zákazníci</Link>.
            </Empty>
          ) : (
            <div className="list">
              {events.map((e) => (
                <div key={e.customer.id + e.kind} className="list-row" style={{ gridTemplateColumns: "auto 1fr" }}>
                  <div className="list-when">
                    {formatDateShort(e.date).split(" ").slice(1).join(" ")}
                    <small>{relativeDay(e.date, today)}</small>
                  </div>
                  <div>
                    <Link href={`/admin/zakaznici/${e.customer.id}`} className="list-title">{e.customer.name}</Link>
                    <div className="list-sub">{e.label}{e.customer.note ? ` · ${e.customer.note}` : ""}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card
        title={`Květinový rok ${year}`}
        action={
          <span className="row" style={{ gap: "0.5rem" }}>
            <button onClick={() => setYear((y) => y - 1)}>← {year - 1}</button>
            <button onClick={() => setYear((y) => y + 1)}>{year + 1} →</button>
          </span>
        }
        className="mt"
      >
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Den</th>
                <th>Na co se připravit</th>
                <th className="num">Objednat zboží</th>
              </tr>
            </thead>
            <tbody>
              {klicove.map((k) => {
                const past = k.date < today;
                return (
                  <tr key={k.name + k.date} style={{ opacity: past ? 0.5 : 1 }}>
                    <td className="mono" style={{ whiteSpace: "nowrap" }}>
                      {formatDateShort(k.date)}
                      {!past && <div className="small muted">{relativeDay(k.date, today)}</div>}
                    </td>
                    <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                      {k.name} {k.major && <Badge tone="gilt">velký</Badge>}
                    </td>
                    <td className="small" style={{ fontFamily: "var(--font-body)", minWidth: "18rem" }}>{k.tip}</td>
                    <td className="num small">{k.leadDays ? `${k.leadDays} dní předem` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        title={`Kalendář jmen — ${MONTH_NOMINATIVE[month - 1]}`}
        action={
          <span className="row" style={{ gap: "0.5rem" }}>
            <button onClick={() => setMonth((m) => (m === 1 ? 12 : m - 1))}>←</button>
            <button onClick={() => setMonth((m) => (m === 12 ? 1 : m + 1))}>→</button>
          </span>
        }
      >
        <div className="month-grid">
          {SVATKY.filter((s) => s.month === month).map((s) => {
            const isToday = today.slice(5) === s.key;
            return (
              <div key={s.key} className={`month-cell ${isToday ? "is-today" : ""} ${s.names.length ? "" : "is-holiday"}`}>
                <span className="d">{s.day}.</span>
                <span>{s.text}</span>
              </div>
            );
          })}
        </div>
        <p className="small muted" style={{ marginTop: "0.75rem" }}>
          Chyba nebo chybějící jméno? Upravte řádek v souboru <code>src/lib/admin/svatky.ts</code> ({MONTH_NAMES[month - 1]}).
        </p>
      </Card>
    </>
  );
}

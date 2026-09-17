"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdmin } from "@/lib/admin/store";
import {
  DAY_SHORT,
  addDays,
  formatDate,
  fromIso,
  startOfWeek,
  todayIso,
} from "@/lib/admin/format";
import { svatekPro } from "@/lib/admin/svatky";
import { klicoveDnyRoku } from "@/lib/admin/klicove-dny";
import { ordersOn } from "@/lib/admin/select";
import { Loading, PageHead } from "@/components/admin/ui";
import { Ico } from "@/components/admin/icons";

export default function KalendarPage() {
  const { doc, ready } = useAdmin();
  const today = todayIso();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(today));

  if (!ready) return <Loading />;

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const year = Number(weekStart.slice(0, 4));
  const klicove = new Map(
    [...klicoveDnyRoku(year), ...klicoveDnyRoku(year + 1)].map((k) => [k.date, k])
  );
  const total = days.reduce((s, d) => s + ordersOn(doc.orders, d).length, 0);

  return (
    <>
      <PageHead
        title="Kalendář"
        sub={`${formatDate(days[0])} – ${formatDate(days[6])} · ${total} ${total === 1 ? "objednávka" : total < 5 ? "objednávky" : "objednávek"}`}
      >
        <button className="btn btn-ghost btn-sm" onClick={() => setWeekStart(addDays(weekStart, -7))}>
          ← předchozí
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => setWeekStart(startOfWeek(today))}>
          tento týden
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => setWeekStart(addDays(weekStart, 7))}>
          další →
        </button>
        <Link href="/admin/objednavky/nova" className="btn btn-primary btn-sm">
          <Ico.plus className="" /> Nová
        </Link>
      </PageHead>

      <div className="week">
        {days.map((d) => {
          const date = fromIso(d);
          const dow = date.getDay();
          const orders = ordersOn(doc.orders, d);
          const svatek = svatekPro(d);
          const kl = klicove.get(d);
          return (
            <div
              key={d}
              className={`week-day ${d === today ? "is-today" : ""} ${dow === 0 || dow === 6 ? "is-weekend" : ""}`}
            >
              <div className="week-day-head">
                <strong>{date.getDate()}.</strong>
                <span>{DAY_SHORT[dow]}</span>
              </div>
              {kl && <div className="week-note">★ {kl.name}</div>}
              {svatek && svatek.names.length > 0 && (
                <div className="week-note" style={{ color: "var(--stone)" }}>{svatek.text}</div>
              )}
              {orders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/objednavky/${o.id}`}
                  className={`week-item ${o.fulfillment === "rozvoz" ? "is-rozvoz" : ""} ${
                    o.status === "predana" ? "is-done" : ""
                  }`}
                >
                  <b>{o.time ?? "—"}</b> {o.customerName}
                  <br />
                  <span className="muted">{o.occasion}</span>
                </Link>
              ))}
              {orders.length === 0 && (
                <Link
                  href={`/admin/objednavky/nova?date=${d}`}
                  className="small muted"
                  style={{ display: "block", textAlign: "center", padding: "0.5rem 0" }}
                >
                  + přidat
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <p className="small muted" style={{ marginTop: "1rem" }}>
        Zelený proužek = vyzvednutí v krámu, cihlový = rozvoz. Předané objednávky jsou ztlumené.
      </p>
    </>
  );
}

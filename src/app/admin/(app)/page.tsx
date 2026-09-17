"use client";

import Link from "next/link";
import { useAdmin } from "@/lib/admin/store";
import {
  addDays,
  formatCzk,
  formatDateLong,
  formatDateShort,
  relativeDay,
  telHref,
  todayIso,
} from "@/lib/admin/format";
import { svatekPro } from "@/lib/admin/svatky";
import { nadchazejiciKlicoveDny } from "@/lib/admin/klicove-dny";
import {
  customerEvents,
  monthStats,
  ordersBetween,
  ordersOn,
  stockAlerts,
} from "@/lib/admin/select";
import { Badge, Card, Empty, LinkBtn, Loading, PageHead, Stat, StatusBadge } from "@/components/admin/ui";
import { Ico } from "@/components/admin/icons";

export default function DashboardPage() {
  const { doc, ready } = useAdmin();
  const today = todayIso();

  if (!ready) return <Loading />;

  const todayOrders = ordersOn(doc.orders, today);
  const week = ordersBetween(doc.orders, addDays(today, 1), addDays(today, 7));
  const alerts = stockAlerts(doc.stock, today);
  const events = customerEvents(doc.customers, today, 14);
  const stats = monthStats(doc.orders, today);
  const svatek = svatekPro(today);
  const klicove = nadchazejiciKlicoveDny(today, 45);
  const nextDays = [1, 2, 3, 4, 5, 6, 7].map((n) => addDays(today, n));
  const isEmpty = doc.orders.length === 0 && doc.customers.length === 0 && doc.stock.length === 0;

  return (
    <>
      <PageHead
        title={
          <>
            Dobrý den, <em>{formatDateLong(today)}</em>
          </>
        }
        sub={
          svatek
            ? svatek.names.length
              ? `Svátek má ${svatek.text}.`
              : svatek.text
            : undefined
        }
      >
        <LinkBtn href="/admin/objednavky/nova">
          <Ico.plus className="" /> Nová objednávka
        </LinkBtn>
      </PageHead>

      {isEmpty && (
        <div className="notice notice-ok">
          Admin je prázdný. Začněte první objednávkou, nebo si v{" "}
          <Link href="/admin/nastaveni" className="link">Nastavení</Link> načtěte ukázková data
          a proklikejte si, co všechno umí.
        </div>
      )}

      {alerts.length > 0 && (
        <div className="notice notice-warn">
          <strong>Sklad:</strong>{" "}
          {alerts
            .map((a) =>
              a.daysLeft < 0
                ? `${a.item.name} prošlo (${-a.daysLeft} d)`
                : a.daysLeft === 0
                  ? `${a.item.name} končí dnes`
                  : `${a.item.name} končí zítra`
            )
            .join(" · ")}{" "}
          — <Link href="/admin/sklad" className="link">zlevnit nebo odepsat</Link>
        </div>
      )}

      <div className="grid-3" style={{ marginBottom: "1rem" }}>
        <Card>
          <Stat label="Dnes k předání" value={todayOrders.length} sub={`${week.length} dalších tento týden`} />
        </Card>
        <Card>
          <Stat label="Otevřené objednávky" value={stats.open} sub={stats.unpaid ? `${stats.unpaid} nezaplacených` : "vše zaplaceno"} />
        </Card>
        <Card>
          <Stat label="Tržba tento měsíc" value={formatCzk(stats.revenue)} sub={`${stats.count} objednávek`} />
        </Card>
      </div>

      <div className="grid-2">
        <Card
          title="Dnes"
          action={<Link href="/admin/kalendar">celý týden →</Link>}
        >
          {todayOrders.length === 0 ? (
            <Empty>Na dnešek nic objednaného. Prodej z krámu jede dál.</Empty>
          ) : (
            <div className="list">
              {todayOrders.map((o) => (
                <Link key={o.id} href={`/admin/objednavky/${o.id}`} className="list-row">
                  <div className="list-when">
                    {o.time ?? "—"}
                    <small>{o.fulfillment === "rozvoz" ? "rozvoz" : "výdej"}</small>
                  </div>
                  <div>
                    <div className="list-title">
                      {o.customerName}{" "}
                      <span className="muted small">#{o.cislo}</span>
                    </div>
                    <div className="list-sub">{o.description || o.occasion}</div>
                  </div>
                  <div className="list-end">
                    <StatusBadge status={o.status} />
                    <span className="small mono">{formatCzk(o.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card title="Příštích 7 dní" action={<Link href="/admin/objednavky">všechny objednávky →</Link>}>
          {week.length === 0 ? (
            <Empty>Zatím žádné objednávky na příští dny.</Empty>
          ) : (
            <div className="list">
              {nextDays
                .filter((d) => week.some((o) => o.date === d))
                .map((d) => (
                  <div key={d} className="list-row" style={{ gridTemplateColumns: "auto 1fr" }}>
                    <div className="list-when">
                      {formatDateShort(d).split(" ")[0]}
                      <small>{formatDateShort(d).split(" ").slice(1).join(" ")}</small>
                    </div>
                    <div className="stack" style={{ gap: "0.3rem" }}>
                      {week
                        .filter((o) => o.date === d)
                        .map((o) => (
                          <Link key={o.id} href={`/admin/objednavky/${o.id}`} className="row" style={{ justifyContent: "space-between" }}>
                            <span>
                              <span className="list-title">{o.customerName}</span>{" "}
                              <span className="muted small">
                                {o.time ?? ""} {o.fulfillment === "rozvoz" ? "· rozvoz" : ""}
                              </span>
                            </span>
                            <StatusBadge status={o.status} />
                          </Link>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Card>

        <Card title="Sezóna a svátky" action={<Link href="/admin/svatky">kalendář →</Link>}>
          <div className="list">
            {klicove.slice(0, 4).map((k) => (
              <div key={k.name + k.date} className="list-row" style={{ gridTemplateColumns: "auto 1fr" }}>
                <div className="list-when">
                  {formatDateShort(k.date).split(" ").slice(1).join(" ")}
                  <small>{relativeDay(k.date, today)}</small>
                </div>
                <div>
                  <div className="list-title">
                    {k.name} {k.major && <Badge tone="gilt">velký den</Badge>}
                  </div>
                  <div className="list-sub" style={{ whiteSpace: "normal" }}>{k.tip}</div>
                </div>
              </div>
            ))}
            {nextDays.map((d) => {
              const s = svatekPro(d);
              return s && s.names.length ? (
                <div key={d} className="list-row" style={{ gridTemplateColumns: "auto 1fr", padding: "0.4rem 0" }}>
                  <div className="list-when" style={{ fontSize: "0.85rem" }}>
                    {formatDateShort(d).split(" ").slice(1).join(" ")}
                  </div>
                  <div className="small">
                    svátek má <strong>{s.text}</strong>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </Card>

        <Card title="Zákazníci — připomenout se" action={<Link href="/admin/zakaznici">všichni →</Link>}>
          {events.length === 0 ? (
            <Empty>
              Nikdo ze zákazníků nemá v příštích 14 dnech svátek ani narozeniny.
              <br />
              <span className="small">Data doplníte u zákazníka — pak se tu objeví včas.</span>
            </Empty>
          ) : (
            <div className="list">
              {events.map((e) => (
                <div key={e.customer.id + e.kind} className="list-row">
                  <div className="list-when">
                    {formatDateShort(e.date).split(" ").slice(1).join(" ")}
                    <small>{relativeDay(e.date, today)}</small>
                  </div>
                  <div>
                    <Link href={`/admin/zakaznici/${e.customer.id}`} className="list-title">
                      {e.customer.name}
                    </Link>
                    <div className="list-sub">{e.label}</div>
                  </div>
                  <a href={telHref(e.customer.phone)} className="btn btn-ghost btn-sm" aria-label="Zavolat">
                    <Ico.phone className="" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

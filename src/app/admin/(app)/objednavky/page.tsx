"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdmin } from "@/lib/admin/store";
import { formatCzk, formatDateShort, relativeDay, smsHref, todayIso, waHref } from "@/lib/admin/format";
import { isActive, sortByDateTime } from "@/lib/admin/select";
import { zpravaHotovo } from "@/lib/admin/zpravy";
import { ORDER_STATUS, ORDER_STATUS_ORDER, type OrderStatus } from "@/lib/admin/types";
import { Card, Empty, LinkBtn, Loading, PageHead, StatusBadge } from "@/components/admin/ui";
import { Ico } from "@/components/admin/icons";

type Filter = "otevrene" | "dnes" | "vse" | OrderStatus;

export default function ObjednavkyPage() {
  const { doc, ready } = useAdmin();
  const [filter, setFilter] = useState<Filter>("otevrene");
  const [q, setQ] = useState("");
  const today = todayIso();

  const rows = useMemo(() => {
    let list = doc.orders;
    if (filter === "otevrene") list = list.filter((o) => isActive(o.status));
    else if (filter === "dnes") list = list.filter((o) => o.date === today && o.status !== "zrusena");
    else if (filter !== "vse") list = list.filter((o) => o.status === filter);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.customerName.toLowerCase().includes(needle) ||
          o.customerPhone.replace(/\s/g, "").includes(needle.replace(/\s/g, "")) ||
          o.description.toLowerCase().includes(needle) ||
          String(o.cislo) === needle.replace("#", "")
      );
    }
    const sorted = sortByDateTime(list);
    // Otevřené: od nejbližšího termínu. Ostatní: od nejnovějšího.
    return filter === "otevrene" || filter === "dnes" ? sorted : sorted.reverse();
  }, [doc.orders, filter, q, today]);

  if (!ready) return <Loading />;

  const chips: { key: Filter; label: string }[] = [
    { key: "otevrene", label: "Otevřené" },
    { key: "dnes", label: "Dnes" },
    ...ORDER_STATUS_ORDER.map((s) => ({ key: s as Filter, label: ORDER_STATUS[s].label })),
    { key: "vse", label: "Vše" },
  ];

  return (
    <>
      <PageHead title="Objednávky" sub="Kytice na objednávku — vyzvednutí i rozvoz.">
        <LinkBtn href="/admin/objednavky/nova">
          <Ico.plus className="" /> Nová objednávka
        </LinkBtn>
      </PageHead>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Hledat jméno, telefon, číslo…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="chips">
          {chips.map((c) => (
            <button key={c.key} className="chip" aria-pressed={filter === c.key} onClick={() => setFilter(c.key)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <Card>
        {rows.length === 0 ? (
          <Empty>Nic tu není. {filter !== "vse" && "Zkuste jiný filtr."}</Empty>
        ) : (
          <div className="list">
            {rows.map((o) => (
              <div key={o.id} className="list-obal">
              <Link href={`/admin/objednavky/${o.id}`} className="list-row">
                <div className="list-when">
                  {formatDateShort(o.date).split(" ").slice(1).join(" ")}
                  <small>{o.time ?? relativeDay(o.date, today)}</small>
                </div>
                <div>
                  <div className="list-title">
                    {o.customerName} <span className="muted small">#{o.cislo}</span>
                    {o.fulfillment === "rozvoz" && <span className="badge badge-terracotta" style={{ marginLeft: "0.5rem" }}>rozvoz</span>}
                  </div>
                  <div className="list-sub">
                    {o.occasion} · {o.description}
                  </div>
                </div>
                <div className="list-end">
                  <StatusBadge status={o.status} />
                  <span className="small mono">
                    {formatCzk(o.price)}
                    {!o.paid && (o.price ?? 0) > 0 && <span className="muted"> · nezapl.</span>}
                  </span>
                </div>
              </Link>
              {/* Zpráva rovnou ze seznamu: proklik do detailu kvůli jedné
                  zprávě je ten klik navíc, kvůli kterému se to přestane
                  používat. Jen u hotových — jinde není co hlásit. */}
              {o.status === "hotova" && (
                <div className="list-akce">
                  <a
                    href={waHref(o.customerPhone, zpravaHotovo(o))}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-sm"
                  >
                    WhatsApp: hotová
                  </a>
                  <a href={smsHref(o.customerPhone, zpravaHotovo(o))} className="btn btn-ghost btn-sm">
                    SMS
                  </a>
                </div>
              )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}

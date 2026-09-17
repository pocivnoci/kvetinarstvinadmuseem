"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdmin } from "@/lib/admin/store";
import { formatCzk, formatDateLong, formatPhone } from "@/lib/admin/format";
import { SITE } from "@/lib/site";
import { Empty, Loading, PageHead } from "@/components/admin/ui";
import { Ico } from "@/components/admin/icons";

/**
 * Tisk: průvodka k objednávce (pro dílnu / kurýra) a kartička s přáním.
 * Každý blok je samostatná stránka. Zapnout v tiskovém dialogu „Bez okrajů“
 * není třeba — počítá se s běžnými okraji.
 */
export default function TiskPage() {
  const { id } = useParams<{ id: string }>();
  const { doc, ready } = useAdmin();

  if (!ready) return <Loading />;
  const order = doc.orders.find((o) => o.id === id);
  if (!order) return <Empty>Objednávka nenalezena.</Empty>;

  return (
    <>
      <div className="no-print">
        <PageHead title={`Tisk #${order.cislo}`} sub="Průvodka pro dílnu a kartička s přáním. Každá na vlastní stránce.">
          <Link href={`/admin/objednavky/${order.id}`} className="btn btn-ghost btn-sm">← zpět</Link>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
            <Ico.print className="" /> Tisknout
          </button>
        </PageHead>
      </div>

      <div className="print-sheet">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.1rem" }}>
            Květiny nad museem
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem" }}>#{order.cislo}</div>
        </div>
        <hr style={{ border: 0, borderTop: "1px solid #c8c2b6", margin: "0.75rem 0 1rem" }} />

        <dl className="kv" style={{ fontSize: "1rem", rowGap: "0.55rem" }}>
          <dt>Termín</dt>
          <dd>
            <strong>
              {formatDateLong(order.date)}
              {order.time ? `, ${order.time}` : ""}
            </strong>
          </dd>
          <dt>Předání</dt>
          <dd>{order.fulfillment === "rozvoz" ? `ROZVOZ — ${order.address ?? ""}` : "Vyzvednutí v krámu"}</dd>
          {order.recipientName && (
            <>
              <dt>Příjemce</dt>
              <dd>
                {order.recipientName}
                {order.recipientPhone ? ` · ${formatPhone(order.recipientPhone)}` : ""}
              </dd>
            </>
          )}
          <dt>Zákazník</dt>
          <dd>
            {order.customerName} · {formatPhone(order.customerPhone)}
          </dd>
          <dt>Příležitost</dt>
          <dd>{order.occasion}</dd>
          <dt>Kytice</dt>
          <dd style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", lineHeight: 1.5 }}>{order.description}</dd>
          {order.cardMessage && (
            <>
              <dt>Kartička</dt>
              <dd>ano — přiložit</dd>
            </>
          )}
          <dt>Cena</dt>
          <dd>
            {formatCzk(order.price)}
            {order.paid
              ? " · ZAPLACENO"
              : (order.deposit ?? 0) > 0
                ? ` · záloha ${formatCzk(order.deposit)} · doplatek ${formatCzk((order.price ?? 0) - (order.deposit ?? 0))}`
                : " · k úhradě při předání"}
          </dd>
          {order.note && (
            <>
              <dt>Poznámka</dt>
              <dd>{order.note}</dd>
            </>
          )}
        </dl>
        <p className="small" style={{ marginTop: "1.5rem", color: "#8c8579" }}>
          {SITE.phone} · {SITE.email} · Vinohradská 6, Praha 2
        </p>
      </div>

      {order.cardMessage && (
        <div className="print-card">
          <div className="msg">{order.cardMessage}</div>
          <div className="from">Květiny nad museem</div>
        </div>
      )}
    </>
  );
}

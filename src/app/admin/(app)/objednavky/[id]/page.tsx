"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useAdmin } from "@/lib/admin/store";
import { formatCzk, formatDateLong, formatPhone, smsHref, telHref, waHref } from "@/lib/admin/format";
import { findCustomerByPhone } from "@/lib/admin/select";
import { zpravaHotovo } from "@/lib/admin/zpravy";
import { ORDER_STATUS, ORDER_STATUS_ORDER, type OrderStatus } from "@/lib/admin/types";
import { OrderForm } from "@/components/admin/OrderForm";
import { Card, Empty, Loading, PageHead, StatusBadge } from "@/components/admin/ui";
import { Ico } from "@/components/admin/icons";

/** Další logický krok pro tlačítko „posunout dál“. */
const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  nova: "potvrzena",
  potvrzena: "v-priprave",
  "v-priprave": "hotova",
  hotova: "predana",
};

export default function ObjednavkaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { doc, ready, update } = useAdmin();
  const [editing, setEditing] = useState(false);

  if (!ready) return <Loading />;

  const order = doc.orders.find((o) => o.id === id);
  if (!order) {
    return (
      <>
        <PageHead title="Objednávka nenalezena" />
        <Empty>
          Tahle objednávka v tomto prohlížeči není. <Link href="/admin/objednavky" className="link">Zpět na seznam</Link>
        </Empty>
      </>
    );
  }

  const customer = findCustomerByPhone(doc.customers, order.customerPhone);
  const next = NEXT[order.status];

  function setStatus(status: OrderStatus) {
    update((d) => ({
      ...d,
      orders: d.orders.map((o) =>
        o.id === order!.id ? { ...o, status, updatedAt: new Date().toISOString() } : o
      ),
    }));
  }

  function togglePaid() {
    update((d) => ({
      ...d,
      orders: d.orders.map((o) => (o.id === order!.id ? { ...o, paid: !o.paid } : o)),
    }));
  }

  function remove() {
    if (!window.confirm(`Opravdu smazat objednávku #${order!.cislo}? Tohle nejde vrátit.`)) return;
    update((d) => ({ ...d, orders: d.orders.filter((o) => o.id !== order!.id) }));
    router.push("/admin/objednavky");
  }

  if (editing) {
    return (
      <>
        <PageHead title={`Upravit #${order.cislo}`}>
          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Zrušit</button>
        </PageHead>
        <OrderForm order={order} onSaved={() => setEditing(false)} />
      </>
    );
  }

  const balance = (order.price ?? 0) - (order.deposit ?? 0);

  return (
    <>
      <PageHead
        title={
          <>
            #{order.cislo} · {order.customerName}
          </>
        }
        sub={
          <>
            {formatDateLong(order.date)}
            {order.time ? ` v ${order.time}` : ""} ·{" "}
            {order.fulfillment === "rozvoz" ? "rozvoz" : "vyzvednutí v krámu"}
          </>
        }
      >
        <StatusBadge status={order.status} />
        {next && (
          <button className="btn btn-primary btn-sm" onClick={() => setStatus(next)}>
            → {ORDER_STATUS[next].label}
          </button>
        )}
        <Link href={`/admin/objednavky/${order.id}/tisk`} className="btn btn-ghost btn-sm">
          <Ico.print className="" /> Tisk
        </Link>
        <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>Upravit</button>
      </PageHead>

      <div className="grid-2">
        <Card title="Kytice">
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", lineHeight: 1.55 }}>{order.description}</p>
          <dl className="kv" style={{ marginTop: "1rem" }}>
            <dt>Příležitost</dt>
            <dd>{order.occasion}</dd>
            {order.cardMessage && (
              <>
                <dt>Kartička</dt>
                <dd style={{ fontFamily: "var(--font-display)", fontStyle: "italic", whiteSpace: "pre-wrap" }}>
                  {order.cardMessage}
                </dd>
              </>
            )}
            {order.note && (
              <>
                <dt>Poznámka</dt>
                <dd className="muted">{order.note}</dd>
              </>
            )}
          </dl>
        </Card>

        <Card title="Zákazník">
          <dl className="kv">
            <dt>Jméno</dt>
            <dd>
              {customer ? (
                <Link href={`/admin/zakaznici/${customer.id}`} className="link">{order.customerName}</Link>
              ) : (
                order.customerName
              )}
            </dd>
            <dt>Telefon</dt>
            <dd className="row">
              <span className="mono">{formatPhone(order.customerPhone)}</span>
              <a href={telHref(order.customerPhone)} className="btn btn-ghost btn-sm">Zavolat</a>
              <a href={waHref(order.customerPhone)} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">WhatsApp</a>
            </dd>
            <dt>Kytice je hotová</dt>
            <dd>
              <div className="row">
                <a
                  href={waHref(order.customerPhone, zpravaHotovo(order))}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  Poslat na WhatsApp
                </a>
                {/* SMS musí být vedle: kdo WhatsApp nemá, tomu zpráva nedojde
                    a floristka o tom neví. */}
                <a href={smsHref(order.customerPhone, zpravaHotovo(order))} className="btn btn-ghost btn-sm">
                  Poslat SMS
                </a>
              </div>
              <p className="small zprava-nahled">{zpravaHotovo(order)}</p>
            </dd>
            {order.customerEmail && (
              <>
                <dt>E-mail</dt>
                <dd><a href={`mailto:${order.customerEmail}`} className="link">{order.customerEmail}</a></dd>
              </>
            )}
            {customer?.note && (
              <>
                <dt>Víme o něm</dt>
                <dd className="small" style={{ fontFamily: "var(--font-body)" }}>{customer.note}</dd>
              </>
            )}
          </dl>
          {order.fulfillment === "rozvoz" && (
            <div className="form-section">
              <h3>Doručení</h3>
              <dl className="kv">
                <dt>Adresa</dt>
                <dd>
                  {order.address}{" "}
                  <a
                    className="link small"
                    target="_blank"
                    rel="noreferrer"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address ?? "")}`}
                  >
                    navigovat
                  </a>
                </dd>
                {order.recipientName && (
                  <>
                    <dt>Příjemce</dt>
                    <dd>
                      {order.recipientName}
                      {order.recipientPhone && (
                        <>
                          {" · "}
                          <a href={telHref(order.recipientPhone)} className="link">{formatPhone(order.recipientPhone)}</a>
                        </>
                      )}
                    </dd>
                  </>
                )}
              </dl>
            </div>
          )}
        </Card>

        <Card title="Platba">
          <dl className="kv">
            <dt>Cena</dt>
            <dd className="mono">{formatCzk(order.price)}</dd>
            <dt>Záloha</dt>
            <dd className="mono">{formatCzk(order.deposit ?? 0)}</dd>
            <dt>Doplatek</dt>
            <dd className="mono">
              <strong>{order.paid ? "0 Kč" : formatCzk(Math.max(0, balance))}</strong>
            </dd>
          </dl>
          <label className="check" style={{ marginTop: "1rem" }}>
            <input type="checkbox" checked={order.paid} onChange={togglePaid} />
            Zaplaceno v plné výši
          </label>
        </Card>

        <Card title="Stav">
          <div className="chips">
            {ORDER_STATUS_ORDER.map((s) => (
              <button key={s} className="chip" aria-pressed={order.status === s} onClick={() => setStatus(s)}>
                {ORDER_STATUS[s].label}
              </button>
            ))}
          </div>
          <p className="small muted" style={{ marginTop: "1rem" }}>
            Založeno {new Date(order.createdAt).toLocaleString("cs-CZ")}
            {order.updatedAt !== order.createdAt && ` · upraveno ${new Date(order.updatedAt).toLocaleString("cs-CZ")}`}
          </p>
          <div className="row" style={{ marginTop: "1rem", justifyContent: "flex-end" }}>
            <button className="btn btn-danger btn-sm" onClick={remove}>
              <Ico.trash className="" /> Smazat objednávku
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}

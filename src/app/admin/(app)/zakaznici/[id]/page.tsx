"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useAdmin } from "@/lib/admin/store";
import { formatCzk, formatDate, formatPhone, telHref, waHref } from "@/lib/admin/format";
import { customerOrders } from "@/lib/admin/select";
import { svatekJmena } from "@/lib/admin/svatky";
import { MONTH_NAMES } from "@/lib/admin/format";
import { CustomerForm } from "@/components/admin/CustomerForm";
import { Card, Empty, Loading, PageHead, StatusBadge } from "@/components/admin/ui";
import { Ico } from "@/components/admin/icons";

export default function ZakaznikDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { doc, ready, update } = useAdmin();
  const [editing, setEditing] = useState(false);

  if (!ready) return <Loading />;
  const c = doc.customers.find((x) => x.id === id);
  if (!c) return <Empty>Zákazník nenalezen. <Link href="/admin/zakaznici" className="link">Zpět</Link></Empty>;

  const orders = customerOrders(doc.orders, c);
  const spent = orders.filter((o) => o.status === "predana").reduce((s, o) => s + (o.price ?? 0), 0);
  const sv = c.namedayName ? svatekJmena(c.namedayName) : undefined;

  function remove() {
    if (!window.confirm(`Smazat zákazníka ${c!.name}? Objednávky zůstanou.`)) return;
    update((d) => ({ ...d, customers: d.customers.filter((x) => x.id !== c!.id) }));
    router.push("/admin/zakaznici");
  }

  if (editing) {
    return (
      <>
        <PageHead title={`Upravit — ${c.name}`} />
        <CustomerForm customer={c} onSaved={() => setEditing(false)} onCancel={() => setEditing(false)} />
      </>
    );
  }

  return (
    <>
      <PageHead title={c.name} sub={`Zákazník od ${formatDate(c.createdAt.slice(0, 10))}`}>
        <a href={telHref(c.phone)} className="btn btn-ghost btn-sm"><Ico.phone className="" /> Zavolat</a>
        <a href={waHref(c.phone)} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">WhatsApp</a>
        <Link href={`/admin/objednavky/nova`} className="btn btn-primary btn-sm">
          <Ico.plus className="" /> Objednávka
        </Link>
        <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>Upravit</button>
      </PageHead>

      <div className="grid-2">
        <Card title="Kontakt a preference">
          <dl className="kv">
            <dt>Telefon</dt>
            <dd className="mono">{formatPhone(c.phone)}</dd>
            {c.email && (<><dt>E-mail</dt><dd>{c.email}</dd></>)}
            {c.address && (<><dt>Adresa</dt><dd>{c.address}</dd></>)}
            {sv && (
              <>
                <dt>Svátek</dt>
                <dd>{sv.day}. {MONTH_NAMES[sv.month - 1]} ({c.namedayName})</dd>
              </>
            )}
            {c.birthday && (
              <>
                <dt>Narozeniny</dt>
                <dd>{Number(c.birthday.slice(3))}. {MONTH_NAMES[Number(c.birthday.slice(0, 2)) - 1]}</dd>
              </>
            )}
            <dt>Poznámka</dt>
            <dd style={{ fontFamily: "var(--font-body)" }}>{c.note || <span className="muted">—</span>}</dd>
          </dl>
          <div className="row" style={{ marginTop: "1.25rem", justifyContent: "flex-end" }}>
            <button className="btn btn-danger btn-sm" onClick={remove}><Ico.trash className="" /> Smazat</button>
          </div>
        </Card>

        <Card title={`Objednávky (${orders.length})`} action={<span className="small muted">utraceno {formatCzk(spent)}</span>}>
          {orders.length === 0 ? (
            <Empty>Zatím žádná objednávka.</Empty>
          ) : (
            <div className="list">
              {orders.map((o) => (
                <Link key={o.id} href={`/admin/objednavky/${o.id}`} className="list-row">
                  <div className="list-when" style={{ fontSize: "0.9rem" }}>{formatDate(o.date)}</div>
                  <div>
                    <div className="list-title">{o.occasion} <span className="muted small">#{o.cislo}</span></div>
                    <div className="list-sub">{o.description}</div>
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
      </div>
    </>
  );
}

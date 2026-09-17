"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdmin } from "@/lib/admin/store";
import { formatPhone, normalizePhone, telHref } from "@/lib/admin/format";
import { CustomerForm } from "@/components/admin/CustomerForm";
import { Card, Empty, Loading, PageHead } from "@/components/admin/ui";
import { Ico } from "@/components/admin/icons";

export default function ZakazniciPage() {
  const { doc, ready } = useAdmin();
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);

  const orderCount = useMemo(() => {
    const m = new Map<string, number>();
    for (const o of doc.orders) {
      const p = normalizePhone(o.customerPhone);
      m.set(p, (m.get(p) ?? 0) + 1);
    }
    return m;
  }, [doc.orders]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const digits = needle.replace(/\D/g, "");
    return [...doc.customers]
      .filter(
        (c) =>
          !needle ||
          c.name.toLowerCase().includes(needle) ||
          (digits && normalizePhone(c.phone).includes(digits)) ||
          (c.note ?? "").toLowerCase().includes(needle)
      )
      .sort((a, b) => a.name.localeCompare(b.name, "cs"));
  }, [doc.customers, q]);

  if (!ready) return <Loading />;

  return (
    <>
      <PageHead title="Zákazníci" sub="Kdo k vám chodí, co má rád a kdy má svátek. Založí se sami z objednávek.">
        <button className="btn btn-primary" onClick={() => setAdding((v) => !v)}>
          <Ico.plus className="" /> Nový zákazník
        </button>
      </PageHead>

      {adding && (
        <div style={{ marginBottom: "1rem" }}>
          <CustomerForm onSaved={() => setAdding(false)} onCancel={() => setAdding(false)} />
        </div>
      )}

      <div className="toolbar">
        <input type="search" placeholder="Hledat jméno, telefon, poznámku…" value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="small muted">{doc.customers.length} zákazníků</span>
      </div>

      <Card>
        {rows.length === 0 ? (
          <Empty>Zatím žádní zákazníci.</Empty>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Jméno</th>
                  <th>Telefon</th>
                  <th>Svátek / narozeniny</th>
                  <th>Poznámka</th>
                  <th className="num">Objednávek</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/admin/zakaznici/${c.id}`} className="link" style={{ fontWeight: 600 }}>{c.name}</Link>
                    </td>
                    <td className="mono">{formatPhone(c.phone)}</td>
                    <td className="small">
                      {c.namedayName ? `sv. ${c.namedayName}` : ""}
                      {c.namedayName && c.birthday ? " · " : ""}
                      {c.birthday ? `nar. ${Number(c.birthday.slice(3))}. ${Number(c.birthday.slice(0, 2))}.` : ""}
                    </td>
                    <td className="small muted" style={{ maxWidth: "22rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.note}
                    </td>
                    <td className="num">{orderCount.get(normalizePhone(c.phone)) ?? 0}</td>
                    <td>
                      <a href={telHref(c.phone)} className="btn btn-ghost btn-sm" aria-label="Zavolat">
                        <Ico.phone className="" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

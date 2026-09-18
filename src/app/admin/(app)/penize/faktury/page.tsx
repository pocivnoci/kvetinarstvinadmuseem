"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "@/lib/admin/store";
import { daysBetween, formatCzk, formatDate, todayIso } from "@/lib/admin/format";
import { INVOICE_KIND, type Invoice, type InvoiceKind } from "@/lib/admin/types";
import { InvoiceForm } from "@/components/admin/InvoiceForm";
import { MoneyTabs } from "@/components/admin/MoneyTabs";
import { FixedCosts } from "@/components/admin/FixedCosts";
import { Badge, Card, Empty, Loading, PageHead } from "@/components/admin/ui";
import { Ico } from "@/components/admin/icons";

type Filter = "vse" | InvoiceKind | "nezaplacene" | "po-splatnosti";

export default function FakturyPage() {
  const { doc, ready, update } = useAdmin();
  const today = todayIso();
  const [filter, setFilter] = useState<Filter>("nezaplacene");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Invoice | "new" | null>(null);

  const rows = useMemo(() => {
    let list = doc.invoices;
    if (filter === "prijata" || filter === "vydana") list = list.filter((i) => i.kind === filter);
    else if (filter === "nezaplacene") list = list.filter((i) => !i.paid);
    else if (filter === "po-splatnosti") list = list.filter((i) => !i.paid && i.dueAt && i.dueAt < today);
    if (q.trim()) {
      const n = q.trim().toLowerCase();
      list = list.filter(
        (i) => i.party.toLowerCase().includes(n) || i.number.toLowerCase().includes(n) || (i.category ?? "").toLowerCase().includes(n)
      );
    }
    return [...list].sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
  }, [doc.invoices, filter, q, today]);

  if (!ready) return <Loading />;

  function togglePaid(i: Invoice) {
    update((d) => ({
      ...d,
      invoices: d.invoices.map((x) =>
        x.id === i.id ? { ...x, paid: !x.paid, paidAt: !x.paid ? todayIso() : undefined } : x
      ),
    }));
  }

  function remove(i: Invoice) {
    if (!window.confirm(`Smazat fakturu ${i.number} od ${i.party}?`)) return;
    update((d) => ({ ...d, invoices: d.invoices.filter((x) => x.id !== i.id) }));
  }

  const owedToUs = doc.invoices.filter((i) => i.kind === "vydana" && !i.paid).reduce((s, i) => s + i.amount, 0);
  const weOwe = doc.invoices.filter((i) => i.kind === "prijata" && !i.paid).reduce((s, i) => s + i.amount, 0);

  const chips: { key: Filter; label: string }[] = [
    { key: "nezaplacene", label: "Nezaplacené" },
    { key: "po-splatnosti", label: "Po splatnosti" },
    { key: "prijata", label: "Přijaté" },
    { key: "vydana", label: "Vydané" },
    { key: "vse", label: "Vše" },
  ];

  return (
    <>
      <PageHead title="Faktury" sub="Přijaté faktury jsou výdaje, vydané příjem. Do měsíce patří podle data vystavení.">
        <button className="btn btn-primary" onClick={() => setEditing("new")}>
          <Ico.plus className="" /> Nová faktura
        </button>
      </PageHead>

      <MoneyTabs />

      {editing && <InvoiceForm invoice={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} />}

      <FixedCosts />

      <div className="grid-2" style={{ marginBottom: "1rem" }}>
        <Card>
          <div className="stat">
            <span className="stat-label">Dluží nám zákazníci</span>
            <span className="stat-value">{formatCzk(owedToUs)}</span>
            <span className="stat-sub">nezaplacené vydané faktury</span>
          </div>
        </Card>
        <Card>
          <div className="stat">
            <span className="stat-label">Dlužíme dodavatelům</span>
            <span className="stat-value">{formatCzk(weOwe)}</span>
            <span className="stat-sub">nezaplacené přijaté faktury</span>
          </div>
        </Card>
      </div>

      <div className="toolbar">
        <input type="search" placeholder="Hledat dodavatele, číslo, kategorii…" value={q} onChange={(e) => setQ(e.target.value)} />
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
          <Empty>Žádná faktura neodpovídá filtru.</Empty>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Protistrana</th>
                  <th>Typ</th>
                  <th>Vystaveno</th>
                  <th>Splatnost</th>
                  <th className="num">Částka</th>
                  <th>Stav</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((i) => {
                  const late = !i.paid && i.dueAt && i.dueAt < today;
                  const daysLate = late ? -daysBetween(today, i.dueAt!) : 0;
                  return (
                    <tr key={i.id}>
                      <td>
                        <button className="link" style={{ fontWeight: 600, textAlign: "left" }} onClick={() => setEditing(i)}>
                          {i.party}
                        </button>
                        <div className="small muted">
                          {i.number}
                          {i.category ? ` · ${i.category}` : ""}
                          {i.note ? ` · ${i.note}` : ""}
                        </div>
                      </td>
                      <td className="small">{INVOICE_KIND[i.kind].short}</td>
                      <td className="small" style={{ whiteSpace: "nowrap" }}>{formatDate(i.issuedAt)}</td>
                      <td className="small" style={{ whiteSpace: "nowrap" }}>{i.dueAt ? formatDate(i.dueAt) : "—"}</td>
                      <td className="num">
                        <strong style={{ color: i.kind === "prijata" ? "var(--terracotta)" : "inherit" }}>
                          {i.kind === "prijata" ? "−" : "+"}
                          {formatCzk(i.amount)}
                        </strong>
                      </td>
                      <td>
                        {i.paid ? (
                          <Badge tone="sage">zaplaceno</Badge>
                        ) : late ? (
                          <Badge tone="danger">{daysLate} {daysLate < 5 ? "dny" : "dní"} po splatnosti</Badge>
                        ) : (
                          <Badge tone="gilt">čeká</Badge>
                        )}
                      </td>
                      <td>
                        <div className="row" style={{ flexWrap: "nowrap", justifyContent: "flex-end" }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => togglePaid(i)}>
                            {i.paid ? "vrátit" : "zaplaceno"}
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => remove(i)} aria-label="Smazat">
                            <Ico.trash className="" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

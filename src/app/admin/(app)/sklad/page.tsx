"use client";

import { useMemo, useState, type FormEvent } from "react";
import { newId, useAdmin } from "@/lib/admin/store";
import { addDays, daysBetween, formatCzk, formatDate, parseNumber, todayIso } from "@/lib/admin/format";
import { stockAlerts, stockValue } from "@/lib/admin/select";
import { STOCK_CATEGORY, type StockCategory, type StockItem } from "@/lib/admin/types";
import { Badge, Card, Empty, Field, Loading, PageHead } from "@/components/admin/ui";
import { Ico } from "@/components/admin/icons";

type Draft = {
  name: string;
  category: StockCategory;
  qty: string;
  unit: string;
  costPrice: string;
  salePrice: string;
  receivedAt: string;
  shelfLifeDays: string;
  supplier: string;
  note: string;
};

const DEFAULT_SHELF: Record<StockCategory, string> = { rezane: "7", hrnkove: "0", susene: "0", doplnky: "0" };

function toDraft(i?: StockItem): Draft {
  return {
    name: i?.name ?? "",
    category: i?.category ?? "rezane",
    qty: i ? String(i.qty) : "",
    unit: i?.unit ?? "ks",
    costPrice: i ? String(i.costPrice) : "",
    salePrice: i?.salePrice !== undefined ? String(i.salePrice) : "",
    receivedAt: i?.receivedAt ?? todayIso(),
    shelfLifeDays: i ? String(i.shelfLifeDays) : DEFAULT_SHELF.rezane,
    supplier: i?.supplier ?? "",
    note: i?.note ?? "",
  };
}

export default function SkladPage() {
  const { doc, ready, update } = useAdmin();
  const today = todayIso();
  const [editing, setEditing] = useState<StockItem | "new" | null>(null);
  const [cat, setCat] = useState<StockCategory | "vse">("vse");
  const [q, setQ] = useState("");

  const alerts = useMemo(() => stockAlerts(doc.stock, today), [doc.stock, today]);
  const alertIds = new Set(alerts.map((a) => a.item.id));

  const rows = useMemo(
    () =>
      [...doc.stock]
        .filter((s) => cat === "vse" || s.category === cat)
        .filter((s) => !q.trim() || s.name.toLowerCase().includes(q.trim().toLowerCase()))
        .sort((a, b) => {
          const ae = alertIds.has(a.id) ? 0 : 1;
          const be = alertIds.has(b.id) ? 0 : 1;
          return ae - be || a.category.localeCompare(b.category) || a.name.localeCompare(b.name, "cs");
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [doc.stock, cat, q, alerts]
  );

  if (!ready) return <Loading />;

  function adjust(id: string, delta: number) {
    update((d) => ({
      ...d,
      stock: d.stock.map((s) => (s.id === id ? { ...s, qty: Math.max(0, s.qty + delta) } : s)),
    }));
  }

  function remove(item: StockItem) {
    if (!window.confirm(`Odepsat ${item.name} ze skladu?`)) return;
    update((d) => ({ ...d, stock: d.stock.filter((s) => s.id !== item.id) }));
  }

  const totalValue = stockValue(doc.stock);

  return (
    <>
      <PageHead title="Sklad" sub="Co je na krámě, za kolik a do kdy to vydrží. Hlídá řezané zboží, kterému dochází čas.">
        <button className="btn btn-primary" onClick={() => setEditing("new")}>
          <Ico.plus className="" /> Naskladnit
        </button>
      </PageHead>

      {editing && (
        <StockForm
          item={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}

      {alerts.length > 0 && (
        <div className="notice notice-warn">
          <strong>Dochází trvanlivost:</strong>{" "}
          {alerts.map((a) => `${a.item.name} (${a.daysLeft < 0 ? `prošlo před ${-a.daysLeft} d` : a.daysLeft === 0 ? "dnes" : "zítra"})`).join(" · ")}.
          Zlevnit do „poslední kytice“, dát do vazby, nebo odepsat.
        </div>
      )}

      <div className="toolbar">
        <input type="search" placeholder="Hledat…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="chips">
          <button className="chip" aria-pressed={cat === "vse"} onClick={() => setCat("vse")}>Vše</button>
          {(Object.keys(STOCK_CATEGORY) as StockCategory[]).map((k) => (
            <button key={k} className="chip" aria-pressed={cat === k} onClick={() => setCat(k)}>{STOCK_CATEGORY[k]}</button>
          ))}
        </div>
        <span className="small muted" style={{ marginLeft: "auto" }}>
          hodnota skladu v nákupu {formatCzk(totalValue)}
        </span>
      </div>

      <Card>
        {rows.length === 0 ? (
          <Empty>Sklad je prázdný. Naskladněte první dodávku.</Empty>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Položka</th>
                  <th className="num">Množství</th>
                  <th className="num">Nákup / ks</th>
                  <th className="num">Prodej / ks</th>
                  <th>Naskladněno</th>
                  <th>Spotřebovat do</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => {
                  const expires = s.shelfLifeDays > 0 ? addDays(s.receivedAt, s.shelfLifeDays) : undefined;
                  const left = expires ? daysBetween(today, expires) : undefined;
                  return (
                    <tr key={s.id}>
                      <td>
                        <button className="link" style={{ fontWeight: 600, textAlign: "left" }} onClick={() => setEditing(s)}>
                          {s.name}
                        </button>
                        <div className="small muted">
                          {STOCK_CATEGORY[s.category]}
                          {s.supplier ? ` · ${s.supplier}` : ""}
                          {s.note ? ` · ${s.note}` : ""}
                        </div>
                      </td>
                      <td className="num">
                        <span className="row" style={{ justifyContent: "flex-end", flexWrap: "nowrap", gap: "0.3rem" }}>
                          <button className="btn btn-ghost btn-sm" style={{ padding: "0.25rem 0.5rem" }} onClick={() => adjust(s.id, -1)} aria-label="Ubrat">−</button>
                          <strong style={{ minWidth: "2.5rem", textAlign: "center" }}>{s.qty} {s.unit}</strong>
                          <button className="btn btn-ghost btn-sm" style={{ padding: "0.25rem 0.5rem" }} onClick={() => adjust(s.id, 1)} aria-label="Přidat">+</button>
                        </span>
                      </td>
                      <td className="num">{formatCzk(s.costPrice)}</td>
                      <td className="num">{s.salePrice !== undefined ? formatCzk(s.salePrice) : <span className="muted">—</span>}</td>
                      <td className="small">{formatDate(s.receivedAt)}</td>
                      <td className="small">
                        {expires ? (
                          <>
                            {formatDate(expires)}{" "}
                            {left !== undefined && left < 0 && <Badge tone="danger">prošlo</Badge>}
                            {left === 0 && <Badge tone="terracotta">dnes</Badge>}
                            {left === 1 && <Badge tone="gilt">zítra</Badge>}
                            {left !== undefined && left > 1 && <span className="muted">za {left} d</span>}
                          </>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(s)} aria-label="Odepsat">
                          <Ico.trash className="" />
                        </button>
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

function StockForm({ item, onClose }: { item?: StockItem; onClose: () => void }) {
  const { update } = useAdmin();
  const [d, setD] = useState<Draft>(() => toDraft(item));
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: StockItem = {
      id: item?.id ?? newId(),
      name: d.name.trim(),
      category: d.category,
      qty: parseNumber(d.qty) ?? 0,
      unit: d.unit.trim() || "ks",
      costPrice: parseNumber(d.costPrice) ?? 0,
      salePrice: parseNumber(d.salePrice),
      receivedAt: d.receivedAt,
      shelfLifeDays: parseNumber(d.shelfLifeDays) ?? 0,
      supplier: d.supplier.trim() || undefined,
      note: d.note.trim() || undefined,
    };
    update((doc) => ({
      ...doc,
      stock: item ? doc.stock.map((s) => (s.id === item.id ? next : s)) : [...doc.stock, next],
    }));
    onClose();
  }

  return (
    <form onSubmit={submit} className="card" style={{ marginBottom: "1rem" }}>
      <div className="card-title">
        <h2>{item ? `Upravit — ${item.name}` : "Naskladnit"}</h2>
      </div>
      <div className="form-grid">
        <Field label="Název">
          <input type="text" required value={d.name} onChange={(e) => set("name", e.target.value)} placeholder="Růže Red Naomi 60 cm" />
        </Field>
        <Field label="Kategorie">
          <select
            value={d.category}
            onChange={(e) => {
              const c = e.target.value as StockCategory;
              set("category", c);
              if (!item) set("shelfLifeDays", DEFAULT_SHELF[c]);
            }}
          >
            {(Object.keys(STOCK_CATEGORY) as StockCategory[]).map((k) => (
              <option key={k} value={k}>{STOCK_CATEGORY[k]}</option>
            ))}
          </select>
        </Field>
        <div className="form-grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
          <Field label="Množství">
            <input type="text" inputMode="decimal" required value={d.qty} onChange={(e) => set("qty", e.target.value)} />
          </Field>
          <Field label="Jednotka">
            <input type="text" value={d.unit} onChange={(e) => set("unit", e.target.value)} />
          </Field>
        </div>
        <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <Field label="Nákup / ks (Kč)">
            <input type="text" inputMode="decimal" required value={d.costPrice} onChange={(e) => set("costPrice", e.target.value)} />
          </Field>
          <Field label="Prodej / ks (Kč)">
            <input type="text" inputMode="decimal" value={d.salePrice} onChange={(e) => set("salePrice", e.target.value)} />
          </Field>
        </div>
        <Field label="Naskladněno">
          <input type="date" required value={d.receivedAt} onChange={(e) => set("receivedAt", e.target.value)} />
        </Field>
        <Field label="Trvanlivost (dní)" hint="0 = nehlídat (hrnkové, sušené, doplňky).">
          <input type="number" min={0} value={d.shelfLifeDays} onChange={(e) => set("shelfLifeDays", e.target.value)} />
        </Field>
        <Field label="Dodavatel">
          <input type="text" value={d.supplier} onChange={(e) => set("supplier", e.target.value)} placeholder="Květinová burza Praha" />
        </Field>
        <Field label="Poznámka">
          <input type="text" value={d.note} onChange={(e) => set("note", e.target.value)} />
        </Field>
      </div>
      <div className="row" style={{ marginTop: "1.25rem", justifyContent: "flex-end" }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>Zrušit</button>
        <button type="submit" className="btn btn-primary">{item ? "Uložit" : "Naskladnit"}</button>
      </div>
    </form>
  );
}

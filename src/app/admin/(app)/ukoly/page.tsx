"use client";

import { useMemo, useState, type FormEvent } from "react";
import { newId, nowIso, useAdmin } from "@/lib/admin/store";
import { addDays, formatDateShort, parseNumber, relativeDay, todayIso } from "@/lib/admin/format";
import {
  BUCKET_LABEL,
  BUCKET_ORDER,
  groupBySupplier,
  newShoppingItem,
  newTask,
  shoppingSuggestions,
  sortTasks,
  taskBucket,
  toggleShopping,
  toggleTask,
} from "@/lib/admin/ukoly";
import { TASK_REPEAT, type ShoppingItem, type Task, type TaskRepeat } from "@/lib/admin/types";
import { Card, Empty, Field, Loading, PageHead } from "@/components/admin/ui";
import { Ico } from "@/components/admin/icons";

type Zalozka = "ukoly" | "nakup";

export default function UkolyPage() {
  const { doc, ready } = useAdmin();
  const [zalozka, setZalozka] = useState<Zalozka>("ukoly");
  const today = todayIso();

  if (!ready) return <Loading />;

  const nehotove = doc.tasks.filter((t) => !t.done).length;
  const kkoupeni = doc.shopping.filter((s) => !s.bought).length;

  return (
    <>
      <PageHead
        title="Úkoly a nákup"
        sub="Co je potřeba udělat a co dokoupit. Odškrtává se jedním klepnutím, i na mobilu u pultu."
      />

      <div className="chips" style={{ marginBottom: "1.25rem" }}>
        <button className="chip" aria-pressed={zalozka === "ukoly"} onClick={() => setZalozka("ukoly")}>
          Úkoly{nehotove > 0 && ` (${nehotove})`}
        </button>
        <button className="chip" aria-pressed={zalozka === "nakup"} onClick={() => setZalozka("nakup")}>
          Nákupní seznam{kkoupeni > 0 && ` (${kkoupeni})`}
        </button>
      </div>

      {zalozka === "ukoly" ? <Ukoly today={today} /> : <Nakup today={today} />}
    </>
  );
}

/* ══ Úkoly ═══════════════════════════════════════════════════════════ */

function Ukoly({ today }: { today: string }) {
  const { doc, update } = useAdmin();
  const [nazev, setNazev] = useState("");
  const [termin, setTermin] = useState<string>("");
  const [ukazHotove, setUkazHotove] = useState(false);
  const [upravovany, setUpravovany] = useState<string | null>(null);

  const serazene = useMemo(() => sortTasks(doc.tasks, today), [doc.tasks, today]);
  const skupiny = BUCKET_ORDER.map((b) => ({
    bucket: b,
    ukoly: serazene.filter((t) => taskBucket(t, today) === b),
  })).filter((s) => s.ukoly.length > 0 && (s.bucket !== "hotovo" || ukazHotove));

  const hotovoCelkem = doc.tasks.filter((t) => t.done).length;

  function pridat(e: FormEvent) {
    e.preventDefault();
    if (!nazev.trim()) return;
    const t = newTask(nazev, termin || undefined, nowIso());
    update((d) => ({ ...d, tasks: [...d.tasks, t] }));
    setNazev("");
  }

  function prepnout(id: string) {
    update((d) => ({ ...d, tasks: toggleTask(d.tasks, id, nowIso()) }));
  }

  function smazat(id: string) {
    update((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) }));
  }

  function uprav(id: string, zmena: Partial<Task>) {
    update((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? { ...t, ...zmena } : t)) }));
  }

  return (
    <>
      <Card title="Přidat úkol">
        <form onSubmit={pridat} className="row" style={{ alignItems: "flex-end", gap: "0.75rem" }}>
          <div className="field" style={{ flex: "1 1 18rem" }}>
            <span className="field-label">Co je potřeba udělat</span>
            <input
              type="text"
              value={nazev}
              onChange={(e) => setNazev(e.target.value)}
              placeholder="Objednat růže na Valentýna"
            />
          </div>
          <Field label="Do kdy (nepovinné)">
            <input type="date" value={termin} onChange={(e) => setTermin(e.target.value)} />
          </Field>
          <button type="submit" className="btn btn-primary" disabled={!nazev.trim()}>
            <Ico.plus className="" /> Přidat
          </button>
        </form>
        <div className="chips" style={{ marginTop: "0.75rem" }}>
          <span className="small muted" style={{ alignSelf: "center", marginRight: "0.25rem" }}>Termín rychle:</span>
          {[
            ["dnes", today],
            ["zítra", addDays(today, 1)],
            ["za týden", addDays(today, 7)],
            ["bez termínu", ""],
          ].map(([popis, hodnota]) => (
            <button key={popis} type="button" className="chip" aria-pressed={termin === hodnota} onClick={() => setTermin(hodnota)}>
              {popis}
            </button>
          ))}
        </div>
      </Card>

      {doc.tasks.length === 0 ? (
        <Card>
          <Empty>Zatím žádné úkoly. Co vás dneska čeká?</Empty>
        </Card>
      ) : (
        skupiny.map(({ bucket, ukoly }) => (
          <Card
            key={bucket}
            title={`${BUCKET_LABEL[bucket]} (${ukoly.length})`}
            action={
              bucket === "hotovo" ? (
                <button onClick={() => setUkazHotove(false)}>skrýt</button>
              ) : undefined
            }
          >
            <div className="list">
              {ukoly.map((t) => (
                <div key={t.id} className={`ukol ${t.done ? "je-hotovy" : ""} ${bucket === "po-termínu" ? "je-po-terminu" : ""}`}>
                  <button
                    className="ukol-check"
                    onClick={() => prepnout(t.id)}
                    aria-label={t.done ? `Vrátit úkol ${t.title}` : `Odškrtnout úkol ${t.title}`}
                    aria-pressed={t.done}
                  >
                    {t.done ? "✓" : ""}
                  </button>

                  <div style={{ minWidth: 0 }}>
                    {upravovany === t.id ? (
                      <input
                        type="text"
                        autoFocus
                        defaultValue={t.title}
                        onBlur={(e) => {
                          const v = e.target.value.trim();
                          if (v) uprav(t.id, { title: v });
                          setUpravovany(null);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                      />
                    ) : (
                      <button className="ukol-nazev" onClick={() => setUpravovany(t.id)}>
                        {t.title}
                      </button>
                    )}
                    <div className="small muted">
                      {t.due && (
                        <>
                          {formatDateShort(t.due)}
                          {!t.done && ` · ${relativeDay(t.due, today)}`}
                        </>
                      )}
                      {t.repeat !== "zadne" && ` · ${TASK_REPEAT[t.repeat].toLowerCase()}`}
                      {t.note && ` · ${t.note}`}
                    </div>
                  </div>

                  <div className="row" style={{ flexWrap: "nowrap", gap: "0.3rem" }}>
                    {!t.done && (
                      <>
                        <select
                          value={t.repeat}
                          onChange={(e) => {
                            const r = e.target.value as TaskRepeat;
                            uprav(t.id, { repeat: r, due: r !== "zadne" && !t.due ? today : t.due });
                          }}
                          aria-label="Opakování"
                          style={{ width: "auto", fontSize: "0.78rem", padding: "0.3rem 1.6rem 0.3rem 0.5rem" }}
                        >
                          {(Object.keys(TASK_REPEAT) as TaskRepeat[]).map((r) => (
                            <option key={r} value={r}>{TASK_REPEAT[r]}</option>
                          ))}
                        </select>
                        <input
                          type="date"
                          value={t.due ?? ""}
                          onChange={(e) => uprav(t.id, { due: e.target.value || undefined })}
                          aria-label="Termín"
                          style={{ width: "auto", fontSize: "0.78rem", padding: "0.3rem 0.4rem" }}
                        />
                      </>
                    )}
                    <button className="btn btn-danger btn-sm" onClick={() => smazat(t.id)} aria-label="Smazat úkol">
                      <Ico.trash className="" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))
      )}

      {!ukazHotove && hotovoCelkem > 0 && (
        <button className="btn btn-ghost btn-sm" onClick={() => setUkazHotove(true)} style={{ marginTop: "0.5rem" }}>
          Zobrazit hotové ({hotovoCelkem})
        </button>
      )}
    </>
  );
}

/* ══ Nákupní seznam ══════════════════════════════════════════════════ */

function Nakup({ today }: { today: string }) {
  const { doc, update } = useAdmin();
  const [nazev, setNazev] = useState("");
  const [mnozstvi, setMnozstvi] = useState("");
  const [jednotka, setJednotka] = useState("ks");
  const [dodavatel, setDodavatel] = useState("");

  const kkoupeni = doc.shopping.filter((s) => !s.bought);
  const koupene = doc.shopping.filter((s) => s.bought);
  const skupiny = useMemo(() => groupBySupplier(kkoupeni), [kkoupeni]);
  const navrhy = useMemo(
    () => shoppingSuggestions(doc.stock, doc.shopping, today),
    [doc.stock, doc.shopping, today]
  );
  const dodavatele = useMemo(
    () => [...new Set([...doc.stock.map((s) => s.supplier), ...doc.shopping.map((s) => s.supplier)].filter(Boolean) as string[])],
    [doc.stock, doc.shopping]
  );

  function pridat(e: FormEvent) {
    e.preventDefault();
    if (!nazev.trim()) return;
    const i: ShoppingItem = {
      ...newShoppingItem(nazev, nowIso()),
      qty: parseNumber(mnozstvi),
      unit: mnozstvi ? jednotka : undefined,
      supplier: dodavatel.trim() || undefined,
    };
    update((d) => ({ ...d, shopping: [...d.shopping, i] }));
    setNazev("");
    setMnozstvi("");
  }

  function prepnout(id: string) {
    update((d) => ({ ...d, shopping: toggleShopping(d.shopping, id, nowIso()) }));
  }

  function pridatNavrh(n: { name: string; supplier?: string }) {
    update((d) => ({
      ...d,
      shopping: [...d.shopping, { ...newShoppingItem(n.name, nowIso()), supplier: n.supplier }],
    }));
  }

  function uklidit() {
    if (!window.confirm(`Odstranit ${koupene.length} koupených položek ze seznamu?`)) return;
    update((d) => ({ ...d, shopping: d.shopping.filter((s) => !s.bought) }));
  }

  return (
    <>
      <Card title="Přidat na seznam">
        <form onSubmit={pridat} className="row" style={{ alignItems: "flex-end", gap: "0.75rem" }}>
          <div className="field" style={{ flex: "1 1 14rem" }}>
            <span className="field-label">Co koupit</span>
            <input type="text" value={nazev} onChange={(e) => setNazev(e.target.value)} placeholder="Růže Red Naomi 60 cm" />
          </div>
          <Field label="Kolik">
            <input
              type="text"
              inputMode="decimal"
              value={mnozstvi}
              onChange={(e) => setMnozstvi(e.target.value)}
              placeholder="60"
              style={{ width: "5rem", textAlign: "right" }}
            />
          </Field>
          <Field label="Jednotka">
            <input type="text" value={jednotka} onChange={(e) => setJednotka(e.target.value)} style={{ width: "5rem" }} />
          </Field>
          <Field label="U koho">
            <input
              type="text"
              list="knm-dodavatele"
              value={dodavatel}
              onChange={(e) => setDodavatel(e.target.value)}
              placeholder="Květinová burza"
              style={{ width: "12rem" }}
            />
            <datalist id="knm-dodavatele">
              {dodavatele.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </Field>
          <button type="submit" className="btn btn-primary" disabled={!nazev.trim()}>
            <Ico.plus className="" /> Přidat
          </button>
        </form>
      </Card>

      {navrhy.length > 0 && (
        <Card title="Ze skladu by se hodilo dokoupit">
          <div className="chips">
            {navrhy.map((n) => (
              <button key={n.name} className="chip" onClick={() => pridatNavrh(n)} title={`Přidat na seznam — ${n.duvod}`}>
                + {n.name} <span className="muted">({n.duvod})</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {kkoupeni.length === 0 ? (
        <Card>
          <Empty>Nákupní seznam je prázdný. Co dochází?</Empty>
        </Card>
      ) : (
        skupiny.map(({ supplier, items }) => (
          <Card key={supplier} title={`${supplier} (${items.length})`}>
            <div className="list">
              {items.map((i) => (
                <div key={i.id} className="ukol">
                  <button className="ukol-check" onClick={() => prepnout(i.id)} aria-label={`Koupeno: ${i.name}`} aria-pressed={i.bought}>
                    {i.bought ? "✓" : ""}
                  </button>
                  <div style={{ minWidth: 0 }}>
                    <span className="ukol-nazev" style={{ cursor: "default" }}>{i.name}</span>
                    <div className="small muted">
                      {i.qty ? `${i.qty} ${i.unit ?? "ks"}` : "množství podle nabídky"}
                      {i.note && ` · ${i.note}`}
                    </div>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => update((d) => ({ ...d, shopping: d.shopping.filter((x) => x.id !== i.id) }))}
                    aria-label="Odebrat ze seznamu"
                  >
                    <Ico.trash className="" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        ))
      )}

      {koupene.length > 0 && (
        <Card title={`Koupeno (${koupene.length})`} action={<button onClick={uklidit}>uklidit seznam</button>}>
          <div className="list">
            {koupene.map((i) => (
              <div key={i.id} className="ukol je-hotovy">
                <button className="ukol-check" onClick={() => prepnout(i.id)} aria-label={`Vrátit na seznam: ${i.name}`} aria-pressed>
                  ✓
                </button>
                <div style={{ minWidth: 0 }}>
                  <span className="ukol-nazev" style={{ cursor: "default" }}>{i.name}</span>
                  <div className="small muted">
                    {i.qty ? `${i.qty} ${i.unit ?? "ks"}` : ""}
                    {i.supplier ? ` · ${i.supplier}` : ""}
                  </div>
                </div>
                <span />
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}

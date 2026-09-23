"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { newId, useAdmin } from "@/lib/admin/store";
import {
  MONTH_NOMINATIVE,
  formatCzk,
  formatDate,
  formatDateShort,
  formatMonth,
  parseNumber,
  todayIso,
  ymOf,
} from "@/lib/admin/format";
import { payoutsFor, payPlan, payYear, weekBudget, type PayPlan } from "@/lib/admin/penize";
import { GOODS_CATEGORIES, type OwnerPayout } from "@/lib/admin/types";
import { PaySplit, SPLIT } from "@/components/admin/charts";
import { MoneyTabs } from "@/components/admin/MoneyTabs";
import { Card, Empty, Field, Loading, PageHead, Stat } from "@/components/admin/ui";
import { Ico } from "@/components/admin/icons";

/**
 * Moje výplata — kolik si majitelka chce brát, kolik si opravdu vzala
 * a kolik smí tento týden utratit ve velkoobchodě, aby na výplatu zbylo.
 */
export default function VyplataPage() {
  const { doc, ready, update, payoutsInDb } = useAdmin();
  const today = todayIso();
  const thisMonth = ymOf(today);
  const [year, setYear] = useState(() => Number(today.slice(0, 4)));
  /** Rozepsaná výše výplaty. Dokud není uložená, počítá se s ní jen na obrazovce. */
  const [payDraft, setPayDraft] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  if (!ready) return <Loading />;

  const saved = doc.settings.ownerPay || 0;
  const draft = payDraft === null ? undefined : parseNumber(payDraft);
  const target = draft !== undefined && draft >= 0 ? draft : saved;
  const editing = payDraft !== null || saved === 0;

  // Výpočet jede i z neuložené částky — ať je vidět, co by znamenala.
  const calcDoc = target === saved ? doc : { ...doc, settings: { ...doc.settings, ownerPay: target } };
  const plan = payPlan(calcDoc, today);
  const week = plan && target > 0 ? weekBudget(calcDoc, plan, today) : undefined;

  const months = payYear(doc, year);
  const paidThisMonth = payoutsFor(doc.payouts, thisMonth).reduce((s, p) => s + p.amount, 0);
  const paidYear = months.reduce((s, m) => s + m.paid, 0);
  const yearPayouts = doc.payouts
    .filter((p) => p.forMonth.startsWith(`${year}-`))
    .sort((a, b) => b.date.localeCompare(a.date));
  const hasGoodsInvoices = doc.invoices.some((i) => i.kind === "prijata" && GOODS_CATEGORIES.includes(i.category?.trim() ?? ""));

  function savePay(e: FormEvent) {
    e.preventDefault();
    if (!payoutsInDb) return;
    update((d) => ({ ...d, settings: { ...d.settings, ownerPay: Math.max(0, Math.round(target)) } }));
    setPayDraft(null);
  }

  function addPayout(p: OwnerPayout) {
    update((d) => ({ ...d, payouts: [...d.payouts, p] }));
    setAdding(false);
  }

  function removePayout(p: OwnerPayout) {
    if (!window.confirm(`Smazat výplatu ${formatCzk(p.amount)} z ${formatDate(p.date)}?`)) return;
    update((d) => ({ ...d, payouts: d.payouts.filter((x) => x.id !== p.id) }));
  }

  const payBlock = editing ? (
    <form className="card" onSubmit={savePay} style={{ marginBottom: "1rem" }}>
      <div className="card-title">
        <h2>Kolik si chcete měsíčně brát?</h2>
      </div>
      <div className="form-grid">
        <Field
          label="Moje výplata za měsíc (Kč)"
          hint="Peníze jen pro vás. Zálohy na sociální a zdravotní buď zadejte do pravidelných výdajů, nebo je počítejte sem."
        >
          <input
            type="text"
            inputMode="decimal"
            autoFocus={saved > 0}
            value={payDraft ?? (saved > 0 ? String(saved) : "")}
            onChange={(e) => setPayDraft(e.target.value)}
            placeholder="20 000"
          />
        </Field>
      </div>
      <div className="row" style={{ marginTop: "0.8rem" }}>
        <button type="submit" className="btn btn-primary btn-sm" disabled={!payoutsInDb || target <= 0}>
          Uložit
        </button>
        {saved > 0 && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPayDraft(null)}>
            Zrušit
          </button>
        )}
        {target > 0 && target !== saved && (
          <span className="small muted">Čísla níž už počítají s {formatCzk(target)}.</span>
        )}
      </div>
    </form>
  ) : (
    <div className="grid-3" style={{ margin: "1rem 0" }}>
      <Card>
        <Stat
          label="Chci si brát"
          value={`${formatCzk(saved)}`}
          sub={
            <button className="link" onClick={() => setPayDraft(String(saved))}>
              měsíčně · změnit
            </button>
          }
        />
      </Card>
      <Card>
        <Stat
          label={`Vyplaceno za ${MONTH_NOMINATIVE[Number(thisMonth.slice(5)) - 1].toLowerCase()}`}
          value={formatCzk(paidThisMonth)}
          sub={
            paidThisMonth >= saved
              ? "celá výplata je venku"
              : `zbývá vyplatit ${formatCzk(saved - paidThisMonth)}`
          }
        />
      </Card>
      <Card>
        <Stat label={`Vyplaceno za rok ${year}`} value={formatCzk(paidYear)} sub={`${yearPayouts.length} ${prevodu(yearPayouts.length)}`} />
      </Card>
    </div>
  );

  const weekCard = !plan ? (
    <Card title="Na zboží tento týden">
      <Empty>
        Zatím není z čeho počítat. Stačí zapsat tržby aspoň za jeden celý měsíc — pak tu bude,
        kolik smíte utratit ve velkoobchodě.
      </Empty>
    </Card>
  ) : target <= 0 ? (
    <Card title="Na zboží tento týden">
      <Empty>Nejdřív nahoře zadejte, kolik si chcete brát. Bez toho se limit na zboží spočítat nedá.</Empty>
    </Card>
  ) : (
    week && (
      <Card
        title="Na zboží tento týden"
        action={<Link href="/admin/penize/faktury">zapsat fakturu →</Link>}
      >
        <Stat
          label={`${week.left >= 0 ? "Můžete ještě utratit" : "Přečerpáno o"} · ${dayMonth(week.from)}–${dayMonth(week.to)}`}
          value={formatCzk(Math.abs(week.left))}
          sub={`limit ${formatCzk(week.budget)} na týden · utraceno ${formatCzk(week.spent)}`}
        />
        <div
          className={`meter ${week.left < 0 ? "is-over" : ""}`}
          role="img"
          aria-label={`Utraceno ${formatCzk(week.spent)} z ${formatCzk(week.budget)}`}
        >
          <div style={{ width: `${week.budget > 0 ? Math.min(100, (week.spent / week.budget) * 100) : week.spent > 0 ? 100 : 0}%` }} />
        </div>

        <p className="small" style={{ fontFamily: "var(--font-body)", marginTop: "0.8rem" }}>
          {week.weeks === 0 ? (
            <>Za poslední 4 týdny není zapsaná žádná tržba, takže limit vychází nula.</>
          ) : (
            <>
              Průměrný týden za poslední {week.weeks} {week.weeks === 1 ? "týden" : "týdny"} vynesl{" "}
              <strong>{formatCzk(week.avgWeekIncome)}</strong>. Na zboží z toho smí jít{" "}
              <strong>{Math.round(plan.goodsShare * 100)} %</strong> — zbytek je na nájem, provoz a vaši výplatu.
            </>
          )}
        </p>

        {week.invoices.length > 0 ? (
          <div className="list" style={{ marginTop: "0.6rem" }}>
            {week.invoices.map((i) => (
              <div key={i.id} className="list-row" style={{ gridTemplateColumns: "auto 1fr auto", padding: "0.45rem 0" }}>
                <span className="small muted">{formatDateShort(i.issuedAt)}</span>
                <span className="small">
                  {i.party} <span className="muted">· {i.category}</span>
                </span>
                <span className="mono small">{formatCzk(i.amount)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="small muted" style={{ marginTop: "0.6rem" }}>
            {hasGoodsInvoices
              ? "Od pondělí zatím žádná faktura za zboží."
              : "Zatím tu není žádná faktura za zboží. Zapisujte je ve Fakturách, jinak admin neví, kolik je utraceno."}{" "}
            Počítají se přijaté faktury v kategoriích {GOODS_CATEGORIES.join(", ")}.
          </p>
        )}
      </Card>
    )
  );

  return (
    <>
      <PageHead
        title="Moje výplata"
        sub="Nejdřív výplata, potom velkoobchod. Admin spočítá, kolik smíte utratit za zboží, aby vám na výplatu zbylo."
      />

      <MoneyTabs />

      {!payoutsInDb && (
        <div className="notice notice-warn">
          <strong>Databáze zatím výplaty neumí uložit.</strong> Je potřeba jednou spustit aktualizaci
          databáze (soubor <code>supabase/migrations/0006_vyplata.sql</code> v Supabase → SQL Editor).
          Do té doby si tu můžete všechno vyzkoušet, ale nic z téhle stránky se neuloží.
        </div>
      )}

      {/* Na mobilu musí být nahoře to, kvůli čemu se sem chodí: kolik ještě
          smí jít do velkoobchodu. Jen dokud není výplata zadaná, jde první ona. */}
      {editing ? (
        <>
          {payBlock}
          {weekCard}
        </>
      ) : (
        <>
          {weekCard}
          {payBlock}
        </>
      )}

      {plan && target > 0 && <SplitCard plan={plan} />}

      <Card
        title={`Výplaty ${year}`}
        action={
          <div className="row" style={{ gap: "0.4rem" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setYear((v) => v - 1)}>← {year - 1}</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setYear((v) => v + 1)}>{year + 1} →</button>
            <button className="btn btn-primary btn-sm" onClick={() => setAdding((a) => !a)} disabled={!payoutsInDb}>
              <Ico.plus className="" /> {adding ? "Zavřít" : "Vyplatit si"}
            </button>
          </div>
        }
      >
        <p className="small" style={{ fontFamily: "var(--font-body)", marginBottom: "0.9rem" }}>
          Když si peníze převedete na svůj účet, zapište to sem. Výplata není výdaj krámu — zisk se tím
          nezmění, jen je vidět, kolik z něj skončilo u vás a kolik zůstalo v krámu.
        </p>

        {adding && (
          <PayoutForm
            defaultAmount={Math.max(0, saved - paidThisMonth)}
            onSave={addPayout}
            onClose={() => setAdding(false)}
          />
        )}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Měsíc</th>
                <th className="num">Zisk</th>
                <th className="num">Vyplaceno</th>
                <th className="num">Zůstalo v krámu</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m) => {
                const empty = !m.hasIncome && m.paid === 0;
                const running = m.ym === thisMonth;
                return (
                  <tr key={m.ym} style={{ opacity: empty ? 0.45 : 1 }}>
                    <td style={{ fontWeight: running ? 700 : 400 }}>
                      {MONTH_NOMINATIVE[Number(m.ym.slice(5)) - 1]}
                      {running && <span className="muted small"> zatím</span>}
                    </td>
                    <td className="num">
                      {empty ? "—" : formatCzk(m.profit)}
                      {!empty && !m.hasExpenses && <span className="muted"> *</span>}
                    </td>
                    <td className="num">
                      <strong>{m.paid > 0 ? formatCzk(m.paid) : "—"}</strong>
                      {saved > 0 && m.paid > 0 && m.paid < saved && (
                        <span className="muted small"> z {formatCzk(saved)}</span>
                      )}
                    </td>
                    <td className="num">{empty ? "—" : formatCzk(m.profit - m.paid)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {months.some((m) => m.hasIncome && !m.hasExpenses) && (
          <p className="small muted" style={{ marginTop: "0.6rem" }}>
            * V měsíci nejsou zapsané žádné výdaje, takže zisk vychází stejný jako tržba — ve skutečnosti je menší.
            Zapište faktury a nájem, pak bude sedět.
          </p>
        )}

        {yearPayouts.length > 0 && (
          <>
            <h3 style={{ marginTop: "1.25rem", marginBottom: "0.3rem" }}>Zapsané výplaty</h3>
            <div className="list">
              {yearPayouts.map((p) => (
                <div key={p.id} className="list-row" style={{ gridTemplateColumns: "1fr auto" }}>
                  <div>
                    <div className="list-title">za {formatMonth(p.forMonth).toLowerCase()}</div>
                    <div className="list-sub">
                      převedeno {formatDate(p.date)}
                      {p.note && ` · ${p.note}`}
                    </div>
                  </div>
                  <div className="list-end">
                    <span className="mono">{formatCzk(p.amount)}</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => removePayout(p)} disabled={!payoutsInDb}>
                      Smazat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </>
  );
}

/** „21. 9." */
function dayMonth(iso: string): string {
  return formatDateShort(iso).split(" ").slice(1).join(" ");
}

/** 1 převod, 2 převody, 5 převodů. */
function prevodu(n: number): string {
  return n === 1 ? "převod" : n >= 2 && n <= 4 ? "převody" : "převodů";
}

/** Jak se dělí typická měsíční tržba — provoz, výplata, zboží. */
function SplitCard({ plan }: { plan: PayPlan }) {
  const running = plan.fixed + plan.other;
  const goods = plan.goodsShare * plan.income;
  const per100 = (n: number) => Math.round((n / plan.income) * 100);
  const refText = plan.refMonths.map((ym) => MONTH_NOMINATIVE[Number(ym.slice(5)) - 1].toLowerCase()).join(", ");

  const parts = [
    { key: "running", label: "Nájem a provoz", amount: running, color: SPLIT.running },
    { key: "pay", label: "Moje výplata", amount: plan.pay, color: SPLIT.pay },
    { key: "goods", label: "Zboží z velkoobchodu", amount: goods, color: SPLIT.goods },
    { key: "spare", label: "Zbývá navíc", amount: plan.spare, color: SPLIT.spare, light: true },
  ];

  return (
    <Card title="Jak se dělí každých 100 Kč tržby">
      <p className="small" style={{ fontFamily: "var(--font-body)", marginBottom: "0.9rem" }}>
        Počítá s tržbou kolem <strong>{formatCzk(plan.income)}</strong> měsíčně (průměr: {refText}).
      </p>

      <PaySplit parts={parts} income={plan.income} />

      <div className="split-legend">
        {parts
          .filter((p) => p.amount > 0 || p.key === "goods")
          .map((p) => (
            <div key={p.key}>
              <i style={{ background: p.color }} />
              <span>
                {p.label}
                {p.key === "running" && (
                  <small className="muted">
                    pravidelné výdaje {formatCzk(plan.fixed)}
                    {plan.other > 0 && ` + ostatní faktury ${formatCzk(plan.other)}`}
                  </small>
                )}
              </span>
              <span className="mono small">
                {per100(p.amount)} Kč <span className="muted">· {formatCzk(p.amount)} měsíčně</span>
              </span>
            </div>
          ))}
      </div>

      {plan.shortfall > 0 ? (
        <div className="notice notice-danger" style={{ marginTop: "1rem", marginBottom: 0 }}>
          <strong>Výplata {formatCzk(plan.pay)} se nevejde.</strong> Po nájmu a provozu zbývá z typické tržby jen{" "}
          {formatCzk(Math.max(0, plan.income - running))} — a to ještě bez jediné kytky ze zboží.
          Buď nižší výplata, nebo vyšší tržba.
        </div>
      ) : plan.goodsShare < plan.cap && plan.free > 0 ? (
        <p className="small" style={{ marginTop: "1rem" }}>
          Na zboží zbývá <strong>{per100(goods)} Kč</strong> z každé stovky. Víc utratit znamená vzít si to
          z vlastní výplaty.
        </p>
      ) : plan.free <= 0 ? (
        <div className="notice notice-danger" style={{ marginTop: "1rem", marginBottom: 0 }}>
          <strong>Na zboží nezbývá nic.</strong> Nájem, provoz a výplata spolknou celou typickou tržbu.
          Každý nákup ve velkoobchodě jde z vaší výplaty.
        </div>
      ) : null}

      {plan.spare > 0 && (
        <div className="notice notice-ok" style={{ marginTop: "1rem", marginBottom: 0 }}>
          <strong>Máte prostor.</strong> I s výplatou {formatCzk(plan.pay)} zbývá {formatCzk(plan.spare)} měsíčně navíc.
          Na zboží víc než {Math.round(plan.cap * 100)} % tržby dávat nemá smysl (s přirážkou{" "}
          {(1 / plan.cap).toLocaleString("cs-CZ")}× by se neprodalo), takže si můžete výplatu zvýšit, nebo to
          nechat v krámu jako rezervu na slabší měsíce.
        </div>
      )}

      {plan.actualGoodsShare !== undefined && (
        <p className="small" style={{ marginTop: "0.9rem" }}>
          Ve skutečnosti šlo v těch měsících na zboží <strong>{Math.round(plan.actualGoodsShare * 100)} Kč</strong> ze
          stovky
          {plan.actualGoodsShare > plan.goodsShare + 0.02
            ? " — víc, než se vejde. Tady se ztrácí výplata."
            : plan.actualGoodsShare < plan.goodsShare - 0.02
              ? " — méně, než smí. Výplata tedy vycházela."
              : " — přesně podle plánu."}
        </p>
      )}
    </Card>
  );
}

function PayoutForm({
  defaultAmount,
  onSave,
  onClose,
}: {
  defaultAmount: number;
  onSave: (p: OwnerPayout) => void;
  onClose: () => void;
}) {
  const today = todayIso();
  const [amount, setAmount] = useState(defaultAmount > 0 ? String(Math.round(defaultAmount)) : "");
  const [forMonth, setForMonth] = useState(ymOf(today));
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const n = parseNumber(amount);
    if (!n || n <= 0) return;
    onSave({ id: newId(), date, forMonth, amount: n, note: note.trim() || undefined });
  }

  return (
    <form onSubmit={submit} className="form-section" style={{ marginBottom: "1rem" }}>
      <div className="form-grid">
        <Field label="Kolik (Kč)">
          <input type="text" inputMode="decimal" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="20 000" />
        </Field>
        <Field label="Za měsíc" hint="Výplatu za září můžete převést klidně až 2. října.">
          <input type="month" required value={forMonth} onChange={(e) => setForMonth(e.target.value)} />
        </Field>
        <Field label="Kdy převedeno">
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Poznámka (nepovinné)">
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="z hotovosti v kase" />
        </Field>
      </div>
      <div className="row" style={{ marginTop: "0.8rem" }}>
        <button type="submit" className="btn btn-primary btn-sm">Zapsat výplatu</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Zrušit</button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { DAY_SHORT, formatCzk, formatDateShort, formatShortCzk, fromIso } from "@/lib/admin/format";

/**
 * Sloupcové grafy pro sekci Peníze — prosté HTML, žádná knihovna.
 *
 * Barvy jsou ověřené validátorem palety (rozlišitelné i pro barvoslepé,
 * dostatek kontrastu proti krémovému papíru):
 *   příjmy  #1C5F9E   výdaje #B85842   tržba dne #6D7A52
 * Text nikdy nenese barvu série — identitu drží legenda a barevná tečka.
 */

export const CHART = {
  income: "#1C5F9E",
  expense: "#B85842",
  day: "#6D7A52",
} as const;

/**
 * Rozdělení tržby na stránce Výplata. Pořadí je pevné a sousední dvojice
 * prošly validátorem (i pro barvoslepé, proti krémovému papíru):
 *   provoz #B85842 → výplata #1C5F9E → zboží #4F8A3A
 * Šalvějová #6D7A52 z denních tržeb by tu neprošla — vedle terakoty je pro
 * deuteranopy k nerozeznání a čte se jako šedá. „Navíc" není kategorie,
 * ale nerozdělený zbytek, proto neutrální.
 */
export const SPLIT = {
  running: "#B85842",
  pay: "#1C5F9E",
  goods: "#4F8A3A",
  spare: "rgba(42, 38, 32, 0.16)",
} as const;

/** Horní hranice osy zaokrouhlená na hezké číslo. */
function niceMax(value: number): number {
  if (value <= 0) return 1000;
  const pow = 10 ** Math.floor(Math.log10(value));
  const steps = [1, 2, 2.5, 5, 10];
  for (const s of steps) {
    const candidate = s * pow;
    if (candidate >= value) return candidate;
  }
  return 10 * pow;
}

function Gridlines({ max }: { max: number }) {
  return (
    <div className="chart-grid" aria-hidden>
      {[1, 0.75, 0.5, 0.25, 0].map((f) => (
        <div key={f} className="chart-gridline" style={{ bottom: `${f * 100}%` }}>
          <span>{f === 0 ? "0" : formatShortCzk(max * f)}</span>
        </div>
      ))}
    </div>
  );
}

function Tooltip({ left, children }: { left: number; children: React.ReactNode }) {
  return (
    <div
      className="chart-tip"
      style={{ left: `${left}%`, transform: `translateX(${left > 75 ? -90 : left < 25 ? -10 : -50}%)` }}
      role="status"
    >
      {children}
    </div>
  );
}

/** Denní tržby jednoho měsíce. Jedna série, takže bez legendy. */
export function DayColumns({
  days,
  bestDate,
  today,
}: {
  days: { date: string; total: number }[];
  bestDate?: string;
  today: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(...days.map((d) => d.total), 0));
  const sum = days.reduce((s, d) => s + d.total, 0);
  const active = hover !== null ? days[hover] : undefined;

  return (
    <figure className="chart" role="img" aria-label={`Denní tržby, celkem ${formatCzk(sum)} za měsíc`}>
      <div className="chart-plot">
        <Gridlines max={max} />
        <div className="chart-cols">
          {days.map((d, i) => {
            const h = max > 0 ? (d.total / max) * 100 : 0;
            const weekend = [0, 6].includes(fromIso(d.date).getDay());
            return (
              <div
                key={d.date}
                className={`chart-col ${hover === i ? "is-hover" : ""}`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                aria-label={`${formatDateShort(d.date)}: ${formatCzk(d.total)}`}
              >
                {d.date === bestDate && d.total > 0 && (
                  <span className="chart-peak" style={{ bottom: `calc(${h}% + 6px)` }}>
                    {formatShortCzk(d.total)}
                  </span>
                )}
                <div
                  className="chart-bar"
                  style={{ height: `${h}%`, background: CHART.day, opacity: weekend ? 0.55 : 1 }}
                />
                <span className={`chart-xlab ${d.date === today ? "is-today" : ""}`}>
                  {Number(d.date.slice(8))}
                </span>
              </div>
            );
          })}
        </div>
        {active && (
          <Tooltip left={((hover! + 0.5) / days.length) * 100}>
            <strong>
              {DAY_SHORT[fromIso(active.date).getDay()]} {formatDateShort(active.date).split(" ").slice(1).join(" ")}
            </strong>
            <span>{active.total > 0 ? formatCzk(active.total) : "zavřeno / bez tržby"}</span>
          </Tooltip>
        )}
      </div>
      <figcaption className="chart-note">
        Světlejší sloupce jsou víkendy. Popisek nese jen nejsilnější den, zbytek ukáže dotyk nebo najetí myší.
      </figcaption>
    </figure>
  );
}

/** Příjmy a výdaje po měsících. Dvě série, takže legenda. */
export function YearColumns({
  months,
  highlightYm,
}: {
  months: { ym: string; month: number; income: number; expenses: number }[];
  highlightYm?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(...months.flatMap((m) => [m.income, m.expenses]), 0));
  const active = hover !== null ? months[hover] : undefined;

  return (
    <figure className="chart" role="img" aria-label="Příjmy a výdaje po měsících">
      <div className="chart-legend">
        <span>
          <i style={{ background: CHART.income }} /> Příjmy
        </span>
        <span>
          <i style={{ background: CHART.expense }} /> Výdaje
        </span>
      </div>
      <div className="chart-plot">
        <Gridlines max={max} />
        <div className="chart-cols chart-cols--grouped">
          {months.map((m, i) => (
            <div
              key={m.ym}
              className={`chart-group ${hover === i ? "is-hover" : ""}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              tabIndex={0}
              aria-label={`${DAY_MONTHS[m.month - 1]}: příjmy ${formatCzk(m.income)}, výdaje ${formatCzk(m.expenses)}`}
            >
              <div className="chart-pair">
                {m.ym === highlightYm && (m.income > 0 || m.expenses > 0) && (
                  <span
                    className="chart-peak"
                    style={{ bottom: `calc(${max > 0 ? (Math.max(m.income, m.expenses) / max) * 100 : 0}% + 6px)` }}
                  >
                    {formatShortCzk(Math.max(m.income, m.expenses))}
                  </span>
                )}
                <div className="chart-bar" style={{ height: `${max > 0 ? (m.income / max) * 100 : 0}%`, background: CHART.income }} />
                <div className="chart-bar" style={{ height: `${max > 0 ? (m.expenses / max) * 100 : 0}%`, background: CHART.expense }} />
              </div>
              <span className={`chart-xlab ${m.ym === highlightYm ? "is-today" : ""}`}>{DAY_MONTHS[m.month - 1]}</span>
            </div>
          ))}
        </div>
        {active && (
          <Tooltip left={((hover! + 0.5) / months.length) * 100}>
            <strong>{DAY_MONTHS[active.month - 1]}</strong>
            <span>
              <i style={{ background: CHART.income }} /> {formatCzk(active.income)}
            </span>
            <span>
              <i style={{ background: CHART.expense }} /> {formatCzk(active.expenses)}
            </span>
            <span className="muted">zisk {formatCzk(active.income - active.expenses)}</span>
          </Tooltip>
        )}
      </div>
    </figure>
  );
}

const DAY_MONTHS = ["led", "úno", "bře", "dub", "kvě", "čvn", "čvc", "srp", "zář", "říj", "lis", "pro"];

export type SplitPart = {
  key: string;
  label: string;
  /** Kč měsíčně. */
  amount: number;
  color: string;
  /** Světlý segment potřebuje tmavý popisek. */
  light?: boolean;
};

/**
 * Jak se dělí typická měsíční tržba — jeden vodorovný pruh.
 *
 * Když se provoz a výplata do tržby nevejdou, pruh je delší než tržba
 * a svislá čára ukazuje, kam tržba stačí: co je za ní, nemá z čeho být.
 */
export function PaySplit({ parts, income }: { parts: SplitPart[]; income: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = parts.filter((p) => p.amount > 0);
  const total = Math.max(income, shown.reduce((s, p) => s + p.amount, 0));
  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);
  const per100 = (n: number) => (income > 0 ? Math.round((n / income) * 100) : 0);
  const active = hover !== null ? shown[hover] : undefined;
  const activeLeft =
    hover !== null ? pct(shown.slice(0, hover).reduce((s, p) => s + p.amount, 0) + shown[hover].amount / 2) : 0;

  return (
    <figure className="chart" role="img" aria-label={shown.map((p) => `${p.label} ${per100(p.amount)} Kč ze 100`).join(", ")}>
      <div className="split-plot">
        <div className="split-bar">
          {shown.map((p, i) => (
            <div
              key={p.key}
              className={`split-seg ${hover === i ? "is-hover" : ""}`}
              style={{ width: `${pct(p.amount)}%`, background: p.color, color: p.light ? "var(--ink)" : "var(--cream)" }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              tabIndex={0}
              aria-label={`${p.label}: ${formatCzk(p.amount)} měsíčně`}
            >
              {pct(p.amount) >= 11 && <span>{per100(p.amount)} Kč</span>}
            </div>
          ))}
        </div>
        {total > income && income > 0 && (
          <div className="split-limit" style={{ left: `${pct(income)}%` }}>
            <span>sem tržba stačí</span>
          </div>
        )}
        {active && (
          <Tooltip left={activeLeft}>
            <strong>{active.label}</strong>
            <span>{formatCzk(active.amount)} měsíčně</span>
            <span className="muted">{per100(active.amount)} Kč z každých 100 Kč tržby</span>
          </Tooltip>
        )}
      </div>
    </figure>
  );
}

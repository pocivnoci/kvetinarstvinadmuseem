/** Formátování a práce s datem/penězi — vše v pražském čase a v češtině. */

export const DAY_NAMES = ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"];
export const DAY_SHORT = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];
export const MONTH_NAMES = [
  "ledna", "února", "března", "dubna", "května", "června",
  "července", "srpna", "září", "října", "listopadu", "prosince",
];
export const MONTH_NOMINATIVE = [
  "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
  "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec",
];

/** Dnešek jako YYYY-MM-DD v pražském čase. */
export function todayIso(): string {
  return toIsoDate(new Date());
}

export function toIsoDate(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Prague",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** YYYY-MM-DD → lokální Date (poledne, ať DST nic neposune). */
export function fromIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0);
}

export function addDays(iso: string, days: number): string {
  const d = fromIso(iso);
  d.setDate(d.getDate() + days);
  return localIso(d);
}

/** Date (lokální) → YYYY-MM-DD bez časového pásma. */
export function localIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysBetween(a: string, b: string): number {
  return Math.round((fromIso(b).getTime() - fromIso(a).getTime()) / 86_400_000);
}

/** „pondělí 14. října“ */
export function formatDateLong(iso: string): string {
  const d = fromIso(iso);
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()}. ${MONTH_NAMES[d.getMonth()]}`;
}

/** „14. 10. 2026“ */
export function formatDate(iso: string): string {
  const d = fromIso(iso);
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}

/** „Po 14. 10.“ */
export function formatDateShort(iso: string): string {
  const d = fromIso(iso);
  return `${DAY_SHORT[d.getDay()]} ${d.getDate()}. ${d.getMonth() + 1}.`;
}

/** Relativní popis: dnes / zítra / za 3 dny / před 2 dny */
export function relativeDay(iso: string, today = todayIso()): string {
  const diff = daysBetween(today, iso);
  if (diff === 0) return "dnes";
  if (diff === 1) return "zítra";
  if (diff === -1) return "včera";
  if (diff > 1) return `za ${diff} ${diff < 5 ? "dny" : "dní"}`;
  return `před ${-diff} ${-diff < 5 ? "dny" : "dny"}`;
}

/** Pondělí týdne, do kterého datum patří. */
export function startOfWeek(iso: string): string {
  const d = fromIso(iso);
  const dow = (d.getDay() + 6) % 7; // Po = 0
  d.setDate(d.getDate() - dow);
  return localIso(d);
}

export function formatCzk(n: number | undefined | null): string {
  if (n === undefined || n === null || Number.isNaN(n)) return "—";
  return `${Math.round(n).toLocaleString("cs-CZ")} Kč`;
}

export function parseNumber(v: string): number | undefined {
  const cleaned = v.replace(/\s/g, "").replace(",", ".");
  if (cleaned === "") return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

/** Telefon jen z číslic, pro porovnání zákazníků. */
export function normalizePhone(p: string): string {
  const digits = p.replace(/\D/g, "");
  return digits.startsWith("420") && digits.length === 12 ? digits.slice(3) : digits;
}

export function formatPhone(p: string): string {
  const d = normalizePhone(p);
  if (d.length === 9) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  return p;
}

export function telHref(p: string): string {
  const d = normalizePhone(p);
  return d.length === 9 ? `tel:+420${d}` : `tel:${p.replace(/\s/g, "")}`;
}

export function waHref(p: string): string {
  const d = normalizePhone(p);
  return d.length === 9 ? `https://wa.me/420${d}` : `https://wa.me/${d}`;
}

import { localIso } from "./format";

/**
 * Květinové dny v roce — kdy se prodává nejvíc a je potřeba mít
 * objednané zboží, posily a otevřeno déle. Pohyblivé svátky se počítají.
 */

export type KlicovyDen = {
  /** YYYY-MM-DD */
  date: string;
  name: string;
  /** Co se typicky prodává / na co se připravit. */
  tip: string;
  /** Kolik dní dopředu objednat zboží. */
  leadDays: number;
  /** Velký den (Valentýn, Den matek…) vs. menší. */
  major: boolean;
};

/** Velikonoční neděle — Meeus/Jones/Butcher. */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day, 12);
}

/** N-tá neděle v měsíci (1 = první). */
function nthSunday(year: number, month0: number, n: number): Date {
  const first = new Date(year, month0, 1, 12);
  const offset = (7 - first.getDay()) % 7;
  return new Date(year, month0, 1 + offset + (n - 1) * 7, 12);
}

/** První adventní neděle = 4. neděle před Štědrým dnem (27. 11. – 3. 12.). */
function firstAdvent(year: number): Date {
  const xmas = new Date(year, 11, 24, 12);
  const dow = xmas.getDay(); // 0 = neděle
  const fourthAdvent = new Date(year, 11, 24 - dow, 12);
  fourthAdvent.setDate(fourthAdvent.getDate() - 21);
  return fourthAdvent;
}

/** Poslední školní den — 30. 6., o víkendu předchozí pátek. */
function lastSchoolDay(year: number): Date {
  const d = new Date(year, 5, 30, 12);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() - 1);
  return d;
}

export function klicoveDnyRoku(year: number): KlicovyDen[] {
  const fixed = (m: number, d: number) => localIso(new Date(year, m - 1, d, 12));
  const easter = easterSunday(year);
  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);

  const dny: KlicovyDen[] = [
    { date: fixed(2, 14), name: "Valentýn", tip: "Červené růže ve všech délkách, tulipány, dárkové kytice. Objednat velký týden dopředu.", leadDays: 10, major: true },
    { date: fixed(3, 8), name: "MDŽ — Mezinárodní den žen", tip: "Tulipány, karafiáty, malé kytice v množství. Firmy objednávají hromadně — oslovit dopředu.", leadDays: 7, major: true },
    { date: fixed(3, 28), name: "Den učitelů", tip: "Menší kytice, hrnkové rostliny. Rodiče kupují odpoledne.", leadDays: 4, major: false },
    { date: localIso(easter), name: "Velikonoční neděle", tip: "Narcisy, tulipány, hyacinty, kočičky, vrbové proutí, velikonoční dekorace.", leadDays: 10, major: true },
    { date: localIso(easterMonday), name: "Velikonoční pondělí", tip: "Zavřeno (státní svátek) — prodej běží celý předchozí týden.", leadDays: 0, major: false },
    { date: fixed(5, 1), name: "První máj", tip: "Zamilované kytice, drobné pugety. Sváteční den, otevřít podle zájmu.", leadDays: 3, major: false },
    { date: localIso(nthSunday(year, 4, 2)), name: "Den matek", tip: "Druhý největší den roku. Pivoňky, růže, pastelové kytice, hrnkové. Objednávky přijímat od začátku května.", leadDays: 10, major: true },
    { date: localIso(nthSunday(year, 5, 3)), name: "Den otců", tip: "Menší zájem, spíš hrnkové rostliny a pánské kytice v zemitých barvách.", leadDays: 3, major: false },
    { date: localIso(lastSchoolDay(year)), name: "Vysvědčení — konec školního roku", tip: "Kytice pro učitele. Levnější menší kytice v množství, připravit předem.", leadDays: 4, major: true },
    { date: fixed(9, 1), name: "Začátek školního roku", tip: "Kytice pro prvňáčky a učitele — hlavně ráno.", leadDays: 3, major: false },
    { date: fixed(11, 2), name: "Dušičky — Památka zesnulých", tip: "Chryzantémy, věnce, dušičkové vazby, svíčky. Prodej vrcholí týden předem.", leadDays: 14, major: true },
    { date: localIso(firstAdvent(year)), name: "První adventní neděle", tip: "Adventní věnce a svícny — začít vázat 2 týdny předem, prodávají se celý listopad.", leadDays: 14, major: true },
    { date: fixed(12, 6), name: "Mikuláš", tip: "Drobné dárky, vánoční hvězdy (poinsettie), jmelí.", leadDays: 5, major: false },
    { date: fixed(12, 24), name: "Štědrý den", tip: "Vánoční hvězdy, jmelí, chvojí, amarylis, vánoční kytice. Poslední týden nejsilnější.", leadDays: 10, major: true },
    { date: fixed(12, 31), name: "Silvestr", tip: "Slavnostní kytice, bílé a zlaté tóny.", leadDays: 3, major: false },
  ];

  return dny.sort((a, b) => a.date.localeCompare(b.date));
}

/** Nejbližší klíčové dny od data (včetně), přes přelom roku. */
export function nadchazejiciKlicoveDny(fromIso: string, limitDays: number): KlicovyDen[] {
  const year = Number(fromIso.slice(0, 4));
  const all = [...klicoveDnyRoku(year), ...klicoveDnyRoku(year + 1)];
  const from = new Date(fromIso + "T12:00:00");
  const to = new Date(from);
  to.setDate(to.getDate() + limitDays);
  const toIso = localIso(to);
  return all.filter((d) => d.date >= fromIso && d.date <= toIso);
}

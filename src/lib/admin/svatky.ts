/**
 * Český kalendář jmen (svátky) — pro květinářství jeden z nejdůležitějších
 * prodejních signálů. Když je chyba nebo chcete doplnit jméno, upravte
 * řádek tady; nic jiného se kvůli tomu neměnit nemusí.
 *
 * Formát: každý měsíc jako pole 28–31 řetězců, více jmen oddělených „ a “.
 */

const KALENDAR: string[][] = [
  // Leden
  ["Nový rok", "Karina", "Radmila", "Diana", "Dalimil", "Tři králové", "Vilma", "Čestmír", "Vladan", "Břetislav",
   "Bohdana", "Pravoslav", "Edita", "Radovan", "Alice", "Ctirad", "Drahoslav", "Vladislav", "Doubravka", "Ilona",
   "Běla", "Slavomír", "Zdeněk", "Milena", "Miloš", "Zora", "Ingrid", "Otýlie", "Zdislava", "Robin", "Marika"],
  // Únor
  ["Hynek", "Nela", "Blažej", "Jarmila", "Dobromila", "Vanda", "Veronika", "Milada", "Apolena", "Mojmír",
   "Božena", "Slavěna", "Věnceslav", "Valentýn", "Jiřina", "Ljuba", "Miloslava", "Gizela", "Patrik", "Oldřich",
   "Lenka", "Petr", "Svatopluk", "Matěj", "Liliana", "Dorota", "Alexandr", "Lumír", "Horymír"],
  // Březen
  ["Bedřich", "Anežka", "Kamil", "Stela", "Kazimír", "Miroslav", "Tomáš", "Gabriela", "Františka", "Viktorie",
   "Anděla", "Řehoř", "Růžena", "Rút a Matylda", "Ida", "Elena a Herbert", "Vlastimil", "Eduard", "Josef", "Světlana",
   "Radek", "Leona", "Ivona", "Gabriel", "Marián", "Emanuel", "Dita", "Soňa", "Taťána", "Arnošt", "Kvido"],
  // Duben
  ["Hugo", "Erika", "Richard", "Ivana", "Miroslava", "Vendula", "Heřman a Hermína", "Ema", "Dušan", "Darja",
   "Izabela", "Julius", "Aleš", "Vincenc", "Anastázie", "Irena", "Rudolf", "Valérie", "Rostislav", "Marcela",
   "Alexandra", "Evženie", "Vojtěch", "Jiří", "Marek", "Oto", "Jaroslav", "Vlastislav", "Robert", "Blahoslav"],
  // Květen
  ["Svátek práce", "Zikmund", "Alexej", "Květoslav", "Klaudie", "Radoslav", "Stanislav", "Den vítězství", "Ctibor", "Blažena",
   "Svatava", "Pankrác", "Servác", "Bonifác", "Žofie", "Přemysl", "Aneta", "Nataša", "Ivo", "Zbyšek",
   "Monika", "Emil", "Vladimír", "Jana", "Viola", "Filip", "Valdemar", "Vilém", "Maxmilián", "Ferdinand", "Kamila"],
  // Červen
  ["Laura", "Jarmil", "Tamara", "Dalibor", "Dobroslav", "Norbert", "Iveta a Slavoj", "Medard", "Stanislava", "Gita",
   "Bruno", "Antonie", "Antonín", "Roland", "Vít", "Zbyněk", "Adolf", "Milan", "Leoš", "Květa",
   "Alois", "Pavla", "Zdeňka", "Jan", "Ivan", "Adriana", "Ladislav", "Lubomír", "Petr a Pavel", "Šárka"],
  // Červenec
  ["Jaroslava", "Patricie", "Radomír", "Prokop", "Cyril a Metoděj", "Mistr Jan Hus", "Bohuslava", "Nora", "Drahoslava", "Libuše a Amálie",
   "Olga", "Bořek", "Markéta", "Karolína", "Jindřich", "Luboš", "Martina", "Drahomíra", "Čeněk", "Ilja",
   "Vítězslav", "Magdaléna", "Libor", "Kristýna", "Jakub", "Anna", "Věroslav", "Viktor", "Marta", "Bořivoj", "Ignác"],
  // Srpen
  ["Oskar", "Gustav", "Miluše", "Dominik", "Kristián", "Oldřiška", "Lada", "Soběslav", "Roman", "Vavřinec",
   "Zuzana", "Klára", "Alena", "Alan", "Hana", "Jáchym", "Petra", "Helena", "Ludvík", "Bernard",
   "Johana", "Bohuslav", "Sandra", "Bartoloměj", "Radim", "Luděk", "Otakar", "Augustýn", "Evelína", "Vladěna", "Pavlína"],
  // Září
  ["Linda a Samuel", "Adéla", "Bronislav", "Jindřiška", "Boris", "Boleslav", "Regína", "Mariana", "Daniela", "Irma",
   "Denisa", "Marie", "Lubor", "Radka", "Jolana", "Ludmila", "Naděžda", "Kryštof", "Zita", "Oleg",
   "Matouš", "Darina", "Berta", "Jaromír", "Zlata", "Andrea", "Jonáš", "Václav", "Michal", "Jeroným"],
  // Říjen
  ["Igor", "Olívie a Oliver", "Bohumil", "František", "Eliška", "Hanuš", "Justýna", "Věra", "Štefan a Sára", "Marina",
   "Andrej", "Marcel", "Renáta", "Agáta", "Tereza", "Havel", "Hedvika", "Lukáš", "Michaela", "Vendelín",
   "Brigita", "Sabina", "Teodor", "Nina", "Beáta", "Erik", "Šarlota a Zoe", "Den vzniku ČSR", "Silvie", "Tadeáš", "Štěpánka"],
  // Listopad
  ["Felix", "Památka zesnulých", "Hubert", "Karel", "Miriam", "Liběna", "Saskie", "Bohumír", "Bohdan", "Evžen",
   "Martin", "Benedikt", "Tibor", "Sáva", "Leopold", "Otmar", "Mahulena", "Romana", "Alžběta", "Nikola",
   "Albert", "Cecílie", "Klement", "Emílie", "Kateřina", "Artur", "Xenie", "René", "Zina", "Ondřej"],
  // Prosinec
  ["Iva", "Blanka", "Svatoslav", "Barbora", "Jitka", "Mikuláš", "Ambrož a Benjamín", "Květoslava", "Vratislav", "Julie",
   "Dana", "Simona", "Lucie", "Lýdie", "Radana a Radan", "Albína", "Daniel", "Miloslav", "Ester", "Dagmar",
   "Natálie", "Šimon", "Vlasta", "Adam a Eva", "1. svátek vánoční", "Štěpán", "Žaneta", "Bohumila", "Judita", "David", "Silvestr"],
];

/** Dny, které v kalendáři nejsou jména (státní svátky apod.) — ty se neprodávají jako „svátek“. */
const NENI_JMENO = new Set([
  "Nový rok", "Tři králové", "Svátek práce", "Den vítězství", "Cyril a Metoděj",
  "Mistr Jan Hus", "Den vzniku ČSR", "Památka zesnulých", "Adam a Eva",
  "1. svátek vánoční", "Silvestr",
]);

export type Svatek = {
  /** MM-DD */
  key: string;
  month: number;
  day: number;
  /** Text z kalendáře (může být „Petr a Pavel“). */
  text: string;
  /** Jednotlivá jména. Prázdné u státních svátků. */
  names: string[];
};

function toSvatek(month: number, day: number, text: string): Svatek {
  const names = NENI_JMENO.has(text) ? [] : text.split(" a ").map((s) => s.trim());
  return {
    key: `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    month,
    day,
    text,
    names,
  };
}

/** Celý rok jako seřazené pole (366 položek). */
export const SVATKY: Svatek[] = KALENDAR.flatMap((mesic, mi) =>
  mesic.map((text, di) => toSvatek(mi + 1, di + 1, text))
);

const BY_KEY = new Map(SVATKY.map((s) => [s.key, s]));

/** Svátek pro YYYY-MM-DD nebo MM-DD. */
export function svatekPro(iso: string): Svatek | undefined {
  const key = iso.length === 10 ? iso.slice(5) : iso;
  return BY_KEY.get(key);
}

function fold(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Hledání jména bez ohledu na diakritiku a velikost písmen. */
export function hledejSvatek(query: string): Svatek[] {
  const q = fold(query.trim());
  if (!q) return [];
  return SVATKY.filter((s) => s.names.some((n) => fold(n).startsWith(q)));
}

/** Přesné jméno → MM-DD (pro zákazníky se zadaným jménem svátku). */
export function svatekJmena(name: string): Svatek | undefined {
  const q = fold(name.trim());
  return SVATKY.find((s) => s.names.some((n) => fold(n) === q));
}

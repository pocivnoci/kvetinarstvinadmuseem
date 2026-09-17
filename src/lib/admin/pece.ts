/**
 * Péče o řezané květiny — referenční tabulka pro floristku a text
 * na kartičku pro zákazníka. Hodnoty jsou orientační (běžné pokojové
 * podmínky, čerstvé zboží).
 */

export type PeceKvetina = {
  id: string;
  name: string;
  /** Orientační výdrž ve váze (dny). */
  vaseLife: [number, number];
  /** Teplota vody. */
  water: "studená" | "vlažná" | "teplá";
  /** Pro floristku — příjem a zpracování. */
  florist: string;
  /** Pro zákazníka — na kartičku. */
  customer: string;
  /** Seřezání: šikmo / rovně / netřeba. */
  cut: string;
  /** Snáší se s ostatními? */
  warning?: string;
};

export const PECE: PeceKvetina[] = [
  {
    id: "ruze", name: "Růže", vaseLife: [7, 12], water: "vlažná", cut: "šikmo, 2–3 cm",
    florist: "Odstranit trny a listy pod hladinou, seříznout pod tekoucí vodou. Skleslé hlavičky zabalit do papíru a dát na 2 h do vody až po hlavičky.",
    customer: "Seřízněte stonky šikmo o 2–3 cm, listy pod hladinou odstraňte. Vodu měňte každé 2 dny a přidejte výživu. Držte dál od ovoce a topení.",
  },
  {
    id: "tulipan", name: "Tulipán", vaseLife: [5, 8], water: "studená", cut: "rovně, 1–2 cm",
    florist: "Rostou ve váze dál (i 5 cm), počítat s tím ve vazbě. Zabalené v papíru narovnají stonky. Málo vody — jen 5–7 cm.",
    customer: "Jen málo studené vody (5–7 cm), doplňujte denně. Tulipány ve váze dorůstají a natáčejí se za světlem — to je v pořádku. Nedávejte k narcisům.",
    warning: "Nekombinovat ve váze s narcisy (sliz z narcisů je ničí).",
  },
  {
    id: "pivonka", name: "Pivoňka", vaseLife: [5, 10], water: "vlažná", cut: "šikmo",
    florist: "Prodávat v poupatech měkkých jako marshmallow — tvrdá se neotevřou. Otevírání urychlí teplá voda a světlo, zpomalí chlad.",
    customer: "Poupata se otevřou během 1–3 dnů ve vlažné vodě na světle. Plně rozkvetlé dejte do chladu, vydrží déle. Vodu měňte obden.",
  },
  {
    id: "hortenzie", name: "Hortenzie", vaseLife: [5, 10], water: "vlažná", cut: "šikmo, hluboko",
    florist: "Pije i květem — zvadlou celou ponořit na 30 min do studené vody. Konce stonků na 10 s do vroucí vody nebo alum.",
    customer: "Hodně vody, hortenzie pije nejvíc ze všech. Když povadne, ponořte celý květ na půl hodiny do studené vody a znovu seřízněte stonek.",
  },
  {
    id: "lilie", name: "Lilie", vaseLife: [8, 14], water: "vlažná", cut: "šikmo",
    florist: "Odstranit prašníky hned po otevření (pyl špiní a zkracuje životnost). Silná vůně — upozornit zákazníka, nevhodné k lůžku nemocného.",
    customer: "Po otevření květu opatrně odstraňte oranžové prašníky — pyl špiní textil. Pyl je jedovatý pro kočky. Vodu měňte každé 2–3 dny.",
    warning: "Pyl je toxický pro kočky.",
  },
  {
    id: "gerbera", name: "Gerbera", vaseLife: [7, 10], water: "studená", cut: "rovně, 1 cm",
    florist: "Stonky hnijí — jen 3–5 cm vody, čistá váza, ideálně drátkovat. Neseřezávat šikmo.",
    customer: "Málo vody (3–5 cm) v čisté váze, měňte denně. Stonky seřízněte rovně o 1 cm.",
  },
  {
    id: "chryzantema", name: "Chryzantéma", vaseLife: [10, 20], water: "vlažná", cut: "šikmo",
    florist: "Nejtrvanlivější řezaná květina. Odstranit spodní listy — vadnou dřív než květ. Klíčové zboží na Dušičky.",
    customer: "Odstraňte listy pod hladinou, vodu měňte každé 3 dny. Vydrží i 2–3 týdny.",
  },
  {
    id: "slunecnice", name: "Slunečnice", vaseLife: [6, 10], water: "vlažná", cut: "šikmo",
    florist: "Těžká hlava — pevný stonek, nezalamovat. Hodně pije, listy pryč. Hlavu držet drátkem u vazby.",
    customer: "Hodně vody, doplňujte denně. Odstraňte listy pod hladinou, seřízněte šikmo.",
  },
  {
    id: "eustoma", name: "Eustoma (lisianthus)", vaseLife: [10, 14], water: "vlažná", cut: "šikmo",
    florist: "Poupata se ve váze dobře otevírají. Křehké stonky. Výživa výrazně prodlužuje životnost.",
    customer: "Vodu s výživou měňte obden. Odkvetlé květy odstraňujte, poupata se dál otevírají.",
  },
  {
    id: "pryskyrnik", name: "Pryskyřník (ranunculus)", vaseLife: [7, 10], water: "studená", cut: "šikmo",
    florist: "Duté stonky — nevázat příliš těsně, prasknou. Chlad výrazně prodlužuje. Prodávat v poupatech.",
    customer: "Studená voda, chladnější místo bez přímého slunce. Vodu měňte obden, seřízněte pokaždé o 1 cm.",
  },
  {
    id: "sasanka", name: "Sasanka (anemone)", vaseLife: [5, 8], water: "studená", cut: "šikmo",
    florist: "Otevírá a zavírá se se světlem. Málo vody, jinak stonky měknou.",
    customer: "Málo studené vody, doplňujte denně. Květy se na noc zavírají, ráno otevřou — je to normální.",
  },
  {
    id: "alstromerie", name: "Alstroemerie", vaseLife: [10, 14], water: "vlažná", cut: "šikmo",
    florist: "Listy žloutnou dřív než květ — odstranit většinu listů hned. Netrhat, seřezávat.",
    customer: "Odstraňte většinu listů, květ vydrží déle. Vodu měňte každé 2–3 dny.",
  },
  {
    id: "karafiat", name: "Karafiát", vaseLife: [10, 21], water: "vlažná", cut: "šikmo, mezi kolénky",
    florist: "Seřezávat mezi kolénky, ne v nich. Citlivý na etylén — daleko od ovoce. Velmi trvanlivý.",
    customer: "Seřízněte mezi kolénky stonku, ne v nich. Držte dál od ovoce. Vydrží 2–3 týdny.",
  },
  {
    id: "frezie", name: "Frézie", vaseLife: [7, 10], water: "vlažná", cut: "šikmo",
    florist: "Otevírá se postupně od spodu. Odkvetlé květy odštipovat. Citlivá na chlor — odstátá voda.",
    customer: "Odstraňujte odkvetlé květy, další poupata se otevřou. Použijte odstátou vodu s výživou.",
  },
  {
    id: "orchidej", name: "Orchidej (řezaná)", vaseLife: [10, 21], water: "vlažná", cut: "šikmo",
    florist: "Nevystavovat chladu pod 10 °C. Vydrží dlouho i v ampulce. Nedávat k ovoci.",
    customer: "Vodu měňte každé 3 dny, seřízněte pokaždé o 1 cm. Nedávejte k ovoci ani do průvanu.",
  },
  {
    id: "jirina", name: "Jiřina (dahlia)", vaseLife: [4, 7], water: "teplá", cut: "šikmo",
    florist: "Konce stonků na pár sekund do horké vody (uzavře vodivé cesty). Prodávat plně rozkvetlé — poupata se neotevřou.",
    customer: "Vodu měňte denně, jiřiny ji rychle kazí. Chladnější místo prodlouží výdrž.",
  },
  {
    id: "narcis", name: "Narcis", vaseLife: [4, 7], water: "studená", cut: "rovně",
    florist: "Vylučuje sliz, který ničí ostatní květiny. Nechat 12–24 h zvlášť ve vodě, pak vázat (bez dalšího seřezání).",
    customer: "Narcisy dejte samostatně do vlastní vázy, jiné květiny by vedle nich rychle povadly.",
    warning: "Vždy zvlášť od ostatních květin.",
  },
  {
    id: "hyacint", name: "Hyacint", vaseLife: [5, 8], water: "studená", cut: "rovně",
    florist: "Ponechat kousek cibule na stonku — vydrží déle. Silná vůně. Sliz podobně jako narcis.",
    customer: "Studená voda, chladnější místo. Silně voní — na malý prostor jeden stačí.",
  },
  {
    id: "eukalyptus", name: "Eukalyptus", vaseLife: [14, 21], water: "vlažná", cut: "šikmo, roztlouct",
    florist: "Dřevnatý stonek — seříznout a roztlouct konec. Krásně se suší v prázdné váze.",
    customer: "Vydrží týdny; když voda dojde, nechte ho uschnout — sušený vydrží měsíce.",
  },
  {
    id: "susene", name: "Sušené květiny (pampas, lagurus…)", vaseLife: [180, 365], water: "studená", cut: "netřeba",
    florist: "Bez vody! Pampas pro fixaci pírek přestříkat lakem na vlasy. Nevystavovat vlhku a přímému slunci (blednutí).",
    customer: "Nedávejte do vody. Držte dál od vlhka a přímého slunce, občas jemně oprášte. Vydrží měsíce až roky.",
  },
];

/** Obecné zásady — na kartičku pro zákazníka jako úvod. */
export const PECE_OBECNE = [
  "Kytici co nejdřív rozbalte a dejte do čisté vázy s čerstvou vodou.",
  "Stonky seřízněte šikmo ostrým nožem o 2–3 cm.",
  "Odstraňte všechny listy, které by byly pod hladinou.",
  "Vodu měňte každé 2 dny a pokaždé stonky znovu seřízněte.",
  "Vázu postavte mimo přímé slunce, topení, průvan a ovoce.",
];

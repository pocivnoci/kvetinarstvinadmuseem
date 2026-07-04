import { SITE } from "../site";

export type SeasonKey = "spring" | "summer" | "autumn" | "winter";

const SEASONS: {
  key: SeasonKey;
  eyebrow: string;
  title: string;
  body: string;
}[] = [
  {
    key: "spring",
    eyebrow: "01 · Hned s sebou",
    title: "Kytice",
    body: "Čerstvé kytice vázané ručně každý den — připravené hned k odnesení, nebo je uvážeme na počkání. Od drobné kytice za 200 Kč po velkou vazbu. Pro chvíle, kdy spěcháte, ale chcete, aby se to poznalo.",
  },
  {
    key: "summer",
    eyebrow: "02 · Podle vás",
    title: "Na míru",
    body: "Řekněte barvu, příležitost a rozpočet. Zbytek je na nás. Vazba na míru během třiceti minut — nebo s předstihem, když chcete přemýšlet o detailech.",
  },
  {
    key: "autumn",
    eyebrow: "03 · Velké chvíle",
    title: "Příležitosti",
    body: "Svatby, smuteční vazby, otevření galerií a restaurací. Konzultace, návrh, realizace. Diskrétně. Včas. Bez improvizace na poslední chvíli.",
  },
  {
    key: "winter",
    eyebrow: "04 · Drobné radosti",
    title: "Dárky",
    body: "Vázy, keramika, sušené vazby, svíce a sezónní dekorace. Věci, které vydrží déle než kytice, ale stojí na stejném vkusu.",
  },
];

export const cs = {
  locale: "cs",
  htmlLang: "cs",

  SHOP: {
    name: "Květiny nad museem",
    shortName: "Květiny",
    tagline: "Rodinné květinářství krok nad Národním muzeem.",
  },

  CONTACT: {
    address: "Vinohradská 6",
    city: "Praha 2 — Vinohrady",
    postal: "120 00",
    nearestStop: "Muzeum (metro A, C) · 2 min",
    phone: SITE.phone,
    phoneHref: SITE.phoneHref,
    email: SITE.email,
    emailHref: SITE.emailHref,
    instagram: SITE.instagram,
    instagramUrl: SITE.instagramUrl,
    hours: {
      weekdays: "Po–Pá  8:00 – 18:00",
      weekend: "So–Ne    zavřeno",
    },
  },

  NAV_LINKS: [
    { href: "#kytice", label: "Kytice" },
    { href: "#na-miru", label: "Na míru" },
    { href: "#prilezitosti", label: "Příležitosti" },
    { href: "#o-nas", label: "O nás" },
    { href: "#kontakt", label: "Kontakt" },
  ],

  SEO: {
    title: "Květiny nad museem — Květinářství Praha Vinohrady",
    description:
      "Rodinné květinářství na Vinohradech u Národního muzea a Václavského náměstí. Kytice už od 200 Kč, vazby na míru, svatební i smuteční floristika, donáška po Praze.",
    url: SITE.url,
    ogImage: SITE.ogImage,
    ogLocale: "cs_CZ",
    keywords: [
      "květinářství Praha",
      "květinářství Praha 2",
      "květinářství Vinohrady",
      "květinářství Václavské náměstí",
      "květinářství u Národního muzea",
      "květinářství metro Muzeum",
      "rodinné květinářství Praha",
      "kytice Praha",
      "kytice od 200 Kč",
      "levné kytice Praha",
      "malá kytice Praha",
      "vazby na míru Praha",
      "rozvoz květin Praha",
      "donáška květin Praha",
      "doručení květin Praha 2",
      "svatební kytice Praha",
      "svatební floristika Praha",
      "smuteční kytice Praha",
      "smuteční věnec Praha",
      "růže Praha",
      "květiny Vinohrady",
      "Květiny nad museem",
    ],
  },

  HERO: {
    eyebrow: "Rodinné květinářství · Praha — Vinohrady",
    title: "Květiny nad museem.",
    lede: "Rodinné květinářství krok nad Národním muzeem, pár minut od Václavského náměstí. Kytice už od 200 Kč, vazby na míru i svatební a smuteční floristika — vázané ručně a s citem. Donáška po Praze.",
    ctaPrimary: { label: "Objednat kytici", href: "#kytice" },
    ctaGhost: { label: "Najít nás", href: "#kontakt" },
    slides: [
      { src: "/images/hero/hero-1.jpg", alt: "Výloha květinářství Květiny nad museem s cedulí nad vchodem", caption: "Krok nad Národním muzeem" },
      { src: "/images/hero/hero-2.jpg", alt: "Malovaná skříňka s vazbou a věnce před tapetou v krámku", caption: "Rodinný krámek na Vinohradech" },
      { src: "/images/hero/hero-3.jpg", alt: "Malovaná skříňka se svěžími květinami v krámku", caption: "Čerstvé kytice každý den" },
      { src: "/images/hero/hero-4.jpg", alt: "Zakladatelka Adéla drží dvě sušené vazby v krabicích", caption: "Vážeme ručně, s citem" },
      { src: "/images/hero/hero-5.jpg", alt: "Detail sušené vazby v krabici s růžovou stuhou", caption: "Sušené vazby a dekorace" },
      { src: "/images/hero/hero-6.jpg", alt: "Kytice růží a chryzantém v modrých a růžových tónech", caption: "Vazby na míru" },
      { src: "/images/hero/hero-7.jpg", alt: "Jemná kytice růží s bílou kartičkou k přání", caption: "Ke každé příležitosti" },
      { src: "/images/hero/hero-8.jpg", alt: "Malované vázy s pokojovými rostlinami na stole", caption: "Vázy, keramika a rostliny" },
    ],
  },

  BRAND_STRIP: {
    eyebrow: "Co u nás najdete",
    body: "Jsme rodinné květinářství na Vinohradech, kousek od Václavského náměstí. Kytice, vazby na míru, dárky, sušené dekorace i vázy — od jedné růže za 200 Kč po výzdobu celé oslavy. Vázáno ručně, tak aby to vydrželo.",
  },

  WALLPAPER: {
    eyebrow: "Rodinné květinářství",
    title: "Kytice od rodiny, ne od pásu.",
    body: "Květiny vybíráme každý den u prověřených velkoobchodů — abyste si mohli vybrat i mimo sezónu. Poradíme vám napříč rozpočtem: od drobné kytice do ruky za 200 Kč po velkou vazbu na míru.",
    cta: { label: "Prohlédnout kytice", href: "#kytice" },
  },

  SEASONS,

  SIGNATURE: {
    eyebrow: "Od drobné pozornosti po velkou vazbu",
    title: "Kytice pro každou příležitost",
    body: "Od malé kytice do ruky po velkou vazbu na míru. Řekněte příležitost a rozpočet — zbytek je na nás. Vážeme ručně, často na počkání.",
    cards: [
      {
        title: "Pro radost",
        subtitle: "Malá kytice · drobná pozornost",
        body: "Malá ručně vázaná kytice nebo pár jednotlivých květin do ruky. Jen tak pro radost, na cestu domů nebo k narozeninám.",
        priceFrom: "200 Kč",
        accent: "var(--shell-deep)",
      },
      {
        title: "Kytice na míru",
        subtitle: "Podle barvy, velikosti a rozpočtu",
        body: "Kytici uvážeme přesně podle vás — barva, velikost i cena. Na počkání během chvíle, nebo s předstihem na velkou příležitost.",
        priceFrom: "590 Kč",
        accent: "var(--terracotta)",
      },
      {
        title: "Svatby & smuteční vazby",
        subtitle: "Floristika na míru",
        body: "Svatební kytice a výzdoba i smuteční vazby a věnce. Konzultace, návrh a realizace — diskrétně a s předstihem.",
        priceFrom: "Dle domluvy",
        accent: "var(--sage-pale)",
      },
    ],
  },

  PROSTOR: {
    eyebrow: "Prostor",
    title: "Krok nad muzeem.",
    body: "Plno čerstvých kytic ve vědrech a vůně, kterou cítíte už ode dveří. Stavte se — nebo si jen vezměte jednu růži cestou domů.",
    images: [
      { src: "/images/shop-1.jpg", alt: "Výloha květinářství Květiny nad museem z ulice s lavicí kytic" },
      { src: "/images/shop-2.jpg", alt: "Interiér krámku s čerstvými květinami ve vědrech" },
      { src: "/images/shop-3.jpg", alt: "Pracovní stůl s kyticemi před květinovou tapetou" },
      { src: "/images/shop-4.jpg", alt: "Černý industriální regál s keramikou a pokojovými rostlinami" },
      { src: "/images/shop-5.jpg", alt: "Malovaná skříňka se svěžími květinami v krámku" },
      { src: "/images/shop-6.jpg", alt: "Růžový stůl s vázanými růžemi" },
      { src: "/images/shop-7.jpg", alt: "Regál s věnci a svícemi" },
    ],
  },

  DEKORACE: {
    eyebrow: "Dárky a dekorace",
    title: "Věnce, svícny a sušené vazby",
    body: "Sušené věnce, svícny obtočené květinami a drobné dekorace pro byt i jako dárek. Každý kousek vážeme ručně — tak aby vydržel dlouho po tom, co čerstvá kytice odkvete.",
    images: [
      { src: "/images/dekorace/dekorace-1.jpg", alt: "Závěsná dekorace ze sušených bílých květů s perličkami" },
      { src: "/images/dekorace/dekorace-2.jpg", alt: "Věneček se svící a růžovými květy v košíku" },
      { src: "/images/dekorace/dekorace-3.jpg", alt: "Sušená vazba v růžových a broskvových tónech ve zlaté váze" },
      { src: "/images/dekorace/dekorace-4.jpg", alt: "Závěsný věnec ze sušených květin na stojanu" },
      { src: "/images/dekorace/dekorace-5.jpg", alt: "Svícen obtočený drobnou květinovou vazbou" },
      { src: "/images/dekorace/dekorace-6.jpg", alt: "Stěna sušených věnců na staré okenici v krámku" },
      { src: "/images/dekorace/dekorace-7.jpg", alt: "Drobné vazby a věnečky na stolku" },
      { src: "/images/dekorace/dekorace-8.jpg", alt: "Sušená vazba v bordó a broskvových tónech" },
    ],
  },

  ROSTLINY: {
    eyebrow: "Pro domov",
    title: "Pokojové rostliny",
    body: "Ficusy, dracény, kaktusy i drobné sukulenty v květináčích, které ladí s krámkem. Poradíme, která rostlina se hodí do vašeho světla a jak se o ni starat.",
    images: [
      { src: "/images/rostliny/rostliny-1.jpg", alt: "Vysoká pokojová rostlina v modrém květináči" },
      { src: "/images/rostliny/rostliny-2.jpg", alt: "Kaktus v keramickém květináči na pultu" },
      { src: "/images/rostliny/rostliny-3.jpg", alt: "Zamiokulkas v růžovém květináči" },
      { src: "/images/rostliny/rostliny-4.jpg", alt: "Slonovinová palma v květovaném květináči" },
      { src: "/images/rostliny/rostliny-5.jpg", alt: "Dvě dracény v pletených květináčích" },
      { src: "/images/rostliny/rostliny-6.jpg", alt: "Barevné sukulenty ve zlatých květináčích" },
      { src: "/images/rostliny/rostliny-7.jpg", alt: "Vzrostlý stromek v bílém květináči" },
      { src: "/images/rostliny/rostliny-8.jpg", alt: "Croton s červenolistými listy zblízka" },
    ],
  },

  ABOUT: {
    eyebrow: "Náš příběh",
    title: "Chtěla jsem to dělat jinak.",
    body: [
      "Roky jsem vázala kytice v různých pražských květinářstvích. Naučila jsem se řemeslo a poznala spoustu květin — ale pořád mi něco nesedělo. Kytice se skládaly narychlo, vybíraly se podle ceny a často šlo hlavně o to, aby to bylo rychle z ruky.",
      "Chtěla jsem to dělat jinak. Mít vlastní krámek, kde si vyberete podle toho, co se vám líbí, ne podle cenovky. Kde se kytice váže v klidu a s citem — a kde vám radši poradím poctivě, než abych prodala to nejlevnější.",
      "Tak vznikly Květiny nad museem — malé rodinné květinářství krok nad Národním muzeem a kousek od Václavského náměstí. Najdete u nás kytice od 200 Kč i velké vazby na míru. Dělám ho po svém. A je to konečně ono.",
    ],
    pullQuote:
      "Roky jsem vázala květiny pro někoho jiného. Tohle je první krámek, který dělám doopravdy po svém.",
    pullQuoteBy: "— Adéla, zakladatelka",
    image: { src: "/images/about.jpg", alt: "Bohatá vazba z dílny Květin nad museem" },
  },

  GALLERY: {
    eyebrow: "Z naší dílny",
    title: "Co u nás vznikne",
    body: "Pár kousků z posledních týdnů — kytice, vazby a chvíle z krámku. Každou vážeme u nás, ručně.",
    hint: "Táhněte do strany",
    slides: [
      { src: "/images/gallery/g-1.jpg", alt: "Bohatá vazba v růžových a fialových tónech", caption: "Bohatá vazba", tone: "var(--shell-deep)" },
      { src: "/images/gallery/g-2.jpg", alt: "Sušené trávy a pivoňky ve vázách u okna", caption: "Sušené trávy", tone: "var(--mustard)" },
      { src: "/images/gallery/g-3.jpg", alt: "Vysoká slavnostní vazba na stole", caption: "Vysoká vazba", tone: "var(--dusk-blue)" },
      { src: "/images/gallery/g-4.jpg", alt: "Stěna z čerstvých květin a věnců", caption: "Květinová stěna", tone: "var(--moss)" },
      { src: "/images/gallery/g-5.jpg", alt: "Vazba v růžových tónech", caption: "Růžové ladění", tone: "var(--shell-warm)" },
      { src: "/images/gallery/g-6.jpg", alt: "Keramické vázy v krámku", caption: "Vázy a keramika", tone: "var(--stone)" },
      { src: "/images/gallery/g-7.jpg", alt: "Květinový věnec na dveřích", caption: "Věnce na přání", tone: "var(--gilt)" },
      { src: "/images/gallery/g-8.jpg", alt: "Čerstvé kytice připravené ve vědrech", caption: "Čerstvé kytice", tone: "var(--terracotta)" },
      { src: "/images/gallery/g-9.jpg", alt: "Vazba v levandulových a růžových tónech ve váze", caption: "Levandulové ladění", tone: "var(--dusk-blue)" },
      { src: "/images/gallery/g-10.jpg", alt: "Kytice sytě růžových gerber na růžovém pozadí", caption: "Sytě růžová", tone: "var(--shell-deep)" },
      { src: "/images/gallery/g-11.jpg", alt: "Kytice u skleněných dveří krámku", caption: "Kytice od dveří", tone: "var(--sage-pale)" },
      { src: "/images/gallery/g-12.jpg", alt: "Broskvová vazba s žlutými růžemi", caption: "Broskvové odstíny", tone: "var(--mustard)" },
      { src: "/images/gallery/g-13.jpg", alt: "Sušené trávy a květiny ve zlaté váze", caption: "Sušená tráva", tone: "var(--gilt)" },
      { src: "/images/gallery/g-14.jpg", alt: "Modrá hortenzie zabalená v papíru před tapetou", caption: "Modrá hortenzie", tone: "var(--moss)" },
      { src: "/images/gallery/g-15.jpg", alt: "Kytice v bordó a bílých tónech", caption: "Bordó ladění", tone: "var(--terracotta)" },
      { src: "/images/gallery/g-16.jpg", alt: "Kytice na okenním parapetu u vchodu", caption: "Kytice u okna", tone: "var(--shell-warm)" },
    ],
  },

  REVIEWS: {
    eyebrow: "Recenze",
    title: "Co říkají zákazníci",
    body: "Pár ohlasů od lidí, kteří u nás nakoupili. Děkujeme za každou kytici i milá slova.",
    googleUrl:
      "https://www.google.com/maps/search/?api=1&query=Kv%C4%9Btiny%20nad%20museem%20Vinohradsk%C3%A1%206%20Praha",
    googleLabel: "Recenze na Googlu",
    // Reálné recenze sem doplň, až je budeš mít: { author, rating (1–5), text, date }.
    // Sekce Reviews je zatím skrytá v page.tsx — žádné smyšlené recenze nepublikujeme
    // (ani do zdroje stránky).
    items: [] as { author: string; rating: number; text: string; date: string }[],
  },

  VISIT: {
    eyebrow: "Kontakt",
    title: "Najdete nás",
  },

  FOOTER: {
    blurb:
      "Rodinné květinářství na Vinohradech, krok nad Národním muzeem a kousek od Václavského náměstí. Kytice už od 200 Kč, vazby na míru, vázy a dárky — s donáškou po Praze.",
    columns: [
      {
        heading: "Prodej",
        links: [
          { label: "Kytice", href: "#kytice" },
          { label: "Na míru", href: "#na-miru" },
          { label: "Dekorace a rostliny", href: "#doplnky" },
          { label: "Doručení po Praze", href: "#kontakt" },
        ],
      },
      {
        heading: "Příležitosti",
        links: [
          { label: "Svatby", href: "#prilezitosti" },
          { label: "Smuteční vazby", href: "#prilezitosti" },
          { label: "Otevření", href: "#prilezitosti" },
          { label: "Firemní akce", href: "#prilezitosti" },
        ],
      },
    ],
    newsletter: {
      heading: "Novinky z krámku",
      body: "Krátký dopis jednou za měsíc. Nové kytice, tipy na dárky a co se u nás v krámku děje.",
      placeholder: "vas@email.cz",
      cta: "Přihlásit",
    },
    legal: "© 2026 Květiny nad museem. Vyrobeno s láskou v Praze.",
  },

  INFOBAR: [
    { label: "Otevřeno", value: "Po–Pá 8–18", href: "" },
    { label: "Kde", value: "Vinohradská 6 · metro Muzeum", href: "" },
    { label: "Blízko", value: "5 min od Václavského nám.", href: "" },
    { label: "Doručení", value: "po celé Praze", href: "" },
    { label: "Telefon", value: SITE.phone, href: SITE.phoneHref },
  ],

  // Roztroušené UI texty (aria popisky, tlačítka, popisky ovládání)
  UI: {
    orderShort: "Objednat",
    orderBouquet: "Objednat kytici",
    menuOpen: "Otevřít menu",
    menuClose: "Zavřít menu",
    heroSection: "Úvod — rodinné květinářství Květiny nad museem",
    slides: "Snímky",
    priceFrom: "Od",
    galleryPrev: "Předchozí",
    galleryNext: "Další",
    galleryOf: "z",
    galleryGoTo: "Přejít na",
    seasonsAria: "Co u nás najdete — kytice, na míru, příležitosti, dárky",
    doplnkyAria: "Dekorace, věnce a pokojové rostliny",
    aboutAria: "O nás",
    ratingPrefix: "Hodnocení",
    ratingSuffix: "z 5 hvězd",
    visitAria: "Kontakt a otevírací doba",
    visitWhere: "Kde",
    visitOpen: "Otevřeno",
    visitWrite: "Napište nám",
    visitOpenNow: "Právě otevřeno",
    visitConsult: "Domluvit konzultaci",
    getDirections: "Najít cestu",
    mapTitle: "Mapa — Květiny nad museem, Vinohradská 6, Praha 2",
    footerEmailLabel: "E-mail",
    footerThanks: "Děkujeme ✓",
    whatsappAria: "Napište nám na WhatsApp",
    whatsappText: "Dobrý den, chtěl/a bych se zeptat na kytici.",
    switchLang: "English",
    switchLangAria: "Switch to English",
  },

  FAQ: [
    { q: "Kde Květiny nad museem najdu?", a: "Na adrese Vinohradská 6, Praha 2 — Vinohrady, pár kroků od Národního muzea a stanice metra Muzeum (linky A a C)." },
    { q: "Jaká je otevírací doba?", a: "Otevřeno máme pondělí až pátek od 8:00 do 18:00. O víkendu (sobota, neděle) je zavřeno." },
    { q: "Doručujete květiny po Praze?", a: "Ano, kytice i vazby doručujeme po celé Praze. Doručení je nejlepší domluvit telefonicky na +420 770 401 834." },
    { q: "Děláte svatby, smuteční vazby a firemní akce?", a: "Ano. Vážeme svatební floristiku, smuteční vazby i výzdobu pro otevření a firemní akce — vše na míru a po domluvě, ideálně s předstihem." },
    { q: "Vážete kytice na míru?", a: "Ano. Kytici uvážeme podle barvy, příležitosti i rozpočtu — často během chvíle přímo v krámku." },
    { q: "Máte květiny jen v sezóně?", a: "Ne. Díky odběru u prověřených velkoobchodů nabízíme širokou nabídku po celý rok — najdete u nás pivoňky i mimo jejich krátkou sezónu a růže po celý rok." },
    { q: "Máte i levnější kytice, třeba od 200 Kč?", a: "Ano. Začínáme u malých ručně vázaných kytic a jednotlivých květin už od 200 Kč — a vyjdeme vám vstříc napříč rozpočtem až po velké vazby na míru." },
    { q: "Jste blízko Václavského náměstí a centra Prahy?", a: "Ano. Najdete nás na adrese Vinohradská 6 na Vinohradech, pár minut pěšky od Václavského náměstí, Národního muzea a stanice metra Muzeum (linky A a C)." },
  ],

  SERVICES: [
    "Kytice na všední den i slavnostní příležitosti",
    "Vazby na míru",
    "Svatební floristika",
    "Smuteční vazby",
    "Výzdoba firemních akcí a otevření",
    "Dárky, vázy a sušené dekorace",
    "Doručení po Praze",
  ],
};

export type Dictionary = typeof cs;

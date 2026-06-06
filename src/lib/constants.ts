export const SHOP = {
  name: "Květiny nad museem",
  shortName: "Květiny",
  tagline: "Rodinné květinářství krok nad Národním muzeem.",
};

export const CONTACT = {
  address: "Vinohradská 6",
  city: "Praha 2 — Vinohrady",
  postal: "120 00",
  nearestStop: "Muzeum (metro A, C) · 2 min",
  phone: "+420 770 401 834",
  phoneHref: "tel:+420770401834",
  email: "info@kvetinynadmuseem.cz",
  emailHref: "mailto:info@kvetinynadmuseem.cz",
  instagram: "@kvetinynadmuseem",
  instagramUrl: "https://instagram.com/kvetinynadmuseem",
  // TODO: ověřit přesné hodiny — z profilu známo jen „zavírá v 18"
  hours: {
    weekdays: "Po–Pá  9:00 – 18:00",
    saturday: "So       9:00 – 18:00",
    sunday: "Ne       zavřeno",
  },
};

export const NAV_LINKS = [
  { href: "#kytice", label: "Kytice" },
  { href: "#na-miru", label: "Na míru" },
  { href: "#prilezitosti", label: "Příležitosti" },
  { href: "#o-nas", label: "O nás" },
  { href: "#kontakt", label: "Kontakt" },
];

export const SEO = {
  title: "Květiny nad museem — Květinářství Praha Vinohrady",
  description:
    "Rodinné květinářství na Vinohradech u Národního muzea a Václavského náměstí. Kytice už od 200 Kč, vazby na míru, svatební i smuteční floristika, donáška po Praze.",
  url: "https://kvetinynadmuseem.cz",
  ogImage: "/images/og.jpg",
};

export const HERO = {
  eyebrow: "Rodinné květinářství · Praha — Vinohrady",
  title: "Květiny nad museem.",
  lede: "Rodinné květinářství krok nad Národním muzeem, pár minut od Václavského náměstí. Kytice už od 200 Kč, vazby na míru i svatební a smuteční floristika — vázané ručně a s citem. Donáška po Praze.",
  ctaPrimary: { label: "Objednat kytici", href: "#kytice" },
  ctaGhost: { label: "Najít nás", href: "#kontakt" },
  video: {
    mp4: "/images/hero/hero-video.mp4",
    poster: "/images/hero/hero-poster.jpg",
    label: "Živě z dílny",
  },
  slides: [
    { src: "/images/hero/hero-1.jpg", alt: "Lavice plná čerstvých zabalených kytic v krámku", caption: "Čerstvé kytice každý den" },
    { src: "/images/hero/hero-2.jpg", alt: "Bohatá vazba z fialových a růžových květů zblízka", caption: "Vázané ručně, s citem" },
    { src: "/images/hero/hero-3.jpg", alt: "Čerstvé ručně vázané kytice připravené k odnesení", caption: "Čerstvé, ručně vázané" },
    { src: "/images/hero/hero-4.jpg", alt: "Výloha květinářství Květiny nad museem z ulice", caption: "Krok nad Národním muzeem" },
    { src: "/images/hero/hero-5.jpg", alt: "Interiér krámku plný čerstvých květin ve vědrech", caption: "Rodinný krámek na Vinohradech" },
  ],
};

export const BRAND_STRIP = {
  eyebrow: "Co u nás najdete",
  body: "Jsme rodinné květinářství na Vinohradech, kousek od Václavského náměstí. Kytice, vazby na míru, dárky, sušené dekorace i vázy — od jedné růže za 200 Kč po výzdobu celé oslavy. Vázáno ručně, tak aby to vydrželo.",
};

export const WALLPAPER = {
  eyebrow: "Rodinné květinářství",
  title: "Kytice od rodiny, ne od pásu.",
  body: "Květiny vybíráme každý den u prověřených velkoobchodů — abyste si mohli vybrat i mimo sezónu. Poradíme vám napříč rozpočtem: od drobné kytice do ruky za 200 Kč po velkou vazbu na míru.",
  cta: { label: "Prohlédnout kytice", href: "#kytice" },
};

export type SeasonKey = "spring" | "summer" | "autumn" | "winter";

export const SEASONS: {
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

export const SIGNATURE = {
  eyebrow: "Od drobné pozornosti po velkou vazbu",
  title: "Kytice pro každou příležitost",
  body: "Od malé kytice do ruky po velkou vazbu na míru. Řekněte příležitost a rozpočet — zbytek je na nás. Vážeme ručně, často na počkání.",
  cards: [
    {
      title: "Pro radost",
      subtitle: "Malá kytice · drobná pozornost",
      body: "Malá ručně vázaná kytice nebo pár jednotlivých květin do ruky. Jen tak pro radost, na cestu domů nebo k narozeninám.",
      priceFrom: "200 Kč",
      accent: "var(--shell-deep)" as const,
    },
    {
      title: "Kytice na míru",
      subtitle: "Podle barvy, velikosti a rozpočtu",
      body: "Kytici uvážeme přesně podle vás — barva, velikost i cena. Na počkání během chvíle, nebo s předstihem na velkou příležitost.",
      priceFrom: "590 Kč",
      accent: "var(--terracotta)" as const,
    },
    {
      title: "Svatby & smuteční vazby",
      subtitle: "Floristika na míru",
      body: "Svatební kytice a výzdoba i smuteční vazby a věnce. Konzultace, návrh a realizace — diskrétně a s předstihem.",
      priceFrom: "Dle domluvy",
      accent: "var(--sage-pale)" as const,
    },
  ],
};

export const PROSTOR = {
  eyebrow: "Prostor",
  title: "Krok nad muzeem.",
  body: "Plno čerstvých kytic ve vědrech a vůně, kterou cítíte už ode dveří. Stavte se — nebo si jen vezměte jednu růži cestou domů.",
  images: [
    {
      src: "/images/shop-1.jpg",
      alt: "Výloha květinářství Květiny nad museem z ulice s lavicí kytic",
    },
    {
      src: "/images/shop-2.jpg",
      alt: "Interiér krámku s čerstvými květinami ve vědrech",
    },
    {
      src: "/images/shop-3.jpg",
      alt: "Pracovní stůl s kyticemi před květinovou tapetou",
    },
  ],
};

export const ABOUT = {
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
};

export const GALLERY = {
  eyebrow: "Z naší dílny",
  title: "Co u nás vznikne",
  body: "Pár kousků z posledních týdnů — kytice, vazby a chvíle z krámku. Každou vážeme u nás, ručně.",
  hint: "Táhněte do strany",
  // Sloty pro carousel. Až přijdou fotky, doplní se reálné src.
  // `tone` = barva placeholderu, než dorazí fotka.
  slides: [
    { src: "/images/gallery/g-1.jpg", alt: "Bohatá vazba v růžových a fialových tónech", caption: "Bohatá vazba", tone: "var(--shell-deep)" },
    { src: "/images/gallery/g-2.jpg", alt: "Sušené trávy a pivoňky ve vázách u okna", caption: "Sušené trávy", tone: "var(--mustard)" },
    { src: "/images/gallery/g-3.jpg", alt: "Vysoká slavnostní vazba na stole", caption: "Vysoká vazba", tone: "var(--dusk-blue)" },
    { src: "/images/gallery/g-4.jpg", alt: "Stěna z čerstvých květin a věnců", caption: "Květinová stěna", tone: "var(--moss)" },
    { src: "/images/gallery/g-5.jpg", alt: "Vazba v růžových tónech", caption: "Růžové ladění", tone: "var(--shell-warm)" },
    { src: "/images/gallery/g-6.jpg", alt: "Keramické vázy v krámku", caption: "Vázy a keramika", tone: "var(--stone)" },
    { src: "/images/gallery/g-7.jpg", alt: "Květinový věnec na dveřích", caption: "Věnce na přání", tone: "var(--gilt)" },
    { src: "/images/gallery/g-8.jpg", alt: "Čerstvé kytice připravené ve vědrech", caption: "Čerstvé kytice", tone: "var(--terracotta)" },
  ],
};

export const REVIEWS = {
  eyebrow: "Recenze",
  title: "Co říkají zákazníci",
  body: "Pár ohlasů od lidí, kteří u nás nakoupili. Děkujeme za každou kytici i milá slova.",
  // Odkaz na Google profil — po ověření doplň přesnou URL z Map Google
  // (Vyhledat podnik → Sdílet → zkopírovat odkaz).
  googleUrl:
    "https://www.google.com/maps/search/?api=1&query=Kv%C4%9Btiny%20nad%20museem%20Vinohradsk%C3%A1%206%20Praha",
  googleLabel: "Recenze na Googlu",
  // ⚠️ UKÁZKOVÉ RECENZE — nahradit skutečnými z Google profilu.
  // Každá: author (jméno), rating (1–5), text, date (text). Sociální důkaz
  // funguje jen když je pravdivý — nepublikovat smyšlené ohlasy jako reálné.
  items: [
    {
      author: "Markéta H.",
      rating: 5,
      text: "Krásné kytice a moc milý přístup. Vázali mi kytici na počkání přesně podle představ. Určitě se vrátím.",
      date: "před 2 týdny",
    },
    {
      author: "Jan Novák",
      rating: 5,
      text: "Konečně květinářství kousek od práce u muzea, kde poradí a nevnucují. Kytice vydržela krásně přes týden.",
      date: "před měsícem",
    },
    {
      author: "Petra S.",
      rating: 5,
      text: "Objednávala jsem svatební kytici a byla nádherná. Skvělá komunikace a cit pro detail. Vřele doporučuji.",
      date: "před měsícem",
    },
  ] as { author: string; rating: number; text: string; date: string }[],
};

export const VISIT = {
  eyebrow: "Kontakt",
  title: "Najdete nás",
};

export const FOOTER = {
  blurb:
    "Rodinné květinářství na Vinohradech, krok nad Národním muzeem a kousek od Václavského náměstí. Kytice už od 200 Kč, vazby na míru, vázy a dárky — s donáškou po Praze.",
  columns: [
    {
      heading: "Prodej",
      links: [
        { label: "Kytice", href: "#kytice" },
        { label: "Na míru", href: "#na-miru" },
        { label: "Dárky a vázy", href: "#kytice" },
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
};

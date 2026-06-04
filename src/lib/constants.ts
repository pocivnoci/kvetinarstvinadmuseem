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
  title: "Květiny nad museem — Rodinné květinářství v Praze",
  description:
    "Rodinné květinářství krok nad Národním muzeem. Kytice, vazby na míru, vázy a dárky — vázané ručně. Doručení po Praze.",
  url: "https://kvetinynadmuseem.cz",
  ogImage: "/images/og.jpg",
};

export const HERO = {
  eyebrow: "Rodinné květinářství · Praha",
  title: "Květiny nad museem.",
  lede: "Rodinné květinářství krok nad Národním muzeem. Kytice na všední den i na velké chvíle, vazby na míru a dárky — vázané ručně a s citem.",
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
    { src: "/images/hero/hero-3.jpg", alt: "Stojan plný připravených kytic k odnesení", caption: "Z chladící vitríny rovnou s sebou" },
    { src: "/images/hero/hero-4.jpg", alt: "Výloha květinářství Květiny nad museem z ulice", caption: "Krok nad Národním muzeem" },
    { src: "/images/hero/hero-5.jpg", alt: "Interiér krámku plný čerstvých květin ve vědrech", caption: "Rodinný krámek na Vinohradech" },
  ],
};

export const BRAND_STRIP = {
  eyebrow: "Co u nás najdete",
  body: "Jsme rodinné květinářství. Kytice, vazby na míru, dárky, sušené dekorace i vázy — od jedné růže po výzdobu celé oslavy. Vázáno ručně, tak aby to vydrželo.",
};

export const WALLPAPER = {
  eyebrow: "Rodinné květinářství",
  title: "Kytice od rodiny, ne od pásu.",
  body: "Květiny vybíráme každý den u prověřených velkoobchodů — abyste si mohli vybrat i mimo sezónu. Kvalitní kytice má svou cenu a my si za ní stojíme.",
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
    eyebrow: "01 · Z vitríny",
    title: "Kytice",
    body: "Hotové kytice z chladící vitríny — rovnou s sebou. Vázané ručně, čerstvé celý den. Pro chvíle, kdy spěcháte, ale chcete, aby se to poznalo.",
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
  eyebrow: "Tři rukopisy",
  title: "Jak vážeme",
  body: "Tři přístupy, podle nálady a příležitosti. Žádný z nich není správnější než druhý — záleží, komu kytice patří.",
  cards: [
    {
      title: "Klasická",
      subtitle: "Pivoňky · Růže · Eustoma",
      body: "Vyvážená, kulatá, čitelná na první pohled. Pro lidi, kterým slušelo všechno už v babičce.",
      priceFrom: "890 Kč",
      accent: "var(--shell-deep)" as const,
    },
    {
      title: "Bohatá",
      subtitle: "Jiřinky · Hortenzie · Trávy",
      body: "Více objemu, více textury, více ticha mezi květy. Vazba, která zaplní celý stůl.",
      priceFrom: "1 290 Kč",
      accent: "var(--terracotta)" as const,
    },
    {
      title: "Jemná",
      subtitle: "Bílé růže · Sasanky · Listy",
      body: "Tichá. Bílá s nádechem zeleně. Pro chvíle, kdy slova překážejí.",
      priceFrom: "990 Kč",
      accent: "var(--sage-pale)" as const,
    },
  ],
};

export const PROSTOR = {
  eyebrow: "Prostor",
  title: "Krok nad muzeem.",
  body: "Plná vitrína, čerstvé kytice ve vědrech a vůně, kterou cítíte už ode dveří. Stavte se — nebo si jen vezměte jednu růži cestou domů.",
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
    "Tak vznikly Květiny nad museem — malé rodinné květinářství krok nad Národním muzeem. Dělám ho po svém. A je to konečně ono.",
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
    { src: "/images/gallery/g-8.jpg", alt: "Čerstvé kytice připravené ve vědrech", caption: "Z vitríny", tone: "var(--terracotta)" },
  ],
};

export const VISIT = {
  eyebrow: "Kontakt",
  title: "Najdete nás",
};

export const FOOTER = {
  blurb:
    "Rodinné květinářství krok nad Národním muzeem. Kytice, vazby na míru, vázy a dárky — a doručení po Praze.",
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

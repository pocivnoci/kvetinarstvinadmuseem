import { CONTACT, SEO, SHOP } from "./constants";

/**
 * Strukturovaná data (schema.org) — primárně pro vyhledávače a AI engines
 * (ChatGPT, Perplexity, Google AI Overviews, Claude…), které z nich čerpají
 * ověřitelná fakta o podniku. Vše vychází z CONTACT/SEO, ať to nedrží na dvou
 * místech.
 *
 * Pozn.: geo souřadnice jsou přibližné (Vinohradská 6, u Národního muzea).
 * Pro přesnost je lze doladit podle Google Business profilu.
 */
const GEO = { latitude: 50.0786, longitude: 14.4324 };

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Kde Květiny nad museem najdu?",
    a: "Na adrese Vinohradská 6, Praha 2 — Vinohrady, pár kroků od Národního muzea a stanice metra Muzeum (linky A a C).",
  },
  {
    q: "Jaká je otevírací doba?",
    a: "Otevřeno máme pondělí až sobotu od 9:00 do 18:00. V neděli je zavřeno.",
  },
  {
    q: "Doručujete květiny po Praze?",
    a: "Ano, kytice i vazby doručujeme po celé Praze. Doručení je nejlepší domluvit telefonicky na +420 770 401 834.",
  },
  {
    q: "Děláte svatby, smuteční vazby a firemní akce?",
    a: "Ano. Vážeme svatební floristiku, smuteční vazby i výzdobu pro otevření a firemní akce — vše na míru a po domluvě, ideálně s předstihem.",
  },
  {
    q: "Vážete kytice na míru?",
    a: "Ano. Kytici uvážeme podle barvy, příležitosti i rozpočtu — často během chvíle přímo v krámku.",
  },
  {
    q: "Máte květiny jen v sezóně?",
    a: "Ne. Díky odběru u prověřených velkoobchodů nabízíme širokou nabídku po celý rok — najdete u nás pivoňky i mimo jejich krátkou sezónu a růže po celý rok.",
  },
];

const SERVICES = [
  "Kytice na všední den i slavnostní příležitosti",
  "Vazby na míru",
  "Svatební floristika",
  "Smuteční vazby",
  "Výzdoba firemních akcí a otevření",
  "Dárky, vázy a sušené dekorace",
  "Doručení po Praze",
];

export function buildJsonLd() {
  const florist = {
    "@type": "Florist",
    "@id": `${SEO.url}/#florist`,
    name: SHOP.name,
    description: SEO.description,
    url: SEO.url,
    image: `${SEO.url}${SEO.ogImage}`,
    logo: `${SEO.url}/logo.svg`,
    telephone: CONTACT.phone.replace(/\s/g, ""),
    email: CONTACT.email,
    priceRange: "$$",
    currenciesAccepted: "CZK",
    paymentAccepted: "Hotovost, platební karta",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Vinohradská 6",
      addressLocality: "Praha",
      addressRegion: "Praha",
      postalCode: "120 00",
      addressCountry: "CZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: GEO.latitude,
      longitude: GEO.longitude,
    },
    hasMap: "https://maps.google.com/?q=Květiny+nad+museem+Vinohradská+6+Praha",
    areaServed: { "@type": "City", name: "Praha" },
    knowsLanguage: ["cs", "en"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [CONTACT.instagramUrl],
    makesOffer: SERVICES.map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
    slogan: SHOP.tagline,
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${SEO.url}/#faq`,
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SEO.url}/#website`,
    url: SEO.url,
    name: SHOP.name,
    inLanguage: "cs-CZ",
    publisher: { "@id": `${SEO.url}/#florist` },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [florist, website, faqPage],
  };
}

import { SITE } from "./site";
import type { Dictionary } from "./i18n/cs";

/**
 * Strukturovaná data (schema.org) — primárně pro vyhledávače a AI engines
 * (ChatGPT, Perplexity, Google AI Overviews, Claude…). Lokalizovaná podle
 * jazyka stránky; fakta (adresa, telefon, GPS) drží v SITE.
 */
export function buildJsonLd(t: Dictionary, locale: string) {
  const isCs = locale !== "en";

  const florist = {
    "@type": "Florist",
    "@id": `${SITE.url}/#florist`,
    name: t.SHOP.name,
    description: t.SEO.description,
    url: SITE.url,
    image: `${SITE.url}${SITE.ogImage}`,
    logo: `${SITE.url}/logo.svg`,
    telephone: SITE.phone.replace(/\s/g, ""),
    email: SITE.email,
    priceRange: "$$",
    currenciesAccepted: "CZK",
    paymentAccepted: isCs ? "Hotovost, platební karta" : "Cash, credit card",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Vinohradská 6",
      addressLocality: isCs ? "Praha" : "Prague",
      addressRegion: isCs ? "Praha" : "Prague",
      postalCode: "120 00",
      addressCountry: "CZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    hasMap: "https://maps.google.com/?q=Květiny+nad+museem+Vinohradská+6+Praha",
    areaServed: [
      { "@type": "City", name: isCs ? "Praha" : "Prague" },
      { "@type": "Place", name: isCs ? "Praha 2 — Vinohrady" : "Prague 2 — Vinohrady" },
      { "@type": "Place", name: isCs ? "Václavské náměstí, Praha" : "Wenceslas Square, Prague" },
      { "@type": "Place", name: isCs ? "Nové Město, Praha" : "Nové Město, Prague" },
      { "@type": "Place", name: isCs ? "Národní muzeum, Praha" : "National Museum, Prague" },
    ],
    knowsAbout: t.SERVICES,
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
        ],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    sameAs: [SITE.instagramUrl],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: isCs ? "Ručně vázaná kytice" : "Hand-tied bouquet",
          description: isCs
            ? "Ručně vázané kytice od drobné pozornosti po velkou vazbu na míru."
            : "Hand-tied bouquets from a small token to a large custom arrangement.",
        },
        priceCurrency: "CZK",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: 200,
          priceCurrency: "CZK",
        },
        availability: "https://schema.org/InStock",
      },
      ...t.SERVICES.map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    ],
    slogan: t.SHOP.tagline,
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${SITE.url}/#faq`,
    inLanguage: isCs ? "cs-CZ" : "en",
    mainEntity: t.FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: t.SHOP.name,
    inLanguage: isCs ? "cs-CZ" : "en",
    publisher: { "@id": `${SITE.url}/#florist` },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [florist, website, faqPage],
  };
}

import { SITE } from "@/lib/site";

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  ODKAZY — jediný soubor, který se edituje pro stránku /odkazy
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  Přidat odkaz   → přidej řádek do ODKAZY a dej mu `order`
 *  Vypnout odkaz  → `enabled: false` (zůstane v souboru, jen se nezobrazí)
 *  Přeskládat     → změň číslo v `order` (řadí se vzestupně)
 *
 *  Do komponenty ani do stránky se kvůli tomu nesahá.
 *
 *  Pozn.: kontaktní kanály (telefon, e-mail, IG, mapa) berou adresu ze
 *  `src/lib/site.ts`, aby telefon nežil na dvou místech. Když se mění
 *  číslo, mění se tam — ne tady.
 */

/** Ikony, které umí <OdkazIkona>. Nová ikona = nový case v Odkazy.tsx. */
export type OdkazIcon =
  | "wolt"
  | "phone"
  | "whatsapp"
  | "mail"
  | "instagram"
  | "map"
  | "star";

export type Odkaz = {
  /** Stabilní identifikátor. Jde do utm_campaign a do názvu pixel eventu — neměnit zpětně. */
  id: string;
  /** Text v tlačítku. */
  label: string;
  /** Druhý řádek pod labelem. Nepovinný. */
  sublabel?: string;
  href: string;
  icon: OdkazIcon;
  /** false = řádek zůstane v souboru, ale na stránce se nevykreslí. */
  enabled: boolean;
  /** Pořadí odshora, vzestupně. */
  order: number;
  /** "primary" = zvýrazněná zelená karta. Použij max na jednu položku. */
  variant?: "primary";
  /**
   * false = nepřipojovat UTM parametry k adrese.
   * Pro krátké redirect adresy (g.page), kde cizí query parametry nedávají
   * smysl a v nejhorším by mohly rozbít cílový redirect. Klik se pořád měří
   * přes pixel, jen se neznačkuje URL.
   */
  utm?: boolean;
};

export const ODKAZY: Odkaz[] = [
  {
    id: "wolt",
    label: "Objednat na Woltu",
    sublabel: "Kytice k vám domů, i dnes",
    href: "https://wolt.com/cs/cze/prague/venue/kvetiny-nad-museem",
    icon: "wolt",
    enabled: true,
    order: 1,
    variant: "primary",
  },
  {
    id: "telefon",
    label: "Zavolat",
    sublabel: `${SITE.phone} · Po–Pá 8–18`,
    href: SITE.phoneHref,
    icon: "phone",
    enabled: true,
    order: 2,
  },
  {
    id: "whatsapp",
    label: "Napsat na WhatsApp",
    sublabel: "Poradíme s výběrem, pošleme fotku",
    href: `https://wa.me/${SITE.whatsappNumber}`,
    icon: "whatsapp",
    enabled: true,
    order: 3,
  },
  {
    id: "email",
    label: "Napsat e-mail",
    sublabel: SITE.email,
    href: SITE.emailHref,
    icon: "mail",
    enabled: true,
    order: 4,
  },
  {
    id: "instagram",
    label: "Instagram",
    sublabel: SITE.instagram,
    href: SITE.instagramUrl,
    icon: "instagram",
    enabled: true,
    order: 5,
  },
  {
    id: "mapa",
    label: "Navigovat k nám",
    sublabel: "Vinohradská 6 · metro Muzeum",
    href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      SITE.mapsQuery
    )}`,
    icon: "map",
    enabled: true,
    order: 6,
  },
  {
    id: "recenze",
    label: "Ohodnotit nás na Googlu",
    sublabel: "Zabere to minutu a moc nám pomůže",
    href: "https://g.page/r/CcpyYfBq7i3nEBM/review",
    icon: "star",
    enabled: true,
    order: 7,
    utm: false,
  },
];

/** Texty kolem odkazů — hlavička, otevírací doba, patička. */
export const ODKAZY_PAGE = {
  name: "Květiny nad museem",
  tagline: "Rodinné květinářství na Vinohradské 6, krok nad Národním muzeem.",

  hours: {
    heading: "Otevírací doba",
    rows: [
      { days: "Pondělí – pátek", time: "8:00 – 18:00" },
      { days: "Sobota a neděle", time: "zavřeno" },
    ],
  },

  address: "Vinohradská 6 · 120 00 Praha 2 — Vinohrady",
  footer: "Květiny nad museem",
  footerLinkLabel: "kvetinynadmuseem.cz",
  footerLinkHref: "/",

  seo: {
    title: "Květiny nad museem — všechny odkazy na jednom místě",
    description:
      "Objednávka na Woltu, telefon, WhatsApp, Instagram a navigace do květinářství Květiny nad museem, Vinohradská 6, Praha 2.",
  },
} as const;

/** Položky k vykreslení: jen zapnuté, seřazené podle `order`. */
export function aktivniOdkazy(): Odkaz[] {
  return ODKAZY.filter((o) => o.enabled).sort((a, b) => a.order - b.order);
}

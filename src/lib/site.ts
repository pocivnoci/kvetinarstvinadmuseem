/**
 * Sdílená fakta o podniku, která jsou stejná napříč jazyky.
 * Slovníky (cs/en) z nich čerpají, ať telefon/e-mail/URL nedrží na dvou místech.
 */
export const SITE = {
  url: "https://kvetinynadmuseem.cz",
  ogImage: "/images/og.jpg",

  phone: "+420 770 401 834",
  phoneHref: "tel:+420770401834",
  email: "info@kvetinynadmuseem.cz",
  emailHref: "mailto:info@kvetinynadmuseem.cz",

  instagram: "@kvetinynadmuseem",
  instagramUrl: "https://instagram.com/kvetinynadmuseem",

  whatsappNumber: "420770401834",

  geo: { latitude: 50.0786, longitude: 14.4324 },
} as const;

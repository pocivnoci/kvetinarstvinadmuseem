import { SITE } from "../site";
import type { Dictionary, SeasonKey } from "./cs";

const SEASONS: {
  key: SeasonKey;
  eyebrow: string;
  title: string;
  body: string;
}[] = [
  {
    key: "spring",
    eyebrow: "01 · Ready to go",
    title: "Bouquets",
    body: "Fresh bouquets tied by hand every day — ready to take with you, or made while you wait. From a small bouquet for 200 CZK to a large arrangement. For moments when you're in a hurry but want it to show.",
  },
  {
    key: "summer",
    eyebrow: "02 · Your way",
    title: "Custom",
    body: "Tell us the colour, the occasion and the budget. We'll handle the rest. A custom arrangement in thirty minutes — or ahead of time when you want to mull over the details.",
  },
  {
    key: "autumn",
    eyebrow: "03 · Big moments",
    title: "Occasions",
    body: "Weddings, funeral arrangements, gallery and restaurant openings. Consultation, design, delivery. Discreetly. On time. No last-minute improvising.",
  },
  {
    key: "winter",
    eyebrow: "04 · Little joys",
    title: "Gifts",
    body: "Vases, ceramics, dried arrangements, candles and seasonal décor. Things that outlast a bouquet, built on the same taste.",
  },
];

export const en: Dictionary = {
  locale: "en",
  htmlLang: "en",

  SHOP: {
    name: "Květiny nad museem",
    shortName: "Květiny",
    tagline: "A family flower shop a step above the National Museum.",
  },

  CONTACT: {
    address: "Vinohradská 6",
    city: "Prague 2 — Vinohrady",
    postal: "120 00",
    nearestStop: "Muzeum (metro A, C) · 2 min",
    phone: SITE.phone,
    phoneHref: SITE.phoneHref,
    email: SITE.email,
    emailHref: SITE.emailHref,
    instagram: SITE.instagram,
    instagramUrl: SITE.instagramUrl,
    hours: {
      weekdays: "Mon–Fri  9:00 – 18:00",
      saturday: "Sat       9:00 – 18:00",
      sunday: "Sun      closed",
    },
  },

  NAV_LINKS: [
    { href: "#kytice", label: "Bouquets" },
    { href: "#na-miru", label: "Custom" },
    { href: "#prilezitosti", label: "Occasions" },
    { href: "#o-nas", label: "About" },
    { href: "#kontakt", label: "Contact" },
  ],

  SEO: {
    title: "Květiny nad museem — Flower Shop in Prague, Vinohrady",
    description:
      "Family-run flower shop in Prague's Vinohrady, by the National Museum and Wenceslas Square. Bouquets from 200 CZK, custom arrangements, wedding & funeral flowers, delivery across Prague.",
    url: SITE.url,
    ogImage: SITE.ogImage,
    ogLocale: "en_US",
    keywords: [
      "flower shop Prague",
      "florist Prague",
      "florist Vinohrady",
      "flower shop Prague 2",
      "flowers near National Museum Prague",
      "flower shop Wenceslas Square",
      "florist near Wenceslas Square",
      "bouquet Prague",
      "bouquet from 200 CZK",
      "cheap flowers Prague",
      "flower delivery Prague",
      "send flowers Prague",
      "custom bouquet Prague",
      "wedding flowers Prague",
      "wedding florist Prague",
      "funeral flowers Prague",
      "funeral wreath Prague",
      "roses Prague",
      "Květiny nad museem",
    ],
  },

  HERO: {
    eyebrow: "Family flower shop · Prague — Vinohrady",
    title: "Květiny nad museem.",
    lede: "A family flower shop a step above the National Museum, minutes from Wenceslas Square. Bouquets from 200 CZK, custom arrangements, and wedding & funeral flowers — tied by hand, with care. Delivery across Prague.",
    ctaPrimary: { label: "Order flowers", href: "#kytice" },
    ctaGhost: { label: "Find us", href: "#kontakt" },
    video: {
      mp4: "/images/hero/hero-video.mp4",
      poster: "/images/hero/hero-poster.jpg",
      label: "Live from the studio",
    },
    slides: [
      { src: "/images/hero/hero-1.jpg", alt: "A bench full of fresh wrapped bouquets in the shop", caption: "Fresh bouquets every day" },
      { src: "/images/hero/hero-2.jpg", alt: "A lush arrangement of purple and pink flowers, close up", caption: "Tied by hand, with care" },
      { src: "/images/hero/hero-3.jpg", alt: "Fresh hand-tied bouquets ready to take away", caption: "Fresh, hand-tied" },
      { src: "/images/hero/hero-4.jpg", alt: "The Květiny nad museem shopfront from the street", caption: "A step above the National Museum" },
      { src: "/images/hero/hero-5.jpg", alt: "The shop interior full of fresh flowers in buckets", caption: "A family shop in Vinohrady" },
    ],
  },

  BRAND_STRIP: {
    eyebrow: "What you'll find",
    body: "We're a family-run flower shop in Vinohrady, just off Wenceslas Square. Bouquets, custom arrangements, gifts, dried décor and vases — from a single rose for 200 CZK to flowers for a whole celebration. Tied by hand, made to last.",
  },

  WALLPAPER: {
    eyebrow: "Family flower shop",
    title: "Flowers from a family, not a factory line.",
    body: "We hand-pick flowers every day from trusted wholesalers — so you can choose even out of season. We'll help across any budget: from a small bouquet in hand for 200 CZK to a large custom arrangement.",
    cta: { label: "See the bouquets", href: "#kytice" },
  },

  SEASONS,

  SIGNATURE: {
    eyebrow: "From a small token to a grand arrangement",
    title: "Flowers for every occasion",
    body: "From a small bouquet in hand to a large custom arrangement. Tell us the occasion and the budget — we'll take care of the rest. Tied by hand, often while you wait.",
    cards: [
      {
        title: "For joy",
        subtitle: "Small bouquet · little token",
        body: "A small hand-tied bouquet or a few single stems to carry. Just for joy, on the way home, or for a birthday.",
        priceFrom: "200 CZK",
        accent: "var(--shell-deep)",
      },
      {
        title: "Custom bouquet",
        subtitle: "By colour, size and budget",
        body: "We tie your bouquet exactly to you — colour, size and price. While you wait, or ahead of time for a big occasion.",
        priceFrom: "590 CZK",
        accent: "var(--terracotta)",
      },
      {
        title: "Weddings & funerals",
        subtitle: "Bespoke floristry",
        body: "Wedding bouquets and décor as well as funeral arrangements and wreaths. Consultation, design and delivery — discreetly and ahead of time.",
        priceFrom: "On request",
        accent: "var(--sage-pale)",
      },
    ],
  },

  PROSTOR: {
    eyebrow: "The space",
    title: "A step above the museum.",
    body: "Buckets full of fresh flowers and a scent you catch right at the door. Drop by — or just grab a single rose on your way home.",
    images: [
      { src: "/images/shop-1.jpg", alt: "The Květiny nad museem shopfront from the street with a bench of bouquets" },
      { src: "/images/shop-2.jpg", alt: "The shop interior with fresh flowers in buckets" },
      { src: "/images/shop-3.jpg", alt: "A workbench with bouquets in front of a floral tapestry" },
    ],
  },

  ABOUT: {
    eyebrow: "Our story",
    title: "I wanted to do it differently.",
    body: [
      "For years I tied bouquets in flower shops around Prague. I learned the craft and got to know countless flowers — but something never sat right. Bouquets were thrown together in a rush, chosen by price, and often it was mostly about getting them out the door quickly.",
      "I wanted to do it differently. To have my own little shop where you choose by what you love, not by the price tag. Where a bouquet is tied calmly and with care — and where I'd rather give you honest advice than sell you the cheapest thing.",
      "That's how Květiny nad museem came to be — a small family flower shop a step above the National Museum, just off Wenceslas Square. You'll find bouquets from 200 CZK as well as large custom arrangements. I do it my own way. And it finally feels right.",
    ],
    pullQuote:
      "For years I arranged flowers for someone else. This is the first shop I'm truly doing my own way.",
    pullQuoteBy: "— Adéla, founder",
    image: { src: "/images/about.jpg", alt: "A lush arrangement from the Květiny nad museem studio" },
  },

  GALLERY: {
    eyebrow: "From our studio",
    title: "What we make",
    body: "A few pieces from the past weeks — bouquets, arrangements and moments from the shop. Each one tied here, by hand.",
    hint: "Drag to the side",
    slides: [
      { src: "/images/gallery/g-1.jpg", alt: "A lush arrangement in pink and purple tones", caption: "Lush arrangement", tone: "var(--shell-deep)" },
      { src: "/images/gallery/g-2.jpg", alt: "Dried grasses and peonies in vases by the window", caption: "Dried grasses", tone: "var(--mustard)" },
      { src: "/images/gallery/g-3.jpg", alt: "A tall festive arrangement on a table", caption: "Tall arrangement", tone: "var(--dusk-blue)" },
      { src: "/images/gallery/g-4.jpg", alt: "A wall of fresh flowers and wreaths", caption: "Flower wall", tone: "var(--moss)" },
      { src: "/images/gallery/g-5.jpg", alt: "An arrangement in pink tones", caption: "In pink", tone: "var(--shell-warm)" },
      { src: "/images/gallery/g-6.jpg", alt: "Ceramic vases in the shop", caption: "Vases & ceramics", tone: "var(--stone)" },
      { src: "/images/gallery/g-7.jpg", alt: "A flower wreath on a door", caption: "Wreaths to order", tone: "var(--gilt)" },
      { src: "/images/gallery/g-8.jpg", alt: "Fresh bouquets ready in buckets", caption: "Fresh bouquets", tone: "var(--terracotta)" },
    ],
  },

  REVIEWS: {
    eyebrow: "Reviews",
    title: "What customers say",
    body: "A few words from people who've shopped with us. Thank you for every bouquet and every kind word.",
    googleUrl:
      "https://www.google.com/maps/search/?api=1&query=Kv%C4%9Btiny%20nad%20museem%20Vinohradsk%C3%A1%206%20Praha",
    googleLabel: "Reviews on Google",
    // Real reviews go here once available: { author, rating (1–5), text, date }.
    items: [],
  },

  VISIT: {
    eyebrow: "Contact",
    title: "Find us",
  },

  FOOTER: {
    blurb:
      "A family-run flower shop in Vinohrady, a step above the National Museum and just off Wenceslas Square. Bouquets from 200 CZK, custom arrangements, vases and gifts — with delivery across Prague.",
    columns: [
      {
        heading: "Shop",
        links: [
          { label: "Bouquets", href: "#kytice" },
          { label: "Custom", href: "#na-miru" },
          { label: "Gifts & vases", href: "#kytice" },
          { label: "Delivery in Prague", href: "#kontakt" },
        ],
      },
      {
        heading: "Occasions",
        links: [
          { label: "Weddings", href: "#prilezitosti" },
          { label: "Funeral flowers", href: "#prilezitosti" },
          { label: "Openings", href: "#prilezitosti" },
          { label: "Corporate events", href: "#prilezitosti" },
        ],
      },
    ],
    newsletter: {
      heading: "News from the shop",
      body: "A short note once a month. New bouquets, gift ideas and what's happening in the shop.",
      placeholder: "you@email.com",
      cta: "Subscribe",
    },
    legal: "© 2026 Květiny nad museem. Made with love in Prague.",
  },

  INFOBAR: [
    { label: "Open", value: "Mon–Sat 9–18", href: "" },
    { label: "Where", value: "Vinohradská 6 · metro Muzeum", href: "" },
    { label: "Nearby", value: "5 min from Wenceslas Sq.", href: "" },
    { label: "Delivery", value: "across Prague", href: "" },
    { label: "Phone", value: SITE.phone, href: SITE.phoneHref },
  ],

  UI: {
    orderShort: "Order",
    orderBouquet: "Order flowers",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    heroSection: "Intro — Květiny nad museem family flower shop",
    heroVideoAlt: "A glimpse from the studio — fresh flowers",
    slides: "Slides",
    priceFrom: "From",
    galleryPrev: "Previous",
    galleryNext: "Next",
    galleryOf: "of",
    galleryGoTo: "Go to",
    seasonsAria: "What you'll find — bouquets, custom, occasions, gifts",
    aboutAria: "About us",
    ratingPrefix: "Rating",
    ratingSuffix: "out of 5 stars",
    visitAria: "Contact and opening hours",
    visitWhere: "Where",
    visitOpen: "Open",
    visitWrite: "Get in touch",
    visitOpenNow: "Open now",
    visitConsult: "Book a consultation",
    footerEmailLabel: "Email",
    footerThanks: "Thank you ✓",
    whatsappAria: "Message us on WhatsApp",
    whatsappText: "Hello, I'd like to ask about a bouquet.",
    switchLang: "Čeština",
    switchLangAria: "Přepnout do češtiny",
  },

  FAQ: [
    { q: "Where can I find Květiny nad museem?", a: "At Vinohradská 6, Prague 2 — Vinohrady, a few steps from the National Museum and the Muzeum metro station (lines A and C)." },
    { q: "What are your opening hours?", a: "We're open Monday to Saturday from 9:00 to 18:00. Closed on Sundays." },
    { q: "Do you deliver flowers across Prague?", a: "Yes, we deliver bouquets and arrangements across Prague. Delivery is best arranged by phone at +420 770 401 834." },
    { q: "Do you do weddings, funeral flowers and corporate events?", a: "Yes. We create wedding floristry, funeral arrangements and décor for openings and corporate events — all bespoke and by arrangement, ideally booked ahead." },
    { q: "Do you tie custom bouquets?", a: "Yes. We'll tie a bouquet to your colour, occasion and budget — often within minutes, right in the shop." },
    { q: "Are your flowers only seasonal?", a: "No. Thanks to trusted wholesalers we offer a wide selection year-round — you'll find peonies even outside their short season, and roses all year." },
    { q: "Do you have more affordable bouquets, say from 200 CZK?", a: "Yes. We start with small hand-tied bouquets and single stems from 200 CZK — and we'll work with you across any budget up to large custom arrangements." },
    { q: "Are you near Wenceslas Square and the city centre?", a: "Yes. You'll find us at Vinohradská 6 in Vinohrady, a few minutes' walk from Wenceslas Square, the National Museum and the Muzeum metro station (lines A and C)." },
  ],

  SERVICES: [
    "Bouquets for everyday and special occasions",
    "Custom arrangements",
    "Wedding floristry",
    "Funeral arrangements",
    "Décor for corporate events and openings",
    "Gifts, vases and dried décor",
    "Delivery across Prague",
  ],
};

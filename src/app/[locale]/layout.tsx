import type { Metadata } from "next";
import { fontClassName } from "@/lib/fonts";
import { getDictionary, locales } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = getDictionary(params.locale);
  const isCs = params.locale !== "en";
  const path = isCs ? "/" : "/en";

  return {
    title: t.SEO.title,
    description: t.SEO.description,
    metadataBase: new URL(SITE.url),
    applicationName: t.SHOP.name,
    authors: [{ name: t.SHOP.name }],
    creator: t.SHOP.name,
    publisher: t.SHOP.name,
    category: isCs ? "Květinářství" : "Florist",
    keywords: t.SEO.keywords,
    alternates: {
      canonical: path,
      languages: {
        "cs-CZ": "/",
        en: "/en",
        "x-default": "/",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: t.SEO.ogLocale,
      alternateLocale: isCs ? "en_US" : "cs_CZ",
      url: path,
      title: t.SEO.title,
      description: t.SEO.description,
      siteName: t.SHOP.name,
      images: [{ url: t.SEO.ogImage, width: 1200, height: 630, alt: t.SEO.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.SEO.title,
      description: t.SEO.description,
      images: [t.SEO.ogImage],
    },
    formatDetection: { telephone: true, address: true, email: true },
    other: {
      "geo.region": "CZ-10",
      "geo.placename": isCs ? "Praha — Vinohrady" : "Prague — Vinohrady",
      "geo.position": "50.0786;14.4324",
      ICBM: "50.0786, 14.4324",
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const t = getDictionary(params.locale);
  return (
    <html
      lang={t.htmlLang}
      className={fontClassName}
    >
      <body>{children}</body>
    </html>
  );
}

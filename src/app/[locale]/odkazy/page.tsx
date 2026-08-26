import type { Metadata } from "next";
import { Odkazy } from "@/components/Odkazy";
import { ODKAZY_PAGE } from "@/data/odkazy";
import { parseSrc } from "@/lib/odkazy-utm";
import { SITE } from "@/lib/site";

/**
 * /odkazy — vlastní linkpage místo Linktree. Cíl QR kódů z vizitek
 * a samolepek a odkazu z Instagram bia.
 *
 * Vědomě `noindex, follow`: stránka nemá ve vyhledávání konkurovat homepage,
 * ale odkazy z ní se mají předávat dál. Ze sitemapy je proto vynechaná.
 *
 * Stránka čte `?src=`, takže se renderuje dynamicky — UTM parametry jsou
 * v HTML hotové ještě před spuštěním JavaScriptu.
 */

/**
 * Bez tohohle by Next stránku předrenderoval při buildu (layout má
 * generateStaticParams) — `?src=` by se do UTM nepropsalo a indikátor
 * otevřeno/zavřeno by zamrzl na čase buildu.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: ODKAZY_PAGE.seo.title,
  description: ODKAZY_PAGE.seo.description,
  alternates: { canonical: "/odkazy" },
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: "/odkazy",
    title: ODKAZY_PAGE.seo.title,
    description: ODKAZY_PAGE.seo.description,
    siteName: ODKAZY_PAGE.name,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: ODKAZY_PAGE.seo.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ODKAZY_PAGE.seo.title,
    description: ODKAZY_PAGE.seo.description,
    images: [SITE.ogImage],
  },
};

export default function OdkazyPage({
  searchParams,
}: {
  searchParams: { src?: string | string[] };
}) {
  return <Odkazy src={parseSrc(searchParams.src)} />;
}

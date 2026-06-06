import type { Metadata } from "next";
import { Fraunces, Source_Serif_4, Inter } from "next/font/google";
import { SEO } from "@/lib/constants";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  metadataBase: new URL(SEO.url),
  applicationName: "Květiny nad museem",
  authors: [{ name: "Květiny nad museem" }],
  creator: "Květiny nad museem",
  publisher: "Květiny nad museem",
  category: "Květinářství",
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
  alternates: { canonical: "/" },
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
    locale: "cs_CZ",
    url: SEO.url,
    title: SEO.title,
    description: SEO.description,
    siteName: "Květiny nad museem",
    images: [{ url: SEO.ogImage, width: 1200, height: 630, alt: SEO.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
    images: [SEO.ogImage],
  },
  formatDetection: { telephone: true, address: true, email: true },
  other: {
    "geo.region": "CZ-10",
    "geo.placename": "Praha — Vinohrady",
    "geo.position": "50.0786;14.4324",
    ICBM: "50.0786, 14.4324",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="cs"
      className={`${fraunces.variable} ${sourceSerif.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

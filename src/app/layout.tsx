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
    "rodinné květinářství",
    "květiny Vinohrady",
    "kytice Praha",
    "rozvoz květin Praha",
    "doručení květin Praha",
    "vazby na míru",
    "svatební floristika Praha",
    "smuteční vazby Praha",
    "květiny u Národního muzea",
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

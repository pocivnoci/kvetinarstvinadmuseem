import { Fraunces, Source_Serif_4, Inter } from "next/font/google";

/**
 * Písma sdílená veřejným webem i adminem — načítají se jednou tady,
 * ať obě části používají stejné CSS proměnné (--font-display/body/ui).
 */
export const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

export const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-ui",
  display: "swap",
});

export const fontClassName = `${fraunces.variable} ${sourceSerif.variable} ${inter.variable}`;

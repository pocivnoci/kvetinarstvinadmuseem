import { cs, type Dictionary } from "./cs";
import { en } from "./en";

export const locales = ["cs", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "cs";

const DICTS: Record<Locale, Dictionary> = { cs, en };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDictionary(locale: string): Dictionary {
  return isLocale(locale) ? DICTS[locale] : DICTS[defaultLocale];
}

/** Cesta na druhý jazyk pro přepínač (web má jen jednu stránku). */
export function altLocalePath(locale: Locale): string {
  return locale === "cs" ? "/en" : "/";
}

export type { Dictionary };

import type { Odkaz } from "@/data/odkazy";

/**
 * Odkud návštěvník přišel. Hodnota se čte z query parametru `?src=`
 * na /odkazy — QR na vizitce nese ?src=vizitka, samolepka ?src=samolepka atd.
 * Díky tomu jde v Meta Ads i v UTM rozlišit, který nosič lidi přivedl.
 */
export const SRC_VALUES = ["vizitka", "samolepka", "ig", "wolt"] as const;
export type OdkazSrc = (typeof SRC_VALUES)[number];

/** Neznámou nebo chybějící hodnotu zahazujeme — do UTM se dostane jen whitelist. */
export function parseSrc(
  value: string | string[] | undefined
): OdkazSrc | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const normalized = raw.toLowerCase().trim();
  return (SRC_VALUES as readonly string[]).includes(normalized)
    ? (normalized as OdkazSrc)
    : null;
}

export const UTM_SOURCE = "odkazy";
export const UTM_MEDIUM = "linkpage";

/**
 * Doplní UTM parametry podle id položky.
 *
 *   utm_source=odkazy · utm_medium=linkpage · utm_campaign=<id>
 *   utm_content=<src>  … jen když stránka dostala známé ?src=
 *
 * Netýká se `tel:` a `mailto:` (query parametry tam nedávají smysl) ani
 * položek s `utm: false`. Parametry, které si autor v `href` nastavil ručně,
 * se nepřepisují.
 */
export function withUtm(odkaz: Odkaz, src: OdkazSrc | null): string {
  if (odkaz.utm === false) return odkaz.href;
  if (!/^https?:\/\//i.test(odkaz.href)) return odkaz.href;

  let url: URL;
  try {
    url = new URL(odkaz.href);
  } catch {
    return odkaz.href;
  }

  const params: Record<string, string> = {
    utm_source: UTM_SOURCE,
    utm_medium: UTM_MEDIUM,
    utm_campaign: odkaz.id,
  };
  if (src) params.utm_content = src;

  for (const [key, value] of Object.entries(params)) {
    if (!url.searchParams.has(key)) url.searchParams.set(key, value);
  }

  return url.toString();
}

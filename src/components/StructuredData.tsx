import { buildJsonLd } from "@/lib/seo";
import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * JSON-LD strukturovaná data v <head> stránky. Server-rendered, takže je
 * crawleři i AI engines vidí rovnou ve zdroji bez nutnosti spouštět JS.
 */
export function StructuredData({
  t,
  locale,
}: {
  t: Dictionary;
  locale: Locale;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(t, locale)) }}
    />
  );
}

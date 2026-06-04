import { buildJsonLd } from "@/lib/seo";

/**
 * JSON-LD strukturovaná data v <head> stránky. Server-rendered, takže je
 * crawleři i AI engines vidí rovnou ve zdroji bez nutnosti spouštět JS.
 */
export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
    />
  );
}

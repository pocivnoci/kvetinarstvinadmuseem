import { NextResponse, type NextRequest } from "next/server";

const locales = ["cs", "en"];

/**
 * Jazykové routování s „as-needed" prefixem:
 *   /        → čeština (interní rewrite na /cs, URL zůstává /)
 *   /en      → angličtina
 *   /cs      → 308 redirect na / (kanonická adresa češtiny je bez prefixu)
 *
 * Statické soubory (robots.txt, sitemap.xml, llms.txt, icon.svg, obrázky)
 * i /_next jsou z matcheru vyloučené, takže se servírují přímo.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLocalePath = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );

  if (isLocalePath) {
    // Kanonizace výchozího jazyka: /cs(/...) → /(...)
    if (pathname === "/cs" || pathname.startsWith("/cs/")) {
      const url = req.nextUrl.clone();
      url.pathname = pathname.replace(/^\/cs/, "") || "/";
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
  }

  // Výchozí jazyk (čeština) servírovaný z kořene → interní rewrite na /cs
  const url = req.nextUrl.clone();
  url.pathname = `/cs${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Vynech _next a cokoli s tečkou (soubory: .txt, .xml, .svg, .jpg, …)
  matcher: ["/((?!_next|.*\\..*).*)"],
};

import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, adminPassword, isValidSession } from "@/lib/admin/auth";

const locales = ["cs", "en"];

/**
 * 1) /admin a /api jdou mimo jazykové routování. /admin je navíc chráněný
 *    heslem (cookie ověřená proti ADMIN_PASSWORD, viz src/lib/admin/auth.ts).
 *
 * 2) Jazykové routování s „as-needed" prefixem:
 *   /        → čeština (interní rewrite na /cs, URL zůstává /)
 *   /en      → angličtina
 *   /cs      → 308 redirect na / (kanonická adresa češtiny je bez prefixu)
 *
 * Statické soubory (robots.txt, sitemap.xml, llms.txt, icon.svg, obrázky)
 * i /_next jsou z matcheru vyloučené, takže se servírují přímo.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/api" || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return adminGuard(req);
  }

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

async function adminGuard(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  // Bez nastaveného hesla pustíme admin jen při lokálním vývoji.
  const devBypass =
    !adminPassword() && process.env.NODE_ENV === "development";

  const authed =
    devBypass || (await isValidSession(req.cookies.get(ADMIN_COOKIE)?.value));

  if (isLoginPage) {
    if (authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return withNoIndex(NextResponse.next());
  }

  if (!authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  return withNoIndex(NextResponse.next());
}

/** Admin do vyhledávačů nepatří — pojistka i nad robots.txt. */
function withNoIndex(res: NextResponse) {
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  // Vynech _next a cokoli s tečkou (soubory: .txt, .xml, .svg, .jpg, …)
  matcher: ["/((?!_next|.*\\..*).*)"],
};

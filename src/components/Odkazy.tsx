import { aktivniOdkazy, ODKAZY_PAGE, type OdkazIcon } from "@/data/odkazy";
import { withUtm, type OdkazSrc } from "@/lib/odkazy-utm";
import { isShopOpen } from "@/lib/hours";
import { OdkazyTracking } from "./OdkazyTracking";

/**
 * Linkpage /odkazy — vlastní náhrada Linktree.
 *
 * Serverová komponenta: odkazy jsou obyčejná <a> s hotovými UTM parametry,
 * takže stránka funguje i s vypnutým JavaScriptem. JS přidává jen měření.
 */

/** Morrisův motiv — úzký dekorativní pás pod hlavičkou, ne pozadí stránky. */
const MORRIS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="26" viewBox="0 0 80 26">
<g fill="none" stroke="#6d7a52" stroke-width="1.1" stroke-linecap="round">
<path d="M0 13 Q 10 4 20 13 T 40 13 T 60 13 T 80 13"/>
</g>
<g fill="#6d7a52" opacity="0.55">
<ellipse cx="10" cy="6.5" rx="5" ry="2.4" transform="rotate(-24 10 6.5)"/>
<ellipse cx="50" cy="6.5" rx="5" ry="2.4" transform="rotate(-24 50 6.5)"/>
<ellipse cx="30" cy="19.5" rx="5" ry="2.4" transform="rotate(24 30 19.5)"/>
<ellipse cx="70" cy="19.5" rx="5" ry="2.4" transform="rotate(24 70 19.5)"/>
</g>
<g fill="#b8924d">
<circle cx="20" cy="13" r="2.1"/><circle cx="60" cy="13" r="2.1"/>
<circle cx="0" cy="13" r="1.3"/><circle cx="40" cy="13" r="1.3"/><circle cx="80" cy="13" r="1.3"/>
</g>
</svg>`;

const MORRIS_URL = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  MORRIS_SVG
)}")`;

function OdkazIkona({ icon }: { icon: OdkazIcon }) {
  const common = {
    width: 21,
    height: 21,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };

  switch (icon) {
    case "wolt":
      return (
        <svg {...common}>
          <path d="M5 8h14l-1.2 11.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M6.4 3.5h3l1.5 3.7-1.9 1.4a11.5 11.5 0 0 0 5.4 5.4l1.4-1.9 3.7 1.5v3a1.9 1.9 0 0 1-2.1 1.9A16.3 16.3 0 0 1 4.5 5.6a1.9 1.9 0 0 1 1.9-2.1Z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M3.8 20.2 5 16.6a8 8 0 1 1 3 3Z" />
          <path d="M9.2 9.3c.3 1.6 2 3.4 3.7 3.9l1-1.2 1.9.9v1.4c-2.6.5-6.1-2.6-6.4-5.6Z" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="2.8" y="5" width="18.4" height="14" rx="2" />
          <path d="m3.4 6.6 8.6 6 8.6-6" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.1" cy="6.9" r="1.05" fill="currentColor" stroke="none" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M12 21s6.4-5.6 6.4-10.1A6.4 6.4 0 0 0 5.6 10.9C5.6 15.4 12 21 12 21Z" />
          <circle cx="12" cy="10.7" r="2.4" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.8l5.9-.8Z" />
        </svg>
      );
  }
}

export function Odkazy({ src }: { src: OdkazSrc | null }) {
  const odkazy = aktivniOdkazy();
  const open = isShopOpen(new Date());

  return (
    <main className="odkazy-page">
      <div className="odkazy-shell">
        <header style={{ textAlign: "center" }}>
          <h1 style={{ margin: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt={ODKAZY_PAGE.name}
              width={260}
              height={88}
              style={{
                display: "block",
                width: "min(15rem, 62%)",
                height: "auto",
                margin: "0 auto",
              }}
            />
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body), Georgia, serif",
              fontSize: "0.95rem",
              lineHeight: 1.45,
              color: "var(--ink)",
              marginTop: "0.7rem",
              textWrap: "balance",
            }}
          >
            {ODKAZY_PAGE.tagline}
          </p>
        </header>

        <div
          aria-hidden="true"
          className="morris-band"
          style={{
            backgroundImage: MORRIS_URL,
            margin: "1rem 0 1.15rem",
          }}
        />

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.55rem",
          }}
        >
          {odkazy.map((odkaz, i) => {
            const href = withUtm(odkaz, src);
            const external = /^https?:\/\//i.test(odkaz.href);
            const primary = odkaz.variant === "primary";

            return (
              <li
                key={odkaz.id}
                className="odkaz-reveal"
                style={{ ["--odkaz-i" as string]: i }}
              >
                <a
                  href={href}
                  data-odkaz-id={odkaz.id}
                  data-odkaz-label={odkaz.label}
                  className={`odkaz-card${primary ? " odkaz-card--primary" : ""}`}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: "1.9rem",
                      flexShrink: 0,
                      color: primary ? "var(--cream)" : "var(--gilt-deep)",
                    }}
                  >
                    <OdkazIkona icon={odkaz.icon} />
                  </span>

                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="odkaz-label" style={{ display: "block" }}>
                      {odkaz.label}
                    </span>
                    {odkaz.sublabel ? (
                      <span className="odkaz-sublabel" style={{ display: "block" }}>
                        {odkaz.sublabel}
                      </span>
                    ) : null}
                  </span>

                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ flexShrink: 0, opacity: primary ? 0.85 : 0.45 }}
                  >
                    <path d="m9 5 7 7-7 7" />
                  </svg>
                </a>
              </li>
            );
          })}

          {/* Otevírací doba — statický text, ne odkaz. */}
          <li
            className="odkaz-reveal"
            style={{ ["--odkaz-i" as string]: odkazy.length }}
          >
            <div
              className="odkaz-card"
              style={{ alignItems: "flex-start", flexDirection: "column", gap: "0.4rem" }}
            >
              <span
                className="odkaz-label"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--ink)",
                }}
              >
                <span className={open ? "open-dot" : "closed-dot"} aria-hidden="true" />
                {ODKAZY_PAGE.hours.heading}
              </span>
              <dl
                style={{
                  margin: 0,
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  rowGap: "0.15rem",
                  fontFamily: "var(--font-body), Georgia, serif",
                  fontSize: "0.85rem",
                  color: "var(--ink-soft)",
                }}
              >
                {ODKAZY_PAGE.hours.rows.map((row) => (
                  <div key={row.days} style={{ display: "contents" }}>
                    <dt style={{ margin: 0 }}>{row.days}</dt>
                    <dd style={{ margin: 0, fontVariantNumeric: "tabular-nums" }}>
                      {row.time}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </li>
        </ul>

        <footer
          style={{
            marginTop: "auto",
            paddingTop: "1.4rem",
            textAlign: "center",
            fontFamily: "var(--font-ui), sans-serif",
            fontSize: "0.72rem",
            letterSpacing: "0.05em",
            color: "var(--ink-soft)",
            lineHeight: 1.7,
          }}
        >
          <div>{ODKAZY_PAGE.address}</div>
          <div style={{ marginTop: "0.35rem", opacity: 0.8 }}>
            © {new Date().getFullYear()} {ODKAZY_PAGE.footer} ·{" "}
            <a
              href={ODKAZY_PAGE.footerLinkHref}
              style={{ textDecoration: "underline", textUnderlineOffset: "2px" }}
            >
              {ODKAZY_PAGE.footerLinkLabel}
            </a>
          </div>
        </footer>
      </div>

      <OdkazyTracking
        pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID}
        src={src}
      />
    </main>
  );
}

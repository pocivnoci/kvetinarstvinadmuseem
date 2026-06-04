import { BRAND_STRIP } from "@/lib/constants";

export function BrandStrip() {
  return (
    <section
      style={{
        paddingTop: "var(--space-5)",
        paddingBottom: "var(--space-5)",
        background: "var(--cream)",
        position: "relative",
        zIndex: 2,
      }}
      aria-label="Co u nás najdete"
    >
      <div className="container">
        <div className="grid grid-cols-1 items-baseline gap-x-12 gap-y-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <span className="eyebrow">{BRAND_STRIP.eyebrow}</span>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
              lineHeight: 1.3,
              color: "var(--ink)",
              fontVariationSettings: '"SOFT" 100, "WONK" 1',
            }}
          >
            {BRAND_STRIP.body}
          </p>
        </div>

        {/* Divider with small flower */}
        <div
          aria-hidden="true"
          className="flex items-center gap-4 mt-12"
          style={{ color: "var(--gilt)" }}
        >
          <span
            style={{
              flex: 1,
              height: "1px",
              background:
                "linear-gradient(to right, transparent, var(--gilt) 50%, transparent)",
            }}
          />
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <g transform="translate(12 12)">
              {Array.from({ length: 6 }).map((_, i) => {
                const a = (i / 6) * Math.PI * 2;
                return (
                  <ellipse
                    key={i}
                    cx={Math.cos(a) * 4}
                    cy={Math.sin(a) * 4}
                    rx="3"
                    ry="1.6"
                    transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 4} ${Math.sin(a) * 4})`}
                    fill="var(--gilt)"
                    opacity="0.85"
                  />
                );
              })}
              <circle r="1.6" fill="var(--gilt-deep)" />
            </g>
          </svg>
          <span
            style={{
              flex: 1,
              height: "1px",
              background:
                "linear-gradient(to right, transparent, var(--gilt) 50%, transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

import { REVIEWS } from "@/lib/constants";

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.5-2.1 14.3-5.5l-6.6-5.6C29.7 34.6 27 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.6 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H24v8h11.3c-.8 2.3-2.2 4.2-4 5.6l6.6 5.6C39 38 44 32 44 24c0-1.3-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div
      aria-label={`Hodnocení ${full} z 5 hvězd`}
      style={{
        color: "var(--gilt)",
        letterSpacing: "2px",
        fontSize: "1rem",
        lineHeight: 1,
      }}
    >
      <span aria-hidden="true">
        {"★".repeat(full)}
        <span style={{ color: "var(--stone-pale)" }}>
          {"☆".repeat(5 - full)}
        </span>
      </span>
    </div>
  );
}

export function Reviews() {
  return (
    <section
      aria-label={REVIEWS.title}
      style={{
        paddingTop: "var(--space-6)",
        paddingBottom: "var(--space-6)",
        background: "var(--sage-deep)",
        color: "var(--cream)",
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="grid grid-cols-1 items-end gap-6 mb-12 md:grid-cols-[1fr_auto]">
          <div>
            <span className="eyebrow" style={{ color: "var(--gilt-light)" }}>
              {REVIEWS.eyebrow}
            </span>
            <h2 style={{ marginTop: "1rem", color: "var(--cream)" }}>
              {REVIEWS.title}
            </h2>
            <p
              style={{
                marginTop: "1rem",
                maxWidth: "34em",
                color: "var(--cream)",
                opacity: 0.9,
              }}
            >
              {REVIEWS.body}
            </p>
          </div>

          <a
            href={REVIEWS.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start md:self-end"
            style={{
              background: "var(--cream)",
              color: "var(--ink)",
              fontFamily: "var(--font-ui)",
              fontSize: "0.82rem",
              letterSpacing: "0.04em",
              padding: "0.7rem 1.1rem",
              borderRadius: "999px",
              boxShadow: "0 10px 30px -16px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            <GoogleG />
            {REVIEWS.googleLabel}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Cards */}
        <div
          className="grid gap-6 md:gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        >
          {REVIEWS.items.map((r, i) => (
            <figure
              key={`${r.author}-${i}`}
              style={{
                margin: 0,
                background: "var(--cream)",
                borderRadius: "14px",
                padding: "1.8rem 1.7rem 1.6rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.5) inset, 0 18px 44px -26px rgba(0,0,0,0.55)",
                border: "1px solid rgba(184, 146, 77, 0.18)",
              }}
            >
              <div className="flex items-center justify-between">
                <Stars rating={r.rating} />
                <span aria-hidden="true" style={{ opacity: 0.5 }}>
                  <GoogleG />
                </span>
              </div>

              <blockquote
                style={{
                  margin: 0,
                  fontFamily: "var(--font-body)",
                  fontSize: "1.02rem",
                  lineHeight: 1.6,
                  color: "var(--ink-soft)",
                  flexGrow: 1,
                }}
              >
                {"„"}
                {r.text}
                {"“"}
              </blockquote>

              <figcaption
                className="flex items-baseline justify-between"
                style={{ marginTop: "0.2rem" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "1.1rem",
                    color: "var(--ink)",
                  }}
                >
                  {r.author}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.05em",
                    color: "var(--stone)",
                  }}
                >
                  {r.date}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

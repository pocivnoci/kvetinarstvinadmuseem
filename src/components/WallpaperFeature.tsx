import { WALLPAPER } from "@/lib/constants";

export function WallpaperFeature() {
  return (
    <section
      className="wallpaper-feature relative"
      style={{
        minHeight: "90vh",
        backgroundImage: "url('/images/wallpaper.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundColor: "var(--moss)",
        display: "flex",
        alignItems: "center",
      }}
      aria-label={WALLPAPER.title}
    >
      {/* Directional wash — text legible on the left, květiny visible on the right */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(26,24,20,0.84) 0%, rgba(26,24,20,0.6) 42%, rgba(26,24,20,0.2) 78%, rgba(26,24,20,0.42) 100%)",
        }}
      />

      {/* Top and bottom hairlines */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "var(--gilt-deep)", opacity: 0.4 }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "var(--gilt-deep)", opacity: 0.4 }}
      />

      <div className="container relative" style={{ zIndex: 1 }}>
        <div style={{ maxWidth: "44rem" }}>
          <span
            className="eyebrow"
            style={{ color: "var(--gilt-light)" }}
          >
            {WALLPAPER.eyebrow}
          </span>
          <h2
            style={{
              color: "var(--cream)",
              marginTop: "1.2rem",
              marginBottom: "1.8rem",
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              fontStyle: "italic",
              fontVariationSettings: '"SOFT" 100, "WONK" 1',
            }}
          >
            {WALLPAPER.title}
          </h2>
          <p
            style={{
              color: "var(--cream)",
              fontSize: "1.2rem",
              lineHeight: 1.6,
              opacity: 0.92,
              maxWidth: "32em",
              marginBottom: "2.4rem",
            }}
          >
            {WALLPAPER.body}
          </p>
          <a href={WALLPAPER.cta.href} className="btn btn-cream">
            {WALLPAPER.cta.label}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

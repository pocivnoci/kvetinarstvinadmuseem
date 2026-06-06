import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";

export function Prostor({ t }: { t: Dictionary }) {
  const { PROSTOR } = t;
  return (
    <section
      style={{
        paddingTop: "var(--space-6)",
        paddingBottom: "var(--space-6)",
        background: "var(--shell)",
      }}
      aria-label={PROSTOR.title}
    >
      <div className="container">
        <div className="grid grid-cols-1 items-end gap-8 mb-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div>
            <span className="eyebrow">{PROSTOR.eyebrow}</span>
            <h2 style={{ marginTop: "1rem" }}>{PROSTOR.title}</h2>
          </div>
          <p
            style={{
              fontSize: "1.15rem",
              color: "var(--ink-soft)",
              lineHeight: 1.6,
              maxWidth: "34em",
            }}
          >
            {PROSTOR.body}
          </p>
        </div>

        <div
          className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:grid-rows-2"
          style={{ minHeight: "560px" }}
        >
          <ProstorTile
            image={PROSTOR.images[0]}
            spanRows
            placeholderColor="var(--shell-deep)"
          />
          <ProstorTile
            image={PROSTOR.images[1]}
            placeholderColor="var(--noir)"
          />
          <ProstorTile
            image={PROSTOR.images[2]}
            placeholderColor="var(--sage)"
          />
        </div>
      </div>
    </section>
  );
}

function ProstorTile({
  image,
  spanRows,
  placeholderColor,
}: {
  image: { src: string; alt: string };
  spanRows?: boolean;
  placeholderColor: string;
}) {
  return (
    <figure
      className="prostor-tile relative overflow-hidden group"
      style={{
        gridRow: spanRows ? "span 2" : undefined,
        borderRadius: "8px",
        background: placeholderColor,
        minHeight: "260px",
      }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={spanRows ? "(min-width: 768px) 55vw, 100vw" : "(min-width: 768px) 35vw, 100vw"}
        className="object-cover"
      />
      {/* Warm overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 50%, rgba(26, 24, 20, 0.35) 100%)",
          mixBlendMode: "multiply",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: "rgba(242, 214, 220, 0.06)",
          mixBlendMode: "overlay",
          transition: "opacity 0.6s var(--ease-petal)",
        }}
      />
      <figcaption
        style={{
          position: "absolute",
          left: "1rem",
          bottom: "1rem",
          color: "var(--cream)",
          fontFamily: "var(--font-ui)",
          fontSize: "0.7rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          textShadow: "0 1px 4px rgba(0,0,0,0.3)",
          opacity: 0.85,
        }}
      >
        {image.alt}
      </figcaption>
    </figure>
  );
}

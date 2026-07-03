import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";

type DoplnkyGroup = Dictionary["DEKORACE"] | Dictionary["ROSTLINY"];

export function Doplnky({ t }: { t: Dictionary }) {
  const { DEKORACE, ROSTLINY, UI } = t;
  return (
    <section
      id="doplnky"
      style={{
        paddingTop: "var(--space-6)",
        paddingBottom: "var(--space-6)",
        background: "var(--cream)",
      }}
      aria-label={UI.doplnkyAria}
    >
      <div className="container">
        <DoplnkyGroupBlock group={DEKORACE} tint="var(--shell-warm)" />
        <div style={{ height: "var(--space-5)" }} />
        <DoplnkyGroupBlock group={ROSTLINY} tint="var(--sage-pale)" />
      </div>
    </section>
  );
}

function DoplnkyGroupBlock({
  group,
  tint,
}: {
  group: DoplnkyGroup;
  tint: string;
}) {
  return (
    <div>
      <div className="grid grid-cols-1 items-end gap-6 mb-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div>
          <span className="eyebrow">{group.eyebrow}</span>
          <h2 style={{ marginTop: "1rem" }}>{group.title}</h2>
        </div>
        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--ink-soft)",
            lineHeight: 1.6,
            maxWidth: "34em",
          }}
        >
          {group.body}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {group.images.map((image) => (
          <figure
            key={image.src}
            className="prostor-tile relative overflow-hidden"
            style={{
              borderRadius: "8px",
              background: tint,
              aspectRatio: "4 / 5",
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 24vw, 48vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, transparent 60%, rgba(26, 24, 20, 0.32) 100%)",
                mixBlendMode: "multiply",
              }}
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

"use client";

import type { SeasonKey } from "@/lib/constants";

type Props = {
  variant: SeasonKey;
  className?: string;
};

export function BouquetSVG({ variant, className }: Props) {
  switch (variant) {
    case "spring":
      return <SpringBouquet className={className} />;
    case "summer":
      return <SummerBouquet className={className} />;
    case "autumn":
      return <AutumnBouquet className={className} />;
    case "winter":
      return <WinterBouquet className={className} />;
  }
}

/* ─────────────────────────────────────────────
   Shared wrap (kraft paper cone)
   ───────────────────────────────────────────── */

function KraftWrap() {
  return (
    <g>
      {/* Kraft paper cone */}
      <path
        d="M 130 320 L 270 320 L 310 470 L 90 470 Z"
        fill="var(--kraft)"
        opacity="0.95"
      />
      <path
        d="M 130 320 L 200 320 L 200 470 L 90 470 Z"
        fill="var(--kraft)"
        opacity="0.55"
      />
      {/* Fold crease */}
      <path
        d="M 200 320 L 200 470"
        stroke="var(--gilt-deep)"
        strokeWidth="0.8"
        opacity="0.4"
      />
      {/* Twine */}
      <path
        d="M 110 360 Q 200 374 290 360"
        stroke="var(--gilt-deep)"
        strokeWidth="2"
        fill="none"
        opacity="0.85"
      />
      <path
        d="M 110 364 Q 200 378 290 364"
        stroke="var(--gilt)"
        strokeWidth="1"
        fill="none"
        opacity="0.9"
      />
      {/* Knot */}
      <circle cx="200" cy="370" r="4" fill="var(--gilt-deep)" />
      <path
        d="M 196 372 L 188 392 M 204 372 L 212 394"
        stroke="var(--gilt-deep)"
        strokeWidth="1.2"
        fill="none"
      />
    </g>
  );
}

/* ─────────────────────────────────────────────
   Spring — peonies, sage, kraft
   ───────────────────────────────────────────── */

function SpringBouquet({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      role="img"
      aria-label="Jarní kytice — pivoňky a sage zeleň v kraft papíru"
    >
      <defs>
        <radialGradient id="peony-pink" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#F8DCDC" />
          <stop offset="60%" stopColor="#E8A8B8" />
          <stop offset="100%" stopColor="#C97C8E" />
        </radialGradient>
        <radialGradient id="peony-cream" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#FAF0E2" />
          <stop offset="100%" stopColor="#E8C8A8" />
        </radialGradient>
      </defs>

      {/* Stems */}
      <g stroke="var(--sage-deep)" strokeWidth="2.2" fill="none">
        <path d="M 200 320 Q 195 240 175 150" />
        <path d="M 200 320 Q 210 245 235 165" />
        <path d="M 200 320 Q 185 250 145 195" />
        <path d="M 200 320 Q 220 250 270 210" />
        <path d="M 200 320 Q 200 250 200 175" />
      </g>

      {/* Sage filler leaves */}
      <g fill="var(--sage)" opacity="0.85">
        <ellipse cx="160" cy="245" rx="20" ry="9" transform="rotate(-30 160 245)" />
        <ellipse cx="245" cy="240" rx="22" ry="9" transform="rotate(35 245 240)" />
        <ellipse cx="175" cy="200" rx="18" ry="8" transform="rotate(-50 175 200)" />
        <ellipse cx="230" cy="195" rx="18" ry="8" transform="rotate(50 230 195)" />
      </g>
      <g fill="var(--sage-pale)" opacity="0.75">
        <ellipse cx="150" cy="225" rx="14" ry="6" transform="rotate(-20 150 225)" />
        <ellipse cx="255" cy="220" rx="14" ry="6" transform="rotate(25 255 220)" />
      </g>

      {/* Peonies — back row */}
      <Peony cx={145} cy={195} r={42} fill="url(#peony-cream)" />
      <Peony cx={270} cy={210} r={40} fill="url(#peony-pink)" />

      {/* Peonies — front row */}
      <Peony cx={175} cy={150} r={50} fill="url(#peony-pink)" />
      <Peony cx={235} cy={165} r={48} fill="url(#peony-cream)" />
      <Peony cx={200} cy={175} r={44} fill="url(#peony-pink)" />

      {/* Small buds */}
      <circle cx="120" cy="240" r="8" fill="var(--shell-deep)" />
      <circle cx="285" cy="255" r="9" fill="var(--shell-deep)" />

      <KraftWrap />
    </svg>
  );
}

function Peony({
  cx,
  cy,
  r,
  fill,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
}) {
  const petals = 8;
  return (
    <g>
      {/* Outer petals */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i / petals) * Math.PI * 2;
        const px = cx + Math.cos(angle) * r * 0.55;
        const py = cy + Math.sin(angle) * r * 0.55;
        return (
          <ellipse
            key={`o-${i}`}
            cx={px}
            cy={py}
            rx={r * 0.55}
            ry={r * 0.38}
            transform={`rotate(${(angle * 180) / Math.PI} ${px} ${py})`}
            fill={fill}
            opacity="0.92"
          />
        );
      })}
      {/* Inner cluster */}
      <circle cx={cx} cy={cy} r={r * 0.55} fill={fill} />
      <circle cx={cx - r * 0.1} cy={cy - r * 0.1} r={r * 0.32} fill={fill} opacity="0.95" />
      <circle cx={cx + r * 0.08} cy={cy + r * 0.05} r={r * 0.22} fill="var(--gilt-light)" opacity="0.45" />
    </g>
  );
}

/* ─────────────────────────────────────────────
   Summer — dahlias, cosmos, grasses
   ───────────────────────────────────────────── */

function SummerBouquet({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      role="img"
      aria-label="Letní kytice — jiřinky a kosmey s travami"
    >
      <defs>
        <radialGradient id="dahlia-coral" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#F4B89C" />
          <stop offset="100%" stopColor="#B85842" />
        </radialGradient>
        <radialGradient id="dahlia-mustard" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#E8C870" />
          <stop offset="100%" stopColor="#B89642" />
        </radialGradient>
      </defs>

      {/* Tall grasses */}
      <g stroke="var(--mustard)" strokeWidth="1.2" fill="none" opacity="0.8">
        <path d="M 165 320 Q 158 220 150 110" />
        <path d="M 175 320 Q 174 215 178 100" />
        <path d="M 225 320 Q 230 220 248 115" />
        <path d="M 235 320 Q 245 225 270 130" />
      </g>
      {/* Grass tufts */}
      <g fill="var(--mustard)" opacity="0.9">
        <ellipse cx="150" cy="110" rx="4" ry="14" />
        <ellipse cx="178" cy="100" rx="4" ry="14" />
        <ellipse cx="248" cy="115" rx="4" ry="14" />
        <ellipse cx="270" cy="130" rx="4" ry="14" />
      </g>

      {/* Main stems */}
      <g stroke="var(--moss)" strokeWidth="2.2" fill="none">
        <path d="M 200 320 Q 195 245 170 180" />
        <path d="M 200 320 Q 210 250 240 190" />
        <path d="M 200 320 Q 200 250 200 200" />
        <path d="M 200 320 Q 188 255 155 220" />
        <path d="M 200 320 Q 215 255 260 225" />
      </g>

      {/* Leaves */}
      <g fill="var(--moss)" opacity="0.8">
        <ellipse cx="165" cy="250" rx="22" ry="8" transform="rotate(-25 165 250)" />
        <ellipse cx="240" cy="255" rx="22" ry="8" transform="rotate(28 240 255)" />
        <ellipse cx="180" cy="220" rx="16" ry="7" transform="rotate(-45 180 220)" />
      </g>

      {/* Dahlias */}
      <Dahlia cx={170} cy={180} r={38} fill="url(#dahlia-coral)" />
      <Dahlia cx={240} cy={190} r={40} fill="url(#dahlia-mustard)" />
      <Dahlia cx={200} cy={200} r={34} fill="url(#dahlia-coral)" />

      {/* Cosmos — small pink stars */}
      <Cosmos cx={155} cy={220} r={14} />
      <Cosmos cx={260} cy={225} r={14} />
      <Cosmos cx={135} cy={240} r={11} />
      <Cosmos cx={280} cy={250} r={11} />

      <KraftWrap />
    </svg>
  );
}

function Dahlia({
  cx,
  cy,
  r,
  fill,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
}) {
  const layers = [
    { count: 10, scale: 1, opacity: 0.85 },
    { count: 8, scale: 0.7, opacity: 0.95 },
    { count: 6, scale: 0.45, opacity: 1 },
  ];
  return (
    <g>
      {layers.map((layer, li) =>
        Array.from({ length: layer.count }).map((_, i) => {
          const angle = (i / layer.count) * Math.PI * 2 + li * 0.3;
          const dist = r * 0.55 * layer.scale;
          const px = cx + Math.cos(angle) * dist;
          const py = cy + Math.sin(angle) * dist;
          return (
            <ellipse
              key={`${li}-${i}`}
              cx={px}
              cy={py}
              rx={r * 0.32 * layer.scale}
              ry={r * 0.16 * layer.scale}
              transform={`rotate(${(angle * 180) / Math.PI} ${px} ${py})`}
              fill={fill}
              opacity={layer.opacity}
            />
          );
        })
      )}
      <circle cx={cx} cy={cy} r={r * 0.12} fill="var(--gilt-deep)" />
    </g>
  );
}

function Cosmos({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const px = cx + Math.cos(angle) * r * 0.7;
        const py = cy + Math.sin(angle) * r * 0.7;
        return (
          <ellipse
            key={i}
            cx={px}
            cy={py}
            rx={r * 0.55}
            ry={r * 0.3}
            transform={`rotate(${(angle * 180) / Math.PI} ${px} ${py})`}
            fill="var(--shell-warm)"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.25} fill="var(--gilt)" />
    </g>
  );
}

/* ─────────────────────────────────────────────
   Autumn — roses, dried grasses, terracotta
   ───────────────────────────────────────────── */

function AutumnBouquet({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      role="img"
      aria-label="Podzimní kytice — růže a sušené trávy v terakotě"
    >
      <defs>
        <radialGradient id="rose-rust" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#D08068" />
          <stop offset="100%" stopColor="#8A3A28" />
        </radialGradient>
        <radialGradient id="rose-burgundy" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#A85060" />
          <stop offset="100%" stopColor="#5A2030" />
        </radialGradient>
      </defs>

      {/* Pampas — tall feathery */}
      <g opacity="0.85">
        <Pampas x={140} y={120} h={210} />
        <Pampas x={260} y={130} h={200} />
        <Pampas x={195} y={95} h={230} />
      </g>

      {/* Stems */}
      <g stroke="var(--moss)" strokeWidth="2.2" fill="none">
        <path d="M 200 320 Q 195 250 170 200" />
        <path d="M 200 320 Q 210 250 240 210" />
        <path d="M 200 320 Q 200 250 200 220" />
      </g>

      {/* Dark leaves */}
      <g fill="var(--moss)" opacity="0.85">
        <ellipse cx="160" cy="255" rx="22" ry="8" transform="rotate(-30 160 255)" />
        <ellipse cx="245" cy="260" rx="22" ry="8" transform="rotate(30 245 260)" />
        <ellipse cx="180" cy="225" rx="16" ry="6" transform="rotate(-50 180 225)" />
      </g>

      {/* Roses */}
      <Rose cx={170} cy={200} r={36} fill="url(#rose-rust)" />
      <Rose cx={240} cy={210} r={38} fill="url(#rose-burgundy)" />
      <Rose cx={200} cy={220} r={32} fill="url(#rose-rust)" />

      {/* Berry clusters */}
      <BerryCluster cx={145} cy={245} />
      <BerryCluster cx={260} cy={250} />

      {/* Dried wheat */}
      <g stroke="var(--mustard)" strokeWidth="1" fill="var(--mustard)" opacity="0.85">
        <Wheat x={130} y={230} />
        <Wheat x={275} y={235} />
      </g>

      <KraftWrap />
    </svg>
  );
}

function Pampas({ x, y, h }: { x: number; y: number; h: number }) {
  return (
    <g>
      <path
        d={`M ${x} ${y + h} Q ${x - 2} ${y + h / 2} ${x} ${y}`}
        stroke="var(--stone)"
        strokeWidth="1.2"
        fill="none"
      />
      <g fill="var(--cream)" opacity="0.85">
        {Array.from({ length: 18 }).map((_, i) => {
          const t = i / 18;
          const py = y + t * h * 0.55;
          const spread = (1 - t) * 14 + 3;
          return (
            <ellipse key={i} cx={x} cy={py} rx={spread} ry={3} />
          );
        })}
      </g>
    </g>
  );
}

function Rose({
  cx,
  cy,
  r,
  fill,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
}) {
  return (
    <g>
      {/* Outer wrap petals */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const px = cx + Math.cos(angle) * r * 0.5;
        const py = cy + Math.sin(angle) * r * 0.5;
        return (
          <path
            key={i}
            d={`M ${px} ${py} q ${r * 0.4} ${-r * 0.2} ${r * 0.3} ${-r * 0.55} q ${-r * 0.5} 0 ${-r * 0.7} ${r * 0.2} z`}
            transform={`rotate(${(angle * 180) / Math.PI} ${px} ${py})`}
            fill={fill}
            opacity="0.9"
          />
        );
      })}
      {/* Tight spiral center */}
      <circle cx={cx} cy={cy} r={r * 0.55} fill={fill} />
      <circle cx={cx - r * 0.05} cy={cy - r * 0.05} r={r * 0.35} fill={fill} opacity="0.95" />
      <circle cx={cx} cy={cy} r={r * 0.15} fill={fill} opacity="1" />
      <path
        d={`M ${cx} ${cy - r * 0.1} Q ${cx + r * 0.1} ${cy} ${cx} ${cy + r * 0.1}`}
        stroke="var(--gilt-deep)"
        strokeWidth="0.6"
        fill="none"
        opacity="0.5"
      />
    </g>
  );
}

function BerryCluster({ cx, cy }: { cx: number; cy: number }) {
  const berries = [
    [0, 0],
    [8, 4],
    [-6, 6],
    [4, -7],
    [-8, -3],
    [12, -2],
    [-3, 12],
  ] as const;
  return (
    <g>
      {berries.map(([dx, dy], i) => (
        <circle
          key={i}
          cx={cx + dx}
          cy={cy + dy}
          r="3.5"
          fill="var(--terracotta)"
        />
      ))}
    </g>
  );
}

function Wheat({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M ${x} ${y + 60} L ${x} ${y}`} />
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i}>
          <ellipse cx={x - 4} cy={y + i * 8} rx="3" ry="5" transform={`rotate(-25 ${x - 4} ${y + i * 8})`} />
          <ellipse cx={x + 4} cy={y + i * 8} rx="3" ry="5" transform={`rotate(25 ${x + 4} ${y + i * 8})`} />
        </g>
      ))}
    </g>
  );
}

/* ─────────────────────────────────────────────
   Winter — white roses, eucalyptus, gilt
   ───────────────────────────────────────────── */

function WinterBouquet({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      role="img"
      aria-label="Zimní kytice — bílé růže a eukalyptus"
    >
      <defs>
        <radialGradient id="rose-white" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#FAF6EE" />
          <stop offset="100%" stopColor="#D8CFC0" />
        </radialGradient>
      </defs>

      {/* Eucalyptus branches */}
      <g>
        <Eucalyptus x={150} y={250} angle={-30} />
        <Eucalyptus x={250} y={250} angle={30} />
        <Eucalyptus x={130} y={230} angle={-55} />
        <Eucalyptus x={270} y={230} angle={55} />
      </g>

      {/* Stems */}
      <g stroke="var(--stone)" strokeWidth="2.2" fill="none">
        <path d="M 200 320 Q 195 250 175 195" />
        <path d="M 200 320 Q 210 250 235 200" />
        <path d="M 200 320 Q 200 250 200 215" />
      </g>

      {/* White roses */}
      <Rose cx={175} cy={195} r={36} fill="url(#rose-white)" />
      <Rose cx={235} cy={200} r={36} fill="url(#rose-white)" />
      <Rose cx={200} cy={215} r={32} fill="url(#rose-white)" />

      {/* Gilt accent twigs */}
      <g stroke="var(--gilt)" strokeWidth="1.4" fill="none" opacity="0.9">
        <path d="M 145 240 L 110 180" />
        <path d="M 110 180 L 95 165" />
        <path d="M 110 180 L 105 155" />
        <path d="M 260 245 L 295 185" />
        <path d="M 295 185 L 310 170" />
        <path d="M 295 185 L 300 160" />
      </g>
      <g fill="var(--gilt-light)" opacity="0.9">
        <circle cx="95" cy="165" r="3" />
        <circle cx="105" cy="155" r="3" />
        <circle cx="310" cy="170" r="3" />
        <circle cx="300" cy="160" r="3" />
      </g>

      <KraftWrap />
    </svg>
  );
}

function Eucalyptus({
  x,
  y,
  angle,
}: {
  x: number;
  y: number;
  angle: number;
}) {
  return (
    <g transform={`rotate(${angle} ${x} ${y})`}>
      <path
        d={`M ${x} ${y} L ${x} ${y - 110}`}
        stroke="var(--sage-deep)"
        strokeWidth="1.4"
        fill="none"
      />
      {Array.from({ length: 8 }).map((_, i) => {
        const py = y - 8 - i * 13;
        const side = i % 2 === 0 ? -1 : 1;
        return (
          <ellipse
            key={i}
            cx={x + side * 10}
            cy={py}
            rx="10"
            ry="6"
            transform={`rotate(${side * 35} ${x + side * 10} ${py})`}
            fill="var(--sage-pale)"
            opacity="0.95"
          />
        );
      })}
    </g>
  );
}

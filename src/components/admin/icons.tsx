/** Jednoduché čárové ikony pro admin — 24px viewBox, stroke currentColor. */

type P = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const Ico = {
  home: (p: P) => (
    <svg {...base} {...p}><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
  ),
  orders: (p: P) => (
    <svg {...base} {...p}><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v4h4" /><path d="M9 12h6M9 16h6" /></svg>
  ),
  calendar: (p: P) => (
    <svg {...base} {...p}><rect x="3" y="5" width="18" height="16" rx="1.5" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
  ),
  people: (p: P) => (
    <svg {...base} {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.5-4 3.5-6 6.5-6s6 2 6.5 6" /><circle cx="17" cy="9" r="2.5" /><path d="M17 14c2.5 0 4.2 1.7 4.5 5" /></svg>
  ),
  stock: (p: P) => (
    <svg {...base} {...p}><path d="M3 8l9-4 9 4-9 4z" /><path d="M3 8v8l9 4 9-4V8" /><path d="M12 12v8" /></svg>
  ),
  calc: (p: P) => (
    <svg {...base} {...p}><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M8 7h8" /><path d="M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0" /></svg>
  ),
  flower: (p: P) => (
    <svg {...base} {...p}><circle cx="12" cy="9" r="2.5" /><path d="M12 6.5c0-3 3-3.5 3-1s-3 1-3 1zM12 6.5c0-3-3-3.5-3-1s3 1 3 1zM14.5 9c3 0 3.5 3 1 3s-1-3-1-3zM9.5 9c-3 0-3.5 3-1 3s1-3 1-3zM12 11.5c0 3 3 3.5 3 1s-3-1-3-1zM12 11.5c0 3-3 3.5-3 1s3-1 3-1z" /><path d="M12 12v9M12 17c-2 0-3.5-1.5-4-3M12 19c2 0 3.5-1.5 4-3" /></svg>
  ),
  star: (p: P) => (
    <svg {...base} {...p}><path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17l-5.4 2.8 1.1-6.1L3.2 9.4l6.1-.8z" /></svg>
  ),
  leaf: (p: P) => (
    <svg {...base} {...p}><path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15z" /><path d="M5 19c3-5 7-8 11-10" /></svg>
  ),
  money: (p: P) => (
    <svg {...base} {...p}><rect x="2.5" y="6" width="19" height="12" rx="1.5" /><circle cx="12" cy="12" r="2.6" /><path d="M6 9.5h.01M18 14.5h.01" /></svg>
  ),
  settings: (p: P) => (
    <svg {...base} {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>
  ),
  plus: (p: P) => (
    <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
  ),
  print: (p: P) => (
    <svg {...base} {...p}><path d="M7 8V3h10v5" /><rect x="3" y="8" width="18" height="9" rx="1.5" /><path d="M7 14h10v7H7z" /></svg>
  ),
  phone: (p: P) => (
    <svg {...base} {...p}><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" /></svg>
  ),
  logout: (p: P) => (
    <svg {...base} {...p}><path d="M10 4H5v16h5" /><path d="M14 8l4 4-4 4M18 12H9" /></svg>
  ),
  web: (p: P) => (
    <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></svg>
  ),
  alert: (p: P) => (
    <svg {...base} {...p}><path d="M12 3 2.5 20h19z" /><path d="M12 9v5M12 17h0" /></svg>
  ),
  chevron: (p: P) => (
    <svg {...base} {...p}><path d="m9 6 6 6-6 6" /></svg>
  ),
  trash: (p: P) => (
    <svg {...base} {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>
  ),
};

export type IconName = keyof typeof Ico;

import { CONTACT } from "@/lib/constants";

const ITEMS = [
  { label: "Otevřeno", value: "Po–So 9–18" },
  { label: "Kde", value: "Vinohradská 6 · u metra Muzeum" },
  { label: "Doručení", value: "po celé Praze" },
  { label: "Telefon", value: CONTACT.phone, href: CONTACT.phoneHref },
];

export function InfoBar() {
  return (
    <section
      aria-label="Základní informace"
      style={{
        background: "var(--sage-deep)",
        color: "var(--cream)",
      }}
    >
      <div className="container">
        <ul
          className="flex flex-wrap items-center justify-center md:justify-between gap-x-8 gap-y-2"
          style={{
            listStyle: "none",
            margin: 0,
            padding: "0.9rem 0",
            fontFamily: "var(--font-ui)",
            fontSize: "0.82rem",
            letterSpacing: "0.04em",
          }}
        >
          {ITEMS.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <span
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  fontSize: "0.66rem",
                  opacity: 0.7,
                }}
              >
                {item.label}
              </span>
              {item.href ? (
                <a href={item.href} style={{ borderBottom: "1px solid rgba(244,237,224,0.5)" }}>
                  {item.value}
                </a>
              ) : (
                <span>{item.value}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

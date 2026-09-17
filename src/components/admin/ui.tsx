"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ORDER_STATUS, type OrderStatus } from "@/lib/admin/types";

/** Hlavička stránky: nadpis, podtitul, akce vpravo. */
export function PageHead({
  title,
  sub,
  children,
}: {
  title: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="admin-head">
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {children && <div className="admin-actions">{children}</div>}
    </div>
  );
}

export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card ${className}`}>
      {(title || action) && (
        <div className="card-title">
          {title && <h2>{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`field ${className}`}>
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const s = ORDER_STATUS[status];
  return <span className={`badge badge-${s.tone}`}>{s.label}</span>;
}

export function Badge({
  tone = "stone",
  children,
}: {
  tone?: string;
  children: ReactNode;
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty">{children}</div>;
}

export function Stat({
  label,
  value,
  sub,
}: {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  );
}

export function LinkBtn({
  href,
  variant = "primary",
  size,
  children,
}: {
  href: string;
  variant?: "primary" | "ghost" | "cream";
  size?: "sm";
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`btn btn-${variant} ${size ? `btn-${size}` : ""}`}>
      {children}
    </Link>
  );
}

/** Načítání dat z prohlížeče — jen na první render před hydratací. */
export function Loading() {
  return <div className="empty">Načítám…</div>;
}

import type { Metadata, Viewport } from "next";
import { fontClassName } from "@/lib/fonts";
import "../globals.css";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Admin — Květiny nad museem", template: "%s · Admin KNM" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f4ede0",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Kořenový layout adminu — mimo jazykové routování, jen česky.
 * Kostru s navigací (AdminShell) přidávají až stránky v (app), aby ji
 * přihlašovací stránka neměla.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={fontClassName}>
      <body>{children}</body>
    </html>
  );
}

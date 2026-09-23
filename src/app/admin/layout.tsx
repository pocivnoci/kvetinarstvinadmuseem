import type { Metadata, Viewport } from "next";
import { fontClassName } from "@/lib/fonts";
import "../globals.css";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Admin — Květiny nad museem", template: "%s · Admin KNM" },
  robots: { index: false, follow: false },
  // Admin jde přidat na plochu mobilu jako aplikace „Můj krám" — otevře se
  // bez lišty prohlížeče, rovnou na Přehled. Manifest a ikony jsou
  // v public/admin-app, mimo /admin, aby je prohlížeč stáhl i bez přihlášení.
  manifest: "/admin-app/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Můj krám", statusBarStyle: "default" },
  icons: { apple: "/admin-app/apple-touch-icon.png" },
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

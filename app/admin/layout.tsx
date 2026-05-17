import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gmsportstudio.com"),
  robots: { index: false, follow: false },
};

/**
 * Layout estandalone para /admin/* (testers, invitaciones, grants…).
 *
 * Panel interno del founder, no public-facing. Sin Navbar ni Footer.
 * Acceso restringido por customClaim.admin del usuario autenticado.
 *
 * Next 16 exige <html>+<body> en este nivel (root layout pass-through).
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ background: "#0f1117", color: "#EDEDED" }}
      >
        {children}
      </body>
    </html>
  );
}

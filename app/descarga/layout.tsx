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
  metadataBase: new URL("https://www.inboundbasketballstudio.com"),
  robots: { index: false, follow: false },
};

/**
 * Layout estandalone para /descarga.
 *
 * No pasa por [locale]/layout.tsx (esa ruta vive en /[locale]/...).
 * Next.js 16 exige <html>+<body> en cualquier rama de layout.tsx que
 * sirva un página; antes de Next 16 el root pass-through era válido.
 *
 * Mismo patrón que (legal)/layout.tsx — copiamos la base mínima sin
 * Navbar, Footer ni CookieBanner. La página `/descarga` es self-contained:
 * el bloque de descarga ocupa toda la pantalla con su propio header
 * (logo Inbound Studio) y no necesita navegación global.
 */
export default function DescargaLayout({
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

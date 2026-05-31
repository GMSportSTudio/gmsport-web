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
 * Layout estandalone para /cuenta/* (activar, cancelar, reclamar).
 *
 * Páginas self-contained de gestión de la suscripción. No pasan por
 * [locale]/layout.tsx ni cargan Navbar/Footer — son flujos cortos donde
 * el usuario llega desde un email transaccional o desde un link compartido.
 *
 * Next 16 exige <html>+<body> en este nivel (root layout es pass-through).
 */
export default function CuentaLayout({
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

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
 * Layout estandalone para /prueba — el enlace «Empezar mis días» del correo.
 *
 * FALTABA, y por eso la página daba 404. Dos piezas hacen falta a la vez para
 * que una ruta viva fuera de `[locale]`:
 *
 *   1. Estar en `INTL_EXCLUDED_PREFIXES` de `proxy.ts`. Su matcher cubre el
 *      100% de las rutas, así que lo que no se excluye acaba en next-intl,
 *      que intenta reescribirlo a `/es/...` y devuelve 404.
 *   2. Un layout con `<html>` y `<body>` propios: el layout raíz es
 *      pass-through y Next los exige en este nivel.
 *
 * Con una sola de las dos, la página sigue rota. `/cuenta`, `/descarga` y
 * `/admin` tienen las dos desde siempre; esta se quedó sin ninguna.
 *
 * Lo reportó Xavi Sastre el 24/08: pulsaba el botón del correo para empezar
 * su prueba y le salía "página no encontrada". Nadie podía activarla.
 */
export default function PruebaLayout({
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

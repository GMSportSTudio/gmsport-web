import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

/**
 * 410 Gone para el dominio viejo (rebrand → Inbound Studio, 2026-07).
 *
 * El burofax + email de GM SCOUT (01/07/2026) reclama que la web seguía
 * apareciendo al buscar "GM SPORT" en Google. Causa: el redirect 308 por
 * host (antes en next.config.ts) transfería TODAS las señales del dominio
 * viejo a inboundbasketballstudio.com. Con 410 Gone, Google elimina las
 * URLs del índice y la asociación con la marca antigua decae. El body NO
 * menciona la marca nueva a propósito. NO volver a añadir el redirect sin
 * hablar con legal. El dominio se mantiene en propiedad (no dejar caducar).
 *
 * Nota Next 16: este archivo es proxy.ts (no middleware.ts — tener ambos
 * rompe el build: "Both middleware file and proxy file are detected").
 */
const OLD_HOSTS = new Set(["gmsportstudio.com", "www.gmsportstudio.com"]);

// Exclusiones del middleware next-intl. Antes vivían en config.matcher
// (negative lookahead); se portan a código con la MISMA semántica de
// prefijo para que el matcher pueda cubrir el 100% de rutas y el 410 del
// dominio viejo aplique también a /descarga, /admin, estáticos, etc.
//
// AÑADIR AQUÍ toda ruta nueva que viva fuera de `app/[locale]/`. Olvidarlo no
// da un error de compilación ni un aviso: la página simplemente devuelve 404
// en producción. Ya ha pasado dos veces — los manuales estuvieron rotos cinco
// semanas, y `/prueba` (el botón «Empezar mis días» de los correos) dejó a
// todo el mundo sin poder activar su prueba hasta que un cliente lo reportó.
//
// Además de estar en esta lista, la ruta necesita su propio `layout.tsx` con
// `<html>` y `<body>`: el layout raíz es pass-through. Con una sola de las dos
// cosas, sigue rota. `scripts/comprobar_rutas_estaticas.mjs` vigila las dos.
const INTL_EXCLUDED_PREFIXES = [
  "/api",
  "/_next",
  "/admin",
  "/descarga",
  "/cuenta",
  "/prueba",
  "/aviso-legal",
  "/privacidad",
  "/terminos-beta",
  "/cookies",
  "/opengraph-image",
  "/icon",
  "/apple-icon",
  "/favicon.ico",
  "/sitemap.xml",
  "/robots.txt",
];
/**
 * Cualquier ruta que termine en un nombre de fichero con extensión.
 *
 * Antes esto era una lista blanca de extensiones
 * (`png|jpg|gif|svg|ico|mp4|webm|webp|woff|...`) y **`pdf` no estaba**. El
 * resultado: `/Manual_InboundStudio_latest.pdf` no casaba con ninguna
 * exclusión, caía al middleware de next-intl, se redirigía a
 * `/es/Manual_InboundStudio_latest.pdf` — que no existe — y devolvía 404.
 *
 * El fichero estaba en git y desplegado, así que desde fuera parecía un
 * problema del PDF. Estuvo roto cinco semanas (desde 5526686, 02/07/2026,
 * cuando las exclusiones se portaron del matcher al código) y solo se supo
 * porque los usuarios se quejaron.
 *
 * Una lista blanca obliga a acordarse de cada formato nuevo. Preguntar si el
 * último segmento tiene extensión cubre lo que venga: PDF, ZIP, CSV, AVIF.
 * Ninguna ruta de la web lleva punto en el último tramo.
 */
const ES_FICHERO_RE = /\/[^/]+\.[a-z0-9]+$/i;

export default function proxy(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase().split(":")[0];
  if (OLD_HOSTS.has(host)) {
    return new NextResponse(
      "410 Gone — Este dominio ya no está en uso. / This domain is no longer in use.",
      {
        status: 410,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=86400",
          "X-Robots-Tag": "noindex, nofollow",
        },
      },
    );
  }

  // /admin/*, /descarga* y /cuenta/* — rutas con su propio layout
  // <html>+<body>, no necesitan rewrite locale. Auth gestionado en cliente.
  const path = req.nextUrl.pathname;
  if (
    INTL_EXCLUDED_PREFIXES.some((p) => path.startsWith(p)) ||
    ES_FICHERO_RE.test(path)
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/:path*"],
};

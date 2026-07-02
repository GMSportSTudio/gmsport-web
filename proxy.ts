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
const INTL_EXCLUDED_PREFIXES = [
  "/api",
  "/_next",
  "/admin",
  "/descarga",
  "/cuenta",
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
const STATIC_FILE_RE = /\.(?:png|jpg|jpeg|gif|svg|ico|mp4|webm|webp|woff|woff2|ttf|otf|eot)/i;

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
    STATIC_FILE_RE.test(path)
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/:path*"],
};

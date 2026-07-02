import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 410 Gone para el dominio viejo (rebrand → Inbound Studio).
 *
 * Contexto legal (2026-07): el burofax + email de GM SCOUT (01/07/2026)
 * reclama que la web seguía apareciendo al buscar "GM SPORT" en Google.
 * Causa: el redirect 308 por host (next.config.ts) transfería TODAS las
 * señales del dominio viejo a inboundbasketballstudio.com, manteniendo la
 * asociación de marca en el índice de Google.
 *
 * Con 410 Gone, Google elimina las URLs del dominio viejo de su índice
 * (más rápido que un 404) y la asociación con la marca antigua se
 * desvanece. El body NO menciona la marca nueva a propósito — mencionarla
 * perpetuaría la asociación que queremos romper.
 *
 * El dominio se mantiene en propiedad (no dejar caducar: un tercero
 * podría capturarlo). Solo deja de servir contenido.
 */
const OLD_HOSTS = new Set(["gmsportstudio.com", "www.gmsportstudio.com"]);

export function middleware(req: NextRequest) {
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
  return NextResponse.next();
}

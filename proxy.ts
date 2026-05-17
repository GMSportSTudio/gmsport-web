import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function proxy(req: NextRequest) {
  // /admin/*, /descarga* y /cuenta/* — rutas con su propio layout
  // <html>+<body>, no necesitan rewrite locale. Auth gestionado en cliente.
  const path = req.nextUrl.pathname;
  if (
    path.startsWith("/admin") ||
    path.startsWith("/descarga") ||
    path.startsWith("/cuenta")
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next|opengraph-image|icon|apple-icon|favicon\\.ico|sitemap\\.xml|robots\\.txt|aviso-legal|privacidad|terminos-beta|cookies|admin|descarga|cuenta|.*\\.(?:png|jpg|jpeg|gif|svg|ico|mp4|webm|webp|woff|woff2|ttf|otf|eot)).*)",
  ],
};

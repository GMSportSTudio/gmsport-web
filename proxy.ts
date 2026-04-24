import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function proxy(req: NextRequest) {
  // /admin/* y /descarga — pasar directamente, auth gestionado en cliente
  if (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/descarga")) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next|opengraph-image|icon|apple-icon|favicon\\.ico|sitemap\\.xml|robots\\.txt|aviso-legal|privacidad|terminos-beta|cookies|admin|descarga|.*\\.(?:png|jpg|jpeg|gif|svg|ico|mp4|webm|webp|woff|woff2|ttf|otf|eot)).*)",
  ],
};

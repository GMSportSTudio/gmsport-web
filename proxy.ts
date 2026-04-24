import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function proxy(req: NextRequest) {
  // Protect /admin/* — client-side auth handles the real check; cookie is a soft gate
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const session = req.cookies.get("gms_session")?.value;
    if (!session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next|opengraph-image|icon|apple-icon|favicon\\.ico|sitemap\\.xml|robots\\.txt|aviso-legal|privacidad|terminos-beta|cookies|descarga|.*\\.(?:png|jpg|jpeg|gif|svg|ico|mp4|webm|webp|woff|woff2|ttf|otf|eot)).*)",
  ],
};

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - /api/* (API routes)
     * - /_next/* (Next.js internals)
     * - /opengraph-image* (OG image route)
     * - /icon, /apple-icon (favicons dinámicos desde app/icon.tsx + app/apple-icon.tsx)
     * - /favicon.ico
     * - /sitemap.xml, /robots.txt
     * - /aviso-legal, /privacidad, /terminos-beta, /cookies (ES-only legal pages)
     * - Static files (png, jpg, svg, mp4, webp, woff, woff2, etc.)
     */
    "/((?!api|_next|opengraph-image|icon|apple-icon|favicon\\.ico|sitemap\\.xml|robots\\.txt|aviso-legal|privacidad|terminos-beta|cookies|.*\\.(?:png|jpg|jpeg|gif|svg|ico|mp4|webm|webp|woff|woff2|ttf|otf|eot)).*)",
  ],
};

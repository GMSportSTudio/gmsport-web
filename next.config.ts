import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Rebrand 2026-06: el dominio viejo gmsportstudio.com sigue servido por
      // el proyecto Vercel antiguo, que despliega ESTE mismo repo. Un redirect
      // por host manda cualquier visita del dominio viejo a la marca nueva
      // (308 permanente, conservando la ruta). No afecta a inboundbasketballstudio.com.
      {
        source: "/:path*",
        has: [{ type: "host", value: "gmsportstudio.com" }],
        destination: "https://www.inboundbasketballstudio.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.gmsportstudio.com" }],
        destination: "https://www.inboundbasketballstudio.com/:path*",
        permanent: true,
      },
      { source: "/terminos-beta", destination: "/", permanent: true },
      { source: "/pt", destination: "/", permanent: true },
      { source: "/pt/:path*", destination: "/:path*", permanent: true },
      // Canary archivado en 1.3.0 (2026-05-18): el motor ffpyplayer
      // validado en 28 iteraciones canary pasó a ser el stable. Solo
      // queda una línea de producto.
      { source: "/descarga-canary", destination: "/descarga", permanent: true },
      { source: "/descarga-canary/:path*", destination: "/descarga", permanent: true },
    ];
  },
};

// Sentry. Si no hay env vars de upload de source maps, el wrapper se
// reduce a inyectar las opciones base — el build sigue funcionando.
const sentryWebpackOptions = {
  org: process.env.SENTRY_ORG || "gmsportstudio",
  project: process.env.SENTRY_PROJECT || "gmsport-web",
  silent: !process.env.CI,
  // Solo subir source maps si hay token (en Vercel CI).
  // En dev local los source maps no se suben.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Reducir tamaño del bundle ocultando logger de Sentry en producción.
  disableLogger: true,
  tunnelRoute: "/monitoring-tunnel",  // ad-blockers no bloquean este path
};

export default withSentryConfig(withNextIntl(nextConfig), sentryWebpackOptions);

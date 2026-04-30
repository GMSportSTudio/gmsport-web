import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/terminos-beta", destination: "/", permanent: true },
      { source: "/pt", destination: "/", permanent: true },
      { source: "/pt/:path*", destination: "/:path*", permanent: true },
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

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 12),
    tracesSampleRate: 0.05,
    sendDefaultPii: false,
    // Capturar interacciones de usuario que terminan en error (clicks que
    // disparan callbacks fallidos). Volumen pequeño y útil para debug.
    replaysOnErrorSampleRate: 0.1,
    replaysSessionSampleRate: 0,  // sesiones completas: no — caro y ruidoso
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

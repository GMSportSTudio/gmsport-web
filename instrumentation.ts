import * as Sentry from "@sentry/nextjs";

export async function register() {
  // Solo activar Sentry si hay DSN configurado en Vercel.
  // Permite trabajar local sin enviar eventos.
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn,
      environment: process.env.VERCEL_ENV || "development",
      release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12),
      tracesSampleRate: 0.05,
      sendDefaultPii: false,
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn,
      environment: process.env.VERCEL_ENV || "development",
      release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12),
      tracesSampleRate: 0.05,
      sendDefaultPii: false,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;

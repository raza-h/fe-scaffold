import * as Sentry from "@sentry/nextjs";

const SENTRY_ENABLED = false;

export function initSentry() {
  if (!SENTRY_ENABLED) {
    return;
  }

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: process.env.NODE_ENV,
    enabled: SENTRY_ENABLED,
  });
}

export function captureException(error: Error, context?: Record<string, unknown>) {
  if (!SENTRY_ENABLED) {
    console.error("Sentry disabled - Error:", error, context);
    return;
  }

  Sentry.captureException(error, { extra: context });
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = "info") {
  if (!SENTRY_ENABLED) {
    console.log(`Sentry disabled - ${level}:`, message);
    return;
  }

  Sentry.captureMessage(message, level);
}

export function setUser(user: { id: string; email?: string; username?: string } | null) {
  if (!SENTRY_ENABLED) {
    return;
  }

  Sentry.setUser(user);
}


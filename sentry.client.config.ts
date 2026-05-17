/**
 * Sentry initialization for the client-side.
 * Install: npm i @sentry/nextjs
 *
 * This file is loaded by Next.js automatically when Sentry is configured.
 * See: https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,

  // Session replay for debugging
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Environment
  environment: process.env.NODE_ENV || "development",

  // Don't send in development unless DSN is explicitly set
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Filter out noisy errors
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    "Non-Error promise rejection captured",
  ],
});

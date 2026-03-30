"use client";

import { useEffect } from "react";

const HYDRATION_PATTERNS = [
  "hydration",
  "did not match",
  "server rendered html",
  "text content does not match",
  "there was an error while hydrating",
];

export function HydrationErrorLogger() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const originalError = window.console.error;

    window.console.error = (...args: unknown[]) => {
      const text = args.map((arg) => String(arg)).join(" ").toLowerCase();
      const isHydrationError = HYDRATION_PATTERNS.some((pattern) => text.includes(pattern));

      if (isHydrationError) {
        window.console.group("[Hydration Debug]");
        window.console.error(...args);
        window.console.info("route", window.location.pathname + window.location.search + window.location.hash);
        window.console.info("time", new Date().toISOString());
        window.console.groupEnd();
      }

      originalError(...args);
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      window.console.error("[Unhandled Rejection]", event.reason);
    };

    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.console.error = originalError;
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}

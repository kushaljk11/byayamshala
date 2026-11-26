"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * Hydration-safe "reduce motion" preference. The server snapshot is `false`,
 * so the first client render matches the static HTML; the real preference is
 * applied immediately after (avoids React hydration error #418 for people who
 * have reduced motion turned on). Use this instead of Motion's useReducedMotion
 * whenever the value changes what is rendered.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

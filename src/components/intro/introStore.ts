"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny shared state: is the opening intro still covering the page?
 * An inline script in the root layout sets <html data-intro="play"> before the
 * page paints when the intro should run (home page, first visit this session,
 * motion allowed). Everything else treats the intro as already done.
 */
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const isPending = () => document.documentElement.dataset.intro === "play";

/** Mark the intro finished (or skipped): reveals the hero/header entrances. */
export function finishIntro() {
  if (!isPending()) return;
  document.documentElement.dataset.intro = "done";
  listeners.forEach((cb) => cb());
}

/**
 * True once the page may play its entrance animations.
 * Server snapshot is `false`, so entrance states are identical in the HTML and
 * on hydration; the real value applies immediately after.
 */
export function useIntroDone() {
  return useSyncExternalStore(
    subscribe,
    () => !isPending(),
    () => false,
  );
}

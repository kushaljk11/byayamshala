"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * App-wide motion setup:
 * - Motion respects the OS "reduce motion" setting (transforms are skipped).
 * - Lenis adds inertial smooth scrolling + smooth anchor jumps, but is turned
 *   off entirely for reduced-motion users.
 */
export function Providers({ children }: { children: ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      {reduceMotion ? (
        children
      ) : (
        <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -80 } }}>
          {children}
        </ReactLenis>
      )}
    </MotionConfig>
  );
}

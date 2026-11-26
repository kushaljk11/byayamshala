"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useState, type RefObject } from "react";

/**
 * A step counter that only ticks while `ref` is on screen and motion is allowed.
 * Returns the current step (0..steps-1) and whether the loop is live.
 */
export function useLoop(ref: RefObject<Element | null>, steps: number, intervalMs: number) {
  const inView = useInView(ref, { amount: 0.25 });
  const reduceMotion = useReducedMotion();
  const live = inView && !reduceMotion;
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % steps), intervalMs);
    return () => window.clearInterval(id);
  }, [live, steps, intervalMs]);

  return { step, live, reduceMotion: Boolean(reduceMotion) };
}

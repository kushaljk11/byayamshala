"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE_OUT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function parse(value: string) {
  const match = value.match(/^(d[d,]*(?:.d+)?)(.*)$/);
  if (!match) return null;
  const raw = match[1];
  const suffix = match[2];
  const target = Number(raw.replace(/,/g, ""));
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  const padded = /^0d/.test(raw); // keep zero-padding like "06"
  const grouped = raw.includes(",");
  return {
    target,
    format: (n: number) => {
      if (padded)
        return String(Math.round(n)).padStart(raw.length, "0") + suffix;
      const text = grouped
        ? Math.round(n).toLocaleString("en-US")
        : n.toFixed(decimals);
      return text + suffix;
    },
  };
}

/**
 * Counts from 0 to the numeric part of `value` when scrolled into view,
 * keeping any zero-padding and suffix (e.g. "06", "200+"). Frames are written
 * straight to the DOM, so no React re-render per tick.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduceMotion = usePrefersReducedMotion();
  const parsed = parse(value);
  const animated = Boolean(parsed) && !reduceMotion;

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node || !parsed || reduceMotion) return;
    const controls = animate(0, parsed.target, {
      duration: 1.8,
      ease: EASE_OUT,
      onUpdate: (n) => {
        node.textContent = parsed.format(n);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion, value]);

  return (
    <span aria-label={value}>
      <span ref={ref} aria-hidden>
        {animated && parsed ? parsed.format(0) : value}
      </span>
    </span>
  );
}

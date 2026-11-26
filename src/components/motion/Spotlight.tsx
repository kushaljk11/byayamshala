"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Cursor spotlight for a card: a soft brand-blue glow on the surface and a
 * brighter highlight on the border, both following the pointer.
 * Drop it inside a `relative group` card; it listens on its parent element.
 * Hidden on touch screens (hover: none). Purely decorative.
 */
export function Spotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      host.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
      host.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
    };
    host.addEventListener("pointermove", move);
    return () => host.removeEventListener("pointermove", move);
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [@media(hover:none)]:hidden",
        className,
      )}
    >
      {/* Surface glow */}
      <span className="absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 [background:radial-gradient(420px_circle_at_var(--spot-x,50%)_var(--spot-y,0%),rgb(1_158_225/0.13),transparent_65%)] group-hover:opacity-100" />
      {/* Border highlight (1.5px ring masked out of the same gradient) */}
      <span className="absolute inset-0 rounded-[inherit] p-[1.5px] opacity-0 transition-opacity duration-500 [background:radial-gradient(300px_circle_at_var(--spot-x,50%)_var(--spot-y,0%),rgb(1_158_225/1),transparent_70%)] [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)] group-hover:opacity-100" />
    </span>
  );
}

/**
 * A light that travels slowly around a card's border (the "Most popular" plan).
 * Stops for reduced-motion users, leaving a static brand ring.
 */
export function BorderBeam({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "border-beam pointer-events-none absolute inset-0 rounded-[inherit] p-[2px] [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]",
        className,
      )}
    />
  );
}

"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Oversized line of type that pins to the screen while the visitor scrolls
 * and glides sideways until the whole sentence has been read, then releases.
 * The extra scroll length equals the distance the text travels, so the pace
 * feels the same on every screen size. Text after " — " gets the accent colour.
 */
export function ScrollTextBand({ text }: { text: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  // How far (px) the line must travel so its last word reaches the right edge.
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    const line = textRef.current;
    if (!viewport || !line) return;
    const measure = () => setDistance(Math.max(0, line.scrollWidth - viewport.clientWidth));
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(line);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // Short hold at each end so the first and last words register before/after moving.
  const x = useTransform(scrollYProgress, [0.08, 0.92], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0.08, 0.92], [0, 1]);

  const [lead, accent] = text.split(" — ");
  const line = (
    <>
      {lead}
      {accent && (
        <>
          <span className="text-[#c9ced6]"> — </span>
          <span className="text-primary">{accent}</span>
        </>
      )}
    </>
  );

  if (reduceMotion) {
    return (
      <div aria-hidden className="py-14 md:py-20">
        <p className="mx-auto max-w-site px-4 text-center text-[clamp(2.5rem,1.5rem+4vw,5.5rem)] font-semibold leading-[1.05] tracking-[-0.04em] sm:px-6 lg:px-10">
          {line}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      aria-hidden
      // 100vh of pinned stage + the horizontal travel, converted to vertical scroll.
      style={{ height: `calc(100svh + ${distance}px)` }}
      className="relative"
    >
      <div
        ref={viewportRef}
        className="sticky top-0 flex h-svh items-center overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]"
      >
        <motion.p
          ref={textRef}
          style={{ x }}
          className={cn(
            "whitespace-nowrap px-4 text-[clamp(5rem,3rem+9vw,13rem)] font-semibold leading-none tracking-[-0.045em] text-foreground will-change-transform sm:px-6 lg:px-10 2xl:px-[100px]",
          )}
        >
          {line}
        </motion.p>

        {/* Reading progress — hints that scrolling moves the line */}
        <div className="absolute bottom-[14%] left-1/2 h-[3px] w-28 -translate-x-1/2 overflow-hidden rounded-full bg-border md:w-40">
          <motion.div
            style={{ scaleX: progress }}
            className="h-full origin-left rounded-full bg-primary"
          />
        </div>
      </div>
    </div>
  );
}

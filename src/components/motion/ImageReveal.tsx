"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Cinematic image reveal: a curtain wipe (bottom → top) as the frame enters the
 * viewport, the image settles from a slight zoom, then keeps a gentle parallax
 * inside its frame while the page scrolls. Children should fill the box
 * (e.g. a `fill` next/image). Static for reduced-motion users.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  if (reduceMotion) {
    return (
      <div ref={ref} className={cn("relative overflow-hidden", className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.3, ease: [0.77, 0, 0.18, 1], delay }}
    >
      {/* Oversized layer so the parallax never shows an edge */}
      <motion.div style={{ y }} className="absolute -inset-y-[6%] inset-x-0">
        <motion.div
          className="relative size-full"
          initial={{ scale: 1.22 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

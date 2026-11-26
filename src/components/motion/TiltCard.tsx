"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };
const MAX_TILT = 9; // degrees

/**
 * 3D tilt toward the cursor with a soft light glare that follows it.
 * Mouse/trackpad only — touch and reduced-motion users get a still card.
 */
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Pointer position, 0..1 across the card
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const glare = useMotionValue(0);

  const rotateY = useSpring(
    useTransform(px, [0, 1], [-MAX_TILT, MAX_TILT]),
    SPRING,
  );
  const rotateX = useSpring(
    useTransform(py, [0, 1], [MAX_TILT, -MAX_TILT]),
    SPRING,
  );
  const glareOpacity = useSpring(glare, SPRING);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgb(255 255 255 / 0.42), transparent 55%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    glare.set(1);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    glare.set(0);
  };

  return (
    <div className="[perspective:900px]">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn("relative will-change-transform", className)}
      >
        {children}
        <motion.span
          aria-hidden
          style={{ opacity: glareOpacity, background: glareBg }}
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] mix-blend-soft-light"
        />
      </motion.div>
    </div>
  );
}

"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type WordRevealProps = {
  text: string;
  className?: string;
  as?: "h2" | "p";
};

/**
 * Scroll-linked reading effect: each word fills from a faint tone to full
 * colour as the heading moves up through the viewport.
 */
export function WordReveal({ text, className, as = "h2" }: WordRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "start 35%"],
  });
  const words = text.split(" ");
  const Tag = as;

  return (
    <Tag ref={ref} className={cn("relative", className)}>
      {/* Screen readers get the plain sentence once */}
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <Word
            key={`${word}-${i}`}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
          >
            {word}
          </Word>
        ))}
      </span>
    </Tag>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </>
  );
}

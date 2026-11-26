"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { BrandMark } from "@/components/ui";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PhoneFrame } from "../features/PhoneFrame";
import { useLoop } from "../features/useLoop";

/*
 * "Personalized Fitness" story (1.1 s per step, 15 steps):
 *   0–3   Tell us your goal   → a goal and level get picked
 *   4–6   Building your plan  → trainer matched, week balanced, targets set
 *   7–14  Your plan           → today's workout, exercises tick off, progress fills
 */
const GOALS = [
  "Lose weight",
  "Build strength",
  "Improve stamina",
  "Stay active",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const BUILD_STEPS = [
  "Matching your trainer",
  "Balancing your week",
  "Setting your targets",
];
const EXERCISES = [
  { name: "Bench Press", detail: "4 × 8 · 40 kg" },
  { name: "Bent-over Row", detail: "4 × 10 · 30 kg" },
  { name: "Shoulder Press", detail: "3 × 12 · 14 kg" },
];
const WEEK = ["M", "T", "W", "T", "F", "S", "S"];
const TRAINING_DAYS = [0, 1, 3, 4]; // Mon, Tue, Thu, Fri

const screen = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.5, ease: EASE_OUT },
};

export function PlanVisual({ active = true }: { active?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const loop = useLoop(ref, 15, 1100);
  // Paused (and shown on its finished "plan" screen) when not the active step.
  const step = loop.reduceMotion || !active ? 14 : loop.step;
  const phase = step < 4 ? "goal" : step < 7 ? "build" : "plan";

  return (
    <div ref={ref} className="text-left text-foreground">
      <PhoneFrame>
        <div className="px-4 pt-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[15px] font-bold tracking-[-0.01em]">
              <BrandMark className="w-5" />
              Byayamshala
            </span>
            <span className="relative flex size-8 items-center justify-center rounded-full bg-white shadow-sm">
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0" />
              </svg>
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {phase === "goal" && (
              <motion.div key="goal" {...screen} className="mt-4">
                <p className="text-[11px] font-semibold text-primary">
                  Step 1 of 2
                </p>
                <h4 className="mt-1 text-[19px] font-bold leading-tight tracking-[-0.02em]">
                  What&apos;s your main goal?
                </h4>
                <div className="mt-3 space-y-2">
                  {GOALS.map((g, i) => {
                    const selected = step >= 1 && i === 1;
                    return (
                      <motion.div
                        key={g}
                        animate={{ scale: selected ? 1.02 : 1 }}
                        className={cn(
                          "flex items-center justify-between rounded-xl border-2 bg-white px-3 py-2.5 text-[12.5px] font-semibold transition-colors duration-300",
                          selected
                            ? "border-primary text-foreground"
                            : "border-transparent text-foreground/70",
                        )}
                      >
                        {g}
                        <span
                          className={cn(
                            "flex size-4 items-center justify-center rounded-full border-2 transition-colors",
                            selected
                              ? "border-primary bg-primary"
                              : "border-[#d7dde5]",
                          )}
                        >
                          {selected && (
                            <span className="size-1.5 rounded-full bg-white" />
                          )}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
                <p className="mt-4 text-[11px] font-semibold text-muted-foreground">
                  Your level
                </p>
                <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                  {LEVELS.map((l, i) => (
                    <span
                      key={l}
                      className={cn(
                        "rounded-lg py-2 text-center text-[10.5px] font-semibold transition-colors duration-300",
                        step >= 2 && i === 1
                          ? "bg-primary text-white"
                          : "bg-white text-foreground/70",
                      )}
                    >
                      {l}
                    </span>
                  ))}
                </div>
                <motion.div
                  animate={{
                    scale: step === 3 ? 0.96 : 1,
                    opacity: step >= 2 ? 1 : 0.45,
                  }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 rounded-full bg-foreground py-3 text-center text-[12.5px] font-semibold text-white"
                >
                  Create my plan
                </motion.div>
              </motion.div>
            )}

            {phase === "build" && (
              <motion.div
                key="build"
                {...screen}
                className="mt-16 flex flex-col items-center text-center"
              >
                <div className="relative size-20">
                  <motion.svg
                    viewBox="0 0 80 80"
                    className="size-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="none"
                      stroke="#e5eaf0"
                      strokeWidth="6"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="60 200"
                    />
                  </motion.svg>
                  <BrandMark className="absolute left-1/2 top-1/2 w-7 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h4 className="mt-5 text-[17px] font-bold tracking-[-0.02em]">
                  Building your plan…
                </h4>
                <ul className="mt-4 w-full space-y-2">
                  {BUILD_STEPS.map((b, i) => {
                    const done = step - 4 >= i;
                    return (
                      <motion.li
                        key={b}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.3, duration: 0.4 }}
                        className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 text-[12px] font-semibold"
                      >
                        <span
                          className={cn(
                            "flex size-5 items-center justify-center rounded-full transition-colors duration-300",
                            done ? "bg-[#22c55e]" : "bg-[#e5eaf0]",
                          )}
                        >
                          <svg
                            viewBox="0 0 12 10"
                            className="h-2 w-2.5"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 5.2 4.3 8.5 11 1.5" />
                          </svg>
                        </span>
                        {b}
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            )}

            {phase === "plan" && (
              <motion.div key="plan" {...screen} className="mt-3">
                <p className="text-[11px] font-semibold text-muted-foreground">
                  Week 3 · Build strength
                </p>
                <h4 className="mt-0.5 text-[19px] font-bold tracking-[-0.02em]">
                  Your plan is ready
                </h4>

                {/* Week strip */}
                <div className="mt-3 grid grid-cols-7 gap-1 text-center">
                  {WEEK.map((d, i) => {
                    const training = TRAINING_DAYS.includes(i);
                    const today = i === 3;
                    return (
                      <span
                        key={i}
                        className={cn(
                          "rounded-lg py-1.5 text-[10px] font-semibold",
                          today
                            ? "bg-primary text-white"
                            : "bg-white text-foreground/70",
                        )}
                      >
                        {d}
                        <span
                          className={cn(
                            "mx-auto mt-1 block size-1 rounded-full",
                            training
                              ? today
                                ? "bg-white"
                                : "bg-primary"
                              : "bg-transparent",
                          )}
                        />
                      </span>
                    );
                  })}
                </div>

                {/* Today's workout */}
                <div className="mt-3 rounded-2xl bg-foreground p-3 text-white">
                  <div className="flex items-center justify-between">
                    <span>
                      <span className="block text-[10px] font-medium text-white/60">
                        Today&apos;s workout
                      </span>
                      <span className="block text-[14px] font-bold">
                        Upper Body Strength
                      </span>
                      <span className="block text-[10px] text-white/60">
                        45 min · Trainer guided
                      </span>
                    </span>
                    <motion.span
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="flex size-9 items-center justify-center rounded-full bg-primary"
                    >
                      <svg
                        viewBox="0 0 10 12"
                        className="ml-0.5 h-3 w-2.5"
                        fill="currentColor"
                      >
                        <path d="M0 0v12l10-6z" />
                      </svg>
                    </motion.span>
                  </div>
                </div>

                {/* Exercises */}
                <ul className="mt-2.5 space-y-1.5">
                  {EXERCISES.map((ex, i) => {
                    const done = step >= 8 + i * 2;
                    return (
                      <li
                        key={ex.name}
                        className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2"
                      >
                        <span
                          className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300",
                            done
                              ? "border-primary bg-primary"
                              : "border-[#d7dde5]",
                          )}
                        >
                          <svg
                            viewBox="0 0 12 10"
                            className="h-2 w-2.5"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <motion.path
                              d="M1 5.2 4.3 8.5 11 1.5"
                              initial={false}
                              animate={{ pathLength: done ? 1 : 0 }}
                              transition={{ duration: 0.35 }}
                            />
                          </svg>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block text-[12px] font-semibold transition-colors",
                              done &&
                                "text-muted-foreground line-through decoration-primary/60",
                            )}
                          >
                            {ex.name}
                          </span>
                          <span className="block text-[10px] text-muted-foreground">
                            {ex.detail}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {/* Trainer + progress */}
                <div className="mt-2.5 flex items-center gap-2.5 rounded-xl bg-white p-2.5">
                  <span className="relative size-9 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/images/expert-anup.png"
                      alt=""
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] text-muted-foreground">
                      Your trainer
                    </span>
                    <span className="block truncate text-[12px] font-semibold">
                      Anup Bikram Subedi
                    </span>
                  </span>
                  <ProgressRing value={step >= 13 ? 9 : 8} total={10} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PhoneFrame>
    </div>
  );
}

function ProgressRing({ value, total }: { value: number; total: number }) {
  const R = 15;
  const C = 2 * Math.PI * R;
  return (
    <span className="relative size-10 shrink-0">
      <svg viewBox="0 0 40 40" className="size-full -rotate-90">
        <circle
          cx="20"
          cy="20"
          r={R}
          fill="none"
          stroke="#e5eaf0"
          strokeWidth="4"
        />
        <motion.circle
          cx="20"
          cy="20"
          r={R}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={false}
          animate={{ strokeDashoffset: C * (1 - value / total) }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold tabular-nums">
        {value}/{total}
      </span>
    </span>
  );
}

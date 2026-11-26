"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { BrandMark } from "@/components/ui";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PhoneFrame } from "./PhoneFrame";
import { useLoop } from "./useLoop";

const GOAL_KCAL = 2100;

const MEALS = [
  {
    name: "Breakfast",
    dish: "Oats with Fruits",
    kcal: 420,
    protein: 18,
    carbs: 64,
    fat: 11,
    tone: "from-[#fde68a] to-[#f59e0b]",
    icon: "sun",
  },
  {
    name: "Lunch",
    dish: "Grilled Chicken with Rice",
    kcal: 610,
    protein: 46,
    carbs: 72,
    fat: 14,
    tone: "from-[#bbf7d0] to-[#22c55e]",
    icon: "bowl",
  },
  {
    name: "Dinner",
    dish: "Paneer Salad Bowl",
    kcal: 420,
    protein: 28,
    carbs: 22,
    fat: 23,
    tone: "from-[#c7d2fe] to-[#6366f1]",
    icon: "moon",
  },
] as const;

const MACROS = [
  { key: "protein", label: "Protein", goal: 120, color: "bg-primary" },
  { key: "carbs", label: "Carbs", goal: 250, color: "bg-[#22c55e]" },
  { key: "fat", label: "Fat", goal: 70, color: "bg-[#f59e0b]" },
] as const;

/** Loop script (1.2s per step): empty day → breakfast → lunch → dinner → hold. */
function mealsDone(step: number) {
  if (step < 1) return 0;
  if (step < 3) return 1;
  if (step < 5) return 2;
  return 3;
}

/**
 * Meal plan, animated: meals tick off one by one and the calorie ring, macro
 * bars and water tracker all follow — the numbers always add up.
 */
export function NutritionVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { step, reduceMotion } = useLoop(ref, 10, 1200);
  const done = reduceMotion ? 2 : mealsDone(step);
  const eaten = MEALS.slice(0, done);
  const kcal = eaten.reduce((s, m) => s + m.kcal, 0);
  const water = reduceMotion ? 6 : Math.min(2 + step, 7);

  const R = 34;
  const C = 2 * Math.PI * R;

  return (
    <div ref={ref} className="relative mx-auto w-[min(76%,300px)] text-left text-foreground">
      <PhoneFrame>
        <div className="px-4 pt-1">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[15px] font-bold tracking-[-0.01em]">
              <BrandMark className="w-5" />
              Byayamshala
            </span>
            <span className="flex size-8 items-center justify-center rounded-full bg-white shadow-sm">
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
              </svg>
            </span>
          </div>
          <h4 className="mt-3 text-[19px] font-bold tracking-[-0.02em]">
            My Meal Plan
          </h4>

          {/* Tabs */}
          <div className="mt-2.5 grid grid-cols-3 rounded-full bg-white p-1 text-center text-[11px] font-semibold shadow-sm">
            <span className="rounded-full bg-primary py-1.5 text-white">
              Today
            </span>
            <span className="py-1.5 text-muted-foreground">This Week</span>
            <span className="py-1.5 text-muted-foreground">Plan</span>
          </div>

          {/* Calories + macros */}
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
            <div className="relative size-[84px] shrink-0">
              <svg viewBox="0 0 80 80" className="size-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r={R}
                  fill="none"
                  stroke="#eef2f6"
                  strokeWidth="7"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r={R}
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  animate={{ strokeDashoffset: C * (1 - kcal / GOAL_KCAL) }}
                  transition={{ duration: 0.9, ease: EASE_OUT }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="relative h-[18px] overflow-hidden text-[15px] font-bold tabular-nums leading-[18px]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={kcal}
                      className="block"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-100%" }}
                      transition={{ duration: 0.45, ease: EASE_OUT }}
                    >
                      {kcal.toLocaleString("en-IN")}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="text-[8.5px] font-medium text-muted-foreground">
                  of {GOAL_KCAL.toLocaleString("en-IN")} kcal
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              {MACROS.map((m) => {
                const value = eaten.reduce((s, meal) => s + meal[m.key], 0);
                return (
                  <div key={m.key}>
                    <div className="flex justify-between text-[9.5px] font-semibold">
                      <span>{m.label}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {value}/{m.goal}g
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#eef2f6]">
                      <motion.div
                        className={cn("h-full rounded-full", m.color)}
                        animate={{
                          width: `${Math.min(100, (value / m.goal) * 100)}%`,
                        }}
                        transition={{ duration: 0.9, ease: EASE_OUT }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Meals */}
          <ul className="mt-3 space-y-2">
            {MEALS.map((meal, i) => {
              const isDone = i < done;
              const isNext = i === done;
              return (
                <motion.li
                  key={meal.name}
                  animate={{ scale: isNext ? 1.02 : 1 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                  className={cn(
                    "flex items-center gap-2.5 rounded-2xl bg-white p-2.5 shadow-sm ring-1 transition-colors duration-500",
                    isNext ? "ring-primary/40" : "ring-transparent",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white",
                      meal.tone,
                    )}
                  >
                    <MealIcon kind={meal.icon} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-bold">
                      {meal.name}
                    </span>
                    <span className="block truncate text-[10px] text-muted-foreground">
                      {meal.dish} · {meal.kcal} kcal
                    </span>
                  </span>
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300",
                      isDone
                        ? "border-primary bg-primary"
                        : "border-[#d7dde5] bg-white",
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
                        animate={{ pathLength: isDone ? 1 : 0 }}
                        transition={{
                          duration: 0.35,
                          ease: EASE_OUT,
                          delay: isDone ? 0.1 : 0,
                        }}
                      />
                    </svg>
                  </span>
                </motion.li>
              );
            })}
          </ul>

          {/* Water */}
          <div className="mt-3 rounded-2xl bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="flex items-center gap-1.5">
                <svg
                  viewBox="0 0 12 16"
                  className="h-3.5 w-3 text-primary"
                  fill="currentColor"
                >
                  <path d="M6 0S0 6.6 0 10.2A6 6 0 0 0 12 10.2C12 6.6 6 0 6 0Z" />
                </svg>
                Water
              </span>
              <span className="tabular-nums text-muted-foreground">
                {(water * 0.375).toFixed(1)} / 3 L
              </span>
            </div>
            <div className="mt-2 grid grid-cols-8 gap-1">
              {Array.from({ length: 8 }, (_, i) => (
                <span
                  key={i}
                  className="h-5 overflow-hidden rounded-md bg-[#eef2f6]"
                >
                  <motion.span
                    className="block h-full rounded-md bg-gradient-to-t from-primary to-[#5cc8f2]"
                    initial={false}
                    animate={{ y: i < water ? "0%" : "100%" }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </PhoneFrame>

      {/* Floating card: daily goal (desktop) */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.5 }}
        className="absolute left-[calc(100%-28px)] top-[20%] hidden w-[156px] rounded-2xl bg-white p-3.5 text-left shadow-[0_24px_50px_-20px_rgb(15_23_42/0.3)] xl:block"
      >
        <p className="text-[11px] font-medium text-muted-foreground">
          Daily goal
        </p>
        <p className="mt-0.5 text-sm font-semibold tabular-nums">
          {Math.round((kcal / GOAL_KCAL) * 100)}% complete
        </p>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${(kcal / GOAL_KCAL) * 100}%` }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          />
        </div>
      </motion.div>

      {/* Floating card: coach tip (desktop) */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.7 }}
        className="absolute right-[calc(100%-28px)] top-[62%] hidden w-[160px] rounded-2xl rounded-bl-md bg-white p-3 text-left shadow-[0_24px_50px_-20px_rgb(15_23_42/0.3)] xl:block"
      >
        <span className="block text-[10px] font-bold text-primary">
          Nutrition coach
        </span>
        <span className="mt-0.5 block text-[12px] font-medium leading-snug">
          Add a protein snack after today&apos;s workout.
        </span>
      </motion.div>
    </div>
  );
}

function MealIcon({ kind }: { kind: string }) {
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (kind === "sun")
    return (
      <svg viewBox="0 0 24 24" className="size-[18px]" {...p}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  if (kind === "bowl")
    return (
      <svg viewBox="0 0 24 24" className="size-[18px]" {...p}>
        <path d="M3 11h18a9 9 0 0 1-18 0Z" />
        <path d="M8 7c0-1.5 1-2.5 2-3M12 7c0-1.5 1-2.5 2-3M16 7c0-1.5 1-2.5 2-3" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" {...p}>
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

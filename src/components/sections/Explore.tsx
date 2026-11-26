"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useRef, useState, type ComponentType } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { LiveSessionVisual } from "./explore/LiveSessionVisual";
import { PlanVisual } from "./explore/PlanVisual";
import { FitScale } from "./features/FitScale";

type Step = {
  number: string;
  label: string;
  title: string;
  body: string;
  highlight: string;
  /** Three short proof points shown as a checklist under the step. */
  points: string[];
  Visual: ComponentType<{ active?: boolean }>;
};

const steps: Step[] = [
  {
    number: "01",
    label: "Personalized fitness",
    title: "Personal Training Designed Around Your Goals",
    body: "Start with a short goal check-in, then get a workout program and coaching built around your fitness level, lifestyle and goals.",
    highlight: "Train smarter with dedicated, professional guidance.",
    points: ["Goal and fitness-level assessment", "Workout plan updated as you progress", "Form checks from a certified coach"],
    Visual: PlanVisual,
  },
  {
    number: "02",
    label: "Live online coaching",
    title: "Real-Time Coaching, Wherever You Are",
    body: "Join interactive one-to-one or small-group workout sessions with professional trainers who guide, motivate and support your progress.",
    highlight: "Stay connected with your trainer from anywhere.",
    points: ["One-to-one or small-group video sessions", "Daily check-ins on WhatsApp", "Train from Nepal or abroad"],
    Visual: LiveSessionVisual,
  },
];

const stepId = (i: number) => `explore-step-${i + 1}`;

export function Explore() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: headingRef,
    offset: ["start end", "end start"],
  });
  // Light sweeps across the heading as it passes through the viewport.
  const backgroundPosition = useTransform(
    scrollYProgress,
    [0, 1],
    ["100% 0%", "0% 0%"],
  );

  // Which step is being read: switches when step 02 crosses the middle of the screen.
  const { scrollYProgress: stepsProgress } = useScroll({
    target: stepsRef,
    offset: ["start center", "end center"],
  });
  useMotionValueEvent(stepsProgress, "change", (v) =>
    setActive(v >= 0.5 ? 1 : 0),
  );

  return (
    <section
      id="explore"
      className="mt-20 scroll-mt-20 md:mt-28 2xl:mt-[140px]"
    >
      <div className="rounded-t-panel bg-black pb-[100px] pt-20 text-white md:pb-[160px] md:pt-32 2xl:pb-[200px] 2xl:pt-[200px]">
        <Container>
          <motion.h2
            ref={headingRef}
            style={{ backgroundPosition }}
            className="mx-auto max-w-[980px] bg-[linear-gradient(90deg,#4a4a4a_0%,#4a4a4a_30%,#fff_50%,#4a4a4a_70%,#4a4a4a_100%)] bg-[length:250%_100%] bg-clip-text text-center text-h2 font-semibold text-transparent"
          >
            Explore a More Complete Approach to Fitness, Designed Around Your
            Everyday Life.
          </motion.h2>

          <div
            ref={stepsRef}
            className="mt-12 grid gap-14 md:mt-20 lg:grid-cols-[minmax(0,749fr)_30px_minmax(0,749fr)] lg:gap-x-0 lg:gap-y-3 2xl:mt-[160px]"
          >
            {/* Desktop: one visual pinned on the left that follows the step being read */}
            <div className="hidden lg:row-span-2 lg:mt-[49px] lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ duration: 1.1, ease: EASE_OUT }}
                className="sticky top-28 w-[calc(100%-77px)] max-w-[672px]"
              >
                <VisualStage active={active} />
              </motion.div>
            </div>

            {steps.map((step, i) => (
              <StepRow key={step.number} step={step} index={i} />
            ))}
          </div>
        </Container>
      </div>
      {/* White rounded lip that overlaps the bottom of the dark panel */}
      <div className="relative -mt-5 h-9 rounded-t-panel bg-white" />
    </section>
  );
}

/**
 * Blue gradient tile holding the step visuals. The whole phone is always
 * visible and centred:
 * - desktop: inside a white card (as in Figma)
 * - phones: straight on the tile, so the device stays large enough to read
 */
function VisualStage({
  active,
  only,
}: {
  active: number;
  /** Render a single step's visual (mobile, inline per step). */
  only?: number;
}) {
  const shown = only === undefined ? steps : [steps[only]];
  return (
    <div className="relative isolate flex w-full items-center justify-center overflow-hidden rounded-panel py-8 lg:aspect-[672/814] lg:py-0">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/explore-bg.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="relative grid w-full place-items-center lg:aspect-[545/665] lg:w-[81.1%] lg:overflow-hidden lg:rounded-2xl lg:bg-white lg:shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]">
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-[radial-gradient(circle_at_50%_70%,rgb(1_158_225/0.14),transparent_60%)] lg:block"
        />
        {shown.map((s) => {
          const i = steps.indexOf(s);
          const isActive = only !== undefined || active === i;
          const { Visual } = s;
          return (
            <motion.div
              key={s.number}
              aria-hidden={!isActive}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                y: isActive ? 0 : 24,
                scale: isActive ? 1 : 0.97,
              }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className={cn(
                // Both visuals share one grid cell so they cross-fade in place
                "col-start-1 row-start-1 w-[60%] max-w-[280px] lg:w-[50%] lg:max-w-none",
                !isActive && "pointer-events-none",
              )}
            >
              {/* Designed at 280px wide, scaled uniformly to fit */}
              <FitScale width={280}>
                <Visual active={isActive} />
              </FitScale>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function StepRow({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const numberOpacity = useTransform(scrollYProgress, [0, 0.15], [0.45, 1]);

  return (
    <div
      ref={ref}
      id={stepId(index)}
      className="grid grid-cols-[30px_minmax(0,1fr)] gap-x-5 lg:col-span-2 lg:col-start-2 lg:min-h-[439px] lg:gap-x-[59px]"
    >
      {/* Phones/tablets: the step's own visual, full width above its text */}
      <Reveal y={30} className="col-span-2 mb-8 lg:hidden">
        <div className="mx-auto max-w-[460px]">
          <VisualStage active={index} only={index} />
        </div>
      </Reveal>

      {/* Timeline: the white fill tracks reading progress through the step */}
      <div className="flex flex-col items-center">
        <motion.span
          style={{ opacity: numberOpacity }}
          className="text-lg font-semibold leading-9 tabular-nums"
        >
          {step.number}
        </motion.span>
        <span className="relative mt-[11px] w-0.5 flex-1 overflow-hidden rounded-full bg-white/15">
          <motion.span
            style={{ height: fill }}
            className="absolute inset-x-0 top-0 rounded-full bg-white"
          />
        </span>
      </div>

      <div className="pb-6 pt-[7px] lg:pb-0 2xl:-mr-[23px]">
        <Reveal y={30}>
          <p className="text-sm font-medium text-primary">{step.label}</p>
          <h3 className="mt-2 text-h3 font-semibold">{step.title}</h3>
          <p className="mt-4 max-w-[640px] text-base leading-relaxed text-white/70 md:text-[17px]">
            {step.body}
          </p>
          <p className="mt-5 max-w-[340px] text-base font-semibold leading-snug md:text-lg">
            {step.highlight}
          </p>
          <ul className="mt-6 grid max-w-[640px] gap-3 sm:grid-cols-3">
            {step.points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 rounded-card bg-white/[0.06] px-4 py-3.5 text-sm leading-snug text-white/80 ring-1 ring-white/10"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 size-4 shrink-0 text-primary"
                >
                  <path d="m3 8.5 3.2 3L13 4.5" />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}

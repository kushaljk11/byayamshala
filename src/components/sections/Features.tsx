"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ComponentType } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Container, Heading } from "@/components/ui";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { LiveTrainingVisual } from "./features/LiveTrainingVisual";
import { NutritionVisual } from "./features/NutritionVisual";

type Feature = {
  title: string;
  body: string;
  titleWidth: string;
  bodyWidth: string;
  Visual: ComponentType;
};

const features: Feature[] = [
  {
    title: "Live Online Personal Training, Wherever You Are.",
    body: "Train from anywhere with expert-led live sessions and a personalized workout program designed for you.",
    titleWidth: "max-w-[420px]",
    bodyWidth: "max-w-[560px]",
    Visual: LiveTrainingVisual,
  },
  {
    title: "Personalized Nutrition That Fits Your Lifestyle",
    body: "Follow a meal plan made for you, built from familiar foods and adjusted with your coach as your routine changes.",
    titleWidth: "max-w-[440px]",
    bodyWidth: "max-w-[540px]",
    Visual: NutritionVisual,
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20">
      <Container>
        <Reveal>
          <Heading className="mx-auto max-w-[720px] text-center">
            Everything You Need to Reach Your Goals
          </Heading>
        </Reveal>

        <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-2 xl:mt-[72px] 2xl:gap-[53px] 2xl:px-[3px]">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeatureCard({ feature: f, index }: { feature: Feature; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The phone rises into the card as it scrolls through the viewport.
  const visualY = useTransform(scrollYProgress, [0, 0.55], [90, 0]);
  const { Visual } = f;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: index * 0.15 }}
      className="group relative isolate flex flex-col items-center overflow-hidden rounded-panel bg-surface px-6 pt-12 text-center transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgb(15_23_42/0.25)] xl:px-0 xl:pt-[72px]"
    >
      {/* Soft brand glow behind the device */}
      <div
        aria-hidden
        className="absolute bottom-[-20%] left-1/2 -z-10 aspect-square w-[85%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(1_158_225/0.16),transparent_65%)] transition-transform duration-1000 ease-out-expo group-hover:scale-110"
      />

      <Heading as="h3" className={cn("mx-auto", f.titleWidth)}>
        {f.title}
      </Heading>
      <p className={cn("mx-auto mt-3 text-lead text-muted-foreground", f.bodyWidth)}>{f.body}</p>

      {/* Device window — the card's bottom edge crops the phone */}
      <div className="relative mt-10 h-[440px] w-full sm:h-[500px] xl:mt-14 xl:h-[540px]">
        <motion.div style={{ y: visualY }} className="absolute inset-x-0 top-0">
          <Visual />
        </motion.div>
      </div>
    </motion.article>
  );
}

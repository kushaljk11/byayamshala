"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { Container, Heading } from "@/components/ui";
import { EASE_OUT } from "@/lib/motion";

/*
 * TODO: confirm each coach's name, role and certification with the gym.
 * "John Doe" is a placeholder name from the original design.
 */
const experts = [
  { name: "Mamta Prasai", role: "Managing Director & Coach", image: "/images/expert-mamta.png" },
  { name: "Anup Bikram Subedi", role: "Certified Personal Trainer", image: "/images/expert-anup.png" },
  { name: "Janak Kumar", role: "Certified Fitness Coach", image: "/images/expert-janak.png" },
  { name: "John Doe", role: "Strength & Conditioning Coach", image: "/images/expert-john.png" },
];

export function Experts() {
  return (
    <section id="experts" className="relative isolate mt-20 scroll-mt-20 overflow-hidden md:mt-28 2xl:mt-[140px]">
      <Image
        src="/images/pattern-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-10"
      />

      <Container className="py-12 md:py-[66px]">
        <Reveal>
          <Heading className="mx-auto max-w-[720px] text-center">
            Meet the Coaches Who Make Your Fitness Journey Personal
          </Heading>
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:mt-[60px] lg:grid-cols-4 lg:gap-y-0">
          {experts.map((expert, i) => (
            <motion.li
              key={expert.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: i * 0.12 }}
              className="group relative lg:pt-[21px]"
            >
              {/* Vertical divider centred in the 20px gap; draws downward on reveal */}
              {i > 0 && (
                <motion.span
                  aria-hidden
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.2 + i * 0.12 }}
                  className="absolute -left-[10.5px] top-0 hidden h-full w-px origin-top bg-border lg:block"
                />
              )}
              <TiltCard className="rounded-card shadow-[0_24px_50px_-30px_rgb(15_23_42/0.45)] transition-shadow duration-500 group-hover:shadow-[0_34px_60px_-28px_rgb(15_23_42/0.55)]">
                <div className="relative aspect-[367/440] overflow-hidden rounded-card">
                  <Image
                    src={expert.image}
                    alt={`${expert.name}, ${expert.role} at Byayamshala`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
                  />
                </div>
              </TiltCard>
              <h3 className="mt-4 text-base font-semibold sm:mt-5 sm:text-h4">{expert.name}</h3>
              <p className="mt-1 text-[13px] text-muted-foreground sm:text-[15px]">{expert.role}</p>
            </motion.li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

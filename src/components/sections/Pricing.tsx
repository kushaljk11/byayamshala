"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { BorderBeam, Spotlight } from "@/components/motion/Spotlight";
import { ArrowIcon, buttonClasses, Container, Heading } from "@/components/ui";
import { whatsappLink } from "@/constants/site";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "yearly";

/** Yearly billing discount (shown as "Save 20%"). */
const YEARLY_DISCOUNT = 0.2;

/*
 * TODO: confirm prices and what each plan includes with the gym before launch.
 * Every plan shows the same feature list; `includes` is how many rows (from the top) it covers.
 */
const plans = [
  { name: "Starter", blurb: "For members who train on their own.", monthly: 20000, includes: 3 },
  { name: "Standard", blurb: "A coach-built plan and regular check-ins.", monthly: 30000, includes: 6, popular: true },
  { name: "Premium", blurb: "Full 1-on-1 coaching and nutrition.", monthly: 40000, includes: 8 },
];

const features = [
  "Gym floor access, Sun – Fri, 5 AM – 9 PM",
  "Group workout classes",
  "Fitness assessment when you join",
  "Personalized workout plan",
  "Monthly progress check-in",
  "Nutrition guidance & meal plan",
  "1-on-1 personal training sessions",
  "Daily coach support on WhatsApp",
];

const npr = (amount: number) =>
  `NPR ${Math.round(amount).toLocaleString("en-IN")}`;

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const yearly = billing === "yearly";

  return (
    <section
      id="pricing"
      className="relative isolate mt-10 scroll-mt-20 overflow-hidden md:mt-[60px]"
    >
      <Image
        src="/images/pattern-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-10"
      />

      <Container className="pb-16 pt-12 md:pb-[100px] md:pt-[65px]">
        <Reveal>
          <Heading className="mx-auto max-w-[700px] text-center">
            Simple Membership Plans, No Hidden Fees
          </Heading>
          <p className="mx-auto mt-3 max-w-[560px] text-center text-lead text-muted-foreground">
            Pick the level of coaching you want. Switch or cancel any month.
          </p>
        </Reveal>

        {/* Billing toggle */}
        <Reveal
          delay={0.1}
          className="mt-7 flex items-center justify-center gap-3.5 text-base md:text-lg"
        >
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={cn(
              "px-1 py-2 transition-colors",
              yearly ? "text-subtle" : "font-medium text-foreground",
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            aria-label="Bill yearly"
            onClick={() => setBilling(yearly ? "monthly" : "yearly")}
            className={cn(
              "relative flex h-9 w-[72px] shrink-0 items-center rounded-full border-2 border-foreground p-[3px] transition-colors duration-300",
              yearly ? "justify-end bg-foreground" : "justify-start",
            )}
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
              className={cn(
                "size-[26px] rounded-full",
                yearly ? "bg-white" : "bg-foreground",
              )}
            />
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={cn(
              "flex items-center gap-2 px-1 py-2 transition-colors",
              yearly ? "font-medium text-foreground" : "text-subtle",
            )}
          >
            Yearly
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              Save {YEARLY_DISCOUNT * 100}%
            </span>
          </button>
        </Reveal>

        <RevealGroup
          stagger={0.12}
          // Phones: swipeable cards with a peek of the next plan; tablet+: grid
          className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-3 sm:-mx-6 sm:px-6 md:mx-0 md:mt-[60px] md:grid md:grid-cols-2 md:gap-7 md:overflow-visible md:px-0 md:py-0 lg:grid-cols-3"
        >
          {plans.map((plan) => {
            const perMonth = yearly
              ? plan.monthly * (1 - YEARLY_DISCOUNT)
              : plan.monthly;
            return (
              <RevealItem
                as="article"
                key={plan.name}
                className="group relative isolate w-[84%] shrink-0 snap-center rounded-card bg-white pb-9 shadow-[0_2px_20px_0_rgba(0,0,0,0.04)] transition-[box-shadow,transform] duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-28px_rgb(15_23_42/0.28)] sm:w-[62%] md:w-auto"
              >
                {/* Cursor spotlight; the popular plan also gets a travelling border light */}
                <Spotlight className="-z-10" />
                {plan.popular && <BorderBeam />}
                <div className="px-6 pb-7 pt-8 xl:px-9 xl:pt-9">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    {plan.popular && (
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                        Most popular
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[15px] text-muted-foreground">{plan.blurb}</p>
                  <p className="relative mt-4 h-10 overflow-hidden text-[28px] font-semibold tracking-[-0.02em] tabular-nums xl:text-[30px]">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={billing}
                        className="block"
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE_OUT }}
                      >
                        {npr(perMonth)}
                      </motion.span>
                    </AnimatePresence>
                  </p>
                  <p className="text-base text-subtle">
                    per month
                    <span
                      className={cn(
                        "block text-sm transition-opacity duration-300",
                        yearly ? "opacity-100" : "opacity-0",
                      )}
                      aria-hidden={!yearly}
                    >
                      Billed yearly · {npr(perMonth * 12)}
                    </span>
                  </p>
                </div>

                <hr className="border-divider" />

                <div className="px-6 pt-7 xl:px-9 xl:pt-8">
                  <a
                    href={whatsappLink(
                      `Hi Byayamshala! I'd like to join the ${plan.name} plan (${billing}).`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonClasses("primary", "lg", "w-full"),
                      !plan.popular &&
                        "bg-foreground shadow-none hover:bg-black hover:shadow-[0_14px_30px_-14px_rgb(0_0_0/0.6)]",
                    )}
                  >
                    Join {plan.name}
                    <ArrowIcon />
                  </a>

                  <ul className="mt-8 space-y-4">
                    {features.map((label, i) => {
                      const included = i < plan.includes;
                      return (
                      <li
                        key={label}
                        className={cn(
                          "flex items-center gap-3 text-[15px] text-foreground/80 md:text-base",
                          !included && "opacity-30",
                        )}
                      >
                        <Image
                          src="/icons/check.svg"
                          alt=""
                          width={30}
                          height={33.3265}
                          className="h-[26px] w-[23.4px] shrink-0"
                        />
                        <span>
                          {label}
                          {!included && (
                            <span className="sr-only"> (not included)</span>
                          )}
                        </span>
                      </li>
                      );
                    })}
                  </ul>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}

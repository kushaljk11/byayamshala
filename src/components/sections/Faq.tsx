"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ArrowIcon, buttonClasses, Container, Heading } from "@/components/ui";
import { siteConfig, whatsappLink } from "@/constants/site";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What is Byayamshala, and how does it work?",
    answer:
      "Byayamshala is a fitness center in Itahari that combines in-person training, live online coaching and nutrition guidance. You tell us your goal, we match you with a coach and a program, and we track your progress with you every week.",
  },
  {
    question: "Where is the gym, and when is it open?",
    answer:
      "We're on the 2nd & 3rd floor of the Blue Glass Building, B.P. Chowk, Itahari. The gym floor is open Sunday to Friday, 5:00 AM to 9:00 PM.",
  },
  {
    question: "How does live online personal training work?",
    answer:
      "You train with a certified coach over a live video call, one-to-one or in a small group. Your coach corrects your form in real time, adjusts your plan as you improve and checks in with you on WhatsApp between sessions.",
  },
  {
    question: "Can I join Byayamshala if I'm a complete beginner?",
    answer:
      "Absolutely. Every program starts with an assessment of your current fitness level, so your workouts match where you are today and progress safely from there.",
  },
  {
    question: "Does Byayamshala provide personalized nutrition plans?",
    answer:
      "Yes. Our coaches build meal plans around your goals, your schedule and the foods you already eat, then adjust them with you as your routine changes.",
  },
  {
    question: "Can I train with Byayamshala while living abroad?",
    answer:
      "Yes. Online coaching, workouts and nutrition guidance are all delivered remotely, so you can train with your Byayamshala coach from any country.",
  },
];

/** schema.org FAQPage so search engines can show these answers directly in results. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="faq" className="scroll-mt-20 pt-20 md:pt-28 2xl:pt-[140px]">
      <script
        type="application/ld+json"
        // Static data defined above — no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,593fr)_minmax(0,811fr)] lg:gap-x-16 2xl:gap-x-[122px] 2xl:pl-[102px]">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <Heading className="text-black">Frequently Asked Questions</Heading>
          <p className="mt-3 max-w-[520px] text-lead text-muted-foreground">
            Everything you need to know before your first session. Can&apos;t find your
            answer? Message a coach directly.
          </p>

          <div className="mt-8 max-w-[520px] rounded-panel bg-surface p-6 md:p-7">
            <p className="text-h4 font-semibold">Still have questions?</p>
            <p className="mt-1.5 text-[15px] text-muted-foreground">
              Our team usually replies within a few hours.
            </p>
            <dl className="mt-5 grid gap-4 text-[15px] sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.12em] text-subtle">Call us</dt>
                <dd className="mt-1">
                  <a href={siteConfig.phone.href} className="inline-block py-1 font-semibold hover:text-primary">
                    {siteConfig.phone.display}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.12em] text-subtle">Open</dt>
                <dd className="mt-1 font-semibold">{siteConfig.hours.display}</dd>
              </div>
            </dl>
            <a
              href={whatsappLink("Hi Byayamshala! I have a question before joining.")}
              target="_blank"
              rel="noreferrer"
              className={buttonClasses("primary", "md", "mt-6 w-full sm:w-auto")}
            >
              Chat on WhatsApp
              <ArrowIcon />
            </a>
          </div>
        </Reveal>

        <RevealGroup as="ul" stagger={0.08} className="space-y-4 md:space-y-5">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-panel-${i}`;
            const buttonId = `${baseId}-button-${i}`;
            return (
              <RevealItem
                as="li"
                key={faq.question}
                className="rounded-card bg-surface transition-colors duration-300 hover:bg-[#f2f4f7]"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 px-5 text-left text-base font-semibold text-black transition-[padding] duration-300 md:px-9 md:text-lg 2xl:text-[19px]",
                      isOpen ? "pb-4 pt-6" : "py-5 md:py-7",
                    )}
                  >
                    {faq.question}
                    <Image
                      src="/icons/faq-toggle.svg"
                      alt=""
                      width={26}
                      height={26}
                      className="size-[26px] shrink-0"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-500 ease-out-expo",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="mx-3 mb-5 rounded-card bg-white px-5 py-4 text-[15px] leading-relaxed text-muted-foreground md:mx-5 md:mb-6 md:px-6 md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}

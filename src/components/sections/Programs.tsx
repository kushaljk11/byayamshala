"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowIcon, Container, Heading } from "@/components/ui";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Program = {
  /** Card title — doubles as the service name in structured data. */
  title: string;
  /** One supporting line; keep it to two lines on a card (~70 characters). */
  body: string;
  /** Small chip on the tile. */
  tag: string;
  /** Brand tile colour, used while there's no photo. */
  tone: Tone;
  Icon: ComponentType<{ className?: string }>;
  /**
   * Optional real photo for this program — when set it replaces the brand tile.
   * Don't reuse photos from other sections (Journey, Testimonials, Experts).
   */
  photo?: { src: string; alt: string; focus?: string };
  href: string;
  comingSoon?: boolean;
};

type Tone = "ink" | "blue" | "sky";

const tones: Record<Tone, { tile: string; glow: string; icon: string; chip: string }> = {
  ink: {
    tile: "bg-ink text-white",
    glow: "bg-[radial-gradient(circle_at_70%_25%,rgb(1_158_225/0.45),transparent_60%)]",
    icon: "text-white",
    chip: "bg-white/10 text-white ring-1 ring-white/20",
  },
  blue: {
    tile: "bg-gradient-to-br from-[#0a2f6e] via-[#0763b8] to-primary text-white",
    glow: "bg-[radial-gradient(circle_at_30%_80%,rgb(0_220_255/0.4),transparent_55%)]",
    icon: "text-white",
    chip: "bg-white/15 text-white ring-1 ring-white/25",
  },
  sky: {
    tile: "bg-gradient-to-br from-[#eef8fd] to-[#cfeefc] text-foreground",
    glow: "bg-[radial-gradient(circle_at_75%_20%,rgb(255_255_255/0.9),transparent_55%)]",
    icon: "text-primary",
    chip: "bg-white text-foreground",
  },
};

/*
 * Byayamshala's training programs. Copy is written for people searching for
 * gym, personal training and weight-loss services in Itahari / online in Nepal.
 * Photos: Unsplash (free Unsplash License) — swap for photos of real Byayamshala classes when available.
 */
const programs: Program[] = [
  {
    title: "1-on-1 Personal Training",
    body: "A certified coach, a plan made for your body and real accountability.",
    tag: "Gym & Online",
    tone: "ink",
    Icon: DumbbellIcon,
    photo: { src: "/images/programs/personal-training.jpg", alt: "Personal trainer watching a client's deadlift form in the gym", focus: "center" },
    href: "#pricing",
  },
  {
    title: "Strength & Functional Training",
    body: "Move better, lift safer and build strength you use every day.",
    tag: "At the gym",
    tone: "blue",
    Icon: KettlebellIcon,
    photo: { src: "/images/programs/strength-functional.jpg", alt: "Athlete picking up two kettlebells during a strength workout", focus: "center 40%" },
    href: "#pricing",
  },
  {
    title: "Online Weight-Loss Coaching",
    body: "Lose weight from home with live classes and daily coach check-ins.",
    tag: "Online",
    tone: "sky",
    Icon: LiveCoachIcon,
    photo: { src: "/images/programs/online-weight-loss.jpg", alt: "Man doing push-ups at home in his living room", focus: "center" },
    href: "#pricing",
  },
  {
    title: "Group Fitness Classes",
    body: "Energetic coach-led sessions that keep you motivated, at any level.",
    tag: "At the gym",
    tone: "ink",
    Icon: GroupIcon,
    photo: { src: "/images/programs/group-fitness.jpg", alt: "Group fitness class training with resistance bands", focus: "center" },
    href: "#pricing",
  },
  {
    title: "Pilates & Kickboxing Classes",
    body: "Tone up, build core power and burn calories, launching soon.",
    tag: "Coming soon",
    tone: "blue",
    Icon: FlameIcon,
    photo: { src: "/images/programs/pilates-kickboxing.jpg", alt: "Woman in boxing gloves holding her guard during a kickboxing session", focus: "center 30%" },
    href: "#contact",
    comingSoon: true,
  },
];

/** schema.org catalogue of the programs so search engines can list them as services. */
const programsJsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Byayamshala Fitness Programs",
  itemListElement: programs.map((p, i) => ({
    "@type": "Offer",
    position: i + 1,
    availability: p.comingSoon ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
    itemOffered: {
      "@type": "Service",
      name: p.title,
      description: p.body,
      serviceType: "Fitness training",
      provider: { "@type": "ExerciseGym", name: "Byayamshala" },
    },
  })),
};

export function Programs() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.clientWidth + 24), behavior: "smooth" });
  };

  return (
    <section
      id="programs"
      aria-labelledby="programs-heading"
      className="scroll-mt-20 pt-20 md:pt-28 2xl:pt-[140px]"
    >
      <script
        type="application/ld+json"
        // Static data defined above — no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(programsJsonLd) }}
      />

      <Container className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <Reveal className="max-w-[600px]">
          <Heading id="programs-heading">Fitness Programs for Every Goal</Heading>
          <p className="mt-3 text-lead text-muted-foreground">
            Whether you want to lose weight, get stronger or simply feel better, pick a
            program and train with Byayamshala coaches at our Itahari gym or online, wherever
            you are in Nepal.
          </p>
        </Reveal>

        <div className="hidden shrink-0 gap-3 md:flex">
          <ArrowButton label="Previous programs" disabled={!canPrev} onClick={() => scroll(-1)} flip />
          <ArrowButton label="Next programs" disabled={!canNext} onClick={() => scroll(1)} />
        </div>
      </Container>

      {/* Track bleeds to the screen edge; padding keeps the first card on the container line. */}
      <Container className="mt-10 px-0 sm:px-0 lg:px-0 2xl:px-0 md:mt-14">
        <ul
          ref={trackRef}
          onScroll={update}
          className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto px-4 sm:scroll-px-6 sm:px-6 lg:scroll-px-10 lg:px-10 2xl:scroll-px-[100px] 2xl:px-[100px]"
        >
          {programs.map((p, i) => (
            <ProgramCard key={p.title} program={p} index={i} />
          ))}
        </ul>
      </Container>
    </section>
  );
}

function ProgramCard({ program: p, index }: { program: Program; index: number }) {
  const tone = tones[p.tone];
  return (
    <motion.li
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: index * 0.1 }}
      className="w-[80%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] 2xl:w-[29%]"
    >
      <a href={p.href} className="group/btn group block">
        <div
          className={cn(
            "relative isolate aspect-[4/5] overflow-hidden rounded-panel",
            p.photo ? "bg-ink" : tone.tile,
          )}
        >
          {p.photo ? (
            <Image
              src={p.photo.src}
              alt={p.photo.alt}
              fill
              sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 80vw"
              style={{ objectPosition: p.photo.focus ?? "center" }}
              className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
            />
          ) : (
            <>
              <div
                aria-hidden
                className={cn(
                  "absolute inset-0 -z-10 transition-transform duration-[1.4s] ease-out-expo group-hover:scale-110",
                  tone.glow,
                )}
              />
              {/* Oversized echo of the icon, bleeding off the corner for texture */}
              <p.Icon
                className={cn(
                  "absolute -bottom-[12%] -right-[14%] -z-10 w-[75%] -rotate-12 opacity-[0.08]",
                  tone.icon,
                )}
              />
              <div className="absolute inset-0 grid place-items-center">
                <p.Icon
                  className={cn(
                    "w-[34%] transition-transform duration-700 ease-out-expo group-hover:-rotate-6 group-hover:scale-110",
                    tone.icon,
                  )}
                />
              </div>
            </>
          )}

          <span
            className={cn(
              "absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md",
              p.photo ? "bg-white/90 text-foreground" : tone.chip,
            )}
          >
            {p.tag}
          </span>
        </div>

        <h3 className="mt-5 text-h4 font-semibold">{p.title}</h3>
        <p className="mt-1.5 text-[15px] text-muted-foreground md:text-base">{p.body}</p>
        <span className="mt-3 inline-flex items-center gap-2 text-[15px] font-semibold text-primary">
          {p.comingSoon ? "Get notified" : "Explore plans"}
          <ArrowIcon />
        </span>
      </a>
    </motion.li>
  );
}

function ArrowButton({
  label,
  disabled,
  onClick,
  flip,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  flip?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="group/btn flex size-12 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-white disabled:pointer-events-none disabled:opacity-35"
    >
      <ArrowIcon className={cn(flip && "rotate-180 group-hover/btn:-translate-x-1")} />
    </button>
  );
}

/* Program icons — 48px grid, 2px strokes, drawn to match the site's line style. */

const iconProps = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function DumbbellIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M16 24h16" />
      <rect x="9" y="14" width="7" height="20" rx="2.5" />
      <rect x="32" y="14" width="7" height="20" rx="2.5" />
      <path d="M5 19v10M43 19v10" />
    </svg>
  );
}

function KettlebellIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M17 19.5c-1.2-1.4-2-3.3-2-5.5a9 9 0 0 1 18 0c0 2.2-.8 4.1-2 5.5" />
      <path d="M19.5 18.5c-.3-.9-.5-1.8-.5-2.8a5 5 0 0 1 10 0c0 1-.2 1.9-.5 2.8" />
      <path d="M13 31c0-7.2 4.9-12 11-12s11 4.8 11 12c0 3.4-1.2 6.4-3 8.5a3 3 0 0 1-2.3 1H18.3a3 3 0 0 1-2.3-1c-1.8-2.1-3-5.1-3-8.5Z" />
    </svg>
  );
}

function LiveCoachIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <rect x="13" y="5" width="22" height="38" rx="4.5" />
      <path d="M21 9h6" />
      <circle cx="24" cy="21" r="4" />
      <path d="M17.5 33c1.2-3.6 3.7-5.5 6.5-5.5s5.3 1.9 6.5 5.5" />
      <path d="M38.5 15.5a8 8 0 0 1 0 11M42 12a13 13 0 0 1 0 18" />
    </svg>
  );
}

function GroupIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <circle cx="24" cy="15" r="5.5" />
      <path d="M14 38c0-6.6 4.5-11 10-11s10 4.4 10 11" />
      <circle cx="10.5" cy="19.5" r="4" />
      <path d="M3.5 36c0-4.6 2.6-7.8 6.2-8.4" />
      <circle cx="37.5" cy="19.5" r="4" />
      <path d="M44.5 36c0-4.6-2.6-7.8-6.2-8.4" />
    </svg>
  );
}

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M24 43c-7.7 0-13-5.3-13-12.4 0-5.6 3.3-9.7 6.3-13 .8 3 2.4 5 4.4 5.9C21 16.6 24.3 10 29.5 5c.6 6.4 3.4 10 5.7 13.3 1.9 2.8 3.8 5.9 3.8 10.6C39 37.4 32.4 43 24 43Z" />
      <path d="M24 43c-3.6 0-6-2.5-6-5.8 0-3.6 2.6-5.6 4.6-8.2.4 2 1.6 3.1 3 3.5.3-2 1.4-3.8 2.9-5.2 1.5 2.3 3.5 4.5 3.5 7.9C32 40.4 28.6 43 24 43Z" />
    </svg>
  );
}

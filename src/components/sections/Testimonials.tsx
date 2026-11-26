import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Container, Heading } from "@/components/ui";
import { cn } from "@/lib/utils";

type Testimonial = {
  name: string;
  program: string;
  location: string;
  quote: string;
};

/*
 * TODO: SAMPLE CONTENT. Replace with real member reviews (with their permission)
 * before launch; publishing invented reviews as real ones misleads visitors.
 */
const topRow: Testimonial[] = [
  {
    name: "Sushant Rai",
    program: "Personal Training",
    location: "Itahari",
    quote:
      "I tried to get fit on my own for years. With a coach planning every session, my back pain is gone and I actually look forward to my mornings.",
  },
  {
    name: "Anjali Shrestha",
    program: "Online Weight Loss",
    location: "Kathmandu",
    quote:
      "The live classes fit around my office hours, and the daily WhatsApp check-ins kept me honest on the days I wanted to skip.",
  },
  {
    name: "Prakash Limbu",
    program: "Strength & Functional",
    location: "Itahari",
    quote:
      "The coaches fixed my squat and deadlift form in the first week. I'm lifting heavier than ever without the knee pain I used to get.",
  },
  {
    name: "Sarita Karki",
    program: "Nutrition Plan",
    location: "Dharan",
    quote:
      "My meal plan uses dal bhat, roti and the vegetables we already cook at home. No strange diet food, and the results still came.",
  },
  {
    name: "Rohan Gurung",
    program: "Online Coaching",
    location: "Doha, Qatar",
    quote:
      "Working abroad made it hard to stay consistent. Training live with a coach back home gave me structure, and a little bit of Nepal too.",
  },
  {
    name: "Bimala Tamang",
    program: "Group Classes",
    location: "Itahari",
    quote:
      "The group sessions are the highlight of my week. Everyone pushes each other, and the coach makes every level feel welcome.",
  },
];

const bottomRow: Testimonial[] = [
  {
    name: "Kiran Adhikari",
    program: "Personal Training",
    location: "Biratnagar",
    quote:
      "I travel in for my sessions because the coaching is worth it. Every workout has a purpose and my progress is tracked week by week.",
  },
  {
    name: "Puja Thapa",
    program: "Online Weight Loss",
    location: "Sydney, Australia",
    quote:
      "Even with the time difference, my coach always found a slot for me. I've built a routine I can keep for life, not just for a few months.",
  },
  {
    name: "Dipesh Chaudhary",
    program: "Strength & Functional",
    location: "Itahari",
    quote:
      "As a beginner I was nervous walking in. The assessment showed me exactly where to start, and now I train five days a week.",
  },
  {
    name: "Manisha Bhattarai",
    program: "Nutrition Plan",
    location: "Itahari",
    quote:
      "After my second baby I didn't know where to begin. My coach built a plan around my schedule, and I feel stronger than I have in years.",
  },
  {
    name: "Aayush Poudel",
    program: "Group Classes",
    location: "Inaruwa",
    quote:
      "Great energy, a clean gym and coaches who remember your name. I came for weight loss and stayed for the community.",
  },
  {
    name: "Rekha Magar",
    program: "Online Coaching",
    location: "Dubai, UAE",
    quote:
      "The video sessions feel just like being in the gym. My coach spots mistakes straight away and updates my plan every month.",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="scroll-mt-20 overflow-hidden pt-20 md:pt-28 2xl:pt-[140px]"
    >
      <Container>
        <Reveal className="mx-auto max-w-[760px] text-center">
          <Heading id="testimonials-heading">Real Members. Real Goals. Real Results.</Heading>
          <p className="mt-3 text-lead text-muted-foreground">
            From Itahari to Sydney, here&apos;s what training with Byayamshala feels like.
          </p>
        </Reveal>
      </Container>

      <Reveal delay={0.1} className="mt-10 space-y-5 md:mt-14 md:space-y-6 xl:mt-[72px]">
        <MarqueeRow items={topRow} />
        <MarqueeRow items={bottomRow} reverse />
      </Reveal>
    </section>
  );
}

/**
 * One endlessly scrolling row. The list is rendered twice inside a track that
 * slides by -50%, so the loop has no visible seam. Hover/focus pauses it;
 * with reduced motion it becomes a normal swipeable row.
 */
function MarqueeRow({ items, reverse }: { items: Testimonial[]; reverse?: boolean }) {
  return (
    <div className="group/marquee relative [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] motion-reduce:no-scrollbar motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]">
      <div
        className={cn(
          "flex w-max group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:px-4",
          reverse ? "animate-marquee-reverse [animation-delay:-23s]" : "animate-marquee",
        )}
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className={cn("flex shrink-0 gap-5 pr-5 md:gap-6 md:pr-6", copy === 1 && "motion-reduce:hidden")}
          >
            {items.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const initials = t.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <li className="w-[300px] shrink-0 sm:w-[360px] md:w-[400px]">
      <figure className="flex h-full flex-col rounded-card bg-surface p-6 transition-colors duration-500 hover:bg-[#f1f5f9] md:p-7">
        <Image
          src="/icons/stars.svg"
          alt="Rated 5 out of 5"
          width={149.273}
          height={23.0454}
          className="h-[18px] w-[117px]"
        />
        <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground/85 md:text-base">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
          >
            {initials}
          </span>
          <span>
            <span className="block text-[15px] font-semibold">{t.name}</span>
            <span className="block text-sm text-muted-foreground">
              {t.program} · {t.location}
            </span>
          </span>
        </figcaption>
      </figure>
    </li>
  );
}

import Image from "next/image";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";
import { Container } from "@/components/ui";
import { cn } from "@/lib/utils";

const cards = [
  {
    title: "Progress Tracking",
    body: "See every workout, meal and measurement in one place, and know your coach is watching your progress too.",
    image: "/images/journey-progress.png",
    alt: "Woman flexing in a gym",
    position: "object-center",
  },
  {
    title: "Personal Training",
    body: "Train with purpose through personalized workouts, live coaching and guidance tailored to your level.",
    image: "/images/journey-training.png",
    alt: "Trainer guiding a woman through a dumbbell curl",
    position: "object-[28%_center]",
    offset: true,
  },
  {
    title: "Personal Nutrition",
    body: "Eat well with personalized meal plans built from familiar Nepali foods and shaped around your routine.",
    image: "/images/journey-nutrition.png",
    alt: "Athlete resting with a protein shake",
    position: "object-center",
  },
];

export function Journey() {
  return (
    <section id="services" className="scroll-mt-20 pt-20 md:pt-28 2xl:pt-[120px]">
      <Container>
        <WordReveal
          className="max-w-[1080px] text-h2 font-semibold"
          text="Your Fitness Journey Deserves More Than Exercise. It Deserves the Right Training, Nutrition and Expert Guidance."
        />

        <RevealGroup
          stagger={0.15}
          className="mt-10 grid gap-10 sm:grid-cols-2 md:mt-[60px] lg:grid-cols-3 lg:gap-8 2xl:-mr-[14px]"
        >
          {cards.map((card, i) => (
            <RevealItem
              as="article"
              key={card.title}
              className={cn("group", card.offset && "lg:mt-[69px]")}
            >
              <ImageReveal
                delay={i * 0.12}
                className="aspect-[4/5] rounded-card sm:aspect-[493/679]"
              >
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className={cn(
                    "object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]",
                    card.position,
                  )}
                />
              </ImageReveal>
              <h3 className="mt-6 text-h4 font-semibold">{card.title}</h3>
              <p className="mt-2 max-w-[460px] text-base leading-relaxed text-muted-foreground">
                {card.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

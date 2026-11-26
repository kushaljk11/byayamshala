import { CountUp } from "@/components/motion/CountUp";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Container, Heading } from "@/components/ui";

/** `suffix` renders in the accent colour next to the counted number. */
const stats = [
  { value: "1,600", suffix: "+", label: "Members coached", note: "In the gym and online" },
  // Open since 2018 — keep in sync with siteConfig.foundingYear.
  { value: "8", suffix: "+", label: "Years in Itahari", note: "Serving Sunsari since 2018" },
  { value: "4.9", suffix: "★", label: "Google rating", note: "From our members' reviews" },
  { value: "200", suffix: "+", label: "Live sessions", note: "Coach-led online classes" },
];

export function Stats() {
  return (
    <section id="about" className="scroll-mt-20 pt-20 md:pt-28 2xl:pt-[140px]">
      <Container>
        <Reveal className="mx-auto max-w-[720px] text-center">
          <Heading>Trusted in Itahari Since 2018</Heading>
          <p className="mt-3 text-lead text-muted-foreground">
            Real coaching, real accountability, for members at our gym and across the world.
          </p>
        </Reveal>

        <RevealGroup
          as="dl"
          className="mt-10 grid grid-cols-2 gap-3 sm:gap-[18px] md:mt-[60px] lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <RevealItem
              key={stat.label}
              className="group relative flex flex-col overflow-hidden rounded-panel bg-surface p-5 transition-colors duration-500 hover:bg-[#f1f5f9] sm:p-8 2xl:p-10"
            >
              {/* Accent bar grows across the top on hover */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
              />
              <dt className="order-2 mt-3 text-[15px] font-semibold sm:mt-4 sm:text-base 2xl:text-lg">
                {stat.label}
              </dt>
              <dd className="order-1 text-stat font-semibold tracking-[-0.03em] tabular-nums">
                <CountUp value={stat.value} />
                <span className="ml-0.5 text-primary">{stat.suffix}</span>
              </dd>
              <dd className="order-3 mt-1 text-[13px] text-muted-foreground sm:text-[15px]">
                {stat.note}
              </dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

import Link from "next/link";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowIcon, Container, Heading } from "@/components/ui";
import { blogPosts } from "@/constants/blog";

/**
 * "From the Journal" — one lead story plus three compact ones, editorial layout
 * (deliberately only four articles so the section stays calm, not crowded).
 */
export function Blog() {
  // Lead story + the next three; older articles live on /blog/.
  const [lead, ...others] = blogPosts;
  const rest = others.slice(0, 3);

  return (
    <section id="blogs" className="scroll-mt-20 pb-20 pt-20 md:pb-28 md:pt-28 2xl:pb-[140px] 2xl:pt-[140px]">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-[620px]">
            <Heading>Expert Advice to Train and Eat Smarter</Heading>
            <p className="mt-3 text-lead text-muted-foreground">
              Practical guides from our coaches on training, nutrition and
              staying consistent in Itahari or wherever you are.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/blog/"
              className="group/btn inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-[15px] font-semibold transition-colors hover:border-foreground hover:bg-foreground hover:text-white"
            >
              All articles
              <ArrowIcon className="h-3 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-12 xl:mt-[60px]">
          <Reveal className="lg:col-span-7">
            <ArticleCard post={lead} variant="feature" />
          </Reveal>

          <div className="flex flex-col justify-center divide-y divide-border lg:col-span-5">
            {rest.map((post, i) => (
              <Reveal
                key={post.slug}
                delay={0.12 + i * 0.12}
                className="py-6 first:pt-0 last:pb-0 lg:py-7"
              >
                <ArticleCard
                  post={post}
                  variant="compact"
                  delay={0.15 + i * 0.12}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

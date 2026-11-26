import type { Metadata } from "next";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Container } from "@/components/ui";
import { blogPosts } from "@/constants/blog";

export const metadata: Metadata = {
  title: "Journal — Training & Nutrition Advice",
  description:
    "Practical training, nutrition and weight-loss advice from the coaches at Byayamshala, the gym in Itahari, Nepal — for members at the gym and online.",
  alternates: { canonical: "/blog/" },
  openGraph: { url: "/blog/", title: "The Byayamshala Journal" },
};

export default function BlogIndex() {
  return (
    <>
      <header className="bg-ink pb-16 pt-32 text-white md:pb-24 md:pt-44">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            The Byayamshala Journal
          </p>
          <h1 className="mt-4 max-w-[760px] text-display font-semibold">
            Expert Advice to Train and Eat Smarter
          </h1>
          <p className="mt-5 max-w-[620px] text-lead text-white/70">
            Practical guides from our coaches on strength, nutrition, weight
            loss and online training.
          </p>
        </Container>
      </header>

      <Container className="py-16 md:py-24">
        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <ArticleCard
              key={post.slug}
              post={post}
              variant="feature"
              delay={i * 0.1}
            />
          ))}
        </div>
      </Container>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard, CategoryPill } from "@/components/blog/ArticleCard";
import { ArrowIcon, buttonClasses, Container } from "@/components/ui";
import {
  blogPosts,
  formatDate,
  getPost,
  type BlogBlock,
} from "@/constants/blog";
import { siteConfig, whatsappLink } from "@/constants/site";

// Only the articles listed in constants/blog.ts exist (static export).
export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `/blog/${post.slug}/`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.published,
      authors: [post.author],
      section: post.category,
      images: [
        {
          url: post.image.src,
          width: post.image.width,
          height: post.image.height,
          alt: post.image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image.src],
    },
  };
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-12 text-h3 font-semibold">{block.text}</h2>;
    case "ul":
      return (
        <ul className="mt-5 space-y-3">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-[17px] leading-relaxed text-foreground/85"
            >
              <span
                aria-hidden
                className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-primary"
              />
              {item}
            </li>
          ))}
        </ul>
      );
    case "tip":
      return (
        <p className="mt-8 rounded-card border-l-4 border-primary bg-primary/[0.06] px-6 py-5 text-[17px] font-medium leading-relaxed">
          {block.text}
        </p>
      );
    default:
      return (
        <p className="mt-5 text-[17px] leading-[1.8] text-foreground/85">
          {block.text}
        </p>
      );
  }
}

export default async function ArticlePage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${siteConfig.url}/blog/${post.slug}/`;
  const more = blogPosts.filter((p) => p.slug !== post.slug);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: `${siteConfig.url}${post.image.src}`,
      datePublished: post.published,
      dateModified: post.published,
      author: {
        "@type": "Organization",
        name: post.author,
        url: siteConfig.url,
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.legalName,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/images/logo.png`,
        },
      },
      mainEntityOfPage: url,
      articleSection: post.category,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${siteConfig.url}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Journal",
          item: `${siteConfig.url}/blog/`,
        },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  return (
    <article>
      <script
        type="application/ld+json"
        // Static content from constants/blog.ts — no user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dark header band (keeps the transparent navigation readable) */}
      <header className="bg-ink pb-36 pt-32 text-white md:pb-44 md:pt-40">
        <Container className="max-w-[1000px]">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-white/55"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/blog/" className="transition-colors hover:text-white">
              Journal
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white/80">{post.category}</span>
          </nav>
          <div className="mt-6">
            <CategoryPill dark>{post.category}</CategoryPill>
          </div>
          <h1 className="mt-5 max-w-[860px] text-display font-semibold">
            {post.title}
          </h1>
          <p className="mt-5 max-w-[680px] text-lead text-white/70">
            {post.excerpt}
          </p>
          <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60">
            <span className="font-semibold text-white">{post.author}</span>
            <span aria-hidden className="size-1 rounded-full bg-white/30" />
            <time dateTime={post.published}>{formatDate(post.published)}</time>
            <span aria-hidden className="size-1 rounded-full bg-white/30" />
            {post.readMinutes} min read
          </p>
        </Container>
      </header>

      <Container className="max-w-[1100px]">
        <div className="relative -mt-24 aspect-[16/9] overflow-hidden rounded-panel shadow-[0_40px_80px_-40px_rgb(15_23_42/0.6)] md:-mt-32">
          <Image
            src={post.image.src}
            alt={post.image.alt}
            fill
            preload
            sizes="(min-width: 1100px) 1100px, 100vw"
            className="object-cover"
          />
        </div>
      </Container>

      <Container className="max-w-[760px] pb-20 pt-12 md:pb-28 md:pt-16">
        {post.body.map((block, i) => (
          <Block key={i} block={block} />
        ))}

        {/* Call to action */}
        <aside className="mt-14 rounded-panel bg-ink p-8 text-white md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Train with a coach
          </p>
          <p className="mt-3 text-h3 font-semibold">
            Want a plan built around you?
          </p>
          <p className="mt-3 text-white/70">
            Tell us your goal and our coaches will build your training and
            nutrition plan — at our Itahari gym or live online.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsappLink(
                `Hi Byayamshala! I read "${post.title}" and I'd like a plan.`,
              )}
              target="_blank"
              rel="noreferrer"
              className={buttonClasses("primary")}
            >
              Chat on WhatsApp
              <ArrowIcon />
            </a>
            <Link href="/#pricing" className={buttonClasses("outline-light")}>
              View membership plans
            </Link>
          </div>
        </aside>
      </Container>

      {/* More articles */}
      <section className="border-t border-border bg-surface/60 py-16 md:py-20">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-h3 font-semibold">More from the Journal</h2>
            <Link
              href="/blog/"
              className="group/btn inline-flex items-center gap-2 text-[15px] font-semibold text-primary"
            >
              All articles
              <ArrowIcon className="h-3 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <ArticleCard key={p.slug} post={p} variant="compact" />
            ))}
          </div>
        </Container>
      </section>
    </article>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { ArrowIcon } from "@/components/ui";
import { formatDate, type BlogPost } from "@/constants/blog";
import { cn } from "@/lib/utils";

export function CategoryPill({
  children,
  dark = false,
}: {
  children: string;
  dark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        dark
          ? "bg-white/10 text-white ring-1 ring-white/15"
          : "bg-primary/10 text-primary",
      )}
    >
      {children}
    </span>
  );
}

function Meta({ post }: { post: BlogPost }) {
  return (
    <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
      <time dateTime={post.published}>{formatDate(post.published)}</time>
      <span aria-hidden className="size-1 rounded-full bg-border" />
      {post.readMinutes} min read
    </p>
  );
}

/**
 * Article card.
 * - "feature": large image on top, bigger title and excerpt (the lead story).
 * - "compact": image beside the text, for the secondary stories.
 * The whole card is one link; the arrow and image react on hover.
 */
export function ArticleCard({
  post,
  variant = "feature",
  delay = 0,
}: {
  post: BlogPost;
  variant?: "feature" | "compact";
  delay?: number;
}) {
  const href = `/blog/${post.slug}/`;

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className="group/card grid grid-cols-[minmax(0,42%)_minmax(0,1fr)] items-center gap-4 sm:gap-6"
      >
        <ImageReveal delay={delay} className="aspect-[4/3] rounded-card">
          <Image
            src={post.image.src}
            alt={post.image.alt}
            fill
            sizes="(min-width: 1024px) 18vw, 40vw"
            className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover/card:scale-[1.06]"
          />
        </ImageReveal>
        <div>
          <CategoryPill>{post.category}</CategoryPill>
          <h3 className="mt-3 line-clamp-3 text-base font-semibold leading-snug transition-colors group-hover/card:text-primary sm:text-h4">
            {post.title}
          </h3>
          <div className="mt-2.5 flex items-center justify-between gap-3">
            <Meta post={post} />
            <ArrowIcon className="hidden h-3 w-4 shrink-0 text-primary opacity-0 transition-[opacity,transform] duration-300 group-hover/card:translate-x-1 group-hover/card:opacity-100 sm:block" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group/card block">
      <ImageReveal delay={delay} className="aspect-[16/10] rounded-panel">
        <Image
          src={post.image.src}
          alt={post.image.alt}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover/card:scale-[1.05]"
        />
      </ImageReveal>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <CategoryPill>{post.category}</CategoryPill>
        <Meta post={post} />
      </div>
      <h3 className="mt-3 max-w-[640px] text-h3 font-semibold transition-colors group-hover/card:text-primary">
        {post.title}
      </h3>
      <p className="mt-3 max-w-[600px] text-base leading-relaxed text-muted-foreground">
        {post.excerpt}
      </p>
      <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold">
        Read article
        <ArrowIcon className="h-3 w-4 text-primary transition-transform duration-300 group-hover/card:translate-x-1" />
      </span>
    </Link>
  );
}

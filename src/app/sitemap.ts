import type { MetadataRoute } from "next";
import { blogPosts } from "@/constants/blog";
import { siteConfig } from "@/constants/site";

// Generated once at build time (required for `output: "export"`).
export const dynamic = "force-static";

/**
 * The home page, the Journal index and every article. The old URLs
 * (/about, /classes, /membership, /contact) now forward to sections of the
 * home page and are deliberately left out — they are not pages of their own.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [`${siteConfig.url}/images/og-cover.jpg`],
    },
    {
      url: `${siteConfig.url}/blog/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...blogPosts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}/`,
      lastModified: new Date(`${post.published}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: [`${siteConfig.url}${post.image.src}`],
    })),
  ];
}

import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    // Single slash — the previous site listed "…com.np//sitemap.xml".
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

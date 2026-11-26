"use client";

import { usePathname } from "next/navigation";

/**
 * Section links are written as "#pricing". On the home page that stays a
 * same-page jump (smooth-scrolled by Lenis); on any other page (404, the old
 * /about-style URLs) it becomes "/#pricing" so the link still lands on the
 * right section of the home page.
 */
export function useSectionHref() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  return (href: string) => (href.startsWith("#") && !onHome ? `/${href}` : href);
}

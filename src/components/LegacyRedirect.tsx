"use client";

import { useEffect } from "react";
import { ArrowIcon, buttonClasses } from "@/components/ui";

/**
 * Forwarding page for a URL from the previous website (e.g. /about) that is now
 * a section of the single-page site. Works on any static host:
 * - an instant JavaScript redirect for visitors,
 * - a 0-second meta refresh (React hoists it into <head>) that search engines
 *   treat as a permanent redirect, so existing rankings pass to the home page.
 * A server-level 301 on the host is even better when available (see README).
 */
export function LegacyRedirect({ to, label }: { to: string; label: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <section className="flex min-h-svh items-center justify-center bg-ink px-6 text-center text-white">
        <div>
          <p className="text-sm font-medium text-white/60">Taking you to {label}…</p>
          <a href={to} className={buttonClasses("primary", "md", "mt-5")}>
            Continue to {label}
            <ArrowIcon />
          </a>
        </div>
      </section>
    </>
  );
}

"use client";

import { useLenis } from "lenis/react";
import { useAnimate } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { siteConfig } from "@/constants/site";
import { finishIntro } from "./introStore";

/*
 * "The Lift" — opening sequence (≈2.3 s from the first paint):
 *   Part 1, CSS (see globals.css "Intro, part 1"), runs before JavaScript loads:
 *     0.10–0.70  the B mark rises into view from below, like a lift off the floor
 *     0.70–1.25  it slides left as the wordmark unrolls beside it
 *     0.20–1.45  a thin brand-blue line fills
 *   Part 2, here, once the page is interactive and the hero poster is ready:
 *     a blue edge sweeps across the bottom, then the whole screen lifts away like
 *     a gym shutter; the hero film settles underneath and the header and headline
 *     enter during the lift — one continuous move.
 * Never blocks: hard cap at 3.2 s after navigation, and any click / key / scroll
 * skips straight to the exit.
 */

const EASE_SLIDE = [0.65, 0, 0.35, 1] as const;
const EASE_SHUTTER = [0.76, 0, 0.24, 1] as const;

/** Earliest exit, measured from when the intro starts painting (CSS part 1 is done by then). */
const MIN_MS = 1450;
/** Latest exit, measured from when the intro starts painting. */
const MAX_MS = 3200;

const noopSubscribe = () => () => {};
const sleep = (ms: number) =>
  new Promise((r) => window.setTimeout(r, Math.max(0, ms)));

function waitForHeroPoster(): Promise<void> {
  return new Promise((resolve) => {
    const img = document.querySelector<HTMLImageElement>("#home picture img");
    if (!img || img.complete) return resolve();
    img.addEventListener("load", () => resolve(), { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
  });
}

export function Intro() {
  // Server HTML always includes the overlay (CSS keeps it hidden unless it plays);
  // on the client it stays only if the boot script chose to play it this load.
  const shouldPlay = useSyncExternalStore(
    noopSubscribe,
    () => document.documentElement.dataset.introPlayed === "1",
    () => true,
  );
  const [finished, setFinished] = useState(false);
  const active = shouldPlay && !finished;
  const [scope, animate] = useAnimate();
  const lenis = useLenis();
  const exiting = useRef(false);

  // Lock scrolling while the intro covers the page.
  useEffect(() => {
    if (!active) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [active, lenis]);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    const exit = async () => {
      if (exiting.current || cancelled) return;
      exiting.current = true;
      // Blue edge sweeps across the bottom of the panel…
      animate(
        "[data-edge]",
        { scaleX: 1 },
        { duration: 0.35, ease: EASE_SLIDE },
      );
      animate(
        "[data-brand]",
        { y: -36, opacity: 0 },
        { duration: 0.55, delay: 0.25, ease: EASE_SHUTTER },
      );
      // …then the whole screen lifts. Page entrances start as it moves.
      window.setTimeout(finishIntro, 380);
      await animate(
        scope.current,
        { y: "-100%" },
        { duration: 0.9, delay: 0.3, ease: EASE_SHUTTER },
      );
      if (!cancelled) setFinished(true);
    };

    // Time since the boot script showed the overlay (= start of the CSS timeline).
    const t0 = (window as Window & { __bysIntroT0?: number }).__bysIntroT0 ?? 0;
    const sinceNav = () => performance.now() - t0;
    Promise.race([
      Promise.all([waitForHeroPoster(), sleep(MIN_MS - sinceNav())]),
      sleep(MAX_MS - 400 - sinceNav()),
    ]).then(exit);

    // Safety nets: hard cap, and any interaction skips ahead.
    const hardCap = window.setTimeout(exit, Math.max(0, MAX_MS - sinceNav()));
    const skip = () => exit();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });

    return () => {
      cancelled = true;
      window.clearTimeout(hardCap);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
      finishIntro(); // never leave the page waiting
    };
  }, [active, animate, scope]);

  if (!active) return null;

  return (
    // Server-rendered and shown by CSS only while <html data-intro="play">, so it
    // covers the page from the very first paint — no flash of the hero.
    <div
      ref={scope}
      aria-hidden
      className="intro-overlay fixed inset-0 z-[100] flex-col items-center justify-center bg-ink will-change-transform"
    >
      <div data-brand className="flex flex-col items-center">
        {/* Logo: the B mark lifts in alone at the centre, then the wordmark unrolls */}
        <div className="intro-track w-[min(72vw,420px)]">
          <div className="intro-unroll">
            <div className="intro-lift relative aspect-[3/1] overflow-hidden">
              {/* Plain <img> so it is in the HTML with top priority and paints with the CSS timeline */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-intro.webp"
                alt={siteConfig.name}
                width={660}
                height={220}
                fetchPriority="high"
                decoding="sync"
                className="intro-rise absolute inset-0 size-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Loading line */}
        <span className="mt-8 block h-[2px] w-[120px] overflow-hidden rounded-full bg-white/10">
          <span className="intro-progress block h-full rounded-full bg-primary" />
        </span>
      </div>

      {/* Leading edge of the shutter */}
      <span
        data-edge
        style={{ transform: "scaleX(0)" }}
        className="absolute inset-x-0 bottom-0 h-[3px] bg-primary"
      />
    </div>
  );
}

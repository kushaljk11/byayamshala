"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { BrandMark } from "@/components/ui";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PhoneFrame } from "./PhoneFrame";
import { useLoop } from "./useLoop";

const COACH_MESSAGES = [
  "Great form! Keep your core tight.",
  "Slow it down — control every wave.",
  "Last 10 seconds. Breathe and push!",
];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Live coaching session, animated: the client feed is real footage, the
 * session clock runs, reps count up, heart rate beats and coach messages
 * arrive. Everything pauses off-screen; reduced motion shows a still frame.
 */
export function LiveTrainingVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // 1 step per second: drives timer, reps (every 2s) and messages (every 4s)
  const { step, live, reduceMotion } = useLoop(ref, 48, 1000);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (live) void video.play().catch(() => {});
    else video.pause();
  }, [live]);

  const seconds = 24 * 60 + 16 + step; // session started 24:16 ago
  const reps = reduceMotion ? 12 : 4 + Math.floor((step % 24) / 2); // 4 → 15, then next set
  const set = reduceMotion ? 3 : step < 24 ? 3 : 4;
  const message = COACH_MESSAGES[Math.floor(step / 4) % COACH_MESSAGES.length];
  const showMessage = reduceMotion || step % 4 !== 3; // brief gap between messages

  return (
    <div ref={ref} className="relative mx-auto w-[min(76%,300px)] text-left text-foreground">
      <PhoneFrame>
        {/* App bar */}
        <div className="flex items-center justify-between px-4 pt-1">
          <span className="flex size-8 items-center justify-center rounded-full bg-white shadow-sm">
            <svg
              viewBox="0 0 8 12"
              className="h-2.5 w-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M6.5 1 1.5 6l5 5" />
            </svg>
          </span>
          <span className="flex items-center gap-1.5 text-[15px] font-bold tracking-[-0.01em]">
            <BrandMark className="w-5" />
            Byayamshala
          </span>
          <span className="flex size-8 items-center justify-center gap-[3px] rounded-full bg-white shadow-sm">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-[3px] rounded-full bg-foreground" />
            ))}
          </span>
        </div>
        <div className="mt-3 flex justify-center">
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
            <svg viewBox="0 0 16 10" className="h-2 w-3" fill="currentColor">
              <rect x="0" y="3" width="3" height="4" rx="1" />
              <rect x="3" y="1" width="2.5" height="8" rx="1" />
              <rect x="5.5" y="4.25" width="5" height="1.5" />
              <rect x="10.5" y="1" width="2.5" height="8" rx="1" />
              <rect x="13" y="3" width="3" height="4" rx="1" />
            </svg>
            Live Personal Training
          </span>
        </div>

        {/* Live video feed */}
        <div className="absolute inset-x-0 bottom-0 top-[128px] overflow-hidden rounded-t-[22px] bg-ink">
          <video
            ref={videoRef}
            aria-hidden
            muted
            loop
            playsInline
            preload="none"
            poster="/videos/hero-poster.jpg"
            className="size-full scale-[1.15] object-cover object-[64%_center]"
          >
            <source src="/videos/hero-960.webm" type="video/webm" />
            <source src="/videos/hero-960.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/70" />

          {/* LIVE + timer */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <span className="flex items-center gap-1.5 rounded-md bg-[#ef4444] px-2 py-1 text-[10px] font-bold tracking-wide text-white">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-white/80" />
                <span className="relative size-1.5 rounded-full bg-white" />
              </span>
              LIVE
            </span>
            <span className="rounded-md bg-black/45 px-2 py-1 text-[10px] font-semibold tabular-nums text-white backdrop-blur-sm">
              {pad(Math.floor(seconds / 60))}:{pad(seconds % 60)}
            </span>
          </div>

          {/* Trainer picture-in-picture */}
          <div className="absolute right-3 top-3 w-[34%]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl ring-2 ring-white/80">
              <Image
                src="/images/expert-anup.png"
                alt=""
                fill
                sizes="110px"
                className="object-cover"
              />
              {/* speaking indicator */}
              <span className="absolute bottom-1.5 left-1.5 flex h-3 items-end gap-[2px] rounded-full bg-black/50 px-1.5 py-[3px]">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-[2px] rounded-full bg-[#4ade80]"
                    animate={
                      live
                        ? { height: ["30%", "100%", "45%", "80%", "30%"] }
                        : { height: "60%" }
                    }
                    transition={{
                      duration: 1.1,
                      repeat: Infinity,
                      delay: i * 0.18,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </span>
            </div>
            <p className="mt-1 text-center text-[9px] font-semibold text-white drop-shadow">
              Coach Anup
            </p>
          </div>

          {/* Coach message */}
          <div className="absolute inset-x-3 bottom-[144px] flex justify-start">
            <AnimatePresence mode="wait">
              {showMessage && (
                <motion.div
                  key={message}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                  className="max-w-[78%] rounded-2xl rounded-tl-md bg-white/90 px-3 py-2 text-[10.5px] font-medium leading-snug text-foreground shadow-lg backdrop-blur"
                >
                  <span className="block text-[9px] font-bold text-primary">
                    Coach Anup
                  </span>
                  {message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Workout stats */}
          <div className="absolute inset-x-3 bottom-[70px] grid grid-cols-2 gap-2">
            <Stat label={`Set ${set} of 4`}>
              <span className="tabular-nums">{reps}</span>
              <span className="text-[10px] font-medium text-white/60">
                {" "}
                / 15 reps
              </span>
              <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-white/20">
                <motion.span
                  className="block h-full rounded-full bg-primary"
                  animate={{ width: `${(reps / 15) * 100}%` }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                />
              </span>
            </Stat>
            <Stat label="Heart rate">
              <span className="flex items-center gap-1">
                <motion.svg
                  viewBox="0 0 24 22"
                  className="h-3 w-3.5 text-[#f43f5e]"
                  fill="currentColor"
                  animate={live ? { scale: [1, 1.22, 1, 1.12, 1] } : undefined}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <path d="M12 21.5 10.3 20C4.2 14.4 0 10.6 0 6 0 2.6 2.6 0 6 0c1.9 0 3.8.9 5 2.3h2C14.2.9 16.1 0 18 0c3.4 0 6 2.6 6 6 0 4.6-4.2 8.4-10.3 14L12 21.5Z" />
                </motion.svg>
                <span className="tabular-nums">
                  {142 + (live ? [0, 2, 3, 1, -1, 0][step % 6] : 0)}
                </span>
                <span className="text-[10px] font-medium text-white/60">
                  bpm
                </span>
              </span>
              <Pulse live={live} />
            </Stat>
          </div>

          {/* Call controls */}
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2.5">
            {["flip", "cam", "mic"].map((k) => (
              <span
                key={k}
                className="flex size-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md"
              >
                <ControlIcon kind={k} />
              </span>
            ))}
            <span className="flex size-9 items-center justify-center rounded-full bg-[#ef4444] text-white">
              <ControlIcon kind="end" />
            </span>
          </div>
        </div>
      </PhoneFrame>

      {/* Floating card: session progress (desktop) */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.5 }}
        className="absolute left-[calc(100%-28px)] top-[24%] hidden w-[156px] rounded-2xl bg-white p-3.5 text-left shadow-[0_24px_50px_-20px_rgb(15_23_42/0.3)] xl:block"
      >
        <p className="text-[11px] font-medium text-muted-foreground">
          Today&apos;s session
        </p>
        <p className="mt-0.5 text-sm font-semibold">Full Body Burn</p>
        <div className="mt-3 flex gap-1">
          {[1, 2, 3, 4].map((s) => (
            <span
              key={s}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface"
            >
              <motion.span
                className="block h-full rounded-full bg-primary"
                animate={{
                  width:
                    s < set
                      ? "100%"
                      : s === set
                        ? `${(reps / 15) * 100}%`
                        : "0%",
                }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
              />
            </span>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Set <span className="font-semibold text-foreground">{set}</span> of 4
          · 45 min
        </p>
      </motion.div>

      {/* Floating card: coach availability (desktop) */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.7 }}
        className="absolute right-[calc(100%-28px)] top-[40%] hidden items-center gap-2.5 whitespace-nowrap rounded-2xl bg-white p-3 pr-4 text-left shadow-[0_24px_50px_-20px_rgb(15_23_42/0.3)] xl:flex"
      >
        <span className="relative size-9 overflow-hidden rounded-full">
          <Image
            src="/images/expert-janak.png"
            alt=""
            fill
            sizes="36px"
            className="object-cover"
          />
        </span>
        <span>
          <span className="block text-[12px] font-semibold">
            1-on-1 coaching
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-[#22c55e]" /> Trainers
            online now
          </span>
        </span>
      </motion.div>
    </div>
  );
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-black/40 p-2.5 text-[15px] font-bold text-white backdrop-blur-md">
      <span className="mb-0.5 block text-[9px] font-semibold uppercase tracking-wider text-white/60">
        {label}
      </span>
      {children}
    </div>
  );
}

/** Scrolling ECG trace. */
function Pulse({ live }: { live: boolean }) {
  const path =
    "M0 10 H14 L17 3 L21 17 L24 10 H40 L43 3 L47 17 L50 10 H66 L69 3 L73 17 L76 10 H92 L95 3 L99 17 L102 10 H120";
  return (
    <span className="mt-1 block h-3 overflow-hidden">
      <motion.svg
        viewBox="0 0 120 20"
        preserveAspectRatio="none"
        className={cn("h-full w-[200%] text-[#f43f5e]")}
        animate={live ? { x: ["0%", "-50%"] } : undefined}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
      >
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </motion.svg>
    </span>
  );
}

function ControlIcon({ kind }: { kind: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "flip":
      return (
        <svg viewBox="0 0 24 24" className="size-4" {...common}>
          <path d="M20 7h-3l-2-3H9L7 7H4v12h16z" />
          <path d="M9 13a3 3 0 0 0 5.2 2M15 12a3 3 0 0 0-5.2-2" />
        </svg>
      );
    case "cam":
      return (
        <svg viewBox="0 0 24 24" className="size-4" {...common}>
          <rect x="2" y="6" width="14" height="12" rx="2" />
          <path d="m16 10 6-3v10l-6-3" />
        </svg>
      );
    case "mic":
      return (
        <svg viewBox="0 0 24 24" className="size-4" {...common}>
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
          <path d="M12 9c-3.3 0-6.3 1-8.4 2.6-.6.5-.7 1.4-.2 2l1.4 1.7c.4.5 1.1.6 1.7.3l2.4-1.3c.5-.3.8-.8.7-1.4l-.2-1.5c1.7-.5 3.5-.5 5.2 0l-.2 1.5c-.1.6.2 1.1.7 1.4l2.4 1.3c.6.3 1.3.2 1.7-.3l1.4-1.7c.5-.6.4-1.5-.2-2C18.3 10 15.3 9 12 9Z" />
        </svg>
      );
  }
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { BrandMark } from "@/components/ui";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PhoneFrame } from "../features/PhoneFrame";
import { useLoop } from "../features/useLoop";

/*
 * "Live online coaching" story (1 s per step, 16 steps):
 *   0–3   Upcoming session → countdown, then "Join live session" is tapped
 *   4–15  In the call      → coach full screen, you in the corner, captions, reactions
 */
const CAPTIONS = [
  "Let's warm up those shoulders.",
  "Nice and controlled — three more.",
  "Perfect posture. Keep breathing.",
];

const pad = (n: number) => String(n).padStart(2, "0");

const screen = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.03 },
  transition: { duration: 0.5, ease: EASE_OUT },
};

export function LiveSessionVisual({ active = true }: { active?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loop = useLoop(ref, 16, 1000);
  const step = loop.reduceMotion || !active ? 8 : loop.step;
  const inCall = step >= 4;
  const playing = loop.live && active && inCall;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) void v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  const callSeconds = Math.max(0, step - 4);
  const caption = CAPTIONS[Math.floor(callSeconds / 4) % CAPTIONS.length];

  return (
    <div ref={ref} className="text-left text-foreground">
      <PhoneFrame lightStatus={inCall}>
        <AnimatePresence mode="wait" initial={false}>
          {!inCall ? (
            <motion.div key="lobby" {...screen} className="px-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[15px] font-bold tracking-[-0.01em]">
                  <BrandMark className="w-5" />
                  Byayamshala
                </span>
                <span className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-semibold shadow-sm">
                  <span className="size-1.5 rounded-full bg-[#22c55e]" /> Online
                </span>
              </div>
              <h4 className="mt-4 text-[19px] font-bold tracking-[-0.02em]">
                Your live session
              </h4>
              <p className="text-[11px] text-muted-foreground">
                1-on-1 · From anywhere
              </p>

              {/* Coach card */}
              <div className="mt-3 overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/expert-mamta.png"
                    alt=""
                    fill
                    sizes="280px"
                    className="object-cover object-top"
                  />
                  <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[9.5px] font-semibold text-white backdrop-blur">
                    <span className="size-1.5 animate-pulse rounded-full bg-[#22c55e]" />{" "}
                    Coach is ready
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-[13px] font-bold">
                    Strength &amp; Mobility
                  </p>
                  <p className="text-[10.5px] text-muted-foreground">
                    with Coach Mamta · 45 min
                  </p>
                  <div className="mt-2.5 flex items-center justify-between rounded-xl bg-surface px-3 py-2">
                    <span className="text-[10px] font-medium text-muted-foreground">
                      Starts in
                    </span>
                    <span className="text-[15px] font-bold tabular-nums text-foreground">
                      00:{pad(Math.max(0, 3 - step))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Join button gets "tapped" on the last lobby step */}
              <div className="relative mt-3">
                <motion.div
                  animate={{ scale: step === 3 ? 0.95 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-[12.5px] font-semibold text-white shadow-[0_10px_24px_-10px_rgb(1_158_225/0.9)]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="6" width="14" height="12" rx="2" />
                    <path d="m16 10 6-3v10l-6-3" />
                  </svg>
                  Join live session
                </motion.div>
                {step >= 2 && (
                  <motion.span
                    key={`tap-${step}`}
                    aria-hidden
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1, 1.6] }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70"
                  />
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="call"
              {...screen}
              className="absolute inset-0 bg-ink"
            >
              {/* Coach, full screen, with a slow "breathing" camera */}
              <motion.div
                className="absolute inset-0"
                animate={
                  playing ? { scale: [1.05, 1.12, 1.05] } : { scale: 1.08 }
                }
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/images/expert-mamta.png"
                  alt=""
                  fill
                  sizes="300px"
                  className="object-cover object-top"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/75" />

              <div className="absolute inset-x-3 top-12 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1.5 rounded-md bg-[#ef4444] px-2 py-1 text-[10px] font-bold text-white">
                    <span className="relative flex size-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-white/80" />
                      <span className="relative size-1.5 rounded-full bg-white" />
                    </span>
                    LIVE
                  </span>
                  <span className="rounded-md bg-black/45 px-2 py-1 text-[10px] font-semibold tabular-nums text-white backdrop-blur-sm">
                    {pad(Math.floor(callSeconds / 60))}:{pad(callSeconds % 60)}
                  </span>
                </span>
                <span className="rounded-md bg-black/45 px-2 py-1 text-[9.5px] font-semibold text-white backdrop-blur-sm">
                  HD · Connected
                </span>
              </div>

              {/* You, in the corner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.3 }}
                className="absolute right-3 top-[88px] w-[34%]"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl ring-2 ring-white/80">
                  <video
                    ref={videoRef}
                    aria-hidden
                    muted
                    loop
                    playsInline
                    preload="none"
                    poster="/videos/hero-poster.jpg"
                    className="size-full scale-[1.25] object-cover object-[64%_center]"
                  >
                    <source src="/videos/hero-960.webm" type="video/webm" />
                    <source src="/videos/hero-960.mp4" type="video/mp4" />
                  </video>
                </div>
                <p className="mt-1 text-center text-[9px] font-semibold text-white drop-shadow">
                  You
                </p>
              </motion.div>

              {/* Reaction */}
              <AnimatePresence>
                {callSeconds % 6 === 3 && (
                  <motion.span
                    key={`react-${step}`}
                    initial={{ opacity: 0, y: 0, scale: 0.6 }}
                    animate={{ opacity: [0, 1, 0], y: -70, scale: 1 }}
                    transition={{ duration: 1.6, ease: "easeOut" }}
                    className="absolute bottom-[150px] right-8 flex size-9 items-center justify-center rounded-full bg-primary text-white shadow-lg"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-4"
                      fill="currentColor"
                    >
                      <path d="M2 21h3V9H2v12Zm20-11a2 2 0 0 0-2-2h-6.3l1-4.6v-.3a1.5 1.5 0 0 0-.4-1L13.2 1 7.6 6.6C7.2 7 7 7.5 7 8v11a2 2 0 0 0 2 2h9a2 2 0 0 0 1.8-1.2l3-7.1.2-.7v-2Z" />
                    </svg>
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Coach caption */}
              <div className="absolute inset-x-3 bottom-[76px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={caption}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    className="rounded-2xl bg-black/50 px-3 py-2 text-white backdrop-blur-md"
                  >
                    <span className="block text-[9px] font-bold text-primary">
                      Coach Mamta
                    </span>
                    <span className="block text-[11px] font-medium leading-snug">
                      {caption}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2.5">
                {["mic", "cam", "chat"].map((k) => (
                  <span
                    key={k}
                    className="flex size-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md"
                  >
                    <CallIcon kind={k} />
                  </span>
                ))}
                <span className="flex size-9 items-center justify-center rounded-full bg-[#ef4444] text-white">
                  <CallIcon kind="end" />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PhoneFrame>
    </div>
  );
}

function CallIcon({ kind }: { kind: string }) {
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (kind === "mic")
    return (
      <svg viewBox="0 0 24 24" className={cn("size-4")} {...p}>
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
      </svg>
    );
  if (kind === "cam")
    return (
      <svg viewBox="0 0 24 24" className="size-4" {...p}>
        <rect x="2" y="6" width="14" height="12" rx="2" />
        <path d="m16 10 6-3v10l-6-3" />
      </svg>
    );
  if (kind === "chat")
    return (
      <svg viewBox="0 0 24 24" className="size-4" {...p}>
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12Z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M12 9c-3.3 0-6.3 1-8.4 2.6-.6.5-.7 1.4-.2 2l1.4 1.7c.4.5 1.1.6 1.7.3l2.4-1.3c.5-.3.8-.8.7-1.4l-.2-1.5c1.7-.5 3.5-.5 5.2 0l-.2 1.5c-.1.6.2 1.1.7 1.4l2.4 1.3c.6.3 1.3.2 1.7-.3l1.4-1.7c.5-.6.4-1.5-.2-2C18.3 10 15.3 9 12 9Z" />
    </svg>
  );
}

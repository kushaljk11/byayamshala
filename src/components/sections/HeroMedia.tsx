"use client";

import { motion } from "motion/react";
import { getImageProps } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HERO_PORTRAIT_QUERY, heroVideo } from "@/constants/site";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Phones get a portrait cut with the subject already centred; the landscape cut
// keeps its subjects on the right, so anchor it there on tablets.
const objectPosition = "object-center md:object-[70%_center] lg:object-center";

const noopSubscribe = () => () => {};

/** Data Saver (Chrome/Android) — skip the video entirely. */
function prefersSavedData() {
  if (typeof navigator === "undefined") return false;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return Boolean(connection?.saveData);
}

/**
 * Hero background: poster image renders immediately (LCP), the looping video
 * fades in over it once frames are actually playing. Skipped for reduced-motion
 * and Data Saver users; paused whenever the hero is off-screen or the tab is hidden.
 */
export function HeroMedia() {
  const reduceMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // Server snapshot is `false`, so hydration matches; the real value applies right after.
  const saveData = useSyncExternalStore(
    noopSubscribe,
    prefersSavedData,
    () => false,
  );
  const showVideo = heroVideo.enabled && !reduceMotion && !saveData;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Autoplay can start before hydration, so a missed "playing" event is
    // caught by the first "timeupdate" (fires while frames advance).
    const reveal = () => {
      if (!video.paused && video.currentTime > 0) setPlaying(true);
    };
    video.addEventListener("playing", reveal);
    video.addEventListener("timeupdate", reveal);

    let inView = true;
    const sync = () => {
      if (inView && !document.hidden) void video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    return () => {
      video.removeEventListener("playing", reveal);
      video.removeEventListener("timeupdate", reveal);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [showVideo]);

  // Art-directed poster: each device downloads only its own first frame.
  const common = { alt: "", sizes: "100vw", fetchPriority: "high" as const };
  const {
    props: { srcSet: portraitSrcSet },
  } = getImageProps({
    ...common,
    src: heroVideo.posterPortrait,
    width: 720,
    height: 1280,
  });
  const { props: landscapeProps } = getImageProps({
    ...common,
    src: heroVideo.poster,
    width: 1728,
    height: 1126,
  });

  return (
    <>
      <picture>
        <source media={HERO_PORTRAIT_QUERY} srcSet={portraitSrcSet} />
        <img
          {...landscapeProps}
          alt=""
          className={cn(
            "absolute inset-0 size-full object-cover",
            objectPosition,
          )}
        />
      </picture>
      {showVideo && (
        <motion.video
          ref={videoRef}
          aria-hidden
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          initial={false}
          animate={{ opacity: playing ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={cn(
            "absolute inset-0 size-full object-cover",
            objectPosition,
          )}
        >
          {heroVideo.sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} media={s.media} />
          ))}
        </motion.video>
      )}
    </>
  );
}

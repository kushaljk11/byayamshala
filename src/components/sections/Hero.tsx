"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { ArrowIcon, buttonClasses, Container } from "@/components/ui";
import { siteConfig, whatsappLink } from "@/constants/site";
import { EASE_OUT } from "@/lib/motion";
import { HeroMedia } from "./HeroMedia";

const headline = siteConfig.tagline.split(" ");

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE_OUT, delay },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Media drifts slower than the page; copy lifts away and fades.
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative isolate flex h-svh min-h-[620px] items-end overflow-hidden bg-ink"
    >
      {/* Background media: video when provided, otherwise the poster image */}
      <motion.div style={{ y: mediaY }} className="absolute inset-0 -z-20">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: EASE_OUT }}
          className="relative size-full"
        >
          <HeroMedia />
        </motion.div>
      </motion.div>

      {/* Scrims: keep copy readable over any frame of the video */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/25 to-black/45" />
      <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-black/55 via-transparent to-transparent lg:block" />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="w-full">
        <Container className="pb-16 pt-32 md:pb-24 2xl:pb-28">
          <div className="max-w-[640px] text-white">
            <motion.p
              {...fadeUp(0.3)}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium ring-1 ring-white/15 backdrop-blur-md md:text-[15px]"
            >
              <Image src="/icons/star.svg" alt="" width={24.1688} height={23.0454} className="h-4 w-[17px]" />
              4.9 rating on Google · Itahari since {siteConfig.foundingYear}
            </motion.p>

            <h1 className="mt-5 text-display font-semibold">
              <span className="sr-only">{siteConfig.tagline}</span>
              <span aria-hidden>
                {headline.map((word, i) => (
                  <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top">
                    <motion.span
                      className="inline-block"
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1, ease: EASE_OUT, delay: 0.45 + i * 0.06 }}
                    >
                      {word}&nbsp;
                    </motion.span>
                  </span>
                ))}
              </span>
            </h1>

            <motion.p {...fadeUp(0.9)} className="mt-4 max-w-[500px] text-lead text-white/85">
              Personal training, group classes and nutrition coaching at our Itahari
              gym, or live online wherever you are.
            </motion.p>

            <motion.div {...fadeUp(1)} className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className={buttonClasses("primary")}
              >
                Join Now
                <ArrowIcon />
              </a>
              <a href="#programs" className={buttonClasses("outline-light")}>
                Explore Programs
              </a>
            </motion.div>
          </div>
        </Container>
      </motion.div>
    </section>
  );
}


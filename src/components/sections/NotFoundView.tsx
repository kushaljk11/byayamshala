"use client";

import { motion } from "motion/react";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowIcon, buttonClasses, Container } from "@/components/ui";
import { HERO_PORTRAIT_QUERY, heroVideo, whatsappLink } from "@/constants/site";
import { EASE_OUT } from "@/lib/motion";

const quickLinks = [
  { label: "Programs", hint: "Gym, group & online", href: "/#programs" },
  { label: "Membership", hint: "Plans & pricing", href: "/#pricing" },
  { label: "Coaches", hint: "Meet the team", href: "/#experts" },
  { label: "FAQ", hint: "Quick answers", href: "/#faq" },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE_OUT, delay },
});

/** Branded 404: the hero film's first frame, oversized "404", clear ways back. */
export function NotFoundView() {
  const common = { alt: "", sizes: "100vw" };
  const {
    props: { srcSet: portraitSrcSet },
  } = getImageProps({ ...common, src: heroVideo.posterPortrait, width: 720, height: 1280 });
  const { props: landscapeProps } = getImageProps({
    ...common,
    src: heroVideo.poster,
    width: 1728,
    height: 1126,
  });

  return (
    <section className="relative isolate flex min-h-svh items-center overflow-hidden bg-ink text-white">
      <picture>
        <source media={HERO_PORTRAIT_QUERY} srcSet={portraitSrcSet} />
        <img
          {...landscapeProps}
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover object-center opacity-45 md:object-[70%_center]"
        />
      </picture>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/60" />

      <Container className="py-32 md:py-40">
        <div className="max-w-[720px]">
          <motion.p
            {...fadeUp(0.1)}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium ring-1 ring-white/15 backdrop-blur-md"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            Error 404 · Page not found
          </motion.p>

          {/* Oversized outlined numerals with a light sweep */}
          <motion.p
            aria-hidden
            initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.15 }}
            className="mt-6 select-none text-[clamp(7rem,4rem+18vw,17rem)] font-bold leading-[0.85] tracking-[-0.06em] text-transparent"
          >
            <motion.span
              className="bg-[linear-gradient(110deg,rgb(255_255_255/0.92)_38%,#5cc8f2_47%,#019ee1_50%,#5cc8f2_53%,rgb(255_255_255/0.92)_62%)] bg-[length:250%_100%] bg-clip-text"
              animate={{ backgroundPosition: ["120% 0%", "-120% 0%"] }}
              transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
            >
              404
            </motion.span>
          </motion.p>

          <motion.h1 {...fadeUp(0.35)} className="mt-6 text-display font-semibold">
            This page skipped training day.
          </motion.h1>
          <motion.p {...fadeUp(0.45)} className="mt-4 max-w-[520px] text-lead text-white/75">
            The page you were looking for doesn&apos;t exist or has moved. Let&apos;s get
            you back on track.
          </motion.p>

          <motion.div {...fadeUp(0.55)} className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className={buttonClasses("primary")}>
              Back to home
              <ArrowIcon />
            </Link>
            <a
              href={whatsappLink("Hi Byayamshala! I couldn't find a page on your website.")}
              target="_blank"
              rel="noreferrer"
              className={buttonClasses("outline-light")}
            >
              Chat on WhatsApp
            </a>
          </motion.div>

          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.7 } } }}
            className="mt-12 grid max-w-[640px] grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {quickLinks.map((l) => (
              <motion.li
                key={l.label}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
                }}
              >
                <a
                  href={l.href}
                  className="group/link block rounded-card border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition-[border-color,background-color,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-primary/60 hover:bg-white/[0.08]"
                >
                  <span className="flex items-center justify-between text-[15px] font-semibold">
                    {l.label}
                    <ArrowIcon className="h-2.5 w-3.5 text-primary opacity-0 transition-opacity group-hover/link:opacity-100" />
                  </span>
                  <span className="mt-0.5 block text-[13px] text-white/55">{l.hint}</span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </Container>
    </section>
  );
}

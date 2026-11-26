"use client";

import { useLenis } from "lenis/react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ArrowIcon, buttonClasses, Container, CroppedImage } from "@/components/ui";
import { footerColumns, siteConfig, socialLinks, whatsappLink } from "@/constants/site";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const colTitle = "text-sm font-semibold uppercase tracking-[0.14em] text-white/45";
const contactLink =
  "inline-block py-1 text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline";

/**
 * Footer — follows the page's own system:
 * - black "chapter" panel with a 20px top radius (same as the Explore section)
 * - gradient-sweep headline + single primary accent for the one action (subscribe)
 * - links grouped by intent (Services / Company / Support) for quick scanning
 * - oversized wordmark as a calm brand sign-off
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const wordmarkY = useTransform(scrollYProgress, [0.4, 1], ["40%", "0%"]);
  // Grey → white as the footer arrives (gradient is grey on the left, white on the right).
  const backgroundPosition = useTransform(scrollYProgress, [0, 0.6], ["0% 0%", "100% 0%"]);

  const backToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={ref} id="contact" className="overflow-hidden rounded-t-panel bg-black text-white">
      <Container className="pt-16 md:pt-24 2xl:pt-[120px]">
        {/* Call to action + newsletter */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:items-end lg:gap-16">
          <Reveal>
            <motion.h2
              style={{ backgroundPosition }}
              className="max-w-[620px] bg-[linear-gradient(90deg,#5a5a5a_0%,#5a5a5a_30%,#fff_50%,#fff_100%)] bg-[length:250%_100%] bg-clip-text text-h2 font-semibold text-transparent"
            >
              Ready to Start Your Fitness Journey With Us?
            </motion.h2>
            <p className="mt-4 max-w-[520px] text-lead text-white/65">
              Visit us in Itahari or train online from anywhere. Message us on WhatsApp
              and a coach will help you pick the right program.
            </p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className={buttonClasses("light", "md", "mt-7")}
            >
              Chat on WhatsApp
              <ArrowIcon />
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <Newsletter />
          </Reveal>
        </div>

        <hr className="mt-14 border-white/10 md:mt-20" />

        {/* Brand + link columns */}
        <RevealGroup
          stagger={0.08}
          className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:py-16 md:grid-cols-4 lg:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))_repeat(2,minmax(0,1.3fr))] lg:gap-8"
        >
          <RevealItem className="col-span-2 md:col-span-4 lg:col-span-1">
            <a href="#home" aria-label={`${siteConfig.name} home`} className="inline-block">
              <CroppedImage
                src="/images/logo.png"
                alt={siteConfig.name}
                intrinsic={{ width: 2172, height: 724 }}
                crop={{ width: 109.59, height: 126.8, left: -4.29, top: -14.01 }}
                className="aspect-[278/80] w-[190px]"
              />
            </a>
            <p className="mt-4 max-w-[300px] text-[15px] leading-relaxed text-white/60">
              {siteConfig.tagline}
            </p>
            <ul className="mt-6 flex gap-2.5">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="block rounded-full transition-transform duration-300 ease-out-expo hover:-translate-y-0.5 hover:scale-110"
                  >
                    <Image src={s.icon} alt="" width={40} height={40} className="size-9" />
                  </a>
                </li>
              ))}
            </ul>
          </RevealItem>

          {footerColumns.map((col) => (
            <RevealItem key={col.title}>
              <h3 className={colTitle}>{col.title}</h3>
              <ul className="mt-4 space-y-1.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group/link inline-flex items-center py-1 text-[15px] text-white/80 transition-colors hover:text-white"
                    >
                      <span className="h-px w-0 bg-primary transition-[width,margin] duration-300 ease-out-expo group-hover/link:mr-2 group-hover/link:w-3" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}

          <RevealItem className="col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className={colTitle}>Visit us</h3>
            <address className="mt-5 text-[15px] not-italic leading-relaxed text-white/80">
              {siteConfig.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <p className="mt-3 text-[15px] text-white/60">{siteConfig.hours.display}</p>
            <a
              href={siteConfig.address.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="group/btn mt-3 inline-flex items-center gap-2 py-1 text-[15px] font-medium text-primary transition-colors hover:text-white"
            >
              Get directions
              <ArrowIcon />
            </a>
          </RevealItem>

          <RevealItem className="col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className={colTitle}>Get in touch</h3>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li>
                <span className="block text-xs uppercase tracking-[0.12em] text-white/40">Phone</span>
                <a href={siteConfig.phone.href} className={contactLink}>
                  {siteConfig.phone.display}
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-[0.12em] text-white/40">WhatsApp</span>
                <a href={whatsappLink()} target="_blank" rel="noreferrer" className={contactLink}>
                  {siteConfig.whatsapp.display}
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-[0.12em] text-white/40">Email</span>
                <a href={`mailto:${siteConfig.email}`} className={cn(contactLink, "break-words")}>
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </RevealItem>
        </RevealGroup>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-white/10 py-6 text-sm text-white/50 sm:flex-row sm:items-center">
          <p>
            © {siteConfig.year} {siteConfig.name}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={backToTop}
            className="group/top inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
          >
            Back to top
            <span className="flex size-8 items-center justify-center rounded-full border border-white/20 transition-[transform,border-color] duration-300 ease-out-expo group-hover/top:-translate-y-0.5 group-hover/top:border-white/60">
              <ArrowIcon className="h-2.5 w-3 -rotate-90 group-hover/btn:translate-x-0" />
            </span>
          </button>
        </div>
      </Container>

      {/* Oversized wordmark sign-off */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <motion.p
          style={{ y: wordmarkY }}
          className="-mb-[0.22em] text-center text-[clamp(3.5rem,15.5vw,17rem)] font-bold leading-none tracking-[-0.05em] bg-gradient-to-b from-white/[0.16] to-white/[0.02] bg-clip-text text-transparent"
        >
          {siteConfig.name}
        </motion.p>
      </div>
    </footer>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    // TODO: connect to the newsletter provider / API.
    setStatus("done");
    setEmail("");
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor="newsletter-email" className="text-sm font-semibold uppercase tracking-[0.14em] text-white/45">
        Stay up to date
      </label>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          aria-invalid={status === "error"}
          aria-describedby="newsletter-status"
          className="h-12 w-full min-w-0 rounded-lg sm:flex-1 border border-white/15 bg-white/[0.06] px-4 text-[15px] text-white placeholder:text-white/40 transition-colors focus:border-primary focus:outline-none"
        />
        <button type="submit" className={buttonClasses("primary", "md")}>
          Subscribe
          <ArrowIcon />
        </button>
      </div>
      <motion.p
        id="newsletter-status"
        aria-live="polite"
        key={status}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className={
          status === "error"
            ? "mt-3 text-sm text-red-400"
            : status === "done"
              ? "mt-3 text-sm text-primary"
              : "mt-3 text-sm text-white/50"
        }
      >
        {status === "error"
          ? "Please enter a valid email address."
          : status === "done"
            ? "Thanks! You're on the list."
            : "Training tips, nutrition guides and class updates from our coaches. No spam."}
      </motion.p>
    </form>
  );
}

"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Container, CroppedImage } from "@/components/ui";
import { EASE_OUT } from "@/lib/motion";

// TODO: point these at the real app listings once the app is published.
const stores = [
  { href: "https://www.apple.com/app-store/", label: "Download on the", name: "App Store", Icon: AppleLogo },
  { href: "https://play.google.com/store", label: "Get it on", name: "Google Play", Icon: GooglePlayLogo },
];

const phone = {
  src: "/images/iphone-mockup.png",
  alt: "Byayamshala app home screen on an iPhone",
  intrinsic: { width: 1742, height: 3609 },
  crop: { width: 100.07, height: 117.45, left: -0.04, top: 0 },
};

export function AppCta() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [140, 0]);

  return (
    <section id="download" className="scroll-mt-20 pb-20 pt-20 md:pb-28 md:pt-28 2xl:pb-[140px] 2xl:pt-[140px]">
      <Container>
        <div ref={ref} className="relative lg:pt-[184px]">
          <div className="relative isolate overflow-hidden rounded-2xl px-6 pt-12 md:px-[93px] lg:min-h-[515px] lg:py-[108px]">
            <Image
              src="/images/cta-bg.png"
              alt=""
              fill
              sizes="(min-width: 1728px) 1528px, 100vw"
              className="-z-10 object-cover"
            />
            {/* Keep clear of the phone (left edge at ~62% of the card) on narrower desktops */}
            <Reveal className="max-w-[640px] lg:max-w-[min(640px,calc(62%-120px))]">
              <h2 className="text-h2 font-semibold">
                Your Coach, Your Plan and Your Progress,{" "}
                <span className="text-primary">All in One App</span>
              </h2>
              <p className="mt-4 text-lead text-muted-foreground">
                Book classes, follow your workout and meal plan, and message your coach,
                whether you train in Itahari or online.
              </p>
              <ul className="mt-8 flex flex-wrap gap-3">
                {stores.map(({ href, label, name, Icon }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${label} ${name}`}
                      className="flex h-14 w-[166px] items-center gap-2.5 whitespace-nowrap rounded-xl bg-black px-3.5 sm:w-[176px] sm:gap-3 sm:px-4 text-white ring-1 ring-white/10 transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-14px_rgb(0_0_0/0.6)] active:scale-[0.98]"
                    >
                      <Icon />
                      <span className="flex flex-col leading-none">
                        <span className="text-[11px] font-medium text-white/75">{label}</span>
                        <span className="mt-1 text-[18px] font-semibold tracking-[-0.01em] sm:text-[19px]">{name}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Small screens: phone rises out of the bottom of the card */}
            <div className="mx-auto mt-10 aspect-[396/520] w-[68%] max-w-[300px] overflow-hidden lg:hidden">
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "0px 0px -5% 0px" }}
                transition={{ duration: 1.1, ease: EASE_OUT }}
              >
                <CroppedImage {...phone} className="aspect-[396/699] w-full" />
              </motion.div>
            </div>
          </div>

          {/* Desktop: phone rises 184px above the card (Figma: 396×699 at x=954 within the card) */}
          {/* Clip layer: the phone may rise above the card but never shows below it */}
          <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
            <motion.div
              style={{ y: phoneY }}
              className="absolute bottom-0 right-[11.65%] aspect-[396/699] w-[25.9%] max-w-[396px]"
            >
              <CroppedImage {...phone} className="size-full" />
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function AppleLogo() {
  return (
    <svg aria-hidden viewBox="0 0 384 512" className="h-7 w-6 shrink-0" fill="currentColor">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function GooglePlayLogo() {
  return (
    <svg aria-hidden viewBox="0 0 24 26" className="h-7 w-6 shrink-0">
      <path fill="#00D7FE" d="M1.1.6C.8.9.6 1.4.6 2v22c0 .6.2 1.1.5 1.4l.1.1L13.5 13.2v-.3L1.2.5z" />
      <path fill="#FFCE00" d="m17.6 17.3-4.1-4.1v-.3l4.1-4.1.1.1 4.9 2.8c1.4.8 1.4 2.1 0 2.9l-4.9 2.8z" />
      <path fill="#FF3A44" d="m17.7 17.2-4.2-4.2L1.1 25.4c.5.5 1.2.5 2.1.1l14.5-8.3" />
      <path fill="#48FF48" d="M17.7 8.8 3.2.5C2.3 0 1.6.1 1.1.6L13.5 13z" />
    </svg>
  );
}

import { ScrollTextBand } from "@/components/motion/ScrollTextBand";
import { AppCta } from "@/components/sections/AppCta";
import { Experts } from "@/components/sections/Experts";
import { Explore } from "@/components/sections/Explore";
import { Faq } from "@/components/sections/Faq";
import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Pricing } from "@/components/sections/Pricing";
import { Programs } from "@/components/sections/Programs";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Journey />
      <Stats />
      <ScrollTextBand text="Your Personal Fitness Team — Wherever You Are" />
      <Features />
      <Programs />
      <Explore />
      <Pricing />
      <Testimonials />
      <Experts />
      <Faq />
      <AppCta />
    </>
  );
}

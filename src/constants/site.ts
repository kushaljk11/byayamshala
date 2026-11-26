import type { NavItem, NavLink } from "@/types";

export const siteConfig = {
  name: "Byayamshala",
  legalName: "The Byayamshala",
  // TODO: confirm the production domain (used for canonical URLs and share images).
  url: "https://www.thebyayamshala.com.np",
  tagline: "Your Goals. Your Journey. Your Personal Fitness Team.",
  /** Page title shown in search results (~60 characters). */
  seoTitle: "Byayamshala | Gym, Personal Training & Online Coaching in Itahari",
  /** Meta description shown under the title in search results (~155 characters). */
  description:
    "Byayamshala is a gym in Itahari, Nepal offering personal training, group classes, nutrition plans and online weight-loss coaching anywhere in the world.",
  keywords: [
    "gym in Itahari",
    "personal trainer Itahari",
    "fitness center Sunsari",
    "online weight loss coaching Nepal",
    "group fitness classes Itahari",
    "nutrition plan Nepal",
    "Byayamshala",
  ],
  foundingYear: 2018,
  year: 2026,
  email: "support@thebyayamshala.com.np",
  phone: { display: "+977-25-580773", href: "tel:+97725580773" },
  whatsapp: { display: "+977 981-6321352", number: "9779816321352" },
  address: {
    lines: ["2nd & 3rd Floor, Blue Glass Building", "B.P. Chowk, Bir Ganesh Man Sadak", "Itahari, Sunsari, Nepal"],
    street: "2nd & 3rd Floor, Blue Glass Building, B.P. Chowk, Bir Ganesh Man Sadak",
    locality: "Itahari",
    region: "Sunsari",
    country: "NP",
    mapUrl: "https://maps.app.goo.gl/Ymwmtp8fC2ZpnmmN8",
  },
  hours: { display: "Sun – Fri · 5:00 AM – 9:00 PM", opens: "05:00", closes: "21:00" },
};

/** WhatsApp chat link with an optional pre-filled message — the site's main way to join. */
export function whatsappLink(message = "Hi Byayamshala! I'd like to know more about joining.") {
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export type VideoSource = { src: string; type: string; media?: string };

/**
 * Hero background loop — built by scripts/hero-video/build-film.sh into /public/videos
 * (licensed Mixkit 4K footage). Phones get a dedicated portrait cut with the
 * subjects centred; larger screens get the landscape cut (subjects on the right).
 * The browser picks the first source it can play. Posters are each cut's exact
 * first frame. Set `enabled` to false to fall back to the poster image only.
 */
export const HERO_PORTRAIT_QUERY = "(max-width: 767px)";

export const heroVideo: {
  enabled: boolean;
  poster: string;
  posterPortrait: string;
  sources: VideoSource[];
} = {
  enabled: true,
  poster: "/videos/hero-poster.jpg",
  posterPortrait: "/videos/hero-poster-portrait.jpg",
  sources: [
    { src: "/videos/hero-portrait.webm", type: "video/webm", media: HERO_PORTRAIT_QUERY },
    { src: "/videos/hero-portrait.mp4", type: "video/mp4", media: HERO_PORTRAIT_QUERY },
    { src: "/videos/hero-1728.webm", type: "video/webm" },
    { src: "/videos/hero-1728.mp4", type: "video/mp4" },
  ],
};

export const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/thebyayamshala", icon: "/icons/social-facebook.svg" },
  { label: "Instagram", href: "https://www.instagram.com/thebyayamshalafitness", icon: "/icons/social-instagram.svg" },
  { label: "TikTok", href: "https://www.tiktok.com/@thebyayamshalaofficial", icon: "/icons/social-tiktok.svg" },
];

export const navLinks: NavItem[] = [
  { label: "Home", href: "#home" },
  {
    label: "Services",
    href: "#services",
    children: [
      { label: "Personal Training", href: "#features", description: "Workouts built around your goals" },
      { label: "Personal Nutrition", href: "#features", description: "Meal plans with familiar foods" },
      { label: "Live Online Coaching", href: "#explore", description: "Train live with your coach, anywhere" },
      { label: "All Programs", href: "#programs", description: "Gym, group and online programs" },
    ],
  },
  { label: "Pricing", href: "#pricing" },
  {
    label: "About",
    href: "#about",
    children: [
      { label: "Our Experts", href: "#experts", description: "Certified trainers who guide you" },
      { label: "Testimonials", href: "#testimonials", description: "Real people, real transformations" },
      { label: "FAQ", href: "#faq", description: "Answers to common questions" },
    ],
  },
  { label: "Blogs", href: "#blogs" },
];

/** Which nav item is "active" while each page section is in view (scroll-spy). */
export const sectionNav: Record<string, string> = {
  home: "Home",
  services: "Services",
  features: "Services",
  programs: "Services",
  explore: "Services",
  about: "About",
  testimonials: "About",
  experts: "About",
  faq: "About",
  pricing: "Pricing",
};

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Programs",
    links: [
      { label: "Personal Training", href: "#programs" },
      { label: "Strength & Functional", href: "#programs" },
      { label: "Online Weight Loss", href: "#programs" },
      { label: "Group Classes", href: "#programs" },
      { label: "Membership Plans", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Our Coaches", href: "#experts" },
      { label: "Success Stories", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
      { label: "Get the App", href: "#download" },
      // TODO: add Blogs, Privacy Policy and Terms once those pages exist.
    ],
  },
];

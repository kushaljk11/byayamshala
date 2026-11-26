"use client";

import { useLenis } from "lenis/react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowIcon, CroppedImage } from "@/components/ui";
import {
  navLinks,
  sectionNav,
  siteConfig,
  socialLinks,
  whatsappLink,
} from "@/constants/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

/** Sections watched by the scroll-spy (ones not in `sectionNav` clear the highlight). */
const SPY_IDS = [...Object.keys(sectionNav), "download", "contact"];

const SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 36,
  mass: 0.8,
} as const;

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "h-[6px] w-[9px] shrink-0 transition-transform duration-300",
        className,
      )}
    >
      <path d="m1 1.5 5 5 5-5" />
    </svg>
  );
}

function Logo({ compact }: { compact: boolean }) {
  return (
    <a href="#home" aria-label={`${siteConfig.name} home`} className="shrink-0">
      {/* Figma frame 278×80 with a cropped fill of the 2172×724 logo */}
      <CroppedImage
        src="/images/logo.png"
        alt={siteConfig.name}
        intrinsic={{ width: 2172, height: 724 }}
        crop={{ width: 109.59, height: 126.8, left: -4.29, top: -14.01 }}
        loading="eager"
        className={cn(
          "aspect-[278/80] transition-[width] duration-700 ease-out-expo",
          compact ? "w-[124px] md:w-[136px]" : "w-[150px] md:w-[184px]",
        )}
      />
    </a>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const lenis = useLenis();
  const activeSection = useActiveSection(SPY_IDS);
  const activeNav = activeSection ? (sectionNav[activeSection] ?? null) : null;

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  useEffect(() => {
    if (menuOpen) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, lenis]);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const compact = scrolled && !menuOpen;

  return (
    <motion.header
      // Opacity only: a transform here would make the fixed mobile menu
      // position itself against the header instead of the viewport.
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50"
    >
      {/* Same gutters as <Container>, so the floating pill spans exactly the content width */}
      <div className="relative z-10 mx-auto w-full max-w-site px-4 sm:px-6 lg:px-10 2xl:px-[100px]">
        {/* The bar: transparent at the top, a floating glass pill once scrolled */}
        <div
          className={cn(
            "pointer-events-auto relative flex items-center justify-between transition-[margin,padding,border-radius,background-color,border-color,box-shadow] duration-700 ease-out-expo",
            compact
              ? "mt-3 rounded-full border border-white/10 bg-ink/85 py-2 pl-5 pr-2 shadow-[0_18px_50px_-18px_rgb(0_0_0/0.65)] backdrop-blur-xl md:mt-4 md:pl-6"
              : "mt-0 rounded-none border border-transparent px-0 py-4 md:py-6",
          )}
        >
          <Logo compact={compact} />

          {/* Desktop navigation */}
          <nav
            aria-label="Main"
            className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
          >
            <LayoutGroup id="main-nav">
              <ul
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  "flex items-center gap-0.5 rounded-full p-1 text-[14px] font-medium transition-[background-color,border-color] duration-700",
                  compact
                    ? "border border-transparent bg-transparent"
                    : "border border-white/15 bg-white/[0.06] backdrop-blur-md",
                )}
              >
                {navLinks.map((item) => (
                  <DesktopItem
                    key={item.label}
                    item={item}
                    active={activeNav === item.label}
                    hovered={hovered === item.label}
                    onHover={() => setHovered(item.label)}
                  />
                ))}
              </ul>
            </LayoutGroup>
          </nav>

          <div className="flex items-center gap-1.5">
            <a
              href="#login"
              className="hidden rounded-full px-4 py-2.5 text-[14px] font-medium text-white/80 transition-colors hover:text-white sm:block"
            >
              Login
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="group/btn hidden h-10 items-center gap-2 rounded-full bg-primary pl-5 pr-4 text-[14px] font-semibold text-white shadow-[0_8px_24px_-10px_rgb(1_158_225/0.9)] transition-[background-color,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:bg-[#0190cd] active:scale-[0.97] sm:inline-flex"
            >
              Join Now
              <ArrowIcon className="h-2.5 w-3.5" />
            </a>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="relative flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md transition-colors hover:bg-white/15 lg:hidden"
            >
              <span
                className={cn(
                  "absolute h-[1.5px] w-[18px] rounded bg-white transition-transform duration-500 ease-out-expo",
                  menuOpen ? "rotate-45" : "-translate-y-[4px]",
                )}
              />
              <span
                className={cn(
                  "absolute h-[1.5px] w-[18px] rounded bg-white transition-transform duration-500 ease-out-expo",
                  menuOpen ? "-rotate-45" : "translate-y-[4px]",
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        activeNav={activeNav}
        onClose={() => setMenuOpen(false)}
      />
    </motion.header>
  );
}

function DesktopItem({
  item,
  active,
  hovered,
  onHover,
}: {
  item: NavItem;
  active: boolean;
  hovered: boolean;
  onHover: () => void;
}) {
  const label = (
    <>
      {/* Sliding pills: one marks the section in view, one follows the pointer */}
      {active && (
        <motion.span
          layoutId="nav-active"
          transition={SPRING}
          className="absolute inset-0 -z-10 rounded-full bg-white/[0.14] shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]"
        />
      )}
      {hovered && !active && (
        <motion.span
          layoutId="nav-hover"
          transition={SPRING}
          className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]"
        />
      )}
      <span className="relative">{item.label}</span>
      {item.children && (
        <Chevron className="group-hover:rotate-180 group-focus-within:rotate-180" />
      )}
    </>
  );

  const itemClass = cn(
    "relative isolate flex items-center gap-1.5 rounded-full px-4 py-2 transition-colors duration-300",
    active ? "text-white" : "text-white/70 hover:text-white",
  );

  if (!item.children) {
    return (
      <li onMouseEnter={onHover}>
        <a
          href={item.href}
          aria-current={active ? "true" : undefined}
          className={itemClass}
        >
          {label}
        </a>
      </li>
    );
  }

  return (
    <li onMouseEnter={onHover} className="group relative">
      <button type="button" aria-haspopup="true" className={itemClass}>
        {label}
      </button>
      {/* Dropdown — dark glass to match the bar; opens on hover or keyboard focus */}
      <div className="invisible absolute left-1/2 top-full w-[300px] -translate-x-1/2 pt-3 opacity-0 transition-[opacity,visibility] duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <ul className="translate-y-1.5 rounded-2xl border border-white/10 bg-[#121315] p-2 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)] backdrop-blur-xl transition-transform duration-500 ease-out-expo group-focus-within:translate-y-0 group-hover:translate-y-0">
          {item.children.map((child) => (
            <li key={child.label}>
              <a
                href={child.href}
                className="group/link flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 transition-colors hover:bg-white/[0.06]"
              >
                <span>
                  <span className="block text-[14px] font-semibold text-white">
                    {child.label}
                  </span>
                  {child.description && (
                    <span className="mt-0.5 block text-[13px] font-normal text-white/55">
                      {child.description}
                    </span>
                  )}
                </span>
                <ArrowIcon className="h-2.5 w-3.5 -translate-x-1 text-primary opacity-0 transition-[opacity,transform] duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function MobileMenu({
  open,
  activeNav,
  onClose,
}: {
  open: boolean;
  activeNav: string | null;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 0.35 }}
          className="pointer-events-auto fixed inset-0 flex flex-col overflow-y-auto bg-ink/[0.97] px-6 pb-8 pt-24 backdrop-blur-2xl lg:hidden"
        >
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{
              show: {
                transition: { staggerChildren: 0.06, delayChildren: 0.08 },
              },
            }}
            className="flex flex-col"
          >
            {navLinks.map((item, i) => {
              const active = activeNav === item.label;
              const isOpen = expanded === item.label;
              const row = (
                <>
                  <span className="flex items-baseline gap-4">
                    <span className="w-6 text-xs font-medium tabular-nums text-white/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-[28px] font-semibold tracking-[-0.02em]",
                        active ? "text-white" : "text-white/75",
                      )}
                    >
                      {item.label}
                    </span>
                    {active && (
                      <span
                        aria-hidden
                        className="size-1.5 -translate-y-1 rounded-full bg-primary"
                      />
                    )}
                  </span>
                  {item.children && (
                    <Chevron
                      className={cn(
                        "h-2 w-3 text-white/60",
                        isOpen && "rotate-180",
                      )}
                    />
                  )}
                </>
              );
              return (
                <motion.li
                  key={item.label}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: EASE_OUT },
                    },
                  }}
                  className="border-b border-white/10"
                >
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setExpanded(isOpen ? null : item.label)}
                        className="flex w-full items-center justify-between py-4"
                      >
                        {row}
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: EASE_OUT }}
                            className="overflow-hidden pl-10"
                          >
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <a
                                  href={child.href}
                                  onClick={onClose}
                                  className="block py-2.5 last:pb-5"
                                >
                                  <span className="block text-base font-medium text-white">
                                    {child.label}
                                  </span>
                                  {child.description && (
                                    <span className="block text-sm text-white/50">
                                      {child.description}
                                    </span>
                                  )}
                                </a>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <a
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "true" : undefined}
                      className="flex items-center justify-between py-4"
                    >
                      {row}
                    </a>
                  )}
                </motion.li>
              );
            })}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.35 }}
            className="mt-auto pt-10"
          >
            <div className="grid grid-cols-2 gap-3">
              <a
                href="#login"
                onClick={onClose}
                className="flex h-12 items-center justify-center rounded-full border border-white/20 text-[15px] font-semibold text-white"
              >
                Login
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                onClick={onClose}
                className="group/btn flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-semibold text-white"
              >
                Join Now
                <ArrowIcon className="h-2.5 w-3.5" />
              </a>
            </div>
            <ul className="mt-6 flex justify-center gap-2.5">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                  >
                    <Image
                      src={s.icon}
                      alt=""
                      width={40}
                      height={40}
                      className="size-9"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

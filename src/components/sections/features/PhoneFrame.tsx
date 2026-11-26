import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Minimal modern phone: thin dark bezel, dynamic island, status bar. */
export function PhoneFrame({
  children,
  className,
  lightStatus = false,
}: {
  children: ReactNode;
  className?: string;
  /** White status bar for screens with dark/full-bleed content (e.g. video calls). */
  lightStatus?: boolean;
}) {
  return (
    <div
      // Decorative app mock-up: hidden from screen readers so its headings and
      // tiny UI labels do not clutter the page outline.
      aria-hidden
      className={cn(
        "relative rounded-[46px] bg-[#0d0e10] p-[9px] shadow-[0_50px_90px_-35px_rgb(15_23_42/0.55),inset_0_0_0_1.5px_rgb(255_255_255/0.08)]",
        className,
      )}
    >
      {/* side buttons */}
      <span
        aria-hidden
        className="absolute -left-[3px] top-[18%] h-10 w-[3px] rounded-l bg-[#0d0e10]"
      />
      <span
        aria-hidden
        className="absolute -right-[3px] top-[24%] h-16 w-[3px] rounded-r bg-[#0d0e10]"
      />

      <div className="relative aspect-[9/19.2] overflow-hidden rounded-[38px] bg-[#f3f5f8]">
        <div
          aria-hidden
          className="absolute left-1/2 top-2.5 z-30 h-[24px] w-[31%] -translate-x-1/2 rounded-full bg-black"
        />
        <div
          aria-hidden
          className={cn(
            "relative z-20 flex h-11 items-center justify-between px-7 pt-1 text-[12px] font-semibold transition-colors duration-500",
            lightStatus ? "text-white" : "text-foreground",
          )}
        >
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 18 12" className="h-2.5 w-4" fill="currentColor">
              <rect x="0" y="8" width="3" height="4" rx="1" />
              <rect x="5" y="5" width="3" height="7" rx="1" />
              <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
              <rect x="15" y="0" width="3" height="12" rx="1" />
            </svg>
            <svg
              viewBox="0 0 26 12"
              className="h-2.5 w-6"
              fill="none"
              stroke="currentColor"
            >
              <rect
                x="0.5"
                y="0.5"
                width="22"
                height="11"
                rx="3"
                opacity=".4"
              />
              <rect
                x="2.5"
                y="2.5"
                width="16"
                height="7"
                rx="1.5"
                fill="currentColor"
                stroke="none"
              />
              <path d="M24.5 4v4" strokeLinecap="round" opacity=".5" />
            </svg>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

/** Arrow matching the Figma "Get Started Now →" icon; nudges right on button hover. */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "h-3 w-4 shrink-0 transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-1",
        className,
      )}
    >
      <path d="M1 7h18M13.3 13 19 7l-5.7-6" />
    </svg>
  );
}

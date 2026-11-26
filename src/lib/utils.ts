import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/** Teach tailwind-merge about the custom tokens in globals.css. */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "h2", "h3", "h4", "lead", "stat", "mega"] }],
      // --container-site → lets `<Container className="max-w-[760px]">` override max-w-site
      "max-w": [{ "max-w": ["site"] }],
      // --radius-card / --radius-panel
      rounded: [{ rounded: ["card", "panel"] }],
    },
  },
});

/** Merge Tailwind classes; later classes win over conflicting earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

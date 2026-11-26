import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Type hierarchy — see the fluid scale in globals.css. */
const levels = {
  h1: "text-display font-semibold",
  h2: "text-h2 font-semibold",
  h3: "text-h3 font-semibold",
  h4: "text-h4 font-semibold",
} as const;

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: keyof typeof levels;
};

export function Heading({ as: Tag = "h2", className, ...props }: HeadingProps) {
  return <Tag className={cn("font-heading", levels[Tag], className)} {...props} />;
}

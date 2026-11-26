import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const levels = {
  h1: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
  h2: "text-3xl md:text-4xl font-bold tracking-tight",
  h3: "text-2xl md:text-3xl font-semibold",
  h4: "text-xl font-semibold",
} as const;

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: keyof typeof levels;
};

export function Heading({ as: Tag = "h2", className, ...props }: HeadingProps) {
  return <Tag className={cn("font-heading", levels[Tag], className)} {...props} />;
}

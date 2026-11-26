import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
} as const;

type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  size?: keyof typeof sizes;
  muted?: boolean;
};

export function Text({ size = "base", muted, className, ...props }: TextProps) {
  return (
    <p
      className={cn(
        "leading-relaxed",
        sizes[size],
        muted && "text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

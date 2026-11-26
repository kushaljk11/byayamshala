import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Page-width wrapper. At the Figma width (1728px) content sits 100px from each edge. */
export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-site px-4 sm:px-6 lg:px-10 2xl:px-[100px]",
        className,
      )}
      {...props}
    />
  );
}

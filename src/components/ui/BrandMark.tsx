import { CroppedImage } from "./CroppedImage";
import { cn } from "@/lib/utils";

/** The "B" symbol on its own, cropped from the full logo artwork. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <CroppedImage
      src="/images/logo.png"
      alt=""
      intrinsic={{ width: 2172, height: 724 }}
      crop={{ width: 449.4, height: 137.5, left: -22.5, top: -17.5 }}
      className={cn("aspect-[483/527] shrink-0", className)}
    />
  );
}

import type { CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type Crop = {
  /** Size and offset of the image relative to its frame, in percent (from Figma). */
  width: number;
  height: number;
  left: number;
  top: number;
};

type CroppedImageProps = {
  src: string;
  alt: string;
  /** Intrinsic pixel size of the source file. */
  intrinsic: { width: number; height: number };
  crop: Crop;
  className?: string;
  style?: CSSProperties;
  loading?: "eager" | "lazy";
};

/**
 * Reproduces Figma's "crop" image fill: the image is scaled/offset inside a
 * clipping frame. The frame's size comes from `className`.
 */
export function CroppedImage({
  src,
  alt,
  intrinsic,
  crop,
  className,
  style,
  loading,
}: CroppedImageProps) {
  return (
    <div className={cn("relative overflow-hidden", className)} style={style}>
      <Image
        src={src}
        alt={alt}
        width={intrinsic.width}
        height={intrinsic.height}
        loading={loading}
        className="absolute max-w-none"
        style={{
          width: `${crop.width}%`,
          height: `${crop.height}%`,
          left: `${crop.left}%`,
          top: `${crop.top}%`,
        }}
      />
    </div>
  );
}

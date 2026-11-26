import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_8px_24px_-12px_rgb(1_158_225/0.8)] hover:bg-[#0190cd] hover:shadow-[0_14px_30px_-12px_rgb(1_158_225/0.9)]",
  /** White button on dark backgrounds (hero "Get Started", header "Login"). */
  light: "bg-white text-foreground hover:bg-white/90",
  /** White outline on dark backgrounds (hero "Watch tutorial"). */
  "outline-light":
    "border border-white/80 text-white backdrop-blur-sm hover:border-white hover:bg-white/10",
} as const;

const sizes = {
  sm: "h-10 rounded-lg px-4 text-sm",
  md: "h-12 rounded-lg px-6 text-[15px] md:text-base",
  lg: "h-13 rounded-lg px-6 text-base md:text-[17px]",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(
    // `group/btn` lets icons inside react to hover (e.g. arrow nudge)
    "group/btn inline-flex items-center justify-center gap-2.5 font-semibold whitespace-nowrap",
    "transition-[background-color,border-color,box-shadow,transform] duration-300 ease-out-expo active:scale-[0.97] hover:-translate-y-0.5",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}

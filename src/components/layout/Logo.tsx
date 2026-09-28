import { cn } from "../../utils/cn";

const ASSETS = {
  default: "/brand/branchly-logo.svg",
  dark: "/brand/branchly-logo-dark.svg",
  icon: "/brand/branchly-icon.svg",
  iconDark: "/brand/branchly-icon-dark.svg",
} as const;

export type LogoVariant = keyof typeof ASSETS;

export function Logo({
  variant = "default",
  className,
}: {
  variant?: LogoVariant;
  className?: string;
}) {
  const isHorizontal = variant === "default" || variant === "dark";
  return (
    <img
      src={ASSETS[variant]}
      alt="Branchly"
      draggable={false}
      aria-hidden={false}
      className={cn(
        "pointer-events-none select-none",
        isHorizontal ? "h-8 w-auto" : "h-8 w-8",
        className,
      )}
    />
  );
}
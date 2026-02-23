// src/components/Card.tsx
import type { HTMLAttributes, PropsWithChildren } from "react";

type Variant = "glass" | "raised" | "inset";

export function Card(
  props: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { variant?: Variant }>,
) {
  const { className = "", variant = "glass", children, ...rest } = props;

  const base =
    "relative overflow-hidden rounded-[28px] border " +
    "backdrop-blur-xl backdrop-saturate-150 " +
    "transition-transform duration-200 ease-out active:scale-[0.995]";

  const border = "border-black/5 dark:border-white/10";
  const bg = "bg-[rgb(var(--color-card))]";

  const shadow =
    variant === "inset"
      ? "shadow-ios-card-inset"
      : variant === "raised"
        ? "shadow-ios-card"
        : "shadow-ios-card-soft";

  return (
    <div className={`${base} ${bg} ${border} ${shadow} ${className}`} {...rest}>
      {/* iOS-like internal highlight */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-gradient-to-b from-white/18 via-white/6 to-transparent dark:from-white/14 dark:via-white/4" />
      </div>

      {/* condensation droplets */}
      <div className="wa-card-surface" />

      <div className="relative">{children}</div>
    </div>
  );
}
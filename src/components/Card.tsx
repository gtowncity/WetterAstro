import type { HTMLAttributes, PropsWithChildren } from "react";

type Variant = "glass" | "raised" | "inset";

/**
 * iOS-like frosted glass card.
 * - backdrop blur ~24px (backdrop-blur-xl)
 * - soft border + very soft shadow
 * - subtle highlight gradient inside
 */
export function Card(
  props: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { variant?: Variant }>,
) {
  const { className = "", variant = "glass", children, ...rest } = props;

  const base =
    "relative overflow-hidden rounded-[28px] border backdrop-blur-xl backdrop-saturate-150 " +
    "transition-transform duration-200 ease-out active:scale-[0.99]";

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
      {/* subtle “glass highlight” */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/8 to-transparent dark:from-white/20 dark:via-white/5" />
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}
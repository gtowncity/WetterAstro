import type { HTMLAttributes, PropsWithChildren } from "react";

type Variant = "raised" | "inset";

export function Card(
  props: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { variant?: Variant }>
) {
  const { className = "", variant = "raised", children, ...rest } = props;

  const lightShadow = variant === "inset" ? "shadow-neu-inset" : "shadow-neu";

  return (
    <div
      {...rest}
      className={[
        "rounded-3xl p-4 transition-all duration-200",
        "bg-[rgb(var(--color-card))] text-[rgb(var(--color-fg))]",
        lightShadow,
        // Glass: wir nehmen 24px Blur (liegt in deinem 10–30px Zielbereich).
        // Tailwind erlaubt arbitrary blur values: backdrop-blur-[24px] :contentReference[oaicite:3]{index=3}
        "dark:bg-[rgb(var(--color-card))] dark:backdrop-blur-[24px] dark:border dark:border-white/10 dark:shadow-glass",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
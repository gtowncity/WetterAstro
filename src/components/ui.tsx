import type { HTMLAttributes, PropsWithChildren } from "react";

export function GlassCard(
  props: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { className?: string }>
) {
  const { className = "", children, ...rest } = props;

  return (
    <div
      {...rest}
      className={[
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function Pill(props: {
  label: string;
  state: "ok" | "warn" | "bad";
  className?: string;
}) {
  const c =
    props.state === "ok"
      ? "bg-emerald-500/20 text-emerald-100 border-emerald-400/20"
      : props.state === "warn"
      ? "bg-amber-500/20 text-amber-100 border-amber-400/20"
      : "bg-rose-500/20 text-rose-100 border-rose-400/20";

  return (
    <span
      className={[
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border",
        c,
        props.className ?? "",
      ].join(" ")}
    >
      {props.label}
    </span>
  );
}

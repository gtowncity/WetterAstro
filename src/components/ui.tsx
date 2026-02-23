import React from "react";

export function GlassCard(props: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10",
        "bg-white/[0.06]",
        "backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
        props.className || "",
      ].join(" ")}
    >
      {props.children}
    </div>
  );
}

export function Pill(props: { label: string; state: "ok" | "warn" | "bad"; className?: string }) {
  const c =
    props.state === "ok"
      ? "bg-emerald-500/20 text-emerald-100 border-emerald-400/20"
      : props.state === "warn"
      ? "bg-amber-500/20 text-amber-100 border-amber-400/20"
      : "bg-rose-500/20 text-rose-100 border-rose-400/20";

  return (
    <span
      className={[
        "px-2.5 py-1 rounded-full text-xs border backdrop-blur-xl",
        c,
        props.className || "",
      ].join(" ")}
    >
      {props.label}
    </span>
  );
}
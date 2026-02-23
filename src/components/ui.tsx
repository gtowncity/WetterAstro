import type { HTMLAttributes, PropsWithChildren } from "react";
import { Card } from "./Card";

export function GlassCard(props: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { className?: string }>) {
  // Legacy wrapper -> neue Card
  const { className = "", ...rest } = props;
  return <Card className={className} {...rest} />;
}

export function Pill(props: { label: string; state: "ok" | "warn" | "bad"; className?: string }) {
  const c =
    props.state === "ok"
      ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-100"
      : props.state === "warn"
      ? "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-100"
      : "border-rose-500/30 bg-rose-500/15 text-rose-700 dark:text-rose-100";

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
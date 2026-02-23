import type { ReactNode } from "react";
import { Card } from "./Card";

export default function MetricCard(props: {
  title: string;
  value: string; // "—" erlaubt
  sub?: string;
  icon?: ReactNode;
  accent?: "sky" | "emerald" | "amber" | "rose" | "violet";
}) {
  const bar =
    props.accent === "emerald"
      ? "bg-emerald-500/50"
      : props.accent === "amber"
      ? "bg-amber-500/50"
      : props.accent === "rose"
      ? "bg-rose-500/50"
      : props.accent === "violet"
      ? "bg-violet-500/50"
      : "bg-sky-500/50";

  const isDash = props.value.trim() === "—";

  return (
    <Card className="hover:-translate-y-0.5 active:translate-y-0 transition-transform">
      <div className={`h-1 w-full rounded-full ${bar}`} />
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-[rgb(var(--color-muted))]">
            {props.title}
          </div>
          <div className={["text-2xl font-semibold leading-tight", isDash ? "text-[rgb(var(--color-muted))]" : ""].join(" ")}>
            {props.value}
          </div>
          {props.sub && (
            <div className="mt-1 text-xs text-[rgb(var(--color-muted))]">{props.sub}</div>
          )}
        </div>
        {props.icon ? <div className="opacity-70">{props.icon}</div> : null}
      </div>
    </Card>
  );
}
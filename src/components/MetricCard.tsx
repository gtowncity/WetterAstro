import React from "react";
import { GlassCard } from "./ui";
import type { LucideIcon } from "lucide-react";

export default function MetricCard(props: {
  title: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  accent?: "blue" | "red" | "green" | "yellow" | "purple" | "pink" | "gray";
  onClick?: () => void;
}) {
  const Icon = props.icon;

  const accent =
    props.accent === "red" ? "bg-rose-500/15 border-rose-400/15" :
    props.accent === "blue" ? "bg-sky-500/15 border-sky-400/15" :
    props.accent === "green" ? "bg-emerald-500/15 border-emerald-400/15" :
    props.accent === "yellow" ? "bg-amber-500/15 border-amber-400/15" :
    props.accent === "purple" ? "bg-violet-500/15 border-violet-400/15" :
    props.accent === "pink" ? "bg-fuchsia-500/15 border-fuchsia-400/15" :
    "bg-white/10 border-white/10";

  return (
    <GlassCard
      className={[
        "p-4",
        props.onClick ? "cursor-pointer active:scale-[0.99] transition" : "",
      ].join(" ")}
      onClick={props.onClick as any}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-white/70">{props.title}</div>
          <div className="text-2xl font-semibold leading-tight">{props.value}</div>
          {props.sub ? <div className="text-xs text-white/60 mt-1">{props.sub}</div> : null}
        </div>
        <div className={["p-2 rounded-xl border", accent].join(" ")}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </GlassCard>
  );
}
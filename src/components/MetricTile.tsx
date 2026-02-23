import React from "react";
import { GlassCard } from "./ui";
import type { LucideIcon } from "lucide-react";

export default function MetricTile(props: {
  title: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  accent?: "blue" | "red" | "green" | "yellow" | "purple" | "gray";
}) {
  const Icon = props.icon;

  const accent =
    props.accent === "red" ? "text-rose-200" :
    props.accent === "blue" ? "text-sky-200" :
    props.accent === "green" ? "text-emerald-200" :
    props.accent === "yellow" ? "text-amber-200" :
    props.accent === "purple" ? "text-violet-200" :
    "text-white/70";

  return (
    <GlassCard className="p-4">
      <div className="flex items-start justify-between">
        <div className="text-[11px] tracking-wider text-white/55 uppercase">{props.title}</div>
        <Icon className={["w-4 h-4", accent].join(" ")} />
      </div>

      <div className="mt-3 text-4xl font-semibold leading-none">{props.value}</div>
      {props.sub ? <div className="mt-2 text-sm text-white/70">{props.sub}</div> : null}
    </GlassCard>
  );
}
// src/components/IosMetricCard.tsx
import type { ReactNode } from "react";
import { Card } from "./Card";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

type ProgressMarker = {
  value: number;
  kind?: "primary" | "secondary";
};

type Progress = {
  min: number;
  max: number;
  markers: ProgressMarker[];
};

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

export default function IosMetricCard(props: {
  title: string;
  value: string | null | undefined;

  sub?: string | null;
  detail?: string | null;

  icon?: ReactNode;

  progress?: Progress;

  className?: string;
}) {
  const valueText =
    props.value == null || String(props.value).trim() === "" ? "—" : String(props.value);

  const isNoData = valueText.trim() === "—";
  const shouldShowNoDataLine = isNoData && (!props.sub || props.sub.trim() === "");

  const canShowBar =
    props.progress &&
    isFiniteNumber(props.progress.min) &&
    isFiniteNumber(props.progress.max) &&
    props.progress.max > props.progress.min &&
    Array.isArray(props.progress.markers) &&
    props.progress.markers.length > 0;

  return (
    <Card className={`p-4 min-h-[164px] ${props.className ?? ""}`}>
      <div className="flex items-center gap-2">
        {props.icon ? <span className="shrink-0 opacity-70">{props.icon}</span> : null}
        <div className="text-[11px] font-semibold tracking-[0.22em] text-[rgb(var(--color-muted))]">
          {props.title.toUpperCase()}
        </div>
      </div>

      <div className="mt-3 text-[40px] font-semibold leading-none tracking-[-0.02em] text-[rgb(var(--color-fg))]">
        {valueText}
      </div>

      {props.sub ? (
        <div className="mt-2 text-[13px] leading-snug text-[rgb(var(--color-fg))] opacity-72">
          {props.sub}
        </div>
      ) : shouldShowNoDataLine ? (
        <div className="mt-2 text-[13px] leading-snug text-[rgb(var(--color-muted))]">
          Keine Daten
        </div>
      ) : null}

      {props.detail ? (
        <div className="mt-1 text-[13px] leading-snug text-[rgb(var(--color-muted))]">
          {props.detail}
        </div>
      ) : null}

      {canShowBar ? (
        <div className="mt-3">
          <div className="relative h-1.5 rounded-full bg-black/10 dark:bg-white/10">
            {props.progress!.markers.map((m, idx) => {
              const pct = clamp(
                ((m.value - props.progress!.min) / (props.progress!.max - props.progress!.min)) *
                  100,
                0,
                100,
              );

              const kind = m.kind ?? "primary";
              const markerCls =
                kind === "secondary"
                  ? "bg-sky-300/90"
                  : "bg-white/85 dark:bg-white/90";

              return (
                <div
                  key={idx}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                  style={{ left: `${pct}%` }}
                >
                  <div className={`h-3.5 w-1 rounded-full ${markerCls} shadow-ios-card-soft`} />
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </Card>
  );
}
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { GlassCard } from "./ui";
import type { Reading } from "../lib/api";
import { parseTsLocal } from "../lib/time";

type YSpec = {
  id: string;
  orientation?: "left" | "right";
  domain?: any;
  hide?: boolean;
  tickFormatter?: (v: any) => string;
};

type LSpec = {
  key: keyof Reading;
  name: string;
  yAxisId: string;
  color: string;
  dashed?: boolean;
};

function downsample<T>(arr: T[], maxPoints: number) {
  if (arr.length <= maxPoints) return arr;
  const step = Math.ceil(arr.length / maxPoints);
  const out: T[] = [];
  for (let i = 0; i < arr.length; i += step) out.push(arr[i]);
  return out;
}

function fmtTick(ts: string, rangeMs: number) {
  const d = parseTsLocal(ts);
  if (Number.isNaN(d.getTime())) return ts;
  if (rangeMs >= 48 * 60 * 60_000) {
    return d.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
  }
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function fmtLabel(ts: string) {
  const d = parseTsLocal(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString();
}

export default function Charts(props: {
  title: string;
  data: Reading[];
  rangeMs: number;
  nowTs?: string | null; // latest ts
  yAxes: YSpec[];
  lines: LSpec[];
}) {
  const { filtered, nowX } = useMemo(() => {
    const now = props.nowTs ? parseTsLocal(props.nowTs).getTime() : Date.now();
    const from = now - props.rangeMs;

    const cropped = props.data.filter((r) => {
      const t = parseTsLocal(r.ts).getTime();
      return Number.isFinite(t) && t >= from && t <= now + 60_000;
    });

    const max = props.rangeMs >= 7 * 24 * 60 * 60_000 ? 650 : props.rangeMs >= 24 * 60 * 60_000 ? 900 : 1200;
    const ds = downsample(cropped, max);

    const lastTs = ds.length ? ds[ds.length - 1].ts : undefined;
    return { filtered: ds, nowX: lastTs ?? props.nowTs ?? undefined };
  }, [props.data, props.rangeMs, props.nowTs]);

  return (
    <GlassCard className="p-4">
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-sm font-semibold text-white/85">{props.title}</div>
        <div className="text-xs text-white/55">Timeline</div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filtered}>
            <CartesianGrid strokeOpacity={0.12} />

            <XAxis
              dataKey="ts"
              tickFormatter={(v) => fmtTick(String(v), props.rangeMs)}
              minTickGap={45}
              tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.12)" }}
            />

            {props.yAxes.map((y) => (
              <YAxis
                key={y.id}
                yAxisId={y.id}
                orientation={y.orientation ?? "left"}
                domain={y.domain ?? ["auto", "auto"]}
                hide={y.hide}
                tickFormatter={y.tickFormatter}
                tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.12)" }}
              />
            ))}

            <Tooltip
              labelFormatter={(v) => fmtLabel(String(v))}
              contentStyle={{
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                backdropFilter: "blur(18px)",
                color: "rgba(255,255,255,0.85)",
              }}
            />

            {nowX ? <ReferenceLine x={nowX} stroke="rgba(255,255,255,0.25)" /> : null}

            {props.lines.map((l) => (
              <Line
                key={String(l.key)}
                type="monotone"
                dataKey={String(l.key)}
                name={l.name}
                yAxisId={l.yAxisId}
                dot={false}
                stroke={l.color}
                strokeWidth={2.25}
                strokeDasharray={l.dashed ? "6 6" : undefined}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
import { useMemo } from "react";
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
  if (rangeMs >= 48 * 60 * 60_000) return d.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
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
  nowTs?: string | null;
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

    const max =
      props.rangeMs >= 7 * 24 * 60 * 60_000 ? 650 : props.rangeMs >= 24 * 60 * 60_000 ? 900 : 1200;

    const ds = downsample(cropped, max);
    const lastTs = ds.length ? ds[ds.length - 1].ts : undefined;

    return { filtered: ds, nowX: lastTs ?? props.nowTs ?? undefined };
  }, [props.data, props.rangeMs, props.nowTs]);

  return (
    <div className="p-4">
      {props.title ? <div className="text-sm font-semibold mb-3">{props.title}</div> : null}

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filtered}>
            <CartesianGrid stroke="rgb(var(--grid))" />
            <XAxis
              dataKey="ts"
              tickFormatter={(v) => fmtTick(String(v), props.rangeMs)}
              minTickGap={45}
              tick={{ fill: "rgb(var(--color-muted))", fontSize: 12 }}
              axisLine={{ stroke: "rgb(var(--grid))" }}
              tickLine={{ stroke: "rgb(var(--grid))" }}
            />

            {props.yAxes.map((y) => (
              <YAxis
                key={y.id}
                yAxisId={y.id}
                orientation={y.orientation ?? "left"}
                domain={y.domain}
                hide={y.hide}
                tickFormatter={y.tickFormatter}
                tick={{ fill: "rgb(var(--color-muted))", fontSize: 12 }}
                axisLine={{ stroke: "rgb(var(--grid))" }}
                tickLine={{ stroke: "rgb(var(--grid))" }}
              />
            ))}

            <Tooltip
              labelFormatter={(v) => fmtLabel(String(v))}
              contentStyle={{
                backgroundColor: "rgb(var(--tooltip-bg))",
                border: "1px solid rgb(var(--tooltip-border))",
                borderRadius: 14,
                backdropFilter: "blur(18px)",
              }}
              itemStyle={{ color: "rgb(var(--color-fg))" }}
              labelStyle={{ color: "rgb(var(--color-muted))" }}
            />

            {nowX ? <ReferenceLine x={nowX} stroke="rgb(var(--grid))" strokeDasharray="4 4" /> : null}

            {props.lines.map((l) => (
              <Line
                key={String(l.key)}
                type="monotone"
                dataKey={String(l.key)}
                name={l.name}
                yAxisId={l.yAxisId}
                stroke={l.color}
                strokeWidth={2}
                dot={false}
                connectNulls
                strokeDasharray={l.dashed ? "6 5" : undefined}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
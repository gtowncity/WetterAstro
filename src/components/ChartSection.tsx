import type { Reading, RangeKey } from "../lib/api";
import Charts from "./Charts";
import { Card } from "./Card";

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

export default function ChartSection(props: {
  title: string;
  range: RangeKey;
  onRangeChange: (r: RangeKey) => void;
  rangeItems: { key: RangeKey; label: string }[];
  data: Reading[];
  rangeMs: number;
  nowTs?: string | null;
  yAxes: YSpec[];
  lines: LSpec[];
}) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="text-sm font-semibold">{props.title}</div>

        <div className="inline-flex gap-1 rounded-full p-1 bg-black/5 dark:bg-white/10">
          {props.rangeItems.map((it) => {
            const active = it.key === props.range;
            return (
              <button
                key={it.key}
                onClick={() => props.onRangeChange(it.key)}
                className={[
                  "px-3 py-1 text-xs rounded-full transition",
                  active ? "bg-black/10 dark:bg-white/15" : "hover:bg-black/5 dark:hover:bg-white/10",
                ].join(" ")}
              >
                {it.label}
              </button>
            );
          })}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <Charts
          title=""
          data={props.data}
          rangeMs={props.rangeMs}
          nowTs={props.nowTs}
          yAxes={props.yAxes}
          lines={props.lines}
        />
      </Card>
    </div>
  );
}
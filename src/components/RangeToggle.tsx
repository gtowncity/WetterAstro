import React from "react";
import type { RangeKey } from "../lib/api";

export default function RangeToggle(props: { value: RangeKey; onChange: (v: RangeKey) => void }) {
  const items: { k: RangeKey; t: string }[] = [
    { k: "1h", t: "1h" },
    { k: "24h", t: "24h" },
    { k: "7d", t: "7d" },
  ];

  return (
    <div className="flex gap-2">
      {items.map((it) => {
        const active = it.k === props.value;
        return (
          <button
            key={it.k}
            onClick={() => props.onChange(it.k)}
            className={[
              "px-3 py-1 rounded-full text-sm border backdrop-blur-xl transition",
              active ? "bg-white/25 border-white/25" : "bg-white/10 border-white/10 hover:bg-white/15",
            ].join(" ")}
          >
            {it.t}
          </button>
        );
      })}
    </div>
  );
}
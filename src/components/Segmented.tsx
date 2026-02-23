import React from "react";

export default function Segmented<T extends string>(props: {
  value: T;
  items: { key: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex p-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl">
      {props.items.map((it) => {
        const active = it.key === props.value;
        return (
          <button
            key={it.key}
            onClick={() => props.onChange(it.key)}
            className={[
              "px-3 py-1 text-xs rounded-full transition",
              active ? "bg-white/25" : "hover:bg-white/15",
            ].join(" ")}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
export type ChipState = "ok" | "warn" | "bad";

const cls: Record<ChipState, string> = {
  ok: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-100",
  warn: "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-100",
  bad: "border-rose-500/30 bg-rose-500/15 text-rose-700 dark:text-rose-100",
};

export default function StatusChips(props: { items: { label: string; state: ChipState }[] }) {
  return (
    <div className="px-4 max-w-5xl mx-auto">
      <div className="flex flex-wrap gap-2">
        {props.items.map((it) => (
          <span
            key={it.label}
            className={[
              "inline-flex items-center px-3 py-1 rounded-full border text-xs",
              cls[it.state],
            ].join(" ")}
          >
            {it.label}
          </span>
        ))}
      </div>
    </div>
  );
}
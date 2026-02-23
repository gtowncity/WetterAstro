import { Sun } from "lucide-react";
import { clamp, uviText } from "../lib/metrics";
import { Card } from "./Card";

function fmtUvi(uvi: number): string {
  if (!Number.isFinite(uvi)) return "—";
  // iOS zeigt typischerweise Integer
  return String(Math.round(uvi));
}

export default function IosUvCard(props: { uvi: number | null | undefined }) {
  const hasUvi = props.uvi != null && Number.isFinite(props.uvi);
  const label = uviText(props.uvi);

  // UVI Skala 0..11+ (Marker wird geclamped)
  const pct = hasUvi ? clamp((props.uvi as number) / 11, 0, 1) * 100 : 0;

  return (
    <Card className="p-4 min-h-[150px]">
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4 opacity-70" />
        <div className="text-[11px] font-semibold tracking-[0.18em] text-[rgb(var(--color-muted))]">
          UV-INDEX
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[auto,1fr] items-end gap-3">
        <div>
          <div className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-[rgb(var(--color-fg))]">
            {hasUvi ? fmtUvi(props.uvi as number) : "—"}
          </div>

          <div className="mt-1 text-[15px] font-semibold text-[rgb(var(--color-fg))] opacity-85">
            {hasUvi ? label : "—"}
          </div>
        </div>

        <div className="pb-2">
          <div className="relative h-2 w-full rounded-full bg-black/10 dark:bg-white/10">
            {/* iOS-like Gradient Scale */}
            <div className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,#34d399,#a3e635,#fbbf24,#fb923c,#ef4444,#a855f7)] opacity-95" />

            {hasUvi ? (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${pct}%` }}
              >
                <div className="h-4 w-1.5 rounded-full bg-white shadow-ios-card-soft" />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-2 text-[13px] leading-snug text-[rgb(var(--color-muted))]">
        {hasUvi ? "Aktueller Sensorwert." : "Keine Daten"}
      </div>
    </Card>
  );
}
// src/components/IosUvCard.tsx
import { Sun } from "lucide-react";
import { Card } from "./Card";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function uviLabel(uvi: number | null | undefined): string {
  if (uvi == null || !Number.isFinite(uvi)) return "—";
  const x = uvi as number;
  if (x < 3) return "Niedrig";
  if (x < 6) return "Mittel";
  if (x < 8) return "Hoch";
  if (x < 11) return "Sehr hoch";
  return "Extrem";
}

export default function IosUvCard(props: { uvi: number | null | undefined }) {
  const hasUvi = props.uvi != null && Number.isFinite(props.uvi);
  const label = uviLabel(props.uvi);

  // UVI Skala 0..11+
  const pct = hasUvi ? clamp((props.uvi as number) / 11, 0, 1) * 100 : 0;

  return (
    <Card className="p-4 min-h-[164px]">
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4 opacity-70" />
        <div className="text-[11px] font-semibold tracking-[0.22em] text-[rgb(var(--color-muted))]">
          UV-INDEX
        </div>
      </div>

      <div className="mt-3">
        <div className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-[rgb(var(--color-fg))]">
          {hasUvi ? String(Math.round(props.uvi as number)) : "—"}
        </div>

        <div className="mt-1 text-[16px] font-semibold text-[rgb(var(--color-fg))] opacity-80">
          {hasUvi ? label : "—"}
        </div>
      </div>

      <div className="mt-3">
        <div className="relative h-2 rounded-full bg-black/10 dark:bg-white/10">
          <div className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,#34d399,#a3e635,#fbbf24,#fb923c,#ef4444,#a855f7)] opacity-95" />

          {/* Start dot (links) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <div className="h-2.5 w-2.5 rounded-full bg-white/35" />
          </div>

          {/* Current marker (dot like iOS) */}
          {hasUvi ? (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${pct}%` }}
            >
              <div className="h-3 w-3 rounded-full bg-white shadow-ios-card-soft" />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-2 text-[13px] leading-snug text-[rgb(var(--color-muted))]">
        {hasUvi ? `Aktuell: ${label}.` : "Keine Daten"}
      </div>
    </Card>
  );
}
// src/components/IosFeelsCard.tsx
import { Thermometer } from "lucide-react";
import { Card } from "./Card";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function fmtDeg(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v)) return "—";
  return `${Math.round(v)}°`;
}

export default function IosFeelsCard(props: {
  feelsC: number | null;
  actualC: number | null;

  /** optional for slider positioning (derived from real history) */
  rangeMinC: number | null;
  rangeMaxC: number | null;
}) {
  const hasFeels = props.feelsC != null && Number.isFinite(props.feelsC);
  const hasActual = props.actualC != null && Number.isFinite(props.actualC);
  const hasRange =
    props.rangeMinC != null &&
    Number.isFinite(props.rangeMinC) &&
    props.rangeMaxC != null &&
    Number.isFinite(props.rangeMaxC) &&
    (props.rangeMaxC as number) > (props.rangeMinC as number);

  const delta =
    hasFeels && hasActual ? Math.round((props.feelsC as number) - (props.actualC as number)) : null;

  const deltaLabel =
    delta == null ? "—" : `${delta > 0 ? "+" : ""}${delta}°`;

  const actualPct =
    hasRange && hasActual
      ? clamp(
          (((props.actualC as number) - (props.rangeMinC as number)) /
            ((props.rangeMaxC as number) - (props.rangeMinC as number))) *
            100,
          0,
          100,
        )
      : null;

  const feelsPct =
    hasRange && hasFeels
      ? clamp(
          (((props.feelsC as number) - (props.rangeMinC as number)) /
            ((props.rangeMaxC as number) - (props.rangeMinC as number))) *
            100,
          0,
          100,
        )
      : null;

  return (
    <Card className="p-4 min-h-[164px]">
      <div className="flex items-center gap-2">
        <Thermometer className="h-4 w-4 opacity-70" />
        <div className="text-[11px] font-semibold tracking-[0.22em] text-[rgb(var(--color-muted))]">
          GEFÜHLTE TEMPERATUR
        </div>
      </div>

      <div className="mt-3 text-[40px] font-semibold leading-none tracking-[-0.02em] text-[rgb(var(--color-fg))]">
        {fmtDeg(props.feelsC)}
      </div>

      <div className="mt-2 text-[13px] leading-snug text-[rgb(var(--color-fg))] opacity-72">
        {hasActual ? `Tatsächlich: ${fmtDeg(props.actualC)}` : "Keine Daten"}
      </div>

      {/* iOS-like slider + delta bubble (nur wenn echte Range da ist) */}
      {hasRange && feelsPct != null && actualPct != null ? (
        <div className="mt-3">
          <div className="relative">
            {/* bubble */}
            <div
              className="absolute -top-7 -translate-x-1/2"
              style={{ left: `${clamp(feelsPct, 6, 94)}%` }}
            >
              <div className="rounded-full border border-sky-200/30 bg-sky-400/20 px-2 py-0.5 text-[12px] font-semibold text-[rgb(var(--color-fg))] shadow-ios-card-soft">
                {deltaLabel}
              </div>
            </div>

            {/* track */}
            <div className="relative h-2 rounded-full bg-black/10 dark:bg-white/10">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-300/25 via-white/0 to-white/0" />

              {/* actual marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${actualPct}%` }}
              >
                <div className="h-3.5 w-1 rounded-full bg-white/85 shadow-ios-card-soft" />
              </div>

              {/* feels marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${feelsPct}%` }}
              >
                <div className="h-3.5 w-1 rounded-full bg-sky-300/95 shadow-ios-card-soft" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 text-[13px] text-[rgb(var(--color-muted))]">
          Keine Daten
        </div>
      )}

      <div className="mt-2 text-[13px] leading-snug text-[rgb(var(--color-muted))]">
        {hasFeels && hasActual ? "Berechnet aus Temperatur und Feuchte." : ""}
      </div>
    </Card>
  );
}
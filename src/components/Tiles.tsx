import React from "react";
import { GlassCard } from "./ui";
import { uviText } from "../lib/metrics";

function cn(...a: Array<string | undefined | false>) {
  return a.filter(Boolean).join(" ");
}

function TileShell(props: {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard className={cn("relative overflow-hidden p-4", props.className)}>
      {/* iOS “wet glass” overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: [
            // specular highlight
            "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 35%, rgba(0,0,0,0.20) 100%)",
            // droplets-ish noise
            "radial-gradient(circle at 12% 22%, rgba(255,255,255,0.10) 0 1px, transparent 2px)",
            "radial-gradient(circle at 72% 32%, rgba(255,255,255,0.08) 0 1px, transparent 2px)",
            "radial-gradient(circle at 35% 70%, rgba(255,255,255,0.09) 0 1px, transparent 2px)",
            "radial-gradient(circle at 80% 78%, rgba(255,255,255,0.06) 0 1px, transparent 2px)",
          ].join(","),
        }}
      />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {props.icon ? <div className="text-white/65">{props.icon}</div> : null}
            <div className="text-[11px] tracking-[0.18em] text-white/55 uppercase">
              {props.title}
            </div>
          </div>
        </div>

        <div className="mt-3">{props.children}</div>
      </div>
    </GlassCard>
  );
}

/** ---- UV Tile (wie dein Apple Screenshot) ---- */
export function UvTile(props: {
  uvi: number | null | undefined;
  status?: string | null;
}) {
  const uvi = props.uvi;
  const level = uviText(uvi ?? null);

  const pct = (() => {
    if (uvi == null || !Number.isFinite(uvi)) return 0;
    const v = Math.max(0, Math.min(12, uvi));
    return (v / 12) * 100;
  })();

  const ok = (props.status ?? "OK") === "OK";

  return (
    <TileShell
      title="UV-INDEX"
      icon={<span className="text-white/65">☀︎</span>}
    >
      <div className="text-5xl font-semibold leading-none text-white/90">
        {uvi != null && Number.isFinite(uvi) ? Math.round(uvi) : "—"}
      </div>
      <div className="mt-1 text-xl font-semibold text-white/90">
        {ok ? level : (props.status ?? "NC")}
      </div>

      {/* Gradient bar + marker (Apple-style) */}
      <div className="mt-3">
        <div className="relative h-[6px] rounded-full overflow-hidden border border-white/10">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #34d399 0%, #facc15 25%, #fb923c 45%, #f87171 65%, #a78bfa 82%, #f472b6 100%)",
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-white shadow-[0_0_0_2px_rgba(15,23,42,0.55)]"
            style={{ left: `calc(${pct}% - 5px)` }}
          />
        </div>
      </div>

      <div className="mt-3 text-sm text-white/75">
        {ok ? "Niedrig für den Rest des Tages." : "Kein gültiger UV-Wert."}
      </div>
    </TileShell>
  );
}

/** ---- Gefühlte Temperatur Tile (Apple-like, aber ohne erfundene Gründe) ---- */
export function FeelsTile(props: {
  feelsC: number | null | undefined;
  actualC: number | null | undefined;
  note?: string; // z.B. "Humidex (aus Temperatur + Feuchte)"
}) {
  const feels = props.feelsC;
  const actual = props.actualC;

  // mini “range bar” wie Apple, Marker = feels, thin marker = actual
  const min = (() => {
    const a = actual ?? 0;
    const f = feels ?? 0;
    return Math.min(a, f) - 6;
  })();
  const max = (() => {
    const a = actual ?? 0;
    const f = feels ?? 0;
    return Math.max(a, f) + 6;
  })();
  const pos = (v: number) => ((v - min) / (max - min)) * 100;

  const feelsPos = feels != null && Number.isFinite(feels) ? pos(feels) : 0;
  const actPos = actual != null && Number.isFinite(actual) ? pos(actual) : 0;

  return (
    <TileShell title="GEFÜHLTE TEMPERATUR" icon={<span>🌡︎</span>}>
      <div className="text-5xl font-semibold leading-none text-white/90">
        {feels != null && Number.isFinite(feels) ? `${Math.round(feels)}°` : "—"}
      </div>

      <div className="mt-2 text-lg text-white/80">
        Tatsächlich:{" "}
        <span className="text-white/90">
          {actual != null && Number.isFinite(actual) ? `${Math.round(actual)}°` : "—"}
        </span>
      </div>

      <div className="mt-3 relative">
        <div className="h-[6px] rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full"
            style={{
              background:
                "linear-gradient(90deg, #60a5fa 0%, #34d399 35%, #facc15 65%, #fb7185 100%)",
            }}
          />
        </div>

        {/* actual marker (thin) */}
        {actual != null && Number.isFinite(actual) ? (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[2px] h-[16px] bg-white/70 rounded"
            style={{ left: `calc(${actPos}% - 1px)` }}
          />
        ) : null}

        {/* feels marker bubble */}
        {feels != null && Number.isFinite(feels) ? (
          <div
            className="absolute -top-7 -translate-x-1/2 text-[12px] px-2 py-0.5 rounded-full bg-sky-400/25 border border-sky-300/20 text-white/90 backdrop-blur-xl"
            style={{ left: `${feelsPos}%` }}
          >
            {Math.round(feels)}°
          </div>
        ) : null}

        {feels != null && Number.isFinite(feels) ? (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[10px] h-[10px] rounded-full bg-white shadow-[0_0_0_2px_rgba(15,23,42,0.55)]"
            style={{ left: `${feelsPos}%` }}
          />
        ) : null}
      </div>

      <div className="mt-3 text-sm text-white/75">
        {props.note ?? "Berechnet aus Temperatur + Luftfeuchte."}
      </div>
    </TileShell>
  );
}

/** ---- Feuchtigkeit Tile (wie Apple: + Taupunkt Satz) ---- */
export function HumidityTile(props: { h: number | null | undefined; dewC: number | null | undefined }) {
  return (
    <TileShell title="FEUCHTIGKEIT" icon={<span>💧</span>}>
      <div className="text-5xl font-semibold leading-none text-white/90">
        {props.h != null && Number.isFinite(props.h) ? `${Math.round(props.h)} %` : "—"}
      </div>
      <div className="mt-3 text-sm text-white/75">
        {props.dewC != null && Number.isFinite(props.dewC)
          ? `Der Taupunkt liegt derzeit bei ${props.dewC.toFixed(1)}°.`
          : "Taupunkt: —"}
      </div>
    </TileShell>
  );
}

/** ---- Licht Tile (Lux + Darkness) ---- */
export function LightTile(props: {
  lux: number | null | undefined;
  pct: number | null | undefined;
  darkness: string;
}) {
  const luxText =
    props.lux != null && Number.isFinite(props.lux) ? `${Math.round(props.lux)} lx` : null;
  const pctText =
    props.pct != null && Number.isFinite(props.pct) ? `${Math.round(props.pct)} %` : null;

  return (
    <TileShell title="LICHT (LUX ~)" icon={<span>💡</span>}>
      <div className="text-5xl font-semibold leading-none text-white/90">
        {luxText ?? pctText ?? "—"}
      </div>
      <div className="mt-3 text-sm text-white/75">
        Darkness: {props.darkness}
        {luxText && pctText ? ` · ${pctText}` : ""}
      </div>
    </TileShell>
  );
}

/** ---- Air Quality Tile ---- */
export function AirTile(props: { label: string; mqPct: number | null | undefined }) {
  return (
    <TileShell title="AIR QUALITY" icon={<span>🜁</span>}>
      <div className="text-4xl font-semibold leading-none text-white/90">{props.label}</div>
      <div className="mt-3 text-sm text-white/75">
        MQ: {props.mqPct != null && Number.isFinite(props.mqPct) ? `${Math.round(props.mqPct)}%` : "—"}
      </div>
    </TileShell>
  );
}

/** ---- Luftdruck Tile ---- */
export function PressureTile(props: { p: number | null | undefined }) {
  return (
    <TileShell title="LUFTDRUCK" icon={<span>⟲</span>}>
      <div className="text-4xl font-semibold leading-none text-white/90">
        {props.p != null && Number.isFinite(props.p) ? `${props.p.toFixed(1)} hPa` : "—"}
      </div>
    </TileShell>
  );
}

/** ---- Vibration Tile ---- */
export function VibrationTile(props: {
  label: string;
  ema: number | null | undefined;
  peak: number | null | undefined;
}) {
  return (
    <TileShell title="VIBRATION" icon={<span>〰︎</span>}>
      <div className="text-4xl font-semibold leading-none text-white/90">{props.label}</div>
      <div className="mt-3 text-sm text-white/75">
        EMA: {props.ema != null && Number.isFinite(props.ema) ? props.ema.toFixed(4) : "—"} · Peak:{" "}
        {props.peak != null && Number.isFinite(props.peak) ? props.peak.toFixed(4) : "—"}
      </div>
    </TileShell>
  );
}
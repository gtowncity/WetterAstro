import React, { useEffect, useMemo, useState } from "react";
import {
  apiHistory,
  apiLatest,
  fetchHoursForRange,
  RANGE_PRESETS,
  rangeMs,
  type RangeKey,
  type Reading,
} from "./lib/api";
import { GlassCard, Pill } from "./components/ui";
import Segmented from "./components/Segmented";
import Charts from "./components/Charts";
import { fmtAgo, fmtLocal } from "./lib/time";
import {
  airQualityFromPct,
  darknessFromLux,
  dewPointC,
  humidex,
  luxApproxFromOhm,
  vibLabel,
} from "./lib/metrics";
import { useStoredState } from "./lib/store";
import {
  UvTile,
  FeelsTile,
  HumidityTile,
  LightTile,
  AirTile,
  PressureTile,
  VibrationTile,
} from "./components/Tiles";
import { CloudSun, MapPin } from "lucide-react";

const DEVICE_ID = "ws-01";

function clsStatus(s?: string | null) {
  if (!s) return "warn" as const;
  if (s === "OK") return "ok" as const;
  if (s.startsWith("NC")) return "bad" as const;
  if (s.includes("SHORT")) return "bad" as const;
  return "warn" as const;
}

export default function App() {
  const [dark, setDark] = useState(true);

  // ✅ Persistiert nach Reload (pro Chart)
  const [rTHP, setRTHP] = useStoredState<RangeKey>("range_thp", "24h");
  const [rUVL, setRUVL] = useStoredState<RangeKey>("range_uvl", "24h");
  const [rAIR, setRAIR] = useStoredState<RangeKey>("range_air", "24h");
  const [rVIB, setRVIB] = useStoredState<RangeKey>("range_vib", "24h");

  const [latest, setLatest] = useState<Reading | null>(null);
  const [hTHP, setHTHP] = useState<Reading[]>([]);
  const [hUVL, setHUVL] = useState<Reading[]>([]);
  const [hAIR, setHAIR] = useState<Reading[]>([]);
  const [hVIB, setHVIB] = useState<Reading[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Latest poll
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await apiLatest(DEVICE_ID);
        if (!alive) return;
        setLatest(r);
        setErr(null);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "latest failed");
      }
    };
    load();
    const t = setInterval(load, 30000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  async function loadHistory(range: RangeKey, setter: (d: Reading[]) => void) {
    try {
      const hours = fetchHoursForRange(range);
      const data = await apiHistory(DEVICE_ID, hours);
      setter(data);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message || "history failed");
    }
  }

  useEffect(() => { loadHistory(rTHP, setHTHP); }, [rTHP]);
  useEffect(() => { loadHistory(rUVL, setHUVL); }, [rUVL]);
  useEffect(() => { loadHistory(rAIR, setHAIR); }, [rAIR]);
  useEffect(() => { loadHistory(rVIB, setHVIB); }, [rVIB]);

  useEffect(() => {
    const t = setInterval(() => {
      loadHistory(rTHP, setHTHP);
      loadHistory(rUVL, setHUVL);
      loadHistory(rAIR, setHAIR);
      loadHistory(rVIB, setHVIB);
    }, 60000);
    return () => clearInterval(t);
  }, [rTHP, rUVL, rAIR, rVIB]);

  const lastAbs = useMemo(() => fmtLocal(latest?.ts), [latest?.ts]);
  const lastAgo = useMemo(() => fmtAgo(latest?.ts), [latest?.ts]);

  const feels = useMemo(() => {
    if (latest?.t == null || latest?.h == null) return null;
    return humidex(latest.t, latest.h);
  }, [latest?.t, latest?.h]);

  const dew = useMemo(() => {
    if (latest?.t == null || latest?.h == null) return null;
    return dewPointC(latest.t, latest.h);
  }, [latest?.t, latest?.h]);

  const lux = useMemo(() => luxApproxFromOhm(latest?.ldr_r ?? null), [latest?.ldr_r]);
  const darkLabel = useMemo(() => darknessFromLux(lux), [lux]);

  const airQ = useMemo(() => airQualityFromPct(latest?.mq_pct ?? null), [latest?.mq_pct]);
  const vibQ = useMemo(() => vibLabel(latest?.vib_ema ?? null), [latest?.vib_ema]);

  const rangeItems = RANGE_PRESETS.map((p) => ({ key: p.key, label: p.label }));

  return (
    <div className="min-h-full">
      <div className="min-h-full px-4 py-6 bg-gradient-to-br from-sky-500/30 via-indigo-500/20 to-fuchsia-500/20 dark:from-slate-950 dark:via-slate-900 dark:to-black">
        <div className="max-w-5xl mx-auto flex flex-col gap-5">

          {/* HERO (Apple-ish) */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 justify-center text-white/90">
              <CloudSun className="w-6 h-6" />
              <div className="text-3xl font-semibold">Wetterstation Emma</div>
              <span className="text-white/60">•</span>
              <span className="text-sm text-white/70 inline-flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Geiselhöring
              </span>
            </div>

            <div className="mt-3 text-7xl font-semibold leading-none text-white/95">
              {latest?.t != null ? `${Math.round(latest.t)}°` : "—"}
            </div>

            <div className="mt-2 text-lg text-white/80">
              Gefühlt: {feels != null ? `${Math.round(feels)}°` : "—"}
            </div>

            <div className="mt-2 text-xs text-white/60">
              Letztes Update: <span className="text-white/80">{lastAbs}</span>{" "}
              <span className="text-white/45">({lastAgo})</span>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                className="px-3 py-1 rounded-full border bg-white/10 border-white/10 hover:bg-white/15 backdrop-blur-xl text-sm text-white/85"
                onClick={() => setDark((v) => !v)}
              >
                {dark ? "Dark" : "Light"}
              </button>

              <span className="text-xs text-white/60 ml-2 inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
                Auto-Refresh
              </span>
            </div>

            {err ? <div className="text-xs text-rose-200 mt-2">Fehler: {err}</div> : null}
          </div>

          {/* Status pills */}
          <GlassCard className="p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <Pill label={`BME: ${latest?.bme_ok ? "OK" : "NC"}`} state={latest?.bme_ok ? "ok" : "bad"} />
              <Pill label={`RTC: ${latest?.rtc_ok ? "OK" : "NC"}`} state={latest?.rtc_ok ? "ok" : "bad"} />
              <Pill label={`IMU: ${latest?.imu_ok ? "OK" : "NC"}`} state={latest?.imu_ok ? "ok" : "bad"} />
              <Pill label={`UV: ${latest?.uv_status || "?"}`} state={clsStatus(latest?.uv_status)} />
              <Pill label={`Licht: ${latest?.ldr_status || "?"}`} state={clsStatus(latest?.ldr_status)} />
              <Pill label={`MQ: ${latest?.mq_status || "?"}`} state={clsStatus(latest?.mq_status)} />
            </div>
          </GlassCard>

          {/* ✅ Tiles wie Apple: 2 Spalten (auch am Handy), Reihenfolge wie Screenshot */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <FeelsTile
              feelsC={feels}
              actualC={latest?.t ?? null}
              note="Humidex (aus Temperatur + Feuchte)"
            />
            <UvTile uvi={latest?.uv_uvi ?? null} status={latest?.uv_status ?? null} />

            <HumidityTile h={latest?.h ?? null} dewC={dew} />
            <LightTile lux={lux} pct={latest?.ldr_pct ?? null} darkness={darkLabel} />

            <AirTile label={airQ.label} mqPct={latest?.mq_pct ?? null} />
            <PressureTile p={latest?.p ?? null} />

            {/* letztes Tile (wie Apple: kann alleine stehen) */}
            <div className="col-span-2 md:col-span-1">
              <VibrationTile label={vibQ.label} ema={latest?.vib_ema ?? null} peak={latest?.vib_peak ?? null} />
            </div>
          </div>

          {/* CHARTS (bleiben) */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/85 font-semibold">Temp / Feuchte / Druck</div>
            <Segmented value={rTHP} items={rangeItems} onChange={setRTHP} />
          </div>
          <Charts
            title="Temperatur / Feuchte / Druck"
            data={hTHP}
            nowTs={latest?.ts ?? null}
            rangeMs={rangeMs(rTHP)}
            yAxes={[
              { id: "t", orientation: "left", domain: ["dataMin - 1", "dataMax + 1"] },
              { id: "h", orientation: "right", domain: [0, 100] },
              { id: "p", orientation: "right", hide: true, domain: ["dataMin - 2", "dataMax + 2"] },
            ]}
            lines={[
              { key: "t", name: "Temp", yAxisId: "t", color: "#ff6b6b" },
              { key: "h", name: "Hum", yAxisId: "h", color: "#5eead4" },
              { key: "p", name: "Druck", yAxisId: "p", color: "#a78bfa", dashed: true },
            ]}
          />

          <div className="flex items-center justify-between">
            <div className="text-sm text-white/85 font-semibold">UV / Licht</div>
            <Segmented value={rUVL} items={rangeItems} onChange={setRUVL} />
          </div>
          <Charts
            title="UV / Licht"
            data={hUVL}
            nowTs={latest?.ts ?? null}
            rangeMs={rangeMs(rUVL)}
            yAxes={[
              { id: "uv", orientation: "left", domain: [0, 12] },
              { id: "light", orientation: "right", domain: [0, 100] },
            ]}
            lines={[
              { key: "uv_uvi", name: "UVI", yAxisId: "uv", color: "#fbbf24" },
              { key: "ldr_pct", name: "Licht %", yAxisId: "light", color: "#93c5fd" },
            ]}
          />

          <div className="flex items-center justify-between">
            <div className="text-sm text-white/85 font-semibold">Air (MQ)</div>
            <Segmented value={rAIR} items={rangeItems} onChange={setRAIR} />
          </div>
          <Charts
            title="Air (MQ)"
            data={hAIR}
            nowTs={latest?.ts ?? null}
            rangeMs={rangeMs(rAIR)}
            yAxes={[{ id: "mq", orientation: "left", domain: [0, 100] }]}
            lines={[{ key: "mq_pct", name: "MQ %", yAxisId: "mq", color: "#34d399" }]}
          />

          <div className="flex items-center justify-between">
            <div className="text-sm text-white/85 font-semibold">Vibration</div>
            <Segmented value={rVIB} items={rangeItems} onChange={setRVIB} />
          </div>
          <Charts
            title="Vibration"
            data={hVIB}
            nowTs={latest?.ts ?? null}
            rangeMs={rangeMs(rVIB)}
            yAxes={[{ id: "v", orientation: "left", domain: [0, "auto"] }]}
            lines={[
              { key: "vib_ema", name: "EMA", yAxisId: "v", color: "#60a5fa" },
              { key: "vib_peak", name: "Peak", yAxisId: "v", color: "#f472b6", dashed: true },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
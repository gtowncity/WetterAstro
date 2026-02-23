import { useEffect, useMemo, useState } from "react";
import {
  apiHistory,
  apiLatest,
  fetchHoursForRange,
  RANGE_PRESETS,
  rangeMs,
  type RangeKey,
  type Reading,
} from "./lib/api";
import { fmtAgo, fmtLocal } from "./lib/time";
import {
  airQualityFromPct,
  darknessFromLux,
  dewPointC,
  humidex,
  luxApproxFromOhm,
  vibLabel,
  uviText,
} from "./lib/metrics";
import { useStoredState } from "./lib/store";
import Topbar from "./components/Topbar";
import HeroSection from "./components/HeroSection";
import StatusChips, { type ChipState } from "./components/StatusChips";
import MetricCard from "./components/MetricCard";
import ChartSection from "./components/ChartSection";
import { Thermometer, Droplets, Sun, Lightbulb, Gauge, Wind, Activity } from "lucide-react";

const DEVICE_ID = "ws-01";
const LOCATION = "Geiselhöring";

function clsStatus(s?: string | null): ChipState {
  if (!s) return "warn";
  if (s === "OK") return "ok";
  if (s.startsWith("NC")) return "bad";
  if (s.includes("SHORT")) return "bad";
  return "warn";
}

function safeNum(v: number | null | undefined) {
  return v == null || !Number.isFinite(v) ? null : v;
}

function minMax(values: Array<number | null | undefined>) {
  const v = values.map(safeNum).filter((x): x is number => x != null);
  if (!v.length) return { lo: null, hi: null };
  return { lo: Math.min(...v), hi: Math.max(...v) };
}

export default function App() {
  const [autoRefresh, setAutoRefresh] = useStoredState<boolean>("auto_refresh", true);

  // Range pro Chart (persistiert)
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
    if (!autoRefresh) return () => { alive = false; };

    const t = setInterval(load, 30_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [autoRefresh]);

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

  // Initial loads per range
  useEffect(() => { loadHistory(rTHP, setHTHP); }, [rTHP]);
  useEffect(() => { loadHistory(rUVL, setHUVL); }, [rUVL]);
  useEffect(() => { loadHistory(rAIR, setHAIR); }, [rAIR]);
  useEffect(() => { loadHistory(rVIB, setHVIB); }, [rVIB]);

  // Periodic refresh for history (wenn Auto-Refresh an)
  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(() => {
      loadHistory(rTHP, setHTHP);
      loadHistory(rUVL, setHUVL);
      loadHistory(rAIR, setHAIR);
      loadHistory(rVIB, setHVIB);
    }, 60_000);
    return () => clearInterval(t);
  }, [autoRefresh, rTHP, rUVL, rAIR, rVIB]);

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

  // High/Low aus echten History-Werten (keine Fake-Werte)
  const { lo: loT, hi: hiT } = useMemo(() => minMax(hTHP.map((r) => r.t)), [hTHP]);

  const chips = useMemo(() => {
    return [
      { label: "BME", state: latest?.bme_ok === 1 ? "ok" : "warn" },
      { label: "RTC", state: latest?.rtc_ok === 1 ? "ok" : "warn" },
      { label: "IMU", state: latest?.imu_ok === 1 ? "ok" : "warn" },
      { label: "UV", state: clsStatus(latest?.uv_status) },
      { label: "Licht", state: clsStatus(latest?.ldr_status) },
      { label: "MQ", state: clsStatus(latest?.mq_status) },
    ] as { label: string; state: ChipState }[];
  }, [latest]);

  const rangeItems = useMemo(() => RANGE_PRESETS.map((p) => ({ key: p.key, label: p.label })), []);
  const nowTs = latest?.ts ?? null;

  return (
    <div className="pb-10">
      <Topbar
        title="Wetterstation Emma"
        location={LOCATION}
        lastAbs={lastAbs}
        lastAgo={lastAgo}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={() => setAutoRefresh((v) => !v)}
      />

      <HeroSection
        tempC={safeNum(latest?.t)}
        feelsC={safeNum(feels)}
        hiC={hiT}
        loC={loT}
        subLabel={darkLabel}
      />

      {err ? (
        <div className="px-4 max-w-5xl mx-auto mb-3 text-sm text-rose-600 dark:text-rose-300">
          Fehler: {err}
        </div>
      ) : null}

      <StatusChips items={chips} />

      {/* Metric Grid */}
      <div className="px-4 max-w-5xl mx-auto mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard
          title="Temperatur"
          value={latest?.t != null ? `${Math.round(latest.t)}°` : "—"}
          sub={dew != null ? `Taupunkt: ${dew.toFixed(1)}°` : "Taupunkt: —"}
          icon={<Thermometer size={18} />}
          accent="rose"
        />

        <MetricCard
          title="Gefühlt"
          value={feels != null ? `${Math.round(feels)}°` : "—"}
          sub={latest?.h != null ? `Humidex (aus Temp + Feuchte)` : "—"}
          icon={<Wind size={18} />}
          accent="violet"
        />

        <MetricCard
          title="Feuchtigkeit"
          value={latest?.h != null ? `${Math.round(latest.h)} %` : "—"}
          sub={dew != null ? `Taupunkt aktuell: ${dew.toFixed(1)}°` : "—"}
          icon={<Droplets size={18} />}
          accent="sky"
        />

        <MetricCard
          title="UV-Index"
          value={latest?.uv_uvi != null ? String(Math.round(latest.uv_uvi)) : "—"}
          sub={uviText(latest?.uv_uvi ?? null)}
          icon={<Sun size={18} />}
          accent="amber"
        />

        <MetricCard
          title="Licht"
          value={lux != null ? `${Math.round(lux)} lx` : (latest?.ldr_pct != null ? `${Math.round(latest.ldr_pct)} %` : "—")}
          sub={darkLabel}
          icon={<Lightbulb size={18} />}
          accent="sky"
        />

        <MetricCard
          title="Luftdruck"
          value={latest?.p != null ? `${latest.p.toFixed(1)} hPa` : "—"}
          icon={<Gauge size={18} />}
          accent="emerald"
        />

        <MetricCard
          title="Air Quality"
          value={airQ.label}
          sub={latest?.mq_pct != null ? `MQ: ${Math.round(latest.mq_pct)}%` : "MQ: —"}
          icon={<Activity size={18} />}
          accent={airQ.state === "bad" ? "rose" : airQ.state === "warn" ? "amber" : "emerald"}
        />

        <MetricCard
          title="Vibration"
          value={vibQ.label}
          sub={
            latest?.vib_ema != null && latest?.vib_peak != null
              ? `EMA: ${latest.vib_ema.toFixed(4)} · Peak: ${latest.vib_peak.toFixed(4)}`
              : "EMA/Peak: —"
          }
          icon={<Activity size={18} />}
          accent={vibQ.state === "bad" ? "rose" : vibQ.state === "warn" ? "amber" : "emerald"}
        />
      </div>

      {/* Charts */}
      <div className="px-4 max-w-5xl mx-auto mt-8">
        <ChartSection
          title="Temp / Feuchte / Druck"
          range={rTHP}
          onRangeChange={setRTHP}
          rangeItems={rangeItems}
          data={hTHP}
          rangeMs={rangeMs(rTHP)}
          nowTs={nowTs}
          yAxes={[
            { id: "t", orientation: "left", tickFormatter: (v) => `${Math.round(v)}°` },
            { id: "h", orientation: "right", domain: [0, 100], tickFormatter: (v) => `${Math.round(v)}%` },
            { id: "p", orientation: "right", hide: true },
          ]}
          lines={[
            { key: "t", name: "Temperatur", yAxisId: "t", color: "#f43f5e" },
            { key: "h", name: "Feuchte", yAxisId: "h", color: "#60a5fa", dashed: true },
            { key: "p", name: "Druck", yAxisId: "p", color: "#34d399" },
          ]}
        />

        <ChartSection
          title="UV / Licht"
          range={rUVL}
          onRangeChange={setRUVL}
          rangeItems={rangeItems}
          data={hUVL}
          rangeMs={rangeMs(rUVL)}
          nowTs={nowTs}
          yAxes={[
            { id: "uv", orientation: "left", domain: [0, 12], tickFormatter: (v) => `${Math.round(v)}` },
            { id: "ldr", orientation: "right", domain: [0, 100], tickFormatter: (v) => `${Math.round(v)}%` },
          ]}
          lines={[
            { key: "uv_uvi", name: "UV Index", yAxisId: "uv", color: "#f59e0b" },
            { key: "ldr_pct", name: "Licht %", yAxisId: "ldr", color: "#60a5fa" },
          ]}
        />

        <ChartSection
          title="Air (MQ)"
          range={rAIR}
          onRangeChange={setRAIR}
          rangeItems={rangeItems}
          data={hAIR}
          rangeMs={rangeMs(rAIR)}
          nowTs={nowTs}
          yAxes={[
            { id: "mq", orientation: "left", domain: [0, 100], tickFormatter: (v) => `${Math.round(v)}%` },
          ]}
          lines={[
            { key: "mq_pct", name: "MQ %", yAxisId: "mq", color: "#34d399" },
          ]}
        />

        <ChartSection
          title="Vibration"
          range={rVIB}
          onRangeChange={setRVIB}
          rangeItems={rangeItems}
          data={hVIB}
          rangeMs={rangeMs(rVIB)}
          nowTs={nowTs}
          yAxes={[
            { id: "vib", orientation: "left", tickFormatter: (v) => String(v) },
          ]}
          lines={[
            { key: "vib_ema", name: "EMA", yAxisId: "vib", color: "#a78bfa" },
            { key: "vib_peak", name: "Peak", yAxisId: "vib", color: "#f472b6", dashed: true },
          ]}
        />
      </div>
    </div>
  );
}
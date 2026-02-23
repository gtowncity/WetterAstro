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
} from "./lib/metrics";
import { useStoredState } from "./lib/store";

import IosTopArea from "./components/IosTopArea";
import IosGrid from "./components/IosGrid";
import IosMetricCard from "./components/IosMetricCard";
import IosUvCard from "./components/IosUvCard";
import IosBottomNav from "./components/IosBottomNav";
import { Card } from "./components/Card";
import Charts from "./components/Charts";

import { Activity, Droplets, Gauge, Lightbulb, Leaf, Thermometer } from "lucide-react";

const DEVICE_ID = "ws-01";
const LOCATION = "Geiselhöring";

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

function safeNum(v: number | null | undefined) {
  return v == null || !Number.isFinite(v) ? null : v;
}

function minMax(values: Array<number | null | undefined>) {
  const v = values.map(safeNum).filter((x): x is number => x != null);
  if (!v.length) return { lo: null, hi: null };
  return { lo: Math.min(...v), hi: Math.max(...v) };
}

function fmtRounded(v: number | null | undefined, suffix = ""): string | null {
  if (v == null || !Number.isFinite(v)) return null;
  return `${Math.round(v)}${suffix}`;
}

function fmtFixed(v: number | null | undefined, digits: number): string | null {
  if (v == null || !Number.isFinite(v)) return null;
  return v.toFixed(digits);
}

function RangePills(props: {
  value: RangeKey;
  onChange: (r: RangeKey) => void;
  items: { key: RangeKey; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {props.items.map((it) => {
        const active = it.key === props.value;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => props.onChange(it.key)}
            className={[
              "rounded-full px-3 py-1 text-[11px] font-semibold transition",
              active
                ? "bg-black/10 text-[rgb(var(--color-fg))] dark:bg-white/15"
                : "text-[rgb(var(--color-muted))] hover:bg-black/5 dark:hover:bg-white/10",
            ].join(" ")}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

function ChartCard(props: {
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
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="text-[11px] font-semibold tracking-[0.18em] text-[rgb(var(--color-muted))]">
          {props.title.toUpperCase()}
        </div>
        <RangePills value={props.range} onChange={props.onRangeChange} items={props.rangeItems} />
      </div>

      <div className="mt-3 h-48">
        {props.data.length ? (
          <Charts
            title=""
            data={props.data}
            rangeMs={props.rangeMs}
            nowTs={props.nowTs ?? null}
            yAxes={props.yAxes}
            lines={props.lines}
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-[rgb(var(--color-muted))]">
            Keine Daten
          </div>
        )}
      </div>
    </Card>
  );
}

export default function App() {
  const PAGES = 2;

  const [page, setPage] = useStoredState("wa_page", 0);

  const [autoRefresh, setAutoRefresh] = useStoredState("auto_refresh", true);

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

  // Clamp persisted page
  const pageClamped = Math.min(Math.max(0, page), PAGES - 1);
  useEffect(() => {
    if (page !== pageClamped) setPage(pageClamped);
  }, [page, pageClamped, setPage]);

  // Latest poll (unverändert)
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

    if (!autoRefresh) {
      return () => {
        alive = false;
      };
    }

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

  // Initial loads per range (unverändert)
  useEffect(() => {
    loadHistory(rTHP, setHTHP);
  }, [rTHP]);

  useEffect(() => {
    loadHistory(rUVL, setHUVL);
  }, [rUVL]);

  useEffect(() => {
    loadHistory(rAIR, setHAIR);
  }, [rAIR]);

  useEffect(() => {
    loadHistory(rVIB, setHVIB);
  }, [rVIB]);

  // Periodic refresh for history (wenn Auto-Refresh an) (unverändert)
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

  const rangeItems = useMemo(
    () => RANGE_PRESETS.map((p) => ({ key: p.key, label: p.label })),
    [],
  );

  const nowTs = latest?.ts ?? null;

  // ---- Cards (nur echte Daten / berechnet aus echten Inputs) ----
  const tempC = latest?.t ?? null;
  const humPct = latest?.h ?? null;
  const pressHpa = latest?.p ?? null;
  const uvi = latest?.uv_uvi ?? null;

  const ldrPct = latest?.ldr_pct ?? null;
  const mqPct = latest?.mq_pct ?? null;

  const vibEma = latest?.vib_ema ?? null;
  const vibPeak = latest?.vib_peak ?? null;

  const feelsValue = feels != null && Number.isFinite(feels) ? `${Math.round(feels)}°` : null;
  const feelsSub =
    tempC != null && Number.isFinite(tempC) ? `Tatsächlich: ${Math.round(tempC)}°` : null;

  const feelsProgress =
    tempC != null &&
    Number.isFinite(tempC) &&
    feels != null &&
    Number.isFinite(feels) &&
    loT != null &&
    hiT != null &&
    hiT > loT
      ? {
          min: loT,
          max: hiT,
          markers: [
            { value: tempC, kind: "primary" as const },
            { value: feels, kind: "secondary" as const },
          ],
        }
      : undefined;

  const humidityValue = humPct != null && Number.isFinite(humPct) ? `${Math.round(humPct)}%` : null;
  const humiditySub =
    dew != null && Number.isFinite(dew) ? `Taupunkt: ${Math.round(dew)}°` : null;

  const pressureValue =
    pressHpa != null && Number.isFinite(pressHpa) ? `${Math.round(pressHpa)} hPa` : null;

  // Light: wenn Prozent da → Prozent anzeigen; sonst Lux (approx) wenn aus ldr_r berechnet
  let lightValue: string | null = null;
  let lightSub: string | null = null;
  let lightDetail: string | null = null;

  if (ldrPct != null && Number.isFinite(ldrPct)) {
    lightValue = `${Math.round(ldrPct)}%`;
    if (lux != null && Number.isFinite(lux)) lightSub = `≈ ${Math.round(lux)} lx`;
    if (lux != null && Number.isFinite(lux) && darkLabel !== "—") lightDetail = darkLabel;
  } else if (lux != null && Number.isFinite(lux)) {
    lightValue = `≈ ${Math.round(lux)} lx`;
    if (darkLabel !== "—") lightSub = darkLabel;
  }

  const airValue = airQ.label !== "—" ? airQ.label : null;
  const airSub =
    mqPct != null && Number.isFinite(mqPct) ? `Sensor: ${Math.round(mqPct)}%` : null;

  const vibValue = vibQ.label !== "—" ? vibQ.label : null;
  const vibSub = vibEma != null && Number.isFinite(vibEma) ? `EMA: ${vibEma.toFixed(3)}` : null;
  const vibDetail =
    vibPeak != null && Number.isFinite(vibPeak) ? `Peak: ${vibPeak.toFixed(3)}` : null;

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-[520px] px-4 pb-[calc(env(safe-area-inset-bottom)+112px)]">
        <IosTopArea
          location={LOCATION}
          privacyLabel="PRIVAT"
          tempC={tempC}
          feelsC={feels}
          hiC={hiT}
          loC={loT}
          autoRefresh={autoRefresh}
          onToggleAutoRefresh={() => setAutoRefresh((v) => !v)}
        />

        {latest?.ts ? (
          <div className="mt-2 text-center text-[12px] text-[rgb(var(--color-muted))]">
            Letztes Update: {lastAbs} ({lastAgo})
          </div>
        ) : null}

        {err ? (
          <Card className="mt-4 border-rose-500/30 bg-rose-500/10 p-4">
            <div className="text-sm font-semibold text-[rgb(var(--color-fg))]">
              Fehler
            </div>
            <div className="mt-1 text-sm text-[rgb(var(--color-fg))] opacity-85">
              {err}
            </div>
          </Card>
        ) : null}

        {pageClamped === 0 ? (
          <IosGrid className="mt-6">
            <IosMetricCard
              title="Gefühlte Temperatur"
              value={feelsValue}
              sub={feelsSub}
              detail={feelsValue == null ? null : null}
              icon={<Thermometer className="h-4 w-4" />}
              progress={feelsProgress}
            />

            <IosUvCard uvi={uvi} />

            <IosMetricCard
              title="Feuchtigkeit"
              value={humidityValue}
              sub={humiditySub}
              icon={<Droplets className="h-4 w-4" />}
            />

            <IosMetricCard
              title="Luftdruck"
              value={pressureValue}
              icon={<Gauge className="h-4 w-4" />}
            />

            <IosMetricCard
              title="Beleuchtungsgrad"
              value={lightValue}
              sub={lightSub}
              detail={lightDetail}
              icon={<Lightbulb className="h-4 w-4" />}
            />

            <IosMetricCard
              title="Luftqualität"
              value={airValue}
              sub={airSub}
              icon={<Leaf className="h-4 w-4" />}
            />

            <IosMetricCard
              title="Vibration"
              value={vibValue}
              sub={vibSub}
              detail={vibDetail}
              icon={<Activity className="h-4 w-4" />}
              className="col-span-2"
            />
          </IosGrid>
        ) : (
          <section className="mt-6 space-y-4">
            <ChartCard
              title="Temperatur · Feuchte · Druck"
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

            <ChartCard
              title="UV · Licht"
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

            <ChartCard
              title="Luftqualität"
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

            <ChartCard
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
          </section>
        )}
      </main>

      <IosBottomNav page={pageClamped} pages={PAGES} onPageChange={setPage} />
    </div>
  );
}
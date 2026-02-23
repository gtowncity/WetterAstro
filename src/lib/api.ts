export type RangeKey = "10m" | "1h" | "6h" | "12h" | "24h" | "7d";

export const RANGE_PRESETS: { key: RangeKey; label: string; ms: number; fetchHours: number }[] = [
  { key: "10m", label: "10m", ms: 10 * 60_000, fetchHours: 1 },
  { key: "1h",  label: "1h",  ms: 60 * 60_000, fetchHours: 2 },
  { key: "6h",  label: "6h",  ms: 6 * 60 * 60_000, fetchHours: 8 },
  { key: "12h", label: "12h", ms: 12 * 60 * 60_000, fetchHours: 14 },
  { key: "24h", label: "24h", ms: 24 * 60 * 60_000, fetchHours: 26 },
  { key: "7d",  label: "7d",  ms: 7 * 24 * 60 * 60_000, fetchHours: 168 },
];

export function rangeMs(r: RangeKey) {
  return RANGE_PRESETS.find(x => x.key === r)?.ms ?? 24 * 60 * 60_000;
}
export function fetchHoursForRange(r: RangeKey) {
  return RANGE_PRESETS.find(x => x.key === r)?.fetchHours ?? 26;
}

export type Reading = {
  id: number;
  device_id: string;
  ts: string;

  t: number | null;
  h: number | null;
  p: number | null;
  bme_ok: number | null;

  uv_uvi: number | null;
  uv_status: string | null;

  ldr_pct: number | null;
  ldr_status: string | null;
  ldr_r: number | null;

  mq_pct: number | null;
  mq_status: string | null;

  vib_ema: number | null;
  vib_peak: number | null;
  imu_ok: number | null;

  rtc_ok: number | null;
};

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.trim() ||
  "https://weather-worker.weather-emma.workers.dev";

export async function apiLatest(deviceId: string): Promise<Reading | null> {
  const res = await fetch(`${API_BASE}/api/latest?device_id=${encodeURIComponent(deviceId)}`);
  if (!res.ok) throw new Error(`latest ${res.status}`);
  return (await res.json()) as Reading | null;
}

export async function apiHistory(deviceId: string, hours: number): Promise<Reading[]> {
  const res = await fetch(`${API_BASE}/api/history?device_id=${encodeURIComponent(deviceId)}&hours=${hours}`);
  if (!res.ok) throw new Error(`history ${res.status}`);
  return (await res.json()) as Reading[];
}
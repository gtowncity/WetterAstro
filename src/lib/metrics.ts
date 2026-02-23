export function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

export function dewPointC(tC: number, rh: number) {
  const a = 17.62;
  const b = 243.12;
  const gamma = Math.log(rh / 100) + (a * tC) / (b + tC);
  return (b * gamma) / (a - gamma);
}

export function humidex(tC: number, rh: number) {
  const td = dewPointC(tC, rh);
  const e = 6.11 * Math.exp(5417.7530 * (1 / 273.16 - 1 / (273.15 + td)));
  return tC + 0.5555 * (e - 10);
}

export function uviText(uvi?: number | null) {
  if (uvi == null || !Number.isFinite(uvi)) return "—";
  if (uvi < 3) return "Niedrig";
  if (uvi < 6) return "Mittel";
  if (uvi < 8) return "Hoch";
  if (uvi < 11) return "Sehr hoch";
  return "Extrem";
}

export function airQualityFromPct(p?: number | null) {
  if (p == null || !Number.isFinite(p)) return { label: "—", state: "warn" as const };
  if (p < 20) return { label: "Sehr gut", state: "ok" as const };
  if (p < 40) return { label: "Gut", state: "ok" as const };
  if (p < 60) return { label: "Mittel", state: "warn" as const };
  return { label: "Schlecht", state: "bad" as const };
}

export function vibLabel(v?: number | null) {
  if (v == null || !Number.isFinite(v)) return { label: "—", state: "warn" as const };
  if (v < 0.01) return { label: "Ruhig", state: "ok" as const };
  if (v < 0.03) return { label: "Leicht", state: "ok" as const };
  if (v < 0.07) return { label: "Spürbar", state: "warn" as const };
  return { label: "Stark", state: "bad" as const };
}

// sehr grobe Lux-Heuristik (ohne Kalibrierung = nur Approx.)
export function luxApproxFromOhm(rOhm?: number | null) {
  if (!rOhm || !Number.isFinite(rOhm) || rOhm <= 0) return null;
  const A = 500000;
  const B = 1.4;
  const lux = Math.pow(A / rOhm, 1 / B);
  return clamp(lux, 0, 200000);
}

export function darknessFromLux(lux?: number | null) {
  if (lux == null) return "—";
  if (lux < 0.5) return "Nacht";
  if (lux < 10) return "Dämmerung";
  if (lux < 1000) return "Dunkel / Bewölkt";
  if (lux < 20000) return "Tageslicht";
  return "Sonne";
}
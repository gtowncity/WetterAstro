function fmtNum(v: number | null) {
  return v == null || !Number.isFinite(v) ? "—" : String(Math.round(v));
}

export default function HeroSection(props: {
  tempC: number | null;
  feelsC: number | null;
  hiC: number | null;
  loC: number | null;
  subLabel: string; // z.B. aus Lux: Nacht / Dämmerung / Tageslicht
}) {
  const t = props.tempC;
  const lo = props.loC;
  const hi = props.hiC;

  const marker = (() => {
    if (t == null || lo == null || hi == null) return 50;
    if (!Number.isFinite(t) || !Number.isFinite(lo) || !Number.isFinite(hi)) return 50;
    if (hi - lo <= 0.0001) return 50;
    return Math.max(0, Math.min(100, ((t - lo) / (hi - lo)) * 100));
  })();

  return (
    <section className="px-4 pt-6 pb-2 max-w-5xl mx-auto text-center">
      <div className="text-6xl sm:text-7xl font-semibold tracking-tight">
        {fmtNum(props.tempC)}°
      </div>

      <div className="mt-1 text-sm text-[rgb(var(--color-muted))]">{props.subLabel}</div>

      <div className="mt-2 text-xs text-[rgb(var(--color-muted))]">
        H: {fmtNum(props.hiC)}° · L: {fmtNum(props.loC)}° · Gefühlt: {fmtNum(props.feelsC)}°
      </div>

      <div className="relative mt-5 h-2 rounded-full overflow-hidden bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400">
        <span
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white/90 dark:bg-white shadow"
          style={{ left: `${marker}%` }}
        />
      </div>
    </section>
  );
}
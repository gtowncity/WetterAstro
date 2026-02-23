export function parseTsLocal(ts: string) {
  const s = ts?.endsWith("Z") ? ts.slice(0, -1) : ts;
  return new Date(s);
}

export function fmtLocal(ts?: string | null) {
  if (!ts) return "—";
  const d = parseTsLocal(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString();
}

export function fmtAgo(ts?: string | null) {
  if (!ts) return "—";
  const d = parseTsLocal(ts);
  const ms = Date.now() - d.getTime();
  if (!Number.isFinite(ms)) return "—";
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `vor ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `vor ${m}m`;
  const h = Math.floor(m / 60);
  return `vor ${h}h`;
}
// src/components/IosTopArea.tsx
import { Navigation } from "lucide-react";

function fmtDeg(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v)) return "—";
  return `${Math.round(v)}°`;
}

type Props = {
  location: string;
  privacyLabel?: string;

  tempC: number | null;
  feelsC: number | null;
  hiC: number | null;
  loC: number | null;
};

export default function IosTopArea(props: Props) {
  const hasTemp = props.tempC != null && Number.isFinite(props.tempC);
  const hasFeels = props.feelsC != null && Number.isFinite(props.feelsC);
  const hasHiLo =
    props.hiC != null &&
    Number.isFinite(props.hiC) &&
    props.loC != null &&
    Number.isFinite(props.loC);

  return (
    <header className="wa-hero w-full overflow-hidden flex min-h-[78dvh] flex-col pt-[calc(env(safe-area-inset-top)+12px)] pb-20 text-center font-ios">
      {/* Cloud / fog atmosphere — absolutely positioned in upper sky zone */}
      <div className="wa-hero-clouds" aria-hidden="true">
        <svg
          viewBox="0 0 800 340"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className="wa-hero-cloud-svg"
        >
          <ellipse cx="400" cy="70"  rx="490" ry="110" fill="rgba(190,215,255,0.24)" />
          <ellipse cx="400" cy="35"  rx="370" ry="75"  fill="rgba(200,222,255,0.20)" />
          <ellipse cx="100" cy="120" rx="310" ry="95"  fill="rgba(180,210,255,0.17)" />
          <ellipse cx="700" cy="105" rx="290" ry="88"  fill="rgba(182,212,255,0.15)" />
          <ellipse cx="240" cy="45"  rx="195" ry="58"  fill="rgba(212,230,255,0.14)" />
          <ellipse cx="570" cy="52"  rx="205" ry="62"  fill="rgba(212,230,255,0.13)" />
          <ellipse cx="400" cy="270" rx="580" ry="110" fill="rgba(170,200,245,0.09)" />
        </svg>
      </div>

      {/* Sky spacer — pushes text block into lower portion of the stage */}
      <div className="min-h-[28%] flex-1" />

      {/* Weather info — lower ~55% of the stage */}
      <div className="flex flex-col items-center px-6">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-[0.32em] uppercase text-[rgb(var(--color-muted))] opacity-70">
          <Navigation className="h-3 w-3 opacity-60" />
          <span>{props.privacyLabel ?? "PRIVAT"}</span>
        </div>

        <h1 className="mt-3 text-[48px] font-semibold leading-tight tracking-[-0.02em] text-[rgb(var(--color-fg))] sm:text-[56px]">
          {props.location}
        </h1>

        <div className="mt-0 flex flex-col items-center">
          <div className="wa-hero-temp">
            <div className="text-[136px] font-thin leading-none tracking-[-0.06em] text-[rgb(var(--color-fg))] sm:text-[152px]">
              {fmtDeg(props.tempC)}
            </div>
          </div>

          {!hasTemp ? (
            <div className="mt-2 text-[13px] text-[rgb(var(--color-muted))]">Keine Daten</div>
          ) : null}

          {hasFeels ? (
            <div className="mt-5 text-[14px] leading-tight text-[rgb(var(--color-fg))] opacity-40">
              Gefühlt: {fmtDeg(props.feelsC)}
            </div>
          ) : null}

          {hasHiLo ? (
            <div className="mt-1.5 text-[14px] leading-tight text-[rgb(var(--color-fg))] opacity-40">
              H: {fmtDeg(props.hiC)}&nbsp;&nbsp;T: {fmtDeg(props.loC)}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
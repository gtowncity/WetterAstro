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

  lastUpdateLabel?: string | null;
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
    <header className="wa-hero w-full overflow-hidden flex min-h-[60dvh] flex-col pt-[calc(env(safe-area-inset-top)+12px)] pb-14 text-center font-ios">
      {/* Cloud / fog atmosphere — absolutely positioned in upper sky zone */}
      <div className="wa-hero-clouds" aria-hidden="true">
        <svg
          viewBox="0 0 800 280"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className="wa-hero-cloud-svg"
        >
          {/* Main cloud bank: broad horizontal mass across the full top */}
          <ellipse cx="400" cy="50"  rx="500" ry="90"  fill="rgba(215,232,255,0.42)" />
          <ellipse cx="400" cy="18"  rx="430" ry="62"  fill="rgba(228,240,255,0.36)" />
          {/* Left billow */}
          <ellipse cx="80"  cy="98"  rx="268" ry="84"  fill="rgba(205,226,255,0.32)" />
          <ellipse cx="48"  cy="65"  rx="196" ry="56"  fill="rgba(218,234,255,0.28)" />
          {/* Right billow */}
          <ellipse cx="720" cy="90"  rx="255" ry="80"  fill="rgba(205,224,255,0.30)" />
          <ellipse cx="750" cy="60"  rx="188" ry="53"  fill="rgba(215,232,255,0.25)" />
          {/* Deep fog base layer */}
          <ellipse cx="400" cy="210" rx="620" ry="90"  fill="rgba(178,208,248,0.13)" />
        </svg>
      </div>

      {/* Fixed sky zone — cloud area above the text block */}
      <div className="wa-hero-sky-spacer" />

      {/* Weather info — lower portion of the stage */}
      <div className="flex flex-col items-center px-6">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-[0.32em] uppercase text-[rgb(var(--color-muted))] opacity-70">
          <Navigation className="h-3 w-3 opacity-60" />
          <span>{props.privacyLabel ?? "PRIVAT"}</span>
        </div>

        <h1 className="mt-2 text-[44px] font-semibold leading-tight tracking-[-0.02em] text-[rgb(var(--color-fg))] sm:text-[54px]">
          {props.location}
        </h1>

        <div className="flex flex-col items-center">
          <div className="wa-hero-temp">
            <div className="text-[122px] font-thin leading-none tracking-[-0.06em] text-[rgb(var(--color-fg))] sm:text-[140px]">
              {fmtDeg(props.tempC)}
            </div>
          </div>

          {!hasTemp ? (
            <div className="mt-2 text-[13px] text-[rgb(var(--color-muted))]">Keine Daten</div>
          ) : null}

          {hasFeels ? (
            <div className="mt-4 text-[14px] leading-tight text-[rgb(var(--color-fg))] opacity-40">
              Gefühlt: {fmtDeg(props.feelsC)}
            </div>
          ) : null}

          {hasHiLo ? (
            <div className="mt-1 text-[14px] leading-tight text-[rgb(var(--color-fg))] opacity-40">
              H: {fmtDeg(props.hiC)}&nbsp;&nbsp;T: {fmtDeg(props.loC)}
            </div>
          ) : null}

          {props.lastUpdateLabel ? (
            <div className="mt-5 text-[11px] text-[rgb(var(--color-muted))] opacity-45">
              {props.lastUpdateLabel}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
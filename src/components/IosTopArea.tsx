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
    <header className="wa-hero w-full overflow-hidden flex min-h-[78dvh] flex-col items-center justify-center pt-[calc(env(safe-area-inset-top)+24px)] pb-24 text-center font-ios">
      <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-[0.32em] uppercase text-[rgb(var(--color-muted))] opacity-70">
        <Navigation className="h-3 w-3 opacity-60" />
        <span>{props.privacyLabel ?? "PRIVAT"}</span>
      </div>

      <h1 className="mt-5 text-[46px] font-semibold leading-tight tracking-[-0.02em] text-[rgb(var(--color-fg))] sm:text-[56px]">
        {props.location}
      </h1>

      <div className="mt-1 flex flex-col items-center">
        <div className="text-[132px] font-thin leading-none tracking-[-0.06em] text-[rgb(var(--color-fg))] sm:text-[148px]">
          {fmtDeg(props.tempC)}
        </div>

        {!hasTemp ? (
          <div className="mt-2 text-[13px] text-[rgb(var(--color-muted))]">Keine Daten</div>
        ) : null}

        {hasFeels ? (
          <div className="mt-5 text-[13px] leading-tight text-[rgb(var(--color-fg))] opacity-45">
            Gefühlt: {fmtDeg(props.feelsC)}
          </div>
        ) : null}

        {hasHiLo ? (
          <div className="mt-1.5 text-[13px] leading-tight text-[rgb(var(--color-fg))] opacity-45">
            H: {fmtDeg(props.hiC)}&nbsp;&nbsp;T: {fmtDeg(props.loC)}
          </div>
        ) : null}
      </div>
    </header>
  );
}
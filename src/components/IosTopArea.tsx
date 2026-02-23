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
    <header className="pt-[calc(env(safe-area-inset-top)+18px)] text-center font-ios">
      <div className="flex items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.28em] text-[rgb(var(--color-muted))]">
        <Navigation className="h-3.5 w-3.5 opacity-80" />
        <span>{props.privacyLabel ?? "PRIVAT"}</span>
      </div>

      <h1 className="mt-3 text-[38px] font-semibold leading-tight text-[rgb(var(--color-fg))] sm:text-[44px]">
        {props.location}
      </h1>

      <div className="mt-2">
        <div className="text-[104px] font-thin leading-none tracking-[-0.06em] text-[rgb(var(--color-fg))] sm:text-[116px]">
          {fmtDeg(props.tempC)}
        </div>

        {!hasTemp ? (
          <div className="mt-1 text-[13px] text-[rgb(var(--color-muted))]">Keine Daten</div>
        ) : null}

        {hasFeels ? (
          <div className="mt-1 text-[18px] leading-tight text-[rgb(var(--color-fg))] opacity-75">
            Gefühlt: {fmtDeg(props.feelsC)}
          </div>
        ) : null}

        {hasHiLo ? (
          <div className="mt-0.5 text-[18px] leading-tight text-[rgb(var(--color-fg))] opacity-75">
            H: {fmtDeg(props.hiC)}&nbsp;&nbsp;T: {fmtDeg(props.loC)}
          </div>
        ) : null}
      </div>
    </header>
  );
}
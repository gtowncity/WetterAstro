import { Moon, Navigation, RefreshCw, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

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

  autoRefresh?: boolean;
  onToggleAutoRefresh?: () => void;
};

export default function IosTopArea(props: Props) {
  const { dark, toggle } = useTheme();

  const hasTemp = props.tempC != null && Number.isFinite(props.tempC);
  const hasFeels = props.feelsC != null && Number.isFinite(props.feelsC);
  const hasHiLo =
    props.hiC != null &&
    Number.isFinite(props.hiC) &&
    props.loC != null &&
    Number.isFinite(props.loC);

  return (
    <header className="pt-[calc(env(safe-area-inset-top)+16px)] text-center">
      <div className="relative flex items-center justify-center">
        {/* left: auto-refresh toggle (optional) */}
        {props.onToggleAutoRefresh ? (
          <button
            type="button"
            onClick={props.onToggleAutoRefresh}
            aria-label={props.autoRefresh ? "Auto-Refresh deaktivieren" : "Auto-Refresh aktivieren"}
            className={[
              "absolute left-0 top-1/2 -translate-y-1/2",
              "grid h-9 w-9 place-items-center rounded-full",
              "border border-black/10 bg-white/50 shadow-ios-card-soft backdrop-blur-xl",
              "transition hover:bg-white/60 active:scale-[0.97]",
              "dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15",
            ].join(" ")}
          >
            <RefreshCw
              className={[
                "h-4 w-4 text-[rgb(var(--color-fg))]",
                props.autoRefresh ? "opacity-90" : "opacity-35",
              ].join(" ")}
            />
          </button>
        ) : null}

        {/* center: PRIVAT */}
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-[rgb(var(--color-muted))]">
          <Navigation className="h-3.5 w-3.5 opacity-80" />
          <span>{props.privacyLabel ?? "PRIVAT"}</span>
        </div>

        {/* right: theme toggle */}
        <button
          type="button"
          onClick={toggle}
          aria-label={dark ? "Zu hellem Theme wechseln" : "Zu dunklem Theme wechseln"}
          className={[
            "absolute right-0 top-1/2 -translate-y-1/2",
            "grid h-9 w-9 place-items-center rounded-full",
            "border border-black/10 bg-white/50 shadow-ios-card-soft backdrop-blur-xl",
            "transition hover:bg-white/60 active:scale-[0.97]",
            "dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15",
          ].join(" ")}
        >
          {dark ? (
            <Sun className="h-4 w-4 text-[rgb(var(--color-fg))] opacity-90" />
          ) : (
            <Moon className="h-4 w-4 text-[rgb(var(--color-fg))] opacity-90" />
          )}
        </button>
      </div>

      <h1 className="mt-3 text-[40px] font-semibold leading-tight text-[rgb(var(--color-fg))] drop-shadow-sm sm:text-[46px]">
        {props.location}
      </h1>

      <div className="mt-2">
        <div className="text-[96px] font-thin leading-none tracking-[-0.04em] text-[rgb(var(--color-fg))] drop-shadow-sm">
          {fmtDeg(props.tempC)}
        </div>

        {!hasTemp ? (
          <div className="mt-1 text-[13px] text-[rgb(var(--color-muted))]">Keine Daten</div>
        ) : null}

        {hasFeels || hasHiLo ? (
          <div className="mt-1 space-y-1 text-[17px] leading-tight text-[rgb(var(--color-muted))]">
            {hasFeels ? <div>Gefühlt: {fmtDeg(props.feelsC)}</div> : null}
            {hasHiLo ? (
              <div>
                H: {fmtDeg(props.hiC)}&nbsp;&nbsp;T: {fmtDeg(props.loC)}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
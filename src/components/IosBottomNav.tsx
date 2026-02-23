// src/components/IosBottomNav.tsx
import { List, Map } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function Switch(props: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="text-[15px] text-[rgb(var(--color-fg))] opacity-90">{props.label}</div>

      <button
        type="button"
        role="switch"
        aria-checked={props.checked}
        onClick={() => props.onChange(!props.checked)}
        className={[
          "relative h-7 w-12 rounded-full border transition",
          props.checked
            ? "bg-sky-400/40 border-sky-200/25"
            : "bg-white/10 border-white/10",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-ios-card-soft transition",
            props.checked ? "left-6" : "left-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export default function IosBottomNav(props: {
  page: number;
  pages: number;
  onPageChange: (p: number) => void;

  autoRefresh?: boolean;
  onToggleAutoRefresh?: () => void;
}) {
  const { dark, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const pages = Math.max(1, props.pages);
  const page = Math.min(Math.max(0, props.page), pages - 1);

  const iconBtn =
    "grid h-11 w-11 place-items-center rounded-full " +
    "border border-black/10 bg-white/50 shadow-ios-nav backdrop-blur-xl " +
    "transition hover:bg-white/60 active:scale-[0.97] " +
    "dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15";

  const pillBtn =
    "rounded-full border border-black/10 bg-white/50 px-6 py-2 shadow-ios-nav backdrop-blur-xl " +
    "transition hover:bg-white/60 active:scale-[0.98] " +
    "dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15";

  return (
    <>
      {menuOpen ? (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            aria-label="Schließen"
            onClick={() => setMenuOpen(false)}
          />

          <div className="absolute inset-x-0 bottom-0 pb-[calc(env(safe-area-inset-bottom)+12px)]">
            <div className="mx-auto max-w-[520px] px-4">
              <div className="overflow-hidden rounded-t-[28px] border border-white/10 bg-[rgb(var(--color-card))] shadow-ios-card backdrop-blur-xl backdrop-saturate-150">
                <div className="flex items-center justify-between px-4 pt-3">
                  <div className="h-1.5 w-10 rounded-full bg-white/20" />
                  <button
                    type="button"
                    className="text-[13px] font-semibold text-[rgb(var(--color-fg))] opacity-80"
                    onClick={() => setMenuOpen(false)}
                  >
                    Fertig
                  </button>
                </div>

                <div className="px-4 pb-2 pt-2">
                  <div className="text-[11px] font-semibold tracking-[0.22em] text-[rgb(var(--color-muted))]">
                    EINSTELLUNGEN
                  </div>

                  <div className="mt-2 divide-y divide-white/10">
                    <Switch checked={dark} onChange={() => toggle()} label="Dark Mode" />
                    {props.onToggleAutoRefresh ? (
                      <Switch
                        checked={!!props.autoRefresh}
                        onChange={() => props.onToggleAutoRefresh?.()}
                        label="Auto-Refresh"
                      />
                    ) : null}
                  </div>

                  <div className="pb-2 pt-2 text-[12px] text-[rgb(var(--color-muted))]">
                    Werte: nur Sensor/History. Keine Forecast-Daten.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-20 pb-[calc(env(safe-area-inset-bottom)+10px)]">
        {/* bottom haze */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-black/20 to-black/55 backdrop-blur-2xl dark:via-black/20 dark:to-black/60" />

        <div className="relative mx-auto max-w-[520px] px-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className={iconBtn}
              aria-label="Hauptseite"
              onClick={() => props.onPageChange(0)}
            >
              <Map className="h-5 w-5 text-[rgb(var(--color-fg))] opacity-90" />
            </button>

            <button
              type="button"
              className={pillBtn}
              aria-label="Seite wechseln"
              onClick={() => props.onPageChange((page + 1) % pages)}
            >
              <div className="flex items-center gap-2">
                {Array.from({ length: pages }).map((_, i) => {
                  const active = i === page;
                  return (
                    <span
                      key={i}
                      className={[
                        "h-1.5 w-1.5 rounded-full transition",
                        active
                          ? "bg-[rgb(var(--color-fg))]"
                          : "bg-[rgb(var(--color-fg))] opacity-35",
                      ].join(" ")}
                    />
                  );
                })}
              </div>
            </button>

            <button
              type="button"
              className={iconBtn}
              aria-label="Menü"
              onClick={() => setMenuOpen(true)}
            >
              <List className="h-5 w-5 text-[rgb(var(--color-fg))] opacity-90" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
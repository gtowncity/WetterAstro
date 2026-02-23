import { List, Map } from "lucide-react";

export default function IosBottomNav(props: {
  page: number;
  pages: number;
  onPageChange: (p: number) => void;
}) {
  const pages = Math.max(1, props.pages);
  const page = Math.min(Math.max(0, props.page), pages - 1);

  const iconBtn =
    "grid h-12 w-12 place-items-center rounded-full " +
    "border border-black/10 bg-white/50 shadow-ios-nav backdrop-blur-xl " +
    "transition hover:bg-white/60 active:scale-[0.97] " +
    "dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15";

  const pillBtn =
    "rounded-full border border-black/10 bg-white/50 px-6 py-2 shadow-ios-nav backdrop-blur-xl " +
    "transition hover:bg-white/60 active:scale-[0.98] " +
    "dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15";

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pb-[calc(env(safe-area-inset-bottom)+10px)]">
      <div className="mx-auto max-w-[520px] px-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className={iconBtn}
            aria-label="Seite 1"
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
                      active ? "bg-[rgb(var(--color-fg))]" : "bg-[rgb(var(--color-fg))] opacity-35",
                    ].join(" ")}
                  />
                );
              })}
            </div>
          </button>

          <button
            type="button"
            className={iconBtn}
            aria-label="Seite 2"
            onClick={() => props.onPageChange(Math.min(1, pages - 1))}
          >
            <List className="h-5 w-5 text-[rgb(var(--color-fg))] opacity-90" />
          </button>
        </div>
      </div>
    </div>
  );
}
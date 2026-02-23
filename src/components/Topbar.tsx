import { useTheme } from "../context/ThemeContext";
import { Card } from "./Card";

export default function Topbar(props: {
  title: string;
  location: string;
  lastAbs: string;
  lastAgo: string;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
}) {
  const { dark, toggle } = useTheme();

  return (
    <div className="sticky top-0 z-20 px-4 pt-4">
      <Card className="flex items-center justify-between gap-3" variant="raised">
        <div className="min-w-0">
          <div className="font-semibold text-base leading-tight">{props.title}</div>
          <div className="text-xs text-[rgb(var(--color-muted))] truncate">
            {props.location}
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end min-w-0">
          <div className="text-xs text-[rgb(var(--color-muted))] truncate">
            Letztes Update: {props.lastAbs} ({props.lastAgo})
          </div>
          <label className="text-xs flex items-center gap-2 mt-1 select-none">
            <input
              type="checkbox"
              checked={props.autoRefresh}
              onChange={props.onToggleAutoRefresh}
            />
            Auto-Refresh
          </label>
        </div>

        <button
          onClick={toggle}
          className="rounded-full px-3 py-2 text-sm border border-black/5 dark:border-white/10 hover:opacity-90"
          aria-label="Theme umschalten"
        >
          {dark ? "🌞" : "🌙"}
        </button>
      </Card>
    </div>
  );
}
import { Card } from "./Card";

export default function SunPathCard(props: { sunrise?: string | null; sunset?: string | null }) {
  // Wenn du keine echten Werte hast: NICHT anzeigen
  if (!props.sunrise || !props.sunset) return null;

  return (
    <Card className="mt-4">
      <div className="flex justify-between text-xs text-[rgb(var(--color-muted))]">
        <span>{props.sunrise} Sunrise</span>
        <span>{props.sunset} Sunset</span>
      </div>

      <div className="mt-4 h-24">
        <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0 40 Q 50 0 100 40"
            fill="none"
            stroke="rgb(var(--grid))"
            strokeWidth="2"
          />
          <circle cx="50" cy="10" r="3" className="fill-amber-300 dark:fill-amber-200" />
        </svg>
      </div>
    </Card>
  );
}
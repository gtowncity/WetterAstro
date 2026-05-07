// src/components/HeroPrototype.tsx
// Premium Apple-Weather-inspired hero – static prototype with demo values.

export default function HeroPrototype() {
  return (
    <section className="hero-proto" aria-label="Wetter Hero">
      {/* ── Atmospheric layers ── */}
      <div className="hero-proto__sky" aria-hidden="true">
        <div className="hero-proto__cloud-bank" />
        <div className="hero-proto__depth" />
        <div className="hero-proto__mist" />
      </div>

      {/* ── Content ── */}
      <div className="hero-proto__content">
        {/* Location */}
        <p className="hero-proto__location">Geiselhöring</p>

        {/* Temperature */}
        <p className="hero-proto__temp">12°</p>

        {/* Condition line */}
        <p className="hero-proto__condition">Regen erwartet um ca. 19:00 Uhr.</p>

        {/* Secondary info */}
        <p className="hero-proto__secondary">
          <span>Gefühlt: 9°</span>
          <span className="hero-proto__dot" aria-hidden="true" />
          <span>H:&thinsp;12°&ensp;T:&thinsp;4°</span>
        </p>
      </div>

      {/* ── Bottom fade into card area ── */}
      <div className="hero-proto__fade" aria-hidden="true" />
    </section>
  );
}

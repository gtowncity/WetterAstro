// src/components/HeroPrototype.tsx
// Temporary visual hero prototype – static content, no data fetching.

export default function HeroPrototype() {
  return (
    <section className="hero-proto" aria-label="Wetter-Hero">
      {/* ── Cloud bank (upper region) ── */}
      <div className="hero-proto__clouds" aria-hidden="true">
        <div className="hero-proto__cloud hero-proto__cloud--main" />
        <div className="hero-proto__cloud hero-proto__cloud--left" />
        <div className="hero-proto__cloud hero-proto__cloud--right" />
      </div>

      {/* ── Atmospheric fog / depth layer ── */}
      <div className="hero-proto__fog" aria-hidden="true" />

      {/* ── Soft glow behind text ── */}
      <div className="hero-proto__glow" aria-hidden="true" />

      {/* ── Text block ── */}
      <div className="hero-proto__text">
        <span className="hero-proto__privacy">PRIVAT</span>

        <h1 className="hero-proto__location">Geiselhöring</h1>

        <span className="hero-proto__temp">12°</span>

        <span className="hero-proto__feels">Gefühlt 9°</span>

        <span className="hero-proto__hilo">H: 12°&nbsp;&nbsp;&nbsp;T: 4°</span>

        <p className="hero-proto__hint">
          Regen erwartet um ca.&nbsp;19:00&nbsp;Uhr.
        </p>
      </div>

      {/* ── Bottom fade into cards ── */}
      <div className="hero-proto__fade" aria-hidden="true" />
    </section>
  );
}

// src/components/HeroPrototype.tsx
// Isolated premium hero prototype – Apple Weather × CARROT vibes
// Static values only. No API / state / fetching.

export default function HeroPrototype() {
  return (
    <section className="hero-proto" aria-label="Wetter-Hero">
      {/* atmospheric cloud / sky layers */}
      <div className="hero-proto__sky" aria-hidden="true">
        <div className="hero-proto__cloud hero-proto__cloud--top" />
        <div className="hero-proto__cloud hero-proto__cloud--mid" />
        <div className="hero-proto__depth" />
      </div>

      {/* content block – pushed into the lower third of the scene */}
      <div className="hero-proto__content">
        <p className="hero-proto__location">Geiselhöring</p>

        <p className="hero-proto__temp">12°</p>

        <p className="hero-proto__condition">Regen erwartet um ca. 19:00 Uhr.</p>

        <div className="hero-proto__meta">
          <span>Gefühlt: 9°</span>
          <span className="hero-proto__sep" aria-hidden="true">·</span>
          <span>H: 12°</span>
          <span className="hero-proto__sep" aria-hidden="true">·</span>
          <span>T: 4°</span>
        </div>
      </div>

      {/* soft fade into card area */}
      <div className="hero-proto__fade" aria-hidden="true" />
    </section>
  );
}

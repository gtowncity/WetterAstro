export default function HeroPrototype() {
  return (
    <section className="hero-prototype" aria-label="Wetter Hero Prototyp">
      <div className="hero-stage">
        <div className="hero-sky-depth" />
        <div className="hero-cloudbank" />
        <div className="hero-cloudbank hero-cloudbank-secondary" />
        <div className="hero-haze" />

        <div className="hero-content">
          <p className="hero-location">Geiselhöring</p>
          <p className="hero-temp">12°</p>
          <p className="hero-secondary">Gefühlt 9° · H: 12° T: 4°</p>
          <p className="hero-forecast">Regen erwartet um ca. 19:00 Uhr.</p>
        </div>
      </div>
      <div className="hero-fade" />
    </section>
  );
}

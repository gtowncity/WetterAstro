export default function HeroPrototype() {
  return (
    <section className="hero-prototype" aria-label="Wetter Hero Prototyp">
      <div className="hero-stage">
        <header className="hero-statusbar" aria-hidden="true">
          <span className="hero-time">15:39</span>
          <span className="hero-island">
            <span className="hero-island-camera" />
            <span className="hero-island-pill" />
          </span>
          <span className="hero-signals">
            <span className="hero-wifi">⌁</span>
            <span className="hero-battery">38</span>
          </span>
        </header>

        <div className="hero-sky-depth" />
        <div className="hero-cloudbank" />
        <div className="hero-cloudbank hero-cloudbank-secondary" />
        <div className="hero-haze" />

        <div className="hero-content">
          <p className="hero-private">PRIVAT</p>
          <p className="hero-location">Geiselhöring</p>
          <p className="hero-temp">11°</p>
          <p className="hero-secondary">Gefühlt: 6°</p>
          <p className="hero-tertiary">H: 13° T: 4°</p>
        </div>
      </div>
      <div className="hero-fade" />
    </section>
  );
}

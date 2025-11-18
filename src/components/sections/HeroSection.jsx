import { LuSprout, LuSparkles, LuStethoscope, LuHouse, LuHandHeart } from 'react-icons/lu'

export default function HeroSection({ heroImage }) {
  return (
    <section className="hero" id="accueil">
      <div className="hero-body">
        <div className="hero-content">
          <div className="hero-tag">
            <LuSprout aria-hidden="true" />
            <span>Approche centrée sur la famille</span>
          </div>
          <h1>Chiara Manolio</h1>
          <p className="hero-subtitle">Sage-femme à Fribourg – à vos côtés pour une maternité sereine</p>
          <p className="hero-description">
            J’accompagne les familles à Fribourg avec un suivi humain, bienveillant et personnalisé avant et après la naissance : contrôles de grossesse sur ordonnance, préparation à la
            naissance et à la parentalité, suivi post-partum et allaitement.
            <br />
            À votre rythme, avec une écoute active et des explications claires, je vous aide à faire des choix éclairés.
            <br /> <br />
            J’anime aussi des ateliers de portage et de massage bébé pour renforcer le lien, la confiance et le confort à la maison.
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <span className="feature-icon">
                <LuSparkles aria-hidden="true" />
              </span>
              <span>Accompagnement bienveillant</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">
                <LuStethoscope aria-hidden="true" />
              </span>
              <span>Soutien périnatal</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">
                <LuHouse aria-hidden="true" />
              </span>
              <span>Consultations à domicile</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">
                <LuHandHeart aria-hidden="true" />
              </span>
              <span>Ateliers pratiques</span>
            </div>
          </div>
          <div className="hero-actions">
            <a className="btn" href="#contact">Prendre rendez-vous</a>
            <a className="btn-secondary" href="#services">Découvrir mes services</a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">+150</span>
              <span className="stat-label">Naissances accompagnées</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10 ans</span>
              <span className="stat-label">D'expérience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-illustration">
            <img src={heroImage} alt="Illustration principale de l'accompagnement sage-femme" />
          </div>
        </div>
      </div>
    </section>
  )
}

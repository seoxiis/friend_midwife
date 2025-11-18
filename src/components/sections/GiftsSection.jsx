export default function GiftsSection({ giftCardImage, onContactClick }) {
  return (
    <section className="section gifts floating-safe" id="gifts">
      <div className="gifts-shell">
        <div className="section-header">
          <h2>Bon & carte cadeau</h2>
          <p>Offrez un moment privilégié autour du portage ou du massage bébé.</p>
        </div>
        <div className="gifts-content">
          <div className="gifts-visual">
            <img src={giftCardImage} alt="Illustration carte cadeau" />
            <div className="gifts-badge">🎁 Cadeau personnalisé</div>
          </div>
          <div className="gifts-text">
            <h3>Un cadeau qui accompagne vraiment</h3>
            <p>
              Vous souhaitez offrir un atelier de portage, un cycle de massage bébé Shantala, ou tout autre accompagnement de mes services&nbsp;?
            </p>
            <p>
              Je peux créer un bon cadeau personnalisé (imprimé ou numérique) pour la prestation de votre choix.
            </p>
            <div className="gifts-features">
              <div className="gift-feature">
                <span className="gift-feature-icon">✨</span>
                <span>Format imprimé ou numérique</span>
              </div>
              <div className="gift-feature">
                <span className="gift-feature-icon">🎯</span>
                <span>Personnalisable selon vos besoins</span>
              </div>
              <div className="gift-feature">
                <span className="gift-feature-icon">💝</span>
                <span>Valable sur tous mes services</span>
              </div>
            </div>
            <button type="button" className="btn gift-cta-btn" onClick={onContactClick}>
              Commander un bon cadeau
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

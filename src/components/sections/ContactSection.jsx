import { LuCalendarCheck, LuInstagram, LuMail } from 'react-icons/lu'

export default function ContactSection({ onContactClick }) {
  return (
    <section className="section contact" id="contact">
      <div className="section-header">
        <h2>Contact</h2>
        <p>Parlons de vos besoins et imaginons ensemble un suivi sur mesure.</p>
      </div>
      <div className="contact-grid">
        <div className="contact-card">
          <h3>Coordonnées</h3>
          <p>Chiara Manolio</p>
          <p>Granges-Paccot</p>
          <p>Fribourg, Suisse</p>
          <p>chiara.manolio@proton.me</p>
          <p>+41 79 267 69 12</p>
          <div className="contact-actions">
            <button type="button" className="btn contact-form-btn" onClick={onContactClick}>
              <LuMail aria-hidden="true" />
              <span>Envoyer un message</span>
            </button>
          </div>
        </div>
        <div className="contact-card">
          <h3>Horaires</h3>
          <p>Lundi - Vendredi : 9h - 18h</p>
          <p>Consultations à domicile sur rendez-vous</p>
        </div>
        <div className="contact-card contact-links">
          <h3>Liens utiles</h3>
          <a
            href="https://sage-femme-fribourg.ch/rechercher-sage-femme/Chiara+Manolio"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="link-icon">
              <LuCalendarCheck aria-hidden="true" />
            </span>
            <div>
              <strong>Consulter mes disponibilités</strong>
              <span className="link-description">Répertoire des sages-femmes Fribourg</span>
            </div>
          </a>
          <a
            href="https://www.instagram.com/chiara_sagefemme/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="link-icon">
              <LuInstagram aria-hidden="true" />
            </span>
            <div>
              <strong>Suivez-moi sur Instagram</strong>
              <span className="link-description">Conseils et actualités</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}

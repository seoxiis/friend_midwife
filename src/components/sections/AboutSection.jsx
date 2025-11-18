import { LuHeartHandshake, LuStethoscope, LuHouse, LuSparkles } from 'react-icons/lu'

export default function AboutSection({ aboutImage }) {
  return (
    <section className="section about" id="about">
      <div className="section-header">
        <h2>À propos</h2>
        <p>J’accompagne les familles à Fribourg avec un suivi humain, bienveillant et personnalisé avant et après la naissance.</p>
      </div>
      <div className="about-content">
        <div className="about-visual">
          <figure className="about-photo">
            <img src={aboutImage} alt="Accompagnement bienveillant" />
          </figure>
        </div>
        <div className="about-text">
          <h3>Chiara Manolio, Sage-femme</h3>
          <p>
            Je suis Chiara, sage‑femme depuis 2022 et maman de deux petits garçons. Depuis toujours, je suis fascinée par la naissance, par cette rencontre unique entre un bébé et ses parents, par la force et la vulnérabilité mêlées qui entourent ces moments.
          </p>
          <p>
            Pendant mes études, assister à ma première naissance a été un véritable déclic : j'ai compris à quel point ce métier était bien plus qu'un savoir médical. C'est une présence, une écoute, un lien humain profond.
          </p>
          <p>
            Devenir mère m'a ensuite apporté un regard très concret sur cette période : les émotions intenses, les joies, mais aussi les doutes et la fatigue du quotidien. Vivre la parentalité de l'intérieur m'a aidée à mieux comprendre la réalité des familles et à ajuster ma pratique : davantage de simplicité, de bienveillance et d'outils utiles ici et maintenant.
          </p>
        </div>
      </div>
      <div className="about-details">
        <div className="about-section">
          <h4>Mon parcours</h4>
          <p>
            Après plusieurs années à la maternité de Morges, j'ai ressenti le besoin d'accompagner les familles autrement, avec plus de temps, de proximité et de liberté dans la façon de prendre soin.
          </p>
          <p>
            Aujourd'hui installée en indépendante à Fribourg, je me déplace dans un rayon d'environ 15 km autour de Granges-Paccot. J'accompagne les parents avant et après la naissance, dans la continuité, avec des mots simples et une attention sincère.
          </p>
        </div>
        <div className="about-section">
          <h4>Ma démarche</h4>
          <p>
            Ma démarche repose sur la confiance et l'écoute. Dès le premier contact, je prends le temps de comprendre vos besoins et vos priorités. Les rendez-vous prénataux permettent de poser des bases claires et adaptées à votre réalité.
          </p>
          <p>
            Après la naissance, je poursuis l'accompagnement à domicile : suivi post-partum, soins maternels, soutien à l'allaitement et repères concrets pour le quotidien. Mon objectif est que vous vous sentiez soutenus, informés et confiants à chaque étape.
          </p>
          <p>
            Je continue à me former pour élargir mon offre de soins et proposer des accompagnements toujours plus complets : portage physiologique, massage bébé, et bientôt d'autres approches autour du bien-être et du lien parent-enfant.
          </p>
        </div>
        <p className="about-highlight">
          <strong>Mes valeurs : une écoute vraie, des mots simples et une relation de confiance.</strong>
        </p>
        <p className="about-languages">
          <em>Je parle français et anglais.</em>
        </p>
      </div>
      <div className="about-values">
        <div className="value-card">
          <span className="value-icon">
            <LuHeartHandshake aria-hidden="true" />
          </span>
          <h4>Écoute active</h4>
          <p>Un temps dédié à vos questions et préoccupations</p>
        </div>
        <div className="value-card">
          <span className="value-icon">
            <LuStethoscope aria-hidden="true" />
          </span>
          <h4>Soutien périnatal</h4>
          <p>De la grossesse au post-partum, je vous guide</p>
        </div>
        <div className="value-card">
          <span className="value-icon">
            <LuHouse aria-hidden="true" />
          </span>
          <h4>Confort à domicile</h4>
          <p>Consultations chez vous selon vos besoins</p>
        </div>
        <div className="value-card">
          <span className="value-icon">
            <LuSparkles aria-hidden="true" />
          </span>
          <h4>Accompagnement bienveillant</h4>
          <p>Écoute sincère, respect de vos choix et soutien sans jugement à chaque étape</p>
        </div>
      </div>
    </section>
  )
}

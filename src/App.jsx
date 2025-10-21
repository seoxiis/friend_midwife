import { useEffect, useState, useRef } from 'react'
import { LuSprout, LuHouse, LuCalendarClock, LuSparkles, LuHeartHandshake, LuUsers, LuCalendarCheck, LuInstagram, LuStethoscope, LuHandHeart } from 'react-icons/lu'
import './App.css'
import TestimonialModal from './components/TestimonialModal'
import FloatingMenu from './components/FloatingMenu'

const assetFallbacks = {
  heroImage: 'https://placehold.co/640x480?text=Visuel+sage-femme',
  aboutImage: 'https://placehold.co/600x600?text=Photo+accompagnement',
  serviceGrossesseImage: 'https://placehold.co/320x220?text=Consultation+pr%C3%A9natale',
  serviceBirthImage: 'https://placehold.co/320x220?text=Pr%C3%A9paration+%C3%A0+la+naissance',
  servicePostpartumImage: 'https://placehold.co/320x220?text=Post-partum+%26+allaitement',
  servicePortageImage: 'https://placehold.co/320x220?text=Atelier+portage',
  serviceMassageImage: 'https://placehold.co/320x220?text=Massage+b%C3%A9b%C3%A9',
  serviceLactationImage: 'https://placehold.co/320x220?text=Accompagnement+allaitement',
}

const HEADER_COMPACT_ENTER = 80
const HEADER_COMPACT_EXIT = 0

function App() {
  const [testimonials, setTestimonials] = useState([])
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHeaderCompact, setIsHeaderCompact] = useState(false)
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)
  const [assets, setAssets] = useState({ ...assetFallbacks })
  const carouselIntervalRef = useRef(null)

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      if (!response.ok) {
        throw new Error('Impossible de récupérer les témoignages pour le moment.')
      }
      const data = await response.json()
      setTestimonials(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingTestimonials(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY

      setIsHeaderCompact((prev) => {
        if (!prev && y >= HEADER_COMPACT_ENTER) {
          return true
        }
        if (prev && y <= HEADER_COMPACT_EXIT) {
          return false
        }
        return prev
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/assets')
      if (!response.ok) {
        throw new Error('Impossible de récupérer les images du site.')
      }
      const data = await response.json()
      setAssets({ ...assetFallbacks, ...data })
    } catch (error) {
      console.error(error)
      setAssets({ ...assetFallbacks })
    }
  }

  useEffect(() => {
    fetchTestimonials()
    fetchAssets()
  }, [])

  useEffect(() => {
    document.title = 'Chiara Manolio – Sage-femme à Fribourg'

    const ensureMeta = (attributes) => {
      const selector = Object.entries(attributes)
        .map(([key, value]) => `[${key}="${value}"]`)
        .join('')
      let meta = document.head.querySelector(`meta${selector}`)
      if (!meta) {
        meta = document.createElement('meta')
        Object.entries(attributes).forEach(([key, value]) => meta.setAttribute(key, value))
        document.head.appendChild(meta)
      }
      return meta
    }

    const ensureLink = (rel, href) => {
      let link = document.head.querySelector(`link[rel="${rel}"]`)
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', rel)
        document.head.appendChild(link)
      }
      link.setAttribute('href', href)
    }

    ensureMeta({ name: 'description' }).setAttribute(
      'content',
      'Sage-femme à Fribourg, Chiara Manolio accompagne votre grossesse, la préparation à la naissance et le post-partum avec un suivi personnalisé.'
    )
    ensureMeta({ property: 'og:title' }).setAttribute('content', 'Chiara Manolio – Sage-femme à Fribourg')
    ensureMeta({ property: 'og:description' }).setAttribute(
      'content',
      'Services de sage-femme à Fribourg : préparation à la naissance, suivi prénatal et accompagnement post-partum.'
    )
    ensureMeta({ property: 'og:url' }).setAttribute('content', 'https://chiara-manolio.ch/')
    ensureMeta({ name: 'twitter:title' }).setAttribute('content', 'Chiara Manolio – Sage-femme à Fribourg')
    ensureMeta({ name: 'twitter:description' }).setAttribute(
      'content',
      'Accompagnement bienveillant de la grossesse au post-partum à Fribourg.'
    )
    ensureLink('canonical', 'https://chiara-manolio.ch/')

    const addJsonLd = (id, data) => {
      let script = document.getElementById(id)
      if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.id = id
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(data)
    }

    addJsonLd('structured-data-localbusiness', {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Chiara Manolio – Sage-femme',
      image: 'https://chiara-manolio.ch/assets/og-image.jpg',
      url: 'https://chiara-manolio.ch/',
      telephone: '+41 00 000 00 00',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Fribourg',
        addressCountry: 'CH',
      },
      areaServed: 'Fribourg',
      sameAs: [
        'https://www.instagram.com/chiara_sagefemme/',
        'https://sage-femme-fribourg.ch/rechercher-sage-femme/Chiara+Manolio',
      ],
      priceRange: 'CHF',
    })

    addJsonLd('structured-data-service', {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Accompagnement sage-femme',
      provider: {
        '@type': 'Person',
        name: 'Chiara Manolio',
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: 'Fribourg',
      },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: 'https://sage-femme-fribourg.ch/rechercher-sage-femme/Chiara+Manolio',
      },
    })

    addJsonLd('structured-data-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Quels services propose Chiara Manolio ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Consultations prénatales, préparation à la naissance, accompagnement post-partum et visites à domicile.',
          },
        },
        {
          '@type': 'Question',
          name: 'Où se situe la sage-femme ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Chiara Manolio exerce à Fribourg et se déplace à domicile dans la région.',
          },
        },
        {
          '@type': 'Question',
          name: 'Comment prendre rendez-vous ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Vous pouvez consulter les disponibilités en ligne ou contacter directement Chiara par téléphone ou e-mail.',
          },
        },
      ],
    })
  }, [])

  useEffect(() => {
    if (testimonials.length > 1) {
      carouselIntervalRef.current = setInterval(() => {
        setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)
      }, 5000)
    }

    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current)
      }
    }
  }, [testimonials.length])

  const formatDate = (value) => {
    try {
      return new Date(value).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch (error) {
      return ''
    }
  }

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleModalSubmitSuccess = () => {
    fetchTestimonials()
  }

  const handleTestimonialDotClick = (index) => {
    setCurrentTestimonialIndex(index)
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current)
      carouselIntervalRef.current = setInterval(() => {
        setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)
      }, 5000)
    }
  }

  return (
    <div className="app">
      <header className={`site-header ${isHeaderCompact ? 'compact' : ''}`}>
        <nav className="nav">
          <span className="brand">
            <span className="brand-mark"><img src="logo.png" alt="Chiara Manolio" /></span>
            Chiara Manolio
          </span>
          <div className="nav-actions">
            <div className="nav-links">
              <a href="#about">À propos</a>
              <a href="#services">Services</a>
            </div>
            <a className="nav-cta" href="#contact">Prendre rendez-vous</a>
          </div>
        </nav>
      </header>

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
              J’accompagne les familles à Fribourg avec un suivi humain, bienveillant et personnalisé avant et après la naissance : contrôles de grossesse sur ordonnance, préparation à la naissance et à la parentalité, suivi post-partum et allaitement.
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
              <img src={assets.heroImage} alt="Illustration principale de l'accompagnement sage-femme" />
            </div>
          </div>
        </div>
      </section>

      <FloatingMenu />
      <div className="floating-shortcuts">
        <a
          className="floating-shortcut availability"
          href="https://sage-femme-fribourg.ch/rechercher-sage-femme/Chiara+Manolio"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LuCalendarCheck aria-hidden="true" />
          <span>Disponibilités</span>
        </a>
        <a
          className="floating-shortcut instagram"
          href="https://www.instagram.com/chiara_sagefemme/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LuInstagram aria-hidden="true" />
          <span>Instagram</span>
        </a>
      </div>

      <section className="section about" id="about">
        <div className="section-header">
          <h2>À propos</h2>
          <p>J’accompagne les familles à Fribourg avec un suivi humain, bienveillant et personnalisé avant et après la naissance.</p>
        </div>
        <div className="about-content">
          <div className="about-visual">
            <figure className="about-photo">
              <img src={assets.aboutImage} alt="Accompagnement bienveillant" />
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

      <section className="section services" id="services">
        <div className="section-header">
          <h2>Services</h2>
          <p>Des prestations pensées pour prendre soin de vous et de votre bébé.</p>
        </div>
        <div className="cards">
          <article className="card">
            <div className="card-media">
              <img src={assets.serviceGrossesseImage} alt="Suivi de grossesse sur ordonnance" />
            </div>
            <div className="card-body">
              <span className="card-badge">Pendant la grossesse</span>
              <h3>Suivi de grossesse</h3>
              <p>Si la grossesse nécessite une vigilance particulière, votre médecin peut prescrire un suivi à domicile par une sage-femme. Ce suivi s'adapte à votre situation.</p>
              <ul className="card-list">
                <li>Surveillance de tension arterielle</li>
                <li>Surveillance des urines</li>
                <li>Surveillance du bien-être psychique</li>
              </ul>
            </div>
          </article>
          <article className="card">
            <div className="card-media">
              <img src={assets.serviceBirthImage} alt="Préparation à la naissance" />
            </div>
            <div className="card-body">
              <span className="card-badge">Avant la naissance</span>
              <h3>Préparation à la naissance & à la parentalité</h3>
              <p>Des cours sur mesure pour la grossesse, l'accouchement et le post-partum : comprendre le corps, soulager les maux, repères pour le jour J et préparation du retour à la maison.</p>
              <ul className="card-list">
                <li>Individuel ou en couple</li>
                <li>Préparation personnalisée</li>
                <li>150.- remboursé par la LAMal</li>
              </ul>
            </div>
          </article>
          <article className="card">
            <div className="card-media">
              <img src={assets.servicePostpartumImage} alt="Soutien post-partum" />
            </div>
            <div className="card-body">
              <span className="card-badge">Après la naissance</span>
              <h3>Suivi post-partum</h3>
              <p>Soutien global pour la santé maman-bébé, conseils pratiques, soutien à l'alimentation du nourrisson, présence rassurante.</p>
              <ul className="card-list">
                <li>Surveillance médicale maman-bébé</li>
                <li>1er bébé: 16 visites remboursés par la LAMal pendant 56 jours</li>
                <li>À partir du 2ᵉ enfant : 10 visites remboursées.</li>
              </ul>
            </div>
          </article>
          <article className="card">
            <div className="card-media">
              <img src={assets.servicePortageImage} alt="Atelier de portage physiologique" />
            </div>
            <div className="card-body">
              <span className="card-badge">Atelier</span>
              <h3>Atelier de portage</h3>
              <p>Porter bébé près de soi dans une position respectueuse, pour apaiser, renforcer le lien, soutenir l'allaitement et garder les mains libres au quotidien.</p>
              <ul className="card-list">
                <li>Découverte des différents moyens de portage</li>
                <li>Cours privés à domicile</li>
                <li>Conseils entretien & choix du matériel</li>
              </ul>
            </div>
          </article>
          <article className="card">
            <div className="card-media">
              <img src={assets.serviceMassageImage} alt="Atelier massage bébé" />
            </div>
            <div className="card-body">
              <span className="card-badge">Atelier</span>
              <h3>Atelier de massage bébé</h3>
              <p>Massage traditionnel Shantala : mouvements simples et enveloppants, réalisés à l'huile, pour apaiser, soutenir le sommeil, aider la digestion et nourrir le lien parent-enfant, dans le respect des signaux de bébé.</p>
              <ul className="card-list">
                <li>Apaisement & détente</li>
                <li>Conscience corporelle</li>
                <li>Lien d'attachement</li>
              </ul>
            </div>
          </article>
          <article className="card">
            <div className="card-media">
              <img src={assets.serviceLactationImage} alt="Accompagnement allaitement" />
            </div>
            <div className="card-body">
              <span className="card-badge">Accompagnement</span>
              <h3>Allaitement</h3>
              <p>Démarrage serein : aide au bon positionnement, repères pour reconnaître une bonne prise, évaluation de l'efficacité des tétées, et soutien émotionnel dès les premiers jours.</p>
              <ul className="card-list">
                <li>Allaitement exclusif, mixte, tirage ou sevrage en douceur.</li>
                <li>Prévention & prise en charge des douleurs</li>
                <li>3 consultations remboursées par la LAMal durant toute la durée d'allaitement</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section className="section testimonials" id="testimonials">
        <div className="section-header">
          <h2>Témoignages</h2>
          <p>Des familles qui ont vécu une naissance paisible et entourée.</p>
        </div>

        {isLoadingTestimonials ? (
          <p className="muted" style={{ textAlign: 'center' }}>Chargement des témoignages...</p>
        ) : testimonials.length === 0 ? (
          <div className="testimonials-empty">
            <p className="muted">Aucun témoignage pour le moment.</p>
            <button className="btn" onClick={handleOpenModal}>
              Soyez le premier à partager votre expérience
            </button>
          </div>
        ) : (
          <div className="testimonials-carousel">
            <div className="carousel-container">
              {testimonials.map((testimonial, index) => (
                <article
                  key={testimonial.id}
                  className={`testimonial-slide ${index === currentTestimonialIndex ? 'active' : ''}`}
                >
                  <div className="testimonial-image">
                    {testimonial.imageUrl ? (
                      <img src={testimonial.imageUrl} alt={`Portrait partagé par ${testimonial.name}`} />
                    ) : (
                      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="60" cy="60" r="60" fill="#e2ebe7" />
                        <circle cx="60" cy="45" r="20" fill="#6e9c83" />
                        <path d="M30 95 Q30 70 60 70 Q90 70 90 95" fill="#6e9c83" />
                      </svg>
                    )}
                  </div>
                  <p className="testimonial-quote">« {testimonial.message} »</p>
                  <div className="testimonial-author">
                    <span className="testimonial-name">{testimonial.name}</span>
                    <span className="testimonial-date">{formatDate(testimonial.created_at)}</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="carousel-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentTestimonialIndex ? 'active' : ''}`}
                  onClick={() => handleTestimonialDotClick(index)}
                  aria-label={`Aller au témoignage ${index + 1}`}
                />
              ))}
            </div>
            <button className="btn carousel-cta" onClick={handleOpenModal}>
              Partager mon témoignage
            </button>
          </div>
        )}
      </section>

      <TestimonialModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmitSuccess={handleModalSubmitSuccess}
      />

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
          </div>
          <div className="contact-card">
            <h3>Horaires</h3>
            <p>Lundi - Vendredi : 9h - 18h</p>
            <p>Consultations à domicile sur rendez-vous</p>
          </div>
          <div className="contact-card contact-links">
            <h3>Liens utiles</h3>
            <a href="https://sage-femme-fribourg.ch/rechercher-sage-femme/Chiara+Manolio" target="_blank" rel="noopener noreferrer" className="contact-link">
              <span className="link-icon">
                <LuCalendarCheck aria-hidden="true" />
              </span>
              <div>
                <strong>Consulter mes disponibilités</strong>
                <span className="link-description">Répertoire des sages-femmes Fribourg</span>
              </div>
            </a>
            <a href="https://www.instagram.com/chiara_sagefemme/" target="_blank" rel="noopener noreferrer" className="contact-link">
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

      <footer className="footer">
        <div className="footer-brand" aria-hidden="true">
          <span className="footer-logo">
            <img src="logo.png" alt="Logo Chiara Manolio" />
          </span>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Chiara Manolio, Sage-femme libérale.</p>
        <div className="footer-links">
          <a
            href="https://sage-femme-fribourg.ch/rechercher-sage-femme/Chiara+Manolio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LuCalendarCheck aria-hidden="true" />
            <span>Disponibilités</span>
          </a>
          <a href="https://www.instagram.com/chiara_sagefemme/" target="_blank" rel="noopener noreferrer">
            <LuInstagram aria-hidden="true" />
            <span>Instagram</span>
          </a>
          <a href="#accueil">Mabe by Seoxis</a>
          <a className="footer-admin-link" href="/admin">Accès admin</a>
        </div>
      </footer>
    </div>
  )
}

export default App

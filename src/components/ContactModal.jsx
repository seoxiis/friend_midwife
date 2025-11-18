import { useEffect, useState } from 'react'
import './ContactModal.css'

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    antiBotAnswer: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [antiBotQuestion, setAntiBotQuestion] = useState({ num1: 0, num2: 0, answer: 0 })
  const [showAntiBotHint, setShowAntiBotHint] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      // Générer une nouvelle question antibot à l'ouverture
      const num1 = Math.floor(Math.random() * 10) + 1
      const num2 = Math.floor(Math.random() * 10) + 1
      setAntiBotQuestion({ num1, num2, answer: num1 + num2 })
      setShowAntiBotHint(false)
      setHasSubmitted(false)
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        antiBotAnswer: '',
      })
      setSubmitStatus(null)
      setShowAntiBotHint(false)
      setHasSubmitted(false)
    }
  }, [isOpen])

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Vérifier la réponse antibot
    const userAnswer = parseInt(formData.antiBotAnswer.trim(), 10)
    if (isNaN(userAnswer) || userAnswer !== antiBotQuestion.answer) {
      setSubmitStatus({ 
        type: 'error', 
        message: `Réponse incorrecte. ${antiBotQuestion.num1} + ${antiBotQuestion.num2} = ?` 
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error((await response.json())?.message || 'Impossible d\'envoyer votre message pour le moment.')
      }

      setSubmitStatus({ type: 'success', message: 'Merci ! Votre message a bien été envoyé.' })
      setHasSubmitted(true)
    } catch (error) {
      setSubmitStatus({ type: 'error', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="contact-modal-backdrop" onClick={handleBackdropClick} role="presentation">
      <div
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <button type="button" className="contact-modal-close" onClick={onClose} aria-label="Fermer">
          ✕
        </button>
        <div className="contact-modal-header">
          <h3 id="contact-modal-title">Me contacter</h3>
          <p>Pour toute demande (réservation, bon cadeau, question), remplissez le formulaire ci-dessous.</p>
        </div>
        <form className="contact-modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="contact-name">Nom & prénom *</label>
            <input
              type="text"
              id="contact-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact-email">Email *</label>
            <input
              type="email"
              id="contact-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact-phone">Téléphone</label>
            <input
              type="tel"
              id="contact-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact-message">Message *</label>
            <textarea
              id="contact-message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group antibot-group">
            <p className="antibot-note">(Le calcul apparaîtra dès que vous sélectionnez le champ)</p>
            <label htmlFor="contact-antibot">
              Question antibot : merci de résoudre la petite addition
            </label>
            <div className="antibot-input-wrapper">
              <input
                type="text"
                id="contact-antibot"
                name="antiBotAnswer"
                value={formData.antiBotAnswer}
                onChange={handleChange}
                onFocus={() => setShowAntiBotHint(true)}
                onBlur={() => setShowAntiBotHint(false)}
                required
                disabled={isSubmitting}
                placeholder="Entrez votre réponse"
              />
              {showAntiBotHint && (
                <span className="antibot-inline-hint right">{antiBotQuestion.num1} + {antiBotQuestion.num2} = ?</span>
              )}
            </div>
          </div>
          {submitStatus && (
            <div className={`contact-modal-status ${submitStatus.type}`}>
              {submitStatus.message}
            </div>
          )}
          <button type="submit" className="btn contact-modal-submit" disabled={isSubmitting || hasSubmitted}>
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
        </form>
      </div>
    </div>
  )
}

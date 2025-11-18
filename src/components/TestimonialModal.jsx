import { useEffect, useState } from 'react'
import './TestimonialModal.css'

export default function TestimonialModal({ isOpen, onClose, onSubmitSuccess }) {
  const [formData, setFormData] = useState({ name: '', message: '', imageUrl: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setHasSubmitted(false)
      setSubmitSuccess('')
      setSubmitError('')
    }
  }, [isOpen])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleImageUpload = async (file) => {
    if (!file) return

    setUploadingImage(true)
    setSubmitError('')

    const uploadFormData = new FormData()
    uploadFormData.append('image', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image')
      }

      const { url } = await response.json()
      setFormData((previous) => ({ ...previous, imageUrl: url }))
    } catch (error) {
      console.error(error)
      setSubmitError(error.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!formData.name.trim() || !formData.message.trim()) {
      setSubmitError('Merci de remplir les deux champs.')
      return
    }

    setSubmitError('')
    setSubmitSuccess('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          message: formData.message.trim(),
          imageUrl: formData.imageUrl.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new Error(errorBody?.message || 'Une erreur est survenue lors de l\'envoi.')
      }

      await response.json()
      setFormData({ name: '', message: '', imageUrl: '' })
      setSubmitSuccess('Merci ! Votre témoignage sera publié après validation.')
      setHasSubmitted(true)
      
      setTimeout(() => {
        onClose()
        setSubmitSuccess('')
        if (onSubmitSuccess) onSubmitSuccess()
      }, 2000)
    } catch (error) {
      console.error(error)
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Fermer">
          ✕
        </button>
        <form className="testimonial-modal-form" onSubmit={handleSubmit} noValidate>
          <h3>Partager votre témoignage</h3>
          <p className="modal-intro">
            Votre retour d'expérience sera précieux pour les futures familles. Il sera publié après validation.
          </p>
          <div className="form-group">
            <label htmlFor="testimonial-name">Votre prénom</label>
            <input
              id="testimonial-name"
              name="name"
              type="text"
              placeholder="Ex : Camille"
              value={formData.name}
              onChange={handleInputChange}
              maxLength={80}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="testimonial-image">Image (optionnel)</label>
            <div className="image-input-group">
              <input
                id="testimonial-image"
                name="imageUrl"
                type="url"
                placeholder="https://exemple.com/mon-image.jpg"
                value={formData.imageUrl}
                onChange={handleInputChange}
                maxLength={500}
              />
              <span className="input-separator">ou</span>
              <label className="btn-file-upload-modal">
                {uploadingImage ? 'Upload...' : 'Choisir fichier'}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                />
              </label>
            </div>
            <p className="muted small">Formats recommandés : JPG ou PNG, 600×600 minimum.</p>
            {formData.imageUrl && (
              <div className="image-preview-small">
                <img src={formData.imageUrl} alt="Aperçu" />
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="testimonial-message">Votre message</label>
            <textarea
              id="testimonial-message"
              name="message"
              rows={5}
              placeholder="Racontez comment s'est déroulé votre accompagnement..."
              value={formData.message}
              onChange={handleInputChange}
              maxLength={500}
              required
            />
          </div>
          {submitError ? <p className="form-feedback error">{submitError}</p> : null}
          {submitSuccess ? <p className="form-feedback success">{submitSuccess}</p> : null}
          <button className="btn" type="submit" disabled={isSubmitting || hasSubmitted}>
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon témoignage'}
          </button>
        </form>
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import './ServiceModal.css'

export default function ServiceModal({ service, onClose }) {
  useEffect(() => {
    if (!service) return undefined

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
  }, [service, onClose])

  if (!service) {
    return null
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="service-modal-backdrop" onClick={handleBackdropClick} role="presentation">
      <div
        className="service-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`service-modal-title-${service.id}`}
      >
        <button type="button" className="service-modal-close" onClick={onClose} aria-label="Fermer">
          ✕
        </button>
        <div className="service-modal-header">
          <span className="service-modal-badge">{service.badge}</span>
          <h3 id={`service-modal-title-${service.id}`}>{service.modal.title}</h3>
        </div>
        <div className="service-modal-body">{service.modal.content}</div>
      </div>
    </div>
  )
}

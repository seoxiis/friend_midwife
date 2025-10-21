import { useEffect, useState } from 'react'
import './FloatingMenu.css'

const sections = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'about', label: 'À propos' },
  { id: 'services', label: 'Services' },
  { id: 'testimonials', label: 'Avis' },
  { id: 'contact', label: 'Contact' },
]

export default function FloatingMenu() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('accueil')

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setIsVisible(y > 280)

      const offsets = sections.map((section) => {
        const element = document.getElementById(section.id)
        if (!element) return { id: section.id, offset: Number.POSITIVE_INFINITY }
        const rect = element.getBoundingClientRect()
        return { id: section.id, offset: Math.abs(rect.top) }
      })

      const closest = offsets.reduce((prev, current) => (current.offset < prev.offset ? current : prev))
      setActiveSection(closest.id)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className={`floating-menu ${isVisible ? 'visible' : ''}`}>
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          className={activeSection === section.id ? 'active' : ''}
          onClick={() => handleClick(section.id)}
          aria-label={`Aller à la section ${section.label}`}
        >
          {section.label}
        </button>
      ))}
    </div>
  )
}

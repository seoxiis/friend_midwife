import { useEffect, useMemo, useState } from 'react'
import './AdminPanel.css'
import ImageCropModal from './ImageCropModal'

const assetFields = [
  {
    key: 'heroImage',
    label: 'Visuel principal (hero)',
    description: 'Image affichée dans la section d\'ouverture. Format recommandé : 1600x900 px.'
  },
  {
    key: 'aboutImage',
    label: 'Photo À propos',
    description: 'Photo de la section présentation. Format recommandé : 1000x1000 px (carré).'
  },
  {
    key: 'serviceGrossesseImage',
    label: 'Suivi de grossesse',
    description: 'Carte service « Suivi de grossesse ». Format recommandé : 900x600 px (ratio 3:2).'
  },
  {
    key: 'serviceBirthImage',
    label: 'Préparation à la naissance & à la parentalité',
    description: 'Carte service « Préparation à la naissance & à la parentalité ». Format recommandé : 900x600 px (ratio 3:2).'
  },
  {
    key: 'servicePostpartumImage',
    label: 'Suivi post-partum',
    description: 'Carte service « Suivi post-partum ». Format recommandé : 900x600 px (ratio 3:2).'
  },
  {
    key: 'servicePortageImage',
    label: 'Atelier de portage',
    description: 'Carte service « Atelier de portage ». Format recommandé : 900x600 px (ratio 3:2).'
  },
  {
    key: 'serviceMassageImage',
    label: 'Atelier de massage bébé',
    description: 'Carte service « Atelier de massage bébé ». Format recommandé : 900x600 px (ratio 3:2).'
  },
  {
    key: 'serviceLactationImage',
    label: 'Accompagnement allaitement',
    description: 'Carte service « Allaitement ». Format recommandé : 900x600 px (ratio 3:2).'
  },
  {
    key: 'giftCardImage',
    label: 'Carte cadeau',
    description: 'Image de la section « Bon & carte cadeau ». Format recommandé : 1200x900 px (ratio 4:3).'
  },
]

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [testimonials, setTestimonials] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [newCredentials, setNewCredentials] = useState({ email: '', password: '' })
  const [updateMessage, setUpdateMessage] = useState('')
  const [assets, setAssets] = useState({})
  const [assetDraft, setAssetDraft] = useState({})
  const [assetMessage, setAssetMessage] = useState('')
  const [uploadingAssets, setUploadingAssets] = useState({})
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [currentCropField, setCurrentCropField] = useState(null)

  const pendingTestimonials = useMemo(
    () => testimonials.filter((testimonial) => !testimonial.approved),
    [testimonials]
  )
  const approvedTestimonials = useMemo(
    () => testimonials.filter((testimonial) => testimonial.approved),
    [testimonials]
  )

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      verifyToken(token)
    }
  }, [])

  const verifyToken = async (token) => {
    try {
      const response = await fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        setIsAuthenticated(true)
        fetchTestimonials(token)
        fetchAssets(token)
      } else {
        localStorage.removeItem('admin_token')
      }
    } catch (error) {
      console.error(error)
      localStorage.removeItem('admin_token')
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoginError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        throw new Error('Identifiants incorrects')
      }

      const { token } = await response.json()
      localStorage.setItem('admin_token', token)
      setIsAuthenticated(true)
      fetchTestimonials(token)
      fetchAssets(token)
    } catch (error) {
      setLoginError(error.message)
    }
  }

  const fetchTestimonials = async (token) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/testimonials', {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('admin_token')}` }
      })
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (id, approved) => {
    const token = localStorage.getItem('admin_token')
    try {
      const response = await fetch(`/api/admin/testimonials/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ approved })
      })

      if (response.ok) {
        setTestimonials(prev => prev.map(t => t.id === id ? { ...t, approved } : t))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return

    const token = localStorage.getItem('admin_token')
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        setTestimonials(prev => prev.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchAssets = async (token) => {
    try {
      const response = await fetch('/api/admin/assets', {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('admin_token')}` }
      })
      if (!response.ok) {
        throw new Error('Impossible de charger les images')
      }
      const data = await response.json()
      setAssets(data)
      setAssetDraft(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAssetInputChange = (key, value) => {
    setAssetDraft((prev) => ({ ...prev, [key]: value }))
  }

  const handleAssetUpload = async (fieldKey, file) => {
    if (!file) return

    setUploadingAssets((prev) => ({ ...prev, [fieldKey]: true }))
    const token = localStorage.getItem('admin_token')
    const formData = new FormData()
    formData.append('field', fieldKey)
    formData.append('image', file)

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload échoué')
      }

      const { url } = await response.json()
      handleAssetInputChange(fieldKey, url)
      
      // Save the asset immediately to the database
      const saveResponse = await fetch('/api/admin/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ assets: { [fieldKey]: url } })
      })

      if (!saveResponse.ok) {
        throw new Error('Sauvegarde échouée')
      }

      await fetchAssets(token)
      setAssetMessage(`Image ${fieldKey} mise à jour avec succès`)
      setTimeout(() => setAssetMessage(''), 3000)
    } catch (error) {
      console.error(error)
      setAssetMessage(`Erreur upload ${fieldKey}: ${error.message}`)
    } finally {
      setUploadingAssets((prev) => ({ ...prev, [fieldKey]: false }))
    }
  }

  const handleOpenCropModal = (fieldKey) => {
    setCurrentCropField(fieldKey)
    setIsCropModalOpen(true)
  }

  const handleCropComplete = (croppedFile) => {
    if (currentCropField) {
      handleAssetUpload(currentCropField, croppedFile)
    }
    setCurrentCropField(null)
  }

  const getAspectRatioForField = (fieldKey) => {
    if (fieldKey === 'heroImage') return 16 / 9
    if (fieldKey === 'aboutImage') return 1
    return 3 / 2  // Services use 3:2 aspect ratio
  }

  const handleAssetSubmit = async (event) => {
    event.preventDefault()
    setAssetMessage('')

    const token = localStorage.getItem('admin_token')
    try {
      const response = await fetch('/api/admin/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ assets: assetDraft })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des images')
      }

      setAssetMessage('Images mises à jour avec succès')
      setAssets(assetDraft)
    } catch (error) {
      setAssetMessage(error.message)
    }
  }

  const handleUpdateCredentials = async (event) => {
    event.preventDefault()
    setUpdateMessage('')

    if (!newCredentials.email || !newCredentials.password) {
      setUpdateMessage('Veuillez remplir tous les champs')
      return
    }

    const token = localStorage.getItem('admin_token')
    try {
      const response = await fetch('/api/admin/update-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCredentials)
      })

      if (response.ok) {
        setUpdateMessage('Identifiants mis à jour avec succès')
        setNewCredentials({ email: '', password: '' })
      } else {
        throw new Error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      setUpdateMessage(error.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    setTestimonials([])
    setAssets({})
    setAssetDraft({})
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <h1>Administration</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="admin-password">Mot de passe</label>
              <input
                id="admin-password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </div>
            {loginError && <p className="form-feedback error">{loginError}</p>}
            <button className="btn" type="submit">Se connecter</button>
          </form>
        </div>
      </div>
    )
  }

  const renderAssetField = (field) => {
    const currentValue = assetDraft[field.key] || ''
    const isUploading = uploadingAssets[field.key]
    const previewUrl = assetDraft[field.key] || assets[field.key]

    return (
      <div key={field.key} className="asset-field">
        <label htmlFor={`asset-${field.key}`}>{field.label}</label>
        <div className="asset-input-group">
          <input
            id={`asset-${field.key}`}
            value={currentValue}
            placeholder="https://exemple.com/visuel.jpg"
            onChange={(event) => handleAssetInputChange(field.key, event.target.value)}
          />
          <span className="input-separator">ou</span>
          <button
            type="button"
            className="btn"
            onClick={() => handleOpenCropModal(field.key)}
            disabled={isUploading}
          >
            {isUploading ? 'Téléversement...' : 'Téléverser une image'}
          </button>
        </div>
        <p className="muted small">{field.description}</p>
        {previewUrl ? (
          <div className="asset-preview">
            <img src={previewUrl} alt={field.label} />
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div>
          <h1>Gestion des témoignages</h1>
          <a href="/" className="admin-return-link">← Retour au site</a>
        </div>
        <button className="btn-secondary" onClick={handleLogout}>Déconnexion</button>
      </header>

      <div className="admin-content">
        <section className="admin-section">
          <h2>Témoignages en attente</h2>
          {isLoading ? (
            <p>Chargement...</p>
          ) : (
            <div className="testimonials-list">
              {pendingTestimonials.map(testimonial => (
                <article key={testimonial.id} className="admin-testimonial-card">
                  <div className="admin-testimonial-header">
                    <strong>{testimonial.name}</strong>
                    <span className="admin-date">
                      {new Date(testimonial.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {testimonial.imageUrl ? (
                    <div className="admin-testimonial-image">
                      <img src={testimonial.imageUrl} alt={`Illustration fournie par ${testimonial.name}`} />
                    </div>
                  ) : null}
                  <p className="admin-message">{testimonial.message}</p>
                  <div className="admin-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(testimonial.id, true)}
                    >
                      Approuver
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(testimonial.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </article>
              ))}
              {pendingTestimonials.length === 0 && (
                <p className="muted">Aucun témoignage en attente</p>
              )}
            </div>
          )}
        </section>

        <section className="admin-section">
          <h2>Témoignages publiés</h2>
          <div className="testimonials-list">
            {approvedTestimonials.map(testimonial => (
              <article key={testimonial.id} className="admin-testimonial-card approved">
                <div className="admin-testimonial-header">
                  <strong>{testimonial.name}</strong>
                  <span className="admin-date">
                    {new Date(testimonial.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {testimonial.imageUrl ? (
                  <div className="admin-testimonial-image">
                    <img src={testimonial.imageUrl} alt={`Illustration fournie par ${testimonial.name}`} />
                  </div>
                ) : null}
                <p className="admin-message">{testimonial.message}</p>
                <div className="admin-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => handleApprove(testimonial.id, false)}
                  >
                    Désapprouver
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(testimonial.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
            {approvedTestimonials.length === 0 && (
              <p className="muted">Aucun témoignage publié</p>
            )}
          </div>
        </section>

        <section className="admin-section">
          <h2>Modifier les identifiants</h2>
          <form onSubmit={handleUpdateCredentials} className="credentials-form">
            <div className="form-group">
              <label htmlFor="new-email">Nouvel email</label>
              <input
                id="new-email"
                type="email"
                value={newCredentials.email}
                onChange={(e) => setNewCredentials({ ...newCredentials, email: e.target.value })}
                placeholder="admin@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">Nouveau mot de passe</label>
              <input
                id="new-password"
                type="password"
                value={newCredentials.password}
                onChange={(e) => setNewCredentials({ ...newCredentials, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            {updateMessage && <p className="form-feedback">{updateMessage}</p>}
            <button className="btn" type="submit">Mettre à jour</button>
          </form>
        </section>

        <section className="admin-section">
          <h2>Images du site</h2>
          <form className="assets-form" onSubmit={handleAssetSubmit}>
            <div className="assets-grid">
              {assetFields.map(renderAssetField)}
            </div>
            {assetMessage && <p className="form-feedback">{assetMessage}</p>}
            <button className="btn" type="submit">Enregistrer les images</button>
          </form>
        </section>
      </div>

      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => {
          setIsCropModalOpen(false)
          setCurrentCropField(null)
        }}
        onCropComplete={handleCropComplete}
        aspectRatio={currentCropField ? getAspectRatioForField(currentCropField) : 16 / 9}
      />
    </div>
  )
}

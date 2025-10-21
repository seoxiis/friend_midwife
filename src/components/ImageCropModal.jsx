import { useState, useRef, useEffect } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import './ImageCropModal.css'

export default function ImageCropModal({ isOpen, onClose, onCropComplete, aspectRatio = 16 / 9 }) {
  const [imgSrc, setImgSrc] = useState('')
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const imgRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      setImgSrc('')
      setCrop(undefined)
      setCompletedCrop(undefined)
    }
  }, [isOpen])

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '')
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget
    const imageAspect = width / height
    
    let cropWidth, cropHeight, cropX, cropY
    
    if (imageAspect > aspectRatio) {
      // Image is wider than crop aspect
      cropHeight = 100
      cropWidth = (height * aspectRatio / width) * 100
      cropX = (100 - cropWidth) / 2
      cropY = 0
    } else {
      // Image is taller than crop aspect
      cropWidth = 100
      cropHeight = (width / aspectRatio / height) * 100
      cropX = 0
      cropY = (100 - cropHeight) / 2
    }

    const crop = {
      unit: '%',
      width: cropWidth,
      height: cropHeight,
      x: cropX,
      y: cropY
    }
    setCrop(crop)
  }

  const getCroppedImg = async () => {
    if (!completedCrop || !imgRef.current) {
      return null
    }

    const image = imgRef.current
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext('2d')

    const pixelRatio = window.devicePixelRatio || 1

    canvas.width = completedCrop.width * scaleX * pixelRatio
    canvas.height = completedCrop.height * scaleY * pixelRatio

    if (!ctx) return null

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingQuality = 'high'

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    )

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null)
            return
          }
          resolve(blob)
        },
        'image/jpeg',
        0.9
      )
    })
  }

  const handleCropConfirm = async () => {
    const croppedBlob = await getCroppedImg()
    if (croppedBlob) {
      const file = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' })
      onCropComplete(file)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="image-crop-modal-overlay" onClick={onClose}>
      <div className="image-crop-modal" onClick={(e) => e.stopPropagation()}>
        <div className="image-crop-header">
          <h3>Recadrer l'image</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="image-crop-content">
          {!imgSrc ? (
            <div className="image-crop-upload">
              <input
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <button className="btn" onClick={() => fileInputRef.current?.click()}>
                Sélectionner une image
              </button>
              <p className="muted">Formats acceptés : JPG, PNG, GIF, WEBP (max 5 MB)</p>
            </div>
          ) : (
            <>
              <div className="image-crop-instructions">
                <p className="muted">
                  <strong>Instructions :</strong> Déplacez et redimensionnez le cadre pour sélectionner la zone à conserver. 
                  L'image finale sera recadrée selon ce cadre. Si l'image est grande, faites défiler pour voir l'image entière.
                </p>
              </div>
              <div className="image-crop-area">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                >
                  <img
                    ref={imgRef}
                    alt="Crop preview"
                    src={imgSrc}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
              <div className="image-crop-actions">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setImgSrc('')
                    setCrop(undefined)
                    setCompletedCrop(undefined)
                  }}
                >
                  Changer d'image
                </button>
                <button
                  className="btn"
                  onClick={handleCropConfirm}
                  disabled={!completedCrop}
                >
                  Valider
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

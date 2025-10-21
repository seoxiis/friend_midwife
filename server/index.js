import express from 'express'
import path from 'path'
import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import fs from 'fs'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const defaultDatabasePath = path.join(__dirname, 'database.sqlite')
const databaseFromEnv = process.env.DATABASE_FILE
const DATABASE_FILE = databaseFromEnv ? path.resolve(databaseFromEnv) : defaultDatabasePath

const databaseDir = path.dirname(DATABASE_FILE)
if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true })
}

const UPLOADS_DIR = path.join(__dirname, 'uploads')
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Seuls les fichiers image (JPEG, PNG, GIF, WEBP) sont acceptés'))
    }
  }
})
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex')
const ASSET_DEFAULTS = {
  heroImage: 'https://placehold.co/640x480?text=Visuel+sage-femme',
  aboutImage: 'https://placehold.co/600x600?text=Photo+accompagnement',
  serviceGrossesseImage: 'https://placehold.co/320x220?text=Suivi+de+grossesse',
  serviceBirthImage: 'https://placehold.co/320x220?text=Pr%C3%A9paration+%C3%A0+la+parentalit%C3%A9',
  servicePostpartumImage: 'https://placehold.co/320x220?text=Suivi+post-partum',
  servicePortageImage: 'https://placehold.co/320x220?text=Atelier+portage',
  serviceMassageImage: 'https://placehold.co/320x220?text=Massage+b%C3%A9b%C3%A9',
  serviceLactationImage: 'https://placehold.co/320x220?text=Accompagnement+allaitement',
}
const ASSET_KEYS = Object.keys(ASSET_DEFAULTS)

sqlite3.verbose()
const db = new sqlite3.Database(DATABASE_FILE)

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      approved INTEGER DEFAULT 0,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  )

  db.all('PRAGMA table_info(testimonials)', (err, columns) => {
    if (err) {
      console.error('Failed to inspect testimonials table', err)
      return
    }

    const hasImageUrl = columns.some((column) => column.name === 'image_url')
    if (!hasImageUrl) {
      db.run('ALTER TABLE testimonials ADD COLUMN image_url TEXT', (alterErr) => {
        if (alterErr) {
          console.error('Failed to add image_url column', alterErr)
        }
      })
    }
  })

  db.run(
    `CREATE TABLE IF NOT EXISTS site_assets (
      key TEXT PRIMARY KEY,
      value TEXT
    )`
  )

  ASSET_KEYS.forEach((key) => {
    db.run(
      'INSERT OR IGNORE INTO site_assets (key, value) VALUES (?, ?)',
      [key, ASSET_DEFAULTS[key]]
    )
  })

  db.run(
    `CREATE TABLE IF NOT EXISTS admin_credentials (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      email TEXT NOT NULL,
      password_hash TEXT NOT NULL
    )`
  )

  const defaultEmail = 'chiara.mnl@outlook.com'
  const defaultPassword = 'Sage-Femme38*'
  const hash = hashPassword(defaultPassword)

  db.get('SELECT * FROM admin_credentials WHERE id = 1', (err, row) => {
    if (!row) {
      db.run(
        'INSERT INTO admin_credentials (id, email, password_hash) VALUES (1, ?, ?)',
        [defaultEmail, hash]
      )
      console.log(`Default credentials: ${defaultEmail} / ${defaultPassword}`)
    }
  })
})

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

const app = express()
app.use(express.json())
app.use('/uploads', express.static(UPLOADS_DIR))

// Servir les fichiers statiques du frontend (dist/)
const distPath = path.join(__dirname, '../dist')
app.use(express.static(distPath))

const runAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function callback(err) {
      if (err) {
        reject(err)
      } else {
        resolve({ lastID: this.lastID, changes: this.changes })
      }
    })
  })

const allAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })

const getAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Non autorisé' })
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.admin = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' })
  }
}

app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await allAsync(
      `SELECT id, name, message, image_url AS imageUrl, created_at
       FROM testimonials
       WHERE approved = 1
       ORDER BY datetime(created_at) DESC`
    )
    res.json(testimonials)
  } catch (error) {
    console.error('Failed to load testimonials', error)
    res.status(500).json({ message: "Impossible de charger les témoignages." })
  }
})

app.post('/api/testimonials', async (req, res) => {
  const name = req.body?.name?.toString().trim()
  const message = req.body?.message?.toString().trim()
  const imageUrl = req.body?.imageUrl?.toString().trim()

  if (!name || !message) {
    return res.status(400).json({ message: 'Merci de fournir un prénom et un message.' })
  }

  if (name.length > 80 || message.length > 500) {
    return res.status(400).json({ message: 'Le prénom ou le message est trop long.' })
  }

  if (imageUrl && imageUrl.length > 500) {
    return res.status(400).json({ message: 'L’URL de l’image est trop longue.' })
  }

  try {
    const result = await runAsync(
      `INSERT INTO testimonials (name, message, approved, image_url) VALUES (?, ?, 0, ?)`
      ,
      [name, message, imageUrl || null]
    )

    const created = await getAsync(
      `SELECT id, name, message, approved, image_url AS imageUrl, created_at FROM testimonials WHERE id = ?`,
      [result.lastID]
    )

    res.status(201).json(created)
  } catch (error) {
    console.error('Failed to create testimonial', error)
    res.status(500).json({ message: "Impossible d'enregistrer votre témoignage." })
  }
})

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' })
  }

  try {
    const creds = await getAsync('SELECT * FROM admin_credentials WHERE id = 1')
    
    if (!creds || creds.email !== email || creds.password_hash !== hashPassword(password)) {
      return res.status(401).json({ message: 'Identifiants incorrects' })
    }

    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token })
  } catch (error) {
    console.error('Failed to login', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

app.get('/api/admin/verify', authMiddleware, (req, res) => {
  res.json({ valid: true })
})

app.get('/api/admin/testimonials', authMiddleware, async (req, res) => {
  try {
    const testimonials = await allAsync(
      `SELECT id, name, message, approved, image_url AS imageUrl, created_at
       FROM testimonials
       ORDER BY approved ASC, datetime(created_at) DESC`
    )
    res.json(testimonials)
  } catch (error) {
    console.error('Failed to load testimonials', error)
    res.status(500).json({ message: 'Impossible de charger les témoignages.' })
  }
})

app.patch('/api/admin/testimonials/:id/approve', authMiddleware, async (req, res) => {
  const { id } = req.params
  const { approved } = req.body

  try {
    await runAsync(
      'UPDATE testimonials SET approved = ? WHERE id = ?',
      [approved ? 1 : 0, id]
    )
    res.json({ success: true })
  } catch (error) {
    console.error('Failed to update testimonial', error)
    res.status(500).json({ message: 'Erreur lors de la mise à jour' })
  }
})

app.delete('/api/admin/testimonials/:id', authMiddleware, async (req, res) => {
  const { id } = req.params

  try {
    await runAsync('DELETE FROM testimonials WHERE id = ?', [id])
    res.json({ success: true })
  } catch (error) {
    console.error('Failed to delete testimonial', error)
    res.status(500).json({ message: 'Erreur lors de la suppression' })
  }
})

app.post('/api/admin/update-credentials', authMiddleware, async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' })
  }

  try {
    const hash = hashPassword(password)
    await runAsync(
      'UPDATE admin_credentials SET email = ?, password_hash = ? WHERE id = 1',
      [email, hash]
    )
    res.json({ success: true })
  } catch (error) {
    console.error('Failed to update credentials', error)
    res.status(500).json({ message: 'Erreur lors de la mise à jour' })
  }
})

app.get('/api/assets', async (req, res) => {
  try {
    const assets = await allAsync('SELECT key, value FROM site_assets')
    const shaped = ASSET_KEYS.reduce((acc, key) => {
      const row = assets.find((asset) => asset.key === key)
      acc[key] = row?.value ?? ASSET_DEFAULTS[key]
      return acc
    }, {})
    res.json(shaped)
  } catch (error) {
    console.error('Failed to load assets', error)
    res.status(500).json({ message: 'Impossible de charger les images.' })
  }
})

app.get('/api/admin/assets', authMiddleware, async (req, res) => {
  try {
    const assets = await allAsync('SELECT key, value FROM site_assets')
    const shaped = ASSET_KEYS.reduce((acc, key) => {
      const row = assets.find((asset) => asset.key === key)
      acc[key] = row?.value ?? ASSET_DEFAULTS[key]
      return acc
    }, {})
    res.json(shaped)
  } catch (error) {
    console.error('Failed to load admin assets', error)
    res.status(500).json({ message: 'Impossible de charger les images.' })
  }
})

app.post('/api/admin/assets', authMiddleware, async (req, res) => {
  const assets = req.body?.assets

  if (!assets || typeof assets !== 'object') {
    return res.status(400).json({ message: 'Données invalides.' })
  }

  const entries = Object.entries(assets)
    .filter(([key]) => ASSET_KEYS.includes(key))
    .map(([key, value]) => [key, value?.toString().trim() ?? ''])

  if (entries.length === 0) {
    return res.status(400).json({ message: 'Aucune image à mettre à jour.' })
  }

  try {
    for (const [key, value] of entries) {
      await runAsync(
        `INSERT INTO site_assets (key, value)
         VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        [key, value || ASSET_DEFAULTS[key]]
      )
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Failed to update assets', error)
    res.status(500).json({ message: 'Impossible de mettre à jour les images.' })
  }
})

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier fourni.' })
  }

  const imageUrl = `/uploads/${req.file.filename}`
  res.json({ url: imageUrl })
})

app.post('/api/admin/upload', authMiddleware, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier fourni.' })
  }

  const fieldKey = req.body.field
  if (fieldKey && ASSET_KEYS.includes(fieldKey)) {
    try {
      const existingAsset = await getAsync('SELECT value FROM site_assets WHERE key = ?', [fieldKey])
      if (existingAsset?.value && existingAsset.value.startsWith('/uploads/')) {
        const oldFilePath = path.join(UPLOADS_DIR, path.basename(existingAsset.value))
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath)
          console.log(`Deleted old file: ${oldFilePath}`)
        }
      }
    } catch (error) {
      console.error('Failed to delete old file', error)
    }
  }

  const imageUrl = `/uploads/${req.file.filename}`
  res.json({ url: imageUrl })
})

// Fallback: toutes les routes non-API renvoient index.html (pour le routing React)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => {
  console.log(`\nAPI server listening on port ${PORT}`)
  console.log(`Admin panel: http://[::]:${PORT}/admin`)
})

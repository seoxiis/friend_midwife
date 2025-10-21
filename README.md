# 🤰 Midwife - Site de sage-femme

Site web professionnel pour sage-femme avec panneau d'administration, gestion de témoignages et upload d'images.

Site web moderne avec système de témoignages et interface d'administration.

## Fonctionnalités

- Design vert pastel avec une palette tendant vers le gris
- Témoignages clients avec système d'approbation
- Carrousel automatique pour les témoignages approuvés (défilement toutes les 5s)
- Modal de soumission de témoignages
- Interface d'administration sécurisée
- Base de données SQLite légère

## 🚀 Démarrage rapide

### Linux / Mac

```bash
# Installation
make install

# Développement (démarre frontend + backend)
make dev

# Voir toutes les commandes
make help
```

### Windows

```batch
REM Installation
scripts\install.bat

REM Développement (démarre frontend + backend)
scripts\dev.bat

REM Voir tous les scripts disponibles
dir scripts\*.bat
```

### Méthode manuelle

```bash
# Installation
npm install

# Terminal 1 : Backend (port 3001)
npm run server

# Terminal 2 : Frontend (port 5173)
npm run dev
```

**Identifiants par défaut** :
- Email : `admin@example.com`
- Mot de passe : `admin123`

## URLs

- **Site public** : http://localhost:5173
- **Interface admin** : http://localhost:5173/admin

## Administration

1. Accéder à http://localhost:5173/admin
2. Se connecter avec les identifiants par défaut
3. Approuver/refuser les témoignages en attente
4. Modifier les identifiants admin depuis l'interface

### Gestion des témoignages

- Les nouveaux témoignages sont **non approuvés** par défaut
- Seuls les témoignages **approuvés** apparaissent sur le site public
- Vous pouvez approuver, désapprouver ou supprimer chaque témoignage

## Structure du projet

```
midwife/
├── src/
│   ├── components/
│   │   ├── AdminPanel.jsx       # Interface d'administration
│   │   ├── AdminPanel.css
│   │   ├── TestimonialModal.jsx # Modal de soumission
│   │   └── TestimonialModal.css
│   ├── App.jsx                   # Page principale
│   ├── App.css
│   ├── Router.jsx                # Routage simple
│   └── main.jsx
├── server/
│   ├── index.js                  # API Express + SQLite
│   └── database.sqlite           # Base de données (créée automatiquement)
└── package.json
```

## API Endpoints

### Publics
- `GET /api/testimonials` - Récupère les témoignages approuvés
- `POST /api/testimonials` - Soumet un nouveau témoignage

### Admin (authentification requise)
- `POST /api/admin/login` - Connexion admin
- `GET /api/admin/verify` - Vérification du token
- `GET /api/admin/testimonials` - Tous les témoignages (approuvés et en attente)
- `PATCH /api/admin/testimonials/:id/approve` - Approuver/désapprouver
- `DELETE /api/admin/testimonials/:id` - Supprimer
- `POST /api/admin/update-credentials` - Modifier les identifiants

## Sécurité

- Authentification JWT avec token de 7 jours
- Mots de passe hashés avec SHA-256
- Identifiants admin modifiables depuis l'interface
- Token stocké dans le localStorage

## 📦 Déploiement en production

### Préparation

**Linux / Mac** :
```bash
make prepare-deploy
```

**Windows** :
```batch
prepare-deploy.bat
```

Cela créera un dossier `deploy/` avec tous les fichiers nécessaires.

### Upload sur Infomaniak

1. Uploader le contenu de `deploy/` via FTP
2. SSH : `npm install --production`
3. Éditer `.env` avec votre JWT_SECRET
4. Démarrer : `pm2 start ecosystem.config.cjs`

📚 **Voir `DEPLOIEMENT.md` pour le guide complet**

## 🛠️ Commandes utiles

### Makefile (Linux/Mac)

```bash
make help              # Liste toutes les commandes
make dev               # Développement
make build             # Build production
make clean             # Nettoyer les fichiers générés
make db-backup         # Sauvegarder la base de données
make generate-secret   # Générer un JWT_SECRET
```

### Scripts Windows

```batch
scripts\dev.bat              REM Développement
scripts\build.bat            REM Build production
scripts\clean.bat            REM Nettoyer
scripts\db-backup.bat        REM Sauvegarder la DB
scripts\generate-secret.bat  REM Générer JWT_SECRET
```

📚 **Voir `scripts/README.md` pour tous les scripts Windows**

## Docker

### Développement

```bash
docker-compose -f docker-compose.dev.yml up --build
```

- Frontend : http://localhost:5173 (Vite avec HMR)
- Backend : http://localhost:3001
- Volumes sur le code local pour rechargement immédiat.
- Base SQLite persistée dans le volume `backend_data` (`/data/database.sqlite`).

Arrêt : `docker-compose -f docker-compose.dev.yml down`

### Production (build local)

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

- Frontend servi par Nginx sur http://localhost:8080
- Backend exposé uniquement au réseau interne entre services
- Paramètres clés `JWT_SECRET` (variable d'environnement) et base SQLite persistée dans `backend_data`

Arrêt : `docker-compose -f docker-compose.prod.yml down`

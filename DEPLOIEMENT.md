# 📦 Guide de déploiement sur Infomaniak

## Fichiers à uploader via FTP

Voici la liste complète des fichiers et dossiers à transférer :

### ✅ Fichiers obligatoires

```
📁 Racine du projet
├── 📁 dist/                    ← Build du frontend (généré par npm run build)
├── 📁 server/                  ← Code serveur Node.js
│   └── index.js
├── 📁 node_modules/            ← Dépendances (ou installer sur le serveur)
├── package.json
├── package-lock.json
└── ecosystem.config.cjs        ← Configuration PM2 (optionnel)
```

### 🚫 Fichiers à NE PAS uploader

- `src/` (code source React, déjà compilé dans `dist/`)
- `.git/`
- `.gitignore`
- `vite.config.js`
- `eslint.config.js`
- `README.md`
- `compose*.yml` (fichiers Docker)
- `docker/`

## 📋 Étapes de déploiement

### 1. Préparer le build local

```bash
# Build du frontend
npm run build

# Vérifier que le dossier dist/ est créé
ls dist/
```

### 2. Uploader via FTP

Connectez-vous à votre serveur Infomaniak via FTP et uploadez :

```
/votre-app/
├── dist/
├── server/
├── package.json
├── package-lock.json
└── ecosystem.config.cjs
```

### 3. Installer les dépendances sur le serveur

Via SSH ou le terminal Infomaniak :

```bash
cd /chemin/vers/votre-app
npm install --production
```

### 4. Configuration des variables d'environnement

Créez un fichier `.env` sur le serveur :

```bash
PORT=3000
NODE_ENV=production
JWT_SECRET=votre-secret-super-securise-ici
DATABASE_FILE=/chemin/absolu/vers/database.sqlite
```

### 5. Démarrer l'application

**Option A : Avec PM2 (recommandé)**
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

**Option B : Avec Node directement**
```bash
node server/index.js
```

**Option C : Avec npm**
```bash
npm start
```

## 🔧 Configuration Infomaniak spécifique

### Port et domaine

- Infomaniak vous assignera un port (généralement 3000)
- Configurez votre domaine pour pointer vers ce port
- Ou utilisez un reverse proxy (souvent configuré automatiquement)

### Permissions

Assurez-vous que les dossiers suivants sont accessibles en écriture :

```bash
chmod 755 server/
chmod 755 dist/
mkdir -p server/uploads
chmod 755 server/uploads
```

### Base de données

La base SQLite sera créée automatiquement au premier lancement dans :
```
server/database.sqlite
```

## 🔐 Sécurité

### Créer un JWT_SECRET sécurisé

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copiez le résultat dans votre fichier `.env` sur le serveur.

### Premier accès admin

1. Accédez à `https://votre-domaine.ch/admin`
2. Utilisez les identifiants par défaut (à changer immédiatement !) :
   - Email : `admin@example.com`
   - Mot de passe : `admin123`
3. Changez immédiatement les identifiants via le panneau admin

## 📊 Vérification du déploiement

1. **Frontend** : `https://votre-domaine.ch` → Page d'accueil
2. **API** : `https://votre-domaine.ch/api/assets` → JSON des assets
3. **Admin** : `https://votre-domaine.ch/admin` → Panneau admin
4. **Uploads** : `https://votre-domaine.ch/uploads/` → Dossier images

## 🔄 Mise à jour de l'application

```bash
# Local
npm run build

# FTP : Uploader uniquement dist/ et server/

# Serveur
pm2 restart midwife-app
```

## 🆘 Dépannage

### L'app ne démarre pas

```bash
# Vérifier les logs
pm2 logs midwife-app

# Vérifier le processus
pm2 status
```

### Erreur de permissions

```bash
# Donner les bonnes permissions
chmod -R 755 /chemin/vers/votre-app
chmod -R 755 /chemin/vers/votre-app/server/uploads
```

### Base de données corrompue

```bash
# Sauvegarder
cp server/database.sqlite server/database.sqlite.backup

# Supprimer et relancer (recrée la DB)
rm server/database.sqlite
pm2 restart midwife-app
```

## 📞 Support

Pour toute question sur la configuration Infomaniak :
- Documentation : https://www.infomaniak.com/fr/support
- Support : Via votre espace client Infomaniak

# 📜 Scripts Windows

Ce dossier contient tous les scripts batch (.bat) pour faciliter le développement et le déploiement sur Windows.

## 🚀 Scripts disponibles

### Installation et configuration

- **`install.bat`** - Installe toutes les dépendances npm et configure le projet
  ```batch
  scripts\install.bat
  ```

### Développement

- **`dev.bat`** - Démarre le serveur de développement (frontend + backend)
  ```batch
  scripts\dev.bat
  ```
  Ouvre deux fenêtres :
  - Frontend Vite : http://localhost:5173
  - Backend Express : http://localhost:3001

- **`build.bat`** - Build le frontend pour la production
  ```batch
  scripts\build.bat
  ```

### Déploiement

- **`prepare-deploy.bat`** (à la racine) - Prépare le dossier de déploiement complet
  ```batch
  prepare-deploy.bat
  ```

### Base de données

- **`db-backup.bat`** - Sauvegarde la base de données SQLite
  ```batch
  scripts\db-backup.bat
  ```

- **`db-reset.bat`** - Réinitialise la base de données (⚠️ supprime toutes les données)
  ```batch
  scripts\db-reset.bat
  ```

### Utilitaires

- **`clean.bat`** - Nettoie les fichiers générés (dist, deploy, database, uploads)
  ```batch
  scripts\clean.bat
  ```

- **`generate-secret.bat`** - Génère un JWT_SECRET sécurisé
  ```batch
  scripts\generate-secret.bat
  ```

## 📝 Utilisation typique

### Premier démarrage

```batch
REM 1. Installation
scripts\install.bat

REM 2. Démarrage en développement
scripts\dev.bat
```

### Avant de déployer

```batch
REM 1. Nettoyer le projet
scripts\clean.bat

REM 2. Préparer le déploiement
prepare-deploy.bat

REM 3. Uploader le contenu de deploy\ via FTP
```

### Maintenance

```batch
REM Sauvegarder la base de données
scripts\db-backup.bat

REM Réinitialiser la base de données
scripts\db-reset.bat
```

## 🐧 Équivalents Linux/Mac

Pour Linux et Mac, utilisez le **Makefile** à la racine du projet :

```bash
# Voir toutes les commandes disponibles
make help

# Exemples
make install
make dev
make prepare-deploy
make db-backup
```

## ⚙️ Configuration

Les scripts utilisent les commandes npm définies dans `package.json` :

- `npm run dev` - Démarre Vite
- `npm run server` - Démarre Express
- `npm run build` - Build de production
- `npm start` - Démarre en production

## 🔧 Personnalisation

Vous pouvez modifier les scripts selon vos besoins. Ils sont tous commentés et faciles à comprendre.

## 📚 Documentation complète

Voir `DEPLOIEMENT.md` pour le guide complet de déploiement.

#!/bin/bash

echo "🚀 Préparation du déploiement..."

# Build du frontend
echo "📦 Build du frontend..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Erreur lors du build"
  exit 1
fi

# Créer un dossier de déploiement
echo "📁 Création du dossier deploy/..."
rm -rf deploy
mkdir -p deploy

# Copier les fichiers nécessaires
echo "📋 Copie des fichiers..."
cp -r dist deploy/
cp -r server deploy/
cp package.json deploy/
cp package-lock.json deploy/
cp ecosystem.config.cjs deploy/
#cp .npmrc deploy/
cp .env.production deploy/.env

# Créer le dossier uploads vide
mkdir -p deploy/server/uploads

# Créer un README pour le déploiement
cat > deploy/README.txt << 'EOF'
📦 FICHIERS DE DÉPLOIEMENT

Contenu de ce dossier :
- dist/          : Frontend compilé (React)
- server/        : Backend Node.js + Express
- package.json   : Dépendances du projet
- .env           : Configuration (À MODIFIER !)

ÉTAPES :
1. Uploader TOUT ce dossier sur votre serveur Infomaniak via FTP
2. Se connecter en SSH au serveur
3. Aller dans le dossier : cd /chemin/vers/votre-app
4. Installer les dépendances : npm install --production
5. IMPORTANT : Éditer le fichier .env et changer JWT_SECRET
6. Démarrer : pm2 start ecosystem.config.cjs
   OU : npm start

Voir DEPLOIEMENT.md pour plus de détails.
EOF

echo ""
echo "✅ Préparation terminée !"
echo ""
echo "📂 Dossier deploy/ créé avec tous les fichiers nécessaires"
echo ""
echo "🔑 IMPORTANT : Avant d'uploader, générez un JWT_SECRET sécurisé :"
echo "   node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
echo ""
echo "📤 Prochaines étapes :"
echo "   1. Uploader le contenu de deploy/ via FTP sur Infomaniak"
echo "   2. Se connecter en SSH"
echo "   3. Exécuter : npm install --production"
echo "   4. Modifier le fichier .env avec votre JWT_SECRET"
echo "   5. Démarrer : pm2 start ecosystem.config.cjs"
echo ""

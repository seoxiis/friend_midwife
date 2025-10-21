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

@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Preparation du deploiement
echo ========================================
echo.

REM Build du frontend
echo [1/5] Build du frontend...
call npm run build
if errorlevel 1 (
    echo.
    echo [ERREUR] Le build a echoue
    pause
    exit /b 1
)

REM Suppression et creation du dossier deploy
echo.
echo [2/5] Creation du dossier deploy...
if exist deploy rmdir /s /q deploy
mkdir deploy

REM Copie des fichiers
echo.
echo [3/5] Copie des fichiers necessaires...
xcopy /E /I /Y dist deploy\dist
xcopy /E /I /Y server deploy\server
copy /Y package.json deploy\
copy /Y package-lock.json deploy\
copy /Y ecosystem.config.cjs deploy\
copy /Y .env.production deploy\.env

REM Creation du dossier uploads vide
echo.
echo [4/5] Creation du dossier uploads...
mkdir deploy\server\uploads 2>nul

REM Creation du README
echo.
echo [5/5] Creation du fichier README...
(
echo ========================================
echo   FICHIERS DE DEPLOIEMENT
echo ========================================
echo.
echo Contenu de ce dossier :
echo - dist\          : Frontend compile ^(React^)
echo - server\        : Backend Node.js + Express
echo - package.json   : Dependances du projet
echo - .env           : Configuration ^(A MODIFIER !^)
echo.
echo ETAPES :
echo 1. Uploader TOUT ce dossier sur votre serveur Infomaniak via FTP
echo 2. Se connecter en SSH au serveur
echo 3. Aller dans le dossier : cd /chemin/vers/votre-app
echo 4. Installer les dependances : npm install --production
echo 5. IMPORTANT : Editer le fichier .env et changer JWT_SECRET
echo 6. Demarrer : pm2 start ecosystem.config.cjs
echo    OU : npm start
echo.
echo Voir DEPLOIEMENT.md pour plus de details.
) > deploy\README.txt

echo.
echo ========================================
echo   Preparation terminee !
echo ========================================
echo.
echo [OK] Dossier deploy\ cree avec tous les fichiers necessaires
echo.
echo [!] IMPORTANT : Avant d'uploader, generez un JWT_SECRET securise :
echo     node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
echo.
echo Prochaines etapes :
echo   1. Uploader le contenu de deploy\ via FTP sur Infomaniak
echo   2. Se connecter en SSH
echo   3. Executer : npm install --production
echo   4. Modifier le fichier .env avec votre JWT_SECRET
echo   5. Demarrer : pm2 start ecosystem.config.cjs
echo.
pause

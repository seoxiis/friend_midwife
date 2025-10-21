@echo off
echo.
echo ========================================
echo   Generation d'un JWT_SECRET
echo ========================================
echo.

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

echo.
echo Copiez cette valeur dans votre fichier .env
echo.
pause

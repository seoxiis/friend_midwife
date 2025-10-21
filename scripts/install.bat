@echo off
echo.
echo ========================================
echo   Installation des dependances
echo ========================================
echo.

echo [1/2] Installation des packages npm...
call npm install

if errorlevel 1 (
    echo.
    echo [ERREUR] L'installation a echoue
    pause
    exit /b 1
)

echo.
echo [2/2] Creation des dossiers necessaires...
if not exist server\uploads mkdir server\uploads

echo.
echo [OK] Installation terminee !
echo.
echo Prochaines etapes :
echo   1. Executer scripts\dev.bat pour demarrer le developpement
echo   2. Acceder a http://localhost:5173
echo   3. Admin: http://localhost:5173/admin
echo.
pause

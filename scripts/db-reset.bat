@echo off
echo.
echo ========================================
echo   Reinitialisation de la base de donnees
echo ========================================
echo.
echo [ATTENTION] Cette action va supprimer toutes les donnees !
echo.

set /p confirm="Etes-vous sur ? (O/N) : "

if /i "%confirm%"=="O" (
    if exist server\database.sqlite (
        del /q server\database.sqlite
        echo.
        echo [OK] Base de donnees supprimee
        echo Elle sera recree au prochain demarrage du serveur
    ) else (
        echo.
        echo [INFO] Aucune base de donnees a supprimer
    )
) else (
    echo.
    echo [INFO] Operation annulee
)

echo.
pause

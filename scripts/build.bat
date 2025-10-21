@echo off
echo.
echo ========================================
echo   Build de production
echo ========================================
echo.

echo [1/1] Build du frontend avec Vite...
call npm run build

if errorlevel 1 (
    echo.
    echo [ERREUR] Le build a echoue
    pause
    exit /b 1
) else (
    echo.
    echo [OK] Build termine ! Fichiers dans dist\
    echo.
    pause
)

@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Sauvegarde de la base de donnees
echo ========================================
echo.

if not exist server\database.sqlite (
    echo [ERREUR] Aucune base de donnees a sauvegarder
    pause
    exit /b 1
)

REM Generer un nom de fichier avec la date et l'heure
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set timestamp=%datetime:~0,8%-%datetime:~8,6%

set backup_file=server\database.sqlite.backup-%timestamp%

echo Sauvegarde vers : %backup_file%
copy server\database.sqlite "%backup_file%"

if errorlevel 1 (
    echo.
    echo [ERREUR] La sauvegarde a echoue
    pause
    exit /b 1
) else (
    echo.
    echo [OK] Sauvegarde creee avec succes !
    echo.
    pause
)

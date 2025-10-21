@echo off
echo.
echo ========================================
echo   Nettoyage du projet
echo ========================================
echo.

echo [1/4] Suppression de dist\...
if exist dist rmdir /s /q dist

echo [2/4] Suppression de deploy\...
if exist deploy rmdir /s /q deploy

echo [3/4] Suppression de la base de donnees...
if exist server\database.sqlite del /q server\database.sqlite

echo [4/4] Suppression des uploads...
if exist server\uploads rmdir /s /q server\uploads
mkdir server\uploads

echo.
echo [OK] Nettoyage termine !
echo.
pause

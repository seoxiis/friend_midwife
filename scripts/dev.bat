@echo off
echo.
echo ========================================
echo   Demarrage en mode developpement
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001
echo Admin:    http://localhost:5173/admin
echo.
echo Appuyez sur Ctrl+C pour arreter
echo.

REM Demarrer les deux serveurs en parallele
start "Frontend Vite" cmd /k npm run dev
start "Backend Express" cmd /k npm run server

echo.
echo [OK] Serveurs demarres dans des fenetres separees
echo.
pause

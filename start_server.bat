@echo off
title Serveur GTA 6 Local
cd /d "%~dp0"
echo ======================================================
echo   Demarrage du site GTA 6 en local...
echo   Le serveur va se lancer sur http://localhost:8080
echo ======================================================
echo.

:: Wait 2 seconds for Node server to initialize before opening browser
start /b cmd /c "timeout /t 2 /nobreak > NUL & start http://localhost:8080"

:: Start Node server
node server.js

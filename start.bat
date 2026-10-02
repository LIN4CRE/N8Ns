@echo off
title n8n Social OmniFlow - 1-Click Setup & Launcher
cd /d "%~dp0"
echo ======================================================================
echo    Launching n8n Social OmniFlow Easy Mode...
echo ======================================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup.ps1"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo An issue occurred during setup. Review the message above.
    pause
)

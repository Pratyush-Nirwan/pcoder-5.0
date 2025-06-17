@echo off
start "" cmd /c "code ."
timeout /t 3 /nobreak >nul
echo Starting the development server...
npm run dev
pause

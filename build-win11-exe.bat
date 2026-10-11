@echo off
chcp 65001 > nul
echo ==============================================================================
echo       COGITATOR LINGUARUM WH40K - KOMPILATOR STANDALONE WIN 11 x64
echo ==============================================================================
echo.
echo [1/4] Sprawdzanie srodowiska Node.js i NPM...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [BLAD] Node.js nie jest zainstalowany na tym systemie!
    echo Pobierz Node.js LTS ze strony: https://nodejs.org/
    pause
    exit /b 1
)

echo [2/4] Instalacja niezbednych zaleznosci i Electron Packagera...
call npm install
call npm install --save-dev electron electron-builder

echo [3/4] Budowanie aplikacji webowej do katalogu dist/...
call npm run build

echo [4/4] Pakowanie do samodzielnego pliku .EXE dla Windows 11 x64...
call npx electron-builder --win --x64

echo.
echo ==============================================================================
echo       SUKCES! Gotowy plik .EXE znajduje sie w katalogu: dist-electron\
echo ==============================================================================
echo Mozesz uruchomic CogitatorLinguarum-win11-x64.exe bezposrednio na Windows 11!
echo.
pause

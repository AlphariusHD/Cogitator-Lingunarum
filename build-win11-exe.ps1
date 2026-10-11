Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "      COGITATOR LINGUARUM WH40K - KOMPILATOR STANDALONE WIN 11 x64" -ForegroundColor Yellow
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[BŁĄD] Node.js nie został wykryty w systemie Windows 11." -ForegroundColor Red
    Write-Host "Pobierz Node.js LTS ze strony: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "[1/4] Instalowanie zależności i Electron..." -ForegroundColor Green
npm install
npm install --save-dev electron electron-builder

Write-Host "[2/4] Kompilacja interfejsu (Vite build)..." -ForegroundColor Green
npm run build

Write-Host "[3/4] Generowanie pliku wykonywalnego .EXE dla Windows 11 (x64)..." -ForegroundColor Green
npx electron-builder --win --x64

Write-Host ""
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "  SUKCES! Gotowy plik wykonywalny (.exe) znajduje się w folderze dist-electron\" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Cyan

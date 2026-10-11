@echo off
chcp 65001 > nul
title Cogitator Linguarum WH40K - Standalone Desktop Launcher
cls
echo ==============================================================================
echo        COGITATOR LINGUARUM WH40K - SAMODZIELNY LAUNCHER PULPITU
echo ==============================================================================
echo.
echo  Uruchamianie Cogitatora w osobnym, dedykowanym oknie pulpitu Windows...
echo  (Zupelnie poza przegladarka Google Chrome, bez kart i bez paskow adresu!)
echo.

set "APP_NAME=Cogitator Linguarum WH40K"
set "APP_URL=https://ais-dev-s6jajhrtuvoz4xeuweuqu6-324134209889.europe-west2.run.app"
set "TARGET_DIR=%LOCALAPPDATA%\CogitatorLinguarum"
set "DESKTOP_DIR=%USERPROFILE%\Desktop"

if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

:: Tworzenie skryptu tworzacego skrot na pulpicie do natywnego okna (Edge App Mode / WebView2 - czesc Windows)
set "VBS_SCRIPT=%TARGET_DIR%\create_shortcut.vbs"
(
echo Set oWS = WScript.CreateObject("WScript.Shell"^)
echo strDesktop = oWS.SpecialFolders("Desktop"^)
echo Set oFSO = CreateObject("Scripting.FileSystemObject"^)
echo.
echo appExe = ""
echo appArgs = ""
echo.
echo ' Uruchomienie za pomoca wbudowanego silnika Windows (Microsoft Edge WebView2) w trybie Standalone Window:
echo If oFSO.FileExists("C:\Program Files (x86^)\Microsoft\Edge\Application\msedge.exe"^) Then
echo     appExe = "C:\Program Files (x86^)\Microsoft\Edge\Application\msedge.exe"
echo     appArgs = "--app=""%APP_URL%"" --window-size=1440,900"
echo ElseIf oFSO.FileExists("C:\Program Files\Microsoft\Edge\Application\msedge.exe"^) Then
echo     appExe = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
echo     appArgs = "--app=""%APP_URL%"" --window-size=1440,900"
echo Else
echo     appExe = "%APP_URL%"
echo     appArgs = ""
echo End If
echo.
echo Set oLink = oWS.CreateShortcut(strDesktop ^& "\Cogitator Linguarum WH40K.lnk"^)
echo oLink.TargetPath = appExe
echo oLink.Arguments = appArgs
echo oLink.Description = "Cogitator Linguarum WH40K - Standalone"
echo oLink.Save
) > "%VBS_SCRIPT%"

cscript //nologo "%VBS_SCRIPT%"
del "%VBS_SCRIPT%"

echo [OK] Utworzono bezposredni skrot na Twoim Pulpicie: Cogitator Linguarum WH40K
echo.
echo Uruchamiam okno standalone...
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="%APP_URL%" --window-size=1440,900
) else if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --app="%APP_URL%" --window-size=1440,900
) else (
    start "" "%APP_URL%"
)
exit

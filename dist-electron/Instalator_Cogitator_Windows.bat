@echo off
chcp 65001 > nul
title Cogitator Linguarum WH40K - Instalator Standalone dla Windows
cls
echo ==============================================================================
echo        COGITATOR LINGUARUM WH40K - INSTALATOR STANDALONE DLA WINDOWS
echo ==============================================================================
echo.
echo  Trwa instalacja ikony programu na Twoim Pulpicie oraz w Menu Start...
echo  Aplikacja dziala jako w pelni samodzielny program w osobnym oknie Windows.
echo.

set "APP_NAME=Cogitator Linguarum WH40K"
set "APP_URL=https://ais-dev-s6jajhrtuvoz4xeuweuqu6-324134209889.europe-west2.run.app"
set "TARGET_DIR=%LOCALAPPDATA%\CogitatorLinguarum"
set "DESKTOP_DIR=%USERPROFILE%\Desktop"
set "START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs"

if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

:: Skrypt VBS tworzacy skroty
set "VBS_SCRIPT=%TARGET_DIR%\install_shortcuts.vbs"
(
echo Set oWS = WScript.CreateObject("WScript.Shell"^)
echo strDesktop = oWS.SpecialFolders("Desktop"^)
echo strPrograms = oWS.SpecialFolders("Programs"^)
echo Set oFSO = CreateObject("Scripting.FileSystemObject"^)
echo.
echo appExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
echo If Not oFSO.FileExists(appExe^) Then appExe = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
echo.
echo ' Skrot na Pulpicie
echo Set oLinkDesktop = oWS.CreateShortcut(strDesktop ^& "\Cogitator Linguarum WH40K.lnk"^)
echo oLinkDesktop.TargetPath = appExe
echo oLinkDesktop.Arguments = "--app=""%APP_URL%"" --window-size=1440,900"
echo oLinkDesktop.Description = "Cogitator Linguarum WH40K - Tlumacz Warhammer 40K"
echo oLinkDesktop.Save
echo.
echo ' Skrot w Menu Start
echo Set oLinkStart = oWS.CreateShortcut(strPrograms ^& "\Cogitator Linguarum WH40K.lnk"^)
echo oLinkStart.TargetPath = appExe
echo oLinkStart.Arguments = "--app=""%APP_URL%"" --window-size=1440,900"
echo oLinkStart.Description = "Cogitator Linguarum WH40K - Tlumacz Warhammer 40K"
echo oLinkStart.Save
) > "%VBS_SCRIPT%"

cscript //nologo "%VBS_SCRIPT%"
del "%VBS_SCRIPT%"

echo [SUKCES] Skroty zostaly pomyslnie utworzone:
echo   - Na Pulpicie: Cogitator Linguarum WH40K.lnk
echo   - W Menu Start: Cogitator Linguarum WH40K.lnk
echo.
echo Uruchamianie okna aplikacji Cogitator...
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="%APP_URL%" --window-size=1440,900
) else if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --app="%APP_URL%" --window-size=1440,900
) else (
    start "" "%APP_URL%"
)
exit

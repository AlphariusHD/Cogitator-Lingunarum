import React, { useState, useEffect } from 'react';
import { 
  X, 
  Monitor, 
  Download, 
  Check, 
  Copy, 
  Cpu, 
  ShieldCheck, 
  Zap,
  HardDrive,
  CheckCircle2,
  Info,
  ArrowRight,
  Package,
  ExternalLink,
  Laptop,
  AlertTriangle,
  RefreshCw,
  FolderArchive,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { playCogitatorClick, playOmnissiahChime } from '../utils/audioEffects';

interface DesktopAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DesktopFileInfo {
  name: string;
  size: number;
  path: string;
  type: 'installer' | 'portable' | 'launcher';
}

export const DesktopAppModal: React.FC<DesktopAppModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'exe_download' | 'windows_launcher' | 'calibre_guide'>('exe_download');
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedFileUrl, setCopiedFileUrl] = useState<string | null>(null);
  const [desktopFiles, setDesktopFiles] = useState<DesktopFileInfo[]>([]);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const handleCopyDirectLink = (filePath: string) => {
    playCogitatorClick();
    const fullUrl = `${window.location.origin}${filePath}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedFileUrl(filePath);
    setTimeout(() => setCopiedFileUrl(null), 3000);
  };

  // Fetch status of compiled Windows .exe executables
  const fetchDesktopStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch('/api/desktop/status');
      if (res.ok) {
        const data = await res.json();
        if (data.files && Array.isArray(data.files)) {
          setDesktopFiles(data.files);
        }
      }
    } catch (e) {
      console.warn('Nie udało się pobrać statusu plików desktop:', e);
    } finally {
      setIsLoadingStatus(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDesktopStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentAppUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';

  // Standalone batch launcher script that opens a pure native window WITHOUT Chrome browser chrome/tabs
  const standaloneBatContent = `@echo off
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
set "APP_URL=${currentAppUrl}"
set "TARGET_DIR=%LOCALAPPDATA%\\CogitatorLinguarum"
set "DESKTOP_DIR=%USERPROFILE%\\Desktop"

if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

:: Tworzenie skryptu tworzacego skrot na pulpicie do natywnego okna (Edge App Mode / WebView2 - czesc Windows)
set "VBS_SCRIPT=%TARGET_DIR%\\create_shortcut.vbs"
(
echo Set oWS = WScript.CreateObject("WScript.Shell"^)
echo strDesktop = oWS.SpecialFolders("Desktop"^)
echo Set oFSO = CreateObject("Scripting.FileSystemObject"^)
echo.
echo appExe = ""
echo appArgs = ""
echo.
echo ' Uruchomienie za pomoca wbudowanego silnika Windows (Microsoft Edge WebView2) w trybie Standalone Window:
echo If oFSO.FileExists("C:\\Program Files (x86^)\\Microsoft\\Edge\\Application\\msedge.exe"^) Then
echo     appExe = "C:\\Program Files (x86^)\\Microsoft\\Edge\\Application\\msedge.exe"
echo     appArgs = "--app=""%APP_URL%"" --window-size=1440,900"
echo ElseIf oFSO.FileExists("C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"^) Then
echo     appExe = "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
echo     appArgs = "--app=""%APP_URL%"" --window-size=1440,900"
echo Else
echo     appExe = "%APP_URL%"
echo     appArgs = ""
echo End If
echo.
echo Set oLink = oWS.CreateShortcut(strDesktop ^& "\\Cogitator Linguarum WH40K.lnk"^)
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
if exist "C:\\Program Files (x86^)\\Microsoft\\Edge\\Application\\msedge.exe" (
    start "" "C:\\Program Files (x86^)\\Microsoft\\Edge\\Application\\msedge.exe" --app="%APP_URL%" --window-size=1440,900
) else if exist "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe" (
    start "" "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe" --app="%APP_URL%" --window-size=1440,900
) else (
    start "" "%APP_URL%"
)
exit
`;

  const handleDownloadStandaloneBat = () => {
    playOmnissiahChime();
    const blob = new Blob([standaloneBatContent], { type: 'application/x-bat;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Uruchom_Cogitator_Standalone.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyBat = () => {
    playCogitatorClick();
    navigator.clipboard.writeText(standaloneBatContent);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#0b0e14] border border-theme-accent rounded-lg shadow-2xl overflow-hidden text-neutral-200">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-950/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-amber-950/80 border border-theme-accent text-theme-accent shadow-sm">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-gothic font-bold text-neutral-100 flex items-center gap-2">
                <span>COGITATOR STANDALONE DLA WINDOWS</span>
                <span className="text-[10px] font-cogitator text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/60 uppercase">
                  100% Poza Chrome • Samodzielny Program
                </span>
              </h2>
              <p className="text-xs text-neutral-400 font-reader">
                Uruchamiaj jako niezależną aplikację pulpitową w systemie Windows, bez otwierania przeglądarki Google Chrome.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={currentAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 hover:border-amber-500 text-neutral-300 hover:text-white text-xs font-cogitator transition cursor-pointer"
              title="Otwórz aplikację w nowej karcie (bez ograniczeń ramki podglądu AI Studio)"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Otwórz poza ramką</span>
            </a>
            <button
              onClick={() => {
                playCogitatorClick();
                onClose();
              }}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
              title="Zamknij"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab selection */}
        <div className="px-5 py-2.5 bg-neutral-900/80 border-b border-neutral-800 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              playCogitatorClick();
              setActiveTab('exe_download');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-cogitator transition cursor-pointer ${
              activeTab === 'exe_download'
                ? 'bg-amber-950 border border-theme-accent text-amber-300 font-bold shadow-sm'
                : 'bg-neutral-950/60 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>1. INSTALATOR STANDALONE (WINDOWS)</span>
          </button>

          <button
            onClick={() => {
              playCogitatorClick();
              setActiveTab('windows_launcher');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-cogitator transition cursor-pointer ${
              activeTab === 'windows_launcher'
                ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold'
                : 'bg-neutral-950/60 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>2. NATYWNY LAUNCHER WINDOWS (.BAT)</span>
          </button>

          <button
            onClick={() => {
              playCogitatorClick();
              setActiveTab('calibre_guide');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-cogitator transition cursor-pointer ${
              activeTab === 'calibre_guide'
                ? 'bg-neutral-800 border border-neutral-600 text-white font-bold'
                : 'bg-neutral-950/60 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
            <span>3. JAK TŁUMACZYĆ KSIĄŻKI Z CALIBRE</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-reader text-xs sm:text-sm text-neutral-300">
          
          {/* TAB 1: STANDALONE .EXE DOWNLOAD */}
          {activeTab === 'exe_download' && (
            <div className="space-y-4">
              
              <div className="p-4 rounded bg-gradient-to-br from-amber-950/40 via-neutral-950 to-neutral-900 border border-theme-accent/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-gothic font-bold text-sm sm:text-base text-amber-300 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-amber-400" />
                    Samodzielna aplikacja pulpitowa dla Windows 11 / 10
                  </span>
                  <button
                    onClick={fetchDesktopStatus}
                    className="flex items-center gap-1 text-[11px] font-cogitator text-neutral-400 hover:text-amber-300 px-2 py-0.5 rounded border border-neutral-800 hover:border-amber-700 bg-neutral-950 cursor-pointer transition"
                    title="Odśwież status kompilatora"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingStatus ? 'animate-spin text-amber-400' : ''}`} />
                    <span>Odśwież</span>
                  </button>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  To jest <strong>w pełni samodzielny program (Standalone)</strong>, który uruchamia się 
                  we <strong>własnym, dedykowanym oknie Windows</strong>. 
                  Nie korzysta z przeglądarki Chrome, nie ma kart ani pasków adresu, ma własną ikonę w systemowym pasku zadań.
                </p>

                {/* Direct Download Sandbox Warning Notice */}
                <div className="p-3 rounded bg-amber-950/40 border border-amber-600/50 flex items-start gap-2.5 text-xs text-amber-200/90 leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 block mb-0.5">
                      Przeglądarka blokuje pobieranie w ramce podglądu (Iframe Sandbox)?
                    </strong>
                    Podgląd AI Studio działa w zabezpieczonej ramce, w której Chrome często blokuje bezpośrednie pobieranie plików. 
                    Jeśli kliknięcie „Pobierz” nie pobiera pliku:
                    <span className="block mt-1 text-neutral-300">
                      👉 Kliknij <strong>„Kopiuj bezpośredni link”</strong> i wklej go w nowej karcie przeglądarki, albo kliknij <strong>„Otwórz poza ramką”</strong> w prawym górnym rogu okna!
                    </span>
                  </div>
                </div>

                {/* Available Files or Building Status */}
                <div className="space-y-3 pt-1">
                  {desktopFiles.length > 0 ? (
                    desktopFiles.map((file, idx) => {
                      const fullDownloadUrl = typeof window !== 'undefined' ? `${window.location.origin}${file.path}` : file.path;
                      const isCopied = copiedFileUrl === file.path;

                      return (
                        <div 
                          key={idx}
                          className="p-3.5 rounded bg-neutral-900/90 border border-amber-600/50 space-y-2.5"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded bg-amber-950 border border-amber-700/60 text-amber-400">
                                {file.name.endsWith('.exe') ? (
                                  <Monitor className="w-5 h-5" />
                                ) : file.name.endsWith('.bat') ? (
                                  <Zap className="w-5 h-5 text-cyan-400" />
                                ) : (
                                  <FolderArchive className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <div className="font-gothic font-bold text-neutral-100 text-xs sm:text-sm flex items-center gap-2">
                                  <span>{file.name}</span>
                                  <span className="text-[10px] font-cogitator text-emerald-400 bg-emerald-950/70 px-1.5 py-0.2 rounded border border-emerald-500/40">
                                    {formatFileSize(file.size)}
                                  </span>
                                </div>
                                <div className="text-[11px] text-neutral-400 font-reader">
                                  {file.name.endsWith('.zip') 
                                    ? 'Kompletna paczka Standalone ZIP ze wszystkimi bibliotekami — rozpakuj i kliknij Uruchom_Cogitator.bat' 
                                    : file.name.endsWith('.exe')
                                    ? 'Samodzielny plik wykonywalny Standalone (.exe) dla Windows'
                                    : 'Lekki skrypt startowy Windows (.bat) — natychmiastowe utworzenie skrótu na Pulpicie'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                              <a
                                href={file.path}
                                download={file.name}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => playOmnissiahChime()}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-neutral-950 font-gothic font-bold text-xs tracking-wide transition cursor-pointer shadow-md text-center"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Pobierz ({formatFileSize(file.size)})</span>
                              </a>

                              <button
                                onClick={() => handleCopyDirectLink(file.path)}
                                className={`flex items-center gap-1.5 px-2.5 py-2 rounded border text-xs font-cogitator transition cursor-pointer ${
                                  isCopied
                                    ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                                    : 'bg-neutral-950 border-amber-800/80 hover:border-amber-500 text-neutral-300 hover:text-amber-300'
                                }`}
                                title="Kopiuj bezpośredni URL do wklejenia w pasku adresu nowej karty"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{isCopied ? 'Skopiowano!' : 'Kopiuj link'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Direct Link Box with 1-click copy */}
                          <div className="flex items-center gap-2 pt-1 border-t border-neutral-800/80 text-[11px]">
                            <span className="text-neutral-500 shrink-0 font-cogitator text-[10px]">Bezpośredni URL:</span>
                            <input
                              type="text"
                              readOnly
                              value={fullDownloadUrl}
                              className="flex-1 bg-black/60 border border-neutral-800 rounded px-2 py-1 text-[11px] font-mono text-neutral-400 select-all focus:outline-none focus:border-amber-700"
                              onClick={(e) => (e.target as HTMLInputElement).select()}
                            />
                            <button
                              onClick={() => handleCopyDirectLink(file.path)}
                              className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white cursor-pointer"
                              title="Kopiuj link URL"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 rounded bg-neutral-950/80 border border-neutral-800 space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 font-gothic font-bold text-xs">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        <span>Kompilacja i sprawdzanie plików Windows...</span>
                      </div>
                      <p className="text-xs text-neutral-400">
                        Kliknij <strong>Odśwież</strong>, aby sprawdzić dostępne pliki, lub skorzystaj z poniższego natywnego launchera Windows, który działa natychmiast bez czekania.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* What makes it standalone outside Chrome */}
              <div className="p-3.5 rounded bg-neutral-950/90 border border-neutral-800 space-y-2.5">
                <span className="font-gothic font-bold text-xs text-neutral-200 block">
                  Dlaczego to działa w 100% poza Chrome:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-400">
                  <div className="p-2.5 rounded bg-neutral-900/60 border border-neutral-800/80 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-200 block">Własny proces w systemie Windows</strong>
                      <span>Aplikacja posiada własny identyfikator procesu, pamięć podręczną i nie jest kartą przeglądarki.</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-neutral-900/60 border border-neutral-800/80 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-200 block">Czysty interfejs bez pasków</strong>
                      <span>Brak paska adresu, paska wyszukiwania, zakładek czy wyskakujących powiadomień Chrome.</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-neutral-900/60 border border-neutral-800/80 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-200 block">Ikonka w Menu Start i na Pulpicie</strong>
                      <span>Dedykowana ikona Adeptus Mechanicus w systemowym pasku zadań (Taskbar).</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-neutral-900/60 border border-neutral-800/80 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-200 block">Lokalny stan i leksykon</strong>
                      <span>Wszystkie Twoje glosariusze, reguły odmiany i książki są przechowywane na Twoim dysku.</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: STANDALONE BATCH LAUNCHER WITHOUT CHROME */}
          {activeTab === 'windows_launcher' && (
            <div className="space-y-4">
              
              <div className="p-3.5 rounded bg-neutral-950/90 border border-cyan-800/60 space-y-2">
                <div className="flex items-center justify-between text-neutral-200">
                  <span className="font-gothic font-bold text-sm text-cyan-300 flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    Natywny Launcher Windows (.BAT) — 5 KB, Działa od razu!
                  </span>
                  <span className="font-cogitator text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    ZERO POBIERANIA • BEZ CHROME
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Jeśli nie chcesz pobierać dużego pliku instalatora, ten skrypt wykorzystuje 
                  <strong> wbudowany bezpośrednio w system Windows 10/11 silnik Microsoft WebView2</strong>. 
                  Tworzy skrót na Twoim Pulpicie, który otwiera aplikację jako <strong>niezależne okno pulpitowe</strong> 
                  — bez uruchamiania przeglądarki Chrome, bez kart i bez dodatkowych programów.
                </p>
              </div>

              <div className="p-4 rounded bg-neutral-900/90 border border-neutral-800 space-y-3">
                {/* Step 1: Download or copy */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-gothic font-bold text-neutral-200 text-xs sm:text-sm">
                        Krok 1: Pobierz plik launchera (.BAT)
                      </h4>
                      <p className="text-xs text-neutral-400">
                        Pobierz mały plik <code>Uruchom_Cogitator_Standalone.bat</code> (ok. 2 KB).
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href="/api/desktop/download/Uruchom_Cogitator_Standalone.bat"
                        download="Uruchom_Cogitator_Standalone.bat"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playOmnissiahChime()}
                        className="flex items-center justify-center gap-2 px-3.5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-neutral-950 font-gothic font-bold text-xs tracking-wide transition cursor-pointer shadow-md shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        <span>POBIERZ .BAT</span>
                      </a>

                      <button
                        onClick={() => handleCopyDirectLink('/api/desktop/download/Uruchom_Cogitator_Standalone.bat')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded border text-xs font-cogitator transition cursor-pointer ${
                          copiedFileUrl === '/api/desktop/download/Uruchom_Cogitator_Standalone.bat'
                            ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                            : 'bg-neutral-950 border-cyan-800 hover:border-cyan-500 text-cyan-300'
                        }`}
                        title="Kopiuj bezpośredni URL do wklejenia w nowej karcie"
                      >
                        {copiedFileUrl === '/api/desktop/download/Uruchom_Cogitator_Standalone.bat' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedFileUrl === '/api/desktop/download/Uruchom_Cogitator_Standalone.bat' ? 'Skopiowano!' : 'Kopiuj link'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Direct link input */}
                  <div className="flex items-center gap-2 pt-1 border-t border-neutral-800 text-[11px]">
                    <span className="text-neutral-500 shrink-0 font-cogitator text-[10px]">Bezpośredni URL:</span>
                    <input
                      type="text"
                      readOnly
                      value={typeof window !== 'undefined' ? `${window.location.origin}/api/desktop/download/Uruchom_Cogitator_Standalone.bat` : ''}
                      className="flex-1 bg-black/60 border border-neutral-800 rounded px-2 py-1 text-[11px] font-mono text-neutral-400 select-all focus:outline-none"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                      onClick={() => handleCopyDirectLink('/api/desktop/download/Uruchom_Cogitator_Standalone.bat')}
                      className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                      title="Kopiuj link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Step 2 instructions */}
                <div className="p-3 rounded bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-2">
                  <div className="font-bold text-neutral-200">Krok 2: Uruchomienie na Twoim komputerze</div>
                  <ol className="list-decimal list-inside space-y-1 text-neutral-400">
                    <li>Otwórz folder <strong>Pobrane (Downloads)</strong> w Eksploratorze Windows.</li>
                    <li>Kliknij dwukrotnie pobrany plik <code>Uruchom_Cogitator_Standalone.bat</code>.</li>
                    <li>Skrypt utworzy skrót <strong>Cogitator Linguarum WH40K</strong> na Twoim <strong>Pulpicie</strong>.</li>
                    <li>Aplikacja natychmiast otworzy się w swoim własnym oknie pulpitowym poza przeglądarką Chrome!</li>
                  </ol>
                </div>

                {/* Zero download notepad fallback */}
                <div className="p-3.5 rounded bg-cyan-950/20 border border-cyan-800/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-xs text-cyan-300 block">
                        Opcja bez pobierania pliku (Notatnik Windows):
                      </strong>
                      <span className="text-[11px] text-neutral-400">
                        Jeśli Twoja przeglądarka blokuje pobieranie plików, możesz po prostu wkleić poniższy kod do Notatnika:
                      </span>
                    </div>

                    <button
                      onClick={handleCopyBat}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-700 hover:bg-cyan-600 text-neutral-950 font-gothic font-bold text-xs cursor-pointer transition shrink-0"
                    >
                      {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedScript ? 'Skopiowano cały kod!' : 'Kopiuj kod do Notatnika'}</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-neutral-400 font-reader space-y-1 bg-black/40 p-2.5 rounded border border-neutral-800/80">
                    <p>1. Kliknij <strong>„Kopiuj kod do Notatnika”</strong> u góry.</p>
                    <p>2. Otwórz program <strong>Notatnik (Notepad)</strong> w Windows i wklej (Ctrl+V).</p>
                    <p>3. W menu Notatnika wybierz <strong>Plik &rarr; Zapisz jako...</strong>, jako typ wybierz <em>Wszystkie pliki (*.*)</em> i wpisz nazwę <code>Cogitator.bat</code> na Pulpicie.</p>
                    <p>4. Uruchom dwukrotnie utworzony plik <code>Cogitator.bat</code> — gotowe!</p>
                  </div>

                  {/* Script preview */}
                  <pre className="p-2.5 rounded bg-black/90 border border-neutral-800 text-[11px] font-mono text-neutral-400 overflow-x-auto max-h-28">
                    {standaloneBatContent}
                  </pre>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CALIBRE INTEGRATION GUIDE */}
          {activeTab === 'calibre_guide' && (
            <div className="space-y-4">
              
              <div className="p-3.5 rounded bg-neutral-950/90 border border-neutral-800 space-y-2">
                <span className="font-gothic font-bold text-sm text-amber-300 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-theme-accent" />
                  Jak współpracować z Calibre przy tłumaczeniu książek Warhammer 40K
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Program <strong>Calibre</strong> to najlepsze narzędzie do zarządzania biblioteką e-booków 
                  (formaty EPUB, MOBI, AZW3, FB2, PDF). Samodzielny Cogitator współpracuje z Calibre w procesie tłumaczenia całych tomów:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded bg-neutral-900/70 border border-neutral-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-950 border border-theme-accent text-amber-300 font-gothic font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-neutral-200 block text-xs">Przygotowanie pliku w Calibre</strong>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      W programie Calibre wybierz swoją anglojęzyczną książkę Black Library (np. <em>Horus Rising</em>). 
                      Możesz kliknąć <strong>Konwertuj książki</strong> i wybrać format wyjściowy <strong>TXT</strong> lub <strong>EPUB</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded bg-neutral-900/70 border border-neutral-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-950 border border-theme-accent text-amber-300 font-gothic font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-neutral-200 block text-xs">Załadowanie i podział na rozdziały w Cogitatorze</strong>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      W Cogitatorze przejdź do zakładki <strong>"Import & Podział Tomów"</strong> i przeciągnij wyeksportowany plik. 
                      Inteligentny moduł segmentacji podzieli tom na <em>Prolog, Rozdziały I-XXIV i Epilog</em>.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded bg-neutral-900/70 border border-neutral-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-950 border border-theme-accent text-amber-300 font-gothic font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-neutral-200 block text-xs">Tłumaczenie z kanonicznym profilem Black Library</strong>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Wybierz profil stylu (np. <em>Oficjalny kanon Black Library PL</em> lub <em>Wysoki Gotyk & Patos</em>). 
                      Silnik automatycznie odmieni stopnie wojskowe, nazwy zakonów (Astartes) i uzbrojenie zgodnie z polską gramatyką.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded bg-neutral-900/70 border border-neutral-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-950 border border-theme-accent text-amber-300 font-gothic font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <strong className="text-neutral-200 block text-xs">Eksport gotowej książki do Calibre i czytnika</strong>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Kliknij przycisk <strong>"Eksport (.PDF / .EPUB)"</strong> w prawym górnym rogu. 
                      Pobierz przetłumaczony plik <code>.EPUB</code> lub <code>.PDF</code>, przeciągnij go z powrotem do okna programu Calibre, 
                      a Calibre wyśle go jednym kliknięciem na Twój czytnik (Kindle, PocketBook, Kobo).
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="text-[11px] font-cogitator text-neutral-500">
            Cogitator Linguarum v1.0.0 • Standalone Edition
          </div>
          <button
            onClick={() => {
              playCogitatorClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-cogitator transition cursor-pointer"
          >
            Zamknij
          </button>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { 
  BookOpen, 
  Scroll, 
  Settings2,
  Download,
  Volume2,
  VolumeX,
  Palette
} from 'lucide-react';
import { TranslationProfile, FactionTheme, UserRole } from '../types/wh40k';
import { playCogitatorClick } from '../utils/audioEffects';
import { Sparkles, Monitor, Users, Image as ImageIcon } from 'lucide-react';

interface HeaderProps {
  currentProfile: TranslationProfile;
  onProfileChange: (profile: TranslationProfile) => void;
  currentTheme: FactionTheme;
  onThemeChange: (theme: FactionTheme) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenGlossary: () => void;
  onOpenBookSelector: () => void;
  onOpenExport: () => void;
  onOpenCorpusNER: () => void;
  onOpenDesktopApp: () => void;
  onOpenThemeModal: () => void;
  activeBookTitle: string;
  totalTermsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentProfile,
  onProfileChange,
  currentTheme,
  onThemeChange,
  currentRole,
  onRoleChange,
  soundEnabled,
  onToggleSound,
  onOpenGlossary,
  onOpenBookSelector,
  onOpenExport,
  onOpenCorpusNER,
  onOpenDesktopApp,
  onOpenThemeModal,
  activeBookTitle,
  totalTermsCount,
}) => {

  const getFactionBadge = () => {
    switch (currentTheme) {
      case 'ALPHA_LEGION':
        return {
          icon: '🐉',
          name: 'ALPHA LEGION',
          sub: 'HYDRA DOMINATUS',
          border: 'border-cyan-500/50',
          bg: 'from-cyan-950/80 to-slate-950',
          text: 'text-cyan-400',
          ping: 'bg-cyan-400',
          pillBg: 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300',
          binary: '01001000 01011001 01000100 01010010 01000001',
        };
      case 'BLACK_TEMPLARS':
        return {
          icon: '⚔️',
          name: 'BLACK TEMPLARS',
          sub: 'NO PITY! NO REMORSE!',
          border: 'border-neutral-500/60',
          bg: 'from-neutral-900 to-black',
          text: 'text-zinc-100',
          ping: 'bg-rose-600',
          pillBg: 'bg-neutral-900 border-zinc-400/50 text-white',
          binary: '01010100 01000101 01001101 01010000 01001100',
        };
      case 'MECHANICUS':
        return {
          icon: '⚙️',
          name: 'ADEPTUS MECHANICUS',
          sub: 'DEUS EST MACHINA',
          border: 'border-red-600/60',
          bg: 'from-red-950/90 to-black',
          text: 'text-red-400',
          ping: 'bg-red-500',
          pillBg: 'bg-red-950/90 border-red-600/70 text-red-300',
          binary: '01001111 01001101 01001110 01001001 01010011',
        };
      default:
        return {
          icon: '𝕴',
          name: 'ADEPTUS TERRA',
          sub: 'IMPERIALIS GOTHIC',
          border: 'border-amber-600/50',
          bg: 'from-amber-950/80 to-black',
          text: 'text-amber-400',
          ping: 'bg-amber-500',
          pillBg: 'bg-amber-950/80 border-amber-600/60 text-amber-300',
          binary: '01001001 01001101 01010000 01000101 01010010',
        };
    }
  };

  const badge = getFactionBadge();

  return (
    <header className="border-b border-theme-accent bg-[#0a0c10]/95 backdrop-blur sticky top-0 z-40 text-neutral-200 transition-colors duration-200">
      
      {/* Upper Cogitator Data Ticker (Faction specific) */}
      <div className="bg-black/60 border-b border-neutral-800/60 px-4 py-0.5 flex items-center justify-between text-[10px] font-cogitator text-neutral-500">
        <div className="flex items-center gap-3 truncate">
          <span className="text-theme-accent flex items-center gap-1">
            <span>●</span>
            <span className="font-bold">{badge.sub}</span>
          </span>
          <span className="hidden md:inline text-neutral-600 font-mono tracking-widest">{badge.binary}</span>
          <span className="hidden lg:inline text-neutral-600">• LINGUA-COGITATOR PROTOCOL V.40.89</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-neutral-500">TERMINAL: M41.999</span>
          <button
            onClick={() => {
              onToggleSound();
              playCogitatorClick();
            }}
            className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-white transition cursor-pointer px-1 py-0.5 rounded hover:bg-neutral-800"
            title={soundEnabled ? 'Wycisz dźwięki kogitatora' : 'Włącz mechaniczne dźwięki kogitatora'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">AUDIO: WŁ</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3 h-3 text-neutral-500" />
                <span className="text-neutral-500">AUDIO: WYŁ</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Imperial Inscription */}
        <div className="flex items-center gap-3">
          <div className={`relative flex items-center justify-center w-10 h-10 rounded border ${badge.border} bg-gradient-to-b ${badge.bg} ${badge.text} shadow-md`}>
            <span className="text-xl font-bold font-gothic tracking-widest">{badge.icon}</span>
            <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 ${badge.ping} rounded-full animate-ping opacity-60`} />
            <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 ${badge.ping} rounded-full`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-gothic text-base sm:text-lg font-bold tracking-wider text-theme-accent flex items-center gap-1.5">
                COGITATOR LINGUARUM
              </h1>
              <span className={`text-[10px] uppercase tracking-widest font-cogitator px-1.5 py-0.5 rounded border ${badge.pillBg}`}>
                {badge.name}
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-reader flex items-center gap-2">
              <span className="text-theme-accent font-cogitator text-[11px]">ADEPTUS TRANSLATIO</span>
              <span className="text-neutral-600">•</span>
              <span>Tłumacz Kronik i Powieści Black Library</span>
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">

          {/* Faction / Order Theme Selector (Feature 1) */}
          <div className="flex items-center bg-neutral-900/90 border border-neutral-700/80 rounded p-0.5 shadow-sm">
            <span className="px-2 text-[10px] font-cogitator text-neutral-400 flex items-center gap-1">
              <Palette className="w-3 h-3 text-theme-accent" />
              <span className="hidden sm:inline">Tło:</span>
            </span>
            <select
              value={currentTheme}
              onChange={(e) => {
                playCogitatorClick();
                onThemeChange(e.target.value as FactionTheme);
              }}
              aria-label="Wybierz tło i motyw frakcji"
              className="bg-neutral-950 text-neutral-200 text-xs px-2.5 py-1 rounded border-0 focus:ring-1 focus:ring-theme-accent outline-none cursor-pointer font-cogitator font-semibold"
            >
              <option value="BLACK_TEMPLARS">⚔️ Black Templars (Gotycki Krzyżowiec)</option>
              <option value="MECHANICUS">⚙️ Adeptus Mechanicus (Konsola Cogitatora)</option>
              <option value="ALPHA_LEGION">🐉 Alpha Legion (Hydra Dominatus)</option>
              <option value="IMPERIAL_GOTHIC">𝕴 Adeptus Terra (Imperialny Gotyk)</option>
            </select>
            <button
              onClick={() => {
                playCogitatorClick();
                onOpenThemeModal();
              }}
              className="ml-1 px-2 py-1 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition flex items-center gap-1.5 text-[11px] font-cogitator border border-neutral-700/70 cursor-pointer"
              title="Dostosuj tło, wgraj plik (Gotycki krzyżowiec / Konsola Mechanicum) i ustaw przezroczystość"
            >
              <ImageIcon className="w-3 h-3 text-theme-accent" />
              <span className="hidden lg:inline">Dostosuj tło</span>
            </button>
          </div>

          {/* Active Book Switcher */}
          <button
            onClick={() => {
              playCogitatorClick();
              onOpenBookSelector();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-neutral-800 hover:border-theme-accent bg-neutral-900/90 hover:bg-neutral-800/90 text-neutral-300 text-xs transition group cursor-pointer"
            title="Wybierz lub wgraj inną książkę"
          >
            <BookOpen className="w-3.5 h-3.5 text-theme-accent group-hover:scale-110 transition-transform" />
            <span className="font-gothic text-[11px] uppercase tracking-wide text-neutral-200 truncate max-w-[150px]">
              {activeBookTitle}
            </span>
            <span className="text-[10px] font-cogitator text-neutral-500">Zmień</span>
          </button>

          {/* Translation Profile Selector */}
          <div className="flex items-center bg-neutral-900/90 border border-neutral-800 rounded p-0.5">
            <span className="px-1.5 text-[10px] font-cogitator text-neutral-400 flex items-center gap-1">
              <Settings2 className="w-3 h-3 text-neutral-400" />
              <span className="hidden sm:inline">Styl:</span>
            </span>
            <select
              value={currentProfile}
              onChange={(e) => {
                playCogitatorClick();
                onProfileChange(e.target.value as TranslationProfile);
              }}
              aria-label="Wybierz styl przekładu Warhammer 40K"
              className="bg-neutral-950 text-neutral-200 text-xs px-2 py-1 rounded border-0 focus:ring-1 outline-none cursor-pointer font-reader"
            >
              <option value="OFFICIAL_PL">⚔️ Kanon PL (Black Library)</option>
              <option value="PURIST_EN_NAMES">🛡️ Purystyczny (EN militarne)</option>
              <option value="HIGH_GOTHIC">📜 Ciężki Gotyk & Patos</option>
            </select>
          </div>

          {/* Two-Role Collaboration Switcher */}
          <div className="flex items-center bg-neutral-900/90 border border-neutral-800 rounded p-0.5">
            <span className="px-1.5 text-[10px] font-cogitator text-neutral-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-neutral-400" />
              <span className="hidden sm:inline">Rola:</span>
            </span>
            <div className="flex rounded overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  playCogitatorClick();
                  onRoleChange('SCRIBE');
                }}
                className={`px-2 py-0.5 text-[11px] font-cogitator rounded transition cursor-pointer ${
                  currentRole === 'SCRIBE'
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-600/60'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Rola: Tłumacz / Skryba"
              >
                ✍️ Skryba
              </button>
              <button
                type="button"
                onClick={() => {
                  playCogitatorClick();
                  onRoleChange('INQUISITOR');
                }}
                className={`px-2 py-0.5 text-[11px] font-cogitator rounded transition cursor-pointer ${
                  currentRole === 'INQUISITOR'
                    ? 'bg-rose-950 text-rose-300 font-bold border border-rose-600/60'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Rola: Weryfikator / Inkwizytor (Cenzor)"
              >
                ⚜️ Inkwizytor
              </button>
            </div>
          </div>

          {/* Corpus NER Scanner Button */}
          <button
            onClick={() => {
              playCogitatorClick();
              onOpenCorpusNER();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/70 text-emerald-300 text-xs transition cursor-pointer font-cogitator shadow-sm"
            title="Masowa Analiza Korpusowa i Ekstrakcja Bytów (NER: Bohaterowie, Okręty, Formacje)"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">Skaner Bytów (NER)</span>
          </button>

          {/* Glossary / Lexicon Button */}
          <button
            onClick={() => {
              playCogitatorClick();
              onOpenGlossary();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 hover:border-theme-accent text-neutral-200 text-xs transition cursor-pointer font-gothic tracking-wider shadow-sm"
          >
            <Scroll className="w-3.5 h-3.5 text-theme-accent" />
            <span>Leksykon & Fleksja</span>
            <span className="ml-1 text-[10px] font-cogitator bg-neutral-800 text-theme-accent px-1.5 py-0.2 rounded-full border border-neutral-700">
              {totalTermsCount}
            </span>
          </button>

          {/* Export Book / Chapter Button */}
          <button
            onClick={() => {
              playCogitatorClick();
              onOpenExport();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 border border-theme-accent text-neutral-100 font-gothic font-bold text-xs transition cursor-pointer shadow-md"
            title="Eksportuj do .PDF, .EPUB, .PUB, .TXT lub .MD"
          >
            <Download className="w-3.5 h-3.5 text-theme-accent" />
            <span>Eksport (.PDF / .EPUB)</span>
          </button>

          {/* Standalone Windows Desktop App (.EXE) Button */}
          <button
            onClick={() => {
              playCogitatorClick();
              onOpenDesktopApp();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-950/70 hover:bg-amber-900/80 border border-theme-accent/80 hover:border-theme-accent text-amber-300 font-gothic text-xs font-bold transition cursor-pointer shadow-md"
            title="Aplikacja Standalone Windows (.EXE) — Działa niezależnie poza przeglądarką Chrome"
          >
            <Monitor className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Standalone Windows (.EXE)</span>
            <span className="sm:hidden">.EXE</span>
          </button>
        </div>
      </div>
      
      {/* Decorative Cogitator Runes Strip */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-theme-accent to-transparent opacity-60" />
    </header>
  );
};

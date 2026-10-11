import React, { useState } from 'react';
import { 
  X, 
  Palette, 
  Upload, 
  Trash2, 
  Check, 
  Sparkles, 
  Eye, 
  Shield, 
  Sliders, 
  Flame, 
  Cpu, 
  Image as ImageIcon 
} from 'lucide-react';
import { FactionTheme } from '../types/wh40k';
import { playCogitatorClick } from '../utils/audioEffects';

interface FactionThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: FactionTheme;
  onThemeChange: (theme: FactionTheme) => void;
  customBlackTemplarsBg: string | null;
  customMechanicusBg: string | null;
  onUpdateCustomBg: (theme: 'BLACK_TEMPLARS' | 'MECHANICUS', dataUrl: string | null) => void;
  bgOpacity: number;
  onChangeBgOpacity: (opacity: number) => void;
  frameEnabled: boolean;
  onToggleFrame: (enabled: boolean) => void;
}

export const FactionThemeModal: React.FC<FactionThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
  customBlackTemplarsBg,
  customMechanicusBg,
  onUpdateCustomBg,
  bgOpacity,
  onChangeBgOpacity,
  frameEnabled,
  onToggleFrame,
}) => {
  const [activeTab, setActiveTab] = useState<'SELECT' | 'BLACK_TEMPLARS' | 'MECHANICUS'>('SELECT');
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (theme: 'BLACK_TEMPLARS' | 'MECHANICUS', file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onUpdateCustomBg(theme, result);
        onThemeChange(theme);
        playCogitatorClick();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-[#0c0e12] border border-neutral-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-gothic tracking-wider text-neutral-100 flex items-center gap-2">
                TŁA I SKÓRKI FRAKCJI WARHAMMER 40K
                <span className="text-[10px] font-cogitator text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  BLACK TEMPLARS & MECHANICUM
                </span>
              </h2>
              <p className="text-xs text-neutral-400 font-reader">
                Dostosuj atmosferę pulpitu, ramę gotycką i wgraj własne ilustracje frakcyjne.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playCogitatorClick();
              onClose();
            }}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 bg-neutral-950/60 border-b border-neutral-800 flex items-center gap-2">
          <button
            onClick={() => {
              playCogitatorClick();
              setActiveTab('SELECT');
            }}
            className={`px-3 py-1.5 text-xs font-cogitator rounded-t transition border-b-2 ${
              activeTab === 'SELECT'
                ? 'border-amber-500 text-amber-400 bg-neutral-900 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Wybór Skórki
          </button>
          <button
            onClick={() => {
              playCogitatorClick();
              setActiveTab('BLACK_TEMPLARS');
            }}
            className={`px-3 py-1.5 text-xs font-cogitator rounded-t transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'BLACK_TEMPLARS'
                ? 'border-white text-white bg-neutral-900 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Shield className="w-3 h-3 text-neutral-300" />
            Tło Black Templars {customBlackTemplarsBg && '●'}
          </button>
          <button
            onClick={() => {
              playCogitatorClick();
              setActiveTab('MECHANICUS');
            }}
            className={`px-3 py-1.5 text-xs font-cogitator rounded-t transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'MECHANICUS'
                ? 'border-red-500 text-red-400 bg-neutral-900 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Cpu className="w-3 h-3 text-red-400" />
            Tło Mechanicum {customMechanicusBg && '●'}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {activeTab === 'SELECT' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Black Templars Card */}
                <div
                  onClick={() => {
                    playCogitatorClick();
                    onThemeChange('BLACK_TEMPLARS');
                  }}
                  className={`p-3.5 rounded border transition cursor-pointer relative overflow-hidden group ${
                    currentTheme === 'BLACK_TEMPLARS'
                      ? 'border-white bg-neutral-900 shadow-[0_0_15px_rgba(255,255,255,0.15)] ring-1 ring-white/50'
                      : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">⚔️</span>
                        <h3 className="text-xs font-bold font-gothic tracking-wider text-neutral-100">
                          BLACK TEMPLARS
                        </h3>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 font-reader">
                        Czarny pancerz ceramitowy, pieczęcie czystości, gotycki krzyżowiec i heksagonalna siatka.
                      </p>
                    </div>
                    {currentTheme === 'BLACK_TEMPLARS' && (
                      <span className="px-1.5 py-0.5 bg-white text-black text-[9px] font-bold rounded font-cogitator">
                        AKTYWNY
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] font-cogitator text-neutral-400 border-t border-neutral-800/80 pt-2">
                    <span>{customBlackTemplarsBg ? '🖼️ Własne tło wgrane' : '✨ Gotycka ilustracja proceduralna'}</span>
                    <span className="text-neutral-300 group-hover:translate-x-0.5 transition-transform">Wybierz &rarr;</span>
                  </div>
                </div>

                {/* Mechanicus Card */}
                <div
                  onClick={() => {
                    playCogitatorClick();
                    onThemeChange('MECHANICUS');
                  }}
                  className={`p-3.5 rounded border transition cursor-pointer relative overflow-hidden group ${
                    currentTheme === 'MECHANICUS'
                      ? 'border-red-500 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.2)] ring-1 ring-red-500/50'
                      : 'border-neutral-800 bg-neutral-950/70 hover:border-red-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">⚙️</span>
                        <h3 className="text-xs font-bold font-cogitator tracking-wider text-red-300">
                          ADEPTUS MECHANICUS
                        </h3>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 font-reader">
                        Techno-gotycka konsola, zielono-niebieski terminal CRT, jarzące się fiolki z chłodziwem i runy binarne.
                      </p>
                    </div>
                    {currentTheme === 'MECHANICUS' && (
                      <span className="px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-bold rounded font-cogitator">
                        AKTYWNY
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] font-cogitator text-neutral-400 border-t border-neutral-800/80 pt-2">
                    <span>{customMechanicusBg ? '🖼️ Własne tło wgrane' : '✨ Konsola i terminal proceduralny'}</span>
                    <span className="text-red-400 group-hover:translate-x-0.5 transition-transform">Wybierz &rarr;</span>
                  </div>
                </div>

                {/* Alpha Legion Card */}
                <div
                  onClick={() => {
                    playCogitatorClick();
                    onThemeChange('ALPHA_LEGION');
                  }}
                  className={`p-3.5 rounded border transition cursor-pointer relative overflow-hidden group ${
                    currentTheme === 'ALPHA_LEGION'
                      ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400/50'
                      : 'border-neutral-800 bg-neutral-950/70 hover:border-cyan-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">🐉</span>
                        <h3 className="text-xs font-bold font-cogitator tracking-wider text-cyan-300">
                          ALPHA LEGION
                        </h3>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 font-reader">
                        Hydra Dominatus, neonowy turkus, cienie i szyfry wywiadowcze.
                      </p>
                    </div>
                    {currentTheme === 'ALPHA_LEGION' && (
                      <span className="px-1.5 py-0.5 bg-cyan-500 text-black text-[9px] font-bold rounded font-cogitator">
                        AKTYWNY
                      </span>
                    )}
                  </div>
                </div>

                {/* Adeptus Terra (Imperial Gothic) Card */}
                <div
                  onClick={() => {
                    playCogitatorClick();
                    onThemeChange('IMPERIAL_GOTHIC');
                  }}
                  className={`p-3.5 rounded border transition cursor-pointer relative overflow-hidden group ${
                    currentTheme === 'IMPERIAL_GOTHIC'
                      ? 'border-amber-400 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.2)] ring-1 ring-amber-400/50'
                      : 'border-neutral-800 bg-neutral-950/70 hover:border-amber-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">𝕴</span>
                        <h3 className="text-xs font-bold font-gothic tracking-wider text-amber-300">
                          ADEPTUS TERRA
                        </h3>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 font-reader">
                        Złoto i pergamin, imperialny gotyk, oficjalne archiwa Terry.
                      </p>
                    </div>
                    {currentTheme === 'IMPERIAL_GOTHIC' && (
                      <span className="px-1.5 py-0.5 bg-amber-500 text-black text-[9px] font-bold rounded font-cogitator">
                        AKTYWNY
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Global Display Controls: Opacity & Frame */}
              <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold font-cogitator text-neutral-200">
                      PRZEZROCZYSTOŚĆ TŁA / TAPETY
                    </span>
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    {Math.round(bgOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={bgOpacity}
                  onChange={(e) => onChangeBgOpacity(parseFloat(e.target.value))}
                  aria-label="Regulacja przezroczystości tła"
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded"
                />
                <p className="text-[11px] text-neutral-500 font-reader">
                  Wyższa wartość daje bardziej wyraziste tło, niższa zwiększa czytelność tekstu tłumaczenia.
                </p>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-xs font-cogitator text-neutral-300 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-neutral-400" />
                    Gotycka Rama Ozdobna (Krawędzie Pulpitu)
                  </span>
                  <button
                    onClick={() => onToggleFrame(!frameEnabled)}
                    className={`px-2.5 py-1 text-[11px] font-cogitator rounded border transition ${
                      frameEnabled
                        ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-500'
                    }`}
                  >
                    {frameEnabled ? 'WŁĄCZONA' : 'WYŁĄCZONA'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Black Templars Tab */}
          {activeTab === 'BLACK_TEMPLARS' && (
            <div className="space-y-4">
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded">
                <h4 className="text-xs font-bold font-gothic text-neutral-200 flex items-center gap-2">
                  <span>⚔️</span>
                  TŁO: GOTYCKI KRZYŻOWIEC W PANCERZU WARHAMMERA
                </h4>
                <p className="text-xs text-neutral-400 font-reader mt-1">
                  Wgraj pobrany plik <code className="text-amber-400 bg-neutral-900 px-1 py-0.5 rounded text-[10px]">Gotycki krzyżowiec w pancerzu Warhammera.png</code>, aby wyświetlać pełną majestatyczną grafikę z krzyżowcem, mieczem relikwijnym i gotyckim obramowaniem.
                </p>
              </div>

              {/* Upload Dropzone */}
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileUpload('BLACK_TEMPLARS', file);
                }}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition ${
                  dragOver
                    ? 'border-white bg-neutral-900'
                    : 'border-neutral-700 bg-neutral-950/60 hover:border-neutral-500'
                }`}
              >
                <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                <span className="text-xs font-bold font-cogitator text-neutral-200">
                  Przeciągnij i upuść plik PNG / JPG tutaj
                </span>
                <span className="text-[11px] text-neutral-500 mt-1">
                  lub kliknij, aby wybrać z dysku (np. Gotycki krzyżowiec w pancerzu Warhammera.png)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('BLACK_TEMPLARS', file);
                  }}
                />
              </label>

              {/* Current Status & Preview */}
              {customBlackTemplarsBg ? (
                <div className="p-3 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={customBlackTemplarsBg} 
                      alt="Black Templars Preview" 
                      className="w-16 h-10 object-cover rounded border border-neutral-700" 
                    />
                    <div>
                      <p className="text-xs font-bold font-cogitator text-white">Aktywne tło Black Templars</p>
                      <p className="text-[10px] text-emerald-400 font-mono">Zapisano w pamięci lokalnej Cogitatora</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onThemeChange('BLACK_TEMPLARS');
                        playCogitatorClick();
                      }}
                      className="px-2.5 py-1 bg-white text-black text-xs font-bold font-cogitator rounded hover:bg-neutral-200 transition"
                    >
                      Zastosuj motyw
                    </button>
                    <button
                      onClick={() => {
                        onUpdateCustomBg('BLACK_TEMPLARS', null);
                        playCogitatorClick();
                      }}
                      className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-neutral-800 transition"
                      title="Usuń własne tło i przywróć grafikę wbudowaną"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded bg-neutral-950/70 border border-neutral-800/80 text-[11px] text-neutral-400 font-reader flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Obecnie aktywna jest wbudowana gotycka ilustracja wektorowa ze świecami, heksagonalnym pancerzem i krzyżem maltańskim.</span>
                </div>
              )}
            </div>
          )}

          {/* Mechanicus Tab */}
          {activeTab === 'MECHANICUS' && (
            <div className="space-y-4">
              <div className="p-3 bg-red-950/30 border border-red-900/60 rounded">
                <h4 className="text-xs font-bold font-cogitator text-red-300 flex items-center gap-2">
                  <span>⚙️</span>
                  TŁO: TECHNO-GOTYCKA KONSOLA MECHANICUM
                </h4>
                <p className="text-xs text-neutral-400 font-reader mt-1">
                  Wgraj pobrany plik <code className="text-red-400 bg-black/60 px-1 py-0.5 rounded text-[10px]">Techno-Gotycka Konsola Mechanicum.png</code> z pulpitem Omnissiaha, databankiem, kablami i fiolkami plazmowymi.
                </p>
              </div>

              {/* Upload Dropzone */}
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileUpload('MECHANICUS', file);
                }}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition ${
                  dragOver
                    ? 'border-red-500 bg-red-950/30'
                    : 'border-red-900/60 bg-neutral-950/60 hover:border-red-600'
                }`}
              >
                <Upload className="w-8 h-8 text-red-400 mb-2" />
                <span className="text-xs font-bold font-cogitator text-neutral-200">
                  Przeciągnij i upuść plik PNG / JPG tutaj
                </span>
                <span className="text-[11px] text-neutral-500 mt-1">
                  lub kliknij, aby wybrać z dysku (np. Techno-Gotycka Konsola Mechanicum.png)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('MECHANICUS', file);
                  }}
                />
              </label>

              {/* Current Status & Preview */}
              {customMechanicusBg ? (
                <div className="p-3 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={customMechanicusBg} 
                      alt="Mechanicus Preview" 
                      className="w-16 h-10 object-cover rounded border border-red-900/60" 
                    />
                    <div>
                      <p className="text-xs font-bold font-cogitator text-red-300">Aktywne tło Adeptus Mechanicus</p>
                      <p className="text-[10px] text-emerald-400 font-mono">Zapisano w pamięci lokalnej Cogitatora</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onThemeChange('MECHANICUS');
                        playCogitatorClick();
                      }}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-cogitator rounded transition"
                    >
                      Zastosuj motyw
                    </button>
                    <button
                      onClick={() => {
                        onUpdateCustomBg('MECHANICUS', null);
                        playCogitatorClick();
                      }}
                      className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-neutral-800 transition"
                      title="Usuń własne tło i przywróć konsolę wbudowaną"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded bg-neutral-950/70 border border-neutral-800/80 text-[11px] text-neutral-400 font-reader flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Obecnie aktywna jest wbudowana konsola Omnissiaha z terminalem databanku i fiolkami plazmowymi.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <div className="text-[11px] text-neutral-500 font-cogitator flex items-center gap-2">
            <span>● PROFIL GRAFICZNY: M41.999</span>
          </div>
          <button
            onClick={() => {
              playCogitatorClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-cogitator rounded transition"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};

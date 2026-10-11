import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  BookOpen, 
  AlertTriangle, 
  Sparkles, 
  Loader2, 
  Search, 
  Globe, 
  ExternalLink 
} from 'lucide-react';

interface ExplainTermData {
  term: string;
  polishEquivalent: string;
  category?: string;
  loreSummary: string;
  translationGuidance: string;
}

interface WebSource {
  title: string;
  url: string;
}

interface ExplainTermModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  data: ExplainTermData | null;
  error?: string | null;
}

export const ExplainTermModal: React.FC<ExplainTermModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  data,
  error,
}) => {
  const [isSearchingGoogle, setIsSearchingGoogle] = useState(false);
  const [googleSearchResult, setGoogleSearchResult] = useState<{
    text: string;
    webSources: WebSource[];
    searchQueries: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleGoogleSearchGrounding = async () => {
    if (!data?.term) return;
    setIsSearchingGoogle(true);
    setGoogleSearchResult(null);

    try {
      const res = await fetch('/api/search-lore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Oficjalne polskie tłumaczenie i kanon Warhammer 40000 Black Library Copernicus: ${data.term} (${data.polishEquivalent})`,
        }),
      });

      if (!res.ok) throw new Error('Błąd wyszukiwania Google');
      const json = await res.json();
      setGoogleSearchResult(json);
    } catch (err: any) {
      console.error('Google search grounding failed:', err);
      setGoogleSearchResult({
        text: 'Nie udało się pobrać aktualnych wyników z wyszukiwarki Google.',
        webSources: [],
        searchQueries: [],
      });
    } finally {
      setIsSearchingGoogle(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#12141a] border border-amber-800/80 rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden text-neutral-200">
        
        {/* Header */}
        <div className="p-4 border-b border-amber-900/60 bg-gradient-to-r from-amber-950/60 to-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-amber-900/50 border border-amber-600/40 text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-gothic text-sm font-bold text-amber-100 uppercase tracking-wider">
                ARCHIWUM ADEPTUS TERRA
              </h3>
              <p className="text-[11px] text-neutral-400 font-reader">
                Analiza lore i wytyczne translatorskie
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {isLoading && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-xs font-cogitator text-amber-400 animate-pulse">
                PRZESZUKIWANIE REJESTRÓW ARCHIWALNYCH KOGITATORA...
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 rounded border border-rose-900/60 bg-rose-950/30 text-rose-300 text-xs font-reader flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!isLoading && data && (
            <>
              {/* Term badge */}
              <div className="p-3 rounded bg-neutral-900/80 border border-neutral-800 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-cogitator text-neutral-500 block mb-0.5">
                    Oryginał
                  </span>
                  <span className="text-base font-bold font-gothic text-amber-200">
                    {data.term}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-cogitator text-neutral-500 block mb-0.5">
                    Polski odpowiednik
                  </span>
                  <span className="text-base font-bold font-reader text-white">
                    {data.polishEquivalent}
                  </span>
                </div>
              </div>

              {/* Lore Explanation */}
              <div>
                <h4 className="text-[11px] font-cogitator uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  Kontekst Fabularny (Lore)
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 font-reader leading-relaxed bg-neutral-950/50 p-3 rounded border border-neutral-900">
                  {data.loreSummary}
                </p>
              </div>

              {/* Translation Guidance */}
              <div>
                <h4 className="text-[11px] font-cogitator uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Zasady Przekładu & Uwagi
                </h4>
                <p className="text-xs sm:text-sm text-amber-100 font-reader leading-relaxed bg-amber-950/20 p-3 rounded border border-amber-900/40">
                  {data.translationGuidance}
                </p>
              </div>

              {/* Google Search Grounding Section */}
              <div className="pt-2 border-t border-neutral-800">
                {!googleSearchResult && !isSearchingGoogle && (
                  <button
                    onClick={handleGoogleSearchGrounding}
                    className="w-full py-2 px-3 rounded bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 hover:border-amber-600/60 text-neutral-300 text-xs font-cogitator flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    <span>Zweryfikuj w Google (Oficjalne wydania PL / Copernicus)</span>
                  </button>
                )}

                {isSearchingGoogle && (
                  <div className="py-3 flex items-center justify-center gap-2 text-xs font-cogitator text-sky-400 animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>WYSZUKIWANIE W SIECI GOOGLE SEARCH (GEMINI 3.5 FLASH)...</span>
                  </div>
                )}

                {googleSearchResult && (
                  <div className="p-3 rounded bg-neutral-950/80 border border-sky-900/40 space-y-2 text-xs animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] font-cogitator text-sky-400">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-sky-400" />
                        Zweryfikowano z Google Search:
                      </span>
                    </div>

                    <p className="text-neutral-300 font-reader leading-relaxed">
                      {googleSearchResult.text}
                    </p>

                    {googleSearchResult.webSources && googleSearchResult.webSources.length > 0 && (
                      <div className="pt-1.5 border-t border-neutral-800/80 space-y-1">
                        <span className="text-[10px] font-cogitator uppercase text-neutral-500 block">
                          Źródła:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {googleSearchResult.webSources.slice(0, 3).map((src, i) => (
                            <a
                              key={i}
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-cogitator text-sky-400 hover:text-sky-300 bg-sky-950/40 border border-sky-800/40 px-2 py-0.5 rounded flex items-center gap-1 truncate max-w-[200px]"
                            >
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{src.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 text-amber-200 font-gothic text-xs cursor-pointer"
          >
            Zamknij Archiwum
          </button>
        </div>

      </div>
    </div>
  );
};

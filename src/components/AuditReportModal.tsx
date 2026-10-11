import React, { useState, useMemo } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  Loader2, 
  Wrench,
  Edit3,
  BookmarkPlus,
  RotateCcw,
  Search,
  Check,
  ArrowRight,
  Sliders,
  Replace
} from 'lucide-react';
import { ConsistencyIssue } from '../types/wh40k';
import { playCogitatorClick } from '../utils/audioEffects';
import { auditGrammarMorphing } from '../utils/grammarMorphing';

interface AuditResult {
  isLoreCompliant: boolean;
  overallScore: number;
  summary: string;
  issues: ConsistencyIssue[];
}

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  result: AuditResult | null;
  chapterText?: string;
  onApplyFix?: (searchWord: string, replacementWord: string, replaceAll: boolean, saveToGlossary?: boolean) => void;
  onSaveToGlossary?: (english: string, polish: string, category?: string) => void;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  result,
  chapterText = '',
  onApplyFix,
  onSaveToGlossary,
}) => {
  // State for editable issue fields: idx -> { search: string, replace: string }
  const [editedIssues, setEditedIssues] = useState<Record<number, { search: string; replace: string }>>({});
  
  // State for applied status: idx -> boolean
  const [appliedIssues, setAppliedIssues] = useState<Record<number, boolean>>({});

  // Manual Quick Replace state
  const [manualSearch, setManualSearch] = useState('');
  const [manualReplace, setManualReplace] = useState('');
  const [manualSaveGlossary, setManualSaveGlossary] = useState(false);
  const [manualApplied, setManualApplied] = useState(false);

  // Detect grammatical declension collisions in current chapter
  const grammarAnomalies = useMemo(() => {
    if (!chapterText) return [];
    return auditGrammarMorphing(chapterText);
  }, [chapterText]);

  // Initialize or reset edited fields when result changes
  React.useEffect(() => {
    if (result?.issues) {
      const initialMap: Record<number, { search: string; replace: string }> = {};
      result.issues.forEach((issue, idx) => {
        initialMap[idx] = {
          search: issue.foundInText || issue.term,
          replace: issue.expected || ''
        };
      });
      setEditedIssues(initialMap);
      setAppliedIssues({});
    }
  }, [result]);

  if (!isOpen) return null;

  const getCountInText = (term: string) => {
    if (!term || !chapterText) return 0;
    try {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = chapterText.match(new RegExp(escaped, 'gi'));
      return matches ? matches.length : 0;
    } catch (e) {
      return 0;
    }
  };

  const handleFieldChange = (idx: number, field: 'search' | 'replace', value: string) => {
    setEditedIssues(prev => ({
      ...prev,
      [idx]: {
        ...(prev[idx] || { search: '', replace: '' }),
        [field]: value
      }
    }));
  };

  const handleExecuteFix = (idx: number, replaceAll: boolean, saveGlossary = false) => {
    playCogitatorClick();
    const issueData = editedIssues[idx];
    if (!issueData || !issueData.search || !issueData.replace || !onApplyFix) return;

    onApplyFix(issueData.search, issueData.replace, replaceAll, saveGlossary);

    if (saveGlossary && onSaveToGlossary) {
      const originalIssue = result?.issues[idx];
      onSaveToGlossary(originalIssue?.term || issueData.search, issueData.replace);
    }

    setAppliedIssues(prev => ({ ...prev, [idx]: true }));
  };

  const handleManualExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSearch.trim() || !manualReplace.trim() || !onApplyFix) return;

    playCogitatorClick();
    onApplyFix(manualSearch.trim(), manualReplace.trim(), true, manualSaveGlossary);

    if (manualSaveGlossary && onSaveToGlossary) {
      onSaveToGlossary(manualSearch.trim(), manualReplace.trim());
    }

    setManualApplied(true);
    setTimeout(() => setManualApplied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#111318] border border-amber-800/80 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-neutral-200">
        
        {/* Header */}
        <div className="p-4 border-b border-amber-900/60 bg-gradient-to-r from-amber-950/60 to-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-amber-900/50 border border-amber-600/40 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-gothic text-sm font-bold text-amber-100 uppercase tracking-wider">
                AUDYT SPÓJNOŚCI LORE I TERMINOLOGII
              </h3>
              <p className="text-[11px] text-neutral-400 font-reader">
                Weryfikacja terminów z kanonem Black Library i interaktywna korekta
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

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-xs font-cogitator text-amber-400 animate-pulse">
                SKANOWANIE TEKSTU POD KĄTEM FAŁSZYWYCH PRZYJACIÓŁ I BŁĘDÓW LORE...
              </p>
            </div>
          )}

          {!isLoading && result && (
            <>
              {/* Scorecard */}
              <div className="p-4 rounded-lg bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-cogitator uppercase text-neutral-400 block mb-1">
                    Wskaźnik Czystości Kanonicznej
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold font-gothic text-amber-300">
                      {result.overallScore}%
                    </span>
                    {result.isLoreCompliant ? (
                      <span className="text-[11px] font-cogitator text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> ZGODNY Z KANONEM
                      </span>
                    ) : (
                      <span className="text-[11px] font-cogitator text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> WYMAGA KOREKTY ({result.issues.length})
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-cogitator uppercase text-neutral-500 block mb-1">
                    Wykryte kwestie
                  </span>
                  <span className="text-lg font-bold font-cogitator text-neutral-200">
                    {result.issues.length}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-neutral-950/60 p-3 rounded border border-neutral-800/70 text-xs sm:text-sm text-neutral-300 font-reader leading-relaxed">
                {result.summary}
              </div>

              {/* Grammar Morphing Anomaly Checker */}
              {grammarAnomalies.length > 0 && (
                <div className="p-3.5 rounded bg-amber-950/30 border border-amber-600/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-gothic font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Wykryte kolizje fleksyjne w tekście (Grammar Morphing):
                    </span>
                    <span className="text-[10px] font-cogitator text-amber-400 bg-amber-900/60 px-2 py-0.5 rounded border border-amber-700">
                      {grammarAnomalies.length} {grammarAnomalies.length === 1 ? 'anomalia' : 'anomalii'}
                    </span>
                  </div>
                  <div className="space-y-2 pt-1">
                    {grammarAnomalies.map((anom, aIdx) => (
                      <div key={aIdx} className="p-2.5 rounded bg-black/60 border border-amber-900/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-rose-400 line-through font-reader">"{anom.matchedText}"</span>
                            <ArrowRight className="w-3 h-3 text-neutral-500" />
                            <span className="text-emerald-300 font-bold font-reader">"{anom.suggestedForm}"</span>
                            <span className="text-[10px] font-cogitator text-neutral-400">({anom.expectedCase})</span>
                          </div>
                          <p className="text-[11px] text-neutral-400 font-reader mt-0.5">{anom.explanation}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            playCogitatorClick();
                            if (onApplyFix) onApplyFix(anom.matchedText, anom.suggestedForm, true, false);
                          }}
                          className="px-2.5 py-1 rounded bg-amber-900/70 hover:bg-amber-800 border border-amber-600/60 text-amber-200 text-[10px] font-cogitator self-end sm:self-center cursor-pointer transition"
                        >
                          Koryguj przypadek ✨
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Issues list with EDITABLE fields */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-gothic font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                    Wykryte błędy terminologiczne (możesz edytować przed zatwierdzeniem):
                  </h4>
                  <span className="text-[10px] font-cogitator text-neutral-500">
                    Kliknij w pola, aby edytować słowo lub zamiennik
                  </span>
                </div>

                {result.issues.length === 0 ? (
                  <div className="p-4 rounded border border-emerald-900/50 bg-emerald-950/20 text-emerald-300 text-xs font-reader flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Doskonale! Nie wykryto żadnych anomalii ani błędów terminologicznych w tym fragmencie.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {result.issues.map((issue, idx) => {
                      const currentSearch = editedIssues[idx]?.search ?? (issue.foundInText || issue.term);
                      const currentReplace = editedIssues[idx]?.replace ?? issue.expected;
                      const isApplied = !!appliedIssues[idx];
                      const occurrencesCount = getCountInText(currentSearch);

                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded border transition space-y-2.5 text-xs ${
                            isApplied
                              ? 'bg-emerald-950/20 border-emerald-800/50 text-neutral-300'
                              : 'bg-neutral-900/70 border-amber-900/40'
                          }`}
                        >
                          {/* Term header & explanation */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-cogitator text-neutral-500 uppercase">
                                Oryginał:
                              </span>
                              <span className="font-gothic font-bold text-amber-300 text-xs">
                                {issue.term}
                              </span>
                              {occurrencesCount > 0 && (
                                <span className="text-[10px] font-cogitator text-neutral-400 bg-neutral-800 px-1.5 py-0.2 rounded border border-neutral-700">
                                  {occurrencesCount} {occurrencesCount === 1 ? 'wystąpienie' : 'wystąpień w tekście'}
                                </span>
                              )}
                            </div>

                            {isApplied && (
                              <span className="text-[10px] font-cogitator text-emerald-400 flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                                <Check className="w-3 h-3" /> Zastosowano w tekście
                              </span>
                            )}
                          </div>

                          {/* Editable Replacement Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {/* What to replace (Found in text) */}
                            <div>
                              <label className="block text-[10px] font-cogitator text-neutral-400 mb-1 flex items-center justify-between">
                                <span className="text-rose-400">Tekst do zastąpienia (w rozdziale):</span>
                                <span className="text-[9px] text-neutral-500">Edytowalny</span>
                              </label>
                              <input
                                type="text"
                                value={currentSearch}
                                onChange={(e) => handleFieldChange(idx, 'search', e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-700 focus:border-rose-500 rounded px-2.5 py-1.5 text-xs text-rose-200 outline-none font-reader"
                                placeholder="Co zastąpić..."
                              />
                            </div>

                            {/* What to replace with (Expected / Polish equivalent) */}
                            <div>
                              <label className="block text-[10px] font-cogitator text-neutral-400 mb-1 flex items-center justify-between">
                                <span className="text-emerald-400">Poprawny odpowiednik (Kanon PL):</span>
                                <span className="text-[9px] text-neutral-500">Edytowalny</span>
                              </label>
                              <input
                                type="text"
                                value={currentReplace}
                                onChange={(e) => handleFieldChange(idx, 'replace', e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded px-2.5 py-1.5 text-xs text-emerald-200 outline-none font-reader font-bold"
                                placeholder="Nowa poprawna wersja..."
                              />
                            </div>
                          </div>

                          {/* Snippet preview */}
                          {issue.snippet && (
                            <div className="text-[11px] font-cogitator text-neutral-400 bg-black/50 p-2 rounded border border-neutral-800/80">
                              <span className="text-neutral-500 mr-1.5">Fragment:</span>
                              "{issue.snippet}"
                            </div>
                          )}

                          {/* Explanation */}
                          <p className="text-[11px] text-neutral-300 font-reader italic">
                            {issue.explanation}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleExecuteFix(idx, true, true)}
                              disabled={!currentSearch || !currentReplace}
                              className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 text-[10px] font-cogitator flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
                              title="Zamień w tekście i zapisz jako stałą regułę w Glosariuszu"
                            >
                              <BookmarkPlus className="w-3 h-3 text-amber-400" />
                              <span>Zamień & Dodaj do Glosariusza</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleExecuteFix(idx, true, false)}
                              disabled={!currentSearch || !currentReplace}
                              className="px-3 py-1 rounded bg-amber-950 hover:bg-amber-900 border border-amber-700/80 text-amber-200 text-[10px] font-cogitator flex items-center gap-1 transition cursor-pointer shadow disabled:opacity-50"
                              title="Zastąp wszystkie wystąpienia tego słowa w rozdziale"
                            >
                              <Wrench className="w-3 h-3" />
                              <span>Zamień w tekście ({occurrencesCount})</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Manual Quick Search & Replace Box */}
              <div className="pt-3 border-t border-neutral-800">
                <div className="p-3.5 rounded bg-neutral-950/80 border border-neutral-800 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-gothic font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5 text-xs">
                      <Replace className="w-3.5 h-3.5 text-amber-500" />
                      Ręczna zamiana terminu w rozdziale:
                    </span>
                    {manualApplied && (
                      <span className="text-[10px] font-cogitator text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Zastosowano zamianę!
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleManualExecute} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        value={manualSearch}
                        onChange={(e) => setManualSearch(e.target.value)}
                        placeholder="Szukane słowo (np. bibliotekarz)..."
                        className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-xs text-neutral-200 outline-none focus:border-amber-500 font-reader"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={manualReplace}
                        onChange={(e) => setManualReplace(e.target.value)}
                        placeholder="Nowe słowo (np. Kronikarz)..."
                        className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-xs text-neutral-200 outline-none focus:border-amber-500 font-reader"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-between pt-1">
                      <label className="flex items-center gap-1.5 text-[11px] font-cogitator text-neutral-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={manualSaveGlossary}
                          onChange={(e) => setManualSaveGlossary(e.target.checked)}
                          className="rounded border-neutral-700 bg-neutral-900 text-amber-600 focus:ring-0"
                        />
                        <span>Zapisz tę parę w Glosariuszu</span>
                      </label>

                      <button
                        type="submit"
                        disabled={!manualSearch.trim() || !manualReplace.trim()}
                        className="px-3 py-1 rounded bg-amber-800 hover:bg-amber-700 text-white font-gothic text-[11px] transition shadow cursor-pointer disabled:opacity-50"
                      >
                        Zamień w tekście
                      </button>
                    </div>
                  </form>
                </div>
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
            Zamknij Raport
          </button>
        </div>

      </div>
    </div>
  );
};

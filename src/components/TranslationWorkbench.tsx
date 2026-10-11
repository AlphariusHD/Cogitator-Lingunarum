import React, { useState, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  FileText, 
  Columns, 
  Eye, 
  Loader2,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Link,
  Unlink,
  GitCompare,
  History,
  X,
  Replace,
  Search,
  CheckCircle2,
  Edit3
} from 'lucide-react';
import { BookChapter, GlossaryTerm, UserRole, ChapterReviewStatus, ReviewComment } from '../types/wh40k';
import { playCogitatorClick, playOmnissiahChime } from '../utils/audioEffects';
import { computeWordDiff, DiffPart } from '../utils/diffViewer';
import { CollaborationReviewPanel } from './CollaborationReviewPanel';

interface TranslationWorkbenchProps {
  chapter: BookChapter;
  onUpdateSource: (newText: string) => void;
  onUpdateTranslation: (newText: string) => void;
  onTranslateChapter: () => void;
  onRunAudit: () => void;
  onExplainTerm: (term: string) => void;
  onOpenExport: () => void;
  onOpenChapterDetector?: () => void;
  onSaveSnapshot?: () => void;
  onRevertSnapshot?: () => void;
  isTranslating: boolean;
  translationProgress: { currentChunk: number; totalChunks: number } | null;
  activeGlossary: GlossaryTerm[];
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onUpdateChapterStatus: (status: ChapterReviewStatus, notes?: string) => void;
  onAddComment: (comment: Omit<ReviewComment, 'id' | 'timestamp' | 'status'>) => void;
  onResolveComment: (commentId: string) => void;
  onApplySuggestedFix: (targetSnippet: string, fixText: string, commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export const TranslationWorkbench: React.FC<TranslationWorkbenchProps> = ({
  chapter,
  onUpdateSource,
  onUpdateTranslation,
  onTranslateChapter,
  onRunAudit,
  onExplainTerm,
  onOpenExport,
  onOpenChapterDetector,
  onSaveSnapshot,
  onRevertSnapshot,
  isTranslating,
  translationProgress,
  activeGlossary,
  currentRole,
  onRoleChange,
  onUpdateChapterStatus,
  onAddComment,
  onResolveComment,
  onApplySuggestedFix,
  onDeleteComment,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'target-only'>('split');
  const [showDetectedTerms, setShowDetectedTerms] = useState(true);
  
  // Polish pane view mode: editable textarea OR interactive annotated terms reader
  const [polishEditorMode, setPolishEditorMode] = useState<'edit' | 'interactive'>('edit');

  // Feature 4: Sync-Scroll
  const [syncScroll, setSyncScroll] = useState(true);
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const isScrollingFromLeft = useRef(false);
  const isScrollingFromRight = useRef(false);

  // Feature 5: Diff Mode
  const [diffMode, setDiffMode] = useState(false);

  // Feature 3: Interactive Lore Tooltip state & Quick Replace
  const [activeTooltipTerm, setActiveTooltipTerm] = useState<{
    term: GlossaryTerm;
    x: number;
    y: number;
  } | null>(null);

  const [quickReplaceWord, setQuickReplaceWord] = useState('');
  const [quickReplaceTarget, setQuickReplaceTarget] = useState('');
  const [showQuickReplaceInput, setShowQuickReplaceInput] = useState(false);
  const [replaceSuccessMsg, setReplaceSuccessMsg] = useState('');

  const handleCopy = () => {
    if (!chapter.translatedText) return;
    playCogitatorClick();
    navigator.clipboard.writeText(chapter.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sync-scroll event handlers
  const handleLeftScroll = () => {
    if (!syncScroll || isScrollingFromRight.current || !leftPaneRef.current || !rightPaneRef.current) return;
    isScrollingFromLeft.current = true;
    const { scrollTop, scrollHeight, clientHeight } = leftPaneRef.current;
    const maxScrollLeft = scrollHeight - clientHeight;
    const ratio = maxScrollLeft > 0 ? scrollTop / maxScrollLeft : 0;
    const maxScrollRight = rightPaneRef.current.scrollHeight - rightPaneRef.current.clientHeight;
    rightPaneRef.current.scrollTop = ratio * maxScrollRight;
    setTimeout(() => { isScrollingFromLeft.current = false; }, 60);
  };

  const handleRightScroll = () => {
    if (!syncScroll || isScrollingFromLeft.current || !leftPaneRef.current || !rightPaneRef.current) return;
    isScrollingFromRight.current = true;
    const { scrollTop, scrollHeight, clientHeight } = rightPaneRef.current;
    const maxScrollRight = scrollHeight - clientHeight;
    const ratio = maxScrollRight > 0 ? scrollTop / maxScrollRight : 0;
    const maxScrollLeft = leftPaneRef.current.scrollHeight - leftPaneRef.current.clientHeight;
    leftPaneRef.current.scrollTop = ratio * maxScrollLeft;
    setTimeout(() => { isScrollingFromRight.current = false; }, 60);
  };

  // Compute Word Diff for Feature 5
  const diffParts: DiffPart[] = useMemo(() => {
    if (!diffMode || !chapter.previousTranslationSnapshot) return [];
    return computeWordDiff(chapter.previousTranslationSnapshot, chapter.translatedText);
  }, [diffMode, chapter.previousTranslationSnapshot, chapter.translatedText]);

  // Compute Diff Stats (+words / -words)
  const diffStats = useMemo(() => {
    let addedCount = 0;
    let removedCount = 0;
    diffParts.forEach(p => {
      const words = p.value.trim().split(/\s+/).filter(Boolean).length;
      if (p.added) addedCount += words;
      if (p.removed) removedCount += words;
    });
    return { addedCount, removedCount };
  }, [diffParts]);

  // Find glossary term match for tooltip
  const handleTermClick = (e: React.MouseEvent, termName: string) => {
    e.stopPropagation();
    playCogitatorClick();
    const cleanTerm = termName.trim().toLowerCase();
    
    // Look up in glossary by PL term, EN term, or declension cases
    const matched = activeGlossary.find(g => {
      if (g.polishTerm.toLowerCase() === cleanTerm || g.englishTerm.toLowerCase() === cleanTerm) return true;
      if (g.declension) {
        return Object.values(g.declension).some(v => v && v.toLowerCase() === cleanTerm);
      }
      return false;
    });

    if (matched) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setActiveTooltipTerm({
        term: matched,
        x: rect.left,
        y: Math.min(rect.bottom + 8, window.innerHeight - 280)
      });
      setQuickReplaceWord(matched.polishTerm);
      setQuickReplaceTarget(termName.trim());
      setShowQuickReplaceInput(false);
      setReplaceSuccessMsg('');
    }
  };

  // Execute Quick Replacement directly from Tooltip
  const handleExecuteQuickReplace = (replaceAll: boolean) => {
    if (!quickReplaceWord.trim() || !quickReplaceTarget.trim()) return;
    playCogitatorClick();

    if (onSaveSnapshot) {
      onSaveSnapshot();
    }

    const currentText = chapter.translatedText;
    const escaped = quickReplaceTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, replaceAll ? 'gi' : 'i');
    const updated = currentText.replace(regex, quickReplaceWord.trim());

    onUpdateTranslation(updated);
    setReplaceSuccessMsg(replaceAll ? `Podmieniono wszystkie wystąpienia!` : `Podmieniono pierwsze wystąpienie!`);
    setTimeout(() => {
      setReplaceSuccessMsg('');
      setActiveTooltipTerm(null);
    }, 1500);
  };

  // Render text with interactive term chips (Interactive mode)
  const renderInteractiveText = (text: string) => {
    if (!text) return null;

    // Build regex from all polish and english terms
    const termMap = new Map<string, GlossaryTerm>();
    const patterns: string[] = [];

    activeGlossary.forEach(g => {
      if (g.polishTerm && g.polishTerm.length > 2) {
        termMap.set(g.polishTerm.toLowerCase(), g);
        patterns.push(g.polishTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      }
      if (g.declension) {
        Object.values(g.declension).forEach(val => {
          if (val && val.length > 2) {
            termMap.set(val.toLowerCase(), g);
            patterns.push(val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
          }
        });
      }
    });

    if (patterns.length === 0) {
      return <div className="whitespace-pre-wrap leading-relaxed">{text}</div>;
    }

    // Sort patterns by length descending to match longest phrases first
    patterns.sort((a, b) => b.length - a.length);
    const regex = new RegExp(`\\b(${patterns.slice(0, 80).join('|')})\\b`, 'gi');

    const paragraphs = text.split('\n\n');

    return (
      <div className="space-y-4 font-reader text-sm sm:text-base leading-relaxed">
        {paragraphs.map((para, pIdx) => {
          const parts = para.split(regex);
          return (
            <p key={pIdx} className="leading-relaxed">
              {parts.map((part, i) => {
                const match = termMap.get(part.toLowerCase());
                if (match) {
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => handleTermClick(e, part)}
                      className="inline-block px-1.5 py-0.5 mx-0.5 rounded bg-theme-accent-muted border border-theme-accent text-theme-accent font-bold hover:brightness-125 transition cursor-pointer text-xs sm:text-sm font-gothic tracking-wide"
                      title="Kliknij, aby otworzyć dymek lore i szybką podmianę"
                    >
                      {part}
                    </button>
                  );
                }
                return <span key={i}>{part}</span>;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <main 
      className="flex-1 flex flex-col h-full bg-neutral-950/40 backdrop-blur-[2px] overflow-hidden text-neutral-200"
      onClick={() => setActiveTooltipTerm(null)}
    >
      
      {/* Chapter Action Bar */}
      <div className="p-3 sm:px-6 border-b border-neutral-800/60 bg-neutral-950/60 backdrop-blur-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-gothic text-base font-bold text-theme-accent flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-theme-accent" />
            <span>{chapter.title}</span>
          </h2>
          {chapter.status === 'completed' && (
            <span className="text-[10px] font-cogitator text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded">
              UKOŃCZONO
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Sync-Scroll Toggle (Feature 4) */}
          <button
            onClick={() => {
              playCogitatorClick();
              setSyncScroll(!syncScroll);
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-cogitator border transition cursor-pointer ${
              syncScroll
                ? 'bg-neutral-900 border-theme-accent text-theme-accent'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
            }`}
            title="Włącz/wyłącz synchroniczne przewijanie obu paneli"
          >
            {syncScroll ? <Link className="w-3.5 h-3.5 text-theme-accent" /> : <Unlink className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">Sync-Scroll</span>
          </button>

          {/* Snapshot Save Button (Feature 5) */}
          {chapter.translatedText && onSaveSnapshot && (
            <button
              onClick={() => {
                playCogitatorClick();
                onSaveSnapshot();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-cogitator border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-neutral-200 transition cursor-pointer"
              title="Zapisz bieżący stan jako wersję do porównania (Snapshot)"
            >
              <History className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden lg:inline text-[11px]">Zapisz wersję</span>
            </button>
          )}

          {/* Diff Mode Toggle (Feature 5) */}
          {chapter.previousTranslationSnapshot && (
            <button
              onClick={() => {
                playCogitatorClick();
                setDiffMode(!diffMode);
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-cogitator border transition cursor-pointer ${
                diffMode
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
              title="Porównaj zmiany z wersją przed modyfikacją (Diff)"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">{diffMode ? 'Ukryj Diff' : 'Porównaj (Diff)'}</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded p-0.5">
            <button
              onClick={() => { playCogitatorClick(); setViewMode('split'); }}
              className={`p-1.5 rounded transition ${
                viewMode === 'split' ? 'bg-neutral-800 text-theme-accent' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Widok bilingwalny (Dwa okna)"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { playCogitatorClick(); setViewMode('target-only'); }}
              className={`p-1.5 rounded transition ${
                viewMode === 'target-only' ? 'bg-neutral-800 text-theme-accent' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Tylko tekst polski"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Audit Button */}
          {chapter.translatedText && (
            <button
              onClick={() => { playCogitatorClick(); onRunAudit(); }}
              disabled={isTranslating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-theme-accent text-neutral-200 text-xs font-cogitator transition cursor-pointer disabled:opacity-50"
              title="Sprawdź tekst pod kątem poprawności terminów Warhammer 40K"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-theme-accent" />
              <span>Audyt Lore</span>
            </button>
          )}

          {/* Copy Button */}
          {chapter.translatedText && (
            <button
              onClick={handleCopy}
              className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-theme-accent transition cursor-pointer text-xs flex items-center gap-1"
              title="Skopiuj przetłumaczony tekst"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Dedicated Export Button */}
          <button
            onClick={() => { playCogitatorClick(); onOpenExport(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-theme-accent text-neutral-200 text-xs font-gothic transition cursor-pointer shadow-sm"
            title="Eksportuj rozdział lub całą książkę do formatu .PDF lub .EPUB / .PUB"
          >
            <Download className="w-3.5 h-3.5 text-theme-accent" />
            <span>Eksport</span>
          </button>

          {/* Translate Button */}
          <button
            onClick={() => { playCogitatorClick(); onTranslateChapter(); }}
            disabled={isTranslating || !chapter.sourceText.trim()}
            className="flex items-center gap-2 px-4 py-1.5 rounded bg-neutral-850 hover:bg-neutral-800 border border-theme-accent text-theme-accent font-gothic text-xs font-bold tracking-wider shadow-lg transition disabled:opacity-50 cursor-pointer"
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>
                  {translationProgress 
                    ? `PRZEKŁAD (${translationProgress.currentChunk}/${translationProgress.totalChunks})...`
                    : 'TRANSLACJA KOGITATORA...'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{chapter.translatedText ? 'PRZETŁUMACZ PONOWNIE' : 'PRZETŁUMACZ ROZDZIAŁ'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Two-Translator Collaboration & Verification System (Scribe & Inquisitor) */}
      <div className="px-3 py-2 bg-[#090b0e] border-b border-neutral-800">
        <CollaborationReviewPanel
          currentRole={currentRole}
          onRoleChange={onRoleChange}
          chapter={chapter}
          onUpdateChapterStatus={onUpdateChapterStatus}
          onAddComment={onAddComment}
          onResolveComment={onResolveComment}
          onApplySuggestedFix={onApplySuggestedFix}
          onDeleteComment={onDeleteComment}
        />
      </div>

      {/* Main Dual-Pane Editor Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-800/80 overflow-hidden">
        
        {/* Left Pane: English Source */}
        {viewMode === 'split' && (
          <div className="flex flex-col h-full bg-neutral-950/40 backdrop-blur-[2px]">
            <div className="p-2.5 px-4 border-b border-neutral-800/70 bg-neutral-950/60 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-cogitator uppercase tracking-wider text-[11px] text-theme-accent flex items-center gap-1.5">
                <span>𝕿𝕰𝖃𝕿 𝕺𝕽𝖄𝕲𝕴𝕹𝕬Ł𝖀 (EN)</span>
              </span>

              <div className="flex items-center gap-2">
                {chapter.sourceText.trim().length > 300 && onOpenChapterDetector && (
                  <button
                    onClick={() => { playCogitatorClick(); onOpenChapterDetector(); }}
                    className="flex items-center gap-1 text-[10px] font-cogitator text-neutral-400 hover:text-theme-accent bg-neutral-900 hover:bg-neutral-850 px-2 py-0.5 rounded border border-neutral-800 transition cursor-pointer"
                    title="Wykryj i podziel ten tekst na oddzielne rozdziały"
                  >
                    <span>✂️</span>
                    <span>Wykryj rozdziały</span>
                  </button>
                )}
                <span className="font-cogitator text-[10px] text-neutral-500">
                  {chapter.sourceText.trim() ? chapter.sourceText.trim().split(/\s+/).length : 0} słów
                </span>
              </div>
            </div>

            <div 
              ref={leftPaneRef}
              onScroll={handleLeftScroll}
              className="flex-1 p-4 overflow-y-auto"
            >
              <textarea
                value={chapter.sourceText}
                onChange={(e) => onUpdateSource(e.target.value)}
                placeholder="Wklej tutaj tekst rozdziału po angielsku..."
                className="w-full h-full bg-transparent resize-none border-0 focus:ring-0 outline-none font-reader text-sm sm:text-base text-neutral-300 placeholder-neutral-600 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Right Pane: Polish Translated */}
        <div className={`flex flex-col h-full bg-neutral-950/40 backdrop-blur-[2px] ${viewMode === 'target-only' ? 'col-span-full' : ''}`}>
          <div className="p-2.5 px-4 border-b border-neutral-800/70 bg-neutral-950/60 flex items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="font-cogitator uppercase tracking-wider text-[11px] text-theme-accent flex items-center gap-1.5">
                <span>𝕻𝕽𝖅𝕰𝕶Ł𝕬𝕯 𝕻𝕺𝕷𝕾𝕶𝕴 (KANON WH40K)</span>
              </span>
              {diffMode && (
                <span className="text-[10px] font-cogitator px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300">
                  DIFF (+{diffStats.addedCount} / -{diffStats.removedCount})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Interactive Annotated View vs Raw Textarea (Feature 3) */}
              {chapter.translatedText && !diffMode && (
                <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded p-0.5 text-[10px] font-cogitator">
                  <button
                    onClick={() => { playCogitatorClick(); setPolishEditorMode('edit'); }}
                    className={`px-2 py-0.5 rounded transition cursor-pointer flex items-center gap-1 ${
                      polishEditorMode === 'edit' ? 'bg-neutral-800 text-theme-accent' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                    title="Tryb edycji tekstu w polu tekstowym"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edycja</span>
                  </button>
                  <button
                    onClick={() => { playCogitatorClick(); setPolishEditorMode('interactive'); }}
                    className={`px-2 py-0.5 rounded transition cursor-pointer flex items-center gap-1 ${
                      polishEditorMode === 'interactive' ? 'bg-neutral-800 text-theme-accent' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                    title="Tryb interaktywny: kliknij w słowo, by zobaczyć dymek lore i szybko je podmienić"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Dymki Lore</span>
                  </button>
                </div>
              )}

              {chapter.translatedText && (
                <span className="font-cogitator text-[10px] text-neutral-500">
                  {chapter.translatedText.trim().split(/\s+/).length} słów PL
                </span>
              )}
            </div>
          </div>

          <div 
            ref={rightPaneRef}
            onScroll={handleRightScroll}
            className="flex-1 p-4 overflow-y-auto relative"
          >
            {isTranslating ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 text-center p-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-theme-accent/30 border-t-theme-accent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center font-gothic text-theme-accent font-bold">
                    𝕴
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-gothic text-sm font-bold text-theme-accent">
                    KOGITATOR PRZETWARZA KRONIKĘ
                  </h3>
                  <p className="text-xs text-neutral-400 font-reader max-w-sm">
                    {translationProgress 
                      ? `Tłumaczenie fragmentu ${translationProgress.currentChunk} z ${translationProgress.totalChunks} z uwzględnieniem form fleksyjnych i kanonu Black Library...`
                      : 'Inicjalizacja modułu lingwistycznego i dopasowywanie glosariusza...'}
                  </p>
                </div>

                <div className="font-cogitator text-[10px] text-theme-accent/80 uppercase tracking-widest animate-pulse">
                  Omnissiah dirigit intellectum nostrum
                </div>
              </div>
            ) : diffMode && diffParts.length > 0 ? (
              /* Feature 5: Visual Diff Mode Rendering */
              <div className="space-y-4 font-reader text-sm sm:text-base leading-relaxed">
                <div className="p-3 rounded bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-400 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-cogitator text-theme-accent font-bold">HISTORIA WERSJI:</span>
                    <span>
                      <strong className="text-emerald-400">+{diffStats.addedCount}</strong> / <strong className="text-rose-400">-{diffStats.removedCount}</strong> słów
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {onRevertSnapshot && (
                      <button
                        onClick={() => { playCogitatorClick(); onRevertSnapshot(); }}
                        className="text-[10px] font-cogitator px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 cursor-pointer"
                        title="Przywróć stan sprzed ostatnich zmian"
                      >
                        Przywróć snapshot
                      </button>
                    )}
                    <button
                      onClick={() => { playCogitatorClick(); setDiffMode(false); }}
                      className="text-[10px] font-cogitator px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-theme-accent border border-theme-accent cursor-pointer"
                    >
                      Zamknij Diff
                    </button>
                  </div>
                </div>

                <div className="whitespace-pre-wrap bg-neutral-950/60 p-4 rounded border border-neutral-900 leading-relaxed font-reader">
                  {diffParts.map((part, idx) => {
                    if (part.added) {
                      return (
                        <ins key={idx} className="bg-emerald-950/80 text-emerald-300 font-bold px-1 py-0.5 rounded no-underline">
                          {part.value}
                        </ins>
                      );
                    }
                    if (part.removed) {
                      return (
                        <del key={idx} className="bg-rose-950/80 text-rose-300 line-through px-1 py-0.5 rounded opacity-70">
                          {part.value}
                        </del>
                      );
                    }
                    return <span key={idx}>{part.value}</span>;
                  })}
                </div>
              </div>
            ) : chapter.translatedText ? (
              polishEditorMode === 'interactive' ? (
                renderInteractiveText(chapter.translatedText)
              ) : (
                <textarea
                  value={chapter.translatedText}
                  onChange={(e) => onUpdateTranslation(e.target.value)}
                  className="w-full h-full bg-transparent resize-none border-0 focus:ring-0 outline-none font-reader text-sm sm:text-base text-neutral-100 leading-relaxed selection:bg-neutral-800"
                />
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500 space-y-3">
                <FileText className="w-10 h-10 text-neutral-700" />
                <div className="space-y-1">
                  <p className="font-gothic text-sm text-neutral-400">
                    Rozdział nie został jeszcze przetłumaczony
                  </p>
                  <p className="text-xs font-reader text-neutral-500 max-w-xs">
                    Kliknij przycisk „PRZETŁUMACZ ROZDZIAŁ” powyżej, aby wygenerować polski przekład z zachowaniem oficjalnych terminów WH40K.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Feature 3: Interactive Floating Lore Tooltip with Instant Replace */}
      {activeTooltipTerm && (
        <div 
          style={{ top: `${activeTooltipTerm.y}px`, left: `${Math.min(activeTooltipTerm.x, window.innerWidth - 330)}px` }}
          className="fixed z-50 w-80 bg-[#0f1117] border border-theme-accent rounded-lg p-3.5 shadow-2xl text-xs space-y-2.5 text-neutral-200 animate-in fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="font-gothic font-bold text-theme-accent text-sm block">
                {activeTooltipTerm.term.polishTerm}
              </span>
              <span className="text-[10px] font-cogitator text-neutral-400">
                Oryginał: {activeTooltipTerm.term.englishTerm}
              </span>
            </div>
            <button
              onClick={() => setActiveTooltipTerm(null)}
              className="p-1 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-cogitator">
            <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
              {activeTooltipTerm.term.category}
            </span>
            {activeTooltipTerm.term.keepOriginal && (
              <span className="px-1.5 py-0.5 rounded bg-neutral-850 text-theme-accent border border-theme-accent">
                High Gothic
              </span>
            )}
          </div>

          {/* Fleksja / Declension view in tooltip */}
          {activeTooltipTerm.term.declension && (
            <div className="text-[10px] font-cogitator text-neutral-300 bg-black/50 p-2 rounded border border-neutral-800 space-y-1">
              <span className="text-theme-accent font-bold block">Odmiana (Fleksja PL):</span>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-neutral-400">
                {activeTooltipTerm.term.declension.dopelniacz && <div>D: <strong className="text-neutral-200">{activeTooltipTerm.term.declension.dopelniacz}</strong></div>}
                {activeTooltipTerm.term.declension.narzednik && <div>N: <strong className="text-neutral-200">{activeTooltipTerm.term.declension.narzednik}</strong></div>}
                {activeTooltipTerm.term.declension.miejscownik && <div>Ms: <strong className="text-neutral-200">{activeTooltipTerm.term.declension.miejscownik}</strong></div>}
                {activeTooltipTerm.term.declension.mnoga && <div>Pl: <strong className="text-neutral-200">{activeTooltipTerm.term.declension.mnoga}</strong></div>}
              </div>
            </div>
          )}

          {activeTooltipTerm.term.notes && (
            <p className="text-[11px] text-neutral-300 font-reader italic">
              {activeTooltipTerm.term.notes}
            </p>
          )}

          {/* Instant Word Replace Tool (Feature 3) */}
          <div className="pt-2 border-t border-neutral-800 space-y-2">
            {!showQuickReplaceInput ? (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowQuickReplaceInput(true)}
                  className="text-[11px] font-cogitator text-theme-accent hover:brightness-125 flex items-center gap-1 cursor-pointer"
                >
                  <Replace className="w-3.5 h-3.5" />
                  <span>Szybka podmiana w tekście</span>
                </button>

                <button
                  onClick={() => {
                    const termToExplain = activeTooltipTerm.term.englishTerm;
                    setActiveTooltipTerm(null);
                    onExplainTerm(termToExplain);
                  }}
                  className="text-[10px] font-cogitator text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Archiwista</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 bg-black/40 p-2 rounded border border-neutral-800">
                <div className="text-[10px] font-cogitator text-neutral-400 flex items-center justify-between">
                  <span>Zamień "{quickReplaceTarget}" na:</span>
                  <button onClick={() => setShowQuickReplaceInput(false)} className="text-neutral-500 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <input
                  type="text"
                  value={quickReplaceWord}
                  onChange={(e) => setQuickReplaceWord(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-white focus:border-theme-accent outline-none"
                  placeholder="Nowe słowo..."
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExecuteQuickReplace(false)}
                    className="flex-1 text-[10px] font-cogitator py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 cursor-pointer"
                  >
                    Tylko raz
                  </button>
                  <button
                    onClick={() => handleExecuteQuickReplace(true)}
                    className="flex-1 text-[10px] font-cogitator py-1 rounded bg-theme-accent-muted border border-theme-accent text-theme-accent font-bold cursor-pointer"
                  >
                    Wszystkie
                  </button>
                </div>
              </div>
            )}

            {replaceSuccessMsg && (
              <div className="text-[10px] font-cogitator text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{replaceSuccessMsg}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detected Warhammer 40K Terms Bar */}
      {chapter.detectedTerms && chapter.detectedTerms.length > 0 && (
        <div className="p-2.5 px-4 border-t border-neutral-800 bg-[#0c0e12] shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-cogitator text-theme-accent uppercase tracking-wider flex items-center gap-1.5">
              <span>Wykryte Terminy Kanoniczne ({chapter.detectedTerms.length}):</span>
            </span>
            <button
              onClick={() => setShowDetectedTerms(!showDetectedTerms)}
              className="text-[10px] font-cogitator text-neutral-500 hover:text-neutral-300 cursor-pointer"
            >
              {showDetectedTerms ? 'Zwiń' : 'Rozwiń'}
            </button>
          </div>

          {showDetectedTerms && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {chapter.detectedTerms.map((t, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleTermClick(e, t.translated)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-theme-accent text-neutral-300 text-[11px] whitespace-nowrap transition cursor-pointer group"
                  title={`Kliknij aby zobaczyć dymek lore: ${t.original} => ${t.translated}`}
                >
                  <span className="font-gothic text-theme-accent group-hover:brightness-125">{t.original}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-neutral-600" />
                  <span className="font-reader text-white font-medium">{t.translated}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </main>
  );
};

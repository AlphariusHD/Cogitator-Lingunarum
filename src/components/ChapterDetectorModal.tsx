import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Layers, 
  Sparkles, 
  Scissors, 
  FileText, 
  Check, 
  AlertCircle, 
  Sliders, 
  BookOpen,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { 
  detectChaptersFromText, 
  DetectedChapterSection, 
  DetectionStrategy,
  cleanTranslationArtifacts
} from '../utils/chapterDetector';

interface ChapterDetectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawText: string;
  sourceFileName?: string;
  onApplyChapters: (sections: { title: string; content: string }[]) => void;
}

export const ChapterDetectorModal: React.FC<ChapterDetectorModalProps> = ({
  isOpen,
  onClose,
  rawText,
  sourceFileName,
  onApplyChapters,
}) => {
  const [strategy, setStrategy] = useState<DetectionStrategy>('auto');
  const [chunkWordSize, setChunkWordSize] = useState<number>(2000);
  const [detectedSections, setDetectedSections] = useState<DetectedChapterSection[]>([]);
  const [editableTitles, setEditableTitles] = useState<Record<number, string>>({});

  // Clean raw text
  const cleanedText = useMemo(() => cleanTranslationArtifacts(rawText), [rawText]);

  // Run detection whenever cleanedText, strategy or chunkWordSize changes
  useEffect(() => {
    if (!cleanedText) {
      setDetectedSections([]);
      return;
    }

    const sections = detectChaptersFromText(cleanedText, {
      strategy,
      chunkWordSize,
      minWordsPerChapter: 40,
    });

    setDetectedSections(sections);

    // Initialize editable titles
    const titlesMap: Record<number, string> = {};
    sections.forEach((s, idx) => {
      titlesMap[idx] = s.title;
    });
    setEditableTitles(titlesMap);
  }, [cleanedText, strategy, chunkWordSize]);

  if (!isOpen) return null;

  const totalWords = detectedSections.reduce((acc, s) => acc + s.wordCount, 0);

  const handleTitleChange = (idx: number, newTitle: string) => {
    setEditableTitles(prev => ({
      ...prev,
      [idx]: newTitle,
    }));
  };

  const handleApply = () => {
    if (detectedSections.length === 0) return;

    const finalSections = detectedSections.map((s, idx) => ({
      title: (editableTitles[idx] || s.title || `Rozdział ${idx + 1}`).trim(),
      content: s.content,
    }));

    onApplyChapters(finalSections);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#111318] border border-amber-800/80 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-neutral-200">
        
        {/* Header */}
        <div className="p-4 border-b border-amber-900/60 bg-gradient-to-r from-amber-950/60 to-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-amber-900/50 border border-amber-600/40 text-amber-400">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-gothic text-sm font-bold text-amber-100 uppercase tracking-wider">
                WYKRYWACZ ROZDZIAŁÓW KRONIKI
              </h3>
              <p className="text-[11px] text-neutral-400 font-reader">
                Automatyczna analiza i segmentacja tekstu na rozdziały
                {sourceFileName ? ` (${sourceFileName})` : ''}
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

        {/* Options Bar */}
        <div className="p-3.5 border-b border-neutral-800 bg-neutral-950/70 space-y-2.5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-cogitator text-[11px] uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-500" />
              Metoda wykrywania:
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setStrategy('auto')}
                className={`px-2.5 py-1 rounded text-[11px] font-cogitator transition cursor-pointer ${
                  strategy === 'auto'
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-600/60'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800'
                }`}
              >
                Auto (Chapter/Rozdział/Prolog)
              </button>

              <button
                type="button"
                onClick={() => setStrategy('markdown')}
                className={`px-2.5 py-1 rounded text-[11px] font-cogitator transition cursor-pointer ${
                  strategy === 'markdown'
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-600/60'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800'
                }`}
              >
                Nagłówki Markdown (#)
              </button>

              <button
                type="button"
                onClick={() => setStrategy('roman_numerals')}
                className={`px-2.5 py-1 rounded text-[11px] font-cogitator transition cursor-pointer ${
                  strategy === 'roman_numerals'
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-600/60'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800'
                }`}
              >
                Rzymskie (I, II, III)
              </button>

              <button
                type="button"
                onClick={() => setStrategy('word_count')}
                className={`px-2.5 py-1 rounded text-[11px] font-cogitator transition cursor-pointer ${
                  strategy === 'word_count'
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-600/60'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800'
                }`}
              >
                Objętość (~słów)
              </button>
            </div>
          </div>

          {/* Word count size adjuster for volume strategy */}
          {strategy === 'word_count' && (
            <div className="flex items-center gap-3 pt-1 border-t border-neutral-900">
              <span className="text-neutral-400 text-[11px] font-reader">Średnia wielkość rozdziału:</span>
              <select
                value={chunkWordSize}
                onChange={(e) => setChunkWordSize(Number(e.target.value))}
                className="bg-neutral-900 text-amber-200 border border-neutral-700 rounded px-2 py-0.5 text-xs font-cogitator outline-none"
              >
                <option value={1000}>~1 000 słów</option>
                <option value={1500}>~1 500 słów</option>
                <option value={2000}>~2 000 słów</option>
                <option value={3000}>~3 000 słów</option>
              </select>
            </div>
          )}

          {/* Stats Bar */}
          <div className="flex items-center justify-between text-[11px] font-cogitator text-neutral-400 pt-1">
            <span>
              Wykryto: <strong className="text-amber-300">{detectedSections.length}</strong> rozdziałów
            </span>
            <span>
              Łączna objętość: <strong className="text-amber-300">{totalWords}</strong> słów
            </span>
          </div>
        </div>

        {/* Chapters Preview List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {detectedSections.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-xs font-reader italic">
              Brak tekstu lub nie wykryto znaczników rozdziałów.
            </div>
          ) : (
            detectedSections.map((section, idx) => (
              <div
                key={idx}
                className="p-3 rounded border border-neutral-800/80 bg-neutral-900/60 hover:border-amber-700/50 transition space-y-1.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-5 h-5 rounded bg-amber-950 border border-amber-700/50 text-amber-300 text-[10px] font-cogitator flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={editableTitles[idx] || section.title}
                      onChange={(e) => handleTitleChange(idx, e.target.value)}
                      placeholder={`Rozdział ${idx + 1}`}
                      className="flex-1 bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded px-2.5 py-1 text-xs font-gothic text-amber-200 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-cogitator text-neutral-400 shrink-0">
                    <span className="bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                      {section.wordCount} słów
                    </span>
                    {section.matchPattern && (
                      <span className="text-neutral-500 text-[10px] truncate max-w-[120px]">
                        [{section.matchPattern}]
                      </span>
                    )}
                  </div>
                </div>

                {/* Snippet preview */}
                <p className="text-[11px] text-neutral-400 font-reader italic line-clamp-2 pl-7">
                  {section.content.slice(0, 240)}...
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-gothic text-xs cursor-pointer"
          >
            Anuluj
          </button>

          <button
            onClick={handleApply}
            disabled={detectedSections.length === 0}
            className="flex items-center gap-2 px-4 py-1.5 rounded bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-neutral-950 font-gothic font-bold text-xs shadow-md shadow-amber-950/40 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>ZASTOSUJ PODZIAŁ ({detectedSections.length} ROZDZIAŁÓW)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

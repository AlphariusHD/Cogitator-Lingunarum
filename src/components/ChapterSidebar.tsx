import React, { useRef } from 'react';
import { 
  FileText, 
  Plus, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2, 
  Trash2,
  Bookmark,
  Layers,
  Sparkles
} from 'lucide-react';
import { BookChapter } from '../types/wh40k';

interface ChapterSidebarProps {
  chapters: BookChapter[];
  activeChapterId: string;
  onSelectChapter: (id: string) => void;
  onAddChapter: () => void;
  onDeleteChapter: (id: string) => void;
  onImportFile: (file: File) => void;
  onOpenChapterDetector: () => void;
  bookTitle: string;
  bookAuthor: string;
}

export const ChapterSidebar: React.FC<ChapterSidebarProps> = ({
  chapters,
  activeChapterId,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter,
  onImportFile,
  onOpenChapterDetector,
  bookTitle,
  bookAuthor,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const completedCount = chapters.filter(c => c.status === 'completed').length;
  const progressPercent = chapters.length > 0 ? Math.round((completedCount / chapters.length) * 100) : 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <aside className="w-full md:w-72 lg:w-80 bg-neutral-950/70 backdrop-blur-md border-r border-neutral-800/80 flex flex-col h-full shrink-0">
      {/* Book Metadata Badge */}
      <div className="p-4 border-b border-neutral-800/80 bg-neutral-950/60">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-cogitator text-amber-500 uppercase tracking-widest flex items-center gap-1">
            <Bookmark className="w-3 h-3 text-amber-600" />
            Aktywna Kronika
          </span>
          <span className="text-[11px] font-cogitator text-neutral-400">
            {completedCount}/{chapters.length} ukończono
          </span>
        </div>
        <h2 className="font-gothic text-sm font-bold text-amber-100 line-clamp-1" title={bookTitle}>
          {bookTitle}
        </h2>
        <p className="text-xs text-neutral-400 font-reader italic mb-2.5">
          Autor: {bookAuthor || 'Nieznany Archiwista'}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden border border-neutral-800">
          <div 
            className="bg-gradient-to-r from-amber-700 to-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Chapters list header & action buttons */}
      <div className="p-2.5 px-3 border-b border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
        <span className="font-cogitator uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          Rozdziały ({chapters.length})
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenChapterDetector}
            className="p-1 rounded hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 transition cursor-pointer"
            title="Wykryj i podziel tekst na rozdziały (Auto-detektor)"
          >
            <span className="text-xs">✂️</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1 rounded hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 transition cursor-pointer"
            title="Wgraj plik .EPUB, .TXT lub .MD (automatyczne wykrywanie rozdziałów)"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".epub,.txt,.md"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={onAddChapter}
            className="p-1 rounded hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 transition cursor-pointer"
            title="Dodaj pusty rozdział"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chapters Scrollable List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {chapters.map((ch, idx) => {
          const isActive = ch.id === activeChapterId;
          return (
            <div
              key={ch.id}
              onClick={() => onSelectChapter(ch.id)}
              className={`group relative p-2.5 rounded border transition cursor-pointer text-left flex items-start justify-between gap-2 ${
                isActive
                  ? 'bg-amber-950/30 border-amber-600/60 text-amber-100 shadow-sm'
                  : 'bg-neutral-900/40 border-neutral-800/50 hover:bg-neutral-850 hover:border-neutral-700 text-neutral-300'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  {/* Status Indicator */}
                  {ch.status === 'completed' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  )}
                  {ch.status === 'translating' && (
                    <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin shrink-0" />
                  )}
                  {ch.status === 'error' && (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  )}
                  {ch.status === 'idle' && (
                    <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  )}

                  <span className={`text-xs font-medium font-gothic truncate ${isActive ? 'text-amber-200' : 'text-neutral-200'}`}>
                    {ch.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-cogitator text-neutral-400">
                  <span>{ch.wordCountSource} słów oryg.</span>
                  {ch.wordCountTranslated > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-amber-400">{ch.wordCountTranslated} słów PL</span>
                    </>
                  )}
                </div>
              </div>

              {chapters.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Czy na pewno usunąć "${ch.title}"?`)) {
                      onDeleteChapter(ch.id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                  title="Usuń rozdział"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Cogitator Footer Proverb */}
      <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/80 text-[10px] text-neutral-400 font-reader italic text-center">
        „Ignorancja jest pancerzem przed herezją, lecz czystość słowa niesie wolę Imperatora.”
      </div>
    </aside>
  );
};

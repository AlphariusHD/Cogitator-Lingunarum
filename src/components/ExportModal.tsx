import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  BookOpen, 
  Printer, 
  Check, 
  Sparkles, 
  Layers,
  Settings,
  Tablet,
  FileCode
} from 'lucide-react';
import { BookChapter, BookProject } from '../types/wh40k';
import { generateEpub } from '../utils/epubGenerator';
import { generatePdf, openImperialPrintView } from '../utils/pdfGenerator';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: BookProject;
  activeChapter: BookChapter;
}

export type ExportScope = 'chapter' | 'book';
export type ExportFormat = 'epub' | 'pdf' | 'txt' | 'md';

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  book,
  activeChapter,
}) => {
  const [scope, setScope] = useState<ExportScope>('chapter');
  const [format, setFormat] = useState<ExportFormat>('epub');
  const [customTitle, setCustomTitle] = useState(book.title);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const translatedChapters = book.chapters.filter(c => c.translatedText.trim().length > 0);
  const chaptersToExport = scope === 'chapter' 
    ? [activeChapter] 
    : (translatedChapters.length > 0 ? translatedChapters : book.chapters);

  const totalWords = chaptersToExport.reduce((acc, c) => {
    const text = c.translatedText.trim() || c.sourceText.trim();
    return acc + (text ? text.split(/\s+/).length : 0);
  }, 0);

  const handleExecuteExport = async () => {
    setIsExporting(true);
    setExportedSuccess(null);

    try {
      const filenameBase = (customTitle || book.title).replace(/[^a-zA-Z0-9\-_]/g, '_');

      if (format === 'epub') {
        const epubBlob = await generateEpub(book, chaptersToExport, { customTitle });
        const url = URL.createObjectURL(epubBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filenameBase}_${scope === 'chapter' ? activeChapter.title.replace(/[^a-zA-Z0-9]/g, '_') : 'CALOSC'}.epub`;
        a.click();
        URL.revokeObjectURL(url);
        setExportedSuccess('Pobrano plik e-booka (.epub)! Gotowy na Kindle, Kobo, PocketBook.');
      } else if (format === 'pdf') {
        await generatePdf(book, chaptersToExport, { customTitle });
        setExportedSuccess('Pobrano dokument PDF (.pdf)!');
      } else if (format === 'txt') {
        let content = `WARHAMMER 40,000 • KANON POLSKI\n${customTitle}\nAutor: ${book.author}\n\n`;
        content += chaptersToExport.map(c => `=== ${c.title} ===\n\n${c.translatedText || c.sourceText}`).join('\n\n\n');
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filenameBase}_${scope === 'chapter' ? 'Rozdzial' : 'Calosc'}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        setExportedSuccess('Pobrano plik tekstowy (.txt)!');
      } else if (format === 'md') {
        let content = `# ${customTitle}\n\n*Autor: ${book.author}*\n\n---\n\n`;
        content += chaptersToExport.map(c => `## ${c.title}\n\n${c.translatedText || c.sourceText}`).join('\n\n---\n\n');
        
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filenameBase}_${scope === 'chapter' ? 'Rozdzial' : 'Calosc'}.md`;
        a.click();
        URL.revokeObjectURL(url);
        setExportedSuccess('Pobrano plik Markdown (.md)!');
      }
    } catch (err: any) {
      console.error('Export failed:', err);
      alert(`Błąd podczas eksportu: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenPrintPreview = () => {
    openImperialPrintView(book, chaptersToExport, { customTitle });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#111318] border border-amber-800/80 rounded-lg shadow-2xl max-w-xl w-full overflow-hidden text-neutral-200">
        
        {/* Header */}
        <div className="p-4 border-b border-amber-900/60 bg-gradient-to-r from-amber-950/60 to-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-amber-900/50 border border-amber-600/40 text-amber-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-gothic text-sm font-bold text-amber-100 uppercase tracking-wider">
                EKSPORT KRONIKI (.PDF / .EPUB / .PUB)
              </h3>
              <p className="text-[11px] text-neutral-400 font-reader">
                Zapisz przetłumaczony rozdział lub kompletną książkę
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

        {/* Form Body */}
        <div className="p-4 sm:p-5 space-y-4 text-xs">
          
          {/* Scope Selector */}
          <div>
            <label className="block text-[11px] font-cogitator uppercase tracking-wider text-amber-400 mb-1.5">
              1. Zakres eksportu:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScope('chapter')}
                className={`p-3 rounded border text-left transition cursor-pointer ${
                  scope === 'chapter'
                    ? 'bg-amber-950/40 border-amber-600/80 text-amber-100 shadow'
                    : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-850 text-neutral-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-gothic font-bold text-xs mb-1">
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Bieżący Rozdział</span>
                </div>
                <p className="text-[11px] font-reader text-neutral-400 truncate">
                  {activeChapter.title}
                </p>
                <span className="text-[10px] font-cogitator text-neutral-500 block mt-1">
                  {activeChapter.translatedText.trim() ? activeChapter.translatedText.trim().split(/\s+/).length : 0} słów PL
                </span>
              </button>

              <button
                type="button"
                onClick={() => setScope('book')}
                className={`p-3 rounded border text-left transition cursor-pointer ${
                  scope === 'book'
                    ? 'bg-amber-950/40 border-amber-600/80 text-amber-100 shadow'
                    : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-850 text-neutral-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-gothic font-bold text-xs mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                  <span>Cała Książka</span>
                </div>
                <p className="text-[11px] font-reader text-neutral-400">
                  Wszystkie rozdziały ({book.chapters.length})
                </p>
                <span className="text-[10px] font-cogitator text-neutral-500 block mt-1">
                  {translatedChapters.length} przetłumaczonych
                </span>
              </button>
            </div>
          </div>

          {/* Format Selector */}
          <div>
            <label className="block text-[11px] font-cogitator uppercase tracking-wider text-amber-400 mb-1.5">
              2. Format docelowy:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              
              {/* EPUB / .PUB */}
              <button
                type="button"
                onClick={() => setFormat('epub')}
                className={`p-2.5 rounded border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  format === 'epub'
                    ? 'bg-amber-950/40 border-amber-500 text-amber-100 ring-1 ring-amber-500/50'
                    : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-850 text-neutral-400'
                }`}
              >
                <Tablet className={`w-5 h-5 ${format === 'epub' ? 'text-amber-400' : 'text-neutral-500'}`} />
                <div>
                  <div className="font-gothic font-bold text-xs text-neutral-200">.EPUB / .PUB</div>
                  <div className="text-[10px] font-reader text-neutral-400">Czytniki E-book</div>
                </div>
              </button>

              {/* PDF */}
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-2.5 rounded border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  format === 'pdf'
                    ? 'bg-amber-950/40 border-amber-500 text-amber-100 ring-1 ring-amber-500/50'
                    : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-850 text-neutral-400'
                }`}
              >
                <FileText className={`w-5 h-5 ${format === 'pdf' ? 'text-amber-400' : 'text-neutral-500'}`} />
                <div>
                  <div className="font-gothic font-bold text-xs text-neutral-200">.PDF</div>
                  <div className="text-[10px] font-reader text-neutral-400">Dokument & Druk</div>
                </div>
              </button>

              {/* TXT */}
              <button
                type="button"
                onClick={() => setFormat('txt')}
                className={`p-2.5 rounded border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  format === 'txt'
                    ? 'bg-amber-950/40 border-amber-500 text-amber-100 ring-1 ring-amber-500/50'
                    : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-850 text-neutral-400'
                }`}
              >
                <FileCode className={`w-5 h-5 ${format === 'txt' ? 'text-amber-400' : 'text-neutral-500'}`} />
                <div>
                  <div className="font-gothic font-bold text-xs text-neutral-200">.TXT</div>
                  <div className="text-[10px] font-reader text-neutral-400">Czysty tekst UTF-8</div>
                </div>
              </button>

              {/* MD */}
              <button
                type="button"
                onClick={() => setFormat('md')}
                className={`p-2.5 rounded border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  format === 'md'
                    ? 'bg-amber-950/40 border-amber-500 text-amber-100 ring-1 ring-amber-500/50'
                    : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-850 text-neutral-400'
                }`}
              >
                <Layers className={`w-5 h-5 ${format === 'md' ? 'text-amber-400' : 'text-neutral-500'}`} />
                <div>
                  <div className="font-gothic font-bold text-xs text-neutral-200">.MD</div>
                  <div className="text-[10px] font-reader text-neutral-400">Markdown</div>
                </div>
              </button>

            </div>
          </div>

          {/* Title Customization */}
          <div>
            <label className="block text-[11px] font-cogitator text-neutral-400 mb-1">
              Tytuł w pliku eksportu:
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-1.5 text-neutral-200 focus:border-amber-500 outline-none font-reader"
            />
          </div>

          {/* Summary Box */}
          <div className="p-3 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-between text-neutral-400 font-cogitator text-[11px]">
            <span>Liczba eksportowanych rozdziałów: <strong className="text-amber-300">{chaptersToExport.length}</strong></span>
            <span>Łącznie słów: <strong className="text-amber-300">{totalWords}</strong></span>
          </div>

          {/* Success Banner */}
          {exportedSuccess && (
            <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{exportedSuccess}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 border-t border-neutral-800 bg-neutral-950 flex flex-wrap items-center justify-between gap-2">
          {/* Secondary: Imperial Print View */}
          <button
            type="button"
            onClick={handleOpenPrintPreview}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-reader transition cursor-pointer"
            title="Otwórz podgląd z czcionkami Cinzel i Crimson Pro gotowy do zapisu przez przeglądarkę"
          >
            <Printer className="w-3.5 h-3.5 text-amber-500" />
            <span>Podgląd Wydruku / Zapisz wektorowy PDF</span>
          </button>

          {/* Primary Download Button */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-gothic text-xs transition cursor-pointer"
            >
              Zamknij
            </button>
            <button
              onClick={handleExecuteExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-neutral-950 font-gothic font-bold text-xs tracking-wider shadow-lg shadow-amber-950/50 transition cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'GENEROWANIE...' : `POBIERZ .${format.toUpperCase()}`}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

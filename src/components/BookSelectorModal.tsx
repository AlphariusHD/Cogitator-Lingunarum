import React, { useRef, useState } from 'react';
import { X, BookOpen, Upload, Plus, Check, Library } from 'lucide-react';
import { BookProject } from '../types/wh40k';
import { SAMPLE_WH40K_BOOKS } from '../data/sampleBooks';

interface BookSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBookId: string;
  onSelectBook: (book: BookProject) => void;
  onCreateBook: (title: string, author: string) => void;
  onImportFile: (file: File) => void;
}

export const BookSelectorModal: React.FC<BookSelectorModalProps> = ({
  isOpen,
  onClose,
  currentBookId,
  onSelectBook,
  onCreateBook,
  onImportFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateBook(newTitle.trim(), newAuthor.trim() || 'Nieznany Archiwista');
    setNewTitle('');
    setNewAuthor('');
    setIsCreatingNew(false);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportFile(e.target.files[0]);
      e.target.value = '';
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#111317] border border-amber-800/80 rounded-lg shadow-2xl max-w-xl w-full overflow-hidden text-neutral-200">
        
        {/* Header */}
        <div className="p-4 border-b border-amber-900/60 bg-gradient-to-r from-amber-950/60 to-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-amber-900/50 border border-amber-600/40 text-amber-400">
              <Library className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-gothic text-sm font-bold text-amber-100 uppercase tracking-wider">
                BIBLIOTEKA KRONIK WARHAMMER 40K
              </h3>
              <p className="text-[11px] text-neutral-400 font-reader">
                Wybierz gotową pozycję lub wgraj własną książkę (.EPUB, .TXT, .MD)
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
        <div className="p-4 sm:p-5 space-y-4">
          {/* Preset Books */}
          <div>
            <h4 className="text-[11px] font-cogitator uppercase tracking-wider text-amber-400 mb-2">
              Gotowe Wycinki Klasyków Black Library (Do Testów):
            </h4>
            <div className="space-y-2">
              {SAMPLE_WH40K_BOOKS.map((book) => {
                const isSelected = book.id === currentBookId;
                return (
                  <div
                    key={book.id}
                    onClick={() => {
                      onSelectBook(book);
                      onClose();
                    }}
                    className={`p-3 rounded border transition cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-600/70 text-amber-100'
                        : 'bg-neutral-900/60 border-neutral-800 hover:border-amber-700/50 hover:bg-neutral-900 text-neutral-300'
                    }`}
                  >
                    <div>
                      <div className="font-gothic font-bold text-xs sm:text-sm text-amber-200 group-hover:text-amber-100">
                        {book.title}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-reader italic">
                        Autor: {book.author} • {book.chapters.length} rozdział(y)
                      </div>
                    </div>

                    {isSelected && (
                      <span className="p-1 rounded bg-amber-900/80 text-amber-300">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upload or Create New */}
          <div className="pt-2 border-t border-neutral-800 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2.5 px-3 rounded bg-amber-950/40 hover:bg-amber-900/50 border border-amber-700/60 text-amber-200 text-xs font-gothic flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <Upload className="w-4 h-4" />
              <span>Wgraj plik książki (.EPUB / .TXT)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".epub,.txt,.md"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              onClick={() => setIsCreatingNew(!isCreatingNew)}
              className="py-2.5 px-3 rounded bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 text-neutral-300 text-xs font-gothic flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreatingNew ? 'Anuluj' : 'Nowa pusta kronika'}</span>
            </button>
          </div>

          {/* Create New Book Form */}
          {isCreatingNew && (
            <form onSubmit={handleCreateSubmit} className="p-3 rounded bg-neutral-900/90 border border-neutral-800 space-y-2.5 text-xs animate-in fade-in">
              <div>
                <label className="block text-[11px] font-cogitator text-neutral-400 mb-1">Tytuł książki / tomu *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="np. The Flight of the Eisenstein"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1.5 text-neutral-200 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-cogitator text-neutral-400 mb-1">Autor</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="np. James Swallow"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1.5 text-neutral-200 focus:border-amber-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-3 py-1 rounded bg-neutral-800 text-neutral-300"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-amber-700 hover:bg-amber-600 text-white font-gothic shadow"
                >
                  Utwórz kronikę
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-gothic text-xs cursor-pointer"
          >
            Zamknij
          </button>
        </div>

      </div>
    </div>
  );
};

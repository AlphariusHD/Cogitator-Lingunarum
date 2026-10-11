import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Trash2, 
  Scroll, 
  HelpCircle, 
  Download, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Edit2,
  Check
} from 'lucide-react';
import { GlossaryTerm, TermCategory, GrammarDeclension } from '../types/wh40k';
import { playCogitatorClick } from '../utils/audioEffects';
import { generateGrammarDeclension, WH40K_MORPH_PATTERNS } from '../utils/grammarMorphing';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  glossary: GlossaryTerm[];
  onAddTerm: (term: Omit<GlossaryTerm, 'id'>) => void;
  onDeleteTerm: (id: string) => void;
  onExplainTerm: (term: string) => void;
}

const CATEGORIES: ('Wszystkie' | TermCategory)[] = [
  'Wszystkie',
  'Formacje i Frakcje',
  'Stopnie i Tytuły',
  'Broń i Ekwipunek',
  'Pojazdy i Okręty',
  'Osnowa i Mistycyzm',
  'Eklezjarchia i Prawo',
  'Technologia i Maszyny',
  'Geografia i Światy',
];

/**
 * Intelligent helper suggesting regular Polish noun declension endings
 */
function suggestPolishDeclensions(baseWord: string): GrammarDeclension {
  const word = baseWord.trim();
  if (!word) return {};

  const lower = word.toLowerCase();

  // If ends in -arz / -erz (e.g. Aptekarz, Żołnierz)
  if (lower.endsWith('arz') || lower.endsWith('erz')) {
    return {
      mianownik: word,
      dopelniacz: `${word}a`,
      celownik: `${word}owi`,
      biernik: `${word}a`,
      narzednik: `${word}em`,
      miejscownik: `${word}u`,
      wolacz: `${word}u`,
      mnoga: `${word}e`,
    };
  }

  // If ends in -ik / -yk (e.g. Kronikarz, Psionik, Heretyk)
  if (lower.endsWith('ik') || lower.endsWith('yk')) {
    const stem = word.slice(0, -2);
    const suffix = lower.endsWith('ik') ? 'icy' : 'ycy';
    return {
      mianownik: word,
      dopelniacz: `${word}a`,
      celownik: `${word}owi`,
      biernik: `${word}a`,
      narzednik: `${word}iem`,
      miejscownik: `${word}u`,
      wolacz: `${word}u`,
      mnoga: `${stem}${suffix}`,
    };
  }

  // If ends in consonant (e.g. Drednot, Bolter, Komisarz, Serwitor)
  if (/[bcdfghjklmnprstvz]$/i.test(lower)) {
    return {
      mianownik: word,
      dopelniacz: `${word}a`,
      celownik: `${word}owi`,
      biernik: `${word}a`,
      narzednik: `${word}em`,
      miejscownik: `${word}e`,
      wolacz: `${word}e`,
      mnoga: `${word}y`,
    };
  }

  // If ends in -a (e.g. Osnowa, Pieczęć, Serwoczaszka, Prymarcha)
  if (lower.endsWith('a')) {
    const stem = word.slice(0, -1);
    return {
      mianownik: word,
      dopelniacz: `${stem}y`,
      celownik: `${stem}ie`,
      biernik: `${stem}ę`,
      narzednik: `${stem}ą`,
      miejscownik: `${stem}ie`,
      mnoga: `${stem}y`,
    };
  }

  return {
    mianownik: word,
    dopelniacz: `${word}a`,
    celownik: `${word}owi`,
    biernik: `${word}`,
    narzednik: `${word}em`,
    miejscownik: `${word}e`,
    mnoga: `${word}y`,
  };
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  glossary,
  onAddTerm,
  onDeleteTerm,
  onExplainTerm,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Wszystkie' | TermCategory>('Wszystkie');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeclensionInputs, setShowDeclensionInputs] = useState(false);

  // New term state
  const [newEnglish, setNewEnglish] = useState('');
  const [newPolish, setNewPolish] = useState('');
  const [newCategory, setNewCategory] = useState<TermCategory>('Broń i Ekwipunek');
  const [newNotes, setNewNotes] = useState('');
  const [newKeepOriginal, setNewKeepOriginal] = useState(false);

  // Declension fields
  const [declMianownik, setDeclMianownik] = useState('');
  const [declDopelniacz, setDeclDopelniacz] = useState('');
  const [declCelownik, setDeclCelownik] = useState('');
  const [declBiernik, setDeclBiernik] = useState('');
  const [declNarzednik, setDeclNarzednik] = useState('');
  const [declMiejscownik, setDeclMiejscownik] = useState('');
  const [declWolacz, setDeclWolacz] = useState('');
  const [declMnoga, setDeclMnoga] = useState('');

  if (!isOpen) return null;

  const filteredGlossary = glossary.filter(item => {
    const matchesSearch = 
      item.englishTerm.toLowerCase().includes(search.toLowerCase()) ||
      item.polishTerm.toLowerCase().includes(search.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(search.toLowerCase())) ||
      (item.declension && Object.values(item.declension).some(v => v?.toLowerCase().includes(search.toLowerCase())));

    const matchesCategory = 
      selectedCategory === 'Wszystkie' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAutoSuggest = (patternId?: string) => {
    if (!newPolish.trim()) return;
    playCogitatorClick();
    const suggested = generateGrammarDeclension(newPolish.trim(), patternId);
    setDeclMianownik(suggested.mianownik || newPolish.trim());
    setDeclDopelniacz(suggested.dopelniacz || '');
    setDeclCelownik(suggested.celownik || '');
    setDeclBiernik(suggested.biernik || '');
    setDeclNarzednik(suggested.narzednik || '');
    setDeclMiejscownik(suggested.miejscownik || '');
    setDeclWolacz(suggested.wolacz || '');
    setDeclMnoga(suggested.mnoga || '');
    setShowDeclensionInputs(true);
  };

  const handleCreateTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnglish.trim() || !newPolish.trim()) return;

    playCogitatorClick();

    const declension: GrammarDeclension | undefined = (
      declDopelniacz || declCelownik || declBiernik || declNarzednik || declMiejscownik || declWolacz || declMnoga
    ) ? {
      mianownik: declMianownik.trim() || newPolish.trim(),
      dopelniacz: declDopelniacz.trim() || undefined,
      celownik: declCelownik.trim() || undefined,
      biernik: declBiernik.trim() || undefined,
      narzednik: declNarzednik.trim() || undefined,
      miejscownik: declMiejscownik.trim() || undefined,
      wolacz: declWolacz.trim() || undefined,
      mnoga: declMnoga.trim() || undefined,
    } : undefined;

    onAddTerm({
      englishTerm: newEnglish.trim(),
      polishTerm: newPolish.trim(),
      category: newCategory,
      notes: newNotes.trim() || undefined,
      keepOriginal: newKeepOriginal,
      isCustom: true,
      declension,
    });

    setNewEnglish('');
    setNewPolish('');
    setNewNotes('');
    setDeclMianownik('');
    setDeclDopelniacz('');
    setDeclCelownik('');
    setDeclBiernik('');
    setDeclNarzednik('');
    setDeclMiejscownik('');
    setDeclWolacz('');
    setDeclMnoga('');
    setShowAddForm(false);
  };

  const exportGlossaryJSON = () => {
    playCogitatorClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(glossary, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `wh40k_glosariusz_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#101217] border border-theme-accent rounded-lg shadow-2xl shadow-black max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-neutral-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded border border-theme-accent bg-neutral-900 flex items-center justify-center text-theme-accent">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-gothic text-base sm:text-lg font-bold text-theme-accent flex items-center gap-2">
                SŁOWNIK ODMIAN GRAMATYCZNYCH (FLEKSJA WH40K)
              </h2>
              <p className="text-xs text-neutral-400 font-reader">
                Baza kanonicznych form deklinacyjnych (przypadków PL) dla terminów Warhammer 40,000.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportGlossaryJSON}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300 hover:text-theme-accent transition text-xs flex items-center gap-1 cursor-pointer"
              title="Eksportuj słownik do JSON"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline font-cogitator text-[11px]">Eksport JSON</span>
            </button>
            <button
              onClick={() => { playCogitatorClick(); onClose(); }}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 sm:p-4 border-b border-neutral-800 bg-neutral-950/80 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Szukaj terminu lub formy odmiany (np. Drednota, Kosmicznych Marines, Osnową)..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded pl-9 pr-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-theme-accent font-reader"
              />
            </div>

            <button
              onClick={() => { playCogitatorClick(); setShowAddForm(!showAddForm); }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-neutral-900 hover:bg-neutral-850 border border-theme-accent text-theme-accent text-xs font-gothic transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Ukryj formularz' : 'Dodaj hasło z odmianą'}</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { playCogitatorClick(); setSelectedCategory(cat); }}
                className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition cursor-pointer font-cogitator ${
                  selectedCategory === cat
                    ? 'bg-theme-accent-muted text-theme-accent border border-theme-accent font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Add Term Form with Fleksja / Declension */}
        {showAddForm && (
          <form onSubmit={handleCreateTerm} className="p-4 border-b border-neutral-800 bg-neutral-950/60 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-cogitator text-neutral-400 mb-1">Termin angielski *</label>
                <input
                  type="text"
                  required
                  value={newEnglish}
                  onChange={(e) => setNewEnglish(e.target.value)}
                  placeholder="np. Dreadnought"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-neutral-200 focus:border-theme-accent outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-cogitator text-neutral-400">Mianownik (PL) *</label>
                  {newPolish.trim() && (
                    <button
                      type="button"
                      onClick={() => handleAutoSuggest()}
                      className="text-[10px] font-cogitator text-theme-accent hover:brightness-125 flex items-center gap-0.5 cursor-pointer"
                      title="Automatycznie wygeneruj odmianę dla tego słowa"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Autouzupełnij</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={newPolish}
                  onChange={(e) => setNewPolish(e.target.value)}
                  placeholder="np. Drednot"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-neutral-200 focus:border-theme-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-cogitator text-neutral-400 mb-1">Kategoria</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as TermCategory)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-neutral-200 focus:border-theme-accent outline-none"
                >
                  {CATEGORIES.filter(c => c !== 'Wszystkie').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-cogitator text-neutral-400 mb-1">Notatki / Wytyczne</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="np. Zachowaj pisownię..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-neutral-200 focus:border-theme-accent outline-none"
                />
              </div>
            </div>

            {/* Declension Accordion */}
            <div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowDeclensionInputs(!showDeclensionInputs)}
                  className="text-[11px] font-cogitator text-theme-accent hover:brightness-125 flex items-center gap-1 cursor-pointer"
                >
                  {showDeclensionInputs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  <span>{showDeclensionInputs ? 'Zwiń przypadki deklinacji' : 'Zdefiniuj przypadki gramatyczne (M, D, C, B, N, Ms, W, Pl)'}</span>
                </button>

                {newPolish.trim() && !showDeclensionInputs && (
                  <button
                    type="button"
                    onClick={() => handleAutoSuggest()}
                    className="text-[10px] font-cogitator px-2 py-0.5 rounded bg-neutral-900 border border-theme-accent text-theme-accent hover:brightness-125 cursor-pointer"
                  >
                    Generuj formy fleksyjne ✨
                  </button>
                )}
              </div>

              {showDeclensionInputs && (
                <div className="mt-2 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-neutral-950/70 border border-neutral-800 rounded">
                    <span className="text-[10px] font-cogitator text-theme-accent mr-1">Wzorce morfingu:</span>
                    {Object.values(WH40K_MORPH_PATTERNS).map(pattern => (
                      <button
                        key={pattern.id}
                        type="button"
                        onClick={() => handleAutoSuggest(pattern.id)}
                        className="text-[10px] font-cogitator px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-theme-accent text-neutral-300 hover:text-white transition-colors cursor-pointer"
                        title={pattern.description}
                      >
                        {pattern.name}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded bg-black/50 border border-neutral-800">
                  <div>
                    <label className="block text-[10px] font-cogitator text-neutral-400 mb-0.5">Dopełniacz (D. Kogo? Czego?):</label>
                    <input
                      type="text"
                      value={declDopelniacz}
                      onChange={(e) => setDeclDopelniacz(e.target.value)}
                      placeholder="np. Drednota"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-cogitator text-neutral-400 mb-0.5">Celownik (C. Komu? Czemu?):</label>
                    <input
                      type="text"
                      value={declCelownik}
                      onChange={(e) => setDeclCelownik(e.target.value)}
                      placeholder="np. Drednotowi"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-cogitator text-neutral-400 mb-0.5">Biernik (B. Kogo? Co?):</label>
                    <input
                      type="text"
                      value={declBiernik}
                      onChange={(e) => setDeclBiernik(e.target.value)}
                      placeholder="np. Drednota"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-cogitator text-neutral-400 mb-0.5">Narzędnik (N. Z kim? Z czym?):</label>
                    <input
                      type="text"
                      value={declNarzednik}
                      onChange={(e) => setDeclNarzednik(e.target.value)}
                      placeholder="np. Drednotem"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-cogitator text-neutral-400 mb-0.5">Miejscownik (Ms. O kim? O czym?):</label>
                    <input
                      type="text"
                      value={declMiejscownik}
                      onChange={(e) => setDeclMiejscownik(e.target.value)}
                      placeholder="np. Drednocie"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-cogitator text-neutral-400 mb-0.5">Wołacz (W. O!):</label>
                    <input
                      type="text"
                      value={declWolacz}
                      onChange={(e) => setDeclWolacz(e.target.value)}
                      placeholder="np. Drednocie"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200"
                    />
                  </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-cogitator text-neutral-400 mb-0.5">L. Mnoga (Pl.):</label>
                      <input
                        type="text"
                        value={declMnoga}
                        onChange={(e) => setDeclMnoga(e.target.value)}
                        placeholder="np. Drednoty / Drednotów"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-400 text-xs">
                <input
                  type="checkbox"
                  checked={newKeepOriginal}
                  onChange={(e) => setNewKeepOriginal(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-900 text-theme-accent focus:ring-0"
                />
                <span>Pozostaw w oryginale (Wysoki Gotyk / High Gothic)</span>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition cursor-pointer"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-750 border border-theme-accent text-theme-accent font-gothic transition shadow cursor-pointer"
                >
                  Zapisz termin z odmianą
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Glossary Table / List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredGlossary.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-xs font-reader italic">
              Nie znaleziono haseł odpowiadających zapytaniu "{search}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {filteredGlossary.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded border border-neutral-800/80 bg-neutral-900/60 hover:border-theme-accent hover:bg-neutral-900 transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-gothic font-bold text-neutral-200 text-xs sm:text-sm">
                          {item.englishTerm}
                        </span>
                        <span className="text-neutral-500 text-xs font-cogitator">➔</span>
                        <span className="font-reader font-bold text-theme-accent text-xs sm:text-sm">
                          {item.polishTerm}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => { playCogitatorClick(); onExplainTerm(item.englishTerm); }}
                          className="p-1 text-neutral-400 hover:text-theme-accent transition cursor-pointer"
                          title="Zapytaj Archiwistę o kontekst fabularny"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                        {item.isCustom && (
                          <button
                            onClick={() => { playCogitatorClick(); onDeleteTerm(item.id); }}
                            className="p-1 text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                            title="Usuń własny termin"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 my-1.5">
                      <span className="text-[10px] font-cogitator px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300">
                        {item.category}
                      </span>
                      {item.keepOriginal && (
                        <span className="text-[10px] font-cogitator px-1.5 py-0.5 rounded bg-neutral-850 border border-theme-accent text-theme-accent">
                          High Gothic
                        </span>
                      )}
                      {item.isCustom && (
                        <span className="text-[10px] font-cogitator px-1.5 py-0.5 rounded bg-neutral-800 border border-cyan-500/50 text-cyan-300">
                          Własny
                        </span>
                      )}
                    </div>

                    {/* Declension details if present */}
                    {item.declension && (
                      <div className="text-[10px] font-cogitator text-neutral-400 bg-black/50 p-2 rounded border border-neutral-800/80 mt-1.5 space-y-0.5">
                        <div className="text-theme-accent font-bold">Odmiana (Fleksja):</div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                          {item.declension.dopelniacz && <div>D: <strong className="text-neutral-200">{item.declension.dopelniacz}</strong></div>}
                          {item.declension.celownik && <div>C: <strong className="text-neutral-200">{item.declension.celownik}</strong></div>}
                          {item.declension.biernik && <div>B: <strong className="text-neutral-200">{item.declension.biernik}</strong></div>}
                          {item.declension.narzednik && <div>N: <strong className="text-neutral-200">{item.declension.narzednik}</strong></div>}
                          {item.declension.miejscownik && <div>Ms: <strong className="text-neutral-200">{item.declension.miejscownik}</strong></div>}
                          {item.declension.mnoga && <div>Pl: <strong className="text-neutral-200">{item.declension.mnoga}</strong></div>}
                        </div>
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-[11px] text-neutral-400 font-reader italic mt-1">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950 text-xs text-neutral-400 flex items-center justify-between">
          <span className="font-cogitator text-[11px]">
            Wyświetlono {filteredGlossary.length} z {glossary.length} terminów
          </span>
          <button
            onClick={() => { playCogitatorClick(); onClose(); }}
            className="px-4 py-1.5 rounded bg-neutral-900 hover:bg-neutral-850 border border-theme-accent text-theme-accent font-gothic text-xs cursor-pointer"
          >
            Zamknij
          </button>
        </div>

      </div>
    </div>
  );
};

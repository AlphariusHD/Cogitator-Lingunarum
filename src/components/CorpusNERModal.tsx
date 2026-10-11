import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  ShieldAlert, 
  Check, 
  Plus, 
  BookOpen, 
  FileText, 
  Upload, 
  Download, 
  Users, 
  Compass, 
  Anchor, 
  Shield, 
  Crosshair, 
  CheckCircle2, 
  Loader2,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { 
  BookProject, 
  ExtractedEntity, 
  NEREntityType, 
  GlossaryTerm 
} from '../types/wh40k';
import { playCogitatorClick, playOmnissiahChime } from '../utils/audioEffects';
import { convertEntityToGlossaryTerm } from '../utils/corpusNER';
import { parseEpubFile } from '../utils/epubParser';

interface CorpusNERModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBook: BookProject;
  existingGlossary: GlossaryTerm[];
  onAddTermsToGlossary: (terms: GlossaryTerm[]) => void;
}

export const CorpusNERModal: React.FC<CorpusNERModalProps> = ({
  isOpen,
  onClose,
  activeBook,
  existingGlossary,
  onAddTermsToGlossary,
}) => {
  const [activeCategory, setActiveCategory] = useState<NEREntityType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSummary, setAnalysisSummary] = useState<string>('');
  const [extractedEntities, setExtractedEntities] = useState<ExtractedEntity[]>([]);
  const [selectedEntityIds, setSelectedEntityIds] = useState<Set<string>>(new Set());
  const [expandedSnippets, setExpandedSnippets] = useState<Set<string>>(new Set());
  const [addedEntityIds, setAddedEntityIds] = useState<Set<string>>(new Set());
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedText, setUploadedText] = useState<string | null>(null);

  if (!isOpen) return null;

  // Combine full book text or uploaded text
  const fullBookText = useMemo(() => {
    if (uploadedText) return uploadedText;
    return activeBook.chapters.map(c => `=== ${c.title} ===\n${c.sourceText}`).join('\n\n');
  }, [activeBook, uploadedText]);

  const totalWords = useMemo(() => {
    return fullBookText.trim() ? fullBookText.trim().split(/\s+/).length : 0;
  }, [fullBookText]);

  // Handle file upload (EPUB / TXT / MD)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playCogitatorClick();
    setUploadedFileName(file.name);

    if (file.name.toLowerCase().endsWith('.epub')) {
      try {
        const parsed = await parseEpubFile(file);
        const combined = parsed.chapters.map(c => `=== ${c.title} ===\n${c.sourceText}`).join('\n\n');
        setUploadedText(combined);
      } catch (err: any) {
        alert('Błąd wczytywania EPUB: ' + err.message);
      }
    } else {
      const text = await file.text();
      setUploadedText(text);
    }
  };

  // Run the Deep NER Corpus Scan via API
  const handleStartAnalysis = async () => {
    if (!fullBookText.trim()) return;

    setIsAnalyzing(true);
    playCogitatorClick();

    try {
      const response = await fetch('/api/corpus-ner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: fullBookText,
          existingGlossaryTerms: existingGlossary.map(g => g.englishTerm),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Błąd analizy');
      }

      const data = await response.json();
      setAnalysisSummary(data.summary || '');

      // Check which entities already exist in glossary
      const knownLower = new Set(existingGlossary.map(g => g.englishTerm.toLowerCase()));

      const processed: ExtractedEntity[] = (data.entities || []).map((ent: any, idx: number) => {
        const inGlossary = knownLower.has(ent.name.toLowerCase());
        return {
          id: `entity_${idx}_${Date.now()}`,
          name: ent.name,
          category: ent.category || 'character',
          occurrences: ent.occurrences || 1,
          contextSnippets: ent.contextSnippets || [],
          suggestedPolish: ent.suggestedPolish || ent.name,
          keepOriginal: ent.keepOriginal ?? false,
          inGlossary,
          notes: ent.notes || '',
        };
      });

      setExtractedEntities(processed);
      // Select new entities by default
      const newIds = new Set(processed.filter(e => !e.inGlossary).map(e => e.id));
      setSelectedEntityIds(newIds);
      playOmnissiahChime();
    } catch (err: any) {
      alert('Nie udało się przeprowadzić analizy korpusowej: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedEntityIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Toggle select all visible
  const handleSelectAllVisible = () => {
    const visibleIds = filteredEntities.map(e => e.id);
    const allSelected = visibleIds.every(id => selectedEntityIds.has(id));
    setSelectedEntityIds(prev => {
      const next = new Set(prev);
      if (allSelected) {
        visibleIds.forEach(id => next.delete(id));
      } else {
        visibleIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  // Toggle snippet view
  const handleToggleSnippet = (id: string) => {
    setExpandedSnippets(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Update entity inline
  const handleUpdateEntityPolish = (id: string, newPolish: string) => {
    setExtractedEntities(prev => prev.map(e => e.id === id ? { ...e, suggestedPolish: newPolish } : e));
  };

  const handleToggleKeepOriginal = (id: string) => {
    setExtractedEntities(prev => prev.map(e => e.id === id ? { ...e, keepOriginal: !e.keepOriginal } : e));
  };

  // Add single entity to glossary
  const handleAddSingleToGlossary = (entity: ExtractedEntity) => {
    playCogitatorClick();
    const term = convertEntityToGlossaryTerm(entity);
    onAddTermsToGlossary([term]);
    setAddedEntityIds(prev => new Set(prev).add(entity.id));
  };

  // Bulk add selected to glossary
  const handleBulkAddSelected = () => {
    playOmnissiahChime();
    const toAdd = extractedEntities
      .filter(e => selectedEntityIds.has(e.id))
      .map(convertEntityToGlossaryTerm);

    if (toAdd.length === 0) return;

    onAddTermsToGlossary(toAdd);
    const newAdded = new Set(addedEntityIds);
    selectedEntityIds.forEach(id => newAdded.add(id));
    setAddedEntityIds(newAdded);
    setSelectedEntityIds(new Set());
  };

  // Export entities to CSV / JSON
  const handleExportEntitiesJSON = () => {
    playCogitatorClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(extractedEntities, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `korpus_ner_${activeBook.title.replace(/\s+/g, '_')}.json`);
    dlAnchor.click();
  };

  // Filtered entities
  const filteredEntities = useMemo(() => {
    return extractedEntities.filter(e => {
      const matchesCat = activeCategory === 'ALL' || e.category === activeCategory;
      const matchesSearch = !searchQuery.trim() || 
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.suggestedPolish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [extractedEntities, activeCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: extractedEntities.length,
      character: 0,
      warship: 0,
      formation: 0,
      location: 0,
      artifact: 0,
    };
    extractedEntities.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, [extractedEntities]);

  const getCategoryBadge = (cat: NEREntityType) => {
    switch (cat) {
      case 'character':
        return { label: 'Bohater / Tytuł', color: 'bg-amber-950/80 text-amber-300 border-amber-700/60', icon: Users };
      case 'warship':
        return { label: 'Okręt / Flota', color: 'bg-blue-950/80 text-blue-300 border-blue-700/60', icon: Anchor };
      case 'formation':
        return { label: 'Formacja / Zakon', color: 'bg-purple-950/80 text-purple-300 border-purple-700/60', icon: Shield };
      case 'location':
        return { label: 'Świat / Lokacja', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60', icon: Compass };
      case 'artifact':
        return { label: 'Relikt / Artefakt', color: 'bg-red-950/80 text-red-300 border-red-700/60', icon: Crosshair };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#0b0e14] border border-theme-accent rounded-lg shadow-2xl overflow-hidden text-neutral-200">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-950/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-theme-accent/15 border border-theme-accent/40 text-theme-accent">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-gothic font-bold text-neutral-100 flex items-center gap-2">
                <span>MASOWA ANALIZA KORPUSOWA & NER</span>
                <span className="text-xs font-cogitator text-theme-accent px-2 py-0.5 rounded border border-theme-accent/50 bg-theme-accent/10">
                  CORPUS INGESTION ENGINE
                </span>
              </h2>
              <p className="text-xs text-neutral-400 font-reader">
                Automatyczna ekstrakcja nienazwanych bytów (Bohaterowie, Okręty, Formacje, Światy, Relikty) przed tłumaczeniem
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playCogitatorClick();
              onClose();
            }}
            className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source selector & Launch Bar */}
        <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-950 border border-neutral-800 font-cogitator text-neutral-300">
              <BookOpen className="w-3.5 h-3.5 text-theme-accent" />
              <span>Źródło: </span>
              <span className="text-white font-bold">{uploadedFileName || activeBook.title}</span>
              <span className="text-neutral-500">({totalWords.toLocaleString()} słów)</span>
            </div>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 text-neutral-200 cursor-pointer font-cogitator text-xs transition">
              <Upload className="w-3.5 h-3.5 text-theme-accent" />
              <span>{uploadedFileName ? 'Zmień plik EPUB/TXT' : 'Wgraj inny EPUB/TXT'}</span>
              <input
                type="file"
                accept=".epub,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-theme-accent to-emerald-700 hover:brightness-110 text-white font-gothic font-bold text-xs shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>KOGITATOR SKANUJE KORPUS...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>URUCHOM PEŁNY SKAN NER ({extractedEntities.length > 0 ? 'PONÓW' : 'START'})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Corpus Analysis Summary (if present) */}
        {analysisSummary && (
          <div className="px-5 py-2.5 bg-neutral-950/80 border-b border-neutral-800 text-xs text-neutral-300 font-reader flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-theme-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-theme-accent font-cogitator uppercase tracking-wide mr-1">
                Raport Ingestii Archiwum:
              </span>
              <span>{analysisSummary}</span>
            </div>
          </div>
        )}

        {/* Category Tabs & Filter Toolbar */}
        {extractedEntities.length > 0 && (
          <div className="p-3 border-b border-neutral-800 bg-neutral-950 flex flex-wrap items-center justify-between gap-3">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'ALL', label: 'Wszystkie', icon: Sparkles },
                { id: 'character', label: 'Bohaterowie & Tytuły', icon: Users },
                { id: 'warship', label: 'Okręty Bojowe', icon: Anchor },
                { id: 'formation', label: 'Formacje & Zakony', icon: Shield },
                { id: 'location', label: 'Planety & Światy', icon: Compass },
                { id: 'artifact', label: 'Relikty & Artefakty', icon: Crosshair },
              ].map(tab => {
                const Icon = tab.icon;
                const count = categoryCounts[tab.id] || 0;
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playCogitatorClick();
                      setActiveCategory(tab.id as any);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-cogitator transition cursor-pointer ${
                      isActive 
                        ? 'bg-theme-accent/20 border border-theme-accent text-white font-bold' 
                        : 'bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{tab.label}</span>
                    <span className="text-[10px] px-1 py-0.2 rounded bg-neutral-800 text-neutral-300">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Filtruj byty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-neutral-900 border border-neutral-700 rounded text-xs pl-8 pr-3 py-1.5 text-neutral-200 placeholder-neutral-500 outline-none focus:border-theme-accent w-40 sm:w-52"
                />
              </div>

              {selectedEntityIds.size > 0 && (
                <button
                  onClick={handleBulkAddSelected}
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-gothic text-xs font-bold transition cursor-pointer shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>DODAJ ZAZNACZONE ({selectedEntityIds.size})</span>
                </button>
              )}

              <button
                onClick={handleExportEntitiesJSON}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 font-cogitator text-xs transition cursor-pointer"
                title="Eksportuj do JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">JSON</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-reader">
          {isAnalyzing ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-theme-accent/20 animate-ping" />
                <div className="w-16 h-16 rounded-full border-2 border-theme-accent border-t-transparent animate-spin flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-theme-accent animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="font-gothic text-lg text-theme-accent font-bold">
                  SKANOWANIE KORPUSOWE W TOKU...
                </h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto mt-1">
                  Cogitator analizuje setki stron tekstu źródłowego, identyfikując bohaterów, formacje wojskowe, nazwane okręty oraz starożytne artefakty, by zharmonizować 100% terminologii.
                </p>
              </div>
            </div>
          ) : extractedEntities.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-theme-accent">
                <Sparkles className="w-7 h-7 opacity-70" />
              </div>
              <h3 className="font-gothic text-base text-neutral-200">
                Gotowy do ekstrakcji bytów z książki
              </h3>
              <p className="text-xs text-neutral-400 max-w-lg mx-auto">
                Kliknij przycisk <span className="text-theme-accent font-bold">URUCHOM PEŁNY SKAN NER</span> powyżej. Cogitator przeskanuje całą zawartość książki i wyświetli wszystkie kluczowe byty, które wymagają uzgodnienia przed tłumaczeniem pierwszego słowa.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table header bar */}
              <div className="flex items-center justify-between text-[11px] font-cogitator text-neutral-400 px-3 py-1 bg-neutral-950/60 rounded border border-neutral-900">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSelectAllVisible}
                    className="hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 border border-neutral-600 rounded flex items-center justify-center text-[9px]">
                      {filteredEntities.length > 0 && filteredEntities.every(e => selectedEntityIds.has(e.id)) ? '✓' : ''}
                    </span>
                    <span>Zaznacz widoczne ({filteredEntities.length})</span>
                  </button>
                </div>
                <div>Status w Glosariuszu i Rekomendacja</div>
              </div>

              {/* Entity Cards */}
              {filteredEntities.map((entity) => {
                const isSelected = selectedEntityIds.has(entity.id);
                const isAdded = addedEntityIds.has(entity.id) || entity.inGlossary;
                const isExpanded = expandedSnippets.has(entity.id);
                const badge = getCategoryBadge(entity.category);
                const BadgeIcon = badge.icon;

                return (
                  <div
                    key={entity.id}
                    className={`p-3 rounded border transition ${
                      isAdded
                        ? 'bg-neutral-950/40 border-neutral-800/60'
                        : isSelected
                        ? 'bg-neutral-900/90 border-theme-accent/70 shadow-sm'
                        : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      {/* Left: Checkbox + Name + Category */}
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(entity.id)}
                          disabled={isAdded}
                          aria-label={`Wybierz byt ${entity.name}`}
                          className="mt-1 sm:mt-0 rounded border-neutral-700 bg-neutral-900 text-theme-accent focus:ring-0 cursor-pointer disabled:opacity-40"
                        />

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-gothic font-bold text-sm text-neutral-100">
                              {entity.name}
                            </span>
                            <span className={`text-[10px] font-cogitator px-2 py-0.2 rounded border flex items-center gap-1 ${badge.color}`}>
                              <BadgeIcon className="w-2.5 h-2.5" />
                              <span>{badge.label}</span>
                            </span>
                            {entity.occurrences > 1 && (
                              <span className="text-[10px] font-cogitator bg-neutral-800 text-neutral-300 px-1.5 py-0.2 rounded">
                                {entity.occurrences}x w tekście
                              </span>
                            )}
                          </div>

                          {entity.notes && (
                            <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                              {entity.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Polish translation edit & Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {/* Inline translation input */}
                        <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded px-2 py-1">
                          <span className="text-[10px] font-cogitator text-neutral-500">PL:</span>
                          <input
                            type="text"
                            value={entity.suggestedPolish}
                            onChange={(e) => handleUpdateEntityPolish(entity.id, e.target.value)}
                            disabled={isAdded}
                            className="bg-transparent text-xs text-white outline-none w-36 sm:w-48 font-reader"
                          />
                        </div>

                        {/* Keep original toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleKeepOriginal(entity.id)}
                          disabled={isAdded}
                          className={`text-[10px] font-cogitator px-2 py-1 rounded border transition cursor-pointer ${
                            entity.keepOriginal
                              ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                          title="Zostaw angielską nazwę bez tłumaczenia (np. dla okrętów)"
                        >
                          {entity.keepOriginal ? 'ORYG. EN' : 'TŁUMACZ'}
                        </button>

                        {/* Add to glossary button */}
                        {isAdded ? (
                          <span className="flex items-center gap-1 text-[11px] font-cogitator text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>W GLOSARIUSZU</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAddSingleToGlossary(entity)}
                            className="flex items-center gap-1 text-[11px] font-gothic font-bold px-2.5 py-1 rounded bg-theme-accent/20 hover:bg-theme-accent/30 border border-theme-accent text-theme-accent transition cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>DODAJ</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Context snippet expander */}
                    {entity.contextSnippets && entity.contextSnippets.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-neutral-900 text-xs">
                        <button
                          onClick={() => handleToggleSnippet(entity.id)}
                          className="flex items-center gap-1 text-[10px] font-cogitator text-neutral-500 hover:text-neutral-300 transition cursor-pointer"
                        >
                          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          <span>Kontekst w książce ({entity.contextSnippets.length} cytatów)</span>
                        </button>

                        {isExpanded && (
                          <div className="mt-1.5 pl-3 border-l-2 border-theme-accent/40 space-y-1 bg-black/40 p-2 rounded">
                            {entity.contextSnippets.map((snip, i) => (
                              <p key={i} className="text-[11px] text-neutral-300 italic">
                                "{snip}"
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-2.5 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs text-neutral-400 font-cogitator">
          <div className="flex items-center gap-2">
            <span>Bytów: <strong className="text-white">{extractedEntities.length}</strong></span>
            <span>•</span>
            <span>Do uzgodnienia: <strong className="text-theme-accent">{extractedEntities.filter(e => !e.inGlossary && !addedEntityIds.has(e.id)).length}</strong></span>
          </div>

          <button
            onClick={() => {
              playCogitatorClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 transition cursor-pointer"
          >
            Zamknij panel NER
          </button>
        </div>

      </div>
    </div>
  );
};

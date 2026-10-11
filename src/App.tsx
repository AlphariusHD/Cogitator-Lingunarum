import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChapterSidebar } from './components/ChapterSidebar';
import { TranslationWorkbench } from './components/TranslationWorkbench';
import { GlossaryModal } from './components/GlossaryModal';
import { AuditReportModal } from './components/AuditReportModal';
import { BookSelectorModal } from './components/BookSelectorModal';
import { ExplainTermModal } from './components/ExplainTermModal';
import { ExportModal } from './components/ExportModal';
import { ChapterDetectorModal } from './components/ChapterDetectorModal';
import { OFFICIAL_WH40K_GLOSSARY } from './data/wh40kGlossary';
import { SAMPLE_WH40K_BOOKS } from './data/sampleBooks';
import { 
  BookProject, 
  BookChapter, 
  GlossaryTerm, 
  TranslationProfile, 
  FactionTheme,
  DetectedTermMatch,
  UserRole,
  ChapterReviewStatus,
  ReviewComment
} from './types/wh40k';
import { parseEpubFile, splitTextIntoChunks } from './utils/epubParser';
import { cleanTranslationArtifacts, detectChaptersFromText } from './utils/chapterDetector';
import { isSoundEnabled, setSoundEnabled, playOmnissiahChime } from './utils/audioEffects';
import { buildGrammarMorphingPrompt } from './utils/grammarMorphing';
import { CorpusNERModal } from './components/CorpusNERModal';
import { DesktopAppModal } from './components/DesktopAppModal';
import { FactionBackgroundOverlay } from './components/FactionBackgroundOverlay';
import { FactionThemeModal } from './components/FactionThemeModal';

const STORAGE_KEY_BOOKS = 'wh40k_books_store_v1';
const STORAGE_KEY_CUSTOM_GLOSSARY = 'wh40k_custom_glossary_v1';
const STORAGE_KEY_ACTIVE_BOOK_ID = 'wh40k_active_book_id_v1';
const STORAGE_KEY_THEME = 'wh40k_faction_theme_v1';
const STORAGE_KEY_USER_ROLE = 'wh40k_user_role_v1';
const STORAGE_KEY_BG_BLACK_TEMPLARS = 'wh40k_bg_black_templars_v1';
const STORAGE_KEY_BG_MECHANICUS = 'wh40k_bg_mechanicus_v1';
const STORAGE_KEY_BG_OPACITY = 'wh40k_bg_opacity_v1';
const STORAGE_KEY_FRAME_ENABLED = 'wh40k_frame_enabled_v1';


export default function App() {
  // Books list (sanitized from any escaped artifacts on load)
  const [books, setBooks] = useState<BookProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((b: BookProject) => ({
          ...b,
          chapters: b.chapters.map(c => ({
            ...c,
            translatedText: cleanTranslationArtifacts(c.translatedText || ''),
            sourceText: cleanTranslationArtifacts(c.sourceText || ''),
          }))
        }));
      }
    } catch (e) {
      console.error('Error loading saved books:', e);
    }
    return SAMPLE_WH40K_BOOKS.map(b => ({
      ...b,
      chapters: b.chapters.map(c => ({
        ...c,
        translatedText: cleanTranslationArtifacts(c.translatedText || ''),
        sourceText: cleanTranslationArtifacts(c.sourceText || ''),
      }))
    }));
  });

  // Active book ID
  const [activeBookId, setActiveBookId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_BOOK_ID);
      if (saved && books.some(b => b.id === saved)) return saved;
    } catch (e) {}
    return books[0]?.id || SAMPLE_WH40K_BOOKS[0].id;
  });

  // Custom glossary
  const [customGlossary, setCustomGlossary] = useState<GlossaryTerm[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_GLOSSARY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Global translation profile
  const [profile, setProfile] = useState<TranslationProfile>('OFFICIAL_PL');

  // Faction Theme (Feature 1)
  const [theme, setTheme] = useState<FactionTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved && ['ALPHA_LEGION', 'BLACK_TEMPLARS', 'MECHANICUS', 'IMPERIAL_GOTHIC'].includes(saved)) {
        return saved as FactionTheme;
      }
    } catch {}
    return 'ALPHA_LEGION'; // Default Alpha Legion matching requested cogitator art
  });

  // Sound effects toggle
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => isSoundEnabled());

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabledState(next);
    setSoundEnabled(next);
  };

  // Multi-Role Collaboration (Feature 2: Scribe vs Inquisitor)
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER_ROLE);
      if (saved === 'SCRIBE' || saved === 'INQUISITOR') return saved;
    } catch {}
    return 'SCRIBE';
  });

  // Modal visibility states
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isBookSelectorOpen, setIsBookSelectorOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isChapterDetectorOpen, setIsChapterDetectorOpen] = useState(false);
  const [isCorpusNEROpen, setIsCorpusNEROpen] = useState(false);
  const [isDesktopAppOpen, setIsDesktopAppOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Faction Background Wallpaper & Theme Customizer State (Black Templars & Mechanicus)
  const [customBlackTemplarsBg, setCustomBlackTemplarsBg] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_BG_BLACK_TEMPLARS);
    } catch {}
    return null;
  });
  const [customMechanicusBg, setCustomMechanicusBg] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_BG_MECHANICUS);
    } catch {}
    return null;
  });
  const [bgOpacity, setBgOpacity] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BG_OPACITY);
      if (saved) return parseFloat(saved);
    } catch {}
    return 0.75;
  });
  const [frameEnabled, setFrameEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FRAME_ENABLED);
      if (saved !== null) return saved === 'true';
    } catch {}
    return true;
  });

  const [detectorText, setDetectorText] = useState('');
  const [detectorFileName, setDetectorFileName] = useState('');

  // Translation execution state
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState<{ currentChunk: number; totalChunks: number } | null>(null);

  // Audit state
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  // Explain term state
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainData, setExplainData] = useState<any>(null);
  const [explainError, setExplainError] = useState<string | null>(null);

  // Persist books
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
    } catch (e) {
      console.warn('Unable to persist books to localStorage:', e);
    }
  }, [books]);

  // Persist custom glossary
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_GLOSSARY, JSON.stringify(customGlossary));
    } catch (e) {}
  }, [customGlossary]);

  // Persist active book ID
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_BOOK_ID, activeBookId);
    } catch (e) {}
  }, [activeBookId]);

  // Persist theme
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch (e) {}
  }, [theme]);

  // Persist user role
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER_ROLE, userRole);
    } catch (e) {}
  }, [userRole]);

  // Faction Background Wallpaper Handlers (Black Templars & Mechanicus)
  const handleUpdateCustomBg = (faction: 'BLACK_TEMPLARS' | 'MECHANICUS', dataUrl: string | null) => {
    if (faction === 'BLACK_TEMPLARS') {
      setCustomBlackTemplarsBg(dataUrl);
      try {
        if (dataUrl) localStorage.setItem(STORAGE_KEY_BG_BLACK_TEMPLARS, dataUrl);
        else localStorage.removeItem(STORAGE_KEY_BG_BLACK_TEMPLARS);
      } catch {}
    } else {
      setCustomMechanicusBg(dataUrl);
      try {
        if (dataUrl) localStorage.setItem(STORAGE_KEY_BG_MECHANICUS, dataUrl);
        else localStorage.removeItem(STORAGE_KEY_BG_MECHANICUS);
      } catch {}
    }
  };

  const handleChangeBgOpacity = (val: number) => {
    setBgOpacity(val);
    try {
      localStorage.setItem(STORAGE_KEY_BG_OPACITY, val.toString());
    } catch {}
  };

  const handleToggleFrame = (val: boolean) => {
    setFrameEnabled(val);
    try {
      localStorage.setItem(STORAGE_KEY_FRAME_ENABLED, val ? 'true' : 'false');
    } catch {}
  };

  // Two-Translator Collaboration Handlers (Feature 2)
  const handleUpdateChapterStatus = (newStatus: ChapterReviewStatus, notes?: string) => {
    const now = new Date().toLocaleString('pl-PL');
    setBooks(prev => prev.map(book => {
      if (book.id === activeBook.id) {
        return {
          ...book,
          chapters: book.chapters.map(ch => {
            if (ch.id === activeChapter.id) {
              return {
                ...ch,
                reviewStatus: newStatus,
                imprimaturDate: newStatus === 'IMPRIMATUR' ? now : ch.imprimaturDate,
                imprimaturBy: newStatus === 'IMPRIMATUR' ? 'Inkwizytor Cenzor (Ordo Scriptorum)' : ch.imprimaturBy,
              };
            }
            return ch;
          })
        };
      }
      return book;
    }));
  };

  const handleAddComment = (commentData: Omit<ReviewComment, 'id' | 'timestamp' | 'status'>) => {
    const newComment: ReviewComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
      status: 'open',
      ...commentData,
    };
    setBooks(prev => prev.map(book => {
      if (book.id === activeBook.id) {
        return {
          ...book,
          chapters: book.chapters.map(ch => {
            if (ch.id === activeChapter.id) {
              return {
                ...ch,
                reviewComments: [...(ch.reviewComments || []), newComment],
              };
            }
            return ch;
          })
        };
      }
      return book;
    }));
  };

  const handleResolveComment = (commentId: string) => {
    setBooks(prev => prev.map(book => {
      if (book.id === activeBook.id) {
        return {
          ...book,
          chapters: book.chapters.map(ch => {
            if (ch.id === activeChapter.id) {
              return {
                ...ch,
                reviewComments: (ch.reviewComments || []).map(c => c.id === commentId ? { ...c, status: 'resolved' as const } : c),
              };
            }
            return ch;
          })
        };
      }
      return book;
    }));
  };

  const handleApplySuggestedFix = (targetSnippet: string, fixText: string, commentId: string) => {
    if (!fixText) return;
    handleSaveSnapshot();
    setBooks(prev => prev.map(book => {
      if (book.id === activeBook.id) {
        return {
          ...book,
          chapters: book.chapters.map(ch => {
            if (ch.id === activeChapter.id) {
              let updatedText = ch.translatedText;
              if (targetSnippet && updatedText.includes(targetSnippet)) {
                updatedText = updatedText.replace(targetSnippet, fixText);
              } else if (targetSnippet) {
                try {
                  updatedText = updatedText.replace(new RegExp(targetSnippet, 'gi'), fixText);
                } catch {
                  updatedText = updatedText.replace(targetSnippet, fixText);
                }
              }
              const updatedComments = (ch.reviewComments || []).map(c => c.id === commentId ? { ...c, status: 'resolved' as const } : c);
              return {
                ...ch,
                translatedText: updatedText,
                reviewComments: updatedComments,
              };
            }
            return ch;
          })
        };
      }
      return book;
    }));
  };

  const handleDeleteComment = (commentId: string) => {
    setBooks(prev => prev.map(book => {
      if (book.id === activeBook.id) {
        return {
          ...book,
          chapters: book.chapters.map(ch => {
            if (ch.id === activeChapter.id) {
              return {
                ...ch,
                reviewComments: (ch.reviewComments || []).filter(c => c.id !== commentId),
              };
            }
            return ch;
          })
        };
      }
      return book;
    }));
  };

  // Bulk Add Terms from Corpus NER (Feature 1)
  const handleAddTermsFromNER = (newTerms: GlossaryTerm[]) => {
    setCustomGlossary(prev => {
      const existing = new Set(prev.map(t => t.englishTerm.toLowerCase()));
      const filtered = newTerms.filter(t => !existing.has(t.englishTerm.toLowerCase()));
      return [...prev, ...filtered];
    });
  };

  const activeBook = books.find(b => b.id === activeBookId) || books[0] || SAMPLE_WH40K_BOOKS[0];
  const activeChapter = activeBook.chapters.find(c => c.id === activeBook.activeChapterId) || activeBook.chapters[0];

  // Combined glossary
  const fullGlossary = [...OFFICIAL_WH40K_GLOSSARY, ...customGlossary];

  // Select Chapter
  const handleSelectChapter = (chapterId: string) => {
    setBooks(prev => prev.map(book => {
      if (book.id === activeBook.id) {
        return { ...book, activeChapterId: chapterId };
      }
      return book;
    }));
  };

  // Update Source Text
  const handleUpdateSource = (newText: string) => {
    const wordCount = newText.trim() ? newText.trim().split(/\s+/).length : 0;
    setBooks(prev => prev.map(book => {
      if (book.id === activeBook.id) {
        return {
          ...book,
          chapters: book.chapters.map(ch => {
            if (ch.id === activeChapter.id) {
              return { ...ch, sourceText: newText, wordCountSource: wordCount };
            }
            return ch;
          })
        };
      }
      return book;
    }));
  };

  // Update Translated Text
  const handleUpdateTranslation = (newText: string) => {
    const wordCount = newText.trim() ? newText.trim().split(/\s+/).length : 0;
    setBooks(prev => prev.map(book => {
      if (book.id === activeBook.id) {
        return {
          ...book,
          chapters: book.chapters.map(ch => {
            if (ch.id === activeChapter.id) {
              return { ...ch, translatedText: newText, wordCountTranslated: wordCount };
            }
            return ch;
          })
        };
      }
      return book;
    }));
  };

  // Save snapshot manually or before major changes (Feature 5)
  const handleSaveSnapshot = () => {
    if (!activeChapter.translatedText) return;
    setBooks(prev => prev.map(b => b.id === activeBook.id ? {
      ...b,
      chapters: b.chapters.map(c => c.id === activeChapter.id ? {
        ...c,
        previousTranslationSnapshot: c.translatedText,
      } : c)
    } : b));
  };

  // Revert to snapshot (Feature 5)
  const handleRevertSnapshot = () => {
    if (!activeChapter.previousTranslationSnapshot) return;
    handleUpdateTranslation(activeChapter.previousTranslationSnapshot);
  };

  // Translate Chapter (Sequential chunking)
  const handleTranslateChapter = async () => {
    if (!activeChapter.sourceText.trim() || isTranslating) return;

    // Save previous translation into snapshot before translating again
    if (activeChapter.translatedText) {
      handleSaveSnapshot();
    }

    setIsTranslating(true);
    const chunks = splitTextIntoChunks(activeChapter.sourceText, 450);
    setTranslationProgress({ currentChunk: 1, totalChunks: chunks.length });

    // Mark chapter as translating
    setBooks(prev => prev.map(b => b.id === activeBook.id ? {
      ...b,
      chapters: b.chapters.map(c => c.id === activeChapter.id ? { ...c, status: 'translating', errorMessage: undefined } : c)
    } : b));

    const translatedParts: string[] = [];
    const detectedTermsMap = new Map<string, DetectedTermMatch>();

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Brak połączenia z Internetem. Tłumaczenie automatyczne AI wymaga sieci, jednak cała reszta warsztatu (edycja ręczna, słownik lore, import oraz eksport do EPUB/PDF) działa w 100% offline.');
      }

      let previousContext = '';

      for (let i = 0; i < chunks.length; i++) {
        setTranslationProgress({ currentChunk: i + 1, totalChunks: chunks.length });
        const currentChunk = chunks[i];

        const grammarMorphingPrompt = buildGrammarMorphingPrompt(customGlossary, currentChunk);

        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: currentChunk,
            profile,
            customGlossary,
            grammarMorphingPrompt,
            contextBefore: previousContext,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Błąd serwera (status ${response.status})`);
        }

        const data = await response.json();
        const translationChunk = cleanTranslationArtifacts(data.translation || '');
        translatedParts.push(translationChunk);

        // Keep last paragraph as context for next chunk
        const lines = translationChunk.trim().split('\n');
        previousContext = lines[lines.length - 1] || '';

        // Collect detected terms
        if (Array.isArray(data.detectedTerms)) {
          for (const item of data.detectedTerms) {
            if (item.original) {
              detectedTermsMap.set(item.original.toLowerCase(), item);
            }
          }
        }
      }

      const finalTranslation = cleanTranslationArtifacts(translatedParts.join('\n\n'));
      const finalWordCount = finalTranslation.trim().split(/\s+/).length;
      const detectedTermsArray = Array.from(detectedTermsMap.values());

      setBooks(prev => prev.map(b => b.id === activeBook.id ? {
        ...b,
        chapters: b.chapters.map(c => c.id === activeChapter.id ? {
          ...c,
          status: 'completed',
          previousTranslationSnapshot: c.translatedText || undefined,
          translatedText: finalTranslation,
          wordCountTranslated: finalWordCount,
          detectedTerms: detectedTermsArray,
          lastTranslatedAt: new Date().toISOString()
        } : c)
      } : b));

      // Play Omnissiah completion chime
      playOmnissiahChime();

    } catch (err: any) {
      console.error('Translation failed:', err);
      const isOfflineError = (typeof navigator !== 'undefined' && !navigator.onLine) || 
        err.message?.includes('Failed to fetch') || 
        err.message?.includes('NetworkError') ||
        err.message?.includes('Internetem');
      const errorMsg = isOfflineError 
        ? 'Brak połączenia z Internetem. Tłumaczenie automatyczne AI wymaga sieci, jednak cała reszta warsztatu (edycja ręczna, wbudowany słownik lore oraz eksport EPUB/PDF) działa w 100% offline.' 
        : err.message;
      setBooks(prev => prev.map(b => b.id === activeBook.id ? {
        ...b,
        chapters: b.chapters.map(c => c.id === activeChapter.id ? {
          ...c,
          status: 'error',
          errorMessage: errorMsg
        } : c)
      } : b));
      alert(errorMsg);
    } finally {
      setIsTranslating(false);
      setTranslationProgress(null);
    }
  };

  // Run Lore Audit
  const handleRunAudit = async () => {
    if (!activeChapter.translatedText.trim()) return;

    setIsAuditing(true);
    setIsAuditModalOpen(true);
    setAuditResult(null);

    try {
      const response = await fetch('/api/verify-terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceText: activeChapter.sourceText,
          translatedText: activeChapter.translatedText,
          customGlossary,
        }),
      });

      if (!response.ok) {
        throw new Error('Nie udało się przeprowadzić audytu.');
      }

      const data = await response.json();
      setAuditResult(data);
    } catch (err: any) {
      console.error('Audit failed:', err);
      setAuditResult({
        isLoreCompliant: false,
        overallScore: 0,
        summary: `Błąd audytu: ${err.message}`,
        issues: []
      });
    } finally {
      setIsAuditing(false);
    }
  };

  // Apply fix from audit with custom search/replacement and glossary support
  const handleApplyAuditFix = (
    searchWord: string, 
    replacementWord: string, 
    replaceAll = true, 
    saveToGlossary = false
  ) => {
    if (!searchWord || !replacementWord) return;
    const currentTranslation = activeChapter.translatedText;
    
    // Auto-save snapshot before audit modification
    handleSaveSnapshot();

    // Safely escape search string for regex
    const escaped = searchWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const flags = replaceAll ? 'gi' : 'i';
    const regex = new RegExp(escaped, flags);
    
    const updated = currentTranslation.replace(regex, replacementWord);
    handleUpdateTranslation(updated);

    if (saveToGlossary) {
      handleAddCustomTerm({
        englishTerm: searchWord,
        polishTerm: replacementWord,
        category: 'Broń i Ekwipunek',
        notes: 'Dodano z Audytu Lore',
        isCustom: true
      });
    }
  };

  const handleSaveAuditTermToGlossary = (english: string, polish: string, category = 'Broń i Ekwipunek') => {
    handleAddCustomTerm({
      englishTerm: english,
      polishTerm: polish,
      category: category as any,
      notes: 'Zapisano z Audytu Lore',
      isCustom: true
    });
  };

  // Explain Term
  const handleExplainTerm = async (term: string) => {
    setIsExplainModalOpen(true);
    setExplainLoading(true);
    setExplainData(null);
    setExplainError(null);

    try {
      const response = await fetch('/api/explain-term', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term }),
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać informacji o terminie.');
      }

      const data = await response.json();
      setExplainData(data);
    } catch (err: any) {
      console.error('Explain term failed:', err);
      setExplainError(err.message);
    } finally {
      setExplainLoading(false);
    }
  };

  // Add empty Chapter
  const handleAddChapter = () => {
    const newIndex = activeBook.chapters.length + 1;
    const newChapter: BookChapter = {
      id: `ch-${Date.now()}`,
      title: `Rozdział ${newIndex}`,
      sourceText: '',
      translatedText: '',
      status: 'idle',
      wordCountSource: 0,
      wordCountTranslated: 0
    };

    setBooks(prev => prev.map(b => b.id === activeBook.id ? {
      ...b,
      chapters: [...b.chapters, newChapter],
      activeChapterId: newChapter.id
    } : b));
  };

  // Delete Chapter
  const handleDeleteChapter = (chapterId: string) => {
    if (activeBook.chapters.length <= 1) return;
    const remaining = activeBook.chapters.filter(c => c.id !== chapterId);
    setBooks(prev => prev.map(b => b.id === activeBook.id ? {
      ...b,
      chapters: remaining,
      activeChapterId: b.activeChapterId === chapterId ? remaining[0].id : b.activeChapterId
    } : b));
  };

  // Import file (.epub, .txt, .md) with intelligent chapter detection
  const handleImportFile = async (file: File) => {
    try {
      if (file.name.endsWith('.epub')) {
        const { title, chapters } = await parseEpubFile(file);
        
        let finalChapters = chapters;
        if (chapters.length === 1 && chapters[0].sourceText.length > 2000) {
          const detected = detectChaptersFromText(chapters[0].sourceText);
          if (detected.length > 1) {
            finalChapters = detected.map((sec, idx) => ({
              id: `ch-epub-det-${Date.now()}-${idx + 1}`,
              title: sec.title || `Rozdział ${idx + 1}`,
              sourceText: cleanTranslationArtifacts(sec.content),
              translatedText: '',
              status: 'idle',
              wordCountSource: sec.wordCount,
              wordCountTranslated: 0
            }));
          }
        }

        const newBook: BookProject = {
          id: `book-${Date.now()}`,
          title: title || file.name.replace(/\.epub$/i, ''),
          author: 'Z pliku EPUB',
          sourceLanguage: 'en',
          targetLanguage: 'pl',
          profile,
          customGlossary: [],
          activeChapterId: finalChapters[0]?.id || '',
          chapters: finalChapters
        };

        setBooks(prev => [newBook, ...prev]);
        setActiveBookId(newBook.id);
      } else {
        // Plain text or markdown
        const rawFileText = await file.text();
        const text = cleanTranslationArtifacts(rawFileText);
        const detected = detectChaptersFromText(text);

        if (detected.length > 1) {
          setDetectorText(text);
          setDetectorFileName(file.name);
          setIsChapterDetectorOpen(true);
        } else {
          const words = text.trim().split(/\s+/).length;
          const newChapter: BookChapter = {
            id: `ch-${Date.now()}`,
            title: file.name.replace(/\.(txt|md)$/i, ''),
            sourceText: text,
            translatedText: '',
            status: 'idle',
            wordCountSource: words,
            wordCountTranslated: 0
          };

          setBooks(prev => prev.map(b => b.id === activeBook.id ? {
            ...b,
            chapters: [...b.chapters, newChapter],
            activeChapterId: newChapter.id
          } : b));
        }
      }
    } catch (err: any) {
      alert(`Błąd podczas wczytywania pliku: ${err.message}`);
    }
  };

  // Open Chapter Detector for current active chapter or manual split
  const handleOpenChapterDetector = () => {
    setDetectorText(activeChapter.sourceText);
    setDetectorFileName(activeChapter.title);
    setIsChapterDetectorOpen(true);
  };

  // Apply detected chapters from modal
  const handleApplyDetectedChapters = (sections: { title: string; content: string }[]) => {
    if (sections.length === 0) return;

    const newChapters: BookChapter[] = sections.map((sec, idx) => ({
      id: `ch-det-${Date.now()}-${idx + 1}`,
      title: sec.title || `Rozdział ${idx + 1}`,
      sourceText: cleanTranslationArtifacts(sec.content),
      translatedText: '',
      status: 'idle',
      wordCountSource: sec.content.trim().split(/\s+/).length,
      wordCountTranslated: 0
    }));

    const isSplittingCurrent = activeBook.chapters.some(
      c => c.id === activeChapter.id && c.sourceText.trim() === detectorText.trim()
    );

    const isCurrentEmpty = activeBook.chapters.length === 1 && !activeBook.chapters[0].sourceText.trim();

    if (isCurrentEmpty) {
      setBooks(prev => prev.map(b => b.id === activeBook.id ? {
        ...b,
        chapters: newChapters,
        activeChapterId: newChapters[0].id
      } : b));
    } else if (isSplittingCurrent) {
      setBooks(prev => prev.map(b => {
        if (b.id === activeBook.id) {
          const replaced = b.chapters.flatMap(c => c.id === activeChapter.id ? newChapters : [c]);
          return {
            ...b,
            chapters: replaced,
            activeChapterId: newChapters[0].id
          };
        }
        return b;
      }));
    } else {
      setBooks(prev => prev.map(b => {
        if (b.id === activeBook.id) {
          return {
            ...b,
            chapters: [...b.chapters, ...newChapters],
            activeChapterId: newChapters[0].id
          };
        }
        return b;
      }));
    }
  };

  // Create Book
  const handleCreateBook = (title: string, author: string) => {
    const newBook: BookProject = {
      id: `book-${Date.now()}`,
      title,
      author,
      sourceLanguage: 'en',
      targetLanguage: 'pl',
      profile,
      customGlossary: [],
      activeChapterId: `ch-${Date.now()}-1`,
      chapters: [
        {
          id: `ch-${Date.now()}-1`,
          title: 'Rozdział I',
          sourceText: '',
          translatedText: '',
          status: 'idle',
          wordCountSource: 0,
          wordCountTranslated: 0
        }
      ]
    };

    setBooks(prev => [newBook, ...prev]);
    setActiveBookId(newBook.id);
  };

  // Add / Delete custom term
  const handleAddCustomTerm = (term: Omit<GlossaryTerm, 'id'>) => {
    const newTerm: GlossaryTerm = {
      ...term,
      id: `custom-${Date.now()}`,
    };
    setCustomGlossary(prev => [newTerm, ...prev]);
  };

  const handleDeleteCustomTerm = (id: string) => {
    setCustomGlossary(prev => prev.filter(t => t.id !== id));
  };

  // Theme css class
  const getThemeClass = (t: FactionTheme) => {
    switch (t) {
      case 'ALPHA_LEGION': return 'theme-alpha-legion';
      case 'BLACK_TEMPLARS': return 'theme-black-templars';
      case 'MECHANICUS': return 'theme-mechanicus';
      default: return 'theme-imperial-gothic';
    }
  };

  return (
    <div className={`relative flex flex-col h-screen overflow-hidden ${getThemeClass(theme)} bg-theme-main`}>
      {/* Faction Background Wallpaper & Gothic Frame Overlay (Black Templars & Mechanicus) */}
      <FactionBackgroundOverlay
        theme={theme}
        customBlackTemplarsBg={customBlackTemplarsBg}
        customMechanicusBg={customMechanicusBg}
        bgOpacity={bgOpacity}
        frameEnabled={frameEnabled}
      />

      {/* Header with Faction Themes & Audio Controls */}
      <Header
        currentProfile={profile}
        onProfileChange={setProfile}
        currentTheme={theme}
        onThemeChange={setTheme}
        currentRole={userRole}
        onRoleChange={setUserRole}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenBookSelector={() => setIsBookSelectorOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenCorpusNER={() => setIsCorpusNEROpen(true)}
        onOpenDesktopApp={() => setIsDesktopAppOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        activeBookTitle={activeBook.title}
        totalTermsCount={fullGlossary.length}
      />

      {/* Main Workspace: Sidebar + Dual Workbench */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row overflow-hidden">
        <ChapterSidebar
          chapters={activeBook.chapters}
          activeChapterId={activeBook.activeChapterId}
          onSelectChapter={handleSelectChapter}
          onAddChapter={handleAddChapter}
          onDeleteChapter={handleDeleteChapter}
          onImportFile={handleImportFile}
          onOpenChapterDetector={handleOpenChapterDetector}
          bookTitle={activeBook.title}
          bookAuthor={activeBook.author}
        />

        <TranslationWorkbench
          chapter={activeChapter}
          onUpdateSource={handleUpdateSource}
          onUpdateTranslation={handleUpdateTranslation}
          onTranslateChapter={handleTranslateChapter}
          onRunAudit={handleRunAudit}
          onExplainTerm={handleExplainTerm}
          onOpenExport={() => setIsExportModalOpen(true)}
          onOpenChapterDetector={handleOpenChapterDetector}
          onSaveSnapshot={handleSaveSnapshot}
          onRevertSnapshot={handleRevertSnapshot}
          isTranslating={isTranslating}
          translationProgress={translationProgress}
          activeGlossary={fullGlossary}
          currentRole={userRole}
          onRoleChange={setUserRole}
          onUpdateChapterStatus={handleUpdateChapterStatus}
          onAddComment={handleAddComment}
          onResolveComment={handleResolveComment}
          onApplySuggestedFix={handleApplySuggestedFix}
          onDeleteComment={handleDeleteComment}
        />
      </div>

      {/* Modals */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        glossary={fullGlossary}
        onAddTerm={handleAddCustomTerm}
        onDeleteTerm={handleDeleteCustomTerm}
        onExplainTerm={handleExplainTerm}
      />

      <BookSelectorModal
        isOpen={isBookSelectorOpen}
        onClose={() => setIsBookSelectorOpen(false)}
        currentBookId={activeBook.id}
        onSelectBook={(book) => setActiveBookId(book.id)}
        onCreateBook={handleCreateBook}
        onImportFile={handleImportFile}
      />

      <AuditReportModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        isLoading={isAuditing}
        result={auditResult}
        chapterText={activeChapter.translatedText}
        onApplyFix={handleApplyAuditFix}
        onSaveToGlossary={handleSaveAuditTermToGlossary}
      />

      <ExplainTermModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        isLoading={explainLoading}
        data={explainData}
        error={explainError}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        book={activeBook}
        activeChapter={activeChapter}
      />

      <ChapterDetectorModal
        isOpen={isChapterDetectorOpen}
        onClose={() => setIsChapterDetectorOpen(false)}
        rawText={detectorText}
        sourceFileName={detectorFileName}
        onApplyChapters={handleApplyDetectedChapters}
      />

      {/* Feature 1: Mass Corpus Ingestion & NER Modal */}
      <CorpusNERModal
        isOpen={isCorpusNEROpen}
        onClose={() => setIsCorpusNEROpen(false)}
        activeBook={activeBook}
        existingGlossary={fullGlossary}
        onAddTermsToGlossary={handleAddTermsFromNER}
      />

      {/* Feature 3: Standalone Windows 11 x64 .EXE & PWA Modal */}
      <DesktopAppModal
        isOpen={isDesktopAppOpen}
        onClose={() => setIsDesktopAppOpen(false)}
      />

      {/* Faction Theme & Wallpaper Customizer Modal (Black Templars & Mechanicus) */}
      <FactionThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={theme}
        onThemeChange={setTheme}
        customBlackTemplarsBg={customBlackTemplarsBg}
        customMechanicusBg={customMechanicusBg}
        onUpdateCustomBg={handleUpdateCustomBg}
        bgOpacity={bgOpacity}
        onChangeBgOpacity={handleChangeBgOpacity}
        frameEnabled={frameEnabled}
        onToggleFrame={handleToggleFrame}
      />
    </div>
  );
}

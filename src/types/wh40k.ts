export type TranslationProfile = 'OFFICIAL_PL' | 'PURIST_EN_NAMES' | 'HIGH_GOTHIC';

export type FactionTheme = 'ALPHA_LEGION' | 'BLACK_TEMPLARS' | 'MECHANICUS' | 'IMPERIAL_GOTHIC';

export type TermCategory = 
  | 'Formacje i Frakcje'
  | 'Stopnie i Tytuły'
  | 'Broń i Ekwipunek'
  | 'Pojazdy i Okręty'
  | 'Osnowa i Mistycyzm'
  | 'Eklezjarchia i Prawo'
  | 'Technologia i Maszyny'
  | 'Geografia i Światy';

export interface GrammarDeclension {
  mianownik?: string;    // M. Kto? Co? (np. Drednot)
  dopelniacz?: string;   // D. Kogo? Czego? (np. Drednota)
  celownik?: string;     // C. Komu? Czemu? (np. Drednotowi)
  biernik?: string;      // B. Kogo? Co? (np. Drednota)
  narzednik?: string;    // N. Z kim? Z czym? (np. Drednotem)
  miejscownik?: string;  // Ms. O kim? O czym? (np. Drednocie)
  wolacz?: string;       // W. O! (np. Drednocie)
  mnoga?: string;        // L.mn. (np. Drednoty, Drednotów)
}

export interface GlossaryTerm {
  id: string;
  englishTerm: string;
  polishTerm: string;
  category: TermCategory;
  notes?: string;
  keepOriginal?: boolean; // if true, don't translate
  exampleContext?: string;
  isCustom?: boolean;
  declension?: GrammarDeclension;
}

export interface DetectedTermMatch {
  original: string;
  translated: string;
  category: string;
  note?: string;
  indexInText?: number;
}

export type UserRole = 'SCRIBE' | 'INQUISITOR';

export type ChapterReviewStatus = 'DRAFT' | 'PENDING_REVIEW' | 'CHANGES_REQUESTED' | 'IMPRIMATUR';

export interface ReviewComment {
  id: string;
  authorRole: UserRole;
  authorName: string;
  timestamp: string;
  text: string;
  suggestedFix?: string;
  targetSnippet?: string;
  status: 'open' | 'resolved';
}

export type NEREntityType = 'character' | 'warship' | 'formation' | 'location' | 'artifact';

export interface ExtractedEntity {
  id: string;
  name: string;
  category: NEREntityType;
  occurrences: number;
  contextSnippets: string[];
  suggestedPolish: string;
  keepOriginal?: boolean;
  inGlossary?: boolean;
  declension?: GrammarDeclension;
  notes?: string;
}

export interface CorpusAnalysisResult {
  totalWords: number;
  totalUniqueEntities: number;
  entities: ExtractedEntity[];
  summary: string;
}

export interface ChapterHistoryEntry {
  id: string;
  timestamp: string;
  label: string;
  translatedText: string;
}

export interface BookChapter {
  id: string;
  title: string;
  sourceText: string;
  translatedText: string;
  previousTranslationSnapshot?: string; // used for diff comparison
  history?: ChapterHistoryEntry[];
  status: 'idle' | 'translating' | 'completed' | 'error';
  reviewStatus?: ChapterReviewStatus;
  imprimaturDate?: string;
  imprimaturBy?: string;
  reviewComments?: ReviewComment[];
  errorMessage?: string;
  detectedTerms?: DetectedTermMatch[];
  lastTranslatedAt?: string;
  wordCountSource: number;
  wordCountTranslated: number;
}

export interface BookProject {
  id: string;
  title: string;
  author: string;
  sourceLanguage: 'en';
  targetLanguage: 'pl';
  profile: TranslationProfile;
  chapters: BookChapter[];
  activeChapterId: string;
  customGlossary: GlossaryTerm[];
}

export interface ConsistencyIssue {
  term: string;
  expected: string;
  foundInText: string;
  snippet: string;
  explanation: string;
}


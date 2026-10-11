import { BookChapter } from '../types/wh40k';

export interface DetectedChapterSection {
  title: string;
  content: string;
  wordCount: number;
  matchPattern?: string;
}

export type DetectionStrategy = 'auto' | 'regex' | 'markdown' | 'word_count' | 'roman_numerals';

export interface DetectionOptions {
  strategy?: DetectionStrategy;
  minWordsPerChapter?: number;
  chunkWordSize?: number; // for word_count strategy
}

/**
 * Robust cleaner for translation text to eliminate literal string artifacts
 * such as literal "\n\n", "\n", "\r\n", markdown code blocks, escaped quotes, etc.
 */
export function cleanTranslationArtifacts(rawText: string): string {
  if (!rawText || typeof rawText !== 'string') return '';

  let cleaned = rawText;

  // 1. Remove markdown fences like ``` or ```markdown or ```pl
  cleaned = cleaned.replace(/^```[a-zA-Z0-9_-]*\s*\n?/gi, '');
  cleaned = cleaned.replace(/\n?```\s*$/gi, '');

  // 2. Fix literal escaped newlines (e.g. "\\n\\n" or literal "\n" strings)
  // Replace double escaped newlines \\n -> \n
  cleaned = cleaned.replace(/\\r\\n/g, '\n');
  cleaned = cleaned.replace(/\\n/g, '\n');
  cleaned = cleaned.replace(/\\r/g, '\n');
  cleaned = cleaned.replace(/\\t/g, ' ');

  // 3. Fix literal escaped quotes: \" -> " and \' -> '
  cleaned = cleaned.replace(/\\"/g, '"');
  cleaned = cleaned.replace(/\\'/g, "'");

  // 4. If string starts and ends with redundant quotes from raw JSON
  if (cleaned.startsWith('"') && cleaned.endsWith('"') && cleaned.length > 2) {
    cleaned = cleaned.substring(1, cleaned.length - 1);
  }

  // 5. Normalize duplicate linebreaks (max 2 consecutive newlines)
  cleaned = cleaned.replace(/\r\n/g, '\n');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

/**
 * Intelligent chapter boundary detector that analyzes text
 * and splits it into organized chapters.
 */
export function detectChaptersFromText(
  rawText: string, 
  options: DetectionOptions = {}
): DetectedChapterSection[] {
  const text = cleanTranslationArtifacts(rawText);
  if (!text.trim()) return [];

  const { strategy = 'auto', minWordsPerChapter = 50, chunkWordSize = 2000 } = options;

  // If word count strategy is explicitly selected
  if (strategy === 'word_count') {
    return splitByWordCount(text, chunkWordSize);
  }

  // Comprehensive chapter regex markers
  // Matches:
  // "Chapter 1", "Chapter I", "CHAPTER ONE", "Chapter 1: The Gathering"
  // "Rozdział 1", "Rozdzial I", "ROZDZIAŁ PIERWSZY"
  // "Part I", "Część 1", "Księga I", "Book 1"
  // "Prologue", "Prolog", "Epilogue", "Epilog", "Dramatis Personae", "Interlude"
  // "# Chapter ...", "## Rozdział ..."
  // "I. The Beginning", "1. Wstęp"
  const chapterRegex = /(?:^|\n+)(?:#{1,3}\s+)?(?:\*{3,}|_{3,}|-{3,})?\s*(?:(?:Rozdział|Rozdzial|Chapter|Capitulum|Book|Księga|Ksiega|Część|Czesc|Part|Prologue|Prolog|Epilogue|Epilog|Interlude|Interludium|Dramatis Personae)(?:\s*(?:[0-9]+|[IVXLCDM]+|[A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż]+))?(?:\s*[:.\-–—]\s*[^\n]+|\s*\n|$)|(?:[IVXLCDM]{1,8}|[0-9]{1,3})\.\s+[A-ZĄĆĘŁŃÓŚŹŻ0-9\s"'-–—]+(?:\n|$)|(?:#{1,3}\s+[^\n]+(?:\n|$)))/gi;

  const matches: { title: string; index: number; fullMatch: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = chapterRegex.exec(text)) !== null) {
    const rawMatchText = match[0].trim();
    // Clean up title
    let cleanTitle = rawMatchText
      .replace(/^#{1,3}\s*/, '')
      .replace(/^[\*\-_]{3,}\s*/, '')
      .replace(/[\*\-_]{3,}$/, '')
      .trim();

    // Remove trailing punctuation from title if any
    cleanTitle = cleanTitle.replace(/[\n\r]+/g, ' ').trim();

    // Check if title is reasonable length (under 120 chars) and not just a single word inside a sentence
    if (cleanTitle.length > 0 && cleanTitle.length < 120) {
      matches.push({
        title: cleanTitle,
        index: match.index,
        fullMatch: match[0]
      });
    }
  }

  // If strategy is markdown only, filter matches to those that started with #
  if (strategy === 'markdown') {
    const mdMatches = matches.filter(m => m.fullMatch.includes('#'));
    if (mdMatches.length >= 2) {
      return buildSectionsFromMatches(text, mdMatches, minWordsPerChapter);
    }
  }

  // If strategy is roman numerals only
  if (strategy === 'roman_numerals') {
    const romanMatches = matches.filter(m => /^[IVXLCDM]+\./i.test(m.title));
    if (romanMatches.length >= 2) {
      return buildSectionsFromMatches(text, romanMatches, minWordsPerChapter);
    }
  }

  // If we found at least 2 distinct chapter markers, split by them!
  if (matches.length >= 2) {
    const sections = buildSectionsFromMatches(text, matches, minWordsPerChapter);
    if (sections.length >= 2) {
      return sections;
    }
  }

  // If no clear chapter headers found, but text is large (>3000 words),
  // fallback to splitting into logical chunks or return single section
  const totalWords = text.split(/\s+/).length;
  if (totalWords > 3500) {
    return splitByWordCount(text, chunkWordSize);
  }

  // Single chapter fallback
  return [{
    title: 'Rozdział I',
    content: text,
    wordCount: totalWords,
    matchPattern: 'Pojedynczy segment'
  }];
}

/**
 * Builds chapter sections using the detected boundary indices
 */
function buildSectionsFromMatches(
  text: string, 
  matches: { title: string; index: number; fullMatch: string }[],
  minWordsPerChapter: number
): DetectedChapterSection[] {
  const sections: DetectedChapterSection[] = [];

  // If there is introductory text before the first detected chapter marker
  if (matches[0].index > 150) {
    const prologueText = text.substring(0, matches[0].index).trim();
    const words = prologueText.split(/\s+/).length;
    if (words >= minWordsPerChapter) {
      sections.push({
        title: 'Wprowadzenie / Prolog',
        content: prologueText,
        wordCount: words,
        matchPattern: 'Tekst początkowy'
      });
    }
  }

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const startIndex = current.index + current.fullMatch.length;
    const endIndex = i + 1 < matches.length ? matches[i + 1].index : text.length;

    const chapterContent = text.substring(startIndex, endIndex).trim();
    const words = chapterContent.split(/\s+/).length;

    // Filter out accidental empty fragments
    if (words >= 15 || i === matches.length - 1) {
      sections.push({
        title: current.title,
        content: chapterContent,
        wordCount: words,
        matchPattern: current.title
      });
    }
  }

  return sections;
}

/**
 * Fallback: splits a large text by word count on paragraph boundaries
 */
function splitByWordCount(text: string, targetWordsPerChapter = 2000): DetectedChapterSection[] {
  const paragraphs = text.split(/\n\s*\n/);
  const sections: DetectedChapterSection[] = [];
  let currentParas: string[] = [];
  let currentWordCount = 0;
  let chapterIndex = 1;

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    const words = trimmed.split(/\s+/).length;
    if (currentWordCount + words > targetWordsPerChapter && currentParas.length > 0) {
      const content = currentParas.join('\n\n');
      sections.push({
        title: `Część ${chapterIndex}`,
        content,
        wordCount: content.split(/\s+/).length,
        matchPattern: `Podział objętościowy (~${targetWordsPerChapter} słów)`
      });
      chapterIndex++;
      currentParas = [trimmed];
      currentWordCount = words;
    } else {
      currentParas.push(trimmed);
      currentWordCount += words;
    }
  }

  if (currentParas.length > 0) {
    const content = currentParas.join('\n\n');
    sections.push({
      title: `Część ${chapterIndex}`,
      content,
      wordCount: content.split(/\s+/).length,
      matchPattern: `Podział objętościowy`
    });
  }

  return sections.length > 0 ? sections : [{
    title: 'Rozdział I',
    content: text,
    wordCount: text.split(/\s+/).length
  }];
}

/**
 * Converts detected sections to BookChapter objects
 */
export function convertSectionsToChapters(sections: DetectedChapterSection[]): BookChapter[] {
  return sections.map((sec, idx) => ({
    id: `ch-${Date.now()}-${idx + 1}`,
    title: sec.title || `Rozdział ${idx + 1}`,
    sourceText: sec.content,
    translatedText: '',
    status: 'idle',
    wordCountSource: sec.wordCount,
    wordCountTranslated: 0
  }));
}

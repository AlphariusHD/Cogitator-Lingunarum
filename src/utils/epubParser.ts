import JSZip from 'jszip';
import { BookChapter } from '../types/wh40k';

/**
 * Parses an EPUB file buffer and extracts chapters with their titles and clean text.
 */
export async function parseEpubFile(file: File): Promise<{ title: string; chapters: BookChapter[] }> {
  try {
    const zip = await JSZip.loadAsync(file);
    
    // Find container.xml to locate the OPF file
    const containerFile = zip.file('META-INF/container.xml');
    let opfPath = 'content.opf';
    
    if (containerFile) {
      const containerXml = await containerFile.async('text');
      const rootfileMatch = containerXml.match(/full-path=["']([^"']+)["']/i);
      if (rootfileMatch && rootfileMatch[1]) {
        opfPath = rootfileMatch[1];
      }
    }

    const opfFile = zip.file(opfPath);
    let bookTitle = file.name.replace(/\.epub$/i, '');
    const chapters: BookChapter[] = [];

    if (opfFile) {
      const opfXml = await opfFile.async('text');
      
      // Extract title from OPF metadata
      const titleMatch = opfXml.match(/<dc:title[^>]*>([^<]+)<\/dc:title>/i);
      if (titleMatch && titleMatch[1]) {
        bookTitle = titleMatch[1].trim();
      }

      const opfDir = opfPath.includes('/') ? opfPath.substring(0, opfPath.lastIndexOf('/') + 1) : '';

      // Parse spine items or scan all html/xhtml files
      const itemMatches = [...opfXml.matchAll(/<item\s+[^>]*id=["']([^"']+)["'][^>]*href=["']([^"']+)["'][^>]*media-type=["']application\/xhtml\+xml["'][^>]*>/gi)];
      
      const spineMatches = [...opfXml.matchAll(/<itemref\s+[^>]*idref=["']([^"']+)["'][^>]*>/gi)];
      
      const idToHref = new Map<string, string>();
      for (const m of itemMatches) {
        idToHref.set(m[1], m[2]);
      }

      const orderedHrefs: string[] = [];
      if (spineMatches.length > 0) {
        for (const s of spineMatches) {
          const href = idToHref.get(s[1]);
          if (href) orderedHrefs.push(href);
        }
      } else {
        orderedHrefs.push(...idToHref.values());
      }

      let chapterIdx = 1;
      for (const rawHref of orderedHrefs) {
        // Resolve path relative to OPF dir
        const cleanHref = decodeURIComponent(rawHref.split('#')[0]);
        const fullPath = opfDir + cleanHref;
        const htmlFile = zip.file(fullPath) || zip.file(cleanHref);

        if (htmlFile) {
          const htmlContent = await htmlFile.async('text');
          const cleanText = extractTextFromHtml(htmlContent);

          if (cleanText.length > 80) { // filter out empty or copyright-only short fragments
            const chapterTitle = extractChapterTitle(htmlContent) || `Rozdział ${chapterIdx}`;
            chapters.push({
              id: `ch-epub-${chapterIdx}-${Date.now()}`,
              title: chapterTitle,
              sourceText: cleanText,
              translatedText: '',
              status: 'idle',
              wordCountSource: cleanText.trim().split(/\s+/).length,
              wordCountTranslated: 0
            });
            chapterIdx++;
          }
        }
      }
    }

    if (chapters.length === 0) {
      // Fallback: search all html files directly
      const htmlFiles = Object.keys(zip.files).filter(f => f.endsWith('.xhtml') || f.endsWith('.html'));
      let idx = 1;
      for (const path of htmlFiles) {
        const fileObj = zip.file(path);
        if (fileObj) {
          const text = await fileObj.async('text');
          const clean = extractTextFromHtml(text);
          if (clean.length > 100) {
            chapters.push({
              id: `ch-epub-fallback-${idx}`,
              title: extractChapterTitle(text) || `Część ${idx}`,
              sourceText: clean,
              translatedText: '',
              status: 'idle',
              wordCountSource: clean.trim().split(/\s+/).length,
              wordCountTranslated: 0
            });
            idx++;
          }
        }
      }
    }

    return {
      title: bookTitle,
      chapters: chapters.length > 0 ? chapters : [{
        id: 'ch-fallback-1',
        title: 'Rozdział I',
        sourceText: 'Nie udało się wyodrębnić tekstu z tego pliku EPUB.',
        translatedText: '',
        status: 'idle',
        wordCountSource: 0,
        wordCountTranslated: 0
      }]
    };
  } catch (err: any) {
    console.error('Błąd parsowania EPUB:', err);
    throw new Error('Nieprawidłowy plik EPUB lub format pliku nie jest wspierany.');
  }
}

/**
 * Extracts pure text from HTML content, preserving paragraph breaks
 */
function extractTextFromHtml(html: string): string {
  // Replace <p>, <br>, <div> with newlines
  let processed = html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n');

  // Strip all tags
  processed = processed.replace(/<[^>]+>/g, '');

  // Decode common HTML entities
  processed = processed
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');

  // Normalize excessive newlines
  return processed
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Tries to extract an h1, h2 or title tag for chapter title
 */
function extractChapterTitle(html: string): string | null {
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match && h1Match[1].trim()) return h1Match[1].trim();

  const h2Match = html.match(/<h2[^>]*>([^<]+)<\/h2>/i);
  if (h2Match && h2Match[1].trim()) return h2Match[1].trim();

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1].trim()) return titleMatch[1].trim();

  return null;
}

/**
 * Splits text into logical translation chunks (~400-600 words) to avoid model truncation
 * and ensure high context preservation.
 */
export function splitTextIntoChunks(text: string, targetChunkWords = 450): string[] {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentWordCount = 0;

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    const words = trimmed.split(/\s+/).length;
    if (currentWordCount + words > targetChunkWords && currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n\n'));
      currentChunk = [trimmed];
      currentWordCount = words;
    } else {
      currentChunk.push(trimmed);
      currentWordCount += words;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n\n'));
  }

  return chunks.length > 0 ? chunks : [text];
}

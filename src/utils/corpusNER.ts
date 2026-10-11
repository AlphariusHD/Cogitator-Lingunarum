import { ExtractedEntity, NEREntityType, GlossaryTerm } from '../types/wh40k';
import { generateGrammarDeclension } from './grammarMorphing';

/**
 * Fast client-side corpus scanner for frequency analysis and snippet extraction
 */
export function extractCorpusEntitiesHeuristic(
  fullText: string,
  existingGlossary: GlossaryTerm[] = []
): { counts: Record<string, number>; snippets: Record<string, string[]> } {
  const counts: Record<string, number> = {};
  const snippets: Record<string, string[]> = {};

  if (!fullText) return { counts, snippets };

  // Known WH40K title markers and proper noun patterns
  const titleRegex = /\b(?:First Captain|Captain|Warmaster|Lord Commander|Primarch|Librarian|Chaplain|Apothecary|Magos|Fabricator General|Inquisitor|Lord Inquisitor|Archon|Farseer|Autarch|Tech-Priest|Princeps|Canoness|Justiciar|Centurion)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;
  
  // Named ships / battle barges
  const shipRegex = /\b(?:the\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?(?:\s+[A-Z][a-z]+)?)\b/g;

  // Scan sentences
  const sentences = fullText.split(/(?<=[.?!])\s+/);

  sentences.forEach(sentence => {
    // Check known title combos
    let match;
    while ((match = titleRegex.exec(sentence)) !== null) {
      const fullNamed = match[0].trim();
      counts[fullNamed] = (counts[fullNamed] || 0) + 1;
      if (!snippets[fullNamed]) snippets[fullNamed] = [];
      if (snippets[fullNamed].length < 3) snippets[fullNamed].push(sentence.trim());
    }
  });

  return { counts, snippets };
}

/**
 * Maps a NER category to a GlossaryTerm category
 */
export function mapNERToTermCategory(category: NEREntityType) {
  switch (category) {
    case 'character':
      return 'Stopnie i Tytuły';
    case 'warship':
      return 'Pojazdy i Okręty';
    case 'formation':
      return 'Formacje i Frakcje';
    case 'location':
      return 'Geografia i Światy';
    case 'artifact':
      return 'Broń i Ekwipunek';
    default:
      return 'Stopnie i Tytuły';
  }
}

/**
 * Convert an ExtractedEntity into a ready-to-use GlossaryTerm with grammar declensions
 */
export function convertEntityToGlossaryTerm(entity: ExtractedEntity): GlossaryTerm {
  const declension = entity.declension || generateGrammarDeclension(entity.suggestedPolish);

  return {
    id: `ner_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    englishTerm: entity.name,
    polishTerm: entity.suggestedPolish,
    category: mapNERToTermCategory(entity.category) as any,
    notes: entity.notes || `Ekstrakcja korpusowa NER (${entity.category}). Frekwencja w książce: ${entity.occurrences}x`,
    keepOriginal: entity.keepOriginal ?? false,
    isCustom: true,
    declension,
  };
}

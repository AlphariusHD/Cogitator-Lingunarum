import { GlossaryTerm, GrammarDeclension } from '../types/wh40k';
import { OFFICIAL_WH40K_GLOSSARY } from '../data/wh40kGlossary';

export type PolishGrammarCase = 
  | 'mianownik'   // Mianownik (M.) - Kto? Co?
  | 'dopelniacz'  // Dopełniacz (D.) - Kogo? Czego?
  | 'celownik'    // Celownik (C.) - Komu? Czemu?
  | 'biernik'     // Biernik (B.) - Kogo? Co?
  | 'narzednik'   // Narzędnik (N.) - Z kim? Z czym?
  | 'miejscownik' // Miejscownik (Ms.) - O kim? O czym?
  | 'wolacz'      // Wołacz (W.) - O!
  | 'mnoga';      // Liczba mnoga ogólna / mianownik l.mn.

export interface MorphingPattern {
  id: string;
  name: string;
  description: string;
  exampleBase: string;
  rules: {
    dopelniacz: (stem: string) => string;
    celownik: (stem: string) => string;
    biernik: (stem: string) => string;
    narzednik: (stem: string) => string;
    miejscownik: (stem: string) => string;
    wolacz: (stem: string) => string;
    mnoga: (stem: string) => string;
  };
}

/**
 * Standard Polish declension patterns specialized for Warhammer 40,000 terms
 */
export const WH40K_MORPH_PATTERNS: Record<string, MorphingPattern> = {
  // Wzorzec męskorzeczowy/męskożywotny twardy (np. Drednot, Bolter, Woks, Auspeks, Serwitor)
  MASCULINE_HARD_CONSONANT: {
    id: 'masc_hard',
    name: 'Męski twardy (Drednot, Bolter, Woks)',
    description: 'Rzeczowniki męskie zakończone na spółgłoskę twardą (-t, -r, -ks, -n)',
    exampleBase: 'Drednot',
    rules: {
      dopelniacz: stem => `${stem}a`,
      celownik: stem => `${stem}owi`,
      biernik: stem => `${stem}a`,
      narzednik: stem => `${stem}em`,
      miejscownik: stem => {
        if (stem.endsWith('t')) return `${stem.slice(0, -1)}cie`;
        if (stem.endsWith('r')) return `${stem.slice(0, -1)}rze`;
        return `${stem}ie`;
      },
      wolacz: stem => {
        if (stem.endsWith('t')) return `${stem.slice(0, -1)}cie`;
        if (stem.endsWith('r')) return `${stem.slice(0, -1)}rze`;
        return `${stem}ie`;
      },
      mnoga: stem => `${stem}y`,
    }
  },

  // Wzorzec męskoosobowy (np. Kronikarz, Aptekarz, Kapelan, Konsyliarz)
  MASCULINE_PERSON: {
    id: 'masc_person',
    name: 'Męskoosobowy (Kronikarz, Aptekarz)',
    description: 'Postacie, stopnie i tytuły osobowe (-arz, -an)',
    exampleBase: 'Kronikarz',
    rules: {
      dopelniacz: stem => `${stem}a`,
      celownik: stem => `${stem}owi`,
      biernik: stem => `${stem}a`,
      narzednik: stem => `${stem}em`,
      miejscownik: stem => `${stem}u`,
      wolacz: stem => `${stem}u`,
      mnoga: stem => `${stem}e`,
    }
  },

  // Wzorzec żeński (np. Osnowa, Pieczęć, Kapsuła, Flota-Rój)
  FEMININE_NOUN: {
    id: 'fem_noun',
    name: 'Żeński (Osnowa, Kapsuła)',
    description: 'Rzeczowniki rodzaju żeńskiego zakończone na -a',
    exampleBase: 'Osnowa',
    rules: {
      dopelniacz: stem => (stem.endsWith('a') ? `${stem.slice(0, -1)}y` : `${stem}y`),
      celownik: stem => (stem.endsWith('wa') ? `${stem.slice(0, -2)}wie` : stem.endsWith('ła') ? `${stem.slice(0, -2)}le` : `${stem}ie`),
      biernik: stem => (stem.endsWith('a') ? `${stem.slice(0, -1)}ę` : `${stem}ę`),
      narzednik: stem => (stem.endsWith('a') ? `${stem.slice(0, -1)}ą` : `${stem}ą`),
      miejscownik: stem => (stem.endsWith('wa') ? `${stem.slice(0, -2)}wie` : stem.endsWith('ła') ? `${stem.slice(0, -2)}le` : `${stem}ie`),
      wolacz: stem => (stem.endsWith('a') ? `${stem.slice(0, -1)}o` : `${stem}o`),
      mnoga: stem => (stem.endsWith('a') ? `${stem.slice(0, -1)}y` : `${stem}y`),
    }
  },

  // Wzorzec nieodmienny / Wysoki Gotyk (np. Adeptus Astartes, Adepta Sororitas, Crux Terminatus)
  HIGH_GOTHIC_INVARIABLE: {
    id: 'high_gothic_inv',
    name: 'Wysoki Gotyk (Nieodmienny: Adeptus Astartes)',
    description: 'Formy łacińskie zachowujące identyczne brzmienie we wszystkich przypadkach',
    exampleBase: 'Adeptus Astartes',
    rules: {
      dopelniacz: stem => stem,
      celownik: stem => stem,
      biernik: stem => stem,
      narzednik: stem => stem,
      miejscownik: stem => stem,
      wolacz: stem => stem,
      mnoga: stem => stem,
    }
  },

  // Przymiotnik + Rzeczownik (np. Duch Maszyny, Kosmiczni Marines)
  COMPOUND_PHRASE: {
    id: 'compound',
    name: 'Złożenie z dopełniaczem (Duch Maszyny)',
    description: 'Rzeczownik rządzony przez dopełniacz',
    exampleBase: 'Duch Maszyny',
    rules: {
      dopelniacz: stem => stem.replace(/^Duch/, 'Ducha'),
      celownik: stem => stem.replace(/^Duch/, 'Duchowi'),
      biernik: stem => stem.replace(/^Duch/, 'Ducha'),
      narzednik: stem => stem.replace(/^Duch/, 'Duchem'),
      miejscownik: stem => stem.replace(/^Duch/, 'Duchu'),
      wolacz: stem => stem.replace(/^Duch/, 'Duchu'),
      mnoga: stem => stem.replace(/^Duch/, 'Duchy'),
    }
  }
};

/**
 * Generate full declension table from a nominative term using heuristic morphing or specified pattern
 */
export function generateGrammarDeclension(
  term: string, 
  patternId?: string
): GrammarDeclension {
  const cleanTerm = term.trim();
  if (!cleanTerm) {
    return { mianownik: '' };
  }

  // 1. If explicit pattern requested
  if (patternId && WH40K_MORPH_PATTERNS[patternId]) {
    const pat = WH40K_MORPH_PATTERNS[patternId];
    return {
      mianownik: cleanTerm,
      dopelniacz: pat.rules.dopelniacz(cleanTerm),
      celownik: pat.rules.celownik(cleanTerm),
      biernik: pat.rules.biernik(cleanTerm),
      narzednik: pat.rules.narzednik(cleanTerm),
      miejscownik: pat.rules.miejscownik(cleanTerm),
      wolacz: pat.rules.wolacz(cleanTerm),
      mnoga: pat.rules.mnoga(cleanTerm),
    };
  }

  // 2. High Gothic invariant check
  if (/^(Adeptus|Adepta|Legio|Ordo|Officio|Collegia|Cult|Skitarii|Inquisitio)/i.test(cleanTerm)) {
    return {
      mianownik: cleanTerm,
      dopelniacz: cleanTerm,
      celownik: cleanTerm,
      biernik: cleanTerm,
      narzednik: cleanTerm,
      miejscownik: cleanTerm,
      wolacz: cleanTerm,
      mnoga: cleanTerm,
    };
  }

  // 3. Known compound phrases
  if (cleanTerm.toLowerCase().startsWith('duch maszyny')) {
    return {
      mianownik: cleanTerm,
      dopelniacz: cleanTerm.replace(/duch/i, 'Ducha'),
      celownik: cleanTerm.replace(/duch/i, 'Duchowi'),
      biernik: cleanTerm.replace(/duch/i, 'Ducha'),
      narzednik: cleanTerm.replace(/duch/i, 'Duchem'),
      miejscownik: cleanTerm.replace(/duch/i, 'Duchu'),
      wolacz: cleanTerm.replace(/duch/i, 'Duchu'),
      mnoga: cleanTerm.replace(/duch/i, 'Duchy'),
    };
  }

  if (cleanTerm.toLowerCase() === 'kosmiczni marines') {
    return {
      mianownik: 'Kosmiczni Marines',
      dopelniacz: 'Kosmicznych Marines',
      celownik: 'Kosmicznym Marines',
      biernik: 'Kosmicznych Marines',
      narzednik: 'Kosmicznymi Marines',
      miejscownik: 'Kosmicznych Marines',
      wolacz: 'Kosmiczni Marines',
      mnoga: 'Kosmiczni Marines',
    };
  }

  // 4. Feminine endings (-a)
  if (cleanTerm.endsWith('a') && !cleanTerm.toLowerCase().endsWith('astartes')) {
    const stem = cleanTerm.slice(0, -1);
    let msEnding = 'ie';
    let dEnding = 'y';

    if (stem.endsWith('w')) {
      msEnding = 'wie';
    } else if (stem.endsWith('ł')) {
      msEnding = 'le';
    } else if (stem.endsWith('k') || stem.endsWith('g')) {
      dEnding = 'i';
      msEnding = stem.endsWith('k') ? 'ce' : 'dze';
    }

    return {
      mianownik: cleanTerm,
      dopelniacz: `${stem}${dEnding}`,
      celownik: `${stem}${msEnding}`,
      biernik: `${stem}ę`,
      narzednik: `${stem}ą`,
      miejscownik: `${stem}${msEnding}`,
      wolacz: `${stem}o`,
      mnoga: `${stem}${dEnding}`,
    };
  }

  // 5. Personal masculine endings (-arz, -el, -nik)
  if (cleanTerm.endsWith('arz') || cleanTerm.endsWith('erz')) {
    return {
      mianownik: cleanTerm,
      dopelniacz: `${cleanTerm}a`,
      celownik: `${cleanTerm}owi`,
      biernik: `${cleanTerm}a`,
      narzednik: `${cleanTerm}em`,
      miejscownik: `${cleanTerm}u`,
      wolacz: `${cleanTerm}u`,
      mnoga: `${cleanTerm}e`,
    };
  }

  // 6. Hard consonant masculine (Drednot, Bolter, Melter, Land Raider, Rhino)
  const isVehicleOrInanimate = true;
  let msForm = `${cleanTerm}ie`;
  if (cleanTerm.endsWith('t')) {
    msForm = `${cleanTerm.slice(0, -1)}cie`;
  } else if (cleanTerm.endsWith('r')) {
    msForm = `${cleanTerm.slice(0, -1)}rze`;
  } else if (cleanTerm.endsWith('ks')) {
    msForm = `${cleanTerm}ie`;
  } else if (cleanTerm.endsWith('o')) {
    // Rhino
    return {
      mianownik: cleanTerm,
      dopelniacz: `${cleanTerm}`,
      celownik: `${cleanTerm}`,
      biernik: `${cleanTerm}`,
      narzednik: `${cleanTerm}`,
      miejscownik: `${cleanTerm}`,
      wolacz: `${cleanTerm}`,
      mnoga: `${cleanTerm}`,
    };
  }

  return {
    mianownik: cleanTerm,
    dopelniacz: `${cleanTerm}a`,
    celownik: `${cleanTerm}owi`,
    biernik: `${cleanTerm}${isVehicleOrInanimate ? 'a' : 'a'}`,
    narzednik: `${cleanTerm}em`,
    miejscownik: msForm,
    wolacz: msForm,
    mnoga: `${cleanTerm}y`,
  };
}

/**
 * Returns formatted Grammar Morphing prompt instructions to inject into Gemini translation pipeline
 */
export function buildGrammarMorphingPrompt(
  customGlossary: GlossaryTerm[] = [],
  sourceTextToAnalyze?: string
): string {
  // Combine official glossary with custom glossary
  const allTerms: GlossaryTerm[] = [...OFFICIAL_WH40K_GLOSSARY, ...customGlossary];

  // If text is provided, prioritize terms actually mentioned or relevant
  let relevantTerms: GlossaryTerm[] = [];
  if (sourceTextToAnalyze) {
    const textLower = sourceTextToAnalyze.toLowerCase();
    relevantTerms = allTerms.filter(t => 
      textLower.includes(t.englishTerm.toLowerCase()) || 
      textLower.includes(t.polishTerm.toLowerCase())
    );
  }

  // Fallback if none matched or text empty: pick high-priority core terms
  if (relevantTerms.length === 0) {
    const coreKeys = [
      'space marines', 'adeptus astartes', 'dreadnought', 'librarian', 
      'machine spirit', 'warp', 'bolter', 'apothecary', 'chaplain', 
      'chainsword', 'drop pod', 'purity seal', 'vox'
    ];
    relevantTerms = allTerms.filter(t => 
      coreKeys.some(k => t.englishTerm.toLowerCase().includes(k))
    );
  }

  // Deduplicate by englishTerm
  const uniqueMap = new Map<string, GlossaryTerm>();
  relevantTerms.forEach(t => {
    uniqueMap.set(t.englishTerm.toLowerCase(), t);
  });
  const selectedTerms = Array.from(uniqueMap.values()).slice(0, 35);

  const lines = selectedTerms.map(term => {
    const d = term.declension;
    if (!d) {
      return `• ${term.englishTerm} => "${term.polishTerm}"`;
    }

    const cases = [
      `M.: "${d.mianownik || term.polishTerm}"`,
      d.dopelniacz ? `D.: "${d.dopelniacz}"` : null,
      d.celownik ? `C.: "${d.celownik}"` : null,
      d.biernik ? `B.: "${d.biernik}"` : null,
      d.narzednik ? `N.: "${d.narzednik}"` : null,
      d.miejscownik ? `Ms.: "${d.miejscownik}"` : null,
      d.mnoga ? `Pl.: "${d.mnoga}"` : null,
    ].filter(Boolean);

    return `• ${term.englishTerm} => "${term.polishTerm}" | Fleksja: [${cases.join(', ')}]`;
  });

  return `
=== TABLICA ODMIAN GRAMATYCZNYCH (GRAMMAR MORPHING MATRIX) ===
Zastosuj poniższe formy fleksyjne w zależności od wymaganego przez polską składnię przypadku:
${lines.join('\n')}

ZASADY APLIKACJI FLEKSJI W POLSKIM ZDANIU:
1. Podmiot zdania (Kto? Co?) -> Mianownik (M.)
2. Przynależność, brak lub cel ruchu (Kogo? Czego? np. "pancerz...", "brak...", "broń...") -> Dopełniacz (D.)
3. Adresat akcji (Komu? Czemu? np. "przekazał...", "oddał cześć...") -> Celownik (C.)
4. Przedmiot czynności bezpośredniej (Kogo? Co? np. "ujrzał...", "zabił...", "wezwał...") -> Biernik (B.)
5. Narzędzie lub towarzyszenie (Z kim? Z czym? np. "wraz z...", "uderzył...", "uzbrojony w...") -> Narzędnik (N.)
6. Miejsce lub treść myśli/mowy (O kim? O czym? W kim? W czym? np. "w...", "na...", "o...") -> Miejscownik (Ms.)
7. Łacińskie terminy Wysokiego Gotyku (*Adeptus Astartes*, *Crux Terminatus*) traktuj jako nieodmienne, odmieniając ewentualnie polskie rzeczowniki nadrzędne (np. "wojowników Adeptus Astartes").
===============================================================
`.trim();
}

/**
 * Validates a translated text against known grammatical issues with core WH40K terms
 */
export interface GrammarMorphingAnomaly {
  term: string;
  matchedText: string;
  expectedCase: string;
  suggestedForm: string;
  explanation: string;
}

export function auditGrammarMorphing(translatedText: string): GrammarMorphingAnomaly[] {
  const anomalies: GrammarMorphingAnomaly[] = [];

  // Check for common grammatical clashes
  // 1. "wraz z Drednot" -> should be "wraz z Drednotem"
  const regexWrazZDrednot = /(?:wraz z|z|ze|przed|nad|pod|za)\s+(?:drednot|dreadnought)\b/gi;
  let match;
  while ((match = regexWrazZDrednot.exec(translatedText)) !== null) {
    anomalies.push({
      term: 'Dreadnought / Drednot',
      matchedText: match[0],
      expectedCase: 'Narzędnik (N.)',
      suggestedForm: match[0].replace(/drednot|dreadnought/i, 'Drednotem'),
      explanation: 'Przyimek "z/wraz z" wymaga narzędnika (Drednotem, a nie Drednot).'
    });
  }

  // 2. "w Drednot" -> should be "w Drednocie"
  const regexWDrednocie = /(?:w|we|o|przy|na)\s+(?:drednot|dreadnought)\b/gi;
  while ((match = regexWDrednocie.exec(translatedText)) !== null) {
    anomalies.push({
      term: 'Dreadnought / Drednot',
      matchedText: match[0],
      expectedCase: 'Miejscownik (Ms.)',
      suggestedForm: match[0].replace(/drednot|dreadnought/i, 'Drednocie'),
      explanation: 'Przyimek "w/o/na" wymaga miejscownika (w Drednocie).'
    });
  }

  // 3. "Ducha Maszyn" -> should be "Ducha Maszyny"
  const regexDuchMaszyn = /\bduch(?:a|owi|em|u)?\s+maszyn\b/gi;
  while ((match = regexDuchMaszyn.exec(translatedText)) !== null) {
    anomalies.push({
      term: 'Duch Maszyny',
      matchedText: match[0],
      expectedCase: 'Dopełniacz l.poj. (Ducha Maszyny)',
      suggestedForm: match[0].replace(/maszyn$/i, 'Maszyny'),
      explanation: 'Kanoniczny polski termin to "Duch Maszyny" (l.poj.), a nie "Maszyn".'
    });
  }

  // 4. "miecz Kronikarz" -> should be "miecz Kronikarza"
  const regexMieczKronikarz = /(?:miecz|pancerz|rozkaz|głos|obecność|kość|relikwia)\s+kronikarz\b/gi;
  while ((match = regexMieczKronikarz.exec(translatedText)) !== null) {
    anomalies.push({
      term: 'Kronikarz',
      matchedText: match[0],
      expectedCase: 'Dopełniacz (D.)',
      suggestedForm: match[0].replace(/kronikarz/i, 'Kronikarza'),
      explanation: 'Rzeczownik nadrzędny wymaga formy dopełniacza (Kronikarza).'
    });
  }

  // 5. "z Kosmiczni Marines" -> should be "z Kosmicznymi Marines"
  const regexZKosmiczni = /(?:z|ze|wraz z)\s+kosmiczni\s+marines\b/gi;
  while ((match = regexZKosmiczni.exec(translatedText)) !== null) {
    anomalies.push({
      term: 'Kosmiczni Marines',
      matchedText: match[0],
      expectedCase: 'Narzędnik l.mn. (N.)',
      suggestedForm: match[0].replace(/kosmiczni\s+marines/i, 'Kosmicznymi Marines'),
      explanation: 'Przyimek "z" wymaga narzędnika liczby mnogiej (Kosmicznymi Marines).'
    });
  }

  return anomalies;
}

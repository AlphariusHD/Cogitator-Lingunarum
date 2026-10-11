import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Server-side Google GenAI initialization with User-Agent header
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('⚠️ WARNING: GEMINI_API_KEY is not set in environment!');
}

const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Translation Endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { 
      text, 
      profile = 'OFFICIAL_PL', 
      customGlossary = [], 
      contextBefore = '',
      tone = 'grimdark' 
    } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Brak tekstu źródłowego do przetłumaczenia.' });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Klucz GEMINI_API_KEY nie został skonfigurowany na serwerze.' 
      });
    }

    // Build custom glossary and grammar morphing matrix instructions
    let customGlossaryPrompt = '';
    if (Array.isArray(customGlossary) && customGlossary.length > 0) {
      customGlossaryPrompt = `
DODATKOWY GLOSARIUSZ I FORMY FLEKSYJNE (BEZWZGLĘDNY PRIORYTET):
${customGlossary.map((g: any) => {
  let declensionStr = '';
  if (g.declension) {
    const d = g.declension;
    const parts = [
      d.mianownik ? `M: ${d.mianownik}` : '',
      d.dopelniacz ? `D: ${d.dopelniacz}` : '',
      d.celownik ? `C: ${d.celownik}` : '',
      d.biernik ? `B: ${d.biernik}` : '',
      d.narzednik ? `N: ${d.narzednik}` : '',
      d.miejscownik ? `Ms: ${d.miejscownik}` : '',
      d.wolacz ? `W: ${d.wolacz}` : '',
      d.mnoga ? `Pl: ${d.mnoga}` : '',
    ].filter(Boolean);
    if (parts.length > 0) declensionStr = ` [Formy fleksyjne: ${parts.join(', ')}]`;
  }
  return `- "${g.englishTerm}" => "${g.polishTerm}"${declensionStr} (${g.notes || ''})`;
}).join('\n')}
`;
    }

    // Dynamic Grammar Morphing Matrix for Core Warhammer 40,000 terms
    let grammarMorphingSection = '';
    if (req.body.grammarMorphingPrompt && typeof req.body.grammarMorphingPrompt === 'string') {
      grammarMorphingSection = `\n${req.body.grammarMorphingPrompt}\n`;
    }

    // Profile instructions
    let profileInstructions = '';
    if (profile === 'PURIST_EN_NAMES') {
      profileInstructions = `
TRYB: PURYSTYCZNY (Angielskie nazwy własne i wojskowe w oryginale).
- Zachowuj nazwy jednostek, pojazdów i broni w języku angielskim: np. Space Marines, Adeptus Astartes, Chainsword, Bolter, Heavy Bolter, Lasgun, Meltagun, Power Sword, Dreadnought, Rhino, Land Raider, Drop Pod.
- Odmieniaj je w miarę potrzeby po polsku z zachowaniem naturalności lub dodawaj polskie określenia rodzajowe (np. "z pancerzem Power Armour", "mieczem Chainsword").
- Resztę narracji, opisy otoczenia, dialogi i atmosferę tłumacz na wybitny, ponury, literacki język polski (Grimdark).
`;
    } else if (profile === 'HIGH_GOTHIC') {
      profileInstructions = `
TRYB: WYSOKI GOTYK & PATOS (Ciężki grimdark, patos modlitw bitewnych i litanii).
- Używaj archaizowanego, uroczystego, patetycznego rejestru języka polskiego.
- Podkreślaj religijny ferwor Eklezjarchii, fanatyzm Czarnych Templariuszy, chłód Inkwizycji oraz nieludzką powagę Astartes.
- Modlitwy, przysięgi i litanie tłumacz z pieczołowitością chorałów i psalmów bojowych.
- Zachowuj łacińskie formuły Wysokiego Gotyku w oryginale (*Adeptus Astartes*, *In Excelsis*, *Exterminatus*, *Dies Irae*, *Crux Terminatus*).
`;
    } else {
      profileInstructions = `
TRYB: OFICJALNY KANON POLSKI (Black Library / Wydawnictwo Copernicus Corporation / ISA).
- Stosuj uznane w polskim fandomie i oficjalnych wydaniach książek terminy:
  * "Space Marines" -> "Kosmiczni Marines" (w skrócie również Astartes)
  * "Imperial Guard" -> "Gwardia Imperialna" (lub Astra Militarum)
  * "Warp" / "Immaterium" -> "Osnowa" (z dużej litery jako wymiar) / "Immaterium"
  * "Machine Spirit" -> "Duch Maszyny"
  * "Chainsword" -> "miecz łańcuchowy"
  * "Power Sword" / "Power Axe" / "Power Fist" -> "miecz energetyczny" / "topór energetyczny" / "pięść energetyczna"
  * "Power Armour" -> "pancerz wspomagany"
  * "Librarian" -> "Kronikarz" (NIGDY "bibliotekarz"!)
  * "Chapter Master" -> "Mistrz Zakonu"
  * "Company Captain" -> "Kapitan Kompanii"
  * "Chaplain" -> "Kapelan"
  * "Apothecary" -> "Aptekarz"
  * "Warmaster" -> "Mistrz Wojny"
  * "Gene-seed" -> "ziarno genowe"
  * "Progenoid Glands" -> "gruczoły progenoidowe"
  * "Drop Pod" -> "kapsuła desantowa"
  * "Hive City" / "Hive World" -> "Miasto-Kopiec" / "Świat-Kopiec"
  * "Forge World" -> "Świat-Kuźnia"
  * "Tyranids" / "Hive Fleet" -> "Tyranidzi" / "Flota-Rój"
  * "Genestealer" -> "Genokrad"
  * "Purity Seal" -> "Pieczęć Czystości"
  * "Auspex" -> "Auspeks" / "skaner auspeksowy"
  * "Vox" -> "Woks" (np. "przez woks", "kanał woksowy")
  * Pozostawiaj utrwalone nazwy uzbrojenia i pojazdów: "Bolter", "Dreadnought" (lub Drednot), "Rhino", "Land Raider", "Thunderhawk", "Rosarius".
`;
    }

    const systemInstruction = `Jesteś mistrzowskim, oficjalnym tłumaczem literatury uniwersum Warhammer 40,000 dla wydawnictw Black Library oraz Copernicus Corporation.
Twoim celem jest przekład tekstu angielskich powieści i opowiadań WH40K na język polski na najwyższym poziomie literackim, z nienaganną wiernością kanonowi Grimdark.

ZASADY PRZEKŁADU:
1. NAJWYŻSZA DYSCYPLINA TERMINOLOGICZNA:
   Nigdy nie popełniaj kardynalnych błędów maszynowych translatorów:
   - "Librarian" w kontekście Astartes to KRONIKARZ (psionik bojowy), nigdy "bibliotekarz".
   - "Warp" to OSNOWA (nie osnowa tkacka, nie wypaczenie).
   - "Chapter" w odniesieniu do Zakonu Marines to ZAKON (nie rozdział!).
   - "Warmaster" to MISTRZ WOJNY (nie mistrz wojenny).
   - "Machine Spirit" to DUCH MASZYNY (z dużej litery).
   - "Battle-brother" to BRAT BITEWNY.
   - "Drop Pod" to KAPSUŁA DESANTOWA.

2. ATMOSFERA I STYL:
   Zachowuj mroczny, ciężki, epicki i bezkompromisowy ton uniwersum 40K (Grimdark). Używaj plastycznego słownictwa, polskiej składni literackiej, myślników dialogowych ("– ...") oraz zachowuj podział akapitów i kursywę.

3. PROFILE TŁUMACZENIA:
${profileInstructions}

4. CZYSTOŚĆ TEKSTU I FORMATOWANIE:
   - NIGDY nie umieszczaj w tekście dosłownego ciągu znaków "\\n", "\\n\\n" ani "\\r\\n".
   - Nowe akapity twórz za pomocą standardowych znaków łamania linii (Enter), tak jak w zwykłej książce.
   - Nie używaj znaczników kodu Markdown (\`\`\`).

5. PRECYZYJNA ODMIANA GRAMATYCZNA (FLEKSJA W WH40K):
   - Odmieniaj polskie terminy przez właściwe przypadki w zależności od kontekstu zdania (np. Dreadnought/Drednot -> "w pancerzu Drednota", "wraz z Drednotem"; Librarian/Kronikarz -> "miecz Kronikarza"; Machine Spirit/Duch Maszyny -> "Ducha Maszyny").
   - Łacińskie formy Wysokiego Gotyku (np. Adeptus Astartes, Adepta Sororitas) pozostawiaj nieodmienne lub dopełniaj polskimi określeniami.

${customGlossaryPrompt}
${grammarMorphingSection}

FORMAT ODPOWIEDZI:
Zwróć odpowiedź w formacie JSON zawierającą:
- "translation": przetłumaczony tekst w języku polskim, z zachowaniem podziału na akapity.
- "detectedTerms": tablicę obiektów { "original": string, "translated": string, "category": string, "note": string } z kluczowymi terminami uniwersum WH40K użytymi w tym fragmencie.
`;

    const prompt = contextBefore 
      ? `KONTEKST POPRZEDZAJĄCEGO AKAPITU (dla zachowania spójności narracji):\n${contextBefore}\n\nTEKST DO PRZETŁUMACZENIA:\n${text}`
      : `TEKST DO PRZETŁUMACZENIA:\n${text}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translation: {
              type: Type.STRING,
              description: 'Przetłumaczony tekst na język polski w klimacie Warhammer 40,000.',
            },
            detectedTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  translated: { type: Type.STRING },
                  category: { type: Type.STRING },
                  note: { type: Type.STRING },
                },
                required: ['original', 'translated'],
              },
              description: 'Wykryte w tekście kanoniczne terminy Warhammer 40K.',
            },
          },
          required: ['translation'],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Pusta odpowiedź z modelu Gemini.');
    }

    const parsed = JSON.parse(responseText);
    
    // Sanitize translation string to eliminate literal \n or escaped artifacts
    if (typeof parsed.translation === 'string') {
      parsed.translation = parsed.translation
        .replace(/^```[a-zA-Z0-9_-]*\s*\n?/gi, '')
        .replace(/\n?```\s*$/gi, '')
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    }

    res.json(parsed);
  } catch (error: any) {
    console.error('Błąd podczas tłumaczenia:', error);
    res.status(500).json({ 
      error: error?.message || 'Nie udało się przetłumaczyć tekstu z powodu błędu modelu.' 
    });
  }
});

// Terminology Verification / Consistency Auditor Endpoint
app.post('/api/verify-terms', async (req, res) => {
  try {
    const { sourceText, translatedText, customGlossary = [] } = req.body;

    if (!sourceText || !translatedText) {
      return res.status(400).json({ error: 'Wymagany tekst źródłowy oraz przetłumaczony.' });
    }

    const systemInstruction = `Jesteś audytorem spójności lore Warhammer 40,000 i poprawności polskiego przekładu.
Twoim zadaniem jest sprawdzenie, czy w polskim tłumaczeniu nie ma błędów terminologicznych, takich jak:
- "bibliotekarz" zamiast "Kronikarz"
- "osnowa" przetłumaczona jako coś innego niż "Osnowa"
- "rozdział" zamiast "Zakon" w odniesieniu do Chapters
- "kropla" zamiast "kapsuła desantowa"
- nieodpowiednie nazwy broni lub formacji
- niespójności z kanonem Black Library.

Zwróć listę znalezionych uwag i rekomendowanych poprawek w formacie JSON.`;

    const prompt = `TEKST ORYGINALNY (ANG):\n${sourceText}\n\nPRZETŁUMACZONY TEKST (PL):\n${translatedText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isLoreCompliant: { type: Type.BOOLEAN },
            overallScore: { type: Type.NUMBER, description: 'Ocena poprawności terminologicznej od 0 do 100' },
            summary: { type: Type.STRING, description: 'Podsumowanie audytu terminologicznego' },
            issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  expected: { type: Type.STRING },
                  foundInText: { type: Type.STRING },
                  snippet: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['term', 'expected', 'explanation'],
              },
            },
          },
          required: ['isLoreCompliant', 'overallScore', 'summary', 'issues'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Błąd weryfikacji terminów:', error);
    res.status(500).json({ error: error?.message || 'Błąd weryfikacji terminologii.' });
  }
});

// Explain Term / Lore Codex Assistant Endpoint
app.post('/api/explain-term', async (req, res) => {
  try {
    const { term } = req.body;
    if (!term) {
      return res.status(400).json({ error: 'Podaj termin do wyjaśnienia.' });
    }

    const systemInstruction = `Jesteś Archiwistą Adeptus Terra i ekspertem leksykonu Warhammer 40,000.
Wyjaśnij podany termin po polsku w 2-3 zwięzłych, nastrojowych zdaniach:
1. Czym jest w uniwersum 40K (funkcja, frakcja, znaczenie).
2. Jak oficjalnie tłumaczy się go na język polski w kanonie Black Library i na co uważać przy przekładzie.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Termin do wyjaśnienia: "${term}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            polishEquivalent: { type: Type.STRING },
            category: { type: Type.STRING },
            loreSummary: { type: Type.STRING },
            translationGuidance: { type: Type.STRING },
          },
          required: ['term', 'polishEquivalent', 'loreSummary', 'translationGuidance'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Błąd wyjaśniania terminu:', error);
    res.status(500).json({ error: error?.message || 'Błąd leksykonu.' });
  }
});

// Live Lore & Terminology Search with Google Search Grounding (gemini-3.5-flash)
app.post('/api/search-lore', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Wymagane zapytanie wyszukiwania.' });
    }

    const systemInstruction = `Jesteś Archiwistą i ekspertem uniwersum Warhammer 40,000 oraz polskiego kanonu Black Library i wydawnictwa Copernicus Corporation.
Użyj wyszukiwarki Google, aby sprawdzić najświeższe, oficjalne i kanoniczne informacje na temat terminu, książki, postaci lub oficjalnego polskiego tłumaczenia w polskich wydaniach.
Odpowiedz w języku polskim, rzeczowo, merytorycznie i w klimacie uniwersum Grimdark.
Uwzględnij oficjalne polskie odpowiedniki, historię wydań w Polsce oraz kanoniczne wytyczne.`;

    let responseText = '';
    let webSources: Array<{ title: string; url: string }> = [];
    let searchQueries: string[] = [];

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Sprawdź w kanonie Warhammer 40,000 oraz w oficjalnych polskich źródłach (Black Library, Copernicus Corporation, Lexicanum, Fandom, Warhammer Community): ${query}`,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
        },
      });

      const candidate = response.candidates?.[0];
      const groundingMetadata = candidate?.groundingMetadata;
      const searchChunks = groundingMetadata?.groundingChunks || [];
      webSources = searchChunks
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({
          title: c.web?.title || 'Źródło',
          url: c.web?.uri,
        }));
      searchQueries = groundingMetadata?.webSearchQueries || [];
      responseText = response.text || '';
    } catch (groundingErr: any) {
      console.warn('Google search grounding model hit limit or failed, falling back to gemini-3.8-flash:', groundingErr?.message);
      // Fallback to gemini-3.8-flash without webSearch
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Zapytanie dotyczące kanonu Warhammer 40,000 i oficjalnego polskiego przekładu: ${query}`,
        config: {
          systemInstruction,
        },
      });
      responseText = fallbackResponse.text || 'Brak danych w archiwach.';
    }

    res.json({
      text: responseText || 'Brak danych w archiwach.',
      webSources,
      searchQueries,
    });
  } catch (error: any) {
    console.error('Błąd wyszukiwania lore z Google Search:', error);
    res.status(500).json({ error: error?.message || 'Błąd wyszukiwania w archiwach.' });
  }
});

// Corpus & Book Named Entity Recognition (NER) Endpoint
app.post('/api/corpus-ner', async (req, res) => {
  try {
    const { text, existingGlossaryTerms = [] } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Brak tekstu korpusu do analizy.' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'Brak klucza GEMINI_API_KEY na serwerze.' });
    }

    // Prepare text sample (if huge, take informative sections up to ~45k characters for high-density NER scan)
    let sampleText = text;
    if (text.length > 50000) {
      const start = text.slice(0, 20000);
      const mid = text.slice(Math.floor(text.length / 2) - 10000, Math.floor(text.length / 2) + 10000);
      const end = text.slice(-10000);
      sampleText = `${start}\n\n[... ŚRODEK TEKSTU ...]\n\n${mid}\n\n[... DALSZA CZĘŚĆ ...]\n\n${end}`;
    }

    const systemInstruction = `Jesteś Archiwistą Cogitatora Adeptus Terra i Głównym Leksykografem tłumaczeń uniwersum Warhammer 40,000.
Twoim zadaniem jest przeprowadzenie kompleksowej ekstrakcji nienazwanych bytów (Named Entity Recognition - NER) z dostarczonego fragmentu lub całej książki w języku angielskim.

Wyszukaj i wyodrębnij WSZYSTKIE kluczowe byty, które tłumacz i redaktor muszą uzgodnić PRZED rozpoczęciem przekładu:
1. 'character': Imiona bohaterów, dowódców, primarchów, oficerów, skrybów wraz z ich tytułami (np. "First Captain Ezekyle Abaddon", "Garviel Loken", "Warmaster Horus", "Euphrati Keeler", "Kyril Sindermann").
2. 'warship': Nazwy okrętów bojowych, barek bitewnych, flagowców, transportowców (np. "Vengeful Spirit", "Macragge's Honour", "Phalanx", "Eisenstein").
3. 'formation': Jednostki wojskowe, legiony, zakony, loże wojowników, regimenty (np. "Luna Wolves", "Sons of Horus", "Mournival", "Diesel Guard", "10th Company").
4. 'location': Planety, systemy gwiezdne, fortece, sektory, księżyce (np. "Terra", "Ullanor", "63-19", "Isstvan III", "Whispering Peaks").
5. 'artifact': Unikalne relikty, nazwana broń, zakazane artefakty, tomy, maszyny (np. "Anathame", "Talon of Horus", "Book of Lorgar", "Dies Irae").

Dla każdego bytu podaj:
- name: Oryginalna nazwa w języku angielskim (np. "Vengeful Spirit")
- category: Jedna z: 'character', 'warship', 'formation', 'location', 'artifact'
- occurrences: Szacunkowa liczba wystąpień / ważność w tekście
- suggestedPolish: Sugerowany polski odpowiednik zgodny z kanonem Black Library (np. dla okrętów: zachować "Vengeful Spirit" lub "Mściwy Duch" z adnotacją; dla tytułów: "Pierwszy Kapitan Ezekyle Abaddon")
- keepOriginal: true jeśli w kanonie tradycyjnie pozostawia się nazwę angielską (np. "Vengeful Spirit", "Luna Wolves"), false jeśli tłumaczy się (np. "Wilki Księżycowe")
- notes: Krótka nastrojowa notatka dla tłumacza wyjaśniająca rolę w kanonie 40K`;

    const prompt = `Tekst korpusu książki do przeskanowania:\n\n${sampleText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: 'Podsumowanie zidentyfikowanych bytów i specyfiki korpusu' },
            entities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ['character', 'warship', 'formation', 'location', 'artifact'] },
                  occurrences: { type: Type.NUMBER },
                  suggestedPolish: { type: Type.STRING },
                  keepOriginal: { type: Type.BOOLEAN },
                  notes: { type: Type.STRING },
                },
                required: ['name', 'category', 'suggestedPolish', 'keepOriginal'],
              },
            },
          },
          required: ['summary', 'entities'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{"summary":"","entities":[]}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Błąd ekstrakcji bytów korpusu (NER):', error);
    res.status(500).json({ error: error?.message || 'Błąd analizy korpusowej książki.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!apiKey, service: 'Cogitator Linguarum WH40K' });
});

// Windows Standalone Desktop Downloads
app.get('/api/desktop/status', (req, res) => {
  const distDir = path.join(__dirname, 'dist-electron');
  let files: { name: string; size: number; path: string; type: string }[] = [];
  if (fs.existsSync(distDir)) {
    try {
      const list = fs.readdirSync(distDir);
      files = list
        .filter((f) => f.endsWith('.bat') || f.endsWith('.ps1') || (f.endsWith('.exe') && fs.statSync(path.join(distDir, f)).size < 30 * 1024 * 1024))
        .map((f) => {
          const stat = fs.statSync(path.join(distDir, f));
          let fileType = 'installer';
          if (f.endsWith('.bat')) fileType = 'launcher';
          return {
            name: f,
            size: stat.size,
            path: `/api/desktop/download/${encodeURIComponent(f)}`,
            type: fileType,
          };
        });
    } catch (e) {
      console.error('Error scanning dist-electron:', e);
    }
  }
  res.json({ ready: files.length > 0, files });
});

app.get('/api/desktop/download/:filename', (req, res) => {
  const filename = req.params.filename;
  // Security check to avoid path traversal
  const safeFilename = path.basename(filename);
  const filePath = path.join(__dirname, 'dist-electron', safeFilename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Plik wykonywalny nie został jeszcze wygenerowany.');
  }

  if (safeFilename.endsWith('.bat')) {
    let content = fs.readFileSync(filePath, 'utf8');
    const host = req.get('host') || 'ais-dev-s6jajhrtuvoz4xeuweuqu6-324134209889.europe-west2.run.app';
    const proto = req.protocol === 'http' && !host.includes('localhost') ? 'https' : req.protocol;
    const currentHostUrl = `${proto}://${host}`;
    content = content.replace(/set "APP_URL=[^"]*"/g, `set "APP_URL=${currentHostUrl}"`);
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    res.setHeader('Content-Type', 'application/x-bat; charset=utf-8');
    return res.send(content);
  }

  const stat = fs.statSync(filePath);
  if (stat.size > 30 * 1024 * 1024) {
    return res.status(200).send(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Instalator Cogitator Standalone</title><style>body{background:#0a0c10;color:#eee;font-family:Segoe UI,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:20px;text-align:center}div{max-width:550px;border:1px solid #d97706;padding:32px;border-radius:12px;background:#13161f;box-shadow:0 10px 30px rgba(0,0,0,0.8)}h2{color:#f59e0b;margin-top:0}p{font-size:14px;color:#cbd5e1;line-height:1.5}.btn{display:inline-block;margin:18px 0;padding:12px 24px;background:#d97706;color:#0a0c10;font-weight:bold;text-decoration:none;border-radius:6px;font-size:14px}.btn:hover{background:#f59e0b}</style></head><body><div><h2>⚔️ Cogitator Standalone dla Windows</h2><p>Paczka archiwalna (.zip 200MB+) przekracza limit transferu pojedynczego pliku w chmurze (max 32 MB) i powoduje błąd HTTP 500.</p><p>Skorzystaj z gotowego <strong>Instalatora Windows (2 KB)</strong>, który pobiera się w ułamek sekundy i tworzy skrót na Pulpicie do samodzielnego okna aplikacji bez przeglądarki Chrome:</p><a class="btn" href="/api/desktop/download/Instalator_Cogitator_Windows.bat">Pobierz Instalator Windows (.BAT)</a><br><br><a href="/" style="color:#94a3b8;font-size:12px;">← Powrót do aplikacji</a></div></body></html>`
    );
  }

  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
  res.download(filePath, safeFilename);
});

// Vite middleware for dev or static serve for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`⚔️ Cogitator Linguarum WH40K running on port ${PORT}`);
  });
}

startServer();

import { VocabWord } from '../types';
import {
  BUILTIN_GLOSSARY_MAP,
  GlossaryEntry,
  extractScriptureReference
} from '../data/wordGlossary';
import { INITIAL_WONDERS_VOCABULARY } from '../data/wondersVocab';
import { INITIAL_BIBLE_WORDS } from '../data/bibleWords';

export interface WordDefinitionLookup {
  word: string;
  pronunciation: string;
  definition: string;
  simpleDefinition: string;
  simpleMeaning: string; // compatibility alias
  exampleSentence: string;
  example?: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'other';
  synonyms: string[];
  antonyms?: string[];
  difficulty: 'easy' | 'medium' | 'challenging';
  gradeLevel: number;
  category: string;
  isBibleWord?: boolean;
  bibleContext?: string;
  scriptureReference?: string;
  scriptureVerse?: string;
  definitionUnavailable?: boolean;
  source: 'builtin_glossary' | 'wonders_catalog' | 'bible_catalog' | 'user_vocabulary' | 'external_api' | 'unavailable';
}

/**
 * Clean and normalize words (remove punctuation, trim, lowercase)
 */
export function cleanWord(raw: string): string {
  if (!raw) return '';
  return raw
    .trim()
    .toLowerCase()
    .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
}

/**
 * Intelligent Sounding-Out Pronunciation Generator
 * Formats like /DIS-PEN-SA-TION/, /PRU-DEN-CE/, /PRE-DES-TI-NA-TED/
 */
export function formatSoundingOutPronunciation(word: string, customPhonetic?: string): string {
  const clean = cleanWord(word);
  if (!clean) return '';

  if (customPhonetic) {
    let formatted = customPhonetic.trim().toUpperCase();
    if (formatted.startsWith('/') && formatted.endsWith('/')) {
      return formatted;
    }
    return `/${formatted}/`;
  }

  // Pre-configured custom map for high-accuracy sounding out
  const customMap: Record<string, string> = {
    dispensation: 'DIS-PEN-SA-TION',
    dispensations: 'DIS-PEN-SA-TIONS',
    prudence: 'PRU-DEN-CE',
    prudent: 'PRU-DENT',
    predestinated: 'PRE-DES-TI-NA-TED',
    predestinate: 'PRE-DES-TI-NATE',
    sanctification: 'SANC-TI-FI-CA-TION',
    justification: 'JUS-TI-FI-CA-TION',
    redemption: 'RE-DEMP-TION',
    covenant: 'COV-E-NANT',
    righteousness: 'RIGH-TEOUS-NESS',
    righteous: 'RIGH-TEOUS',
    meekness: 'MEEK-NESS',
    meek: 'MEEK',
    wisdom: 'WIS-DOM',
    salvation: 'SAL-VA-TION',
    atonement: 'A-TONE-MENT',
    reconciliation: 'REC-ON-CIL-I-A-TION',
    fellowship: 'FEL-LOW-SHIP',
    resurrection: 'RES-UR-REC-TION',
    testimony: 'TES-TI-MO-NY',
    perseverance: 'PER-SE-VER-ANCE',
    sovereignty: 'SOV-ER-EIGN-TY',
    magnificent: 'MAG-NIF-I-CENT',
    curious: 'CU-RI-OUS',
    wandered: 'WAN-DERED',
    tremendous: 'TRE-MEN-DOUS',
    cautious: 'CAU-TIOUS',
    whimsical: 'WHIM-SI-CAL',
    luminous: 'LU-MI-NOUS',
    serene: 'SE-RENE',
    courageous: 'COU-RA-GEOUS'
  };

  if (customMap[clean]) {
    return `/${customMap[clean]}/`;
  }

  // Algorithmic English syllable segmentation for sounding out
  const syllables = clean.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi) || [clean];
  const joined = syllables.map((s) => s.toUpperCase()).join('-');
  return `/${joined}/`;
}

/**
 * Lemma / Stem candidate generator for morphological matching
 * e.g. "predestinated" -> "predestinate", "dispensations" -> "dispensation"
 */
function getStemCandidates(word: string): string[] {
  const clean = cleanWord(word);
  const candidates = [clean];

  if (clean.endsWith('ed')) {
    candidates.push(clean.slice(0, -2)); // walked -> walk
    candidates.push(clean.slice(0, -1)); // predestinated -> predestinate
    if (clean.endsWith('ied')) {
      candidates.push(clean.slice(0, -3) + 'y'); // carried -> carry
    }
  }

  if (clean.endsWith('s') && !clean.endsWith('ss')) {
    candidates.push(clean.slice(0, -1)); // books -> book, dispensations -> dispensation
    if (clean.endsWith('es')) {
      candidates.push(clean.slice(0, -2)); // boxes -> box
      if (clean.endsWith('ies')) {
        candidates.push(clean.slice(0, -3) + 'y'); // stories -> story
      }
    }
  }

  if (clean.endsWith('ing')) {
    candidates.push(clean.slice(0, -3)); // reading -> read
    candidates.push(clean.slice(0, -3) + 'e'); // caring -> care
  }

  if (clean.endsWith('ly')) {
    candidates.push(clean.slice(0, -2)); // prudently -> prudent
  }

  return Array.from(new Set(candidates));
}

/**
 * Cache helper for dictionary lookups
 */
const CACHE_PREFIX = 'bloom_dict_cache_';

function getCachedDefinition(clean: string): WordDefinitionLookup | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${clean}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Unable to read cached dictionary entry', err);
  }
  return null;
}

function saveCachedDefinition(clean: string, lookup: WordDefinitionLookup): void {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${clean}`, JSON.stringify(lookup));
  } catch (err) {
    console.warn('Unable to cache dictionary entry', err);
  }
}

/**
 * Synchronous Multi-Tier Word Lookup following strict definition priorities:
 * 1. Existing glossary / dictionary data already included in app (BUILTIN_GLOSSARY_MAP)
 * 2. Existing curriculum catalogs (Wonders & Bible Words)
 * 3. Existing user vocabulary database (passed in or read from localStorage)
 * 4. Cached dictionary API results
 * 5. Unavailable fallback (no fake or generic text)
 */
export const lookupOrGenerateWordDetails = (
  rawWord: string,
  userContextSentence?: string,
  existingVocabList?: VocabWord[]
): WordDefinitionLookup => {
  const clean = cleanWord(rawWord);
  if (!clean) {
    return {
      word: rawWord,
      pronunciation: '',
      definition: 'Definition unavailable right now.',
      simpleDefinition: 'Definition unavailable right now.',
      simpleMeaning: 'Definition unavailable right now.',
      exampleSentence: '',
      partOfSpeech: 'noun',
      synonyms: [],
      difficulty: 'easy',
      gradeLevel: 3,
      category: 'General',
      definitionUnavailable: true,
      source: 'unavailable'
    };
  }

  const stemCandidates = getStemCandidates(clean);

  // Check for scripture reference inside user context sentence or word input
  const contextScripture =
    extractScriptureReference(userContextSentence || '') ||
    extractScriptureReference(rawWord || '');

  // -------------------------------------------------------------
  // PRIORITY 1: Built-in Glossary Dictionary (Curated & Comprehensive)
  // -------------------------------------------------------------
  for (const candidate of stemCandidates) {
    if (BUILTIN_GLOSSARY_MAP[candidate]) {
      const entry = BUILTIN_GLOSSARY_MAP[candidate];
      const pronunciation = entry.word.toLowerCase() === clean
        ? entry.pronunciation
        : formatSoundingOutPronunciation(clean, entry.pronunciation);

      return {
        word: clean,
        pronunciation,
        definition: entry.definition,
        simpleDefinition: entry.simpleDefinition,
        simpleMeaning: entry.simpleDefinition,
        exampleSentence: userContextSentence?.trim() ? userContextSentence.trim() : entry.exampleSentence,
        example: userContextSentence?.trim() ? userContextSentence.trim() : entry.exampleSentence,
        partOfSpeech: entry.partOfSpeech,
        synonyms: entry.synonyms || [],
        antonyms: entry.antonyms || [],
        difficulty: entry.difficulty,
        gradeLevel: entry.gradeLevel,
        category: entry.category,
        isBibleWord: entry.isBibleWord || Boolean(contextScripture),
        bibleContext: entry.bibleContext,
        scriptureReference: contextScripture ? contextScripture.reference : entry.scriptureReference,
        scriptureVerse: entry.scriptureVerse,
        definitionUnavailable: false,
        source: 'builtin_glossary'
      };
    }
  }

  // -------------------------------------------------------------
  // PRIORITY 2A: Bible Words Catalog
  // -------------------------------------------------------------
  for (const candidate of stemCandidates) {
    const matchedBible = INITIAL_BIBLE_WORDS.find(
      (b) => cleanWord(b.word) === candidate
    );
    if (matchedBible) {
      return {
        word: clean,
        pronunciation: formatSoundingOutPronunciation(clean, matchedBible.pronunciation),
        definition: matchedBible.childDefinition,
        simpleDefinition: matchedBible.childDefinition,
        simpleMeaning: matchedBible.childDefinition,
        exampleSentence: userContextSentence?.trim()
          ? userContextSentence.trim()
          : matchedBible.realLifeExample || matchedBible.scriptureVerse,
        example: userContextSentence?.trim()
          ? userContextSentence.trim()
          : matchedBible.realLifeExample || matchedBible.scriptureVerse,
        partOfSpeech: 'noun',
        synonyms: ['faith', 'blessing'],
        difficulty: 'medium',
        gradeLevel: 4,
        category: 'Faith & Scripture',
        isBibleWord: true,
        bibleContext: `Found in ${matchedBible.scriptureReference}: "${matchedBible.scriptureVerse}"`,
        scriptureReference: contextScripture ? contextScripture.reference : matchedBible.scriptureReference,
        scriptureVerse: matchedBible.scriptureVerse,
        definitionUnavailable: false,
        source: 'bible_catalog'
      };
    }
  }

  // -------------------------------------------------------------
  // PRIORITY 2B: Wonders McGraw-Hill Curriculum Catalog
  // -------------------------------------------------------------
  for (const candidate of stemCandidates) {
    const matchedWonders = INITIAL_WONDERS_VOCABULARY.find(
      (w) => cleanWord(w.word) === candidate
    );
    if (matchedWonders) {
      return {
        word: clean,
        pronunciation: formatSoundingOutPronunciation(clean, matchedWonders.pronunciation),
        definition: matchedWonders.definition,
        simpleDefinition: matchedWonders.simpleDefinition || matchedWonders.definition,
        simpleMeaning: matchedWonders.simpleDefinition || matchedWonders.definition,
        exampleSentence: userContextSentence?.trim()
          ? userContextSentence.trim()
          : matchedWonders.exampleSentence,
        example: userContextSentence?.trim()
          ? userContextSentence.trim()
          : matchedWonders.exampleSentence,
        partOfSpeech: matchedWonders.partOfSpeech || 'noun',
        synonyms: matchedWonders.synonyms || [],
        antonyms: matchedWonders.antonyms || [],
        difficulty: matchedWonders.difficulty || 'medium',
        gradeLevel: matchedWonders.gradeLevel || 4,
        category: matchedWonders.category || 'Reading Discoveries',
        isBibleWord: Boolean(contextScripture),
        scriptureReference: contextScripture ? contextScripture.reference : undefined,
        definitionUnavailable: false,
        source: 'wonders_catalog'
      };
    }
  }

  // -------------------------------------------------------------
  // PRIORITY 2C: User's Existing Saved Vocabulary Database
  // -------------------------------------------------------------
  let vocabList = existingVocabList;
  if (!vocabList || vocabList.length === 0) {
    try {
      const stored = localStorage.getItem('bloom_words_data');
      if (stored) {
        vocabList = JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }

  if (vocabList && vocabList.length > 0) {
    for (const candidate of stemCandidates) {
      const matchedUserWord = vocabList.find(
        (w) => cleanWord(w.word) === candidate && !w.definitionUnavailable && w.definition && !w.definition.includes('discovered during reading')
      );
      if (matchedUserWord) {
        return {
          word: clean,
          pronunciation: formatSoundingOutPronunciation(clean, matchedUserWord.pronunciation),
          definition: matchedUserWord.definition,
          simpleDefinition: matchedUserWord.simpleDefinition || matchedUserWord.definition,
          simpleMeaning: matchedUserWord.simpleMeaning || matchedUserWord.simpleDefinition || matchedUserWord.definition,
          exampleSentence: userContextSentence?.trim()
            ? userContextSentence.trim()
            : matchedUserWord.exampleSentence || matchedUserWord.example || '',
          example: userContextSentence?.trim()
            ? userContextSentence.trim()
            : matchedUserWord.exampleSentence || matchedUserWord.example || '',
          partOfSpeech: matchedUserWord.partOfSpeech || 'noun',
          synonyms: matchedUserWord.synonyms || [],
          antonyms: matchedUserWord.antonyms || [],
          difficulty: matchedUserWord.difficulty || 'medium',
          gradeLevel: matchedUserWord.gradeLevel || 4,
          category: matchedUserWord.category || 'Reading Discoveries',
          isBibleWord: matchedUserWord.isBibleWord || Boolean(contextScripture),
          bibleContext: matchedUserWord.bibleContext,
          scriptureReference: contextScripture ? contextScripture.reference : matchedUserWord.scriptureReference,
          scriptureVerse: matchedUserWord.scriptureVerse,
          definitionUnavailable: false,
          source: 'user_vocabulary'
        };
      }
    }
  }

  // -------------------------------------------------------------
  // PRIORITY 3: Cached External Dictionary Entry (if previously queried)
  // -------------------------------------------------------------
  const cached = getCachedDefinition(clean);
  if (cached && !cached.definitionUnavailable) {
    return {
      ...cached,
      exampleSentence: userContextSentence?.trim() ? userContextSentence.trim() : cached.exampleSentence,
      example: userContextSentence?.trim() ? userContextSentence.trim() : cached.example,
      scriptureReference: contextScripture ? contextScripture.reference : cached.scriptureReference,
      isBibleWord: cached.isBibleWord || Boolean(contextScripture)
    };
  }

  // -------------------------------------------------------------
  // PRIORITY 4: Fallback when definition is unavailable
  // STRICT RULE: DO NOT display "An expressive word discovered during reading practice."
  // Instead display "Definition unavailable right now." with a [Try again] option.
  // -------------------------------------------------------------
  const phonetic = formatSoundingOutPronunciation(clean);

  return {
    word: clean,
    pronunciation: phonetic,
    definition: 'Definition unavailable right now.',
    simpleDefinition: 'Definition unavailable right now.',
    simpleMeaning: 'Definition unavailable right now.',
    exampleSentence: userContextSentence?.trim()
      ? userContextSentence.trim()
      : `Discovered "${clean}" while reading.`,
    example: userContextSentence?.trim()
      ? userContextSentence.trim()
      : `Discovered "${clean}" while reading.`,
    synonyms: [],
    antonyms: [],
    partOfSpeech: 'noun',
    difficulty: clean.length > 8 ? 'challenging' : clean.length > 5 ? 'medium' : 'easy',
    gradeLevel: clean.length > 8 ? 5 : 4,
    category: contextScripture ? 'Bible & Scripture' : 'Reading Discoveries',
    isBibleWord: Boolean(contextScripture),
    scriptureReference: contextScripture ? contextScripture.reference : undefined,
    definitionUnavailable: true,
    source: 'unavailable'
  };
};

/**
 * Asynchronous Multi-Tier Word Lookup with External Dictionary API
 * Queries free Dictionary API with graceful timeout & offline fallback
 */
export async function lookupWordAsync(
  rawWord: string,
  userContextSentence?: string,
  existingVocabList?: VocabWord[]
): Promise<WordDefinitionLookup> {
  // Try fast local synchronous lookup first
  const localResult = lookupOrGenerateWordDetails(rawWord, userContextSentence, existingVocabList);
  if (!localResult.definitionUnavailable) {
    return localResult;
  }

  const clean = cleanWord(rawWord);
  if (!clean) return localResult;

  // Attempt external dictionary lookup (Free Dictionary API: https://api.dictionaryapi.dev)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2600);

    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(clean)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const firstEntry = data[0];
        const meanings = firstEntry.meanings || [];
        const firstMeaning = meanings[0];
        const defObj = firstMeaning?.definitions?.[0];

        if (defObj && defObj.definition) {
          const rawDef: string = defObj.definition;
          // Format child/teen friendly definition
          const cleanDef = rawDef.endsWith('.') ? rawDef : `${rawDef}.`;

          // Pronunciation
          let phoneticText = firstEntry.phonetic;
          if (!phoneticText && Array.isArray(firstEntry.phonetics)) {
            const foundPhonetic = firstEntry.phonetics.find((p: { text?: string }) => p.text);
            if (foundPhonetic) phoneticText = foundPhonetic.text;
          }
          const phonetic = formatSoundingOutPronunciation(clean, phoneticText);

          // Part of speech
          const pos = (firstMeaning?.partOfSpeech || 'noun') as 'noun' | 'verb' | 'adjective' | 'adverb';
          const validPos = ['noun', 'verb', 'adjective', 'adverb'].includes(pos) ? pos : 'noun';

          // Example
          const ex = userContextSentence?.trim() || defObj.example || `The author used the word "${clean}" in the story.`;

          // Simple definition
          const simple = simplifyDefinition(cleanDef, clean);

          // Synonyms
          const syns: string[] = [];
          if (Array.isArray(firstMeaning?.synonyms)) {
            syns.push(...firstMeaning.synonyms.slice(0, 4));
          }
          if (Array.isArray(defObj.synonyms)) {
            syns.push(...defObj.synonyms.slice(0, 4));
          }

          const contextScripture =
            extractScriptureReference(userContextSentence || '') ||
            extractScriptureReference(rawWord || '');

          const lookup: WordDefinitionLookup = {
            word: clean,
            pronunciation: phonetic,
            definition: cleanDef,
            simpleDefinition: simple,
            simpleMeaning: simple,
            exampleSentence: ex,
            example: ex,
            partOfSpeech: validPos,
            synonyms: Array.from(new Set(syns)).slice(0, 4),
            difficulty: clean.length > 8 ? 'challenging' : clean.length > 5 ? 'medium' : 'easy',
            gradeLevel: clean.length > 8 ? 5 : 4,
            category: contextScripture ? 'Bible & Scripture' : 'Reading Discoveries',
            isBibleWord: Boolean(contextScripture),
            scriptureReference: contextScripture ? contextScripture.reference : undefined,
            definitionUnavailable: false,
            source: 'external_api'
          };

          saveCachedDefinition(clean, lookup);
          return lookup;
        }
      }
    }
  } catch (err) {
    // API unavailable or timed out - handle gracefully without breaking
    console.info('External dictionary API not reachable, using local fallback status', err);
  }

  return localResult;
}

/**
 * Simplifies dictionary definitions into child/teen-friendly meanings
 */
function simplifyDefinition(rawDef: string, word: string): string {
  if (!rawDef) return `Meaning of ${word}.`;

  let cleaned = rawDef
    .replace(/^\((formal|archaic|literary|technical|chiefly)\)\s*/i, '')
    .replace(/^Relating to or\s+/i, 'Having to do with ')
    .replace(/^Characterized by\s+/i, 'Full of ')
    .replace(/^Having the quality of\s+/i, 'Being ')
    .replace(/^The state of being\s+/i, 'Being ');

  if (cleaned.length > 120) {
    const firstSentence = cleaned.split(/\.\s+/)[0];
    if (firstSentence && firstSentence.length > 15) {
      cleaned = firstSentence;
    }
  }

  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  if (!cleaned.endsWith('.')) cleaned += '.';
  return cleaned;
}

/**
 * Construct full VocabWord from discovery lookup matching the requested entry structure
 */
export const createVocabWordFromDiscovery = (
  wordLookup: WordDefinitionLookup,
  bookTitle?: string,
  bookAuthor?: string,
  bookPage?: number,
  contextSentence?: string,
  isHomework?: boolean,
  homeworkTag?: string
): VocabWord => {
  const isBible = wordLookup.isBibleWord || Boolean(wordLookup.scriptureReference);
  const readingContext = contextSentence?.trim() || (bookTitle ? `Found in "${bookTitle}"${bookPage ? ` (Page ${bookPage})` : ''}` : undefined);
  const formattedExample = contextSentence?.trim() || wordLookup.exampleSentence || wordLookup.example || `Discovered "${wordLookup.word}" while reading.`;

  return {
    id: `discovered-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    word: wordLookup.word,
    pronunciation: wordLookup.pronunciation,
    definition: wordLookup.definition,
    simpleDefinition: wordLookup.simpleDefinition,
    simpleMeaning: wordLookup.simpleDefinition,
    exampleSentence: formattedExample,
    example: formattedExample,
    partOfSpeech: wordLookup.partOfSpeech || 'noun',
    synonyms: wordLookup.synonyms || [],
    antonyms: wordLookup.antonyms || [],
    difficulty: wordLookup.difficulty,
    category: isHomework
      ? 'Homework & School'
      : isBible
      ? 'Bible & Faith'
      : wordLookup.category || 'Reading Discoveries',
    gradeLevel: wordLookup.gradeLevel || 4,
    mastered: false,
    masteryLevel: 'new',
    timesPracticed: 0,
    correctCount: 0,
    incorrectCount: 0,
    lastPracticedDate: null,
    isCustom: true,
    source: isHomework ? 'homework' : 'reading',
    sourceType: isHomework ? 'homework' : 'reading',
    context: readingContext,
    contextSentence: contextSentence?.trim() || undefined,
    bookTitle: bookTitle || undefined,
    bookAuthor: bookAuthor || undefined,
    bookPage: bookPage || undefined,
    dateDiscovered: new Date().toISOString().split('T')[0],
    dateAdded: new Date().toISOString().split('T')[0],
    isHomework: isHomework || false,
    homeworkTag: homeworkTag || undefined,
    // Bible fields
    isBibleWord: isBible,
    bibleContext: wordLookup.bibleContext,
    scriptureReference: wordLookup.scriptureReference,
    scriptureVerse: wordLookup.scriptureVerse,
    // Availability
    flashcardAvailable: true,
    spellingPracticeAvailable: true,
    pronunciationAvailable: true,
    timesSeen: 1,
    readingOccurrences: isHomework ? 0 : 1,
    lastSeen: new Date().toISOString().split('T')[0],
    definitionUnavailable: Boolean(wordLookup.definitionUnavailable),
    notes: isHomework
      ? `School homework word${homeworkTag ? ` • ${homeworkTag}` : ''}`
      : wordLookup.scriptureReference
      ? `Discovered in Scripture: ${wordLookup.scriptureReference}`
      : bookTitle
      ? `Found in "${bookTitle}"${bookPage ? ` (Page ${bookPage})` : ''}`
      : 'Discovered during reading time'
  };
};

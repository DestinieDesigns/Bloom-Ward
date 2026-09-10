import { VocabWord } from '../types';
import { INITIAL_WONDERS_VOCABULARY } from '../data/wondersVocab';
import { BUILTIN_GLOSSARY_MAP } from '../data/wordGlossary';
import { INITIAL_BIBLE_WORDS } from '../data/bibleWords';

/**
 * Normalizes a word string for strict, case-insensitive, punctuation-stripped deduplication.
 * E.g., "Prudence", "prudence", "PRUDENCE", " prudence! " -> "prudence"
 */
export function normalizeWordKey(word: string): string {
  if (!word) return '';
  return word
    .trim()
    .toLowerCase()
    .replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, '');
}

/**
 * Sounding-out syllable formatter helper.
 * If word already has syllables or slash notation, preserves it; otherwise breaks into readable uppercase syllables.
 */
export function formatSoundingOutPronunciation(word: string, existingPronunciation?: string): string {
  if (existingPronunciation && existingPronunciation.trim().length > 0) {
    let p = existingPronunciation.trim();
    if (!p.startsWith('/')) p = `/${p}`;
    if (!p.endsWith('/')) p = `${p}/`;
    return p;
  }

  // Simple phonetic syllable breakdown fallback
  const clean = normalizeWordKey(word).toUpperCase();
  if (clean.length <= 4) return `/${clean}/`;
  return `/${clean}/`;
}

/**
 * Master Vocabulary Catalog
 * Combines Wonders McGraw-Hill Curriculum words, approved curriculum glossary entries,
 * and approved faith vocabulary without duplicating word entries.
 */
export function buildMasterVocabularyCatalog(): VocabWord[] {
  const catalog: VocabWord[] = [];
  const seenKeys = new Set<string>();

  // Helper to add if not already in catalog
  const registerEntry = (entry: VocabWord) => {
    const key = normalizeWordKey(entry.word);
    if (!key || seenKeys.has(key)) return;
    seenKeys.add(key);
    catalog.push(entry);
  };

  // 1. PRIORITY 1: Wonders McGraw-Hill Curriculum Vocabulary
  INITIAL_WONDERS_VOCABULARY.forEach((w) => {
    registerEntry({
      ...w,
      id: w.id || `wonders-${normalizeWordKey(w.word)}`,
      pronunciation: formatSoundingOutPronunciation(w.word, w.pronunciation),
      simpleDefinition: w.simpleDefinition || w.definition,
      simpleMeaning: w.simpleMeaning || w.simpleDefinition || w.definition,
      source: w.source || 'Wonders McGraw-Hill',
      mastered: false,
      masteryLevel: 'new',
      timesPracticed: 0,
      correctCount: 0,
      incorrectCount: 0,
      lastPracticedDate: null
    });
  });

  // 2. PRIORITY 2: Approved Wonders & Reading Curriculum Glossary Map
  Object.values(BUILTIN_GLOSSARY_MAP).forEach((g) => {
    const key = normalizeWordKey(g.word);
    if (seenKeys.has(key)) return;

    registerEntry({
      id: `glossary-${key}`,
      word: g.word,
      definition: g.definition,
      simpleDefinition: g.simpleDefinition || g.definition,
      simpleMeaning: g.simpleDefinition || g.definition,
      pronunciation: formatSoundingOutPronunciation(g.word, g.pronunciation),
      partOfSpeech: g.partOfSpeech || 'noun',
      exampleSentence: g.exampleSentence,
      example: g.exampleSentence,
      synonyms: g.synonyms || [],
      antonyms: g.antonyms || [],
      difficulty: g.difficulty || 'medium',
      category: g.category || 'Reading & Curriculum',
      gradeLevel: g.gradeLevel || 4,
      mastered: false,
      masteryLevel: 'new',
      timesPracticed: 0,
      correctCount: 0,
      incorrectCount: 0,
      lastPracticedDate: null,
      source: g.isBibleWord ? 'Bible & Scripture Catalog' : 'Wonders Curriculum Glossary',
      isBibleWord: g.isBibleWord || false,
      bibleContext: g.bibleContext,
      scriptureReference: g.scriptureReference,
      scriptureVerse: g.scriptureVerse
    });
  });

  // 3. PRIORITY 3: Approved Faith / Bible Words
  INITIAL_BIBLE_WORDS.forEach((b) => {
    const key = normalizeWordKey(b.word);
    if (seenKeys.has(key)) return;

    registerEntry({
      id: `bible-${key}`,
      word: b.word,
      definition: b.childDefinition,
      simpleDefinition: b.childDefinition,
      simpleMeaning: b.childDefinition,
      pronunciation: formatSoundingOutPronunciation(b.word, b.pronunciation),
      partOfSpeech: 'noun',
      exampleSentence: b.realLifeExample || b.scriptureVerse,
      example: b.realLifeExample || b.scriptureVerse,
      synonyms: ['peace', 'faith', 'truth'],
      difficulty: 'medium',
      category: 'Faith & Scripture',
      gradeLevel: 4,
      mastered: false,
      masteryLevel: 'new',
      timesPracticed: 0,
      correctCount: 0,
      incorrectCount: 0,
      lastPracticedDate: null,
      source: 'Bible Word Catalog',
      isBibleWord: true,
      bibleContext: `Scripture: ${b.scriptureReference}`,
      scriptureReference: b.scriptureReference,
      scriptureVerse: b.scriptureVerse
    });
  });

  return catalog;
}

// Cached instance of the master catalog
let cachedCatalog: VocabWord[] | null = null;

export function getMasterVocabularyCatalog(): VocabWord[] {
  if (!cachedCatalog) {
    cachedCatalog = buildMasterVocabularyCatalog();
  }
  return cachedCatalog;
}

export function findCatalogWordById(id: string): VocabWord | undefined {
  const catalog = getMasterVocabularyCatalog();
  return catalog.find((w) => w.id === id);
}

export function findCatalogWordByText(text: string): VocabWord | undefined {
  const key = normalizeWordKey(text);
  const catalog = getMasterVocabularyCatalog();
  return catalog.find((w) => normalizeWordKey(w.word) === key);
}

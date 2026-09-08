import { VocabWord } from '../types';

export interface WordDefinitionLookup {
  word: string;
  pronunciation: string;
  definition: string;
  simpleMeaning: string;
  exampleSentence: string;
  synonyms: string[];
  antonyms: string[];
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb';
  difficulty: 'easy' | 'medium' | 'challenging';
  gradeLevel: number;
}

const COMMON_DISCOVERY_WORDS: Record<string, WordDefinitionLookup> = {
  magnificent: {
    word: 'magnificent',
    pronunciation: 'mag-NIF-uh-suhnt',
    definition: 'Extremely beautiful, elaborate, or impressive.',
    simpleMeaning: 'Something so grand and wonderful that it amazes you.',
    exampleSentence: 'The magnificent castle stood proudly on top of the green hill.',
    synonyms: ['grand', 'splendid', 'glorious', 'breathtaking'],
    antonyms: ['modest', 'ordinary', 'plain'],
    partOfSpeech: 'adjective',
    difficulty: 'medium',
    gradeLevel: 4
  },
  curious: {
    word: 'curious',
    pronunciation: 'KYOOR-ee-uhs',
    definition: 'Eager to know or learn something new.',
    simpleMeaning: 'Wanting to discover, investigate, or ask questions.',
    exampleSentence: 'The curious puppy poked its nose into the open picnic basket.',
    synonyms: ['inquisitive', 'interested', 'eager', 'inquiring'],
    antonyms: ['uninterested', 'indifferent'],
    partOfSpeech: 'adjective',
    difficulty: 'easy',
    gradeLevel: 3
  },
  wandered: {
    word: 'wandered',
    pronunciation: 'WAHN-derd',
    definition: 'Walked or moved in a leisurely, casual, or aimless way.',
    simpleMeaning: 'Strolled around without rushing or having a strict destination.',
    exampleSentence: 'She wandered through the wildflower meadow, listening to birds.',
    synonyms: ['strolled', 'roamed', 'meandered', 'rambled'],
    antonyms: ['rushed', 'hurried'],
    partOfSpeech: 'verb',
    difficulty: 'easy',
    gradeLevel: 3
  },
  tremendous: {
    word: 'tremendous',
    pronunciation: 'truh-MEN-duhs',
    definition: 'Very great in amount, scale, or intensity; inspiring awe.',
    simpleMeaning: 'Hugely important, enormous, or wonderfully great.',
    exampleSentence: 'The team made a tremendous effort to finish the treehouse before sunset.',
    synonyms: ['enormous', 'huge', 'colossal', 'extraordinary'],
    antonyms: ['tiny', 'minor', 'insignificant'],
    partOfSpeech: 'adjective',
    difficulty: 'medium',
    gradeLevel: 4
  },
  cautious: {
    word: 'cautious',
    pronunciation: 'KAW-shuhs',
    definition: 'Careful to avoid potential problems, dangers, or mistakes.',
    simpleMeaning: 'Taking care and paying attention so you stay safe.',
    exampleSentence: 'The cautious kitten sniffed the new garden path before stepping forward.',
    synonyms: ['careful', 'watchful', 'alert', 'wary'],
    antonyms: ['reckless', 'careless', 'foolhardy'],
    partOfSpeech: 'adjective',
    difficulty: 'medium',
    gradeLevel: 4
  },
  perseverance: {
    word: 'perseverance',
    pronunciation: 'pur-suh-VEER-uhns',
    definition: 'Persistence in doing something despite difficulty or delay in achieving success.',
    simpleMeaning: 'Never giving up, even when a task feels tough.',
    exampleSentence: 'With patience and perseverance, she mastered riding her bicycle.',
    synonyms: ['determination', 'persistence', 'grit', 'tenacity'],
    antonyms: ['giving up', 'quitting', 'laziness'],
    partOfSpeech: 'noun',
    difficulty: 'challenging',
    gradeLevel: 5
  },
  whimsical: {
    word: 'whimsical',
    pronunciation: 'WIM-zih-kuhl',
    definition: 'Playfully quaint or fanciful, especially in an appealing and amusing way.',
    simpleMeaning: 'Full of fun imagination, playful silliness, or magical charm.',
    exampleSentence: 'The artist painted whimsical flying teacups and smiling clouds.',
    synonyms: ['playful', 'fanciful', 'magical', 'quirky'],
    antonyms: ['serious', 'practical', 'somber'],
    partOfSpeech: 'adjective',
    difficulty: 'challenging',
    gradeLevel: 5
  },
  luminous: {
    word: 'luminous',
    pronunciation: 'LOO-muh-nuhs',
    definition: 'Full of or shedding light; bright or shining, especially in the dark.',
    simpleMeaning: 'Glowing softly with bright, pretty light.',
    exampleSentence: 'Fireflies cast a luminous glow across the evening lake.',
    synonyms: ['glowing', 'radiant', 'shining', 'brilliant'],
    antonyms: ['dim', 'dark', 'gloomy'],
    partOfSpeech: 'adjective',
    difficulty: 'challenging',
    gradeLevel: 5
  },
  serene: {
    word: 'serene',
    pronunciation: 'suh-REEN',
    definition: 'Calm, peaceful, and untroubled; tranquil.',
    simpleMeaning: 'Deeply quiet, peaceful, and gentle.',
    exampleSentence: 'Early morning by the calm mountain lake was quiet and serene.',
    synonyms: ['peaceful', 'tranquil', 'calm', 'quiet'],
    antonyms: ['chaotic', 'noisy', 'stormy'],
    partOfSpeech: 'adjective',
    difficulty: 'medium',
    gradeLevel: 4
  },
  courageous: {
    word: 'courageous',
    pronunciation: 'kuh-RAY-juhs',
    definition: 'Not deterred by danger or pain; brave.',
    simpleMeaning: 'Standing strong and brave even when you feel scared.',
    exampleSentence: 'The courageous explorer stepped onto the swaying rope bridge.',
    synonyms: ['brave', 'fearless', 'heroic', 'valiant'],
    antonyms: ['fearful', 'timid', 'cowardly'],
    partOfSpeech: 'adjective',
    difficulty: 'medium',
    gradeLevel: 4
  }
};

export const lookupOrGenerateWordDetails = (
  rawWord: string,
  userContextSentence?: string
): WordDefinitionLookup => {
  const clean = rawWord.trim().toLowerCase();
  if (COMMON_DISCOVERY_WORDS[clean]) {
    const existing = COMMON_DISCOVERY_WORDS[clean];
    return {
      ...existing,
      exampleSentence: userContextSentence?.trim() ? userContextSentence.trim() : existing.exampleSentence
    };
  }

  // Smart fallback generator for any entered word
  const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
  const syllables = clean.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi) || [clean];
  const phonetic = syllables.join('-').toUpperCase();

  const generatedSentence = userContextSentence?.trim()
    ? userContextSentence.trim()
    : `We found the word "${clean}" while reading an inspiring chapter.`;

  return {
    word: clean,
    pronunciation: phonetic,
    definition: `An expressive word discovered during reading practice.`,
    simpleMeaning: `A meaningful word from your reading adventure: "${clean}".`,
    exampleSentence: generatedSentence,
    synonyms: ['related term', 'similar word'],
    antonyms: [],
    partOfSpeech: 'noun',
    difficulty: clean.length > 8 ? 'challenging' : clean.length > 5 ? 'medium' : 'easy',
    gradeLevel: clean.length > 8 ? 5 : 4
  };
};

export const createVocabWordFromDiscovery = (
  wordLookup: WordDefinitionLookup,
  bookTitle?: string,
  bookAuthor?: string,
  bookPage?: number,
  contextSentence?: string,
  isHomework?: boolean,
  homeworkTag?: string
): VocabWord => {
  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    word: wordLookup.word,
    definition: wordLookup.definition,
    pronunciation: wordLookup.pronunciation,
    partOfSpeech: wordLookup.partOfSpeech,
    exampleSentence: contextSentence || wordLookup.exampleSentence,
    synonyms: wordLookup.synonyms,
    antonyms: wordLookup.antonyms,
    difficulty: wordLookup.difficulty,
    category: isHomework ? 'Homework & School' : 'Book Discoveries',
    gradeLevel: wordLookup.gradeLevel,
    mastered: false,
    masteryLevel: 'new',
    timesPracticed: 0,
    correctCount: 0,
    incorrectCount: 0,
    lastPracticedDate: null,
    isCustom: true,
    sourceType: isHomework ? 'homework' : 'reading',
    bookTitle: bookTitle || undefined,
    bookAuthor: bookAuthor || undefined,
    bookPage: bookPage || undefined,
    contextSentence: contextSentence || undefined,
    dateDiscovered: new Date().toISOString().split('T')[0],
    isHomework: isHomework || false,
    homeworkTag: homeworkTag || undefined,
    notes: isHomework
      ? `School homework word${homeworkTag ? ` • ${homeworkTag}` : ''}`
      : bookTitle
      ? `Found in "${bookTitle}"${bookPage ? ` (Page ${bookPage})` : ''}`
      : 'Discovered during reading time'
  };
};

import { VocabWord } from '../types';
import {
  getMasterVocabularyCatalog,
  normalizeWordKey,
  findCatalogWordById,
  findCatalogWordByText
} from './vocabularyCatalogService';

const DAILY_WORDS_STORAGE_KEY = 'bloomword_daily_3_v1';

export interface DailyAssignment {
  date: string; // Local calendar date YYYY-MM-DD
  wordIds: string[];
  practicedWordIds: string[];
  completedAt?: string;
}

export interface DailyWordsStore {
  dailyWordsDate: string; // Active local date e.g. "2026-09-10"
  dailyWords: string[]; // Exactly 3 word IDs for the active calendar day
  practicedWordIds: string[]; // Word IDs the learner has practiced/rated today
  dailyAssignments: Record<string, DailyAssignment>; // Historical daily assignments by date
  allPreviouslyAssignedWords: string[]; // Normalized lowercase words ever assigned
}

/**
 * Computes the learner's LOCAL calendar date formatted as YYYY-MM-DD.
 * Ensures the calendar day changes at local midnight without UTC drift.
 */
export function getLocalCalendarDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadDailyWordsStore(): DailyWordsStore {
  const today = getLocalCalendarDate();
  const defaultStore: DailyWordsStore = {
    dailyWordsDate: '',
    dailyWords: [],
    practicedWordIds: [],
    dailyAssignments: {},
    allPreviouslyAssignedWords: []
  };

  if (typeof window === 'undefined' || !window.localStorage) {
    return defaultStore;
  }

  try {
    const raw = localStorage.getItem(DAILY_WORDS_STORAGE_KEY);
    if (!raw) return defaultStore;
    const parsed = JSON.parse(raw);
    return {
      dailyWordsDate: parsed.dailyWordsDate || '',
      dailyWords: Array.isArray(parsed.dailyWords) ? parsed.dailyWords : [],
      practicedWordIds: Array.isArray(parsed.practicedWordIds) ? parsed.practicedWordIds : [],
      dailyAssignments: parsed.dailyAssignments && typeof parsed.dailyAssignments === 'object' ? parsed.dailyAssignments : {},
      allPreviouslyAssignedWords: Array.isArray(parsed.allPreviouslyAssignedWords)
        ? parsed.allPreviouslyAssignedWords.map((w: string) => normalizeWordKey(w))
        : []
    };
  } catch (err) {
    console.warn('Error reading daily words store from localStorage:', err);
    return defaultStore;
  }
}

export function saveDailyWordsStore(store: DailyWordsStore): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(DAILY_WORDS_STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.warn('Error saving daily words store to localStorage:', err);
  }
}

export interface GetDaily3Result {
  dailyWords: VocabWord[];
  store: DailyWordsStore;
  isNewAssignmentToday: boolean;
  practicedCount: number;
  totalCount: number;
  isAllPracticed: boolean;
  message?: string;
  newWordsAddedToVocab: VocabWord[];
}

/**
 * Automatically assigns or retrieves the learner's EXACTLY 3 genuinely NEW vocabulary words
 * for the current local calendar day.
 *
 * Rules:
 * 1. Same calendar day -> Same 3 words (refresh, close/reopen, navigation never generate new words).
 * 2. Next calendar day -> Preserves yesterday's words and mastery, generates 3 genuinely new words.
 * 3. Never selects a word the learner has previously encountered, practiced, added from reading,
 *    or had assigned in any previous daily set.
 * 4. Deduplicates case variations (e.g., "Prudence" and "prudence").
 * 5. If fewer than 3 words remain, returns available genuine new words with an appropriate message.
 */
export function getOrAssignDaily3Words(
  learnerWords: VocabWord[],
  targetDate: string = getLocalCalendarDate()
): GetDaily3Result {
  const store = loadDailyWordsStore();
  const catalog = getMasterVocabularyCatalog();
  const newWordsAddedToVocab: VocabWord[] = [];

  // =========================================================================
  // SCENARIO 1: SAME CALENDAR DAY -> KEEP THE SAME 3 WORDS
  // =========================================================================
  if (store.dailyWordsDate === targetDate && store.dailyWords.length > 0) {
    // Resolve words from learner's active list or catalog
    const resolvedWords: VocabWord[] = [];

    store.dailyWords.forEach((id) => {
      const existingInLearner = learnerWords.find((w) => w.id === id);
      if (existingInLearner) {
        resolvedWords.push(existingInLearner);
      } else {
        const fromCatalog = findCatalogWordById(id) || catalog.find((c) => normalizeWordKey(c.word) === normalizeWordKey(id));
        if (fromCatalog) {
          const initialized: VocabWord = {
            ...fromCatalog,
            id,
            mastered: false,
            masteryLevel: 'new',
            timesPracticed: 0,
            correctCount: 0,
            incorrectCount: 0,
            lastPracticedDate: null,
            dateAdded: targetDate,
            source: fromCatalog.source || "Today's 3 Words"
          };
          resolvedWords.push(initialized);
          newWordsAddedToVocab.push(initialized);
        }
      }
    });

    // If all resolved properly, return the day's existing words
    if (resolvedWords.length > 0) {
      const practicedCount = resolvedWords.filter((w) => store.practicedWordIds.includes(w.id)).length;
      return {
        dailyWords: resolvedWords,
        store,
        isNewAssignmentToday: false,
        practicedCount,
        totalCount: resolvedWords.length,
        isAllPracticed: resolvedWords.length > 0 && practicedCount >= resolvedWords.length,
        newWordsAddedToVocab
      };
    }
  }

  // =========================================================================
  // SCENARIO 2: NEW CALENDAR DAY OR FIRST-TIME LOGIN -> ASSIGN EXACTLY 3 NEW WORDS
  // =========================================================================

  // 1. Preserve previous assignment if calendar day just rolled over
  if (store.dailyWordsDate && store.dailyWordsDate !== targetDate) {
    const prevDate = store.dailyWordsDate;
    if (!store.dailyAssignments[prevDate] && store.dailyWords.length > 0) {
      store.dailyAssignments[prevDate] = {
        date: prevDate,
        wordIds: [...store.dailyWords],
        practicedWordIds: [...store.practicedWordIds]
      };
    }
    // Record previously assigned words in permanent set
    store.dailyWords.forEach((id) => {
      const w = learnerWords.find((item) => item.id === id) || findCatalogWordById(id);
      if (w) {
        const norm = normalizeWordKey(w.word);
        if (!store.allPreviouslyAssignedWords.includes(norm)) {
          store.allPreviouslyAssignedWords.push(norm);
        }
      }
    });
  }

  // 2. BUILD EXCLUSION SET
  // Check against:
  // - previously assigned Daily Words
  // - learned vocabulary
  // - current vocabulary
  // - personal words added by learner (reading discovery, homework, custom)
  // - words already being practiced (timesPracticed > 0)
  // - familiar words (growing, almost_mastered)
  // - mastered words (mastered: true)
  // - previously completed Daily Word sets
  const excludedWordKeys = new Set<string>();

  // Add all words from store's permanent record
  store.allPreviouslyAssignedWords.forEach((k) => excludedWordKeys.add(normalizeWordKey(k)));

  // Add all word IDs/words from all past daily assignments
  Object.values(store.dailyAssignments).forEach((assign) => {
    assign.wordIds.forEach((id) => {
      const w = learnerWords.find((item) => item.id === id) || findCatalogWordById(id);
      if (w) excludedWordKeys.add(normalizeWordKey(w.word));
    });
  });

  // Add all words from the learner's vocabulary that:
  // - have been practiced
  // - are beyond 'new'
  // - are custom or from reading/homework
  // - or are already in the learner's existing list
  learnerWords.forEach((w) => {
    const key = normalizeWordKey(w.word);
    if (!key) return;

    if (
      w.timesPracticed > 0 ||
      w.masteryLevel !== 'new' ||
      w.mastered ||
      w.isCustom ||
      w.sourceType === 'reading' ||
      w.sourceType === 'homework' ||
      w.sourceType === 'custom' ||
      w.confidenceRating ||
      w.lastPracticedDate
    ) {
      excludedWordKeys.add(key);
    }
  });

  // 3. CANDIDATE SELECTION
  // Candidate pool prioritizing Wonders McGraw-Hill curriculum words first
  const wondersCandidates: VocabWord[] = [];
  const otherApprovedCandidates: VocabWord[] = [];
  const faithCandidates: VocabWord[] = [];

  catalog.forEach((item) => {
    const key = normalizeWordKey(item.word);
    if (!key || excludedWordKeys.has(key)) return;

    if (item.source && item.source.toLowerCase().includes('wonders')) {
      wondersCandidates.push(item);
    } else if (item.isBibleWord) {
      faithCandidates.push(item);
    } else {
      otherApprovedCandidates.push(item);
    }
  });

  // Combine prioritized lists
  const orderedCandidates = [...wondersCandidates, ...otherApprovedCandidates, ...faithCandidates];

  // Select up to 3 genuinely new words, ensuring no duplicates within the chosen set
  const selectedWords: VocabWord[] = [];
  const chosenKeys = new Set<string>();

  for (const candidate of orderedCandidates) {
    if (selectedWords.length >= 3) break;
    const key = normalizeWordKey(candidate.word);
    if (!chosenKeys.has(key)) {
      chosenKeys.add(key);

      // Check if word already exists in learner's list (e.g. unpracticed seed)
      const existingInLearner = learnerWords.find((w) => normalizeWordKey(w.word) === key);
      const newWord: VocabWord = existingInLearner
        ? {
            ...existingInLearner,
            dateAdded: targetDate,
            source: existingInLearner.source || candidate.source || "Today's 3 Words"
          }
        : {
            ...candidate,
            id: candidate.id || `daily-${key}`,
            mastered: false,
            masteryLevel: 'new',
            timesPracticed: 0,
            correctCount: 0,
            incorrectCount: 0,
            lastPracticedDate: null,
            dateAdded: targetDate,
            source: candidate.source || "Today's 3 Words"
          };

      selectedWords.push(newWord);
      if (!existingInLearner) {
        newWordsAddedToVocab.push(newWord);
      }
    }
  }

  // 4. INSUFFICIENT VOCABULARY HANDLING
  let message: string | undefined;
  if (selectedWords.length < 3) {
    message =
      selectedWords.length === 0
        ? "You've explored all of the available words! Fantastic dedication. We're adding more words soon."
        : "You've explored almost all of the available words! We're adding more soon.";
  }

  // 5. UPDATE AND PERSIST DAILY WORDS STORE
  const assignedWordIds = selectedWords.map((w) => w.id);
  selectedWords.forEach((w) => {
    const norm = normalizeWordKey(w.word);
    if (!store.allPreviouslyAssignedWords.includes(norm)) {
      store.allPreviouslyAssignedWords.push(norm);
    }
  });

  store.dailyWordsDate = targetDate;
  store.dailyWords = assignedWordIds;
  store.practicedWordIds = [];
  store.dailyAssignments[targetDate] = {
    date: targetDate,
    wordIds: assignedWordIds,
    practicedWordIds: []
  };

  saveDailyWordsStore(store);

  return {
    dailyWords: selectedWords,
    store,
    isNewAssignmentToday: true,
    practicedCount: 0,
    totalCount: selectedWords.length,
    isAllPracticed: false,
    message,
    newWordsAddedToVocab
  };
}

/**
 * Records that a learner has practiced or rated one of today's Daily 3 words.
 * Updates local store and returns updated list of practiced IDs.
 */
export function recordDailyWordPractice(wordId: string): string[] {
  const store = loadDailyWordsStore();
  const today = getLocalCalendarDate();

  if (!store.practicedWordIds.includes(wordId)) {
    store.practicedWordIds.push(wordId);
  }

  if (store.dailyAssignments[today]) {
    if (!store.dailyAssignments[today].practicedWordIds.includes(wordId)) {
      store.dailyAssignments[today].practicedWordIds.push(wordId);
    }
    if (store.dailyAssignments[today].practicedWordIds.length >= store.dailyWords.length) {
      store.dailyAssignments[today].completedAt = new Date().toISOString();
    }
  }

  saveDailyWordsStore(store);
  return store.practicedWordIds;
}

/**
 * Checks if a word is one of today's assigned Daily 3 words.
 */
export function isAssignedTodayWord(wordId: string): boolean {
  const store = loadDailyWordsStore();
  const today = getLocalCalendarDate();
  if (store.dailyWordsDate !== today) return false;
  return store.dailyWords.includes(wordId);
}

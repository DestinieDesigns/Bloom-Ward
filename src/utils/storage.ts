import confetti from 'canvas-confetti';
import {
  VocabWord,
  BibleWord,
  ReadingStory,
  GardenPlot,
  GardenPet,
  AchievementBadge,
  UserProfile,
  WeeklyAssessmentResult,
  ReadingSession,
  BookRecord
} from '../types';
import { INITIAL_WONDERS_VOCABULARY } from '../data/wondersVocab';
import { INITIAL_BIBLE_WORDS } from '../data/bibleWords';
import { INITIAL_STORIES } from '../data/readingStories';
import { INITIAL_GARDEN_PLOTS, INITIAL_GARDEN_PETS } from '../data/gardenData';
import { INITIAL_BADGES } from '../data/badges';

const STORAGE_KEYS = {
  VOCAB: 'bloomword_vocab_v1',
  BIBLE: 'bloomword_bible_v1',
  STORIES: 'bloomword_stories_v1',
  GARDEN_PLOTS: 'bloomword_garden_plots_v1',
  GARDEN_PETS: 'bloomword_garden_pets_v1',
  BADGES: 'bloomword_badges_v1',
  PROFILE: 'bloomword_profile_v1',
  WEEKLY_CHECKS: 'bloomword_weekly_checks_v1',
  READING_SESSIONS: 'bloomword_reading_sessions_v1',
  BOOKS: 'bloomword_books_v1'
};

const INITIAL_BOOKS: BookRecord[] = [
  {
    id: 'book-1',
    title: "Charlotte's Web",
    author: 'E.B. White',
    totalMinutesRead: 60,
    sessionsCount: 4,
    wordsDiscoveredCount: 3,
    status: 'reading',
    lastReadDate: new Date().toISOString().split('T')[0]
  },
  {
    id: 'book-2',
    title: 'The Secret Garden',
    author: 'Frances Hodgson Burnett',
    totalMinutesRead: 45,
    sessionsCount: 3,
    wordsDiscoveredCount: 4,
    status: 'reading',
    lastReadDate: new Date().toISOString().split('T')[0]
  },
  {
    id: 'book-3',
    title: 'The Lion, the Witch and the Wardrobe',
    author: 'C.S. Lewis',
    totalMinutesRead: 30,
    sessionsCount: 2,
    wordsDiscoveredCount: 2,
    status: 'reading',
    lastReadDate: new Date().toISOString().split('T')[0]
  }
];

const INITIAL_READING_SESSIONS: ReadingSession[] = [
  {
    id: 'session-1',
    date: 'Yesterday',
    bookTitle: "Charlotte's Web",
    bookAuthor: 'E.B. White',
    startPage: 42,
    endPage: 54,
    minutesRead: 15,
    targetMinutes: 15,
    wordsDiscovered: ['magnificent', 'curious'],
    xpEarned: 35,
    theme: 'pink_garden'
  },
  {
    id: 'session-2',
    date: '2 days ago',
    bookTitle: 'The Secret Garden',
    bookAuthor: 'Frances Hodgson Burnett',
    startPage: 12,
    endPage: 25,
    minutesRead: 20,
    targetMinutes: 15,
    wordsDiscovered: ['fragile', 'wilderness'],
    xpEarned: 45,
    theme: 'pink_garden'
  }
];

export const getStoredBooks = (): BookRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_BOOKS;
};

export const saveStoredBooks = (books: BookRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  } catch {}
};

export const getStoredReadingSessions = (): ReadingSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.READING_SESSIONS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_READING_SESSIONS;
};

export const saveStoredReadingSessions = (sessions: ReadingSession[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.READING_SESSIONS, JSON.stringify(sessions));
  } catch {}
};

export const getStoredWords = (): VocabWord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOCAB);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return INITIAL_WONDERS_VOCABULARY;
};

export const saveStoredWords = (words: VocabWord[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.VOCAB, JSON.stringify(words));
  } catch {
    // ignore
  }
};

export const getStoredBibleWords = (): BibleWord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BIBLE);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return INITIAL_BIBLE_WORDS;
};

export const saveStoredBibleWords = (bibleWords: BibleWord[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BIBLE, JSON.stringify(bibleWords));
  } catch {
    // ignore
  }
};

export const getStoredStories = (): ReadingStory[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STORIES);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return INITIAL_STORIES;
};

export const saveStoredStories = (stories: ReadingStory[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
  } catch {
    // ignore
  }
};

export const getStoredGardenPlots = (): GardenPlot[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GARDEN_PLOTS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return INITIAL_GARDEN_PLOTS;
};

export const saveStoredGardenPlots = (plots: GardenPlot[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.GARDEN_PLOTS, JSON.stringify(plots));
  } catch {
    // ignore
  }
};

export const getStoredGardenPets = (): GardenPet[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GARDEN_PETS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return INITIAL_GARDEN_PETS;
};

export const saveStoredGardenPets = (pets: GardenPet[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.GARDEN_PETS, JSON.stringify(pets));
  } catch {
    // ignore
  }
};

export const getStoredBadges = (): AchievementBadge[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BADGES);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return INITIAL_BADGES;
};

export const saveStoredBadges = (badges: AchievementBadge[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  } catch {
    // ignore
  }
};

export const DEFAULT_PROFILE: UserProfile = {
  id: 'prof-default',
  name: 'Sophia',
  avatar: '🌸',
  level: 2,
  xp: 185,
  streak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  weeklyGoalCompleted: 12,
  weeklyGoalTotal: 20,
  soundEnabled: true,
  speechSpeed: 0.85,
  currentPathLevel: 2,
  theme: 'pink_garden',
  learningLevel: 'intermediate',
  interests: ['🌸 Gardens', '📚 Reading', '🐾 Animals'],
  dailyReadingGoalMinutes: 15,
  readingStreak: 4,
  longestReadingStreak: 7,
  totalReadingMinutes: 135,
  totalReadingSessions: 9,
  lastReadingDate: new Date().toISOString().split('T')[0],
  onboardingCompleted: true,
  initialAssessmentCompleted: true
};

export const getStoredProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PROFILE, ...parsed };
    }
  } catch {
    // ignore
  }
  return DEFAULT_PROFILE;
};

export const saveStoredProfile = (profile: UserProfile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch {
    // ignore
  }
};

export const getStoredWeeklyAssessments = (): WeeklyAssessmentResult[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEEKLY_CHECKS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [
    {
      id: 'prev-1',
      date: 'Last Week',
      score: 88,
      totalQuestions: 10,
      strengths: ['Definition Mastery', 'Bible Word Meanings', 'Short Word Spelling'],
      areasToPractice: ['Words with multiple syllables (perseverance)', 'Fill in the blank context'],
      wordsTested: ['beautiful', 'fragile', 'Shalom', 'generous', 'courageous', 'perseverance']
    }
  ];
};

export const saveStoredWeeklyAssessments = (history: WeeklyAssessmentResult[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.WEEKLY_CHECKS, JSON.stringify(history));
  } catch {
    // ignore
  }
};

export const triggerSparkleConfetti = () => {
  try {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F472B6', '#FBCFE8', '#C084FC', '#FBBF24', '#34D399']
    });
  } catch {
    // ignore
  }
};

export const triggerCelebrationConfetti = () => {
  try {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#EC4899', '#F472B6', '#A855F7', '#FDE047', '#60A5FA']
    });
  } catch {
    // ignore
  }
};

// Export aliases
export const loadProfile = getStoredProfile;
export const saveProfile = saveStoredProfile;
export const loadWords = getStoredWords;
export const saveWords = saveStoredWords;
export const loadBibleWords = getStoredBibleWords;
export const saveBibleWords = saveStoredBibleWords;
export const loadStories = getStoredStories;
export const saveStories = saveStoredStories;
export const loadGardenPlots = getStoredGardenPlots;
export const saveGardenPlots = saveStoredGardenPlots;
export const loadGardenPets = getStoredGardenPets;
export const saveGardenPets = saveStoredGardenPets;
export const loadBadges = getStoredBadges;
export const saveBadges = saveStoredBadges;
export const loadAssessments = getStoredWeeklyAssessments;
export const saveAssessments = saveStoredWeeklyAssessments;
export const loadBooks = getStoredBooks;
export const saveBooks = saveStoredBooks;
export const loadReadingSessions = getStoredReadingSessions;
export const saveReadingSessions = saveStoredReadingSessions;

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
  BookRecord,
  ThemeId
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

const INITIAL_BOOKS: BookRecord[] = [];

const INITIAL_READING_SESSIONS: ReadingSession[] = [];

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
  return INITIAL_WONDERS_VOCABULARY.map((w) => ({
    ...w,
    timesPracticed: 0,
    correctCount: 0,
    incorrectCount: 0,
    mastered: false,
    masteryLevel: 'new'
  }));
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

export const createFreshProfile = (
  name = 'Young Explorer',
  avatar = '🌸',
  theme: ThemeId = 'pink_garden'
): UserProfile => ({
  id: `prof-${Date.now()}`,
  name,
  avatar,
  level: 1,
  xp: 0,
  streak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  weeklyGoalCompleted: 0,
  weeklyGoalTotal: 15,
  soundEnabled: true,
  speechSpeed: 0.85,
  currentPathLevel: 1,
  theme,
  learningLevel: 'elementary',
  interests: ['🌸 Gardens', '📚 Reading'],
  dailyReadingGoalMinutes: 15,
  readingStreak: 0,
  longestReadingStreak: 0,
  totalReadingMinutes: 0,
  totalReadingSessions: 0,
  lastReadingDate: '',
  onboardingCompleted: false,
  initialAssessmentCompleted: false
});

export const DEFAULT_PROFILE: UserProfile = createFreshProfile();

export const getStoredProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Clean up legacy test profile "Sophia" so user starts fresh
      if (parsed.id === 'prof-default' || parsed.name === 'Sophia') {
        localStorage.removeItem(STORAGE_KEYS.PROFILE);
        localStorage.removeItem(STORAGE_KEYS.BOOKS);
        localStorage.removeItem(STORAGE_KEYS.READING_SESSIONS);
        localStorage.removeItem(STORAGE_KEYS.WEEKLY_CHECKS);
        localStorage.removeItem(STORAGE_KEYS.VOCAB);
        return createFreshProfile();
      }
      return { ...createFreshProfile(), ...parsed };
    }
  } catch {
    // ignore
  }
  return createFreshProfile();
};

export const saveStoredProfile = (profile: UserProfile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch {
    // ignore
  }
};

export const clearAllLocalUserData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem('bloomword_is_guest');
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
  return [];
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

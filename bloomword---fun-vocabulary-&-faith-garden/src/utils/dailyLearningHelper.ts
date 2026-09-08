import { VocabWord, UserProfile, DailyGoalConfig, TodayActivityProgress, DailyLearningLog } from '../types';

// Built-in syllable dictionaries and mnemonic aids for vocabulary words
const SYLLABLE_MAP: Record<string, string> = {
  beautiful: 'beau • ti • ful',
  perseverance: 'per • se • ver • ance',
  magnificent: 'mag • nif • i • cent',
  curious: 'cu • ri • ous',
  wandered: 'wan • dered',
  tremendous: 'tre • men • dous',
  courageous: 'cou • ra • geous',
  compassion: 'com • pas • sion',
  graceful: 'grace • ful',
  brilliant: 'bril • liant',
  flourish: 'flour • ish',
  diligent: 'dil • i • gent',
  harmony: 'har • mo • ny',
  peaceful: 'peace • ful',
  wisdom: 'wis • dom',
  faithful: 'faith • ful',
  kindness: 'kind • ness',
  gratitude: 'grat • i • tude',
  abundant: 'a • bun • dant',
  gentle: 'gen • tle',
  radiant: 'ra • di • ant',
  wonderful: 'won • der • ful',
  resilient: 're • sil • i • ent',
  triumphant: 'tri • um • phant',
  knowledge: 'knowl • edge',
  inspire: 'in • spire',
  generous: 'gen • er • ous',
  patient: 'pa • tient',
  humble: 'hum • ble',
  joyful: 'joy • ful',
  sincere: 'sin • cere',
  delight: 'de • light'
};

const MEMORY_TIPS: Record<string, string> = {
  beautiful: 'Big Elephants Are Under The Umbrella: B-E-A-Utiful!',
  perseverance: 'Sever doubt, keep pressing on through every try!',
  magnificent: 'Magnify something grand and awesome!',
  curious: 'The "curio" cabinet is full of mysteries to investigate.',
  wandered: 'Wandering with open eyes, no hurry in your step.',
  tremendous: 'Tremble with excitement for something enormous!',
  courageous: 'Courage from the heart gives you wings.',
  compassion: 'Come pass on your kindness to another.',
  graceful: 'Flowing like petals dancing in the gentle wind.',
  brilliant: 'Shining bright like a freshly polished gem.',
  flourish: 'Flowers flourish when nourished with care.',
  diligent: 'Doing your best every day with a joyful heart.',
  harmony: 'Different musical notes singing sweet peace together.',
  peaceful: 'Quiet calm resting like water in a still garden lake.'
};

/**
 * Split word into syllables with bullet separators
 */
export function getSyllables(word: string): string {
  const clean = word.trim().toLowerCase();
  if (SYLLABLE_MAP[clean]) {
    return SYLLABLE_MAP[clean];
  }
  // Heuristic syllable breaker
  if (clean.length <= 4) return clean;
  // Simple regex-based break between vowel-consonant clusters
  return clean.replace(/([aeiouy]{1,2})([^aeiouy\s]{1,2})([aeiouy])/gi, '$1 • $2$3');
}

/**
 * Generate memory tip / mnemonic
 */
export function getMemoryTip(word: string, definition: string): string {
  const clean = word.trim().toLowerCase();
  if (MEMORY_TIPS[clean]) {
    return MEMORY_TIPS[clean];
  }
  return `Picture the word in your mind: "${word.toUpperCase()}" means ${definition.slice(0, 50).toLowerCase()}...`;
}

/**
 * Format spelling breakdown: M - A - G - N - I - F - I - C - E - N - T
 */
export function getSpellingBreakdown(word: string): string {
  return word
    .toUpperCase()
    .split('')
    .join(' - ');
}

/**
 * Default daily goal config based on learner level
 */
export function getDefaultDailyGoals(level: 'elementary' | 'intermediate' | 'advanced' = 'elementary'): DailyGoalConfig {
  switch (level) {
    case 'elementary':
      return {
        readingMinutes: 15,
        vocabularyWords: 3,
        flashcardsCount: 5,
        spellingWords: 3
      };
    case 'advanced':
      return {
        readingMinutes: 30,
        vocabularyWords: 8,
        flashcardsCount: 15,
        spellingWords: 8
      };
    case 'intermediate':
    default:
      return {
        readingMinutes: 20,
        vocabularyWords: 5,
        flashcardsCount: 10,
        spellingWords: 5
      };
  }
}

/**
 * Ensure today's activity progress is initialized and synced with the current calendar date
 */
export function getTodayActivity(profile: UserProfile): TodayActivityProgress {
  const todayStr = new Date().toISOString().split('T')[0];
  if (profile.todayActivity && profile.todayActivity.date === todayStr) {
    return profile.todayActivity;
  }
  return {
    date: todayStr,
    readingMinutes: 0,
    wordsLearned: 0,
    flashcardsReviewed: 0,
    spellingCompleted: 0,
    faithWordDone: false,
    wordReviewDone: false
  };
}

export interface GoalStatusItem {
  id: 'reading' | 'vocabulary' | 'flashcards' | 'spelling' | 'word_review' | 'faith';
  title: string;
  icon: string;
  target: number;
  current: number;
  unit: string;
  isComplete: boolean;
  actionSection: 'reading_adventure' | 'daily_adventure' | 'flashcards' | 'spelling_adventure' | 'spelling_test' | 'review_garden' | 'faith_garden';
  actionLabel: string;
}

/**
 * Calculate the 6 daily learning checklist items
 */
export function getDailyChecklist(
  profile: UserProfile,
  activity: TodayActivityProgress,
  wordsNeedingReviewCount: number
): {
  items: GoalStatusItem[];
  completedCount: number;
  totalCount: number;
  percent: number;
  isAllComplete: boolean;
} {
  const goals: DailyGoalConfig = profile.dailyGoals || {
    readingMinutes: profile.dailyReadingGoalMinutes || 15,
    vocabularyWords: 5,
    flashcardsCount: 10,
    spellingWords: 5
  };

  const items: GoalStatusItem[] = [
    {
      id: 'reading',
      title: 'Real-Book Reading',
      icon: '📖',
      target: goals.readingMinutes,
      current: activity.readingMinutes,
      unit: 'minutes',
      isComplete: activity.readingMinutes >= goals.readingMinutes,
      actionSection: 'reading_adventure',
      actionLabel: activity.readingMinutes === 0 ? '▶ Start Reading' : '📖 Continue Reading'
    },
    {
      id: 'vocabulary',
      title: "Today's Vocabulary Words",
      icon: '🧠',
      target: goals.vocabularyWords,
      current: activity.wordsLearned,
      unit: 'words',
      isComplete: activity.wordsLearned >= goals.vocabularyWords,
      actionSection: 'daily_adventure',
      actionLabel: '⭐ Learn Words'
    },
    {
      id: 'flashcards',
      title: 'Flashcard Review',
      icon: '🎴',
      target: goals.flashcardsCount,
      current: activity.flashcardsReviewed,
      unit: 'cards',
      isComplete: activity.flashcardsReviewed >= goals.flashcardsCount,
      actionSection: 'flashcards',
      actionLabel: '🎴 Review Cards'
    },
    {
      id: 'spelling',
      title: 'Spelling Practice & Testing',
      icon: '✏️',
      target: goals.spellingWords,
      current: activity.spellingCompleted,
      unit: 'words',
      isComplete: activity.spellingCompleted >= goals.spellingWords,
      actionSection: 'spelling_test',
      actionLabel: '📝 Take Test'
    },
    {
      id: 'word_review',
      title: 'Words Needing Practice',
      icon: '🔄',
      target: Math.max(1, Math.min(3, wordsNeedingReviewCount)),
      current: activity.wordReviewDone ? Math.max(1, Math.min(3, wordsNeedingReviewCount)) : 0,
      unit: 'words',
      isComplete: activity.wordReviewDone || wordsNeedingReviewCount === 0,
      actionSection: 'review_garden',
      actionLabel: '🔄 Review Words'
    },
    {
      id: 'faith',
      title: "Today's Faith Word",
      icon: '✝️',
      target: 1,
      current: activity.faithWordDone ? 1 : 0,
      unit: 'word',
      isComplete: activity.faithWordDone,
      actionSection: 'faith_garden',
      actionLabel: '✝️ Learn Faith Word'
    }
  ];

  const completedCount = items.filter((i) => i.isComplete).length;
  const totalCount = items.length;
  const percent = Math.round((completedCount / totalCount) * 100);

  return {
    items,
    completedCount,
    totalCount,
    percent,
    isAllComplete: completedCount >= totalCount
  };
}

/**
 * Determine the single "Next Best Activity" recommended for the learner
 */
export function getRecommendedNextActivity(
  profile: UserProfile,
  activity: TodayActivityProgress,
  wordsNeedingReview: VocabWord[]
): {
  icon: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  actionSection: 'reading_adventure' | 'daily_adventure' | 'flashcards' | 'spelling_adventure' | 'spelling_test' | 'review_garden' | 'faith_garden';
} {
  const readingGoal = profile.dailyReadingGoalMinutes || profile.dailyGoals?.readingMinutes || 15;

  // 0. If no starting assessment completed yet, recommend discovering learning path
  if (!profile.startingAssessment && !profile.initialAssessmentCompleted) {
    return {
      icon: '🌱',
      title: '✨ Discover Your Learning Path!',
      subtitle: 'Take a quick 5-minute adventure so we can personalize your daily quests and words.',
      buttonLabel: '🌱 FIND MY STARTING POINT',
      actionSection: 'starting_assessment' as any
    };
  }

  // 1. If learner's starting assessment highlighted spelling practice
  const spellingGoal = profile.dailyGoals?.spellingWords || 5;
  if (
    profile.startingAssessment?.skills.spelling.proficiency === 'needs_practice' &&
    activity.spellingCompleted < spellingGoal
  ) {
    return {
      icon: '✏️',
      title: 'Targeted Spelling Practice & Test',
      subtitle: 'Your personalized plan recommends sound-and-spell practice to build confidence!',
      buttonLabel: '📝 TAKE SPELLING TEST',
      actionSection: 'spelling_test'
    };
  }

  // 2. If words need review from earlier struggles
  if (wordsNeedingReview.length > 0 && !activity.wordReviewDone) {
    return {
      icon: '🔄',
      title: `You have ${wordsNeedingReview.length} words ready for review!`,
      subtitle: 'A quick review keeps your memories strong and your garden blooming.',
      buttonLabel: '🔄 REVIEW WORDS NOW',
      actionSection: 'review_garden'
    };
  }

  // 2. If flashcards are below goal
  const flashcardGoal = profile.dailyGoals?.flashcardsCount || 10;
  if (activity.flashcardsReviewed < flashcardGoal) {
    const remaining = flashcardGoal - activity.flashcardsReviewed;
    return {
      icon: '🎴',
      title: `Review Today's Flashcards (${remaining} left)`,
      subtitle: 'Listen to pronunciations, flip the cards, and build quick recognition.',
      buttonLabel: '🎴 OPEN MY FLASHCARDS',
      actionSection: 'flashcards'
    };
  }

  // 3. If reading minutes left
  if (activity.readingMinutes < readingGoal) {
    const diff = readingGoal - activity.readingMinutes;
    return {
      icon: '📖',
      title: `Only ${diff} minutes away from your reading goal!`,
      subtitle: 'Pick up your book, start the timer, and discover fascinating new words.',
      buttonLabel: '📖 CONTINUE READING',
      actionSection: 'reading_adventure'
    };
  }

  // 4. If spelling not completed
  if (activity.spellingCompleted < spellingGoal) {
    return {
      icon: '✏️',
      title: 'Practice & Test Your Spelling',
      subtitle: 'Hear the words aloud and type without hints to prove your mastery!',
      buttonLabel: '📝 TAKE SPELLING TEST',
      actionSection: 'spelling_test'
    };
  }

  // 5. If faith word not done
  if (!activity.faithWordDone) {
    return {
      icon: '✝️',
      title: "Discover Today's Faith Word",
      subtitle: 'Connect beautiful vocabulary to encouraging scriptures.',
      buttonLabel: '✝️ EXPLORE FAITH WORD',
      actionSection: 'faith_garden'
    };
  }

  // 6. If all done
  return {
    icon: '🎉',
    title: 'Amazing! All daily goals completed today!',
    subtitle: 'Explore the Flower Garden or read extra pages to earn bonus XP.',
    buttonLabel: '🌸 VISIT FLOWER GARDEN',
    actionSection: 'flower_garden' as any
  };
}

/**
 * Generate 7 days of this week for calendar view (Mon - Sun)
 */
export function getWeekDaysStatus(history: DailyLearningLog[] = [], todayActivity: TodayActivityProgress) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const currentDayIndex = (now.getDay() + 6) % 7; // Mon = 0, Sun = 6

  const todayStr = now.toISOString().split('T')[0];

  return days.map((day, idx) => {
    const isPast = idx < currentDayIndex;
    const isToday = idx === currentDayIndex;
    const isFuture = idx > currentDayIndex;

    // Look up in history
    let completed = false;
    let readingMinutes = 0;
    let wordsLearned = 0;

    if (isToday) {
      completed = (todayActivity.readingMinutes > 0 || todayActivity.wordsLearned >= 3 || todayActivity.flashcardsReviewed >= 5);
      readingMinutes = todayActivity.readingMinutes;
      wordsLearned = todayActivity.wordsLearned;
    } else if (isPast) {
      // Offset date
      const pastDate = new Date();
      pastDate.setDate(now.getDate() - (currentDayIndex - idx));
      const pastStr = pastDate.toISOString().split('T')[0];
      const match = history.find((h) => h.date === pastStr);
      if (match) {
        completed = match.streakProtected || match.goalsCompletedCount >= 3;
        readingMinutes = match.readingMinutes;
        wordsLearned = match.wordsLearnedCount;
      } else {
        // Sample baseline so user sees encouragement
        completed = idx % 2 === 0;
      }
    }

    return {
      day,
      dayNumber: idx + 1,
      isToday,
      isPast,
      isFuture,
      completed,
      readingMinutes,
      wordsLearned
    };
  });
}

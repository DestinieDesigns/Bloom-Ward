export type MasteryLevel = 'new' | 'learning' | 'growing' | 'almost_mastered' | 'mastered';

export type ThemeId =
  | 'pink_garden'
  | 'nature_adventure'
  | 'space_explorer'
  | 'fantasy_kingdom'
  | 'animal_world'
  | 'ocean_adventure'
  | 'game_zone';

export type LearningLevel = 'elementary' | 'intermediate' | 'advanced';

export interface VocabWord {
  id: string;
  word: string;
  definition: string;
  pronunciation: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb';
  exampleSentence: string;
  synonyms: string[];
  antonyms?: string[];
  difficulty: 'easy' | 'medium' | 'challenging';
  category: string;
  gradeLevel: number;
  mastered: boolean;
  masteryLevel: MasteryLevel;
  timesPracticed: number;
  correctCount: number;
  incorrectCount: number;
  lastPracticedDate: string | null;
  isCustom?: boolean;
  source?: string;
  notes?: string;
  // Reading Discovery & Homework integration
  sourceType?: 'standard' | 'reading' | 'homework' | 'custom';
  bookTitle?: string;
  bookAuthor?: string;
  bookPage?: number;
  contextSentence?: string;
  dateDiscovered?: string;
  isHomework?: boolean;
  homeworkTag?: string;
}

export interface ReadingSession {
  id: string;
  date: string;
  bookTitle: string;
  bookAuthor?: string;
  startPage?: number;
  endPage?: number;
  minutesRead: number;
  targetMinutes: number;
  wordsDiscovered: string[]; // list of words found
  xpEarned: number;
  theme: ThemeId;
}

export interface BookRecord {
  id: string;
  title: string;
  author?: string;
  totalMinutesRead: number;
  sessionsCount: number;
  wordsDiscoveredCount: number;
  status: 'reading' | 'completed';
  lastReadDate: string;
  rating?: number;
}

export interface BibleChallenge {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BibleWord {
  id: string;
  word: string;
  pronunciation: string;
  childDefinition: string;
  scriptureReference: string;
  scriptureVerse: string;
  realLifeExample: string;
  quickChallenges: BibleChallenge[];
  mastered: boolean;
  timesPracticed: number;
  correctCount: number;
  lastPracticedDate: string | null;
}

export interface ReadingQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ReadingStory {
  id: string;
  title: string;
  subtitle: string;
  theme: string;
  icon: string;
  passage: string;
  vocabularyFocus: string[]; // word IDs or words
  questions: ReadingQuestion[];
  completed: boolean;
  bestScore?: number;
}

export type ActivityType =
  | 'match_word'
  | 'spell_word'
  | 'choose_meaning'
  | 'fill_blank'
  | 'word_builder'
  | 'hear_choose'
  | 'definition_detective'
  | 'sentence_builder';

export interface GardenPlot {
  id: string;
  name: string;
  flowerType: string;
  color: string;
  stage: 1 | 2 | 3 | 4; // 1: seed/sprout, 2: budding, 3: blooming, 4: magical sparkling flower
  unlocked: boolean;
  unlockedAtXp?: number;
  petalCount: number;
  specialAccessory?: string; // 'bow', 'sparkle', 'butterfly', 'bee'
}

export interface GardenPet {
  id: string;
  name: string;
  emoji: string;
  title: string;
  unlocked: boolean;
  unlockCondition: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'words' | 'spelling' | 'streak' | 'reading' | 'bible' | 'mastery';
  unlocked: boolean;
  unlockedDate?: string;
}

export interface WeeklyAssessmentResult {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  strengths: string[];
  areasToPractice: string[];
  wordsTested: string[];
}

export interface UserProfile {
  id?: string;
  accountId?: string;
  name: string;
  avatar: string; // emoji or avatar id
  level: number;
  xp: number;
  streak: number;
  lastActiveDate: string;
  weeklyGoalCompleted: number;
  weeklyGoalTotal: number;
  soundEnabled: boolean;
  speechSpeed: number;
  currentPathLevel: number;
  // Personalization & Reading Journey
  theme: ThemeId;
  learningLevel: LearningLevel;
  interests: string[];
  dailyReadingGoalMinutes: number; // default 15
  readingStreak: number;
  longestReadingStreak: number;
  totalReadingMinutes: number;
  totalReadingSessions: number;
  lastReadingDate: string | null;
  onboardingCompleted: boolean;
  initialAssessmentCompleted?: boolean;
  startingLevelAssessed?: LearningLevel;
  isParentProtected?: boolean;
  parentPin?: string;
}

export type AppSection =
  | 'home'
  | 'reading_adventure'
  | 'daily_adventure'
  | 'learning_path'
  | 'spelling_adventure'
  | 'reading_room'
  | 'faith_garden'
  | 'review_garden'
  | 'dictionary'
  | 'garden'
  | 'flower_garden'
  | 'weekly_check'
  | 'parent_dashboard'
  | 'profile';

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
  // Enhanced Daily Learning, Flashcard & Spelling Tracking
  syllables?: string;
  memoryTip?: string;
  spellingBreakdown?: string;
  confidenceRating?: 'learning' | 'getting_it' | 'known';
  spellingAttempts?: number;
  spellingCorrectAttempts?: number;
  spellingTrueTestCorrect?: number;
  spellingTrueTestAttempts?: number;
  spellingMasteryStage?: 'introduced' | 'studying' | 'practicing' | 'testing' | 'growing' | 'mastered';
  lastSpellingTestDate?: string;
  needsReview?: boolean;
  flashcardReviewCount?: number;
  lastFlashcardDate?: string;
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

export interface DailyGoalConfig {
  readingMinutes: number; // 15, 30, 60
  vocabularyWords: number; // 3, 5, 10
  flashcardsCount: number; // 5, 10, 20
  spellingWords: number; // 3, 5, 10
}

export interface DailyLearningLog {
  date: string; // YYYY-MM-DD
  readingMinutes: number;
  wordsLearnedCount: number;
  flashcardsReviewedCount: number;
  spellingWordsTestedCount: number;
  faithWordCompleted: boolean;
  goalsCompletedCount: number;
  totalGoalsCount: number;
  streakProtected: boolean;
  xpEarned: number;
}

export interface TodayActivityProgress {
  date: string;
  readingMinutes: number;
  wordsLearned: number;
  flashcardsReviewed: number;
  spellingCompleted: number;
  faithWordDone: boolean;
  wordReviewDone: boolean;
}

export type StartingPathId =
  | 'word_explorer'
  | 'word_builder'
  | 'word_adventurer'
  | 'word_scholar'
  | 'word_master';

export type SkillProficiency = 'needs_practice' | 'growing' | 'strong';

export interface CategoryResult {
  category: 'vocabulary' | 'definitions' | 'spelling' | 'reading' | 'recognition';
  title: string;
  score: number;
  total: number;
  proficiency: SkillProficiency; // 'needs_practice' | 'growing' | 'strong'
  strengths: string[];
  growthAreas: string[];
}

export interface StartingAssessmentResult {
  completedAt: string;
  startingPath: StartingPathId;
  pathTitle: string;
  pathDescription: string;
  icon: string;
  overallScorePercent: number;
  skills: {
    vocabulary: CategoryResult;
    definitions: CategoryResult;
    spelling: CategoryResult;
    reading: CategoryResult;
    recognition: CategoryResult;
  };
  recommendedGoals: DailyGoalConfig;
  personalizedStrengths: string[];
  personalizedGrowthAreas: string[];
  isGrowthCheckpoint?: boolean;
  baselineComparison?: {
    vocabularyGrowth: string;
    spellingGrowth: string;
    readingGrowth: string;
    overallGrowthNote: string;
  };
}

export interface AssessmentSaveState {
  currentCategoryIndex: number;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  categoryStats: Record<string, { correct: number; total: number }>;
  lastUpdated: string;
}

export interface UserProfile {
  id?: string;
  accountId?: string;
  name: string;
  avatar: string; // emoji or avatar id
  level: number;
  xp: number;
  streak: number;
  longestStreak?: number;
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
  // Daily Learning Tracker System
  dailyGoals?: DailyGoalConfig;
  todayActivity?: TodayActivityProgress;
  learningHistory?: DailyLearningLog[];
  // Starting Assessment & Personalized Learning Placement
  startingAssessment?: StartingAssessmentResult;
  startingAssessmentHistory?: StartingAssessmentResult[];
  assessmentSaveState?: AssessmentSaveState | null;
  // Learning Home & Decorating Reward System
  learningHomeState?: UserLearningHomeState;
}

export type HomeRoomId =
  | 'main_room'
  | 'reading_room'
  | 'creative_room'
  | 'knowledge_garden'
  | 'dream_room'
  | 'grand_library';

export type ItemCategory =
  | 'furniture'
  | 'decoration'
  | 'sticker'
  | 'companion'
  | 'special';

export type HomeStyleTheme =
  | 'pink_garden'
  | 'ocean_adventure'
  | 'space_explorer'
  | 'animal_world'
  | 'fantasy_world'
  | 'cozy_modern';

export interface PlacedHomeItem {
  instanceId: string;
  itemId: string;
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  scale: number; // 0.7 to 1.8
  rotation: number; // 0, 90, 180, 270 degrees
  zIndex: number;
}

export interface HomeItem {
  id: string;
  name: string;
  category: ItemCategory;
  icon: string; // emoji representation
  visualStyle?: HomeStyleTheme | 'general';
  description: string;
  unlocked: boolean;
  unlockCondition: string;
  unlockSource: 'starter' | 'reading' | 'vocabulary' | 'spelling' | 'flashcards' | 'streak' | 'word_mastery' | 'milestone';
  associatedWord?: string;
  defaultScale?: number;
  isResizable?: boolean;
  isRotatable?: boolean;
  interactiveType?: 'reading_corner' | 'knowledge_desk' | 'spelling_station' | 'faith_corner' | 'companion_pet' | 'knowledge_flower';
  interactiveData?: {
    title?: string;
    description?: string;
    targetSection?: AppSection;
    petName?: string;
    petDialogue?: string;
    word?: string;
    definition?: string;
  };
}

export interface HomeRoom {
  id: HomeRoomId;
  name: string;
  subtitle: string;
  icon: string;
  unlocked: boolean;
  unlockRequirement: string;
  unlockRequirementMet: boolean;
  currentProgress?: number;
  maxProgress?: number;
  styleTheme: HomeStyleTheme;
  wallpaperClass: string;
  flooringClass: string;
  placedItems: PlacedHomeItem[];
}

export type StickerCategory =
  | 'learning'
  | 'reading'
  | 'spelling'
  | 'faith'
  | 'special_event';

export interface StickerItem {
  id: string;
  name: string;
  icon: string;
  category: StickerCategory;
  description: string;
  unlockCondition: string;
  unlocked: boolean;
  unlockedDate?: string;
  associatedWord?: string;
  rarity?: 'common' | 'rare' | 'sparkling' | 'legendary';
}

export type FlowerSpecies =
  | 'rose'
  | 'sunflower'
  | 'lotus'
  | 'tulip'
  | 'daisy'
  | 'orchid'
  | 'lavender'
  | 'wildflower';

export interface KnowledgeGardenWordPlant {
  wordId: string;
  word: string;
  definition: string;
  syllables?: string;
  partOfSpeech?: string;
  exampleSentence?: string;
  stage: 'seed' | 'sprout' | 'blossom' | 'permanent_flower';
  flowerEmoji: string;
  flowerColor: string;
  flowerSpecies?: FlowerSpecies;
  growthPercent?: number;
  masteryTitle?: string;
  category?: string;
  masteryLevel?: MasteryLevel;
  confidenceRating?: 'learning' | 'getting_it' | 'known';
  masteryDate?: string;
  timesPracticed: number;
}

export interface UserLearningHomeState {
  activeRoomId: HomeRoomId;
  rooms: Record<HomeRoomId, HomeRoom>;
  unlockedItemIds: string[];
  collectedStickerIds: string[];
  lastEarnedGift?: {
    item: HomeItem;
    reason: string;
    date: string;
  };
}

export type AppSection =
  | 'home'
  | 'learning_home'
  | 'sticker_book'
  | 'starting_assessment'
  | 'daily_tracker'
  | 'flashcards'
  | 'spelling_adventure'
  | 'spelling_test'
  | 'reading_adventure'
  | 'daily_adventure'
  | 'learning_path'
  | 'reading_room'
  | 'faith_garden'
  | 'review_garden'
  | 'dictionary'
  | 'garden'
  | 'flower_garden'
  | 'weekly_check'
  | 'parent_dashboard'
  | 'profile';

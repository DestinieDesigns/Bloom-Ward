import {
  CategoryResult,
  StartingAssessmentResult,
  StartingPathId,
  SkillProficiency,
  DailyGoalConfig,
  UserProfile,
  AssessmentSaveState
} from '../types';
import {
  STARTING_PATHS,
  VOCABULARY_QUESTIONS,
  DEFINITION_QUESTIONS,
  SPELLING_QUESTIONS,
  READING_PASSAGES,
  RECOGNITION_QUESTIONS,
  AssessmentQuestion
} from '../data/startingAssessmentQuestions';

const SAVE_KEY_PREFIX = 'bloomword_starting_assessment_save_';

export function getAssessmentSaveKey(profileId?: string): string {
  return `${SAVE_KEY_PREFIX}${profileId || 'default'}`;
}

export function saveAssessmentProgress(
  profileId: string | undefined,
  saveState: AssessmentSaveState
): void {
  try {
    localStorage.setItem(getAssessmentSaveKey(profileId), JSON.stringify(saveState));
  } catch {
    // storage fallback
  }
}

export function loadAssessmentProgress(
  profileId: string | undefined
): AssessmentSaveState | null {
  try {
    const raw = localStorage.getItem(getAssessmentSaveKey(profileId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAssessmentProgress(profileId: string | undefined): void {
  try {
    localStorage.removeItem(getAssessmentSaveKey(profileId));
  } catch {
    // storage fallback
  }
}

export interface AssessmentSectionConfig {
  category: 'vocabulary' | 'definitions' | 'spelling' | 'reading' | 'recognition';
  title: string;
  friendlyTitle: string;
  icon: string;
  description: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export const ASSESSMENT_SECTIONS: AssessmentSectionConfig[] = [
  {
    category: 'vocabulary',
    title: 'Vocabulary Knowledge',
    friendlyTitle: '📚 Word Meanings',
    icon: '📚',
    description: 'Let’s explore everyday and exciting words you know!',
    accentColor: 'indigo',
    badgeBg: 'bg-indigo-50',
    badgeBorder: 'border-indigo-200',
    badgeText: 'text-indigo-700'
  },
  {
    category: 'definitions',
    title: 'Definitions',
    friendlyTitle: '💬 Definition Detective',
    icon: '💬',
    description: 'Read the clue and choose the word that matches the meaning!',
    accentColor: 'purple',
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-700'
  },
  {
    category: 'spelling',
    title: 'Spelling',
    friendlyTitle: '✏️ Sound & Spell',
    icon: '✏️',
    description: 'Listen to the word aloud and type how you believe it is spelled!',
    accentColor: 'rose',
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200',
    badgeText: 'text-rose-700'
  },
  {
    category: 'reading',
    title: 'Reading Comprehension',
    friendlyTitle: '📖 Story Explorer',
    icon: '📖',
    description: 'Read a short heartwarming story and answer a few friendly questions.',
    accentColor: 'emerald',
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-700'
  },
  {
    category: 'recognition',
    title: 'Word Recognition & Listening',
    friendlyTitle: '🔊 Listening Ear',
    icon: '🔊',
    description: 'Listen closely to the speaker and choose the matching word you hear!',
    accentColor: 'amber',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-700'
  }
];

export function getAdaptiveQuestion(
  category: 'vocabulary' | 'definitions' | 'spelling' | 'reading' | 'recognition',
  answeredCount: number,
  consecutiveCorrect: number,
  targetTierHint: 1 | 2 | 3 = 1
): AssessmentQuestion {
  // Determine adaptive tier based on consecutive correct and answered count
  let targetTier: 1 | 2 | 3 = 1;
  if (consecutiveCorrect >= 2) {
    targetTier = targetTierHint === 1 ? 2 : 3;
  } else if (consecutiveCorrect <= -1) {
    targetTier = 1;
  } else {
    targetTier = targetTierHint;
  }

  let pool: AssessmentQuestion[] = [];
  switch (category) {
    case 'vocabulary':
      pool = VOCABULARY_QUESTIONS;
      break;
    case 'definitions':
      pool = DEFINITION_QUESTIONS;
      break;
    case 'spelling':
      pool = SPELLING_QUESTIONS;
      break;
    case 'recognition':
      pool = RECOGNITION_QUESTIONS;
      break;
    case 'reading':
      // Handled via passage questions
      pool = READING_PASSAGES[0].questions;
      break;
  }

  // Filter by target tier first, or fallback to pool
  const tierQuestions = pool.filter((q) => q.tier === targetTier);
  const questionsToPick = tierQuestions.length > 0 ? tierQuestions : pool;
  const index = answeredCount % questionsToPick.length;
  return questionsToPick[index];
}

export function computeAssessmentResults(
  categoryStats: Record<string, { correct: number; total: number }>,
  isGrowthCheckpoint: boolean = false,
  previousBaseline?: StartingAssessmentResult
): StartingAssessmentResult {
  const getProficiency = (correct: number, total: number): SkillProficiency => {
    if (total === 0) return 'growing';
    const pct = correct / total;
    if (pct >= 0.75) return 'strong';
    if (pct >= 0.4) return 'growing';
    return 'needs_practice';
  };

  // Build each category result
  const vocabStats = categoryStats['vocabulary'] || { correct: 2, total: 3 };
  const defStats = categoryStats['definitions'] || { correct: 2, total: 3 };
  const spellStats = categoryStats['spelling'] || { correct: 2, total: 3 };
  const readStats = categoryStats['reading'] || { correct: 2, total: 3 };
  const recStats = categoryStats['recognition'] || { correct: 2, total: 3 };

  const vocabProficiency = getProficiency(vocabStats.correct, vocabStats.total);
  const defProficiency = getProficiency(defStats.correct, defStats.total);
  const spellProficiency = getProficiency(spellStats.correct, spellStats.total);
  const readProficiency = getProficiency(readStats.correct, readStats.total);
  const recProficiency = getProficiency(recStats.correct, recStats.total);

  const skills = {
    vocabulary: {
      category: 'vocabulary' as const,
      title: 'Vocabulary Knowledge',
      score: vocabStats.correct,
      total: vocabStats.total,
      proficiency: vocabProficiency,
      strengths: vocabProficiency === 'strong'
        ? ['Understands core multi-syllable words', 'Quick word meaning grasp']
        : ['Eager curiosity for new words'],
      growthAreas: vocabProficiency === 'needs_practice'
        ? ['Encountering descriptive adjectives', 'Learning word roots']
        : ['Exploring richer literature vocabulary']
    },
    definitions: {
      category: 'definitions' as const,
      title: 'Definitions & Context',
      score: defStats.correct,
      total: defStats.total,
      proficiency: defProficiency,
      strengths: defProficiency === 'strong'
        ? ['Decodes meaning clues quickly', 'Connects synonyms accurately']
        : ['Notices meaning themes'],
      growthAreas: defProficiency === 'needs_practice'
        ? ['Matching definitions to target words', 'Context clue practice']
        : ['Nuanced shade of meaning distinctions']
    },
    spelling: {
      category: 'spelling' as const,
      title: 'Spelling Ability',
      score: spellStats.correct,
      total: spellStats.total,
      proficiency: spellProficiency,
      strengths: spellProficiency === 'strong'
        ? ['Solid phonemic sound mapping', 'Smooth syllable division']
        : ['Sounding out beginning and ending letters'],
      growthAreas: spellProficiency === 'needs_practice'
        ? ['Tricky vowel patterns (e.g., -igh, -our)', 'Multi-syllable endings']
        : ['Advanced literature word spelling patterns']
    },
    reading: {
      category: 'reading' as const,
      title: 'Reading Comprehension',
      score: readStats.correct,
      total: readStats.total,
      proficiency: readProficiency,
      strengths: readProficiency === 'strong'
        ? ['Pinpoints main ideas and details', 'Infers character motivations']
        : ['Follows story sequence nicely'],
      growthAreas: readProficiency === 'needs_practice'
        ? ['Inferring deeper story meaning', 'Vocabulary in context']
        : ['Analyzing complex chapter passages']
    },
    recognition: {
      category: 'recognition' as const,
      title: 'Word Recognition & Listening',
      score: recStats.correct,
      total: recStats.total,
      proficiency: recProficiency,
      strengths: recProficiency === 'strong'
        ? ['Sharp auditory word recognition', 'Distinguishes close phonetic sounds']
        : ['Attentive listening skills'],
      growthAreas: recProficiency === 'needs_practice'
        ? ['Pairing spoken words with printed spellings']
        : ['Recognizing rare academic terms']
    }
  };

  // Compute overall percentage
  const totalCorrect =
    vocabStats.correct +
    defStats.correct +
    spellStats.correct +
    readStats.correct +
    recStats.correct;
  const totalQuestions =
    vocabStats.total +
    defStats.total +
    spellStats.total +
    readStats.total +
    recStats.total;
  const overallScorePercent =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 75;

  // Determine starting path
  let startingPath: StartingPathId = 'word_builder';
  if (overallScorePercent >= 90) {
    startingPath = 'word_master';
  } else if (overallScorePercent >= 75) {
    startingPath = 'word_scholar';
  } else if (overallScorePercent >= 60) {
    startingPath = 'word_adventurer';
  } else if (overallScorePercent >= 40) {
    startingPath = 'word_builder';
  } else {
    startingPath = 'word_explorer';
  }

  const pathDef = STARTING_PATHS[startingPath];

  // Personalize strengths and growth areas based on the 5 categories
  const personalizedStrengths: string[] = [];
  const personalizedGrowthAreas: string[] = [];

  if (vocabProficiency === 'strong') {
    personalizedStrengths.push('🌟 Understanding common and descriptive words');
  }
  if (defProficiency === 'strong') {
    personalizedStrengths.push('🌟 Connecting definitions to the right meaning');
  }
  if (readProficiency === 'strong') {
    personalizedStrengths.push('🌟 Finding main ideas and details in reading passages');
  }
  if (recProficiency === 'strong') {
    personalizedStrengths.push('🌟 Recognizing spoken words and pronunciation clearly');
  }
  if (spellProficiency === 'strong') {
    personalizedStrengths.push('🌟 Sounding out and spelling words accurately');
  }

  // Fallback strengths if all are growing
  if (personalizedStrengths.length === 0) {
    personalizedStrengths.push('🌟 Great curiosity and willingness to explore');
    personalizedStrengths.push('🌟 Attentive reading and listening effort');
  }

  // Growth areas
  if (spellProficiency === 'needs_practice') {
    personalizedGrowthAreas.push('🌱 Spelling practice with letter patterns and syllables');
  }
  if (vocabProficiency === 'needs_practice') {
    personalizedGrowthAreas.push('🌱 Learning exciting new everyday vocabulary words');
  }
  if (defProficiency === 'needs_practice') {
    personalizedGrowthAreas.push('🌱 Exploring definitions and friendly word clues');
  }
  if (readProficiency === 'needs_practice') {
    personalizedGrowthAreas.push('🌱 Enjoying short passages to strengthen reading comprehension');
  }
  if (recProficiency === 'needs_practice') {
    personalizedGrowthAreas.push('🌱 Listening to spoken pronunciations while reading printed text');
  }

  // Default growth areas if user excelled in everything
  if (personalizedGrowthAreas.length === 0) {
    personalizedGrowthAreas.push('🌱 Exploring advanced literature vocabulary');
    personalizedGrowthAreas.push('🌱 Tackling exciting multi-syllable spelling challenges');
  }

  // Tailor Daily Goals intelligently to what the learner needs!
  const recommendedGoals: DailyGoalConfig = {
    readingMinutes: pathDef.recommendedGoals.readingMinutes,
    vocabularyWords: pathDef.recommendedGoals.vocabularyWords,
    flashcardsCount: pathDef.recommendedGoals.flashcardsCount,
    spellingWords: pathDef.recommendedGoals.spellingWords
  };

  // Adjust goals if specific need is identified
  if (spellProficiency === 'needs_practice') {
    recommendedGoals.spellingWords = Math.max(recommendedGoals.spellingWords, 5);
    recommendedGoals.flashcardsCount = Math.max(recommendedGoals.flashcardsCount, 10);
  }
  if (vocabProficiency === 'needs_practice') {
    recommendedGoals.vocabularyWords = Math.max(recommendedGoals.vocabularyWords, 5);
  }
  if (readProficiency === 'needs_practice') {
    recommendedGoals.readingMinutes = Math.max(recommendedGoals.readingMinutes, 15);
  }

  // Baseline comparison for Growth Checkpoints
  let baselineComparison: StartingAssessmentResult['baselineComparison'];
  if (isGrowthCheckpoint && previousBaseline) {
    const prevOverall = previousBaseline.overallScorePercent;
    const growthDelta = overallScorePercent - prevOverall;
    baselineComparison = {
      vocabularyGrowth:
        vocabProficiency === 'strong'
          ? '🌸 Strong & Confident'
          : vocabProficiency === 'growing'
          ? '🌿 Growing Steadily'
          : '🌱 Developing Foundations',
      spellingGrowth: `${spellStats.correct} / ${spellStats.total} correct (${Math.round(
        (spellStats.correct / (spellStats.total || 1)) * 100
      )}%)`,
      readingGrowth:
        readProficiency === 'strong'
          ? '⭐ Excellent Comprehension'
          : '🌿 Developing Well',
      overallGrowthNote:
        growthDelta > 0
          ? `You have grown +${growthDelta}% since your very first starting point! Keep blooming!`
          : `You continue to demonstrate strong curiosity and steady reading habits!`
    };
  }

  return {
    completedAt: new Date().toISOString(),
    startingPath,
    pathTitle: pathDef.title,
    pathDescription: pathDef.description,
    icon: pathDef.icon,
    overallScorePercent,
    skills,
    recommendedGoals,
    personalizedStrengths,
    personalizedGrowthAreas,
    isGrowthCheckpoint,
    baselineComparison
  };
}

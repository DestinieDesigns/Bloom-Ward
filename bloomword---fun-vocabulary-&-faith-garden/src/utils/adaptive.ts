import { VocabWord, MasteryLevel } from '../types';

export const ENCOURAGING_SUCCESS_MESSAGES = [
  '🌸 Great job! You are blooming!',
  '🎀 You’re getting stronger every day!',
  '✨ Look at you go, Word Master!',
  '🌷 Beautiful thinking! That’s correct!',
  '📚 Your vocabulary garden is flourishing!',
  '💖 Wonderful effort! A shiny petal just opened!',
  '👑 Sparkling work! Keep shining bright!'
];

export const ENCOURAGING_TRY_AGAIN_MESSAGES = [
  '🌱 Not yet! Let’s learn it together.',
  '🌷 That was a tricky one, but your brain is growing!',
  '🎀 Don’t worry, practice makes blossoms bloom!',
  '✨ Every mistake is just a seedling getting ready to sprout!',
  '🌸 Take a gentle breath, you’ve got this next time!'
];

export const getRandomEncouragement = (success: boolean): string => {
  const list = success ? ENCOURAGING_SUCCESS_MESSAGES : ENCOURAGING_TRY_AGAIN_MESSAGES;
  return list[Math.floor(Math.random() * list.length)];
};

export const updateWordMastery = (
  word: VocabWord,
  isCorrect: boolean
): { updatedWord: VocabWord; leveledUpMastery: boolean } => {
  const timesPracticed = word.timesPracticed + 1;
  const correctCount = isCorrect ? word.correctCount + 1 : word.correctCount;
  const incorrectCount = !isCorrect ? word.incorrectCount + 1 : word.incorrectCount;
  const lastPracticedDate = new Date().toISOString().split('T')[0];

  let nextLevel: MasteryLevel = word.masteryLevel;
  let leveledUpMastery = false;

  if (isCorrect) {
    if (word.masteryLevel === 'new') {
      nextLevel = 'learning';
      leveledUpMastery = true;
    } else if (word.masteryLevel === 'learning' && correctCount >= 2) {
      nextLevel = 'growing';
      leveledUpMastery = true;
    } else if (word.masteryLevel === 'growing' && correctCount >= 4) {
      nextLevel = 'almost_mastered';
      leveledUpMastery = true;
    } else if (word.masteryLevel === 'almost_mastered' && correctCount >= 6) {
      nextLevel = 'mastered';
      leveledUpMastery = true;
    }
  } else {
    // If incorrect multiple times, gentle step back to ensure spaced repetition reinforcement
    if (incorrectCount >= 2 && word.masteryLevel === 'almost_mastered') {
      nextLevel = 'growing';
    } else if (incorrectCount >= 3 && word.masteryLevel === 'growing') {
      nextLevel = 'learning';
    }
  }

  const mastered = nextLevel === 'mastered';

  return {
    updatedWord: {
      ...word,
      timesPracticed,
      correctCount,
      incorrectCount,
      lastPracticedDate,
      masteryLevel: nextLevel,
      mastered
    },
    leveledUpMastery
  };
};

/**
 * Returns prioritized words for today's lesson:
 * Prioritizes:
 * 1. Words with incorrect answers or low accuracy
 * 2. Words in 'learning' or 'growing' phase
 * 3. 1 or 2 brand new words to expand vocabulary
 * 4. 1 mastered word for spaced repetition review
 */
export const getAdaptiveDailyWords = (allWords: VocabWord[], count: number = 4): VocabWord[] => {
  if (allWords.length === 0) return [];

  // Sort by priority score
  const scored = [...allWords].map((word) => {
    let score = 0;
    // High incorrect ratio gets highest priority
    if (word.incorrectCount > 0) {
      score += word.incorrectCount * 10;
    }
    if (word.masteryLevel === 'learning') score += 8;
    if (word.masteryLevel === 'growing') score += 6;
    if (word.masteryLevel === 'new') score += 5;
    if (word.masteryLevel === 'almost_mastered') score += 4;
    if (word.masteryLevel === 'mastered') score += 1; // occasional review

    // If haven't practiced recently
    if (!word.lastPracticedDate) score += 4;

    return { word, score: score + Math.random() * 2 }; // slight jitter for variety
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((item) => item.word);
};

export const getMasteryIcon = (level: MasteryLevel): string => {
  switch (level) {
    case 'new':
      return '🌱';
    case 'learning':
      return '🌿';
    case 'growing':
      return '🌸';
    case 'almost_mastered':
      return '🌺';
    case 'mastered':
      return '👑';
  }
};

export const getMasteryLabel = (level: MasteryLevel): string => {
  switch (level) {
    case 'new':
      return 'New Seed';
    case 'learning':
      return 'Learning Sprout';
    case 'growing':
      return 'Growing Blossom';
    case 'almost_mastered':
      return 'Almost Mastered';
    case 'mastered':
      return 'Crown Mastered';
  }
};

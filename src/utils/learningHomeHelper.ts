import {
  HomeItem,
  HomeRoom,
  HomeRoomId,
  KnowledgeGardenWordPlant,
  FlowerSpecies,
  StickerItem,
  UserLearningHomeState,
  UserProfile,
  VocabWord,
  ReadingSession,
  BookRecord
} from '../types';
import {
  INITIAL_HOME_ITEMS,
  INITIAL_ROOMS,
  INITIAL_STICKERS
} from '../data/learningHomeData';
import { STARTER_PACK_ITEM_IDS } from '../data/homeShopCatalog';
import { DEFAULT_CHARACTER_CUSTOMIZATION } from '../components/learningHome/HomeCharacter';

const STORAGE_KEYS = {
  HOME_STATE: 'bloomword_learning_home_v1',
  STICKER_BOOK: 'bloomword_sticker_book_v1'
};

export const loadLearningHomeState = (): UserLearningHomeState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.HOME_STATE);
    if (saved) {
      const parsed = JSON.parse(saved);
      const existingUnlocked = parsed.unlockedItemIds || [];
      const mergedUnlocked = Array.from(new Set([...STARTER_PACK_ITEM_IDS, ...existingUnlocked]));

      // Merge with any new default rooms or items in case of updates
      return {
        activeRoomId: parsed.activeRoomId || 'main_room',
        rooms: {
          ...INITIAL_ROOMS,
          ...parsed.rooms
        },
        unlockedItemIds: mergedUnlocked,
        collectedStickerIds: parsed.collectedStickerIds || ['stk-curious-sprout', 'stk-spelling-bee'],
        lastEarnedGift: parsed.lastEarnedGift,
        character: parsed.character || {
          x: 45,
          y: 65,
          facing: 'right',
          animation: 'idle',
          customization: DEFAULT_CHARACTER_CUSTOMIZATION
        },
        learningCoins: typeof parsed.learningCoins === 'number' ? parsed.learningCoins : 350
      };
    }
  } catch (err) {
    console.error('Error loading Learning Home state from localStorage:', err);
  }

  return {
    activeRoomId: 'main_room',
    rooms: INITIAL_ROOMS,
    unlockedItemIds: Array.from(new Set([...STARTER_PACK_ITEM_IDS, ...INITIAL_HOME_ITEMS.filter((i) => i.unlocked).map((i) => i.id)])),
    collectedStickerIds: ['stk-curious-sprout', 'stk-spelling-bee'],
    character: {
      x: 45,
      y: 65,
      facing: 'right',
      animation: 'idle',
      customization: DEFAULT_CHARACTER_CUSTOMIZATION
    },
    learningCoins: 350
  };
};

export const saveLearningHomeState = (state: UserLearningHomeState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.HOME_STATE, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving Learning Home state to localStorage:', err);
  }
};

export const loadStickerBook = (): StickerItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.STICKER_BOOK);
    if (saved) {
      const parsed: StickerItem[] = JSON.parse(saved);
      // Merge with initial list to preserve descriptions and icons
      return INITIAL_STICKERS.map((base) => {
        const found = parsed.find((p) => p.id === base.id);
        return found ? { ...base, unlocked: found.unlocked || base.unlocked, unlockedDate: found.unlockedDate } : base;
      });
    }
  } catch (err) {
    console.error('Error loading Sticker Book:', err);
  }
  return INITIAL_STICKERS;
};

export const saveStickerBook = (stickers: StickerItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STICKER_BOOK, JSON.stringify(stickers));
  } catch (err) {
    console.error('Error saving Sticker Book:', err);
  }
};

/**
 * Evaluates which items are unlocked based on educational achievements.
 */
export const checkEducationalItemUnlocks = (
  profile: UserProfile,
  words: VocabWord[],
  readingSessions: ReadingSession[] = [],
  currentlyUnlockedIds: string[]
): {
  allUnlockedIds: string[];
  newlyUnlockedItems: HomeItem[];
} => {
  const currentSet = new Set(currentlyUnlockedIds);
  const newlyUnlocked: HomeItem[] = [];

  const totalReadingMinutes = profile.totalReadingMinutes || 0;
  const readingSessionsCount = readingSessions.length || profile.totalReadingSessions || 0;
  const wordsLearnedCount = words.filter((w) => w.timesPracticed > 0).length;
  const wordsMasteredCount = words.filter((w) => w.mastered).length;
  const spellingMasteredCount = words.filter(
    (w) => w.spellingMasteryStage === 'mastered' || (w.spellingTrueTestCorrect || 0) >= 3
  ).length;
  const flashcardReviewsCount = words.reduce((acc, w) => acc + (w.flashcardReviewCount || 0), 0);
  const streak = profile.streak || 0;
  const xp = profile.xp || 0;

  INITIAL_HOME_ITEMS.forEach((item) => {
    if (currentSet.has(item.id)) return;

    let shouldUnlock = false;

    switch (item.id) {
      // Reading items
      case 'furn-readers-armchair':
        shouldUnlock = totalReadingMinutes >= 15;
        break;
      case 'furn-wonders-bookshelf':
        shouldUnlock = readingSessionsCount >= 2;
        break;
      case 'furn-reading-nook-lamp':
        shouldUnlock = totalReadingMinutes >= 45;
        break;
      case 'decor-potted-monstera':
        shouldUnlock = totalReadingMinutes >= 30 || readingSessionsCount >= 3;
        break;
      case 'decor-bookstack-cushion':
        shouldUnlock = words.some((w) => w.sourceType === 'reading');
        break;

      // Word mastery specific items
      case 'decor-curiosity-flower': {
        const curious = words.find((w) => w.word.toLowerCase() === 'curious');
        shouldUnlock = curious?.mastered || wordsMasteredCount >= 1;
        break;
      }
      case 'decor-magnificent-mirror': {
        const mag = words.find((w) => w.word.toLowerCase() === 'magnificent');
        shouldUnlock = mag?.mastered || wordsMasteredCount >= 3;
        break;
      }
      case 'decor-resilient-bonsai': {
        const res = words.find((w) => w.word.toLowerCase() === 'resilient');
        shouldUnlock = res?.mastered || wordsMasteredCount >= 5;
        break;
      }

      // Vocabulary items
      case 'furn-scholar-desk':
        shouldUnlock = wordsLearnedCount >= 5;
        break;
      case 'decor-word-art-banner':
        shouldUnlock = wordsLearnedCount >= 10;
        break;

      // Spelling items
      case 'furn-spelling-station':
        shouldUnlock = spellingMasteredCount >= 1 || words.some((w) => (w.spellingTrueTestCorrect || 0) > 0);
        break;
      case 'decor-ribbon-trophy':
        shouldUnlock = spellingMasteredCount >= 3;
        break;
      case 'decor-star-garland':
        shouldUnlock = words.some((w) => (w.spellingAttempts || 0) >= 10);
        break;

      // Flashcards
      case 'decor-crystal-hourglass':
        shouldUnlock = flashcardReviewsCount >= 20;
        break;
      case 'furn-card-cabinet':
        shouldUnlock = flashcardReviewsCount >= 40;
        break;

      // Streaks
      case 'furn-streak-fireplace':
        shouldUnlock = streak >= 3;
        break;
      case 'furn-streak-lantern':
        shouldUnlock = streak >= 7;
        break;

      // Pets / Companions
      case 'pet-barnaby-owl':
        shouldUnlock = wordsLearnedCount >= 8 || profile.level >= 2;
        break;
      case 'pet-pippin-bunny':
        shouldUnlock = flashcardReviewsCount >= 15;
        break;
      case 'pet-sparky-pup':
        shouldUnlock = words.some((w) => (w.spellingTrueTestAttempts || 0) >= 1);
        break;
      case 'pet-pip-fox':
        shouldUnlock = totalReadingMinutes >= 60;
        break;

      // Stickers
      case 'sticker-flutter-butterfly':
        shouldUnlock = wordsMasteredCount >= 2;
        break;
      case 'sticker-fluffy-cloud':
        shouldUnlock = totalReadingMinutes >= 15;
        break;
      case 'sticker-sparkle-heart':
        shouldUnlock = xp >= 100;
        break;

      // Specials
      case 'decor-coral-aquarium':
        shouldUnlock = profile.theme === 'ocean_adventure' || profile.level >= 3;
        break;
      case 'furn-celestial-globe':
        shouldUnlock = profile.theme === 'space_explorer' || xp >= 200;
        break;
      case 'furn-faith-peace-dove':
        shouldUnlock = words.some((w) => w.category === 'Faith' && w.mastered) || xp >= 150;
        break;
      case 'spec-reading-champion-cup':
        shouldUnlock = totalReadingMinutes >= 100;
        break;
      case 'spec-knowledge-tree-fountain':
        shouldUnlock = wordsMasteredCount >= 15;
        break;

      default:
        break;
    }

    if (shouldUnlock) {
      currentSet.add(item.id);
      newlyUnlocked.push(item);
    }
  });

  return {
    allUnlockedIds: Array.from(currentSet),
    newlyUnlockedItems: newlyUnlocked
  };
};

/**
 * Checks and updates Room unlock states and progress bars.
 */
export const updateRoomUnlockProgression = (
  profile: UserProfile,
  words: VocabWord[],
  readingSessions: ReadingSession[] = [],
  currentRooms: Record<HomeRoomId, HomeRoom>
): {
  updatedRooms: Record<HomeRoomId, HomeRoom>;
  newlyUnlockedRooms: HomeRoom[];
} => {
  const totalReadingMinutes = profile.totalReadingMinutes || 0;
  const readingSessionsCount = readingSessions.length || profile.totalReadingSessions || 0;
  const wordsMasteredCount = words.filter((w) => w.mastered).length;
  const spellingMasteredCount = words.filter(
    (w) => w.spellingMasteryStage === 'mastered' || (w.spellingTrueTestCorrect || 0) >= 3
  ).length;
  const streak = profile.streak || 0;
  const xp = profile.xp || 0;

  const newlyUnlocked: HomeRoom[] = [];
  const updatedRooms: Record<HomeRoomId, HomeRoom> = { ...currentRooms };

  // 1. Reading Room (30 reading minutes or 2 sessions)
  const readingRoom = updatedRooms.reading_room;
  if (readingRoom) {
    const isNowUnlocked = totalReadingMinutes >= 30 || readingSessionsCount >= 2;
    if (!readingRoom.unlocked && isNowUnlocked) {
      newlyUnlocked.push({ ...readingRoom, unlocked: true, unlockRequirementMet: true });
    }
    updatedRooms.reading_room = {
      ...readingRoom,
      unlocked: readingRoom.unlocked || isNowUnlocked,
      unlockRequirementMet: isNowUnlocked,
      currentProgress: Math.min(30, totalReadingMinutes),
      maxProgress: 30
    };
  }

  // 2. Creative Room (5 spelling words or level 3)
  const creativeRoom = updatedRooms.creative_room;
  if (creativeRoom) {
    const isNowUnlocked = spellingMasteredCount >= 5 || profile.level >= 3;
    if (!creativeRoom.unlocked && isNowUnlocked) {
      newlyUnlocked.push({ ...creativeRoom, unlocked: true, unlockRequirementMet: true });
    }
    updatedRooms.creative_room = {
      ...creativeRoom,
      unlocked: creativeRoom.unlocked || isNowUnlocked,
      unlockRequirementMet: isNowUnlocked,
      currentProgress: Math.min(5, spellingMasteredCount),
      maxProgress: 5
    };
  }

  // 3. Knowledge Garden (5 vocabulary words mastered)
  const gardenRoom = updatedRooms.knowledge_garden;
  if (gardenRoom) {
    const isNowUnlocked = wordsMasteredCount >= 5;
    if (!gardenRoom.unlocked && isNowUnlocked) {
      newlyUnlocked.push({ ...gardenRoom, unlocked: true, unlockRequirementMet: true });
    }
    updatedRooms.knowledge_garden = {
      ...gardenRoom,
      unlocked: gardenRoom.unlocked || isNowUnlocked,
      unlockRequirementMet: isNowUnlocked,
      currentProgress: Math.min(5, wordsMasteredCount),
      maxProgress: 5
    };
  }

  // 4. Dream Room (3-day streak or 300 XP)
  const dreamRoom = updatedRooms.dream_room;
  if (dreamRoom) {
    const isNowUnlocked = streak >= 3 || xp >= 300;
    if (!dreamRoom.unlocked && isNowUnlocked) {
      newlyUnlocked.push({ ...dreamRoom, unlocked: true, unlockRequirementMet: true });
    }
    updatedRooms.dream_room = {
      ...dreamRoom,
      unlocked: dreamRoom.unlocked || isNowUnlocked,
      unlockRequirementMet: isNowUnlocked,
      currentProgress: Math.min(3, streak),
      maxProgress: 3
    };
  }

  // 5. Grand Library (100 reading minutes or 15 words)
  const grandRoom = updatedRooms.grand_library;
  if (grandRoom) {
    const isNowUnlocked = totalReadingMinutes >= 100 || wordsMasteredCount >= 15;
    if (!grandRoom.unlocked && isNowUnlocked) {
      newlyUnlocked.push({ ...grandRoom, unlocked: true, unlockRequirementMet: true });
    }
    updatedRooms.grand_library = {
      ...grandRoom,
      unlocked: grandRoom.unlocked || isNowUnlocked,
      unlockRequirementMet: isNowUnlocked,
      currentProgress: Math.min(100, totalReadingMinutes),
      maxProgress: 100
    };
  }

  return {
    updatedRooms,
    newlyUnlockedRooms: newlyUnlocked
  };
};

/**
 * Checks and updates Sticker Book unlocks.
 */
export const updateStickerBookProgression = (
  profile: UserProfile,
  words: VocabWord[],
  readingSessions: ReadingSession[] = [],
  currentStickers: StickerItem[]
): {
  updatedStickers: StickerItem[];
  newlyUnlockedStickers: StickerItem[];
} => {
  const totalReadingMinutes = profile.totalReadingMinutes || 0;
  const readingSessionsCount = readingSessions.length || profile.totalReadingSessions || 0;
  const wordsLearnedCount = words.filter((w) => w.timesPracticed > 0).length;
  const wordsMasteredCount = words.filter((w) => w.mastered).length;
  const spellingMasteredCount = words.filter(
    (w) => w.spellingMasteryStage === 'mastered' || (w.spellingTrueTestCorrect || 0) >= 3
  ).length;
  const streak = profile.streak || 0;
  const xp = profile.xp || 0;

  const newlyUnlocked: StickerItem[] = [];

  const updatedStickers = currentStickers.map((sticker) => {
    if (sticker.unlocked) return sticker;

    let shouldUnlock = false;

    switch (sticker.id) {
      case 'stk-curious-sprout':
        shouldUnlock = wordsLearnedCount >= 1;
        break;
      case 'stk-word-bloom':
        shouldUnlock = wordsLearnedCount >= 10;
        break;
      case 'stk-magnificent-star': {
        const mag = words.find((w) => w.word.toLowerCase() === 'magnificent');
        shouldUnlock = mag?.mastered || wordsMasteredCount >= 3;
        break;
      }
      case 'stk-knowledge-tree':
        shouldUnlock = wordsMasteredCount >= 15;
        break;
      case 'stk-reading-feather':
        shouldUnlock = readingSessionsCount >= 1 || totalReadingMinutes >= 15;
        break;
      case 'stk-book-castle':
        shouldUnlock = totalReadingMinutes >= 60;
        break;
      case 'stk-reading-lamp':
        shouldUnlock = readingSessionsCount >= 4;
        break;
      case 'stk-spelling-bee':
        shouldUnlock = words.some((w) => (w.spellingCorrectAttempts || 0) > 0);
        break;
      case 'stk-perfect-pencil':
        shouldUnlock = words.some((w) => (w.spellingTrueTestCorrect || 0) >= 1);
        break;
      case 'stk-alphabet-crown':
        shouldUnlock = spellingMasteredCount >= 10;
        break;
      case 'stk-peace-dove':
        shouldUnlock = words.some((w) => w.word.toLowerCase() === 'shalom' && w.mastered) || xp >= 120;
        break;
      case 'stk-golden-cross':
        shouldUnlock = words.some((w) => w.category === 'Faith' && w.timesPracticed >= 3);
        break;
      case 'stk-heart-shepherd':
        shouldUnlock = words.some((w) => w.word.toLowerCase() === 'grace' && w.mastered) || xp >= 180;
        break;
      case 'stk-streak-flame':
        shouldUnlock = streak >= 3;
        break;
      case 'stk-celestial-comet':
        shouldUnlock = xp >= 250;
        break;
      case 'stk-trophy-superstar':
        shouldUnlock = totalReadingMinutes >= 30 && wordsMasteredCount >= 5 && spellingMasteredCount >= 3;
        break;
      default:
        break;
    }

    if (shouldUnlock) {
      const unlockedSticker = {
        ...sticker,
        unlocked: true,
        unlockedDate: new Date().toISOString().split('T')[0]
      };
      newlyUnlocked.push(unlockedSticker);
      return unlockedSticker;
    }

    return sticker;
  });

  return {
    updatedStickers,
    newlyUnlockedStickers: newlyUnlocked
  };
};

/**
 * Returns dynamic Knowledge Garden plants from all words.
 * Maps:
 * - 🌱 Seed (introduced/practiced 0-1 times)
 * - 🌿 Sprout (practicing, 2-3 times)
 * - 🌸 Blossom (understood, confidence known or mastery growing)
 * - ⭐ Permanent Golden Flower (mastered)
 */
export const getKnowledgeGardenPlants = (words: VocabWord[]): KnowledgeGardenWordPlant[] => {
  const FLOWER_EMOJIS = ['🌸', '🌺', '🌻', '🌷', '🪷', '🌼', '🌹', '💐'];
  const FLOWER_COLORS = ['#ec4899', '#f43f5e', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'];

  const getSpeciesForWord = (word: VocabWord, index: number): FlowerSpecies => {
    const cat = (word.category || '').toLowerCase();
    const w = word.word.toLowerCase();

    if (cat.includes('faith') || cat.includes('virtue') || w === 'shalom' || w === 'grace' || w === 'peace') {
      return 'lotus';
    }
    if (cat.includes('nature') || cat.includes('science') || cat.includes('animal')) {
      return index % 2 === 0 ? 'sunflower' : 'wildflower';
    }
    if (cat.includes('emotion') || cat.includes('character') || w === 'kindness' || w === 'courage') {
      return 'rose';
    }
    if (cat.includes('adventure') || cat.includes('action')) {
      return 'tulip';
    }
    if (cat.includes('everyday') || cat.includes('foundation') || cat.includes('school')) {
      return 'daisy';
    }
    if (word.difficulty === 'challenging' || w === 'magnificent' || w === 'persevere') {
      return 'orchid';
    }

    const speciesList: FlowerSpecies[] = ['rose', 'sunflower', 'lotus', 'tulip', 'daisy', 'orchid', 'lavender', 'wildflower'];
    return speciesList[Math.abs(w.charCodeAt(0) + index) % speciesList.length];
  };

  return words.map((w, index) => {
    let stage: KnowledgeGardenWordPlant['stage'] = 'seed';
    let growthPercent = 20;
    let masteryTitle = 'Dormant Seed 🌱';

    if (w.mastered || w.masteryLevel === 'mastered') {
      stage = 'permanent_flower';
      growthPercent = 100;
      masteryTitle = 'Mastered Perennial Bloom ⭐';
    } else if (
      w.masteryLevel === 'almost_mastered' ||
      w.masteryLevel === 'growing' ||
      w.confidenceRating === 'known' ||
      (w.timesPracticed >= 4 && (w.correctCount || 0) >= 3)
    ) {
      stage = 'blossom';
      growthPercent = 80;
      masteryTitle = 'Budding Blossom 🌺';
    } else if (
      w.masteryLevel === 'learning' ||
      w.timesPracticed > 0 ||
      (w.flashcardReviewCount || 0) > 0 ||
      (w.spellingAttempts || 0) > 0
    ) {
      stage = 'sprout';
      growthPercent = 50;
      masteryTitle = 'Tender Sprout 🌿';
    } else {
      stage = 'seed';
      growthPercent = 20;
      masteryTitle = 'Dormant Seed 🌱';
    }

    const emojiIndex = Math.abs(w.word.charCodeAt(0) + index) % FLOWER_EMOJIS.length;
    const colorIndex = Math.abs(w.word.charCodeAt(w.word.length - 1) + index) % FLOWER_COLORS.length;
    const species = getSpeciesForWord(w, index);

    return {
      wordId: w.id,
      word: w.word,
      definition: w.definition,
      syllables: w.syllables,
      partOfSpeech: w.partOfSpeech,
      exampleSentence: w.exampleSentence,
      stage,
      flowerEmoji: stage === 'seed' ? '🌱' : stage === 'sprout' ? '🌿' : FLOWER_EMOJIS[emojiIndex],
      flowerColor: FLOWER_COLORS[colorIndex],
      flowerSpecies: species,
      growthPercent,
      masteryTitle,
      category: w.category,
      masteryLevel: w.masteryLevel,
      confidenceRating: w.confidenceRating,
      masteryDate: w.mastered ? w.lastPracticedDate || 'Recently Mastered' : undefined,
      timesPracticed: w.timesPracticed
    };
  });
};

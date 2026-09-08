import { HomeItem, HomeRoom, HomeRoomId, StickerItem, UserLearningHomeState, UserProfile, VocabWord } from '../types';

export const INITIAL_HOME_ITEMS: HomeItem[] = [
  // --- STARTER FURNITURE & BASICS ---
  {
    id: 'furn-starter-bed',
    name: 'Cozy Cloud Daybed',
    category: 'furniture',
    icon: '🛏️',
    visualStyle: 'pink_garden',
    description: 'A super soft daybed with cloud-like pillows for relaxing after study sessions.',
    unlocked: true,
    unlockCondition: 'Starter Item',
    unlockSource: 'starter',
    defaultScale: 1.2,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'furn-starter-rug',
    name: 'Pastel Blossom Rug',
    category: 'furniture',
    icon: '🌸',
    visualStyle: 'pink_garden',
    description: 'A woven flower-shaped rug that warms up any study floor.',
    unlocked: true,
    unlockCondition: 'Starter Item',
    unlockSource: 'starter',
    defaultScale: 1.3,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'furn-starter-lamp',
    name: 'Tulip Glow Table Lamp',
    category: 'furniture',
    icon: '🌷',
    visualStyle: 'pink_garden',
    description: 'A cheerful tulip night lamp casting gentle, soothing light.',
    unlocked: true,
    unlockCondition: 'Starter Item',
    unlockSource: 'starter',
    defaultScale: 0.9,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'furn-starter-table',
    name: 'Storybook Study Table',
    category: 'furniture',
    icon: '🪵',
    visualStyle: 'cozy_modern',
    description: 'A sturdy light oak table perfect for journals and tea.',
    unlocked: true,
    unlockCondition: 'Starter Item',
    unlockSource: 'starter',
    defaultScale: 1.1,
    isResizable: true,
    isRotatable: true
  },

  // --- READING-EARNED REWARDS ---
  {
    id: 'furn-readers-armchair',
    name: "The Reader's Velvet Armchair",
    category: 'furniture',
    icon: '🛋️',
    visualStyle: 'cozy_modern',
    description: 'Deep cushioned velvet chair tailored for 15+ minute reading adventures.',
    unlocked: false,
    unlockCondition: 'Complete 15 minutes of real-book reading',
    unlockSource: 'reading',
    defaultScale: 1.2,
    isResizable: true,
    isRotatable: true,
    interactiveType: 'reading_corner',
    interactiveData: {
      title: "Reader's Armchair",
      description: 'Open your reading companion timer and track your real book!',
      targetSection: 'reading_adventure'
    }
  },
  {
    id: 'furn-wonders-bookshelf',
    name: 'Grand Wonders Bookshelf',
    category: 'furniture',
    icon: '📚',
    visualStyle: 'cozy_modern',
    description: 'Tall wooden bookshelf packed with adventures, mysteries, and classic tales.',
    unlocked: false,
    unlockCondition: 'Log 2 reading sessions',
    unlockSource: 'reading',
    defaultScale: 1.4,
    isResizable: true,
    isRotatable: true,
    interactiveType: 'reading_corner',
    interactiveData: {
      title: 'Grand Bookshelf',
      description: 'Review your reading history and words discovered offline.',
      targetSection: 'reading_adventure'
    }
  },
  {
    id: 'furn-reading-nook-lamp',
    name: 'Gooseneck Brass Reading Lamp',
    category: 'furniture',
    icon: '💡',
    visualStyle: 'cozy_modern',
    description: 'Warm directed light that protects young eyes during evening chapters.',
    unlocked: false,
    unlockCondition: 'Read for 45 cumulative minutes',
    unlockSource: 'reading',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'decor-potted-monstera',
    name: 'Cozy Reading Monstera',
    category: 'decoration',
    icon: '🪴',
    visualStyle: 'animal_world',
    description: 'A glossy green potted plant that thrives beside sunny bookshelves.',
    unlocked: false,
    unlockCondition: 'Read for 30 minutes in a single day or log 3 sessions',
    unlockSource: 'reading',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'decor-bookstack-cushion',
    name: 'Floor Cushion Stack',
    category: 'furniture',
    icon: '🥞',
    visualStyle: 'pink_garden',
    description: 'Soft layered velvet floor cushions for reading on the carpet.',
    unlocked: false,
    unlockCondition: 'Discover 3 new words while reading',
    unlockSource: 'reading',
    defaultScale: 1.1,
    isResizable: true,
    isRotatable: true
  },

  // --- VOCABULARY & KNOWLEDGE UNLOCKS ---
  {
    id: 'decor-curiosity-flower',
    name: 'Curiosity Blossom Vase',
    category: 'decoration',
    icon: '🌺',
    visualStyle: 'pink_garden',
    description: 'A vibrant bloom that sparkles whenever you ask questions and explore new words.',
    unlocked: false,
    unlockCondition: 'Master the word "Curious"',
    unlockSource: 'word_mastery',
    associatedWord: 'Curious',
    defaultScale: 0.9,
    isResizable: true,
    isRotatable: true,
    interactiveType: 'knowledge_flower',
    interactiveData: {
      word: 'Curious',
      definition: 'Eager to know or learn something new; full of wonder.'
    }
  },
  {
    id: 'decor-magnificent-mirror',
    name: 'The Magnificent Gilded Mirror',
    category: 'decoration',
    icon: '🪞',
    visualStyle: 'fantasy_world',
    description: 'An ornate golden mirror reflecting your growing wisdom and brilliance.',
    unlocked: false,
    unlockCondition: 'Master the word "Magnificent"',
    unlockSource: 'word_mastery',
    associatedWord: 'Magnificent',
    defaultScale: 1.2,
    isResizable: true,
    isRotatable: true,
    interactiveType: 'knowledge_flower',
    interactiveData: {
      word: 'Magnificent',
      definition: 'Extremely beautiful, elaborate, or impressive; splendid.'
    }
  },
  {
    id: 'decor-resilient-bonsai',
    name: 'Resilient Evergreen Bonsai',
    category: 'decoration',
    icon: '🎍',
    visualStyle: 'animal_world',
    description: 'Strong miniature tree that bends in the wind but never breaks.',
    unlocked: false,
    unlockCondition: 'Master the word "Resilient"',
    unlockSource: 'word_mastery',
    associatedWord: 'Resilient',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: true,
    interactiveType: 'knowledge_flower',
    interactiveData: {
      word: 'Resilient',
      definition: 'Able to recover quickly from difficulties or setbacks.'
    }
  },
  {
    id: 'furn-scholar-desk',
    name: "The Scholar's Knowledge Desk",
    category: 'furniture',
    icon: '🖥️',
    visualStyle: 'cozy_modern',
    description: 'Organized study desk equipped with stationery, cards, and reference tools.',
    unlocked: false,
    unlockCondition: 'Learn 5 new vocabulary words',
    unlockSource: 'vocabulary',
    defaultScale: 1.3,
    isResizable: true,
    isRotatable: true,
    interactiveType: 'knowledge_desk',
    interactiveData: {
      title: 'Knowledge Desk',
      description: 'Explore today’s vocabulary lesson and review flashcards.',
      targetSection: 'daily_adventure'
    }
  },
  {
    id: 'decor-word-art-banner',
    name: '"Words Give Wings" Wall Art',
    category: 'decoration',
    icon: '🖼️',
    visualStyle: 'pink_garden',
    description: 'Framed gold calligraphy celebrating the magic of language and voice.',
    unlocked: false,
    unlockCondition: 'Learn 10 total vocabulary words',
    unlockSource: 'vocabulary',
    defaultScale: 1.1,
    isResizable: true,
    isRotatable: false
  },

  // --- SPELLING UNLOCKS ---
  {
    id: 'furn-spelling-station',
    name: 'Spelling Star Typing Desk',
    category: 'furniture',
    icon: '⌨️',
    visualStyle: 'space_explorer',
    description: 'A focused workstation where letters connect and spelling accuracy blooms.',
    unlocked: false,
    unlockCondition: 'Score 100% on a True Spelling Test',
    unlockSource: 'spelling',
    defaultScale: 1.2,
    isResizable: true,
    isRotatable: true,
    interactiveType: 'spelling_station',
    interactiveData: {
      title: 'Spelling Station',
      description: 'Take an independent audio spelling test and master your word list.',
      targetSection: 'spelling_test'
    }
  },
  {
    id: 'decor-ribbon-trophy',
    name: 'Golden Spelling Rosette',
    category: 'decoration',
    icon: '🎗️',
    visualStyle: 'pink_garden',
    description: 'A blue and gold satin ribbon earned by sounding out words with precision.',
    unlocked: false,
    unlockCondition: 'Master 3 spelling words',
    unlockSource: 'spelling',
    defaultScale: 0.9,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'decor-star-garland',
    name: 'Twinkling Letter Star Garland',
    category: 'decoration',
    icon: '✨',
    visualStyle: 'pink_garden',
    description: 'A string of paper stars hanging across your wall that glitters warmly.',
    unlocked: false,
    unlockCondition: 'Practice 10 spelling words',
    unlockSource: 'spelling',
    defaultScale: 1.2,
    isResizable: true,
    isRotatable: false
  },

  // --- FLASHCARDS UNLOCKS ---
  {
    id: 'decor-crystal-hourglass',
    name: 'Sparkling Recall Hourglass',
    category: 'decoration',
    icon: '⏳',
    visualStyle: 'fantasy_world',
    description: 'Filled with luminous purple sand that marks quick memory mastery.',
    unlocked: false,
    unlockCondition: 'Review 20 flashcards',
    unlockSource: 'flashcards',
    defaultScale: 0.8,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'furn-card-cabinet',
    name: 'Polished Flashcard Filing Chest',
    category: 'furniture',
    icon: '🗄️',
    visualStyle: 'cozy_modern',
    description: 'Smooth wooden drawers to organize words you are learning vs mastered.',
    unlocked: false,
    unlockCondition: 'Review 40 total flashcards',
    unlockSource: 'flashcards',
    defaultScale: 1.1,
    isResizable: true,
    isRotatable: true,
    interactiveType: 'knowledge_desk',
    interactiveData: {
      title: 'Word Filing Chest',
      description: 'Open your flashcards to flip and practice pronunciations.',
      targetSection: 'flashcards'
    }
  },

  // --- STREAK & CONSISTENCY AWARDS ---
  {
    id: 'furn-streak-fireplace',
    name: 'The Hearth of Consistency',
    category: 'furniture',
    icon: '🔥',
    visualStyle: 'cozy_modern',
    description: 'A gentle glowing brick fireplace that keeps your room warm with daily habits.',
    unlocked: false,
    unlockCondition: 'Maintain a 3-day learning streak',
    unlockSource: 'streak',
    defaultScale: 1.4,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'furn-streak-lantern',
    name: 'Golden 7-Day Flame Lantern',
    category: 'special',
    icon: '🏮',
    visualStyle: 'fantasy_world',
    description: 'Radiates a steady, warm golden flame earned by 7 continuous days of learning.',
    unlocked: false,
    unlockCondition: 'Achieve a 7-day streak',
    unlockSource: 'streak',
    defaultScale: 1.1,
    isResizable: true,
    isRotatable: true
  },

  // --- COMPANIONS & PETS ---
  {
    id: 'pet-luna-cat',
    name: 'Luna the Reading Cat',
    category: 'companion',
    icon: '🐱',
    visualStyle: 'pink_garden',
    description: 'A sweet calico kitty who curls up right beside you whenever you open a book.',
    unlocked: true,
    unlockCondition: 'Welcome Gift',
    unlockSource: 'starter',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: true,
    interactiveType: 'companion_pet',
    interactiveData: {
      petName: 'Luna',
      petDialogue: 'Purrr! You are doing amazing today! Let’s read another chapter together! 🐾'
    }
  },
  {
    id: 'pet-barnaby-owl',
    name: 'Barnaby the Scholar Owl',
    category: 'companion',
    icon: '🦉',
    visualStyle: 'animal_world',
    description: 'A wise horned owl wearing round spectacles who loves vocabulary roots.',
    unlocked: false,
    unlockCondition: 'Learn 8 words or reach Level 2',
    unlockSource: 'vocabulary',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: true,
    interactiveType: 'companion_pet',
    interactiveData: {
      petName: 'Barnaby',
      petDialogue: 'Hoo-hoo! Did you know words have roots that connect like tree branches? Fascinating! 📚'
    }
  },
  {
    id: 'pet-pippin-bunny',
    name: 'Pippin the Study Bunny',
    category: 'companion',
    icon: '🐰',
    visualStyle: 'pink_garden',
    description: 'A fluffy white lop-eared rabbit who hops excitedly when you get answers right.',
    unlocked: false,
    unlockCondition: 'Review 15 flashcards',
    unlockSource: 'flashcards',
    defaultScale: 0.9,
    isResizable: true,
    isRotatable: true,
    interactiveType: 'companion_pet',
    interactiveData: {
      petName: 'Pippin',
      petDialogue: 'Hop hop! Your memory is getting super bouncy and fast! Keep it up! 🥕'
    }
  },
  {
    id: 'pet-sparky-pup',
    name: 'Sparky the Spelling Pup',
    category: 'companion',
    icon: '🐶',
    visualStyle: 'animal_world',
    description: 'A joyful golden puppy who wags his tail at every correctly spelled word.',
    unlocked: false,
    unlockCondition: 'Complete your first True Spelling Test',
    unlockSource: 'spelling',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: true,
    interactiveType: 'companion_pet',
    interactiveData: {
      petName: 'Sparky',
      petDialogue: 'Woof! You spelled that with total confidence! I’m cheering for you! 🎾'
    }
  },
  {
    id: 'pet-pip-fox',
    name: 'Pip the Explorer Fox',
    category: 'companion',
    icon: '🦊',
    visualStyle: 'animal_world',
    description: 'A clever reddish-orange cub who loves trekking into new stories.',
    unlocked: false,
    unlockCondition: 'Read for 60 cumulative minutes',
    unlockSource: 'reading',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: true,
    interactiveType: 'companion_pet',
    interactiveData: {
      petName: 'Pip',
      petDialogue: 'Every book is an untrodden trail! Let’s explore another faraway world! 🌲'
    }
  },

  // --- DECORATIVE STICKERS & WALL ITEMS ---
  {
    id: 'sticker-rainbow-arc',
    name: 'Pastel Rainbow Wall Arc',
    category: 'sticker',
    icon: '🌈',
    visualStyle: 'pink_garden',
    description: 'Bright cheerful rainbow sticker that can be placed on any wall.',
    unlocked: true,
    unlockCondition: 'Starter Sticker',
    unlockSource: 'starter',
    defaultScale: 1.4,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'sticker-starlight-cluster',
    name: 'Glowing Starlight Trio',
    category: 'sticker',
    icon: '⭐',
    visualStyle: 'space_explorer',
    description: 'Golden radiant stars that bring night-sky wonder to your ceiling or walls.',
    unlocked: true,
    unlockCondition: 'Starter Sticker',
    unlockSource: 'starter',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'sticker-velvet-bow',
    name: 'Satin Rose Pink Bow',
    category: 'sticker',
    icon: '🎀',
    visualStyle: 'pink_garden',
    description: 'A classic sweet bow sticker you can stick on furniture, doors, or frames.',
    unlocked: true,
    unlockCondition: 'Starter Sticker',
    unlockSource: 'starter',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'sticker-flutter-butterfly',
    name: 'Azure Butterfly Pair',
    category: 'sticker',
    icon: '🦋',
    visualStyle: 'pink_garden',
    description: 'Graceful blue butterflies that look like they just drifted in from the garden.',
    unlocked: false,
    unlockCondition: 'Water 3 garden flower plots',
    unlockSource: 'vocabulary',
    defaultScale: 1.1,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'sticker-fluffy-cloud',
    name: 'Daydream Cumulus Cloud',
    category: 'sticker',
    icon: '☁️',
    visualStyle: 'pink_garden',
    description: 'Soft puffy cloud sticker to place around rainbows and stars.',
    unlocked: false,
    unlockCondition: 'Read for 15 minutes',
    unlockSource: 'reading',
    defaultScale: 1.2,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'sticker-sparkle-heart',
    name: 'Sparkle Gem Heart',
    category: 'sticker',
    icon: '💖',
    visualStyle: 'pink_garden',
    description: 'A radiant pink heart that celebrates your kind heart and loving dedication.',
    unlocked: false,
    unlockCondition: 'Complete a Faith Word reflection',
    unlockSource: 'vocabulary',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'sticker-magic-wand-sparkle',
    name: 'Enchanted Sparkle Dust',
    category: 'sticker',
    icon: '✨',
    visualStyle: 'fantasy_world',
    description: 'Little twinkling fairy specks to place anywhere for a touch of wonder.',
    unlocked: true,
    unlockCondition: 'Starter Sticker',
    unlockSource: 'starter',
    defaultScale: 0.9,
    isResizable: true,
    isRotatable: true
  },

  // --- THEMED FLAVORS: OCEAN & SPACE & FANTASY ---
  {
    id: 'decor-coral-aquarium',
    name: 'Sunken Reef Terrarium',
    category: 'decoration',
    icon: '🪸',
    visualStyle: 'ocean_adventure',
    description: 'A glowing water dome with colorful sea anemones and friendly clownfish.',
    unlocked: false,
    unlockCondition: 'Unlock Ocean Adventure theme or reach Level 3',
    unlockSource: 'milestone',
    defaultScale: 1.1,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'furn-celestial-globe',
    name: 'Orbiting Starlight Planetarium',
    category: 'furniture',
    icon: '🪐',
    visualStyle: 'space_explorer',
    description: 'A brass mechanical solar system that rotates miniature glowing planets.',
    unlocked: false,
    unlockCondition: 'Unlock Space Explorer theme or earn 200 XP',
    unlockSource: 'milestone',
    defaultScale: 1.2,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'furn-faith-peace-dove',
    name: 'Olive Branch Peace Dove Mobile',
    category: 'decoration',
    icon: '🕊️',
    visualStyle: 'cozy_modern',
    description: 'A gentle carved wooden dove carrying an olive sprig of peace and hope.',
    unlocked: false,
    unlockCondition: 'Practice 3 Faith words',
    unlockSource: 'word_mastery',
    associatedWord: 'Shalom',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: true,
    interactiveType: 'faith_corner',
    interactiveData: {
      title: 'Faith Corner',
      description: 'Reflect on scriptures and life-giving biblical vocabulary.',
      targetSection: 'faith_garden'
    }
  },

  // --- MAJOR ACHIEVEMENTS & SPECIAL ITEMS ---
  {
    id: 'spec-reading-champion-cup',
    name: 'The Golden Reader Trophy',
    category: 'special',
    icon: '🏆',
    visualStyle: 'cozy_modern',
    description: 'Gleaming gold cup inscribed: "Reader Today, Leader Tomorrow".',
    unlocked: false,
    unlockCondition: 'Read 100 cumulative minutes',
    unlockSource: 'reading',
    defaultScale: 1.1,
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'spec-knowledge-tree-fountain',
    name: 'Fountain of Living Knowledge',
    category: 'special',
    icon: '⛲',
    visualStyle: 'fantasy_world',
    description: 'A marble tabletop fountain where cool clear water flows over carved letters.',
    unlocked: false,
    unlockCondition: 'Master 15 total vocabulary words',
    unlockSource: 'vocabulary',
    defaultScale: 1.3,
    isResizable: true,
    isRotatable: true
  }
];

export const INITIAL_ROOMS: Record<HomeRoomId, HomeRoom> = {
  main_room: {
    id: 'main_room',
    name: 'Starter Home Living Space',
    subtitle: 'Your cozy starter haven to decorate with your favorite furniture and memories.',
    icon: '🏡',
    unlocked: true,
    unlockRequirement: 'Available to every learner from day one',
    unlockRequirementMet: true,
    styleTheme: 'pink_garden',
    wallpaperClass: 'bg-gradient-to-b from-pink-50/80 via-rose-50/40 to-amber-50/30',
    flooringClass: 'bg-gradient-to-t from-amber-100/70 via-orange-50/40 to-transparent border-t-2 border-amber-200/50',
    placedItems: [
      {
        instanceId: 'starter-bed-1',
        itemId: 'furn-starter-bed',
        x: 18,
        y: 62,
        scale: 1.2,
        rotation: 0,
        zIndex: 10
      },
      {
        instanceId: 'starter-rug-1',
        itemId: 'furn-starter-rug',
        x: 50,
        y: 72,
        scale: 1.3,
        rotation: 0,
        zIndex: 5
      },
      {
        instanceId: 'starter-lamp-1',
        itemId: 'furn-starter-lamp',
        x: 82,
        y: 65,
        scale: 0.95,
        rotation: 0,
        zIndex: 12
      },
      {
        instanceId: 'starter-rainbow-1',
        itemId: 'sticker-rainbow-arc',
        x: 50,
        y: 22,
        scale: 1.3,
        rotation: 0,
        zIndex: 3
      },
      {
        instanceId: 'starter-cat-1',
        itemId: 'pet-luna-cat',
        x: 35,
        y: 75,
        scale: 1.0,
        rotation: 0,
        zIndex: 15
      }
    ]
  },
  reading_room: {
    id: 'reading_room',
    name: 'The Reading Room & Nook',
    subtitle: 'A quiet sanctuary with tall oak shelves and sunlight for real books.',
    icon: '📚',
    unlocked: false,
    unlockRequirement: 'Read for 30 minutes or log 2 reading sessions',
    unlockRequirementMet: false,
    currentProgress: 0,
    maxProgress: 30,
    styleTheme: 'cozy_modern',
    wallpaperClass: 'bg-gradient-to-b from-amber-50/90 via-orange-50/50 to-stone-50/40',
    flooringClass: 'bg-gradient-to-t from-stone-200/80 via-amber-100/40 to-transparent border-t-2 border-stone-300/50',
    placedItems: [
      {
        instanceId: 'reading-bookshelf-1',
        itemId: 'furn-wonders-bookshelf',
        x: 22,
        y: 48,
        scale: 1.4,
        rotation: 0,
        zIndex: 10
      },
      {
        instanceId: 'reading-chair-1',
        itemId: 'furn-readers-armchair',
        x: 65,
        y: 65,
        scale: 1.25,
        rotation: 0,
        zIndex: 12
      }
    ]
  },
  creative_room: {
    id: 'creative_room',
    name: 'The Creative Spelling Studio',
    subtitle: 'Where letters, sounds, and vibrant decorations turn words into art.',
    icon: '🎨',
    unlocked: false,
    unlockRequirement: 'Master 5 spelling words or reach Level 3',
    unlockRequirementMet: false,
    currentProgress: 0,
    maxProgress: 5,
    styleTheme: 'pink_garden',
    wallpaperClass: 'bg-gradient-to-b from-purple-50/80 via-pink-50/40 to-indigo-50/30',
    flooringClass: 'bg-gradient-to-t from-purple-100/70 via-pink-50/30 to-transparent border-t-2 border-purple-200/50',
    placedItems: [
      {
        instanceId: 'creative-desk-1',
        itemId: 'furn-spelling-station',
        x: 48,
        y: 60,
        scale: 1.25,
        rotation: 0,
        zIndex: 10
      }
    ]
  },
  knowledge_garden: {
    id: 'knowledge_garden',
    name: 'My Knowledge Garden',
    subtitle: 'An open-air garden where every learned word physically sprouts, buds, and blooms.',
    icon: '🌳',
    unlocked: false,
    unlockRequirement: 'Master 5 vocabulary words',
    unlockRequirementMet: false,
    currentProgress: 0,
    maxProgress: 5,
    styleTheme: 'animal_world',
    wallpaperClass: 'bg-gradient-to-b from-sky-100/90 via-emerald-50/40 to-teal-50/30',
    flooringClass: 'bg-gradient-to-t from-emerald-200/90 via-green-100/60 to-transparent border-t-2 border-emerald-300/60',
    placedItems: [
      {
        instanceId: 'garden-fountain-1',
        itemId: 'spec-knowledge-tree-fountain',
        x: 50,
        y: 55,
        scale: 1.3,
        rotation: 0,
        zIndex: 8
      }
    ]
  },
  dream_room: {
    id: 'dream_room',
    name: 'Celestial Cosmic Room',
    subtitle: 'A room among the stars where goals glow like constellations.',
    icon: '🌙',
    unlocked: false,
    unlockRequirement: 'Maintain a 3-day streak or earn 300 XP',
    unlockRequirementMet: false,
    currentProgress: 0,
    maxProgress: 3,
    styleTheme: 'space_explorer',
    wallpaperClass: 'bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950',
    flooringClass: 'bg-gradient-to-t from-indigo-900/90 via-purple-900/50 to-transparent border-t-2 border-indigo-500/30',
    placedItems: [
      {
        instanceId: 'dream-planetarium-1',
        itemId: 'furn-celestial-globe',
        x: 50,
        y: 62,
        scale: 1.3,
        rotation: 0,
        zIndex: 10
      }
    ]
  },
  grand_library: {
    id: 'grand_library',
    name: 'The Grand Scholar Library',
    subtitle: 'A majestic hall celebrating a student who has read over 100 minutes.',
    icon: '🏰',
    unlocked: false,
    unlockRequirement: 'Read for 100 cumulative minutes or master 15 words',
    unlockRequirementMet: false,
    currentProgress: 0,
    maxProgress: 100,
    styleTheme: 'fantasy_world',
    wallpaperClass: 'bg-gradient-to-b from-amber-100/80 via-rose-50/40 to-amber-50/30',
    flooringClass: 'bg-gradient-to-t from-amber-200/90 via-yellow-100/50 to-transparent border-t-2 border-amber-300/60',
    placedItems: [
      {
        instanceId: 'grand-trophy-1',
        itemId: 'spec-reading-champion-cup',
        x: 50,
        y: 50,
        scale: 1.3,
        rotation: 0,
        zIndex: 10
      }
    ]
  }
};

export const INITIAL_STICKERS: StickerItem[] = [
  // --- LEARNING STICKERS ---
  {
    id: 'stk-curious-sprout',
    name: 'The Curious Sprout',
    icon: '🌱',
    category: 'learning',
    description: 'Earned when you show curiosity and learn your first new word!',
    unlockCondition: 'Learn 1 vocabulary word',
    unlocked: true,
    rarity: 'common'
  },
  {
    id: 'stk-word-bloom',
    name: 'The Word Bloom',
    icon: '🌸',
    category: 'learning',
    description: 'Awarded when your vocabulary reaches double digits with 10 words.',
    unlockCondition: 'Learn 10 vocabulary words',
    unlocked: false,
    rarity: 'sparkling'
  },
  {
    id: 'stk-magnificent-star',
    name: 'The Magnificent Crest',
    icon: '✨',
    category: 'learning',
    description: 'Recognizes deep understanding of descriptive and rich adjectives.',
    unlockCondition: 'Master the word "Magnificent"',
    unlocked: false,
    associatedWord: 'Magnificent',
    rarity: 'rare'
  },
  {
    id: 'stk-knowledge-tree',
    name: 'The Great Knowledge Oak',
    icon: '🌳',
    category: 'learning',
    description: 'Proof of a deep and sturdy foundation of reading and comprehension.',
    unlockCondition: 'Master 15 vocabulary words',
    unlocked: false,
    rarity: 'legendary'
  },

  // --- READING STICKERS ---
  {
    id: 'stk-reading-feather',
    name: 'Silver Quill Bookmark',
    icon: '🪶',
    category: 'reading',
    description: 'Given for picking up a real book and finishing a 15-minute timer.',
    unlockCondition: 'Complete your first 15-minute reading session',
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'stk-book-castle',
    name: 'The Citadel of Stories',
    icon: '🏰',
    category: 'reading',
    description: 'Unlocked by turning page after page and reading for over an hour.',
    unlockCondition: 'Reach 60 total reading minutes',
    unlocked: false,
    rarity: 'sparkling'
  },
  {
    id: 'stk-reading-lamp',
    name: 'Midnight Lantern',
    icon: '🏮',
    category: 'reading',
    description: 'For students who love getting lost in bedtime chapters.',
    unlockCondition: 'Log 4 total reading sessions',
    unlocked: false,
    rarity: 'rare'
  },

  // --- SPELLING STICKERS ---
  {
    id: 'stk-spelling-bee',
    name: 'The Golden Worker Bee',
    icon: '🐝',
    category: 'spelling',
    description: 'Buzzes with pride for listening carefully to letter sounds.',
    unlockCondition: 'Score 100% on a Spelling Adventure practice',
    unlocked: true,
    rarity: 'common'
  },
  {
    id: 'stk-perfect-pencil',
    name: 'Diamond Lead Pencil',
    icon: '✏️',
    category: 'spelling',
    description: 'Mastery badge for independent spelling recall without hints.',
    unlockCondition: 'Pass a True Spelling Test with 100%',
    unlocked: false,
    rarity: 'sparkling'
  },
  {
    id: 'stk-alphabet-crown',
    name: 'Crown of Syllables',
    icon: '👑',
    category: 'spelling',
    description: 'Awarded when you spell 10 words correctly in independent mode.',
    unlockCondition: 'Master 10 spelling words',
    unlocked: false,
    rarity: 'legendary'
  },

  // --- FAITH STICKERS ---
  {
    id: 'stk-peace-dove',
    name: 'Shalom Peace Dove',
    icon: '🕊️',
    category: 'faith',
    description: 'Represents peace, wholeness, and kindness to everyone around you.',
    unlockCondition: 'Master the Bible word "Shalom"',
    unlocked: false,
    associatedWord: 'Shalom',
    rarity: 'sparkling'
  },
  {
    id: 'stk-golden-cross',
    name: 'Golden Grace Emblem',
    icon: '✝️',
    category: 'faith',
    description: 'Reminds us that love, forgiveness, and grace lead the way.',
    unlockCondition: 'Practice 3 Bible words',
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'stk-heart-shepherd',
    name: 'Kind Shepherd Lamb',
    icon: '🐑',
    category: 'faith',
    description: 'Gentle reminder that every learner is known, protected, and loved.',
    unlockCondition: 'Master the Bible word "Grace"',
    unlocked: false,
    associatedWord: 'Grace',
    rarity: 'sparkling'
  },

  // --- SPECIAL EVENT & MILESTONES ---
  {
    id: 'stk-streak-flame',
    name: 'Everburning Hearth Flame',
    icon: '🔥',
    category: 'special_event',
    description: 'Honoring unwavering daily practice and consistent dedication.',
    unlockCondition: 'Reach a 3-day learning streak',
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'stk-celestial-comet',
    name: 'Shooting Star Comet',
    icon: '💫',
    category: 'special_event',
    description: 'Awarded when your overall XP surpasses 250 points!',
    unlockCondition: 'Earn 250 total XP',
    unlocked: false,
    rarity: 'sparkling'
  },
  {
    id: 'stk-trophy-superstar',
    name: 'The Ultimate Scholar Ribbon',
    icon: '🎖️',
    category: 'special_event',
    description: 'The highest honor in BloomWord for well-rounded excellence.',
    unlockCondition: 'Unlock all 4 main learning features',
    unlocked: false,
    rarity: 'legendary'
  }
];

export const ROOM_THEME_OPTIONS: {
  id: HomeRoom['styleTheme'];
  name: string;
  icon: string;
  description: string;
  wallpaperClass: string;
  flooringClass: string;
}[] = [
  {
    id: 'pink_garden',
    name: '🌸 Pink Garden',
    icon: '🌸',
    description: 'Soft pinks, cherry blossom accents, pastel rugs, and fairy lights.',
    wallpaperClass: 'bg-gradient-to-b from-pink-100/90 via-rose-50/60 to-pink-50/40',
    flooringClass: 'bg-gradient-to-t from-pink-200/80 via-rose-100/40 to-transparent border-t-2 border-pink-300/50'
  },
  {
    id: 'ocean_adventure',
    name: '🌊 Ocean Adventure',
    icon: '🌊',
    description: 'Sunlit aquamarine waters, coral decorations, and gentle sea breezes.',
    wallpaperClass: 'bg-gradient-to-b from-sky-200/90 via-cyan-100/60 to-teal-50/40',
    flooringClass: 'bg-gradient-to-t from-teal-200/80 via-cyan-100/40 to-transparent border-t-2 border-teal-300/50'
  },
  {
    id: 'space_explorer',
    name: '🚀 Space Explorer',
    icon: '🚀',
    description: 'Deep midnight navy, glowing constellations, orbiting planets, and nebula dust.',
    wallpaperClass: 'bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950',
    flooringClass: 'bg-gradient-to-t from-indigo-900/90 via-purple-900/50 to-transparent border-t-2 border-indigo-500/40'
  },
  {
    id: 'animal_world',
    name: '🐾 Animal World',
    icon: '🐾',
    description: 'Warm terracotta, leafy botanical greens, cozy treehouse warmth, and critters.',
    wallpaperClass: 'bg-gradient-to-b from-emerald-100/90 via-lime-50/60 to-amber-50/40',
    flooringClass: 'bg-gradient-to-t from-amber-200/80 via-emerald-100/40 to-transparent border-t-2 border-amber-300/50'
  },
  {
    id: 'fantasy_world',
    name: '🏰 Fantasy Kingdom',
    icon: '🏰',
    description: 'Royal purples, crystal chandeliers, enchanted tapestries, and magic scrolls.',
    wallpaperClass: 'bg-gradient-to-b from-purple-100/90 via-indigo-50/60 to-fuchsia-50/40',
    flooringClass: 'bg-gradient-to-t from-purple-200/80 via-indigo-100/40 to-transparent border-t-2 border-purple-300/50'
  },
  {
    id: 'cozy_modern',
    name: '🪴 Cozy Modern Studio',
    icon: '🪴',
    description: 'Warm cream, natural light oak wood, minimalist potted monsteras, and soft linen.',
    wallpaperClass: 'bg-gradient-to-b from-stone-100/90 via-amber-50/50 to-orange-50/30',
    flooringClass: 'bg-gradient-to-t from-amber-100/80 via-stone-100/40 to-transparent border-t-2 border-amber-200/50'
  }
];

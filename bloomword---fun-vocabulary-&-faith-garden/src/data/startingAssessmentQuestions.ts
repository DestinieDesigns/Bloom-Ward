export interface AssessmentQuestion {
  id: string;
  category: 'vocabulary' | 'definitions' | 'spelling' | 'reading' | 'recognition';
  tier: 1 | 2 | 3; // 1: Foundational, 2: Intermediate, 3: Advanced
  prompt: string;
  subPrompt?: string;
  targetWord?: string;
  audioWord?: string;
  audioSentence?: string;
  passage?: string;
  passageTitle?: string;
  options?: string[];
  correctAnswer: string; // for spelling: the exact word string (case insensitive)
  explanation?: string;
}

export const VOCABULARY_QUESTIONS: AssessmentQuestion[] = [
  // Tier 1
  {
    id: 'vocab_1',
    category: 'vocabulary',
    tier: 1,
    targetWord: 'Brave',
    prompt: 'What does the word "Brave" mean?',
    options: [
      'Feeling courageous even when something is scary',
      'Feeling very sleepy in the morning',
      'Running away as fast as possible',
      'Forgetting where you put your shoes'
    ],
    correctAnswer: 'Feeling courageous even when something is scary',
    explanation: 'Being brave means having courage even when something feels scary!'
  },
  {
    id: 'vocab_2',
    category: 'vocabulary',
    tier: 1,
    targetWord: 'Curious',
    prompt: 'What does the word "Curious" mean?',
    options: [
      'Eager to learn, explore, and ask questions',
      'Feeling angry and shouting loudly',
      'Moving slowly like a turtle',
      'Refusing to try anything new'
    ],
    correctAnswer: 'Eager to learn, explore, and ask questions',
    explanation: 'Curious means being eager to discover new facts and explore the world!'
  },
  {
    id: 'vocab_3',
    category: 'vocabulary',
    tier: 1,
    targetWord: 'Gentle',
    prompt: 'What does the word "Gentle" mean?',
    options: [
      'Kind, careful, and soft in touch or manner',
      'Loud, crashing, and stormy',
      'Breaking objects into pieces',
      'Hidden deep under the dark ocean'
    ],
    correctAnswer: 'Kind, careful, and soft in touch or manner',
    explanation: 'Gentle means handling things softly and treating others with kindness.'
  },
  // Tier 2
  {
    id: 'vocab_4',
    category: 'vocabulary',
    tier: 2,
    targetWord: 'Ancient',
    prompt: 'What does the word "Ancient" mean?',
    options: [
      'Belonging to a very distant past in history',
      'Made of brand new plastic yesterday',
      'Bright green like fresh grass',
      'Very loud and noisy'
    ],
    correctAnswer: 'Belonging to a very distant past in history',
    explanation: 'Ancient refers to something very old from long ago in history.'
  },
  {
    id: 'vocab_5',
    category: 'vocabulary',
    tier: 2,
    targetWord: 'Radiant',
    prompt: 'What does the word "Radiant" mean?',
    options: [
      'Shining brightly or showing joyful happiness',
      'Cold, shivering, and damp',
      'Completely silent and invisible',
      'Dull and gray without any color'
    ],
    correctAnswer: 'Shining brightly or showing joyful happiness',
    explanation: 'Radiant describes glowing light or a face beaming with pure joy.'
  },
  {
    id: 'vocab_6',
    category: 'vocabulary',
    tier: 2,
    targetWord: 'Persevere',
    prompt: 'What does the word "Persevere" mean?',
    options: [
      'To keep trying even when something is challenging',
      'To give up immediately when trouble comes',
      'To take a long nap instead of doing work',
      'To whisper a secret in the classroom'
    ],
    correctAnswer: 'To keep trying even when something is challenging',
    explanation: 'Persevering means staying determined and not giving up!'
  },
  // Tier 3
  {
    id: 'vocab_7',
    category: 'vocabulary',
    tier: 3,
    targetWord: 'Meticulous',
    prompt: 'What does the word "Meticulous" mean?',
    options: [
      'Showing great attention to every small detail',
      'Rushing carelessly through homework',
      'Heavy and impossible to lift',
      'Easily broken like fragile glass'
    ],
    correctAnswer: 'Showing great attention to every small detail',
    explanation: 'A meticulous person is extremely careful, precise, and thorough.'
  },
  {
    id: 'vocab_8',
    category: 'vocabulary',
    tier: 3,
    targetWord: 'Tranquil',
    prompt: 'What does the word "Tranquil" mean?',
    options: [
      'Calm, serene, and completely peaceful',
      'Wild and chaotic like a hurricane',
      'Sharp and dangerous to the touch',
      'Full of sirens and shouting'
    ],
    correctAnswer: 'Calm, serene, and completely peaceful',
    explanation: 'Tranquil describes a quiet, peaceful, and undisturbed setting.'
  }
];

export const DEFINITION_QUESTIONS: AssessmentQuestion[] = [
  // Tier 1
  {
    id: 'def_1',
    category: 'definitions',
    tier: 1,
    prompt: 'Which word matches this meaning?',
    subPrompt: '"Having great kindness and willingness to share with others."',
    options: ['Generous', 'Greedy', 'Grumpy', 'Sleepy'],
    correctAnswer: 'Generous',
    explanation: 'Generous means happy to give and share with people!'
  },
  {
    id: 'def_2',
    category: 'definitions',
    tier: 1,
    prompt: 'Which word matches this meaning?',
    subPrompt: '"Extremely small or miniature in size."',
    options: ['Tiny', 'Gigantic', 'Enormous', 'Heavy'],
    correctAnswer: 'Tiny',
    explanation: 'Tiny describes something very small, like a speck or ladybug!'
  },
  {
    id: 'def_3',
    category: 'definitions',
    tier: 1,
    prompt: 'Which word matches this meaning?',
    subPrompt: '"Full of bright cheer, smiles, and sunny happiness."',
    options: ['Cheerful', 'Gloomy', 'Bitter', 'Weary'],
    correctAnswer: 'Cheerful',
    explanation: 'Cheerful means noticeably happy, positive, and optimistic.'
  },
  // Tier 2
  {
    id: 'def_4',
    category: 'definitions',
    tier: 2,
    prompt: 'Which word matches this meaning?',
    subPrompt: '"Able to recover quickly and stay strong after a setback or difficulty."',
    options: ['Resilient', 'Fragile', 'Hesitant', 'Careless'],
    correctAnswer: 'Resilient',
    explanation: 'Resilient individuals bounce back after hardship with renewed strength.'
  },
  {
    id: 'def_5',
    category: 'definitions',
    tier: 2,
    prompt: 'Which word matches this meaning?',
    subPrompt: '"A warm feeling of thankfulness and appreciation for kindness received."',
    options: ['Gratitude', 'Jealousy', 'Suspicion', 'Impatience'],
    correctAnswer: 'Gratitude',
    explanation: 'Gratitude is counting your blessings and saying thank you from the heart.'
  },
  {
    id: 'def_6',
    category: 'definitions',
    tier: 2,
    prompt: 'Which word matches this meaning?',
    subPrompt: '"A bold, exciting quest or journey filled with new discoveries."',
    options: ['Adventure', 'Chore', 'Schedule', 'Slumber'],
    correctAnswer: 'Adventure',
    explanation: 'An adventure is an exciting voyage full of wonder and novelty.'
  },
  // Tier 3
  {
    id: 'def_7',
    category: 'definitions',
    tier: 3,
    prompt: 'Which word matches this meaning?',
    subPrompt: '"Holding someone\'s interest completely because of great charm or beauty."',
    options: ['Captivating', 'Monotonous', 'Ordinary', 'Dull'],
    correctAnswer: 'Captivating',
    explanation: 'Something captivating grabs your whole attention with its beauty or excitement.'
  },
  {
    id: 'def_8',
    category: 'definitions',
    tier: 3,
    prompt: 'Which word matches this meaning?',
    subPrompt: '"Showing wise caution, good judgment, and careful planning for the future."',
    options: ['Prudent', 'Reckless', 'Hasty', 'Foolish'],
    correctAnswer: 'Prudent',
    explanation: 'A prudent decision is sensible, thoughtful, and well planned.'
  }
];

export const SPELLING_QUESTIONS: AssessmentQuestion[] = [
  // Tier 1
  {
    id: 'spell_1',
    category: 'spelling',
    tier: 1,
    targetWord: 'friend',
    audioWord: 'friend',
    audioSentence: 'A loyal friend is kind and trustworthy.',
    prompt: 'Listen carefully and spell the word:',
    subPrompt: 'Click the speaker icon to hear the word and sentence.',
    correctAnswer: 'friend',
    explanation: 'Remember the saying: A good fri-end stays until the end!'
  },
  {
    id: 'spell_2',
    category: 'spelling',
    tier: 1,
    targetWord: 'bright',
    audioWord: 'bright',
    audioSentence: 'The morning sunshine was warm and bright.',
    prompt: 'Listen carefully and spell the word:',
    subPrompt: 'Click the speaker icon to hear the word and sentence.',
    correctAnswer: 'bright',
    explanation: 'Bright uses the silent "-ight" vowel pattern!'
  },
  {
    id: 'spell_3',
    category: 'spelling',
    tier: 1,
    targetWord: 'garden',
    audioWord: 'garden',
    audioSentence: 'Colorful flowers bloomed across the garden.',
    prompt: 'Listen carefully and spell the word:',
    subPrompt: 'Click the speaker icon to hear the word and sentence.',
    correctAnswer: 'garden',
    explanation: 'G-A-R-D-E-N: Gar-den has two smooth syllables.'
  },
  // Tier 2
  {
    id: 'spell_4',
    category: 'spelling',
    tier: 2,
    targetWord: 'curious',
    audioWord: 'curious',
    audioSentence: 'The curious child asked many wonderful questions.',
    prompt: 'Listen carefully and spell the word:',
    subPrompt: 'Click the speaker icon to hear the word and sentence.',
    correctAnswer: 'curious',
    explanation: 'C-U-R-I-O-U-S ends with the famous "-ious" suffix!'
  },
  {
    id: 'spell_5',
    category: 'spelling',
    tier: 2,
    targetWord: 'whisper',
    audioWord: 'whisper',
    audioSentence: 'She spoke in a gentle whisper so the baby could sleep.',
    prompt: 'Listen carefully and spell the word:',
    subPrompt: 'Click the speaker icon to hear the word and sentence.',
    correctAnswer: 'whisper',
    explanation: 'Whisper starts with "wh" and ends with "-er".'
  },
  {
    id: 'spell_6',
    category: 'spelling',
    tier: 2,
    targetWord: 'journey',
    audioWord: 'journey',
    audioSentence: 'They packed their bags for an exciting journey.',
    prompt: 'Listen carefully and spell the word:',
    subPrompt: 'Click the speaker icon to hear the word and sentence.',
    correctAnswer: 'journey',
    explanation: 'J-O-U-R-N-E-Y has the "our" and ends with "-ey".'
  },
  // Tier 3
  {
    id: 'spell_7',
    category: 'spelling',
    tier: 3,
    targetWord: 'magnificent',
    audioWord: 'magnificent',
    audioSentence: 'The view of the mountain range was truly magnificent.',
    prompt: 'Listen carefully and spell the word:',
    subPrompt: 'Click the speaker icon to hear the word and sentence.',
    correctAnswer: 'magnificent',
    explanation: 'Mag-nif-i-cent has four syllables: M-A-G-N-I-F-I-C-E-N-T.'
  },
  {
    id: 'spell_8',
    category: 'spelling',
    tier: 3,
    targetWord: 'courageous',
    audioWord: 'courageous',
    audioSentence: 'The courageous explorer stepped bravely across the bridge.',
    prompt: 'Listen carefully and spell the word:',
    subPrompt: 'Click the speaker icon to hear the word and sentence.',
    correctAnswer: 'courageous',
    explanation: 'Courage + eous: C-O-U-R-A-G-E-O-U-S!'
  }
];

export const READING_PASSAGES = [
  {
    id: 'passage_willow',
    title: 'The Whispering Willow',
    text: 'Maya loved visiting the grand willow tree in Meadowbrook Park. Its emerald leaves draped to the soft grass like curtains of green silk. Yesterday, Maya noticed two tiny hummingbirds weaving a cozy nest of green moss and spider silk high among the swaying branches. She smiled and promised to keep their secret sanctuary safe.',
    tier: 1 as const,
    questions: [
      {
        id: 'reading_1',
        category: 'reading' as const,
        tier: 1 as const,
        prompt: 'What did Maya discover in the willow tree?',
        options: [
          'Two tiny hummingbirds building a cozy nest',
          'A lost silver necklace',
          'A playful squirrel stealing acorns',
          'An old treasure map hidden in the bark'
        ],
        correctAnswer: 'Two tiny hummingbirds building a cozy nest',
        explanation: 'Maya spotted the hummingbirds weaving their nest of moss!'
      },
      {
        id: 'reading_2',
        category: 'reading' as const,
        tier: 1 as const,
        prompt: 'What does the story mean by "curtains of green silk"?',
        options: [
          'The tree\'s long, flowing emerald leaves',
          'Real fabric curtains hung on the branches',
          'A green dress Maya wore to the park',
          'A green tent pitched on the grass'
        ],
        correctAnswer: 'The tree\'s long, flowing emerald leaves',
        explanation: 'It uses a poetic metaphor to describe the weeping willow\'s leaves!'
      },
      {
        id: 'reading_3',
        category: 'reading' as const,
        tier: 2 as const,
        prompt: 'Why did Maya promise to keep their secret safe?',
        options: [
          'To protect the birds and allow them to nest peacefully',
          'Because the park ranger asked her to leave',
          'She wanted to catch the hummingbirds later',
          'She had forgotten her notebook at home'
        ],
        correctAnswer: 'To protect the birds and allow them to nest peacefully',
        explanation: 'Maya cared about the birds and wanted their sanctuary undisturbed.'
      }
    ]
  },
  {
    id: 'passage_telescope',
    title: 'Leo\'s Starlit Telescope',
    text: 'On crisp autumn evenings, Leo and his grandfather set up a polished brass telescope on the back porch. Grandpa taught Leo how to navigate constellations like Orion and Cassiopeia. When Leo peered through the eyepiece tonight, he gasped: four miniature, glowing pearls rested beside Jupiter—the planet\'s famous Galilean moons orbiting serenely in the deep cosmos.',
    tier: 2 as const,
    questions: [
      {
        id: 'reading_4',
        category: 'reading' as const,
        tier: 2 as const,
        prompt: 'Who was teaching Leo how to locate constellations?',
        options: [
          'His grandfather',
          'His science teacher',
          'His classmate at school',
          'A park astronomer'
        ],
        correctAnswer: 'His grandfather',
        explanation: 'Grandpa taught Leo how to navigate constellations like Orion.'
      },
      {
        id: 'reading_5',
        category: 'reading' as const,
        tier: 2 as const,
        prompt: 'What were the "four miniature glowing pearls" Leo observed?',
        options: [
          'Jupiter\'s Galilean moons orbiting the planet',
          'Actual pearls stuck to the glass lens',
          'Distant shooting stars entering the atmosphere',
          'Street lamps down the neighborhood block'
        ],
        correctAnswer: 'Jupiter\'s Galilean moons orbiting the planet',
        explanation: 'The telescope revealed Jupiter\'s four famous moons shining in orbit.'
      },
      {
        id: 'reading_6',
        category: 'reading' as const,
        tier: 3 as const,
        prompt: 'What is the overarching theme of this passage?',
        options: [
          'The shared wonder and joy of exploring the universe with family',
          'Why antique brass telescopes are expensive to repair',
          'The exact scientific temperature of autumn nights',
          'Why Jupiter has more moons than Earth'
        ],
        correctAnswer: 'The shared wonder and joy of exploring the universe with family',
        explanation: 'The passage highlights the special bond and shared awe of stargazing.'
      }
    ]
  }
];

export const RECOGNITION_QUESTIONS: AssessmentQuestion[] = [
  // Tier 1
  {
    id: 'rec_1',
    category: 'recognition',
    tier: 1,
    audioWord: 'delight',
    audioSentence: 'The puppy brought delight to the whole family.',
    prompt: 'Listen to the spoken word. Which word matches what you heard?',
    options: ['delight', 'daylight', 'polite', 'defeat'],
    correctAnswer: 'delight',
    explanation: 'You heard "delight", meaning great joy and pleasure!'
  },
  {
    id: 'rec_2',
    category: 'recognition',
    tier: 1,
    audioWord: 'wonder',
    audioSentence: 'She looked at the starry sky with pure wonder.',
    prompt: 'Listen to the spoken word. Which word matches what you heard?',
    options: ['wonder', 'wander', 'winter', 'window'],
    correctAnswer: 'wonder',
    explanation: 'You heard "wonder" (with an "o"), which means a feeling of amazement.'
  },
  // Tier 2
  {
    id: 'rec_3',
    category: 'recognition',
    tier: 2,
    audioWord: 'treasure',
    audioSentence: 'They found a chest filled with silver treasure.',
    prompt: 'Listen to the spoken word. Which word matches what you heard?',
    options: ['treasure', 'pleasure', 'measure', 'feather'],
    correctAnswer: 'treasure',
    explanation: 'You heard "treasure"!'
  },
  {
    id: 'rec_4',
    category: 'recognition',
    tier: 2,
    audioWord: 'brilliant',
    audioSentence: 'She had a brilliant idea for her science project.',
    prompt: 'Listen to the spoken word. Which word matches what you heard?',
    options: ['brilliant', 'billion', 'balance', 'blanket'],
    correctAnswer: 'brilliant',
    explanation: 'You heard "brilliant", meaning exceptionally clever or radiant!'
  },
  // Tier 3
  {
    id: 'rec_5',
    category: 'recognition',
    tier: 3,
    audioWord: 'resilient',
    audioSentence: 'The resilient seedling grew strong despite the dry soil.',
    prompt: 'Listen to the spoken word. Which word matches what you heard?',
    options: ['resilient', 'resident', 'relieved', 'reluctant'],
    correctAnswer: 'resilient',
    explanation: 'You heard "resilient"!'
  },
  {
    id: 'rec_6',
    category: 'recognition',
    tier: 3,
    audioWord: 'harmony',
    audioSentence: 'The singing voices blended in gentle harmony.',
    prompt: 'Listen to the spoken word. Which word matches what you heard?',
    options: ['harmony', 'hardware', 'horizon', 'honorary'],
    correctAnswer: 'harmony',
    explanation: 'You heard "harmony"!'
  }
];

export interface StartingPathDefinition {
  id: 'word_explorer' | 'word_builder' | 'word_adventurer' | 'word_scholar' | 'word_master';
  title: string;
  tagline: string;
  description: string;
  icon: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    gradient: string;
  };
  recommendedGoals: {
    readingMinutes: number;
    vocabularyWords: number;
    flashcardsCount: number;
    spellingWords: number;
  };
}

export const STARTING_PATHS: Record<string, StartingPathDefinition> = {
  word_explorer: {
    id: 'word_explorer',
    title: 'Word Explorer',
    tagline: 'Building Strong Foundations',
    description: 'You have a wonderful curiosity! We will build a solid base of everyday vocabulary, friendly spelling habits, and reading confidence together.',
    icon: '🌱',
    colorScheme: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-800',
      gradient: 'from-emerald-500 to-teal-600'
    },
    recommendedGoals: {
      readingMinutes: 15,
      vocabularyWords: 3,
      flashcardsCount: 5,
      spellingWords: 3
    }
  },
  word_builder: {
    id: 'word_builder',
    title: 'Word Builder',
    tagline: 'Growing Vocabulary & Confidence',
    description: 'You understand core meanings and everyday words with ease! Now we will expand into multi-syllable treasures, clear definitions, and sharp spelling.',
    icon: '🌿',
    colorScheme: {
      bg: 'bg-lime-50',
      border: 'border-lime-300',
      text: 'text-lime-800',
      gradient: 'from-lime-500 to-emerald-600'
    },
    recommendedGoals: {
      readingMinutes: 15,
      vocabularyWords: 5,
      flashcardsCount: 10,
      spellingWords: 3
    }
  },
  word_adventurer: {
    id: 'word_adventurer',
    title: 'Word Adventurer',
    tagline: 'Exploring More Challenging Words',
    description: 'You are ready to tackle vivid descriptive language, context clues, and deeper reading comprehension across adventurous stories!',
    icon: '🌸',
    colorScheme: {
      bg: 'bg-pink-50',
      border: 'border-pink-300',
      text: 'text-pink-800',
      gradient: 'from-pink-500 to-rose-600'
    },
    recommendedGoals: {
      readingMinutes: 20,
      vocabularyWords: 5,
      flashcardsCount: 10,
      spellingWords: 5
    }
  },
  word_scholar: {
    id: 'word_scholar',
    title: 'Word Scholar',
    tagline: 'Ready for Advanced Vocabulary',
    description: 'You have impressive word recognition and comprehension skills. We will dive into rich literature terms, precise definitions, and complex spelling patterns!',
    icon: '⭐',
    colorScheme: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-800',
      gradient: 'from-amber-500 to-orange-600'
    },
    recommendedGoals: {
      readingMinutes: 25,
      vocabularyWords: 5,
      flashcardsCount: 15,
      spellingWords: 5
    }
  },
  word_master: {
    id: 'word_master',
    title: 'Word Master',
    tagline: 'Strong Vocabulary Ready for Greater Challenges',
    description: 'Outstanding mastery! You navigate nuanced definitions, advanced spellings, and analytical reading with ease. You are ready for elite vocabulary quests!',
    icon: '👑',
    colorScheme: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-300',
      text: 'text-indigo-800',
      gradient: 'from-indigo-600 to-purple-700'
    },
    recommendedGoals: {
      readingMinutes: 30,
      vocabularyWords: 5,
      flashcardsCount: 15,
      spellingWords: 5
    }
  }
};

import { ThemeId } from '../types';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  borderHover: string;
  ring: string;
  badgeBg: string;
  badgeText: string;
  gradientBg: string;
  heroGradient: string;
  buttonGradient: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  displayStyle: string;
}

export interface ThemeUI {
  buttonStyle: string;
  cardStyle: string;
  navigationStyle: string;
  progressStyle:
    | 'bookshelf'
    | 'plant_growth'
    | 'water_journey'
    | 'mission_tracker'
    | 'art_canvas'
    | 'hud_level'
    | 'scoreboard'
    | 'lab_chart'
    | 'journey_map'
    | 'blossom_meadow'
    | 'scripture_steps'
    | 'modern_minimal';
  borderRadius: string;
  shadowStyle: string;
}

export interface ThemeMotion {
  transitionStyle: string;
  hoverEffect: string;
  completionEffect: string;
  ambientAnimation: string;
}

export interface ThemeLearningExperience {
  todayPathTitle: string;
  todayPathSubtitle: string;
  navLabels: {
    learn: string;
    read: string;
    practice: string;
    test: string;
    home: string;
  };
  progressPresentation: {
    metaphor: string;
    stageNames: string[];
    unitLabel: string;
    visualIcon: string;
  };
  practicePresentation: {
    modeTitle: string;
    flashcardStyle: 'journal' | 'mission_hud' | 'canvas' | 'game_card' | 'field_guide' | 'minimal';
    flashcardFrontBadge: string;
    spellingPrompt: string;
  };
  readingPresentation: {
    spaceTitle: string;
    tagline: string;
    companionName: string;
    stageIcons: string[];
  };
  testPresentation: {
    testTitle: string;
    resultsTitle: string;
    focusTitle: string;
  };
  rewardPresentation: {
    celebrationPhrase: string;
    rewardNoun: string;
    rewardIcon: string;
  };
  feedbackPhrases: {
    correct: string;
    encourage: string;
  };
}

export interface ThemeHomeEnvironment {
  roomStyle: string;
  wallColor: string;
  floorColor: string;
  windowView:
    | 'garden'
    | 'stars'
    | 'ocean'
    | 'forest'
    | 'studio'
    | 'arcade'
    | 'stadium'
    | 'lab'
    | 'mountains'
    | 'field'
    | 'peaceful_terrace'
    | 'city';
  lighting: 'warm' | 'cool_futuristic' | 'daylight' | 'sunset' | 'candlelight' | 'neon';
  ambientDecor: string[];
  plantStyle: string;
  petAccessory: string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  category:
    | 'starter'
    | 'nature'
    | 'sci_fi'
    | 'creative'
    | 'active'
    | 'academic'
    | 'adventure'
    | 'whimsical'
    | 'faith';
  tagline: string;
  badge: string;
  icon: string;
  description: string;
  subtitle: string;

  colors: ThemeColors;
  typography: ThemeTypography;
  ui: ThemeUI;
  motion: ThemeMotion;
  learningExperience: ThemeLearningExperience;
  home: ThemeHomeEnvironment;
  ambientSound: 'room' | 'forest' | 'space' | 'waves' | 'rain' | 'arcade' | 'chimes' | 'none';

  // Backward compatibility fields for existing components
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  accentText: string;
  primaryText: string;
  buttonGradient: string;
  heroGradient: string;
  badgeBg: string;
  navActive: string;
  worldMetaphor: {
    worldName: string;
    progressNoun: string;
    statusIcon: string;
    actionVerb: string;
    milestoneLabel: string;
  };
  readingCompanion: {
    title: string;
    description: string;
    stageIcons: string[];
    travelerName: string;
  };
}

// 12 Initial Comprehensive Themes
export const THEMES: Record<ThemeId, ThemeConfig> = {
  // 1. COZY COTTAGE (Warm, bookish, sage, cream, natural wood)
  cozy_cottage: {
    id: 'cozy_cottage',
    name: 'Cozy Cottage',
    category: 'starter',
    icon: '🏡',
    badge: '🛋️ Warm & Bookish',
    tagline: 'Warm. Comfortable. Calm. Homey.',
    subtitle: 'Cream, warm wood, sage green, and soft amber bookish corners',
    description:
      'A gentle, peaceful sanctuary filled with shelves of beloved books, warm wooden surfaces, thriving houseplants, and tea by the window.',
    colors: {
      background: '#FAF6EE',
      surface: '#FFFFFF',
      surfaceSecondary: '#F5EFE1',
      primary: '#8B5E3C',
      secondary: '#6E8B74',
      accent: '#C89B3C',
      text: '#2D251E',
      textSecondary: '#6B5E51',
      border: '#E8DEC8',
      borderHover: '#D4C6A8',
      ring: '#C89B3C',
      badgeBg: '#F3ECE0',
      badgeText: '#6A4A28',
      gradientBg: 'from-[#FAF6EE] via-[#FFFDF9] to-[#F3EDE0]',
      heroGradient: 'from-[#3A291E] via-[#5C4033] to-[#2D3E33]',
      buttonGradient:
        'from-[#8B5E3C] via-[#744E32] to-[#5C3D26] hover:from-[#744E32] hover:to-[#4A311F] text-white shadow-[#C89B3C]/30'
    },
    typography: {
      headingFont: "font-['Fredoka']",
      bodyFont: "font-['Quicksand']",
      displayStyle: 'tracking-normal'
    },
    ui: {
      buttonStyle:
        'rounded-2xl border border-amber-900/20 shadow-xs hover:shadow-md transition-all active:scale-98 font-bold',
      cardStyle: 'rounded-3xl border-2 border-amber-200/80 bg-white/95 shadow-sm',
      navigationStyle: 'rounded-2xl bg-amber-100/60 text-amber-900',
      progressStyle: 'bookshelf',
      borderRadius: 'rounded-3xl',
      shadowStyle: 'shadow-md shadow-amber-900/5'
    },
    motion: {
      transitionStyle: 'transition-all duration-300 ease-out',
      hoverEffect: 'hover:translate-y-[-2px] hover:shadow-md',
      completionEffect: 'gentle_bloom',
      ambientAnimation: 'gentle_breeze'
    },
    learningExperience: {
      todayPathTitle: "Today's Learning Path",
      todayPathSubtitle: 'Steady, calm progress one word at a time in your study nook.',
      navLabels: {
        learn: 'Learn',
        read: 'Read',
        practice: 'Practice',
        test: 'Review',
        home: 'My Cottage'
      },
      progressPresentation: {
        metaphor: 'Growing Bookshelf',
        stageNames: ['First Chapter', 'Reading Nook', 'Curated Shelf', 'Grand Library', 'Master Scholar'],
        unitLabel: 'Chapters Read',
        visualIcon: '📚'
      },
      practicePresentation: {
        modeTitle: 'Review Session',
        flashcardStyle: 'journal',
        flashcardFrontBadge: 'Study Journal',
        spellingPrompt: 'Can you spell this cozy word?'
      },
      readingPresentation: {
        spaceTitle: 'Warm Library Nook',
        tagline: 'Settle in with tea and comfortable cushions for 15 calm reading minutes.',
        companionName: 'Barnaby the Cottage Pup 🐕',
        stageIcons: ['🕯️', '📖', '☕', '📜', '🏆']
      },
      testPresentation: {
        testTitle: 'Weekly Check-In',
        resultsTitle: 'Your Weekly Growth',
        focusTitle: 'Words to Polish'
      },
      rewardPresentation: {
        celebrationPhrase: 'Lovely work! You are growing stronger.',
        rewardNoun: 'Cottage Treasure',
        rewardIcon: '🪑'
      },
      feedbackPhrases: {
        correct: "Wonderful! You're getting stronger.",
        encourage: 'Take your time. You are building real understanding.'
      }
    },
    home: {
      roomStyle: 'Cottage Woodwork',
      wallColor: 'bg-amber-50/70',
      floorColor: 'bg-[#B08968]',
      windowView: 'garden',
      lighting: 'warm',
      ambientDecor: ['Warm desk lamp', 'Potted pothos vine', 'Antique book stack'],
      plantStyle: 'Sage pot with thriving herbs',
      petAccessory: 'Knitted plaid blanket'
    },
    ambientSound: 'room',
    bgGradient: 'from-[#FAF6EE] via-[#FFFDF9] to-[#F3EDE0]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-amber-200/80',
    accentText: 'text-amber-800',
    primaryText: 'text-stone-900',
    buttonGradient:
      'from-[#8B5E3C] via-[#744E32] to-[#5C3D26] hover:from-[#744E32] hover:to-[#4A311F] text-white shadow-amber-200/50',
    heroGradient: 'from-[#3A291E] via-[#5C4033] to-[#2D3E33]',
    badgeBg: 'bg-amber-100/90 text-amber-900 border-amber-300/80',
    navActive: 'bg-gradient-to-r from-[#8B5E3C] to-[#5C3D26] text-white shadow-amber-200/30',
    worldMetaphor: {
      worldName: 'Cozy Cottage Library',
      progressNoun: 'Books Added',
      statusIcon: '📖',
      actionVerb: 'Study & Grow',
      milestoneLabel: 'Cozy Hearth'
    },
    readingCompanion: {
      title: 'Cozy Reading Nook',
      description: 'A warm study desk with a soft glow, inspiring books, and calming study music.',
      stageIcons: ['📖', '🕯️', '☕', '📜', '🏆'],
      travelerName: 'Oliver the Wise Owl 🦉'
    }
  },

  // 2. MODERN WARM (Clean, mature, minimal, charcoal, soft blue, warm wood)
  modern_warm: {
    id: 'modern_warm',
    name: 'Modern Warm',
    category: 'starter',
    icon: '✨',
    badge: '🏛️ Clean & Focused',
    tagline: 'Clean. Mature. Minimal. Comfortable.',
    subtitle: 'Cream, beige, charcoal, soft slate blue, and warm natural timber',
    description:
      'An uncluttered, distraction-free learning environment designed for focus, readability, and refined visual clarity.',
    colors: {
      background: '#F8F6F2',
      surface: '#FFFFFF',
      surfaceSecondary: '#F1EFEA',
      primary: '#334155',
      secondary: '#64748B',
      accent: '#B45309',
      text: '#0F172A',
      textSecondary: '#475569',
      border: '#E2E8F0',
      borderHover: '#CBD5E1',
      ring: '#334155',
      badgeBg: '#F1F5F9',
      badgeText: '#1E293B',
      gradientBg: 'from-[#F8F6F2] via-[#FDFBF7] to-[#F0ECE1]',
      heroGradient: 'from-[#0F172A] via-[#1E293B] to-[#334155]',
      buttonGradient:
        'from-slate-800 via-slate-900 to-stone-900 hover:from-slate-900 hover:to-black text-white shadow-slate-300'
    },
    typography: {
      headingFont: "font-['Fredoka']",
      bodyFont: "font-['Quicksand']",
      displayStyle: 'tracking-tight'
    },
    ui: {
      buttonStyle:
        'rounded-xl border border-slate-200/80 shadow-xs hover:shadow transition-all active:scale-98 font-bold',
      cardStyle: 'rounded-2xl border border-slate-200 bg-white shadow-xs',
      navigationStyle: 'rounded-xl bg-slate-100 text-slate-900',
      progressStyle: 'modern_minimal',
      borderRadius: 'rounded-2xl',
      shadowStyle: 'shadow-sm'
    },
    motion: {
      transitionStyle: 'transition-all duration-200 ease-in-out',
      hoverEffect: 'hover:border-slate-300 hover:shadow-xs',
      completionEffect: 'clean_pulse',
      ambientAnimation: 'none'
    },
    learningExperience: {
      todayPathTitle: "Today's Learning Path",
      todayPathSubtitle: 'Clear educational milestones designed for steady mastery.',
      navLabels: {
        learn: 'Learn',
        read: 'Read',
        practice: 'Practice',
        test: 'Test',
        home: 'Workspace'
      },
      progressPresentation: {
        metaphor: 'Mastery Progression',
        stageNames: ['Foundation', 'Competency', 'Proficiency', 'Advanced', 'Mastery'],
        unitLabel: 'Modules Completed',
        visualIcon: '📊'
      },
      practicePresentation: {
        modeTitle: 'Practice Center',
        flashcardStyle: 'minimal',
        flashcardFrontBadge: 'Vocabulary Index',
        spellingPrompt: 'Enter the exact spelling for this term.'
      },
      readingPresentation: {
        spaceTitle: 'Focused Reading Desk',
        tagline: 'Minimalist study area built for uninterrupted 15-minute immersion.',
        companionName: 'Focus Companion ⏱️',
        stageIcons: ['⏱️', '📘', '📑', '🖋️', '⭐']
      },
      testPresentation: {
        testTitle: 'Weekly Assessment',
        resultsTitle: 'Performance Summary',
        focusTitle: 'Target Review Areas'
      },
      rewardPresentation: {
        celebrationPhrase: 'Milestone successfully achieved.',
        rewardNoun: 'Study Upgrade',
        rewardIcon: '⭐'
      },
      feedbackPhrases: {
        correct: 'Accurate and verified.',
        encourage: 'Refine your technique and try once more.'
      }
    },
    home: {
      roomStyle: 'Modern Studio',
      wallColor: 'bg-stone-50',
      floorColor: 'bg-stone-300',
      windowView: 'city',
      lighting: 'daylight',
      ambientDecor: ['Minimalist task lamp', 'Monstera leaf plant', 'Architectural shelf'],
      plantStyle: 'Ceramic matte cylinder pot',
      petAccessory: 'Sleek leather collar'
    },
    ambientSound: 'none',
    bgGradient: 'from-[#FAF8F5] via-[#FFFDFB] to-[#F5F1E8]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-amber-200/70',
    accentText: 'text-amber-800',
    primaryText: 'text-stone-900',
    buttonGradient:
      'from-amber-600 via-amber-700 to-stone-800 hover:from-amber-700 hover:to-stone-900 text-white shadow-amber-200/50',
    heroGradient: 'from-stone-900 via-amber-950 to-indigo-950',
    badgeBg: 'bg-amber-100/90 text-amber-900 border-amber-300/80',
    navActive: 'bg-gradient-to-r from-amber-700 to-stone-800 text-white shadow-amber-200/30',
    worldMetaphor: {
      worldName: 'Word Explorer Studio',
      progressNoun: 'Chapters Mastered',
      statusIcon: '📜',
      actionVerb: 'Expand Knowledge',
      milestoneLabel: 'Scholar Studio'
    },
    readingCompanion: {
      title: 'Cozy Reading Nook',
      description: 'A warm study desk with a soft glow, inspiring books, and calming study music.',
      stageIcons: ['📖', '🕯️', '☕', '📜', '🏆'],
      travelerName: 'Oliver the Wise Owl 🦉'
    }
  },

  // 3. NATURE (Forest green, sage, organic plant growth, fresh)
  nature: {
    id: 'nature',
    name: 'Nature',
    category: 'nature',
    icon: '🌿',
    badge: '🌲 Living Sanctuary',
    tagline: 'Fresh. Natural. Explorative. Peaceful.',
    subtitle: 'Forest green, sage, sky blue, earth tones, and living botanicals',
    description:
      'Watch your knowledge sprout like deep forest roots, flourishing with woodland birds, tall sequoias, and fresh outdoor air.',
    colors: {
      background: '#F1F7F3',
      surface: '#FFFFFF',
      surfaceSecondary: '#E5EFE8',
      primary: '#2D5A27',
      secondary: '#4A7C59',
      accent: '#8EB69B',
      text: '#19341B',
      textSecondary: '#415B44',
      border: '#D0E3D5',
      borderHover: '#B8D4C0',
      ring: '#2D5A27',
      badgeBg: '#E3EFE5',
      badgeText: '#204323',
      gradientBg: 'from-[#F1F7F3] via-[#F8FAF8] to-[#E6F2EA]',
      heroGradient: 'from-[#19341B] via-[#2D5A27] to-[#4A7C59]',
      buttonGradient:
        'from-[#2D5A27] via-[#386D32] to-[#1E3F1B] hover:from-[#386D32] hover:to-[#19341B] text-white shadow-emerald-200'
    },
    typography: {
      headingFont: "font-['Fredoka']",
      bodyFont: "font-['Quicksand']",
      displayStyle: 'tracking-normal'
    },
    ui: {
      buttonStyle:
        'rounded-full border border-emerald-700/20 shadow-xs hover:shadow-md transition-all active:scale-98 font-bold',
      cardStyle: 'rounded-3xl border-2 border-emerald-200/80 bg-white/95 shadow-sm',
      navigationStyle: 'rounded-full bg-emerald-100/70 text-emerald-900',
      progressStyle: 'plant_growth',
      borderRadius: 'rounded-3xl',
      shadowStyle: 'shadow-md shadow-emerald-900/5'
    },
    motion: {
      transitionStyle: 'transition-all duration-300 ease-out',
      hoverEffect: 'hover:scale-102 hover:shadow-emerald-100',
      completionEffect: 'plant_sprout',
      ambientAnimation: 'leaf_sway'
    },
    learningExperience: {
      todayPathTitle: "Today's Growth Path",
      todayPathSubtitle: 'Nurture your daily words like seeds turning into a thriving canopy.',
      navLabels: {
        learn: 'Learn',
        read: 'Read',
        practice: 'Practice',
        test: 'Check',
        home: 'Sanctuary'
      },
      progressPresentation: {
        metaphor: 'Botanical Growth',
        stageNames: ['Seed', 'Sprout', 'Growing', 'Healthy Plant', 'Full Canopy'],
        unitLabel: 'Plants Bloomed',
        visualIcon: '🌱'
      },
      practicePresentation: {
        modeTitle: 'Growth Practice',
        flashcardStyle: 'field_guide',
        flashcardFrontBadge: 'Field Guide',
        spellingPrompt: 'Nurture this word with accurate spelling:'
      },
      readingPresentation: {
        spaceTitle: 'Garden Reading Pavilion',
        tagline: 'Immerse yourself under rustling leaves with birdsong for 15 peaceful minutes.',
        companionName: 'Rowan the Woodland Scout 🦊',
        stageIcons: ['🌰', '🌱', '🌿', '🌲', '🦅']
      },
      testPresentation: {
        testTitle: 'Growth Assessment',
        resultsTitle: 'Canopy Health Report',
        focusTitle: 'Seeds Needing Water'
      },
      rewardPresentation: {
        celebrationPhrase: 'Your knowledge is blooming beautifully!',
        rewardNoun: 'Woodland Sprout',
        rewardIcon: '🌿'
      },
      feedbackPhrases: {
        correct: 'Sprouting with strength and vitality!',
        encourage: 'Every great oak started as an acorn. Try again!'
      }
    },
    home: {
      roomStyle: 'Forest Cabin',
      wallColor: 'bg-emerald-50/70',
      floorColor: 'bg-[#588157]',
      windowView: 'forest',
      lighting: 'daylight',
      ambientDecor: ['Botanical terrarium', 'Fern collection', 'Cedar window box'],
      plantStyle: 'Hand-thrown clay terracotta with wild ferns',
      petAccessory: 'Woven clover collar'
    },
    ambientSound: 'forest',
    bgGradient: 'from-[#F2F8F4] via-[#F8FAF8] to-[#EAF4ED]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-emerald-200/80',
    accentText: 'text-emerald-600',
    primaryText: 'text-emerald-950',
    buttonGradient:
      'from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-700 hover:to-teal-600 text-white shadow-emerald-200',
    heroGradient: 'from-emerald-600 via-teal-500 to-amber-600',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    navActive: 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-emerald-200',
    worldMetaphor: {
      worldName: 'Emerald Trail',
      progressNoun: 'Trail Markers Reached',
      statusIcon: '🌲',
      actionVerb: 'Nurture Forest',
      milestoneLabel: 'Wilderness Outpost'
    },
    readingCompanion: {
      title: 'Forest Canopy Trail',
      description: 'A sturdy sequoia tree sprouts vibrant leaves and woodland birds visit as you read.',
      stageIcons: ['🌰', '🌱', '🌿', '🌲', '🦅'],
      travelerName: 'Rowan the Woodland Scout 🦊'
    }
  },

  // 4. OCEAN (Teal, ocean blue, seafoam, ripples, calm waves)
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    category: 'nature',
    icon: '🌊',
    badge: '🐬 Marine Reef',
    tagline: 'Calm. Fresh. Adventurous. Open.',
    subtitle: 'Teal, ocean azure, seafoam green, sandy beach dunes, and calm tides',
    description:
      'Glide through crystal waters alongside sea turtles and playful dolphins, expanding your vocabulary like the vast sea.',
    colors: {
      background: '#EDF8FB',
      surface: '#FFFFFF',
      surfaceSecondary: '#E0F2F7',
      primary: '#0D6B82',
      secondary: '#1A94A8',
      accent: '#2AC4B5',
      text: '#093642',
      textSecondary: '#215967',
      border: '#C1E6EE',
      borderHover: '#A4D8E3',
      ring: '#0D6B82',
      badgeBg: '#DCF4F8',
      badgeText: '#0A4858',
      gradientBg: 'from-[#EDF8FB] via-[#F5FCFD] to-[#E3F4F7]',
      heroGradient: 'from-[#093642] via-[#0D6B82] to-[#1A94A8]',
      buttonGradient:
        'from-[#0D6B82] via-[#12839E] to-[#0A5365] hover:from-[#12839E] hover:to-[#073D4A] text-white shadow-cyan-200'
    },
    typography: {
      headingFont: "font-['Fredoka']",
      bodyFont: "font-['Quicksand']",
      displayStyle: 'tracking-normal'
    },
    ui: {
      buttonStyle:
        'rounded-2xl border border-cyan-800/20 shadow-xs hover:shadow-md transition-all active:scale-98 font-bold',
      cardStyle: 'rounded-3xl border-2 border-cyan-200/80 bg-white/95 shadow-sm',
      navigationStyle: 'rounded-2xl bg-cyan-100/70 text-cyan-950',
      progressStyle: 'water_journey',
      borderRadius: 'rounded-3xl',
      shadowStyle: 'shadow-md shadow-cyan-950/5'
    },
    motion: {
      transitionStyle: 'transition-all duration-300 ease-out',
      hoverEffect: 'hover:scale-102 hover:shadow-cyan-100',
      completionEffect: 'gentle_ripple',
      ambientAnimation: 'wave_float'
    },
    learningExperience: {
      todayPathTitle: "Today's Voyage",
      todayPathSubtitle: 'Navigate the currents of knowledge from shallow streams to deep seas.',
      navLabels: {
        learn: 'Learn',
        read: 'Read',
        practice: 'Practice',
        test: 'Check',
        home: 'Cove'
      },
      progressPresentation: {
        metaphor: 'Water Current',
        stageNames: ['Droplet', 'Stream', 'River', 'Reef Grotto', 'Open Ocean'],
        unitLabel: 'Fathoms Mastered',
        visualIcon: '🫧'
      },
      practicePresentation: {
        modeTitle: 'Tidal Practice',
        flashcardStyle: 'minimal',
        flashcardFrontBadge: 'Marine Log',
        spellingPrompt: 'Chart this word with correct spelling:'
      },
      readingPresentation: {
        spaceTitle: 'Coastal Reading Cove',
        tagline: 'Enjoy the gentle cadence of ocean waves while reading for 15 calm minutes.',
        companionName: 'Captain Coral the Diver 🤿',
        stageIcons: ['🫧', '🐠', '🪸', '🐢', '🐬']
      },
      testPresentation: {
        testTitle: 'Deep Sea Check',
        resultsTitle: 'Voyage Navigation Log',
        focusTitle: 'Currents to Practice'
      },
      rewardPresentation: {
        celebrationPhrase: 'Splendid mastery across the ocean waves!',
        rewardNoun: 'Pearl of Knowledge',
        rewardIcon: '🪸'
      },
      feedbackPhrases: {
        correct: 'Smooth sailing! You hit the exact coordinates.',
        encourage: 'Catch the next wave. You have got this!'
      }
    },
    home: {
      roomStyle: 'Beachside Bungalow',
      wallColor: 'bg-cyan-50/70',
      floorColor: 'bg-[#D4A373]',
      windowView: 'ocean',
      lighting: 'daylight',
      ambientDecor: ['Sea glass bottle', 'Coral specimen', 'Driftwood shelf'],
      plantStyle: 'Bioluminescent sea fan in glass bowl',
      petAccessory: 'Seashell pendant'
    },
    ambientSound: 'waves',
    bgGradient: 'from-[#F0F9FF] via-[#F4FBFF] to-[#E6F4FE]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-sky-200/80',
    accentText: 'text-sky-600',
    primaryText: 'text-sky-950',
    buttonGradient:
      'from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-sky-200',
    heroGradient: 'from-cyan-500 via-sky-500 to-blue-600',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
    navActive: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sky-200',
    worldMetaphor: {
      worldName: 'Azure Coral Deep',
      progressNoun: 'Fathoms Explored',
      statusIcon: '🐠',
      actionVerb: 'Submerge Explorer',
      milestoneLabel: 'Reef Grotto'
    },
    readingCompanion: {
      title: 'Coral Reef Glider',
      description: 'A gentle green sea turtle glides gracefully alongside sea fans and bioluminescent pearls.',
      stageIcons: ['🫧', '🐠', '🪸', '🐢', '🐬'],
      travelerName: 'Captain Coral 🤿'
    }
  },

  // 5. SPACE EXPLORER (Navy, deep blue, purple, cyan, mission progress, observation deck)
  space_explorer: {
    id: 'space_explorer',
    name: 'Space Explorer',
    category: 'sci_fi',
    icon: '🚀',
    badge: '🌌 Cosmic Sector',
    tagline: 'Curious. Adventurous. Scientific. Futuristic.',
    subtitle: 'Navy, deep cosmos, nebula purple, silver chrome, and starlight white',
    description:
      'Chart unknown star systems, pilot your discovery shuttle across glowing nebulas, and master vocabulary with precision.',
    colors: {
      background: '#0B0F19',
      surface: '#151D2F',
      surfaceSecondary: '#1C2740',
      primary: '#0EA5E9',
      secondary: '#6366F1',
      accent: '#38BDF8',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
      border: '#2A3B5C',
      borderHover: '#38BDF8',
      ring: '#38BDF8',
      badgeBg: '#1C2C4E',
      badgeText: '#38BDF8',
      gradientBg: 'from-[#0B0F19] via-[#111827] to-[#0A0E17]',
      heroGradient: 'from-[#0B0F19] via-[#1E1B4B] to-[#0F172A]',
      buttonGradient:
        'from-[#0284C7] via-[#2563EB] to-[#4F46E5] hover:from-[#0369A1] hover:to-[#4338CA] text-white shadow-cyan-500/20'
    },
    typography: {
      headingFont: "font-['Fredoka']",
      bodyFont: "font-['Quicksand']",
      displayStyle: 'tracking-wide'
    },
    ui: {
      buttonStyle:
        'rounded-full border border-cyan-400/30 shadow-md shadow-cyan-500/10 hover:shadow-cyan-400/20 transition-all active:scale-98 font-bold',
      cardStyle: 'rounded-3xl border-2 border-slate-700/80 bg-slate-900/90 text-slate-100 shadow-xl',
      navigationStyle: 'rounded-full bg-slate-800/90 text-cyan-200 border border-cyan-500/30',
      progressStyle: 'mission_tracker',
      borderRadius: 'rounded-3xl',
      shadowStyle: 'shadow-xl shadow-cyan-950/40'
    },
    motion: {
      transitionStyle: 'transition-all duration-300 ease-out',
      hoverEffect: 'hover:scale-102 hover:border-cyan-400',
      completionEffect: 'constellation_sparkle',
      ambientAnimation: 'star_drift'
    },
    learningExperience: {
      todayPathTitle: "Today's Mission",
      todayPathSubtitle: 'Coordinate telemetry and complete learning orbital checkpoints.',
      navLabels: {
        learn: 'Mission',
        read: 'Observatory',
        practice: 'Simulator',
        test: 'Flight Check',
        home: 'Shuttle Bay'
      },
      progressPresentation: {
        metaphor: 'Orbital Flight Plan',
        stageNames: ['Launch Prep', 'Atmospheric Ascent', 'Orbit Achieved', 'Deep Space Probe', 'Galaxy Jump'],
        unitLabel: 'Sectors Cleared',
        visualIcon: '🚀'
      },
      practicePresentation: {
        modeTitle: 'Mission Simulator',
        flashcardStyle: 'mission_hud',
        flashcardFrontBadge: 'Telemetry Log',
        spellingPrompt: 'Enter telemetry coordinates (type spelling):'
      },
      readingPresentation: {
        spaceTitle: 'Starlit Observation Deck',
        tagline: 'Quiet cosmic vista overlooking Earth for 15 focused reading minutes.',
        companionName: 'Commander Nova 🧑‍🚀',
        stageIcons: ['🚀', '✨', '🛰️', '🪐', '🌌']
      },
      testPresentation: {
        testTitle: 'Flight Check Protocol',
        resultsTitle: 'Mission Debrief Log',
        focusTitle: 'Sensors to Recalibrate'
      },
      rewardPresentation: {
        celebrationPhrase: 'Mission Objective Successfully Completed!',
        rewardNoun: 'Cosmic Core Artifact',
        rewardIcon: '🪐'
      },
      feedbackPhrases: {
        correct: 'Confirmed! Signal locked on target coordinates.',
        encourage: 'Recalibrating sensor array. Re-attempt the sequence!'
      }
    },
    home: {
      roomStyle: 'Orbital Star Quarters',
      wallColor: 'bg-slate-900',
      floorColor: 'bg-slate-800',
      windowView: 'stars',
      lighting: 'cool_futuristic',
      ambientDecor: ['Orbital holographic globe', 'Telescope mount', 'Cosmic star map'],
      plantStyle: 'Aeroponic glowing hydroponic pod',
      petAccessory: 'Astronaut mini visor'
    },
    ambientSound: 'space',
    bgGradient: 'from-[#0F172A] via-[#1E1B4B] to-[#0F172A]',
    cardBg: 'bg-slate-900/90 text-slate-100',
    cardBorder: 'border-indigo-500/40',
    accentText: 'text-cyan-400',
    primaryText: 'text-cyan-100',
    buttonGradient:
      'from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white shadow-indigo-500/30',
    heroGradient: 'from-indigo-900 via-purple-900 to-slate-900',
    badgeBg: 'bg-indigo-950/80 text-cyan-300 border-indigo-500/50',
    navActive: 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-cyan-500/20',
    worldMetaphor: {
      worldName: 'Cosmic Star Station',
      progressNoun: 'Lightyears Traveled',
      statusIcon: '🪐',
      actionVerb: 'Charge Thrusters',
      milestoneLabel: 'Orbit Sector'
    },
    readingCompanion: {
      title: 'Interstellar Cruise',
      description: 'Your star voyager glides through asteroid belts toward shimmering galaxy rings.',
      stageIcons: ['🚀', '✨', '🛰️', '🪐', '🌌'],
      travelerName: 'Commander Nova 🧑‍🚀'
    }
  },

  // 6. CREATIVE STUDIO (Artistic, expressive, canvas card, blank canvas to finished artwork)
  creative_studio: {
    id: 'creative_studio',
    name: 'Creative Studio',
    category: 'creative',
    icon: '🎨',
    badge: '🖌️ Atelier Studio',
    tagline: 'Artistic. Expressive. Creative. Colorful.',
    subtitle: 'Rich paint palettes, warm linen canvas, terracotta, and studio sketchbooks',
    description:
      'Unleash your imagination where words become expressive brushstrokes, bringing canvases and stories to vibrant life.',
    colors: {
      background: '#FAF7F2',
      surface: '#FFFFFF',
      surfaceSecondary: '#F5EFE6',
      primary: '#9333EA',
      secondary: '#EC4899',
      accent: '#F59E0B',
      text: '#261938',
      textSecondary: '#6B577A',
      border: '#E8DED1',
      borderHover: '#D4C2AB',
      ring: '#9333EA',
      badgeBg: '#F3E8FF',
      badgeText: '#6B21A8',
      gradientBg: 'from-[#FAF7F2] via-[#FFFDF9] to-[#F5EFE6]',
      heroGradient: 'from-[#3B0764] via-[#701A75] to-[#831843]',
      buttonGradient:
        'from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white shadow-purple-200'
    },
    typography: {
      headingFont: "font-['Fredoka']",
      bodyFont: "font-['Quicksand']",
      displayStyle: 'tracking-normal'
    },
    ui: {
      buttonStyle:
        'rounded-2xl border border-purple-300 shadow-xs hover:shadow-md transition-all active:scale-98 font-bold',
      cardStyle: 'rounded-3xl border-2 border-purple-200/80 bg-white/95 shadow-sm',
      navigationStyle: 'rounded-2xl bg-purple-100/70 text-purple-900',
      progressStyle: 'art_canvas',
      borderRadius: 'rounded-3xl',
      shadowStyle: 'shadow-md shadow-purple-950/5'
    },
    motion: {
      transitionStyle: 'transition-all duration-300 ease-out',
      hoverEffect: 'hover:scale-102 hover:shadow-purple-100',
      completionEffect: 'brushstroke_flourish',
      ambientAnimation: 'subtle_float'
    },
    learningExperience: {
      todayPathTitle: "Today's Creative Project",
      todayPathSubtitle: 'Layer by layer, turn your vocabulary into a colorful masterpiece.',
      navLabels: {
        learn: 'Studio',
        read: 'Reading Corner',
        practice: 'Workshop',
        test: 'Critique',
        home: 'Art Loft'
      },
      progressPresentation: {
        metaphor: 'Canvas in Progress',
        stageNames: ['Blank Canvas', 'Pencil Sketch', 'Base Color', 'Detailing', 'Framed Masterpiece'],
        unitLabel: 'Artworks Finished',
        visualIcon: '🎨'
      },
      practicePresentation: {
        modeTitle: 'Studio Workshop',
        flashcardStyle: 'canvas',
        flashcardFrontBadge: 'Palette Study',
        spellingPrompt: 'Sketch out the spelling for this term:'
      },
      readingPresentation: {
        spaceTitle: 'Art Studio Reading Loft',
        tagline: 'Cozy corner surrounded by easels, sketchbooks, and paints for 15 creative minutes.',
        companionName: 'Maya the Illustrator 🎨',
        stageIcons: ['✏️', '🎨', '🖌️', '🖼️', '🌟']
      },
      testPresentation: {
        testTitle: 'Exhibition Review',
        resultsTitle: 'Gallery Assessment',
        focusTitle: 'Techniques to Practice'
      },
      rewardPresentation: {
        celebrationPhrase: 'Brilliant artwork! Your expression is shining.',
        rewardNoun: 'Artist Supply Item',
        rewardIcon: '🖌️'
      },
      feedbackPhrases: {
        correct: 'Beautiful stroke! Exact and expressive.',
        encourage: 'Every great artist sketches multiple drafts. Try again!'
      }
    },
    home: {
      roomStyle: 'Artist Loft',
      wallColor: 'bg-stone-100',
      floorColor: 'bg-[#C9A66B]',
      windowView: 'studio',
      lighting: 'daylight',
      ambientDecor: ['Studio easel with canvas', 'Mason jar with paintbrushes', 'Color wheel poster'],
      plantStyle: 'Ceramic paint-splattered planter with ivy',
      petAccessory: 'Colorful painter beret'
    },
    ambientSound: 'room',
    bgGradient: 'from-[#FAF6FF] via-[#FDF9FF] to-[#F5EEFD]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-purple-200/80',
    accentText: 'text-purple-600',
    primaryText: 'text-purple-950',
    buttonGradient:
      'from-purple-600 via-violet-500 to-amber-500 hover:from-purple-700 hover:to-violet-600 text-white shadow-purple-200',
    heroGradient: 'from-purple-600 via-violet-500 to-amber-500',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    navActive: 'bg-gradient-to-r from-purple-600 to-violet-500 text-white shadow-purple-200',
    worldMetaphor: {
      worldName: 'Crown Citadel Studio',
      progressNoun: 'Canvases Painted',
      statusIcon: '🎨',
      actionVerb: 'Paint Canvas',
      milestoneLabel: 'Artisan Chamber'
    },
    readingCompanion: {
      title: 'Studio Reading Corner',
      description: 'Golden lighting illuminates your sketchbook as you focus and read.',
      stageIcons: ['✏️', '🎨', '🖌️', '🖼️', '👑'],
      travelerName: 'Maya the Illustrator 🎨'
    }
  },

  // 7. GAMING (HUD-inspired, level/XP, Training, Challenge, modern fun)
  gaming: {
    id: 'gaming',
    name: 'Gaming',
    category: 'active',
    icon: '🎮',
    badge: '🕹️ Level Up HUD',
    tagline: 'Energetic. Interactive. Modern. Fun.',
    subtitle: 'Slate dark mode, neon violet, electric fuchsia, cyan HUD accents, and XP boosts',
    description:
      'Level up your vocabulary stats, complete training drills, unlock achievement trophies, and master boss quests.',
    colors: {
      background: '#0D1117',
      surface: '#161B22',
      surfaceSecondary: '#21262D',
      primary: '#8B5CF6',
      secondary: '#D946EF',
      accent: '#06B6D4',
      text: '#F0F6FC',
      textSecondary: '#8B949E',
      border: '#30363D',
      borderHover: '#8B5CF6',
      ring: '#8B5CF6',
      badgeBg: '#2E1065',
      badgeText: '#C4B5FD',
      gradientBg: 'from-[#0D1117] via-[#161B22] to-[#0D1117]',
      heroGradient: 'from-[#1E1B4B] via-[#4C1D95] to-[#0F172A]',
      buttonGradient:
        'from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-violet-500/30'
    },
    typography: {
      headingFont: "font-['Fredoka']",
      bodyFont: "font-['Quicksand']",
      displayStyle: 'tracking-wider'
    },
    ui: {
      buttonStyle:
        'rounded-xl border border-violet-500/40 shadow-md shadow-violet-500/20 hover:shadow-violet-400/30 transition-all active:scale-95 font-extrabold',
      cardStyle: 'rounded-2xl border border-slate-700 bg-slate-900/95 text-slate-100 shadow-xl',
      navigationStyle: 'rounded-xl bg-slate-800 text-violet-300 border border-violet-500/40',
      progressStyle: 'hud_level',
      borderRadius: 'rounded-2xl',
      shadowStyle: 'shadow-lg shadow-violet-950/50'
    },
    motion: {
      transitionStyle: 'transition-all duration-200 ease-out',
      hoverEffect: 'hover:scale-102 hover:border-violet-400',
      completionEffect: 'level_up_pulse',
      ambientAnimation: 'pulse_glow'
    },
    learningExperience: {
      todayPathTitle: "Today's Quest",
      todayPathSubtitle: 'Power up your word skills and claim daily quest rewards.',
      navLabels: {
        learn: 'Learn',
        read: 'Reading Quest',
        practice: 'Training',
        test: 'Challenge',
        home: 'My World'
      },
      progressPresentation: {
        metaphor: 'XP Level Progression',
        stageNames: ['Novice 1', 'Apprentice 2', 'Champion 3', 'Master 4', 'Legend 5'],
        unitLabel: 'XP Cores Charged',
        visualIcon: '⚡'
      },
      practicePresentation: {
        modeTitle: 'Training Drills',
        flashcardStyle: 'game_card',
        flashcardFrontBadge: 'Word Card',
        spellingPrompt: 'Type input to execute command:'
      },
      readingPresentation: {
        spaceTitle: 'Reading Quest Chamber',
        tagline: 'Charge power crystals by locking in for 15 uninterrupted reading minutes.',
        companionName: 'Pixel Bot 🤖',
        stageIcons: ['🔋', '⚡', '💎', '🛡️', '👑']
      },
      testPresentation: {
        testTitle: 'Weekly Boss Challenge',
        resultsTitle: 'Quest Clear Stats',
        focusTitle: 'Skills to Power Up'
      },
      rewardPresentation: {
        celebrationPhrase: 'LEVEL UP! Achievement Unlocked!',
        rewardNoun: 'Quest Trophy Item',
        rewardIcon: '⚡'
      },
      feedbackPhrases: {
        correct: 'COMBO HIT! +10 XP earned!',
        encourage: 'Respawn and retry. You know this word!'
      }
    },
    home: {
      roomStyle: 'Gaming Den',
      wallColor: 'bg-slate-900',
      floorColor: 'bg-slate-950',
      windowView: 'arcade',
      lighting: 'neon',
      ambientDecor: ['Ultrawide monitor desk', 'RGB gaming chair', 'Retro pixel arcade cabinet'],
      plantStyle: 'Geometric low-poly planter with neon moss',
      petAccessory: 'Pixelated party glasses'
    },
    ambientSound: 'arcade',
    bgGradient: 'from-[#0F172A] via-[#1E293B] to-[#0F172A]',
    cardBg: 'bg-slate-900/90 text-slate-100',
    cardBorder: 'border-violet-500/40',
    accentText: 'text-violet-400',
    primaryText: 'text-violet-100',
    buttonGradient:
      'from-violet-600 via-fuchsia-600 to-pink-500 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-violet-500/30',
    heroGradient: 'from-violet-900 via-purple-900 to-slate-900',
    badgeBg: 'bg-violet-950/80 text-violet-300 border-violet-500/50',
    navActive: 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-fuchsia-500/20',
    worldMetaphor: {
      worldName: 'Pixel Power HQ',
      progressNoun: 'XP Cores Charged',
      statusIcon: '⚡',
      actionVerb: 'Overcharge Core',
      milestoneLabel: 'Quest Zone'
    },
    readingCompanion: {
      title: 'Power Core Charging',
      description: 'An energy crystal charges up with luminous particles as you focus and complete reading minutes.',
      stageIcons: ['🔋', '⚡', '💎', '🛡️', '👑'],
      travelerName: 'Pixel Bot 🤖'
    }
  },

  // 8. SPORTS (Scoreboard progress, clean cards, team/training language)
  sports: {
    id: 'sports',
    name: 'Sports',
    category: 'active',
    icon: '⚽',
    badge: '🏆 Athletic League',
    tagline: 'Active. Competitive. Motivating. Energetic.',
    subtitle: 'Navy, athletic emerald, gold championship trim, and arena scoreboard styling',
    description:
      'Run the vocabulary drills, track your reading stamina, score spelling accuracy points, and bring home the championship cup.',
    colors: {
      background: '#F4F7FB',
      surface: '#FFFFFF',
      surfaceSecondary: '#E9EEF5',
      primary: '#1D4ED8',
      secondary: '#059669',
      accent: '#EAB308',
      text: '#0F172A',
      textSecondary: '#475569',
      border: '#CBD5E1',
      borderHover: '#94A3B8',
      ring: '#1D4ED8',
      badgeBg: '#DBEAFE',
      badgeText: '#1E40AF',
      gradientBg: 'from-[#F4F7FB] via-[#F8FAFC] to-[#EEF2F6]',
      heroGradient: 'from-[#1E3A8A] via-[#1D4ED8] to-[#047857]',
      buttonGradient:
        'from-blue-600 via-blue-700 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-blue-200'
    },
    typography: {
      headingFont: "font-['Fredoka']",
      bodyFont: "font-['Quicksand']",
      displayStyle: 'tracking-wide'
    },
    ui: {
      buttonStyle:
        'rounded-2xl border border-blue-600/30 shadow-xs hover:shadow-md transition-all active:scale-98 font-extrabold',
      cardStyle: 'rounded-3xl border-2 border-blue-200 bg-white shadow-sm',
      navigationStyle: 'rounded-2xl bg-blue-100 text-blue-950',
      progressStyle: 'scoreboard',
      borderRadius: 'rounded-3xl',
      shadowStyle: 'shadow-md shadow-blue-900/10'
    },
    motion: {
      transitionStyle: 'transition-all duration-200 ease-out',
      hoverEffect: 'hover:translate-y-[-2px] hover:shadow-md',
      completionEffect: 'whistle_cheer',
      ambientAnimation: 'none'
    },
    learningExperience: {
      todayPathTitle: "Today's Training Plan",
      todayPathSubtitle: 'Build vocabulary strength and spelling stamina drill by drill.',
      navLabels: {
        learn: 'Learn',
        read: 'Reading Stamina',
        practice: 'Drills',
        test: 'Match Day',
        home: 'Clubhouse'
      },
      progressPresentation: {
        metaphor: 'Arena Scoreboard',
        stageNames: ['Warmup', 'Practice Round', 'Varsity Drill', 'Playoff Match', 'Championship'],
        unitLabel: 'Goals Scored',
        visualIcon: '⚽'
      },
      practicePresentation: {
        modeTitle: 'Skill Drills',
        flashcardStyle: 'minimal',
        flashcardFrontBadge: 'Playbook',
        spellingPrompt: 'Spell accurately to score the goal:'
      },
      readingPresentation: {
        spaceTitle: 'Athlete Clubhouse Library',
        tagline: 'Build mental endurance with 15 minutes of uninterrupted reading training.',
        companionName: 'Coach Leo 🦁',
        stageIcons: ['👟', '⚽', '🏀', '🏅', '🏆']
      },
      testPresentation: {
        testTitle: 'Match Day Challenge',
        resultsTitle: 'Box Score & Accuracy',
        focusTitle: 'Drills for Practice'
      },
      rewardPresentation: {
        celebrationPhrase: 'Great play! You scored big points today!',
        rewardNoun: 'Championship Trophy',
        rewardIcon: '🏆'
      },
      feedbackPhrases: {
        correct: 'GOAL! Textbook form and great accuracy.',
        encourage: 'Reset for the next play. Keep your head in the game!'
      }
    },
    home: {
      roomStyle: 'Varsity Locker Clubhouse',
      wallColor: 'bg-blue-50/60',
      floorColor: 'bg-[#B08968]',
      windowView: 'stadium',
      lighting: 'daylight',
      ambientDecor: ['Trophy showcase shelf', 'Locker unit', 'Team banners & sports gear'],
      plantStyle: 'Heavy stoneware athletic club planter',
      petAccessory: 'Team jersey bandana'
    },
    ambientSound: 'none',
    bgGradient: 'from-[#F0F7FF] via-[#F8FAFC] to-[#E9F3FF]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-blue-200/80',
    accentText: 'text-blue-700',
    primaryText: 'text-blue-950',
    buttonGradient:
      'from-blue-600 via-blue-700 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-blue-200',
    heroGradient: 'from-blue-700 via-indigo-800 to-emerald-700',
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-200',
    navActive: 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-blue-200',
    worldMetaphor: {
      worldName: 'Varsity Arena Clubhouse',
      progressNoun: 'Points on the Board',
      statusIcon: '⚽',
      actionVerb: 'Execute Play',
      milestoneLabel: 'Championship Round'
    },
    readingCompanion: {
      title: 'Clubhouse Reading Room',
      description: 'Relax after practice and power up your stamina with 15 focused minutes.',
      stageIcons: ['👟', '⚽', '🏀', '🏅', '🏆'],
      travelerName: 'Coach Leo 🦁'
    }
  },

  // 9. SCIENCE & DISCOVERY (Lab notebook, experiments, diagrams, charts)
  science_discovery: {
    id: 'science_discovery',
    name: 'Science & Discovery',
    category: 'academic',
    icon: '🔬',
    badge: '🧪 Discovery Lab',
    tagline: 'Curious. Smart. Experimental. Explorative.',
    subtitle: 'Clean lab white, clinical teal, atomic blue, and field notebook grid lines',
    description:
      'Investigate word etymologies, conduct vocabulary experiments, record field notes, and unlock scientific breakthroughs.',
    colors: {
      background: '#F4F9F9',
      surface: '#FFFFFF',
      surfaceSecondary: '#E9F3F4',
      primary: '#0891B2',
      secondary: '#0D9488',
      accent: '#6366F1',
      text: '#164E63',
      textSecondary: '#334155',
      border: '#CFE6E8',
      borderHover: '#A5D4D8',
      ring: '#0891B2',
      badgeBg: '#E0F2FE',
      badgeText: '#0369A1',
      gradientBg: 'from-[#F4F9F9] via-[#FAFCFC] to-[#EDF6F7]',
      heroGradient: 'from-[#083344] via-[#0E7490] to-[#0D9488]',
      buttonGradient:
        'from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-cyan-200'
    },
    typography: {
      headingFont: "font-['Fredoka']",
      bodyFont: "font-['Quicksand']",
      displayStyle: 'tracking-normal'
    },
    ui: {
      buttonStyle:
        'rounded-xl border border-cyan-500/30 shadow-xs hover:shadow-md transition-all active:scale-98 font-bold',
      cardStyle: 'rounded-2xl border-2 border-cyan-200/80 bg-white shadow-xs',
      navigationStyle: 'rounded-xl bg-cyan-100 text-cyan-950',
      progressStyle: 'lab_chart',
      borderRadius: 'rounded-2xl',
      shadowStyle: 'shadow-sm shadow-cyan-900/5'
    },
    motion: {
      transitionStyle: 'transition-all duration-200 ease-in-out',
      hoverEffect: 'hover:border-cyan-400 hover:shadow-xs',
      completionEffect: 'lab_beaker_bubble',
      ambientAnimation: 'none'
    },
    learningExperience: {
      todayPathTitle: "Today's Research Experiment",
      todayPathSubtitle: 'Investigate vocabulary hypotheses through rigorous practice.',
      navLabels: {
        learn: 'Research',
        read: 'Discovery Desk',
        practice: 'Lab Trials',
        test: 'Examination',
        home: 'Laboratory'
      },
      progressPresentation: {
        metaphor: 'Experiment Progress',
        stageNames: ['Hypothesis', 'Trial Run', 'Data Collected', 'Analysis Verified', 'Breakthrough'],
        unitLabel: 'Trials Confirmed',
        visualIcon: '🔬'
      },
      practicePresentation: {
        modeTitle: 'Lab Trials',
        flashcardStyle: 'field_guide',
        flashcardFrontBadge: 'Specimen Tag',
        spellingPrompt: 'Synthesize correct spelling formula:'
      },
      readingPresentation: {
        spaceTitle: 'Research Discovery Desk',
        tagline: 'Quiet specimen study desk with globes and journals for 15 inquisitive minutes.',
        companionName: 'Dr. Newton the Owl 🦉',
        stageIcons: ['🔬', '🧪', '🧬', '🔭', '🪐']
      },
      testPresentation: {
        testTitle: 'Scientific Examination',
        resultsTitle: 'Empirical Results Summary',
        focusTitle: 'Concepts Requiring Retrial'
      },
      rewardPresentation: {
        celebrationPhrase: 'Discovery breakthrough verified by empirical evidence!',
        rewardNoun: 'Science Artifact',
        rewardIcon: '🔬'
      },
      feedbackPhrases: {
        correct: 'Hypothesis confirmed! 100% accurate synthesis.',
        encourage: 'Science is trial and discovery. Re-test your formula!'
      }
    },
    home: {
      roomStyle: 'Discovery Laboratory',
      wallColor: 'bg-cyan-50/40',
      floorColor: 'bg-slate-300',
      windowView: 'lab',
      lighting: 'daylight',
      ambientDecor: ['Compound brass microscope', 'Astronomical globe', 'Fossil specimen case'],
      plantStyle: 'Botanical specimen jar with preserved clover',
      petAccessory: 'Protective lab goggles'
    },
    ambientSound: 'none',
    bgGradient: 'from-[#F0FDFA] via-[#F7FCFD] to-[#E6F7F5]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-teal-200/80',
    accentText: 'text-teal-700',
    primaryText: 'text-teal-950',
    buttonGradient:
      'from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-teal-200',
    heroGradient: 'from-cyan-800 via-teal-700 to-indigo-800',
    badgeBg: 'bg-teal-100 text-teal-900 border-teal-200',
    navActive: 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-teal-200',
    worldMetaphor: {
      worldName: 'Discovery Research Station',
      progressNoun: 'Breakthroughs Logged',
      statusIcon: '🔬',
      actionVerb: 'Conduct Experiment',
      milestoneLabel: 'Research Summit'
    },
    readingCompanion: {
      title: 'Discovery Study Desk',
      description: 'Observe fascinating specimen slides and record insights during 15 minutes of focus.',
      stageIcons: ['🔬', '🧪', '🧬', '🔭', '🪐'],
      travelerName: 'Dr. Newton the Owl 🦉'
    }
  },

  // 10. ADVENTURE (Map-inspired, compass, journey: Word Valley to Knowledge Peak)
  adventure: {
    id: 'adventure',
    name: 'Adventure',
    category: 'adventure',
    icon: '🧭',
    badge: '🏔️ Expedition Trail',
    tagline: 'Exploration. Discovery. Journey. Curiosity.',
    subtitle: 'Parchment tan, mountain pine, weathered leather, compass gold, and trail map routes',
    description:
      'Trek through unexplored canyons, ford word rivers, and scale the majestic Knowledge Peak on an epic expedition.',
    colors: {
      background: '#F8F4EC',
      surface: '#FFFFFF',
      surfaceSecondary: '#EDE5D5',
      primary: '#92400E',
      secondary: '#B45309',
      accent: '#047857',
      text: '#451A03',
      textSecondary: '#78350F',
      border: '#DECDB5',
      borderHover: '#C6B296',
      ring: '#92400E',
      badgeBg: '#FEF3C7',
      badgeText: '#92400E',
      gradientBg: 'from-[#F8F4EC] via-[#FCFAF5] to-[#F2EDE1]',
      heroGradient: 'from-[#451A03] via-[#78350F] to-[#14532D]',
      buttonGradient:
        'from-amber-700 via-amber-800 to-stone-800 hover:from-amber-800 hover:to-black text-white shadow-amber-300/40'
    },
    typography: {
      headingFont: "font-['Fredoka']",
      bodyFont: "font-['Quicksand']",
      displayStyle: 'tracking-wide'
    },
    ui: {
      buttonStyle:
        'rounded-2xl border border-amber-900/30 shadow-xs hover:shadow-md transition-all active:scale-98 font-extrabold',
      cardStyle: 'rounded-3xl border-2 border-amber-300/70 bg-[#FFFDF9] shadow-sm',
      navigationStyle: 'rounded-2xl bg-amber-100 text-amber-950',
      progressStyle: 'journey_map',
      borderRadius: 'rounded-3xl',
      shadowStyle: 'shadow-md shadow-amber-950/10'
    },
    motion: {
      transitionStyle: 'transition-all duration-300 ease-out',
      hoverEffect: 'hover:translate-y-[-2px] hover:shadow-md',
      completionEffect: 'compass_spin',
      ambientAnimation: 'none'
    },
    learningExperience: {
      todayPathTitle: "Today's Learning Journey",
      todayPathSubtitle: 'Trek past the trail markers toward the summit of word mastery.',
      navLabels: {
        learn: 'Trail Map',
        read: 'Expedition',
        practice: 'Camp Training',
        test: 'Checkpoint',
        home: 'Basecamp'
      },
      progressPresentation: {
        metaphor: 'Expedition Trail Map',
        stageNames: ['Basecamp', 'Word Valley', 'Reading Forest', 'Spelling Summit', 'Knowledge Peak'],
        unitLabel: 'Milestones Reached',
        visualIcon: '🧭'
      },
      practicePresentation: {
        modeTitle: 'Camp Training',
        flashcardStyle: 'field_guide',
        flashcardFrontBadge: 'Trail Marker',
        spellingPrompt: 'Carve this word into the summit stone:'
      },
      readingPresentation: {
        spaceTitle: 'Basecamp Reading Tent',
        tagline: 'Lantern-lit canvas tent sheltered by mountains for 15 intrepid reading minutes.',
        companionName: 'Captain Atlas 🧭',
        stageIcons: ['🎒', '🗺️', '🧭', '⛺', '🏔️']
      },
      testPresentation: {
        testTitle: 'Checkpoint Assessment',
        resultsTitle: 'Expedition Trail Progress',
        focusTitle: 'Trails to Revisit'
      },
      rewardPresentation: {
        celebrationPhrase: 'Summit reached! You conquered the learning trail!',
        rewardNoun: 'Explorer Compass Artifact',
        rewardIcon: '🏔️'
      },
      feedbackPhrases: {
        correct: 'Right on the map bearing! Forward along the trail.',
        encourage: 'Consult your compass and reorient your steps!'
      }
    },
    home: {
      roomStyle: 'Alpine Basecamp',
      wallColor: 'bg-amber-50',
      floorColor: 'bg-[#8C6D46]',
      windowView: 'mountains',
      lighting: 'candlelight',
      ambientDecor: ['Hand-drawn topological map', 'Brass surveyor compass', 'Canvas expedition backpack'],
      plantStyle: 'High-altitude pine bonsai in stone pot',
      petAccessory: 'Leather trail scout harness'
    },
    ambientSound: 'forest',
    bgGradient: 'from-[#FDFBF7] via-[#FFFDF9] to-[#F5EFE1]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-amber-300/70',
    accentText: 'text-amber-800',
    primaryText: 'text-stone-900',
    buttonGradient:
      'from-amber-700 via-amber-800 to-stone-800 hover:from-amber-800 hover:to-black text-white shadow-amber-200',
    heroGradient: 'from-amber-900 via-stone-800 to-emerald-900',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    navActive: 'bg-gradient-to-r from-amber-700 to-stone-800 text-white shadow-amber-200',
    worldMetaphor: {
      worldName: 'Great Mountain Basecamp',
      progressNoun: 'Peaks Conquered',
      statusIcon: '🏔️',
      actionVerb: 'Ascend Trail',
      milestoneLabel: 'Summit Outpost'
    },
    readingCompanion: {
      title: 'Expedition Reading Tent',
      description: 'Camp under starry skies with your trail journal and lantern for 15 minutes of reading.',
      stageIcons: ['🎒', '🗺️', '🧭', '⛺', '🏔️'],
      travelerName: 'Captain Atlas 🧭'
    }
  },

  // 11. PINK GARDEN (Soft floral, flowers, bows, butterflies, blossom meadow)
  pink_garden: {
    id: 'pink_garden',
    name: 'Pink Garden',
    category: 'whimsical',
    icon: '🌸',
    badge: '🎀 Blossom Meadow',
    tagline: 'Soft. Floral. Beautiful. Cheerful.',
    subtitle: 'Petal pink, soft rose, cheerful bows, pastel ribbons, and blooming butterflies',
    description:
      'A delightful, whimsical meadow filled with sweet flowers opening their petals, gentle butterflies, and cheerful garden companions.',
    colors: {
      background: '#FFF5F8',
      surface: '#FFFFFF',
      surfaceSecondary: '#FFEBF1',
      primary: '#DB2777',
      secondary: '#F43F5E',
      accent: '#EC4899',
      text: '#4C0519',
      textSecondary: '#831843',
      border: '#FBCFE8',
      borderHover: '#F472B6',
      ring: '#DB2777',
      badgeBg: '#FCE7F3',
      badgeText: '#9D174D',
      gradientBg: 'from-[#FFF5F8] via-[#FFF9FB] to-[#FBF0F5]',
      heroGradient: 'from-[#831843] via-[#BE185D] to-[#E11D48]',
      buttonGradient:
        'from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white shadow-pink-200'
    },
    typography: {
      headingFont: "font-['Fredoka']",
      bodyFont: "font-['Quicksand']",
      displayStyle: 'tracking-normal'
    },
    ui: {
      buttonStyle:
        'rounded-full border border-pink-400/30 shadow-xs hover:shadow-md transition-all active:scale-98 font-bold',
      cardStyle: 'rounded-3xl border-2 border-pink-200/80 bg-white/95 shadow-sm',
      navigationStyle: 'rounded-full bg-pink-100/80 text-pink-950',
      progressStyle: 'blossom_meadow',
      borderRadius: 'rounded-3xl',
      shadowStyle: 'shadow-md shadow-pink-950/5'
    },
    motion: {
      transitionStyle: 'transition-all duration-300 ease-out',
      hoverEffect: 'hover:scale-102 hover:shadow-pink-100',
      completionEffect: 'flower_confetti',
      ambientAnimation: 'butterfly_flutter'
    },
    learningExperience: {
      todayPathTitle: "Today's Garden Walk",
      todayPathSubtitle: 'Nurture sweet blossoms and watch petals unfold word by word.',
      navLabels: {
        learn: 'Learn',
        read: 'Reading Bower',
        practice: 'Garden Bloom',
        test: 'Flower Check',
        home: 'Blossom Room'
      },
      progressPresentation: {
        metaphor: 'Blossoming Meadow',
        stageNames: ['Little Seed', 'Green Bud', 'Gentle Petal', 'Sweet Flower', 'Full Meadow'],
        unitLabel: 'Petals Bloomed',
        visualIcon: '🌸'
      },
      practicePresentation: {
        modeTitle: 'Blossom Practice',
        flashcardStyle: 'journal',
        flashcardFrontBadge: 'Flower Card',
        spellingPrompt: 'Bloom this word with accurate letters:'
      },
      readingPresentation: {
        spaceTitle: 'Blossom Reading Bower',
        tagline: 'Rest under pastel arches with butterflies fluttering around your book.',
        companionName: 'Bella the Blossom Bunny 🐰',
        stageIcons: ['🌱', '🌿', '🌷', '🌸', '🌺']
      },
      testPresentation: {
        testTitle: 'Flower Garden Check',
        resultsTitle: 'Bloom Harvest Report',
        focusTitle: 'Buds to Tend'
      },
      rewardPresentation: {
        celebrationPhrase: 'Your blossom meadow is blooming so beautifully!',
        rewardNoun: 'Pastel Garden Treasure',
        rewardIcon: '🌸'
      },
      feedbackPhrases: {
        correct: 'Splendid bloom! Fragrant and full of life.',
        encourage: 'Gentle water and patience make every flower grow!'
      }
    },
    home: {
      roomStyle: 'Floral Blossom Room',
      wallColor: 'bg-pink-50/60',
      floorColor: 'bg-[#E8C5C8]',
      windowView: 'garden',
      lighting: 'daylight',
      ambientDecor: ['Pink bow garland', 'Pressed flower frame', 'Rose quartz dish'],
      plantStyle: 'Glazed porcelain pastel vase with peonies',
      petAccessory: 'Sweet silk bow ribbon'
    },
    ambientSound: 'chimes',
    bgGradient: 'from-[#FFF5F7] via-[#FFF9FB] to-[#FBF0F5]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-pink-200/80',
    accentText: 'text-pink-600',
    primaryText: 'text-pink-950',
    buttonGradient:
      'from-pink-500 via-rose-400 to-pink-500 hover:from-pink-600 hover:to-rose-500 text-white shadow-pink-200',
    heroGradient: 'from-pink-400 via-rose-300 to-purple-300',
    badgeBg: 'bg-pink-100 text-pink-700 border-pink-200',
    navActive: 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-pink-200',
    worldMetaphor: {
      worldName: 'Blossom Sanctuary',
      progressNoun: 'Petals Bloomed',
      statusIcon: '🌸',
      actionVerb: 'Water Garden',
      milestoneLabel: 'Flower Stage'
    },
    readingCompanion: {
      title: 'Garden Bloom Companion',
      description: 'A magical sweet flower gently opens its petals as you read your book.',
      stageIcons: ['🌱', '🌿', '🌷', '🌸', '🌺'],
      travelerName: 'Bella the Blossom Bunny 🐰'
    }
  },

  // 12. FAITH & SCRIPTURE (Peaceful, reflective, journal, olive branch, lantern)
  faith_scripture: {
    id: 'faith_scripture',
    name: 'Faith & Scripture',
    category: 'faith',
    icon: '🕊️',
    badge: '📜 Sacred Garden',
    tagline: 'Peaceful. Reflective. Warm. Hopeful. Respectful.',
    subtitle: 'Cream, olive branches, soft celestial blue, warm timber, and muted gold light',
    description:
      'Reflect on timeless scripture, grow in wisdom, meditate on inspirational verses, and study with a quiet, joyful heart.',
    colors: {
      background: '#FAF8F2',
      surface: '#FFFFFF',
      surfaceSecondary: '#F3EFE4',
      primary: '#6B5738',
      secondary: '#4A6B53',
      accent: '#C59A3F',
      text: '#2A241A',
      textSecondary: '#645A4A',
      border: '#E5DDCB',
      borderHover: '#D3C7B0',
      ring: '#C59A3F',
      badgeBg: '#F3ECDB',
      badgeText: '#685023',
      gradientBg: 'from-[#FAF8F2] via-[#FFFDF9] to-[#F3EFE4]',
      heroGradient: 'from-[#2A241A] via-[#4A3B22] to-[#2E4735]',
      buttonGradient:
        'from-[#6B5738] via-[#59472B] to-[#43351E] hover:from-[#59472B] hover:to-[#332714] text-white shadow-amber-200'
    },
    typography: {
      headingFont: "font-['Fredoka']",
      bodyFont: "font-['Quicksand']",
      displayStyle: 'tracking-normal'
    },
    ui: {
      buttonStyle:
        'rounded-2xl border border-amber-800/20 shadow-xs hover:shadow-md transition-all active:scale-98 font-bold',
      cardStyle: 'rounded-3xl border-2 border-amber-200/70 bg-[#FFFEFC] shadow-sm',
      navigationStyle: 'rounded-2xl bg-amber-100/70 text-amber-950',
      progressStyle: 'scripture_steps',
      borderRadius: 'rounded-3xl',
      shadowStyle: 'shadow-md shadow-amber-950/5'
    },
    motion: {
      transitionStyle: 'transition-all duration-300 ease-out',
      hoverEffect: 'hover:translate-y-[-2px] hover:shadow-md',
      completionEffect: 'golden_glow',
      ambientAnimation: 'gentle_breeze'
    },
    learningExperience: {
      todayPathTitle: 'Faith & Learning Journey',
      todayPathSubtitle: 'Grow in understanding, wisdom, and reflection one word at a time.',
      navLabels: {
        learn: 'Wisdom',
        read: 'Reflection',
        practice: 'Study',
        test: 'Review',
        home: 'Sanctuary'
      },
      progressPresentation: {
        metaphor: 'Spiritual Growth Steps',
        stageNames: ['Learn', 'Understand', 'Reflect', 'Live', 'Flourish'],
        unitLabel: 'Verses & Words Mastered',
        visualIcon: '🕊️'
      },
      practicePresentation: {
        modeTitle: 'Reflective Study',
        flashcardStyle: 'journal',
        flashcardFrontBadge: 'Scripture Verse',
        spellingPrompt: 'Write this word with dedicated study:'
      },
      readingPresentation: {
        spaceTitle: 'Peaceful Reflection Sanctuary',
        tagline: 'Quiet, reverent corner with soft lantern light for 15 dedicated reading minutes.',
        companionName: 'Hope the Dove 🕊️',
        stageIcons: ['🕊️', '📖', '🕯️', '🌿', '✨']
      },
      testPresentation: {
        testTitle: 'Weekly Wisdom Check',
        resultsTitle: 'Growth & Reflection Summary',
        focusTitle: 'Scriptures to Revisit'
      },
      rewardPresentation: {
        celebrationPhrase: 'Blessed are those who seek wisdom with all their heart.',
        rewardNoun: 'Sanctuary Lantern Item',
        rewardIcon: '🕊️'
      },
      feedbackPhrases: {
        correct: 'Well done! Wisdom takes root in good soil.',
        encourage: 'Keep seeking and learning. Growth comes step by step.'
      }
    },
    home: {
      roomStyle: 'Sanctuary Study',
      wallColor: 'bg-amber-50/50',
      floorColor: 'bg-[#A68A68]',
      windowView: 'peaceful_terrace',
      lighting: 'candlelight',
      ambientDecor: ['Olive wood carving', 'Parchment scripture scroll', 'Brass oil lantern'],
      plantStyle: 'Olive tree sapling in earthen clay vessel',
      petAccessory: 'Olive branch woven wreath'
    },
    ambientSound: 'chimes',
    bgGradient: 'from-[#FAF8F5] via-[#FFFDF9] to-[#F3EFE4]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-amber-200/80',
    accentText: 'text-amber-800',
    primaryText: 'text-stone-900',
    buttonGradient:
      'from-[#6B5738] via-[#59472B] to-[#43351E] hover:from-[#59472B] hover:to-[#332714] text-white shadow-amber-200',
    heroGradient: 'from-[#2A241A] via-[#4A3B22] to-[#2E4735]',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    navActive: 'bg-gradient-to-r from-[#6B5738] to-[#43351E] text-white shadow-amber-200',
    worldMetaphor: {
      worldName: 'Faith & Wisdom Sanctuary',
      progressNoun: 'Verses Contemplated',
      statusIcon: '🕊️',
      actionVerb: 'Reflect & Grow',
      milestoneLabel: 'Sanctuary Chamber'
    },
    readingCompanion: {
      title: 'Peaceful Reflection Nook',
      description: 'Spend 15 peaceful minutes reading inspiring stories and sacred text.',
      stageIcons: ['🕊️', '📖', '🕯️', '🌿', '✨'],
      travelerName: 'Hope the Dove 🕊️'
    }
  },

  // Legacy aliases to guarantee seamless compatibility
  warm_modern: null as unknown as ThemeConfig,
  nature_adventure: null as unknown as ThemeConfig,
  fantasy_kingdom: null as unknown as ThemeConfig,
  animal_world: null as unknown as ThemeConfig,
  ocean_adventure: null as unknown as ThemeConfig,
  game_zone: null as unknown as ThemeConfig
};

// Wire up legacy aliases to the primary 12 themes
THEMES.warm_modern = THEMES.modern_warm;
THEMES.nature_adventure = THEMES.nature;
THEMES.ocean_adventure = THEMES.ocean;
THEMES.game_zone = THEMES.gaming;
THEMES.fantasy_kingdom = THEMES.adventure;
THEMES.animal_world = THEMES.nature;

export const PRIMARY_THEME_IDS: ThemeId[] = [
  'cozy_cottage',
  'modern_warm',
  'nature',
  'ocean',
  'space_explorer',
  'creative_studio',
  'gaming',
  'sports',
  'science_discovery',
  'adventure',
  'pink_garden',
  'faith_scripture'
];

export const THEME_LIST = PRIMARY_THEME_IDS.map((id) => THEMES[id]);

export const getThemeConfig = (id?: ThemeId): ThemeConfig => {
  if (id && THEMES[id]) {
    return THEMES[id];
  }
  return THEMES.cozy_cottage;
};

// Generates CSS variables for dynamic application
export const getThemeCssVariables = (theme: ThemeConfig): Record<string, string> => {
  return {
    '--theme-bg': theme.colors.background,
    '--theme-surface': theme.colors.surface,
    '--theme-surface-secondary': theme.colors.surfaceSecondary,
    '--theme-primary': theme.colors.primary,
    '--theme-secondary': theme.colors.secondary,
    '--theme-accent': theme.colors.accent,
    '--theme-text': theme.colors.text,
    '--theme-text-secondary': theme.colors.textSecondary,
    '--theme-border': theme.colors.border,
    '--theme-border-hover': theme.colors.borderHover,
    '--theme-ring': theme.colors.ring,
    '--theme-badge-bg': theme.colors.badgeBg,
    '--theme-badge-text': theme.colors.badgeText
  };
};

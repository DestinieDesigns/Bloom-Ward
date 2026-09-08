import { ThemeId } from '../types';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  icon: string;
  badge: string;
  subtitle: string;
  description: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  accentText: string;
  primaryText: string;
  buttonGradient: string;
  heroGradient: string;
  badgeBg: string;
  navActive: string;
  ambientSound: 'chimes' | 'forest' | 'space' | 'waves' | 'rain' | 'arcade';
  worldMetaphor: {
    worldName: string;
    progressNoun: string; // e.g. "Petals Bloomed", "Stars Visited", "Peaks Climbed"
    statusIcon: string;
    actionVerb: string; // e.g. "Water", "Launch", "Explore"
    milestoneLabel: string;
  };
  readingCompanion: {
    title: string;
    description: string;
    stageIcons: string[];
    travelerName: string;
  };
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  pink_garden: {
    id: 'pink_garden',
    name: 'Pink Garden',
    icon: '🌸',
    badge: '🎀 Cute & Magical',
    subtitle: 'Flowers, bows, butterflies, and sparkling blossom meadows',
    description: 'A cheerful paradise filled with blooming petals, cute bows, and gentle garden friends.',
    bgGradient: 'from-[#FFF5F7] via-[#FFF9FB] to-[#FBF0F5]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-pink-200/80',
    accentText: 'text-pink-600',
    primaryText: 'text-pink-950',
    buttonGradient: 'from-pink-500 via-rose-400 to-pink-500 hover:from-pink-600 hover:to-rose-500 text-white shadow-pink-200',
    heroGradient: 'from-pink-400 via-rose-300 to-purple-300',
    badgeBg: 'bg-pink-100 text-pink-700 border-pink-200',
    navActive: 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-pink-200',
    ambientSound: 'chimes',
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

  nature_adventure: {
    id: 'nature_adventure',
    name: 'Nature Adventure',
    icon: '🌿',
    badge: '🌲 Wild & Free',
    subtitle: 'Forests, tall trees, towering mountains, and woodland creatures',
    description: 'Trek scenic mountain trails, explore ancient sequoias, and discover wildlife in deep forests.',
    bgGradient: 'from-[#F2F8F4] via-[#F8FAF8] to-[#EAF4ED]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-emerald-200/80',
    accentText: 'text-emerald-600',
    primaryText: 'text-emerald-950',
    buttonGradient: 'from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-700 hover:to-teal-600 text-white shadow-emerald-200',
    heroGradient: 'from-emerald-600 via-teal-500 to-amber-600',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    navActive: 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-emerald-200',
    ambientSound: 'forest',
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

  space_explorer: {
    id: 'space_explorer',
    name: 'Space Explorer',
    icon: '🚀',
    badge: '🌌 Cosmic Quests',
    subtitle: 'Planets, shooting stars, rockets, and interstellar discovery',
    description: 'Pilot your star cruiser across colorful nebulas and chart unknown planets in the cosmos.',
    bgGradient: 'from-[#0F172A] via-[#1E1B4B] to-[#0F172A]',
    cardBg: 'bg-slate-900/90 text-slate-100',
    cardBorder: 'border-indigo-500/40',
    accentText: 'text-cyan-400',
    primaryText: 'text-cyan-100',
    buttonGradient: 'from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white shadow-indigo-500/30',
    heroGradient: 'from-indigo-900 via-purple-900 to-slate-900',
    badgeBg: 'bg-indigo-950/80 text-cyan-300 border-indigo-500/50',
    navActive: 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-cyan-500/20',
    ambientSound: 'space',
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

  fantasy_kingdom: {
    id: 'fantasy_kingdom',
    name: 'Fantasy Kingdom',
    icon: '🏰',
    badge: '👑 Mythic Legend',
    subtitle: 'Castles, royal paths, hidden treasures, and friendly dragons',
    description: 'Embark on a heroic quest across cobblestone castle grounds, enchanted towers, and ancient realms.',
    bgGradient: 'from-[#FAF6FF] via-[#FDF9FF] to-[#F5EEFD]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-purple-200/80',
    accentText: 'text-purple-600',
    primaryText: 'text-purple-950',
    buttonGradient: 'from-purple-600 via-violet-500 to-amber-500 hover:from-purple-700 hover:to-violet-600 text-white shadow-purple-200',
    heroGradient: 'from-purple-600 via-violet-500 to-amber-500',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    navActive: 'bg-gradient-to-r from-purple-600 to-violet-500 text-white shadow-purple-200',
    ambientSound: 'chimes',
    worldMetaphor: {
      worldName: 'Crown Citadel',
      progressNoun: 'Kingdom Seals Unlocked',
      statusIcon: '🏰',
      actionVerb: 'Unlock Gate',
      milestoneLabel: 'Castle Chamber'
    },
    readingCompanion: {
      title: 'Kingdom Quest Torch',
      description: 'Golden torchlights illuminate the royal path toward the enchanted crystal spire.',
      stageIcons: ['🗝️', '🛡️', '🏰', '🐉', '👑'],
      travelerName: 'Sir Cedric the Knight ⚔️'
    }
  },

  animal_world: {
    id: 'animal_world',
    name: 'Animal World',
    icon: '🐾',
    badge: '🦊 Pet Sanctuary',
    subtitle: 'Adorable animals, cozy habitats, wildlife rescues, and animal care',
    description: 'Build a loving haven for puppies, pandas, playful otters, and exotic safari animals.',
    bgGradient: 'from-[#FFFDF5] via-[#FFFBF2] to-[#FFF7E8]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-amber-200/80',
    accentText: 'text-amber-700',
    primaryText: 'text-amber-950',
    buttonGradient: 'from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-200',
    heroGradient: 'from-amber-500 via-orange-400 to-yellow-500',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    navActive: 'bg-gradient-to-r from-amber-500 to-orange-400 text-white shadow-amber-200',
    ambientSound: 'forest',
    worldMetaphor: {
      worldName: 'Wildlife Sanctuary',
      progressNoun: 'Animals Sheltered & Fed',
      statusIcon: '🐾',
      actionVerb: 'Care for Pets',
      milestoneLabel: 'Habitat Haven'
    },
    readingCompanion: {
      title: 'Sanctuary Meadow',
      description: 'A cozy furry friend curls up by your side and enjoys peaceful reading time with you.',
      stageIcons: ['🐾', '🐶', '🦊', '🐼', '🦁'],
      travelerName: 'Barnaby the Golden Pup 🐕'
    }
  },

  ocean_adventure: {
    id: 'ocean_adventure',
    name: 'Ocean Adventure',
    icon: '🌊',
    badge: '🐬 Coral Reefs',
    subtitle: 'Dolphins, coral reefs, sunken treasures, and deep sea submarine dives',
    description: 'Dive beneath turquoise waves to swim alongside sea turtles, explore coral grottos, and find lost galleons.',
    bgGradient: 'from-[#F0F9FF] via-[#F4FBFF] to-[#E6F4FE]',
    cardBg: 'bg-white/95',
    cardBorder: 'border-sky-200/80',
    accentText: 'text-sky-600',
    primaryText: 'text-sky-950',
    buttonGradient: 'from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-sky-200',
    heroGradient: 'from-cyan-500 via-sky-500 to-blue-600',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
    navActive: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sky-200',
    ambientSound: 'waves',
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

  game_zone: {
    id: 'game_zone',
    name: 'Game Zone',
    icon: '🎮',
    badge: '🕹️ Level Up Arcade',
    subtitle: 'Modern gaming aesthetics, power-up crystals, XP multipliers, and pixel quests',
    description: 'Level up your stats, unlock epic achievements, and power through word boss challenges.',
    bgGradient: 'from-[#0F172A] via-[#1E293B] to-[#0F172A]',
    cardBg: 'bg-slate-900/90 text-slate-100',
    cardBorder: 'border-violet-500/40',
    accentText: 'text-violet-400',
    primaryText: 'text-violet-100',
    buttonGradient: 'from-violet-600 via-fuchsia-600 to-pink-500 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-violet-500/30',
    heroGradient: 'from-violet-900 via-purple-900 to-slate-900',
    badgeBg: 'bg-violet-950/80 text-violet-300 border-violet-500/50',
    navActive: 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-fuchsia-500/20',
    ambientSound: 'arcade',
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
  }
};

export const THEME_LIST = Object.values(THEMES);

export const getThemeConfig = (id?: ThemeId): ThemeConfig => {
  if (id && THEMES[id]) {
    return THEMES[id];
  }
  return THEMES.pink_garden;
};

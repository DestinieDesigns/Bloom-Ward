import { GardenPlot, GardenPet } from '../types';

export const INITIAL_GARDEN_PLOTS: GardenPlot[] = [
  {
    id: 'plot-1',
    name: 'Sweet Pea Peony',
    flowerType: 'Peony',
    color: '#F472B6', // vibrant pink
    stage: 1, // begins as a tiny sprout ready to grow
    unlocked: true,
    unlockedAtXp: 0,
    petalCount: 4
  },
  {
    id: 'plot-2',
    name: 'Gentle Grace Lily',
    flowerType: 'Lily',
    color: '#FBCFE8', // soft pastel pink
    stage: 1,
    unlocked: false,
    unlockedAtXp: 50,
    petalCount: 6
  },
  {
    id: 'plot-3',
    name: 'Wisdom Rose',
    flowerType: 'Rose',
    color: '#EC4899', // hot pink
    stage: 1,
    unlocked: false,
    unlockedAtXp: 150,
    petalCount: 5
  },
  {
    id: 'plot-4',
    name: 'Courage Sunflower',
    flowerType: 'Sunflower',
    color: '#FBBF24', // golden yellow
    stage: 1,
    unlocked: false,
    unlockedAtXp: 250,
    petalCount: 12
  },
  {
    id: 'plot-5',
    name: 'Lavender Harmony',
    flowerType: 'Lavender',
    color: '#C084FC', // lavender purple
    stage: 1,
    unlocked: false,
    unlockedAtXp: 400,
    petalCount: 4
  },
  {
    id: 'plot-6',
    name: 'Shalom Blossom',
    flowerType: 'Orchid',
    color: '#E879F9', // fuchsia blossom
    stage: 1,
    unlocked: false,
    unlockedAtXp: 600,
    petalCount: 5
  },
  {
    id: 'plot-7',
    name: 'Radiant Daisy',
    flowerType: 'Daisy',
    color: '#FDA4AF', // rose pink
    stage: 1,
    unlocked: false,
    unlockedAtXp: 850,
    petalCount: 10
  },
  {
    id: 'plot-8',
    name: 'Queen’s Golden Crown Blossom',
    flowerType: 'Crown Flower',
    color: '#F59E0B',
    stage: 1,
    unlocked: false,
    unlockedAtXp: 1200,
    petalCount: 14
  }
];

export const INITIAL_GARDEN_PETS: GardenPet[] = [
  {
    id: 'pet-1',
    name: 'Bella the Bunny',
    emoji: '🐰',
    title: 'Hop-a-long Word Hopper',
    unlocked: true,
    unlockCondition: 'Unlocked at start of your adventure'
  },
  {
    id: 'pet-2',
    name: 'Pip the Hummingbird',
    emoji: '🐦',
    title: 'Sweet Nectar Explorer',
    unlocked: false,
    unlockCondition: '3-Day Streak or complete 5 vocabulary games'
  },
  {
    id: 'pet-3',
    name: 'Mochi the Puppy',
    emoji: '🐶',
    title: 'Spelling Companion',
    unlocked: false,
    unlockCondition: 'Reach a 7-Day Learning Streak 🔥'
  },
  {
    id: 'pet-4',
    name: 'Daisy the Kitten',
    emoji: '🐱',
    title: 'Faith & Reading Guardian',
    unlocked: false,
    unlockCondition: 'Complete 3 Reading Room stories'
  },
  {
    id: 'pet-5',
    name: 'Glimmer the Monarch',
    emoji: '🦋',
    title: 'Magical Meadow Butterfly',
    unlocked: false,
    unlockCondition: 'Reach Level 5 in BloomWord'
  }
];

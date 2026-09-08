import { AchievementBadge } from '../types';

export const INITIAL_BADGES: AchievementBadge[] = [
  {
    id: 'badge-first-words',
    title: 'First 10 Words',
    description: 'Practiced and blossomed your first 10 vocabulary words',
    icon: '🌸',
    category: 'words',
    unlocked: false
  },
  {
    id: 'badge-spelling-star',
    title: 'Spelling Star',
    description: 'Spelled 5 words correctly without missing a letter',
    icon: '✏️',
    category: 'spelling',
    unlocked: false
  },
  {
    id: 'badge-streak-7',
    title: '7-Day Blossom Streak',
    description: 'Kept your learning garden blooming 7 days in a row',
    icon: '🔥',
    category: 'streak',
    unlocked: false
  },
  {
    id: 'badge-def-detective',
    title: 'Definition Detective',
    description: 'Solved 10 definition mystery challenges',
    icon: '✨',
    category: 'mastery',
    unlocked: false
  },
  {
    id: 'badge-reading-explorer',
    title: 'Reading Explorer',
    description: 'Read a story and aced all comprehension questions',
    icon: '📖',
    category: 'reading',
    unlocked: false
  },
  {
    id: 'badge-faith-explorer',
    title: 'Faith Garden Explorer',
    description: 'Learned the scripture & child meaning of 5 Bible words',
    icon: '✝️',
    category: 'bible',
    unlocked: false
  },
  {
    id: 'badge-weekly-champion',
    title: 'Growth Check Champion',
    description: 'Completed a Weekly Growth Check with flying pink ribbons',
    icon: '🏆',
    category: 'mastery',
    unlocked: false
  },
  {
    id: 'badge-master-100',
    title: '100 Words Mastered',
    description: 'Earned the golden crown on 100 vocabulary words',
    icon: '👑',
    category: 'mastery',
    unlocked: false
  }
];

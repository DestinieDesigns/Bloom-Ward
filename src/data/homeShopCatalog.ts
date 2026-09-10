import {
  HomeItem,
  ShopCategory,
  FurnitureCollection,
  ItemPlacement,
  ItemSize,
  FurnitureActionType
} from '../types';
import { furnitureCatalog } from './furnitureCatalog';

export { furnitureCatalog };

export interface ShopCategoryConfig {
  id: ShopCategory;
  name: string;
  icon: string;
  description: string;
}

export interface SeasonalCollectionConfig {
  id: FurnitureCollection;
  name: string;
  icon: string;
  tagline: string;
  badgeColor: string;
}

export const SHOP_CATEGORIES: ShopCategoryConfig[] = [
  {
    id: 'basic',
    name: 'Basic',
    icon: '🏠',
    description: 'Essential timeless furniture for cozy beginnings'
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    icon: '🛏️',
    description: 'Comfortable beds, dressers, and nightstands'
  },
  {
    id: 'living_room',
    name: 'Living Room',
    icon: '🛋️',
    description: 'Plush sofas, armchairs, and coffee tables'
  },
  {
    id: 'reading_study',
    name: 'Reading & Study',
    icon: '📚',
    description: 'Bookshelves, study desks, and reading chairs'
  },
  {
    id: 'decorations',
    name: 'Decorations',
    icon: '🌿',
    description: 'Botanical plants, candles, art, and plushies'
  },
  {
    id: 'lighting',
    name: 'Lighting',
    icon: '💡',
    description: 'Warm table lamps, reading lights, and chandeliers'
  },
  {
    id: 'windows_doors',
    name: 'Windows & Doors',
    icon: '🪟',
    description: 'Mullion windows, curtains, and interior doors'
  },
  {
    id: 'walls_floors',
    name: 'Walls & Floors',
    icon: '🎨',
    description: 'Natural oak hardwood and velvety paint tones'
  },
  {
    id: 'seasonal',
    name: 'Seasonal',
    icon: '🍂',
    description: 'Fall, Halloween, Winter, Spring, Summer & Valentine’s'
  },
  {
    id: 'rewards',
    name: 'Achievements',
    icon: '🏆',
    description: 'Trophies and special items unlocked via learning'
  }
];

export const SEASONAL_COLLECTIONS: SeasonalCollectionConfig[] = [
  {
    id: 'fall',
    name: 'Fall Harvest',
    icon: '🍂',
    tagline: 'Amber leaves, pumpkin spice, and warm wool blankets',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  {
    id: 'halloween',
    name: 'Halloween Spooktacular',
    icon: '👻',
    tagline: 'Friendly felt ghosts, glowing pumpkins, and velvet bats',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
  },
  {
    id: 'winter',
    name: 'Winter Wonderland',
    icon: '❄️',
    tagline: 'Frosted pines, roaring stone fireplaces, and snow crystals',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300'
  },
  {
    id: 'spring',
    name: 'Spring Awakening',
    icon: '🌸',
    tagline: 'Pastel sakura blossoms, Dutch tulips, and fluttery butterflies',
    badgeColor: 'bg-pink-100 text-pink-900 border-pink-300'
  },
  {
    id: 'summer',
    name: 'Summer Sunshine',
    icon: '☀️',
    tagline: 'Giant sunflowers, rattan sun loungers, and tropical palms',
    badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300'
  },
  {
    id: 'valentines',
    name: 'Valentine’s Sweetheart',
    icon: '💕',
    tagline: 'Velvet hearts, fragrant heritage roses, and blush throws',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
  }
];

export const STARTER_PACK_ITEM_IDS = [
  'furn-classic-single-bed',
  'furn-wooden-dresser',
  'furn-armchair',
  'furn-small-bookshelf',
  'furn-bedside-lamp',
  'decor-small-potted-plant',
  // Keep legacy ids unlocked for backward compatibility
  'furn-starter-bed',
  'furn-starter-rug',
  'furn-starter-lamp',
  'furn-starter-table'
];

export const SHOP_CATALOG_ITEMS: HomeItem[] = [
  // ==========================================
  // 🏠 BASIC STARTER COLLECTION & HOME FEATURES (26 Items)
  // ==========================================
  ...furnitureCatalog,

  // ==========================================
  // 🍂 SEASONAL COLLECTION — FALL HARVEST
  // ==========================================
  {
    id: 'furn-fall-pumpkin-trio',
    name: 'Ceramic Pumpkin Trio',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'fall',
    price: 110,
    placement: 'floor',
    size: 'medium',
    icon: '🎃',
    renderType: 'pumpkin_trio',
    description:
      'Three glazed ceramic gourds in terracotta, milk-white, and sage green with curled gold stems.',
    unlocked: false,
    unlockCondition: '110 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 1.05,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['relax']
  },
  {
    id: 'furn-fall-leaf-rug',
    name: 'Autumn Leaf Wool Rug',
    category: 'furniture',
    shopCategory: 'seasonal',
    collection: 'fall',
    price: 140,
    placement: 'floor',
    size: 'large',
    icon: '🍁',
    renderType: 'leaf_rug',
    description:
      'Hand-tufted maple leaf rug woven with thick wool in amber, rust, and burnt sienna gradients.',
    unlocked: false,
    unlockCondition: '140 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 1.3,
    isResizable: true,
    isRotatable: true,
    interactive: false
  },
  {
    id: 'furn-fall-wreath',
    name: 'Autumn Berry Wreath',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'fall',
    price: 95,
    placement: 'wall',
    size: 'medium',
    icon: '🍂',
    renderType: 'fall_wreath',
    description:
      'Curved grapevine wreath interlaced with eucalyptus, copper leaves, and mini acorns.',
    unlocked: false,
    unlockCondition: '95 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: false,
    interactive: false
  },
  {
    id: 'furn-fall-cinnamon-candle',
    name: 'Cinnamon Hearth Candle',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'fall',
    price: 75,
    placement: 'surface',
    size: 'small',
    icon: '🕯️',
    renderType: 'cinnamon_candle',
    description:
      'Amber jar candle scented with sweet spiced cinnamon bark and crisp fall apples.',
    unlocked: false,
    unlockCondition: '75 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 0.85,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['turnOn', 'turnOff']
  },
  {
    id: 'furn-fall-orange-blanket',
    name: 'Cozy Amber Knit Blanket',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'fall',
    price: 120,
    placement: 'surface',
    size: 'small',
    icon: '🧶',
    renderType: 'amber_blanket',
    description:
      'Chunky merino wool throw in a rich harvest orange, folded neatly for breezy autumn evenings.',
    unlocked: false,
    unlockCondition: '120 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 0.9,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['relax']
  },
  {
    id: 'furn-fall-wheat-arrangement',
    name: 'Golden Wheat Sheaf',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'fall',
    price: 85,
    placement: 'surface',
    size: 'small',
    icon: '🌾',
    renderType: 'wheat_arrangement',
    description:
      'Sun-dried wheat stalks bound with natural jute twine in a rustic farmhouse stoneware jar.',
    unlocked: false,
    unlockCondition: '85 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 0.9,
    isResizable: true,
    isRotatable: true,
    interactive: false
  },

  // ==========================================
  // 👻 SEASONAL COLLECTION — HALLOWEEN
  // ==========================================
  {
    id: 'furn-halloween-ghost',
    name: 'Friendly Ghost Plush',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'halloween',
    price: 130,
    placement: 'surface',
    size: 'small',
    icon: '👻',
    renderType: 'friendly_ghost',
    description:
      'A sweet felt ghost plushie with rosy embroidered cheeks clutching a miniature spellbook.',
    unlocked: false,
    unlockCondition: '130 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 0.95,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['relax']
  },
  {
    id: 'furn-halloween-jack-o-lantern',
    name: 'Glowing Jack-o’-Lantern',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'halloween',
    price: 110,
    placement: 'floor',
    size: 'small',
    icon: '🎃',
    renderType: 'jack_o_lantern',
    description:
      'Hand-carved pumpkin with a merry, wide smile that glows safely with a warm battery flicker.',
    unlocked: false,
    unlockCondition: '110 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['turnOn', 'turnOff']
  },
  {
    id: 'furn-halloween-bat-garland',
    name: 'Velvet Bat Garland',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'halloween',
    price: 90,
    placement: 'wall',
    size: 'medium',
    icon: '🦇',
    renderType: 'bat_garland',
    description:
      'Five playful black velvet bats dangling playfully along a dark plum cord.',
    unlocked: false,
    unlockCondition: '90 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 1.15,
    isResizable: true,
    isRotatable: false,
    interactive: false
  },
  {
    id: 'furn-halloween-cobweb',
    name: 'Cobweb Lace Valance',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'halloween',
    price: 70,
    placement: 'wall',
    size: 'small',
    icon: '🕸️',
    renderType: 'cobweb_lace',
    description:
      'Delicately woven spiderweb lace that drapes gently over wall corners without any dust.',
    unlocked: false,
    unlockCondition: '70 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 0.9,
    isResizable: true,
    isRotatable: false,
    interactive: false
  },
  {
    id: 'furn-halloween-witch-hat-lamp',
    name: 'Witch Hat Glow Lamp',
    category: 'furniture',
    shopCategory: 'seasonal',
    collection: 'halloween',
    price: 125,
    placement: 'surface',
    size: 'small',
    icon: '🧙',
    renderType: 'witch_lamp',
    description:
      'Velvet pointed witch hat with star punch-outs that project constellation sparkles when turned on.',
    unlocked: false,
    unlockCondition: '125 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 0.95,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['turnOn', 'turnOff']
  },

  // ==========================================
  // ❄️ SEASONAL COLLECTION — WINTER WONDERLAND
  // ==========================================
  {
    id: 'furn-winter-tree',
    name: 'Mini Evergreen Tree',
    category: 'furniture',
    shopCategory: 'seasonal',
    collection: 'winter',
    price: 260,
    placement: 'floor',
    size: 'large',
    icon: '🎄',
    renderType: 'winter_tree',
    description:
      'Potted Douglas fir dusted with sugar snow, pinecones, and tiny warm-white fairy bulbs.',
    unlocked: false,
    unlockCondition: '260 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 1.35,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['turnOn', 'turnOff']
  },
  {
    id: 'furn-winter-stockings',
    name: 'Cable Knit Stockings',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'winter',
    price: 85,
    placement: 'wall',
    size: 'small',
    icon: '🧦',
    renderType: 'hearth_stockings',
    description:
      'Pair of plush ivory cable-knit stockings with wooden buttons ready for holiday treats.',
    unlocked: false,
    unlockCondition: '85 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 0.9,
    isResizable: true,
    isRotatable: false,
    interactive: false
  },
  {
    id: 'furn-winter-snowflake-chandelier',
    name: 'Crystal Snowflake Chandelier',
    category: 'furniture',
    shopCategory: 'seasonal',
    collection: 'winter',
    price: 175,
    placement: 'ceiling',
    size: 'medium',
    icon: '❄️',
    renderType: 'snowflake_chandelier',
    description:
      'Faceted glass crystals cut into hexagonal snowflake shapes that refract gentle light across ceilings.',
    unlocked: false,
    unlockCondition: '175 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 1.15,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['turnOn', 'turnOff']
  },
  {
    id: 'furn-winter-blanket',
    name: 'Cashmere Winter Quilt',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'winter',
    price: 130,
    placement: 'surface',
    size: 'medium',
    icon: '☕',
    renderType: 'winter_quilt',
    description:
      'Heavyweight down-filled quilt in dove white with silver piping for cold winter story hours.',
    unlocked: false,
    unlockCondition: '130 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['sleep', 'relax']
  },
  {
    id: 'furn-winter-presents',
    name: 'Decorative Gift Boxes',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'winter',
    price: 95,
    placement: 'floor',
    size: 'small',
    icon: '🎁',
    renderType: 'present_stack',
    description:
      'Three wrapped boxes in forest green and metallic gold tied with satin bow ribbons.',
    unlocked: false,
    unlockCondition: '95 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 0.95,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['relax']
  },
  {
    id: 'furn-winter-fireplace',
    name: 'Fieldstone Fireplace',
    category: 'furniture',
    shopCategory: 'seasonal',
    collection: 'winter',
    price: 350,
    placement: 'floor',
    size: 'large',
    icon: '🔥',
    renderType: 'stone_fireplace',
    description:
      'A cozy natural hearth built with smooth river stones, glowing wood logs, and a solid timber mantle.',
    unlocked: false,
    unlockCondition: '350 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 1.4,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['turnOn', 'turnOff', 'relax']
  },

  // ==========================================
  // 🌸 SEASONAL COLLECTION — SPRING AWAKENING
  // ==========================================
  {
    id: 'furn-spring-blossom-vase',
    name: 'Pastel Floral Trio',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'spring',
    price: 120,
    placement: 'surface',
    size: 'small',
    icon: '🌸',
    renderType: 'blossom_vase',
    description:
      'Pastel ranunculus, sweet-peas, and seeded eucalyptus in a hand-dipped pink ceramic pitcher.',
    unlocked: false,
    unlockCondition: '120 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 0.9,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['waterPlant']
  },
  {
    id: 'furn-spring-tulips',
    name: 'Fresh Dutch Tulips',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'spring',
    price: 90,
    placement: 'surface',
    size: 'small',
    icon: '🌷',
    renderType: 'tulip_pitcher',
    description:
      'A bunch of coral and sunshine-yellow tulips drinking water in a glazed porcelain milk jug.',
    unlocked: false,
    unlockCondition: '90 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 0.85,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['waterPlant']
  },
  {
    id: 'furn-spring-butterfly',
    name: 'Paper Butterfly Shadowbox',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'spring',
    price: 105,
    placement: 'wall',
    size: 'small',
    icon: '🦋',
    renderType: 'butterfly_box',
    description:
      'Delicate three-dimensional folded origami butterflies framed in natural birch.',
    unlocked: false,
    unlockCondition: '105 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: false,
    interactive: false
  },
  {
    id: 'furn-spring-moss-rug',
    name: 'Meadow Moss Wool Rug',
    category: 'furniture',
    shopCategory: 'seasonal',
    collection: 'spring',
    price: 140,
    placement: 'floor',
    size: 'large',
    icon: '🌿',
    renderType: 'moss_rug',
    description:
      'Textured moss-green wool rug providing a spring meadow feeling beneath your feet.',
    unlocked: false,
    unlockCondition: '140 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 1.3,
    isResizable: true,
    isRotatable: true,
    interactive: false
  },
  {
    id: 'furn-spring-cherry-branch',
    name: 'Cherry Blossom Branch',
    category: 'furniture',
    shopCategory: 'seasonal',
    collection: 'spring',
    price: 160,
    placement: 'floor',
    size: 'large',
    icon: '🌸',
    renderType: 'cherry_branch',
    description:
      'Tall architectural blossom branch with delicate pink sakura petals standing in a floor urn.',
    unlocked: false,
    unlockCondition: '160 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 1.25,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['waterPlant']
  },

  // ==========================================
  // ☀️ SEASONAL COLLECTION — SUMMER SUNSHINE
  // ==========================================
  {
    id: 'furn-summer-sunflower',
    name: 'Terracotta Sunflowers',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'summer',
    price: 110,
    placement: 'surface',
    size: 'small',
    icon: '🌻',
    renderType: 'sunflower_pot',
    description:
      'Two giant blooming sunflowers turned toward the sun in a weathered Tuscan terracotta pot.',
    unlocked: false,
    unlockCondition: '110 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 0.95,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['waterPlant']
  },
  {
    id: 'furn-summer-beach-chair',
    name: 'Rattan Sun Lounger',
    category: 'furniture',
    shopCategory: 'seasonal',
    collection: 'summer',
    price: 210,
    placement: 'floor',
    size: 'large',
    icon: '🏖️',
    renderType: 'rattan_chair',
    description:
      'Woven wicker rattan lounger with striped navy nautical canvas cushion for breezy reading.',
    unlocked: false,
    unlockCondition: '210 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 1.25,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['sit', 'relax']
  },
  {
    id: 'furn-summer-palm',
    name: 'Potted Areca Palm',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'summer',
    price: 160,
    placement: 'floor',
    size: 'large',
    icon: '🌴',
    renderType: 'paradise_palm',
    description:
      'Graceful tropical palm fronds in a fluted sand ceramic planter that flutter with the window open.',
    unlocked: false,
    unlockCondition: '160 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 1.2,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['waterPlant']
  },
  {
    id: 'furn-summer-wave-rug',
    name: 'Ocean Wave Ombré Rug',
    category: 'furniture',
    shopCategory: 'seasonal',
    collection: 'summer',
    price: 150,
    placement: 'floor',
    size: 'large',
    icon: '🌊',
    renderType: 'wave_rug',
    description:
      'Circular woven rug with calming color transitions from sea-foam aqua to dark indigo ocean waves.',
    unlocked: false,
    unlockCondition: '150 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 1.3,
    isResizable: true,
    isRotatable: true,
    interactive: false
  },
  {
    id: 'furn-summer-patio-table',
    name: 'Slatted Teak Table',
    category: 'furniture',
    shopCategory: 'seasonal',
    collection: 'summer',
    price: 170,
    placement: 'floor',
    size: 'medium',
    icon: '🪵',
    renderType: 'teak_table',
    description:
      'Golden teak outdoor table with slatted top built to resist summer sea air and hold lemonade.',
    unlocked: false,
    unlockCondition: '170 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 1.1,
    isResizable: true,
    isRotatable: true,
    interactive: false
  },

  // ==========================================
  // 💕 SEASONAL COLLECTION — VALENTINE’S
  // ==========================================
  {
    id: 'furn-valentines-pillow',
    name: 'Velvet Heart Pillows',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'valentines',
    price: 95,
    placement: 'surface',
    size: 'small',
    icon: '💖',
    renderType: 'heart_pillow',
    description:
      'Pair of plush velvet heart throw pillows in rosy blush and deep raspberry.',
    unlocked: false,
    unlockCondition: '95 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 0.9,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['relax']
  },
  {
    id: 'furn-valentines-roses',
    name: 'Heritage Rose Urn',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'valentines',
    price: 130,
    placement: 'surface',
    size: 'medium',
    icon: '🌹',
    renderType: 'rose_urn',
    description:
      'Fragrant heirloom English garden roses in cream, blush pink, and rich crimson.',
    unlocked: false,
    unlockCondition: '130 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 0.95,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['waterPlant']
  },
  {
    id: 'furn-valentines-blanket',
    name: 'Blush Pink Throw',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'valentines',
    price: 115,
    placement: 'surface',
    size: 'small',
    icon: '🎀',
    renderType: 'blush_blanket',
    description:
      'Feather-light brushed cashmere throw in tender blush pink with fringed edges.',
    unlocked: false,
    unlockCondition: '115 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 0.95,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['relax']
  },
  {
    id: 'furn-valentines-hearts',
    name: 'Rose Quartz Hanging Hearts',
    category: 'decoration',
    shopCategory: 'seasonal',
    collection: 'valentines',
    price: 85,
    placement: 'wall',
    size: 'small',
    icon: '💕',
    renderType: 'quartz_hearts',
    description:
      'Polished rose quartz heart pendants suspended from fine silk ribbon catching afternoon light.',
    unlocked: false,
    unlockCondition: '85 LearningCoins',
    unlockSource: 'milestone',
    defaultScale: 0.95,
    isResizable: true,
    isRotatable: false,
    interactive: false
  },

  // ==========================================
  // 🏆 ACHIEVEMENT & MILESTONE REWARDS (FREE BY LEARNING)
  // ==========================================
  {
    id: 'reward-readers-chair',
    name: 'The Reader’s Grand Chair',
    category: 'furniture',
    shopCategory: 'rewards',
    collection: 'achievements',
    price: 0,
    placement: 'floor',
    size: 'large',
    icon: '📖',
    renderType: 'readers_chair',
    description:
      'An illustrious royal blue velvet library armchair with brass studs, unlocked only by dedicated reading adventures.',
    unlocked: false,
    unlockCondition: 'Read 30+ cumulative minutes in real books',
    unlockSource: 'reading',
    defaultScale: 1.35,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['sit', 'read'],
    interactiveType: 'reading_corner',
    interactiveData: {
      title: "Reader's Armchair",
      description: 'Open your reading companion timer and track your real book!',
      targetSection: 'reading_adventure'
    }
  },
  {
    id: 'reward-knowledge-lamp',
    name: 'Knowledge Beacon Lamp',
    category: 'furniture',
    shopCategory: 'rewards',
    collection: 'achievements',
    price: 0,
    placement: 'surface',
    size: 'medium',
    icon: '🧠',
    renderType: 'knowledge_lamp',
    description:
      'Glows with a dazzling golden aura earned by mastering 10 vocabulary words in your learning journey.',
    unlocked: false,
    unlockCondition: 'Master 10 vocabulary words',
    unlockSource: 'word_mastery',
    defaultScale: 1.1,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['turnOn', 'turnOff']
  },
  {
    id: 'reward-master-speller-trophy',
    name: 'Master Speller Golden Trophy',
    category: 'decoration',
    shopCategory: 'rewards',
    collection: 'achievements',
    price: 0,
    placement: 'surface',
    size: 'small',
    icon: '✏️',
    renderType: 'speller_trophy',
    description:
      'Pure polished gold cup trophy celebrating 100% precision in independent spelling tests.',
    unlocked: false,
    unlockCondition: 'Score 100% on a True Spelling Test',
    unlockSource: 'spelling',
    defaultScale: 0.95,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['relax']
  },
  {
    id: 'reward-faith-garden-decor',
    name: 'Grace Stone Fountain',
    category: 'furniture',
    shopCategory: 'rewards',
    collection: 'faith',
    price: 0,
    placement: 'floor',
    size: 'large',
    icon: '🙏',
    renderType: 'faith_fountain',
    description:
      'Carved river stone fountain with trickling peaceful water earned through Bible vocabulary milestones.',
    unlocked: false,
    unlockCondition: 'Master the Bible word "Shalom" or "Grace"',
    unlockSource: 'milestone',
    defaultScale: 1.3,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['waterPlant', 'relax']
  },
  {
    id: 'reward-shalom-dove',
    name: 'Shalom Peace Dove Statue',
    category: 'decoration',
    shopCategory: 'rewards',
    collection: 'faith',
    price: 0,
    placement: 'surface',
    size: 'small',
    icon: '🕊️',
    renderType: 'peace_dove',
    description:
      'Smooth carved white Carrara marble dove bringing serene harmony and kindness into your home.',
    unlocked: false,
    unlockCondition: 'Practice 3 Bible words',
    unlockSource: 'milestone',
    associatedWord: 'Shalom',
    defaultScale: 0.9,
    isResizable: true,
    isRotatable: true,
    interactive: false
  }
];

export const getShopItemById = (id: string): HomeItem | undefined => {
  return SHOP_CATALOG_ITEMS.find((item) => item.id === id);
};

export const getItemsByCategory = (category: ShopCategory): HomeItem[] => {
  if (category === 'basic') {
    return SHOP_CATALOG_ITEMS.filter((item) => item.collection === 'basic');
  }
  return SHOP_CATALOG_ITEMS.filter((item) => item.shopCategory === category);
};

export const getItemsByCollection = (collection: FurnitureCollection): HomeItem[] => {
  return SHOP_CATALOG_ITEMS.filter((item) => item.collection === collection);
};

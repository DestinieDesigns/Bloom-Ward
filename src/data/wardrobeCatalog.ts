import { WardrobeItem, WardrobeCategory, SavedOutfit, CharacterCustomization } from '../types';

export const WARDROBE_ITEMS: WardrobeItem[] = [
  // =========================================================================
  // 👕 TOPS
  // =========================================================================
  {
    id: 'top-cozy-rose-sweater',
    name: 'Rosewater Knit Sweater',
    category: 'tops',
    collection: 'cozy',
    icon: '🧶',
    color: '#EFB6BD',
    secondaryColor: '#FFFDF9',
    renderKey: 'knit_sweater',
    description: 'A delightfully warm hand-knitted pastel rose sweater.',
    unlocked: true,
    unlockRequirement: 'Starter wardrobe piece',
    rewardType: 'starter'
  },
  {
    id: 'top-sage-cardigan',
    name: 'Sage Button Cardigan',
    category: 'tops',
    collection: 'nature',
    icon: '🌿',
    color: '#8FA58B',
    secondaryColor: '#5C7458',
    renderKey: 'cardigan',
    description: 'Earthy botanical green cardigan with cute horn buttons.',
    unlocked: true,
    unlockRequirement: 'Starter wardrobe piece',
    rewardType: 'starter'
  },
  {
    id: 'top-bookworm-hoodie',
    name: 'Bookworm Cloud Hoodie',
    category: 'tops',
    collection: 'cozy',
    icon: '🧥',
    color: '#8FA2B8',
    secondaryColor: '#E2E8F0',
    renderKey: 'hoodie',
    description: 'An oversized comfortable hoodie for long reading sessions.',
    unlocked: false,
    unlockRequirement: 'Read for 30 total minutes',
    price: 40,
    rewardType: 'reading_days'
  },
  {
    id: 'top-scholar-blazer',
    name: 'Academy Scholar Blazer',
    category: 'tops',
    collection: 'scholar',
    icon: '🎓',
    color: '#1E293B',
    secondaryColor: '#D97706',
    renderKey: 'blazer',
    description: 'Crisp navy blazer with gold crest and stitched lapels.',
    unlocked: false,
    unlockRequirement: 'Master 20 vocabulary words',
    price: 60,
    rewardType: 'words_mastered'
  },
  {
    id: 'top-striped-casual-tee',
    name: 'Breton Striped Tee',
    category: 'tops',
    collection: 'everyday',
    icon: '👕',
    color: '#FAF5EF',
    secondaryColor: '#1E3A8A',
    renderKey: 'striped_tee',
    description: 'Classic nautical cotton t-shirt with navy stripes.',
    unlocked: true,
    unlockRequirement: 'Starter wardrobe piece',
    rewardType: 'starter'
  },
  {
    id: 'top-warm-timber-turtleneck',
    name: 'Timber Cable Turtleneck',
    category: 'tops',
    collection: 'cottage',
    icon: '☕',
    color: '#B88963',
    secondaryColor: '#8C5E3C',
    renderKey: 'turtleneck',
    description: 'Cozy honey-brown ribbed turtleneck for rainy afternoons.',
    unlocked: true,
    unlockRequirement: 'Starter wardrobe piece',
    rewardType: 'starter'
  },
  {
    id: 'top-sunny-yellow-tshirt',
    name: 'Sunshine Graphic Tee',
    category: 'tops',
    collection: 'everyday',
    icon: '☀️',
    color: '#FBBF24',
    secondaryColor: '#B45309',
    renderKey: 'graphic_tee',
    description: 'Cheerful golden t-shirt with a smiling embroidered sun.',
    unlocked: true,
    unlockRequirement: 'Starter wardrobe piece',
    rewardType: 'starter'
  },
  {
    id: 'top-cottage-linen-blouse',
    name: 'Cottage Ruffle Blouse',
    category: 'tops',
    collection: 'cottage',
    icon: '🌸',
    color: '#FFFDF9',
    secondaryColor: '#F472B6',
    renderKey: 'ruffle_blouse',
    description: 'Breezy cream linen blouse with delicate ruffled collar.',
    unlocked: false,
    unlockRequirement: 'Complete 3 Faith / Scripture words',
    price: 50,
    rewardType: 'bible_learning'
  },
  {
    id: 'top-sport-track-jacket',
    name: 'Varsity Track Jacket',
    category: 'tops',
    collection: 'sporty',
    icon: '🏃',
    color: '#059669',
    secondaryColor: '#FFFFFF',
    renderKey: 'track_jacket',
    description: 'Retro green and white zip-up sporty adventure jacket.',
    unlocked: false,
    unlockRequirement: 'Complete a 5-day learning streak',
    price: 50,
    rewardType: 'streak'
  },

  // =========================================================================
  // 👖 BOTTOMS
  // =========================================================================
  {
    id: 'bot-classic-denim-jeans',
    name: 'Classic Denim Jeans',
    category: 'bottoms',
    collection: 'everyday',
    icon: '👖',
    color: '#2563EB',
    secondaryColor: '#1D4ED8',
    renderKey: 'jeans',
    description: 'Durable everyday indigo jeans with rolled cuffs.',
    unlocked: true,
    unlockRequirement: 'Starter wardrobe piece',
    rewardType: 'starter'
  },
  {
    id: 'bot-cozy-knit-joggers',
    name: 'Cloud Fleece Joggers',
    category: 'bottoms',
    collection: 'cozy',
    icon: '☁️',
    color: '#64748B',
    secondaryColor: '#475569',
    renderKey: 'joggers',
    description: 'Ultra-soft heather gray joggers with a comfy drawstring.',
    unlocked: true,
    unlockRequirement: 'Starter wardrobe piece',
    rewardType: 'starter'
  },
  {
    id: 'bot-scholar-pleated-skirt',
    name: 'Pleated Scholar Skirt',
    category: 'bottoms',
    collection: 'scholar',
    icon: '👗',
    color: '#1E293B',
    secondaryColor: '#475569',
    renderKey: 'pleated_skirt',
    description: 'Crisp uniform pleated skirt in rich midnight navy.',
    unlocked: false,
    unlockRequirement: 'Master 15 vocabulary words',
    price: 45,
    rewardType: 'words_mastered'
  },
  {
    id: 'bot-flowy-wide-leg-cream',
    name: 'Linen Wide-Leg Pants',
    category: 'bottoms',
    collection: 'cottage',
    icon: '🌾',
    color: '#F5EBE1',
    secondaryColor: '#D7C4B0',
    renderKey: 'wide_pants',
    description: 'Flowy, breathable linen trousers perfect for lounging.',
    unlocked: true,
    unlockRequirement: 'Starter wardrobe piece',
    rewardType: 'starter'
  },
  {
    id: 'bot-corduroy-pants-tan',
    name: 'Warm Corduroy Trousers',
    category: 'bottoms',
    collection: 'cozy',
    icon: '🍂',
    color: '#92400E',
    secondaryColor: '#78350F',
    renderKey: 'corduroy',
    description: 'Textured warm amber corduroy pants with deep pockets.',
    unlocked: false,
    unlockRequirement: 'Unlock with 35 coins',
    price: 35,
    rewardType: 'coins'
  },
  {
    id: 'bot-cottage-floral-skirt',
    name: 'Wildflower Tiered Skirt',
    category: 'bottoms',
    collection: 'cottage',
    icon: '🌺',
    color: '#FDA4AF',
    secondaryColor: '#BE123C',
    renderKey: 'floral_skirt',
    description: 'Whimsical twirling skirt printed with tiny pink petals.',
    unlocked: false,
    unlockRequirement: 'Complete 3 Reading Adventure chapters',
    price: 45,
    rewardType: 'reading_days'
  },
  {
    id: 'bot-sport-shorts-navy',
    name: 'Athletic Runner Shorts',
    category: 'bottoms',
    collection: 'sporty',
    icon: '🩳',
    color: '#1E3A8A',
    secondaryColor: '#3B82F6',
    renderKey: 'shorts',
    description: 'Lightweight breathable navy shorts with white side piping.',
    unlocked: true,
    unlockRequirement: 'Starter wardrobe piece',
    rewardType: 'starter'
  },

  // =========================================================================
  // 👗 DRESSES
  // =========================================================================
  {
    id: 'dress-meadow-cottage',
    name: 'Meadow Floral Prairie Dress',
    category: 'dresses',
    collection: 'cottage',
    icon: '🌼',
    color: '#FEF08A',
    secondaryColor: '#F59E0B',
    renderKey: 'prairie_dress',
    description: 'Charming meadow dress with puffed sleeves and floral apron.',
    unlocked: false,
    unlockRequirement: 'Master 10 words in Knowledge Garden',
    price: 65,
    rewardType: 'words_mastered'
  },
  {
    id: 'dress-cozy-knit-sweater',
    name: 'Oatmeal Sweater Dress',
    category: 'dresses',
    collection: 'cozy',
    icon: '🧶',
    color: '#E6D5C3',
    secondaryColor: '#9C7A5B',
    renderKey: 'sweater_dress',
    description: 'Warm, chic oversized knit dress with ribbed cuffs.',
    unlocked: false,
    unlockRequirement: 'Read for 45 total minutes',
    price: 55,
    rewardType: 'reading_days'
  },
  {
    id: 'dress-faith-white-linen',
    name: 'Graceful White Linen Dress',
    category: 'dresses',
    collection: 'faith',
    icon: '🕊️',
    color: '#FFFDF9',
    secondaryColor: '#E2E8F0',
    renderKey: 'linen_dress',
    description: 'Pure, peaceful white linen dress with gentle lace trim.',
    unlocked: false,
    unlockRequirement: 'Complete 5 Bible vocabulary words',
    price: 70,
    rewardType: 'bible_learning'
  },

  // =========================================================================
  // 🌙 SLEEPWEAR
  // =========================================================================
  {
    id: 'sleep-cloud-star-pajamas',
    name: 'Cloud & Star Pajama Set',
    category: 'sleepwear',
    collection: 'sleepy',
    icon: '⭐',
    color: '#BAE6FD',
    secondaryColor: '#0284C7',
    renderKey: 'star_pjs',
    description: 'Dreamy baby blue pajama top and bottoms dotted with stars.',
    unlocked: true,
    unlockRequirement: 'Starter sleepwear piece',
    rewardType: 'starter'
  },
  {
    id: 'sleep-rose-flannel-set',
    name: 'Rosewater Flannel Pajamas',
    category: 'sleepwear',
    collection: 'sleepy',
    icon: '🛌',
    color: '#FBCFE8',
    secondaryColor: '#DB2777',
    renderKey: 'flannel_pjs',
    description: 'Classic button-up soft pink plaid pajama set.',
    unlocked: false,
    unlockRequirement: 'Unlock with 30 coins',
    price: 30,
    rewardType: 'coins'
  },
  {
    id: 'sleep-silky-night-robe',
    name: 'Twilight Lavender Robe',
    category: 'sleepwear',
    collection: 'sleepy',
    icon: '👘',
    color: '#DDD6FE',
    secondaryColor: '#7C3AED',
    renderKey: 'robe',
    description: 'Silky, plush wrap robe with a satin sash and warm pockets.',
    unlocked: false,
    unlockRequirement: 'Sleep 3 times in your cozy bed',
    price: 45,
    rewardType: 'achievement'
  },

  // =========================================================================
  // 👟 SHOES
  // =========================================================================
  {
    id: 'shoe-classic-white-sneakers',
    name: 'White Court Sneakers',
    category: 'shoes',
    collection: 'everyday',
    icon: '👟',
    color: '#FFFFFF',
    secondaryColor: '#CBD5E1',
    renderKey: 'sneakers',
    description: 'Crisp, clean low-top sneakers that go with everything.',
    unlocked: true,
    unlockRequirement: 'Starter wardrobe piece',
    rewardType: 'starter'
  },
  {
    id: 'shoe-brown-oxfords',
    name: 'Leather Oxford Brogues',
    category: 'shoes',
    collection: 'scholar',
    icon: '👞',
    color: '#875837',
    secondaryColor: '#503728',
    renderKey: 'oxfords',
    description: 'Polished caramel-brown lace-up leather shoes.',
    unlocked: true,
    unlockRequirement: 'Starter wardrobe piece',
    rewardType: 'starter'
  },
  {
    id: 'shoe-cozy-bunny-slippers',
    name: 'Fluffy Bunny Slippers',
    category: 'shoes',
    collection: 'sleepy',
    icon: '🐰',
    color: '#FCE7F3',
    secondaryColor: '#F43F5E',
    renderKey: 'bunny_slippers',
    description: 'Plush pink slippers with perky bunny ears and pom-pom tails.',
    unlocked: false,
    unlockRequirement: 'Unlock with 25 coins',
    price: 25,
    rewardType: 'coins'
  },
  {
    id: 'shoe-yellow-rain-boots',
    name: 'Puddle Patter Rain Boots',
    category: 'shoes',
    collection: 'nature',
    icon: '🥾',
    color: '#FBBF24',
    secondaryColor: '#D97706',
    renderKey: 'rain_boots',
    description: 'Glossy canary-yellow rubber boots ready for splashing.',
    unlocked: false,
    unlockRequirement: 'Unlock with 30 coins',
    price: 30,
    rewardType: 'coins'
  },
  {
    id: 'shoe-strappy-sandals-tan',
    name: 'Sunny Strappy Sandals',
    category: 'shoes',
    collection: 'cottage',
    icon: '👡',
    color: '#D4A373',
    secondaryColor: '#A98467',
    renderKey: 'sandals',
    description: 'Braided tan leather sandals for warm breezy days.',
    unlocked: true,
    unlockRequirement: 'Starter wardrobe piece',
    rewardType: 'starter'
  },

  // =========================================================================
  // 👓 EYEWEAR & ACCESSORIES
  // =========================================================================
  {
    id: 'acc-reading-glasses',
    name: 'Tortoiseshell Reading Glasses',
    category: 'eyewear',
    collection: 'scholar',
    icon: '👓',
    color: '#B45309',
    secondaryColor: '#78350F',
    renderKey: 'reading_glasses',
    description: 'Warm amber framed glasses that make every page feel cozy.',
    unlocked: true,
    unlockRequirement: 'Starter accessory',
    rewardType: 'starter'
  },
  {
    id: 'acc-wire-round-glasses',
    name: 'Vintage Gold Wire Glasses',
    category: 'eyewear',
    collection: 'scholar',
    icon: '🧐',
    color: '#F59E0B',
    secondaryColor: '#D97706',
    renderKey: 'wire_glasses',
    description: 'Delicate round wire-frame spectacles with a scholar vibe.',
    unlocked: false,
    unlockRequirement: 'Master 10 vocabulary words',
    price: 35,
    rewardType: 'words_mastered'
  },
  {
    id: 'acc-blossom-hair-clip',
    name: 'Cherry Blossom Clip',
    category: 'accessories',
    collection: 'nature',
    icon: '🌸',
    color: '#F472B6',
    secondaryColor: '#FDE047',
    renderKey: 'blossom_clip',
    description: 'A delicate pink blooming blossom to wear in your hair.',
    unlocked: true,
    unlockRequirement: 'Starter accessory',
    rewardType: 'starter'
  },
  {
    id: 'acc-scholar-beret',
    name: 'Crimson Artist Beret',
    category: 'headwear',
    collection: 'scholar',
    icon: '🎨',
    color: '#991B1B',
    secondaryColor: '#7F1D1D',
    renderKey: 'beret',
    description: 'A stylish tilted wool beret for thoughtful writers.',
    unlocked: false,
    unlockRequirement: 'Unlock with 30 coins',
    price: 30,
    rewardType: 'coins'
  },
  {
    id: 'acc-cozy-knit-beanie',
    name: 'Mustard Waffle Beanie',
    category: 'headwear',
    collection: 'cozy',
    icon: '🧶',
    color: '#D97706',
    secondaryColor: '#92400E',
    renderKey: 'beanie',
    description: 'Warm cuffed ribbed beanie with a cute fluffy pom-pom.',
    unlocked: false,
    unlockRequirement: 'Unlock with 25 coins',
    price: 25,
    rewardType: 'coins'
  },
  {
    id: 'acc-ribbon-hair-bow',
    name: 'Rosewater Satin Bow',
    category: 'headwear',
    collection: 'cottage',
    icon: '🎀',
    color: '#FB7185',
    secondaryColor: '#E11D48',
    renderKey: 'hair_bow',
    description: 'A wide satin ribbon tied into an elegant hair bow.',
    unlocked: true,
    unlockRequirement: 'Starter accessory',
    rewardType: 'starter'
  },
  {
    id: 'acc-studio-headphones',
    name: 'Pastel Audio Headphones',
    category: 'accessories',
    collection: 'creative',
    icon: '🎧',
    color: '#34D399',
    secondaryColor: '#059669',
    renderKey: 'headphones',
    description: 'Padded mint headphones for focused study and music.',
    unlocked: false,
    unlockRequirement: 'Complete 3 spelling tests with 100%',
    price: 50,
    rewardType: 'achievement'
  },
  {
    id: 'acc-leather-satchel',
    name: 'Brown Leather Satchel',
    category: 'accessories',
    collection: 'scholar',
    icon: '🎒',
    color: '#78350F',
    secondaryColor: '#D97706',
    renderKey: 'satchel',
    description: 'Sturdy buckle school satchel filled with notebooks.',
    unlocked: false,
    unlockRequirement: 'Unlock with 40 coins',
    price: 40,
    rewardType: 'coins'
  },
  {
    id: 'acc-faith-cross-locket',
    name: 'Golden Grace Heart Locket',
    category: 'accessories',
    collection: 'faith',
    icon: '💛',
    color: '#FBBF24',
    secondaryColor: '#D97706',
    renderKey: 'locket',
    description: 'A gleaming gold heart locket reminding you of grace.',
    unlocked: false,
    unlockRequirement: 'Complete 4 Scripture word reflections',
    price: 45,
    rewardType: 'bible_learning'
  },

  // =========================================================================
  // 💇 HAIR STYLES
  // =========================================================================
  {
    id: 'hair-cozy-bun',
    name: 'Cozy Top Bun',
    category: 'hair',
    collection: 'everyday',
    icon: '👱‍♀️',
    renderKey: 'cozy_bun',
    description: 'A high sweet topknot bun with gentle face-framing strands.',
    unlocked: true,
    unlockRequirement: 'Starter hair style',
    rewardType: 'starter'
  },
  {
    id: 'hair-ponytail',
    name: 'High Swish Ponytail',
    category: 'hair',
    collection: 'sporty',
    icon: '🐴',
    renderKey: 'ponytail',
    description: 'A perky, high ponytail that bounces as you walk.',
    unlocked: true,
    unlockRequirement: 'Starter hair style',
    rewardType: 'starter'
  },
  {
    id: 'hair-braids',
    name: 'Twin Box Braids',
    category: 'hair',
    collection: 'cottage',
    icon: '👧',
    renderKey: 'braids',
    description: 'Neatly woven twin plaited braids resting on your shoulders.',
    unlocked: true,
    unlockRequirement: 'Starter hair style',
    rewardType: 'starter'
  },
  {
    id: 'hair-curls',
    name: 'Voluminous Ringlet Curls',
    category: 'hair',
    collection: 'creative',
    icon: '👩‍🦱',
    renderKey: 'curls',
    description: 'Full, bouncy spiral ringlet curls rich in volume.',
    unlocked: true,
    unlockRequirement: 'Starter hair style',
    rewardType: 'starter'
  },
  {
    id: 'hair-locs',
    name: 'Beaded Royal Locs',
    category: 'hair',
    collection: 'creative',
    icon: '✨',
    renderKey: 'locs',
    description: 'Gorgeous cascading locs adorned with tiny golden beads.',
    unlocked: true,
    unlockRequirement: 'Starter hair style',
    rewardType: 'starter'
  },
  {
    id: 'hair-afro-puffs',
    name: 'Joyful Afro Puffs',
    category: 'hair',
    collection: 'creative',
    icon: '🎀',
    renderKey: 'afro_puffs',
    description: 'Twin rounded puff buns full of texture and spirit.',
    unlocked: true,
    unlockRequirement: 'Starter hair style',
    rewardType: 'starter'
  },
  {
    id: 'hair-short-waves',
    name: 'Clean Tapered Waves',
    category: 'hair',
    collection: 'everyday',
    icon: '🧑',
    renderKey: 'short_waves',
    description: 'Tidy, modern short cropped waves with clean sides.',
    unlocked: true,
    unlockRequirement: 'Starter hair style',
    rewardType: 'starter'
  },
  {
    id: 'hair-modern-bob',
    name: 'Chin-Length French Bob',
    category: 'hair',
    collection: 'modern',
    icon: '💇‍♀️',
    renderKey: 'modern_bob',
    description: 'Sleek, chin-grazing bob haircut with straight bangs.',
    unlocked: true,
    unlockRequirement: 'Starter hair style',
    rewardType: 'starter'
  },
  {
    id: 'hair-side-braid',
    name: 'Loose Fishtail Side Braid',
    category: 'hair',
    collection: 'cottage',
    icon: '🌾',
    renderKey: 'side_braid',
    description: 'A romantic loose fishtail braid draped over one shoulder.',
    unlocked: false,
    unlockRequirement: 'Unlock with 30 coins',
    price: 30,
    rewardType: 'coins'
  }
];

export const HAIR_COLORS = [
  { id: '#2E241E', label: 'Midnight Black' },
  { id: '#4A3525', label: 'Chestnut Brunette' },
  { id: '#78350F', label: 'Warm Caramel' },
  { id: '#8F3B20', label: 'Spiced Auburn' },
  { id: '#D4A359', label: 'Golden Honey' },
  { id: '#FDE047', label: 'Sunflower Blonde' },
  { id: '#94A3B8', label: 'Silver Mist' },
  { id: '#7C3AED', label: 'Twilight Violet' },
  { id: '#EC4899', label: 'Rose Quartz' }
];

export const SKIN_TONES = [
  { id: '#FDDFCA', label: 'Porcelain Peach' },
  { id: '#F5CBA7', label: 'Honey Almond' },
  { id: '#D89762', label: 'Warm Tan' },
  { id: '#B46D3E', label: 'Rich Chestnut' },
  { id: '#844E26', label: 'Deep Amber' },
  { id: '#5E3B20', label: 'Velvet Espresso' }
];

export const PRESET_OUTFITS: SavedOutfit[] = [
  {
    id: 'outfit-everyday-cozy',
    name: 'Everyday Cozy',
    icon: '🧶',
    customization: {
      skinTone: '#F5CBA7',
      hairStyle: 'hair-cozy-bun',
      hairColor: '#4A3525',
      topId: 'top-cozy-rose-sweater',
      bottomId: 'bot-classic-denim-jeans',
      shoesId: 'shoe-classic-white-sneakers',
      accessoryId: 'acc-blossom-hair-clip',
      eyewearId: 'acc-reading-glasses',
      expression: 'happy'
    }
  },
  {
    id: 'outfit-young-scholar',
    name: 'Young Scholar',
    icon: '🎓',
    customization: {
      skinTone: '#F5CBA7',
      hairStyle: 'hair-modern-bob',
      hairColor: '#2E241E',
      topId: 'top-scholar-blazer',
      bottomId: 'bot-scholar-pleated-skirt',
      shoesId: 'shoe-brown-oxfords',
      headwearId: 'acc-scholar-beret',
      eyewearId: 'acc-wire-round-glasses',
      accessoryId: 'acc-leather-satchel',
      expression: 'proud'
    }
  },
  {
    id: 'outfit-sweet-dreams',
    name: 'Sweet Dreams PJs',
    icon: '⭐',
    customization: {
      skinTone: '#F5CBA7',
      hairStyle: 'hair-curls',
      hairColor: '#78350F',
      sleepwearId: 'sleep-cloud-star-pajamas',
      shoesId: 'shoe-cozy-bunny-slippers',
      expression: 'sleepy'
    }
  },
  {
    id: 'outfit-meadow-cottage',
    name: 'Cottage Bloom',
    icon: '🌸',
    customization: {
      skinTone: '#F5CBA7',
      hairStyle: 'hair-braids',
      hairColor: '#8F3B20',
      dressId: 'dress-meadow-cottage',
      shoesId: 'shoe-strappy-sandals-tan',
      headwearId: 'acc-ribbon-hair-bow',
      expression: 'happy'
    }
  },
  {
    id: 'outfit-faith-grace',
    name: 'Graceful Sunday',
    icon: '🕊️',
    customization: {
      skinTone: '#F5CBA7',
      hairStyle: 'hair-locs',
      hairColor: '#2E241E',
      dressId: 'dress-faith-white-linen',
      shoesId: 'shoe-strappy-sandals-tan',
      accessoryId: 'acc-faith-cross-locket',
      expression: 'calm'
    }
  },
  {
    id: 'outfit-sporty-active',
    name: 'Park Runner',
    icon: '🏃',
    customization: {
      skinTone: '#F5CBA7',
      hairStyle: 'hair-ponytail',
      hairColor: '#D4A359',
      topId: 'top-sport-track-jacket',
      bottomId: 'bot-sport-shorts-navy',
      shoesId: 'shoe-classic-white-sneakers',
      accessoryId: 'acc-studio-headphones',
      expression: 'happy'
    }
  }
];

export function getWardrobeItemById(id?: string): WardrobeItem | undefined {
  if (!id) return undefined;
  return WARDROBE_ITEMS.find((item) => item.id === id);
}

export function getWardrobeItemsByCategory(category: WardrobeCategory): WardrobeItem[] {
  return WARDROBE_ITEMS.filter((item) => item.category === category);
}

export function getWardrobeItemsByCollection(collection: string): WardrobeItem[] {
  return WARDROBE_ITEMS.filter((item) => item.collection === collection);
}

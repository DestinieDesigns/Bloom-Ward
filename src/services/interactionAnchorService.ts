import { FurnitureActionType, FurnitureInteractionAnchor, HomeItem } from '../types';

/**
 * Derives the exact object interaction anchor for any furniture/home item and action.
 * This ensures the character walks to the exact physical anchor and enters the correct pose.
 */
export function getFurnitureInteractionAnchor(
  item: HomeItem,
  action: FurnitureActionType
): FurnitureInteractionAnchor {
  const id = item.id.toLowerCase();
  const name = item.name.toLowerCase();
  const renderKey = (item.renderType || item.id).toLowerCase();

  // 1. 🛏️ BED ANCHORS (Sleeping, Sitting, Bedmaking)
  if (id.includes('bed') || name.includes('bed') || renderKey.includes('bed')) {
    if (action === 'sleep') {
      return {
        action: 'sleep',
        offsetX: 0,
        offsetY: -3,
        pose: 'sleeping',
        facing: 'right',
        zIndexOffset: 1,
        embedInBed: true
      };
    }
    if (action === 'sit') {
      return {
        action: 'sit',
        offsetX: 0,
        offsetY: 2,
        pose: 'sitting',
        facing: 'right',
        zIndexOffset: 2
      };
    }
    if (action === 'makeBed' || action === 'messBed') {
      return {
        action,
        offsetX: -18,
        offsetY: 4,
        pose: 'watering',
        facing: 'right',
        zIndexOffset: 2
      };
    }
  }

  // 2. 🪑 CHAIRS & READING CHAIRS
  if (
    id.includes('chair') ||
    name.includes('chair') ||
    id.includes('armchair') ||
    name.includes('armchair') ||
    id.includes('seat')
  ) {
    if (action === 'read') {
      return {
        action: 'read',
        offsetX: 0,
        offsetY: -3,
        pose: 'reading',
        facing: 'right',
        zIndexOffset: 2
      };
    }
    return {
      action: 'sit',
      offsetX: 0,
      offsetY: -3,
      pose: 'sitting',
      facing: 'right',
      zIndexOffset: 2
    };
  }

  // 3. 🛋️ SOFAS & COUCHES
  if (id.includes('sofa') || name.includes('sofa') || id.includes('couch')) {
    return {
      action: action === 'relax' ? 'relax' : 'sit',
      offsetX: 0,
      offsetY: -2,
      pose: action === 'relax' ? 'relaxing' : 'sitting',
      facing: 'right',
      zIndexOffset: 2
    };
  }

  // 4. 📝 DESKS & STUDY TABLES
  if (id.includes('desk') || name.includes('desk') || id.includes('study_table')) {
    if (action === 'write') {
      return {
        action: 'write',
        offsetX: -2,
        offsetY: -2,
        pose: 'writing',
        facing: 'right',
        zIndexOffset: 2
      };
    }
    return {
      action: 'study',
      offsetX: -2,
      offsetY: -2,
      pose: 'studying',
      facing: 'right',
      zIndexOffset: 2
    };
  }

  // 5. 📚 BOOKSHELVES
  if (id.includes('book') || id.includes('shelf') || name.includes('book')) {
    return {
      action: 'read',
      offsetX: -14,
      offsetY: 6,
      pose: 'reading',
      facing: 'right',
      zIndexOffset: 2
    };
  }

  // 6. 🌿 PLANTS & GARDEN ITEMS
  if (id.includes('plant') || name.includes('plant') || id.includes('flower') || name.includes('flower')) {
    if (action === 'waterPlant') {
      return {
        action: 'waterPlant',
        offsetX: -14,
        offsetY: 3,
        pose: 'watering',
        facing: 'right',
        zIndexOffset: 2
      };
    }
    return {
      action: 'observePlant',
      offsetX: -14,
      offsetY: 5,
      pose: 'celebrating',
      facing: 'right',
      zIndexOffset: 2
    };
  }

  // 7. 💡 LAMPS & LIGHTING
  if (id.includes('lamp') || name.includes('lamp') || id.includes('light')) {
    return {
      action: action === 'turnOff' ? 'turnOff' : 'turnOn',
      offsetX: -12,
      offsetY: 5,
      pose: 'idle',
      facing: 'right',
      zIndexOffset: 2
    };
  }

  // 8. 🪟 WINDOWS
  if (id.includes('window') || name.includes('window')) {
    return {
      action,
      offsetX: 0,
      offsetY: 10,
      pose: 'celebrating',
      facing: 'right',
      zIndexOffset: 2
    };
  }

  // 9. 🗄️ WARDROBE / CLOSET / DRESSER / MIRROR
  if (
    id.includes('dresser') ||
    name.includes('dresser') ||
    id.includes('closet') ||
    name.includes('closet') ||
    id.includes('wardrobe') ||
    name.includes('wardrobe') ||
    id.includes('mirror') ||
    name.includes('mirror')
  ) {
    return {
      action,
      offsetX: -14,
      offsetY: 5,
      pose: 'celebrating',
      facing: 'right',
      zIndexOffset: 2
    };
  }

  // Default fallback anchor (beside the item)
  return {
    action,
    offsetX: -12,
    offsetY: 4,
    pose: 'idle',
    facing: 'right',
    zIndexOffset: 2
  };
}

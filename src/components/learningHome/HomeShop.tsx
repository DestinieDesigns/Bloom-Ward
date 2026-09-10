import React, { useState, useMemo } from 'react';
import {
  HomeItem,
  ShopCategory,
  FurnitureCollection
} from '../../types';
import {
  SHOP_CATALOG_ITEMS,
  STARTER_PACK_ITEM_IDS
} from '../../data/homeShopCatalog';
import { INITIAL_HOME_ITEMS } from '../../data/learningHomeData';
import { MiniatureFurnitureRenderer } from './MiniatureFurnitureRenderer';
import { ItemDetailsModal } from './ItemDetailsModal';
import {
  Coins,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  Lock,
  HelpCircle,
  ShoppingBag,
  ArrowLeft,
  X,
  Plus
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface HomeShopProps {
  userCoins: number;
  unlockedItemIds: string[];
  inventory: Record<string, number>;
  onBuyItem: (item: HomeItem) => void;
  onPlaceItem?: (item: HomeItem) => void;
  onClose?: () => void;
}

type ShopNavLevel = 'top' | 'subcat' | 'items';

interface TopCategory {
  id: 'featured' | 'furniture' | 'decorations' | 'seasonal' | 'rewards';
  name: string;
  icon: string;
  tagline: string;
  badge?: string;
  color: string;
}

const TOP_CATEGORIES: TopCategory[] = [
  {
    id: 'featured',
    name: 'Featured & Starter',
    icon: '✨',
    tagline: 'Curated cozy essentials & starter delights',
    badge: 'Popular',
    color: 'from-amber-500/10 to-orange-500/10 border-amber-200'
  },
  {
    id: 'furniture',
    name: 'Furniture',
    icon: '🏠',
    tagline: 'Beds, comfy sofas, desks & warm lighting',
    color: 'from-amber-500/10 to-stone-500/10 border-amber-200'
  },
  {
    id: 'decorations',
    name: 'Decorations',
    icon: '🌸',
    tagline: 'Botanicals, plushies, wall art & trinkets',
    color: 'from-pink-500/10 to-rose-500/10 border-pink-200'
  },
  {
    id: 'seasonal',
    name: 'Seasonal Collections',
    icon: '🍂',
    tagline: 'Fall harvest, Halloween, winter & spring blooms',
    badge: 'Festive',
    color: 'from-orange-500/10 to-red-500/10 border-orange-200'
  },
  {
    id: 'rewards',
    name: 'Milestone Rewards',
    icon: '🏆',
    tagline: 'Special items unlocked through reading & vocabulary',
    badge: 'Earned',
    color: 'from-yellow-500/10 to-amber-500/10 border-yellow-200'
  }
];

// Subcategories matching user requirements (Section 9)
const FURNITURE_SUBCATS = [
  { id: 'bedroom', name: 'Bedroom', icon: '🛏️', desc: 'Beds, nightstands & dressers' },
  { id: 'living_room', name: 'Living Room', icon: '🛋️', desc: 'Plush sofas, chairs & rugs' },
  { id: 'study', name: 'Study', icon: '📚', desc: 'Bookshelves, desks & story chairs' },
  { id: 'lighting', name: 'Lighting', icon: '💡', desc: 'Warm lamps & evening lanterns' }
];

const DECORATION_SUBCATS = [
  { id: 'plants', name: 'Plants', icon: '🌿', desc: 'Monsteras, snake plants & florals' },
  { id: 'plushies', name: 'Plushies', icon: '🧸', desc: 'Cuddly bears, bunnies & companions' },
  { id: 'wall_decor', name: 'Wall Decor', icon: '🖼️', desc: 'Paintings, prints & hanging art' },
  { id: 'small_decor', name: 'Small Decor', icon: '🕯️', desc: 'Tea sets, candles & desk ornaments' }
];

const SEASONAL_SUBCATS = [
  { id: 'fall', name: 'Fall Harvest', icon: '🍂', desc: 'Pumpkins, warm blankets & amber leaves' },
  { id: 'halloween', name: 'Halloween Spooktacular', icon: '👻', desc: 'Playful pumpkins & friendly bats' },
  { id: 'winter', name: 'Winter Wonderland', icon: '❄️', desc: 'Snow globes, holiday wreaths & cocoa' },
  { id: 'spring', name: 'Spring Blossom', icon: '🌸', desc: 'Cherry petals & fresh garden sunshine' }
];

export const HomeShop: React.FC<HomeShopProps> = ({
  userCoins,
  unlockedItemIds,
  inventory,
  onBuyItem,
  onPlaceItem,
  onClose
}) => {
  // Navigation State
  const [navLevel, setNavLevel] = useState<ShopNavLevel>('top');
  const [selectedTopCat, setSelectedTopCat] = useState<TopCategory['id']>('featured');
  const [selectedSubcat, setSelectedSubcat] = useState<string>('bedroom');

  // Item Browsing Pagination (3 to 5 items per view - Section 10)
  const [currentPage, setCurrentPage] = useState<number>(0);
  const ITEMS_PER_PAGE = 4;

  const [selectedItemForModal, setSelectedItemForModal] = useState<HomeItem | null>(null);
  const [showEarnGuide, setShowEarnGuide] = useState(false);
  const [justPurchasedId, setJustPurchasedId] = useState<string | null>(null);

  const unlockedSet = useMemo(() => new Set(unlockedItemIds), [unlockedItemIds]);

  // Combine shop catalog and initial home items
  const allItems = useMemo(() => {
    const map = new Map<string, HomeItem>();
    [...SHOP_CATALOG_ITEMS, ...INITIAL_HOME_ITEMS].forEach((item) => {
      map.set(item.id, item);
    });
    return Array.from(map.values());
  }, []);

  // Filter items matching current top-category & subcategory
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const id = item.id.toLowerCase();
      const name = item.name.toLowerCase();
      const shopCat = (item.shopCategory || '').toLowerCase();
      const coll = (item.collection || '').toLowerCase();

      // Top: Featured
      if (selectedTopCat === 'featured') {
        return (
          item.isFeatured ||
          coll === 'basic' ||
          STARTER_PACK_ITEM_IDS.includes(item.id) ||
          id.startsWith('furn-starter-')
        );
      }

      // Top: Rewards
      if (selectedTopCat === 'rewards') {
        return (
          shopCat === 'rewards' ||
          item.unlockSource === 'reading' ||
          item.unlockSource === 'vocabulary' ||
          item.unlockSource === 'spelling' ||
          item.unlockSource === 'streak' ||
          item.category === 'special'
        );
      }

      // Top: Furniture
      if (selectedTopCat === 'furniture') {
        if (selectedSubcat === 'bedroom') {
          return shopCat === 'bedroom' || id.includes('bed') || id.includes('nightstand') || id.includes('dresser') || name.includes('bed');
        }
        if (selectedSubcat === 'living_room') {
          return shopCat === 'living_room' || id.includes('sofa') || id.includes('armchair') || id.includes('chair') || id.includes('couch') || id.includes('table') || id.includes('rug') || id.includes('fireplace');
        }
        if (selectedSubcat === 'study') {
          return shopCat === 'reading_study' || id.includes('desk') || id.includes('shelf') || id.includes('book') || name.includes('desk') || name.includes('shelf');
        }
        if (selectedSubcat === 'lighting') {
          return shopCat === 'lighting' || id.includes('lamp') || id.includes('light') || id.includes('lantern') || id.includes('candle') || name.includes('lamp');
        }
      }

      // Top: Decorations
      if (selectedTopCat === 'decorations') {
        if (selectedSubcat === 'plants') {
          return id.includes('plant') || id.includes('monstera') || id.includes('snake') || id.includes('pothos') || id.includes('succulent') || id.includes('fern') || id.includes('flower') || name.includes('plant');
        }
        if (selectedSubcat === 'plushies') {
          return id.includes('plush') || id.includes('bear') || id.includes('bunny') || id.includes('doll') || name.includes('plush');
        }
        if (selectedSubcat === 'wall_decor') {
          return item.placement === 'wall' || id.includes('art') || id.includes('painting') || id.includes('poster') || id.includes('banner') || id.includes('clock') || id.includes('rainbow') || item.category === 'sticker';
        }
        if (selectedSubcat === 'small_decor') {
          return id.includes('tea') || id.includes('cup') || id.includes('vase') || id.includes('candle') || id.includes('crystal') || id.includes('globe') || id.includes('music') || id.includes('trophy');
        }
      }

      // Top: Seasonal
      if (selectedTopCat === 'seasonal') {
        return coll === selectedSubcat || id.includes(selectedSubcat) || (selectedSubcat === 'winter' && coll === 'holiday');
      }

      return false;
    });
  }, [allItems, selectedTopCat, selectedSubcat]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const pagedItems = filteredItems.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  // Quick buy action (supports multiple copies)
  const handleBuy = (item: HomeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const price = item.price ?? 0;
    if (userCoins < price) {
      setSelectedItemForModal(item);
      return;
    }
    sound.playSuccessChime();
    onBuyItem(item);
    setJustPurchasedId(item.id);
    setTimeout(() => setJustPurchasedId(null), 1800);
  };

  // Nav helpers
  const handleSelectTopCat = (catId: TopCategory['id']) => {
    sound.playPop();
    setSelectedTopCat(catId);
    setCurrentPage(0);
    if (catId === 'featured' || catId === 'rewards') {
      setNavLevel('items');
    } else {
      if (catId === 'furniture') setSelectedSubcat('bedroom');
      else if (catId === 'decorations') setSelectedSubcat('plants');
      else if (catId === 'seasonal') setSelectedSubcat('fall');
      setNavLevel('subcat');
    }
  };

  const handleSelectSubcat = (subcatId: string) => {
    sound.playPop();
    setSelectedSubcat(subcatId);
    setCurrentPage(0);
    setNavLevel('items');
  };

  const handleBack = () => {
    sound.playPop();
    if (navLevel === 'items') {
      if (selectedTopCat === 'featured' || selectedTopCat === 'rewards') {
        setNavLevel('top');
      } else {
        setNavLevel('subcat');
      }
    } else if (navLevel === 'subcat') {
      setNavLevel('top');
    }
  };

  const getSubcatsForCurrentTop = () => {
    if (selectedTopCat === 'furniture') return FURNITURE_SUBCATS;
    if (selectedTopCat === 'decorations') return DECORATION_SUBCATS;
    if (selectedTopCat === 'seasonal') return SEASONAL_SUBCATS;
    return [];
  };

  const topCategoryObj = TOP_CATEGORIES.find((c) => c.id === selectedTopCat);
  const currentSubcatObj = getSubcatsForCurrentTop().find((s) => s.id === selectedSubcat);

  return (
    <div id="home-boutique-shop" className="flex flex-col h-full bg-[#FAF8F5] text-stone-800 select-none">
      {/* ========================================================= */}
      {/* 🪙 TOP BAR: Boutique Title, Coin Balance & Close */}
      {/* ========================================================= */}
      <div className="bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-amber-100 flex items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          {navLevel !== 'top' ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-sm">
              🛍️
            </div>
          )}
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-amber-950 flex items-center gap-2">
              <span>Home Boutique</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                Miniature Decor
              </span>
            </h2>
          </div>
        </div>

        {/* Coin Balance & Close */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEarnGuide(!showEarnGuide)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Earn Coins</span>
          </button>

          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-300 px-3.5 py-1.5 rounded-full shadow-2xs">
            <span className="text-base animate-bounce">🪙</span>
            <span className="text-sm font-black text-amber-950">
              {userCoins.toLocaleString()}
            </span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Return to Home"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Earn Guide Accordion Banner */}
      {showEarnGuide && (
        <div className="bg-amber-50/90 border-b border-amber-200 p-4 text-xs text-amber-950 animate-in fade-in">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <span className="font-extrabold text-sm">💡 How to Earn LearningCoins:</span>
            <button
              onClick={() => setShowEarnGuide(false)}
              className="text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-1 text-stone-600 max-w-2xl mx-auto">
            Earn coins naturally as you study: Vocabulary words (+5 learn / +10 master), Flashcard practice (+10), Spelling quizzes (+10 / +25 perfect), and Real Reading (+20 per 15 min)!
          </p>
        </div>
      )}

      {/* ========================================================= */}
      {/* 🧭 MAIN CONTENT ACCORDING TO CURRENT NAV LEVEL */}
      {/* ========================================================= */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-4xl w-full mx-auto">
        {/* ------------------------------------------------------- */}
        {/* SCREEN 1: TOP-LEVEL 5 CATEGORIES (Section 8) */}
        {/* ------------------------------------------------------- */}
        {navLevel === 'top' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center space-y-1 mb-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                Choose a Department
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Tap a collection below to browse cozy miniature furniture & decor.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {TOP_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectTopCat(cat.id)}
                  className={`p-5 rounded-3xl border-2 bg-gradient-to-br ${cat.color} bg-white hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-between text-left group`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xs flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-stone-900 text-base sm:text-lg">
                          {cat.name}
                        </h4>
                        {cat.badge && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            {cat.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {cat.tagline}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-700 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* SCREEN 2: SUBCATEGORIES (Section 9) */}
        {/* ------------------------------------------------------- */}
        {navLevel === 'subcat' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  {topCategoryObj?.name}
                </span>
                <h3 className="text-xl font-extrabold text-stone-900">
                  Select a Room Section
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {getSubcatsForCurrentTop().map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSubcat(sub.id)}
                  className="p-5 rounded-3xl border-2 border-stone-200/80 bg-white hover:border-amber-400 hover:bg-amber-50/40 hover:shadow-md transition-all cursor-pointer flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {sub.icon}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-base">
                        {sub.name}
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {sub.desc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-amber-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* SCREEN 3: ITEM BROWSING (Section 10: 3–5 items at once) */}
        {/* ------------------------------------------------------- */}
        {navLevel === 'items' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Breadcrumb Header & Page Info */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
                <span
                  onClick={() => setNavLevel('top')}
                  className="hover:text-amber-700 cursor-pointer"
                >
                  Boutique
                </span>
                <span>/</span>
                <span
                  onClick={() => {
                    if (selectedTopCat !== 'featured' && selectedTopCat !== 'rewards') {
                      setNavLevel('subcat');
                    }
                  }}
                  className="hover:text-amber-700 cursor-pointer"
                >
                  {topCategoryObj?.name}
                </span>
                {currentSubcatObj && (
                  <>
                    <span>/</span>
                    <span className="text-amber-900">{currentSubcatObj.name}</span>
                  </>
                )}
              </div>

              {/* Page Counter */}
              <div className="text-xs font-bold text-stone-500">
                Page {currentPage + 1} of {totalPages} ({filteredItems.length} total)
              </div>
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                <span className="text-4xl block mb-2">📦</span>
                <h4 className="font-bold text-stone-700">No items found in this section</h4>
                <p className="text-xs mt-1">Check back soon for upcoming collections!</p>
              </div>
            ) : (
              <>
                {/* 3–5 Items Grid Layout (Section 10) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pagedItems.map((item) => {
                    const count = inventory[item.id] || 0;
                    const price = item.price ?? 0;
                    const canAfford = userCoins >= price;
                    const isPurchased = justPurchasedId === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItemForModal(item)}
                        className="bg-white rounded-3xl p-4 border-2 border-stone-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        {/* Top: Vector illustration & badges */}
                        <div>
                          <div className="flex items-start justify-between">
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
                              {item.category.toUpperCase()}
                            </span>
                            {count > 0 && (
                              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/70 flex items-center gap-1 shadow-2xs">
                                <span>🎒 × {count}</span>
                              </span>
                            )}
                          </div>

                          {/* Miniature Vector Renderer */}
                          <div className="py-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <MiniatureFurnitureRenderer item={item} size="md" />
                          </div>

                          <h4 className="font-extrabold text-stone-900 text-base leading-snug">
                            {item.name}
                          </h4>
                          <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        </div>

                        {/* Bottom Action / Price Bar */}
                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {price === 0 ? (
                              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                                Free Starter
                              </span>
                            ) : (
                              <div className="flex items-center gap-1 font-black text-amber-950 text-sm">
                                <span>🪙</span>
                                <span>{price}</span>
                              </div>
                            )}
                          </div>

                          {/* Button state: supports having items AND buying more */}
                          {count > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sound.playSuccessChime();
                                  if (onPlaceItem) onPlaceItem(item);
                                  if (onClose) onClose();
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                                title="Place in current room"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Place</span>
                              </button>
                              {price > 0 && (
                                <button
                                  onClick={(e) => handleBuy(item, e)}
                                  disabled={!canAfford}
                                  className={`px-2.5 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1 transition-all cursor-pointer active:scale-95 ${
                                    canAfford
                                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                  }`}
                                  title="Buy another copy"
                                >
                                  <span>+1</span>
                                </button>
                              )}
                            </div>
                          ) : item.unlockCondition && price === 0 ? (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-xl">
                              🔒 {item.unlockCondition}
                            </span>
                          ) : isPurchased ? (
                            <span className="text-xs font-black text-emerald-600 animate-bounce">
                              Bought! ✨
                            </span>
                          ) : (
                            <button
                              onClick={(e) => handleBuy(item, e)}
                              disabled={!canAfford}
                              className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs ${
                                canAfford
                                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                              }`}
                            >
                              <span>{canAfford ? 'Buy' : 'Need Coins'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls (Section 10) */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={() => {
                        sound.playPop();
                        setCurrentPage((p) => Math.max(0, p - 1));
                      }}
                      disabled={currentPage === 0}
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl font-extrabold text-xs transition-colors cursor-pointer ${
                        currentPage === 0
                          ? 'text-stone-300 cursor-not-allowed'
                          : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    {/* Page Dots */}
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            sound.playPop();
                            setCurrentPage(i);
                          }}
                          className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                            i === currentPage
                              ? 'bg-amber-500 w-5'
                              : 'bg-stone-200 hover:bg-stone-300'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        sound.playPop();
                        setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
                      }}
                      disabled={currentPage >= totalPages - 1}
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl font-extrabold text-xs transition-colors cursor-pointer ${
                        currentPage >= totalPages - 1
                          ? 'text-stone-300 cursor-not-allowed'
                          : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                      }`}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Item Details Inspection Modal */}
      {selectedItemForModal && (
        <ItemDetailsModal
          item={selectedItemForModal}
          isOpen={Boolean(selectedItemForModal)}
          onClose={() => setSelectedItemForModal(null)}
          isUnlocked={unlockedSet.has(selectedItemForModal.id) || selectedItemForModal.unlocked}
          inventoryCount={inventory[selectedItemForModal.id] || 0}
          userCoins={userCoins}
          onBuyItem={(item) => {
            onBuyItem(item);
          }}
          onPlaceItem={(item) => {
            if (onPlaceItem) onPlaceItem(item);
            setSelectedItemForModal(null);
            if (onClose) onClose();
          }}
        />
      )}
    </div>
  );
};

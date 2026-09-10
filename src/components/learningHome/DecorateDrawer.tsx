import React, { useState, useMemo } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Sparkles,
  ShoppingBag,
  Palette
} from 'lucide-react';
import { HomeItem, HomeRoom } from '../../types';
import { INITIAL_HOME_ITEMS, ROOM_THEME_OPTIONS } from '../../data/learningHomeData';
import { MiniatureFurnitureRenderer } from './MiniatureFurnitureRenderer';
import { sound } from '../../utils/audio';

export type DecorateMainTab = 'furniture' | 'decor' | 'room';

interface DecorateDrawerProps {
  isOpen: boolean;
  activeTab: DecorateMainTab;
  onClose: () => void;
  unlockedItemIds: string[];
  inventory: Record<string, number>;
  currentRoom: HomeRoom;
  onPlaceItem: (item: HomeItem) => void;
  onUpdateRoomStyle: (updates: { wallpaperClass?: string; flooringClass?: string; styleTheme?: HomeRoom['styleTheme'] }) => void;
  onOpenShop: () => void;
}

// 🪑 Furniture subcategories (Section 5)
const FURNITURE_SUBCATS = [
  { id: 'bedroom', label: 'Bedroom', icon: '🛏️' },
  { id: 'living_room', label: 'Living Room', icon: '🛋️' },
  { id: 'study', label: 'Study', icon: '📚' },
  { id: 'lighting', label: 'Lighting', icon: '💡' }
];

// 🌸 Decor subcategories (Section 6)
const DECOR_SUBCATS = [
  { id: 'plants', label: 'Plants', icon: '🌿' },
  { id: 'plushies', label: 'Plushies', icon: '🧸' },
  { id: 'wall_decor', label: 'Wall Decor', icon: '🖼️' },
  { id: 'small_decor', label: 'Small Decor', icon: '🕯️' }
];

// 🧱 Room subcategories (Section 7)
const ROOM_SUBCATS = [
  { id: 'floors', label: 'Floors', icon: '🪵' },
  { id: 'walls', label: 'Walls', icon: '🎨' },
  { id: 'windows', label: 'Windows', icon: '🪟' },
  { id: 'doors', label: 'Doors', icon: '🚪' }
];

const FLOOR_OPTIONS = [
  {
    id: 'oak_wood',
    name: 'Natural Oak Hardwood',
    icon: '🪵',
    class: 'bg-gradient-to-t from-amber-100/80 via-stone-100/40 to-transparent border-t-2 border-amber-200/50'
  },
  {
    id: 'honey_parquet',
    name: 'Honey Amber Parquet',
    icon: '🪵',
    class: 'bg-gradient-to-t from-amber-200/80 via-emerald-100/40 to-transparent border-t-2 border-amber-300/50'
  },
  {
    id: 'pink_blossom',
    name: 'Cherry Blossom Flooring',
    icon: '🌸',
    class: 'bg-gradient-to-t from-pink-200/80 via-rose-100/40 to-transparent border-t-2 border-pink-300/50'
  },
  {
    id: 'ocean_tile',
    name: 'Coastal Sea Foam Tile',
    icon: '🌊',
    class: 'bg-gradient-to-t from-teal-200/80 via-cyan-100/40 to-transparent border-t-2 border-teal-300/50'
  },
  {
    id: 'royal_carpet',
    name: 'Velvet Royal Carpet',
    icon: '🏰',
    class: 'bg-gradient-to-t from-purple-200/80 via-indigo-100/40 to-transparent border-t-2 border-purple-300/50'
  }
];

export const DecorateDrawer: React.FC<DecorateDrawerProps> = ({
  isOpen,
  activeTab,
  onClose,
  unlockedItemIds,
  inventory,
  currentRoom,
  onPlaceItem,
  onUpdateRoomStyle,
  onOpenShop
}) => {
  const [selectedSubcat, setSelectedSubcat] = useState<string>(() => {
    if (activeTab === 'furniture') return 'bedroom';
    if (activeTab === 'decor') return 'plants';
    return 'floors';
  });

  // Keep subcat in sync when main tab changes
  React.useEffect(() => {
    if (activeTab === 'furniture') setSelectedSubcat('bedroom');
    else if (activeTab === 'decor') setSelectedSubcat('plants');
    else setSelectedSubcat('floors');
  }, [activeTab]);

  const unlockedSet = useMemo(() => new Set(unlockedItemIds), [unlockedItemIds]);

  // Filter items based on subcategory
  const displayedItems = useMemo(() => {
    if (activeTab === 'room') {
      if (selectedSubcat === 'windows') {
        return INITIAL_HOME_ITEMS.filter((i) => {
          const id = i.id.toLowerCase();
          const name = i.name.toLowerCase();
          return id.includes('window') || name.includes('window') || id.includes('curtain');
        });
      }
      if (selectedSubcat === 'doors') {
        return INITIAL_HOME_ITEMS.filter((i) => {
          const id = i.id.toLowerCase();
          const name = i.name.toLowerCase();
          return id.includes('door') || name.includes('door');
        });
      }
      return [];
    }

    return INITIAL_HOME_ITEMS.filter((item) => {
      const id = item.id.toLowerCase();
      const name = item.name.toLowerCase();
      const shopCat = item.shopCategory || '';

      if (activeTab === 'furniture') {
        if (selectedSubcat === 'bedroom') {
          return shopCat === 'bedroom' || id.includes('bed') || id.includes('dresser') || id.includes('nightstand') || name.includes('bed');
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

      if (activeTab === 'decor') {
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

      return false;
    });
  }, [activeTab, selectedSubcat]);

  if (!isOpen) return null;

  const currentSubcats =
    activeTab === 'furniture'
      ? FURNITURE_SUBCATS
      : activeTab === 'decor'
      ? DECOR_SUBCATS
      : ROOM_SUBCATS;

  const tabTitle =
    activeTab === 'furniture'
      ? '🪑 Furniture'
      : activeTab === 'decor'
      ? '🌸 Decor'
      : '🧱 Room Finishes';

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md rounded-t-3xl border-t-4 border-amber-200 shadow-2xl p-3 sm:p-4 max-w-4xl mx-auto animate-in slide-in-from-bottom-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-stone-900 text-sm sm:text-base">{tabTitle}</span>
          <span className="text-xs text-stone-500 hidden sm:inline">
            Tap an item to place it in your room
          </span>
        </div>
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer transition-colors"
          title="Close drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Subcategory Pills (Progressive Disclosure: exactly 4 simple options) */}
      <div className="flex items-center gap-2 py-2.5 overflow-x-auto no-scrollbar">
        {currentSubcats.map((sub) => {
          const isSelected = selectedSubcat === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => {
                sound.playPop();
                setSelectedSubcat(sub.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap cursor-pointer transition-all active:scale-95 ${
                isSelected
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <span>{sub.icon}</span>
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area: Room Wallpapers / Floors or Item Cards */}
      <div className="pt-2 min-h-[140px]">
        {/* ROOM: FLOORS */}
        {activeTab === 'room' && selectedSubcat === 'floors' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {FLOOR_OPTIONS.map((fl) => {
              const isCurrent = currentRoom.flooringClass === fl.class;
              return (
                <button
                  key={fl.id}
                  onClick={() => {
                    sound.playPop();
                    onUpdateRoomStyle({ flooringClass: fl.class });
                  }}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all active:scale-95 ${
                    isCurrent
                      ? 'border-amber-500 bg-amber-50 shadow-sm'
                      : 'border-stone-200 bg-white hover:border-amber-200'
                  }`}
                >
                  <span className="text-2xl">{fl.icon}</span>
                  <span className="text-xs font-bold text-stone-800 leading-tight">
                    {fl.name}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Active ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ROOM: WALLS */}
        {activeTab === 'room' && selectedSubcat === 'walls' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {ROOM_THEME_OPTIONS.map((theme) => {
              const isCurrent = currentRoom.styleTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    sound.playPop();
                    onUpdateRoomStyle({
                      styleTheme: theme.id,
                      wallpaperClass: theme.wallpaperClass,
                      flooringClass: theme.flooringClass
                    });
                  }}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 ${
                    isCurrent
                      ? 'border-amber-500 bg-amber-50 shadow-sm'
                      : 'border-stone-200 bg-white hover:border-amber-200'
                  }`}
                >
                  <span className="text-2xl">{theme.icon}</span>
                  <span className="text-xs font-bold text-stone-800 leading-tight">
                    {theme.name.replace(/^[^\s]+\s*/, '')}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                      Active ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* FURNITURE & DECOR ITEMS (AND WINDOWS/DOORS) */}
        {(activeTab !== 'room' || selectedSubcat === 'windows' || selectedSubcat === 'doors') && (
          <div>
            {displayedItems.length === 0 ? (
              <div className="text-center py-6 text-stone-400">
                <span className="text-3xl block mb-1">📦</span>
                <p className="text-xs font-semibold">No items in this category yet.</p>
                <button
                  onClick={onOpenShop}
                  className="mt-2 text-xs font-bold text-amber-600 hover:text-amber-700 underline cursor-pointer"
                >
                  Visit the Boutique Shop 🛍️
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                {displayedItems.map((item) => {
                  const count = inventory[item.id] || 0;
                  const isUnlockedOrStarter = unlockedSet.has(item.id) || item.unlocked;

                  return (
                    <div
                      key={item.id}
                      className="shrink-0 w-32 sm:w-36 bg-stone-50 rounded-2xl p-2.5 border border-stone-200 flex flex-col items-center text-center shadow-2xs hover:shadow-sm transition-all"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                        <MiniatureFurnitureRenderer item={item} size="sm" />
                      </div>
                      <span className="text-xs font-bold text-stone-800 truncate w-full mt-1">
                        {item.name}
                      </span>

                      {/* Real Inventory Quantity Badge */}
                      <div className="mt-1 flex items-center justify-center">
                        {count > 0 ? (
                          <span className="text-[11px] font-black text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full">
                            × {count} in backpack
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-stone-400 bg-stone-200/60 px-2 py-0.5 rounded-full">
                            × 0 available
                          </span>
                        )}
                      </div>

                      {count > 0 ? (
                        <button
                          onClick={() => {
                            sound.playSuccessChime();
                            onPlaceItem(item);
                            onClose();
                          }}
                          className="mt-2 w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Place</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            sound.playPop();
                            onOpenShop();
                            onClose();
                          }}
                          className="mt-2 w-full py-1.5 rounded-xl bg-stone-200 hover:bg-amber-100 text-stone-700 hover:text-amber-900 font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          title="Visit Shop to get more copies"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Shop More</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

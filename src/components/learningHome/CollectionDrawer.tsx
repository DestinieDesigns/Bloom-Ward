import React, { useState } from 'react';
import {
  X,
  Plus,
  Lock,
  Search,
  Sparkles,
  Layers,
  Heart,
  HelpCircle,
  ShoppingBag
} from 'lucide-react';
import { HomeItem, ItemCategory, PlacedHomeItem } from '../../types';
import { INITIAL_HOME_ITEMS } from '../../data/learningHomeData';
import { MiniatureFurnitureRenderer } from './MiniatureFurnitureRenderer';
import { sound } from '../../utils/audio';

interface CollectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedItemIds: string[];
  inventory: Record<string, number>;
  placedItems: PlacedHomeItem[];
  onPlaceItem: (item: HomeItem) => void;
  onOpenShop?: () => void;
}

const CATEGORIES: { id: ItemCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'furniture', label: 'Furniture', icon: '🪑' },
  { id: 'decoration', label: 'Decor', icon: '🌸' },
  { id: 'sticker', label: 'Stickers', icon: '🖼️' },
  { id: 'companion', label: 'Pets', icon: '🐾' },
  { id: 'special', label: 'Trophies', icon: '🏆' }
];

export const CollectionDrawer: React.FC<CollectionDrawerProps> = ({
  isOpen,
  onClose,
  unlockedItemIds,
  inventory,
  placedItems,
  onPlaceItem,
  onOpenShop
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const unlockedSet = new Set(unlockedItemIds);

  const filteredItems = INITIAL_HOME_ITEMS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.unlockCondition.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unlockedCount = INITIAL_HOME_ITEMS.filter((i) => unlockedSet.has(i.id)).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl border-4 border-pink-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-pink-100 flex items-center justify-between bg-gradient-to-r from-pink-50 via-rose-50/50 to-amber-50/50">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎒</span>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 font-['Fredoka'] flex items-center gap-2">
                <span>My Collection</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold">
                  {unlockedCount} / {INITIAL_HOME_ITEMS.length} Unlocked
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Decorations & furniture earned through your reading and learning journey!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs & Search */}
        <div className="px-4 py-3 border-b border-slate-100 space-y-3 bg-white">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playPop();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-pink-500 text-white shadow-sm scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search furniture, stickers, pets, words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredItems.map((item) => {
              const isUnlocked = unlockedSet.has(item.id);
              const countInRoom = placedItems.filter((p) => p.itemId === item.id).length;

              return (
                <div
                  key={item.id}
                  className={`relative rounded-2xl border-2 p-3.5 flex flex-col justify-between transition-all ${
                    isUnlocked
                      ? 'bg-white border-pink-100 hover:border-pink-300 hover:shadow-md'
                      : 'bg-slate-50/80 border-slate-200/80 opacity-75'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 flex items-center justify-center">
                      {isUnlocked ? (
                        item.renderType ? (
                          <MiniatureFurnitureRenderer item={item} size="sm" isLit={true} />
                        ) : (
                          <span className="text-3xl sm:text-4xl drop-shadow-xs">{item.icon}</span>
                        )
                      ) : (
                        <span className="text-3xl text-stone-400">❓</span>
                      )}
                    </div>

                    {isUnlocked ? (
                      countInRoom > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {countInRoom} in room
                        </span>
                      )
                    ) : (
                      <span className="p-1 rounded-full bg-amber-100 text-amber-700">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Title and Description */}
                  <div className="mt-2.5">
                    <h4
                      className={`text-xs font-extrabold truncate ${
                        isUnlocked ? 'text-slate-800' : 'text-slate-500'
                      }`}
                    >
                      {item.name}
                    </h4>

                    {isUnlocked ? (
                      <div>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                          {item.description}
                        </p>
                        <div className="mt-1">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-100 text-pink-900 border border-pink-200">
                            × {inventory[item.id] || 0} in backpack
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 p-1.5 rounded-lg bg-amber-50 border border-amber-200/60 text-[10px] text-amber-900 font-medium">
                        <span className="font-bold block text-[9px] uppercase tracking-wider text-amber-800">
                          How to earn:
                        </span>
                        {item.unlockCondition}
                      </div>
                    )}
                  </div>

                  {/* Place Item Button */}
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    {isUnlocked ? (
                      (inventory[item.id] || 0) > 0 ? (
                        <button
                          onClick={() => {
                            sound.playPop();
                            onPlaceItem(item);
                          }}
                          className="w-full py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Place in Room</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            sound.playPop();
                            if (onOpenShop) {
                              onClose();
                              onOpenShop();
                            }
                          }}
                          className="w-full py-1.5 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Shop More</span>
                        </button>
                      )
                    ) : (
                      <div className="text-[10px] text-center font-bold text-slate-400 py-1 flex items-center justify-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Locked Reward</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info note & Shop button */}
        <div className="p-3 bg-pink-50/60 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-pink-900 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
            <span>
              Every book read, word mastered, and test unlocks new items!
            </span>
          </p>
          {onOpenShop && (
            <button
              onClick={() => {
                onClose();
                onOpenShop();
              }}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer transition-all shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Browse Furniture Shop</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { HomeItem, ShopCategory } from '../../types';
import { SHOP_CATALOG_ITEMS, SHOP_CATEGORIES } from '../../data/homeShopCatalog';
import { MiniatureFurnitureRenderer } from './MiniatureFurnitureRenderer';
import {
  ShoppingBag,
  Coins,
  Lock,
  Check,
  Sparkles,
  Maximize2,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface DesktopShopSidebarProps {
  userCoins: number;
  unlockedItemIds: string[];
  inventory: Record<string, number>;
  placedItemIds: string[];
  onBuyItem: (item: HomeItem) => void;
  onPlaceItem: (item: HomeItem) => void;
  onSelectItemForInspection: (item: HomeItem) => void;
  onOpenFullShop: () => void;
  selectedItemId?: string | null;
}

export const DesktopShopSidebar: React.FC<DesktopShopSidebarProps> = ({
  userCoins,
  unlockedItemIds,
  inventory,
  placedItemIds,
  onBuyItem,
  onPlaceItem,
  onSelectItemForInspection,
  onOpenFullShop,
  selectedItemId
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = useMemo(() => {
    return SHOP_CATALOG_ITEMS.filter((item) => {
      // Category filter
      if (activeCategory !== 'all') {
        if (activeCategory === 'basic' && item.collection !== 'basic') return false;
        if (activeCategory === 'seasonal' && item.shopCategory !== 'seasonal') return false;
        if (activeCategory === 'rewards' && item.shopCategory !== 'rewards') return false;
        if (
          activeCategory !== 'basic' &&
          activeCategory !== 'seasonal' &&
          activeCategory !== 'rewards' &&
          item.shopCategory !== activeCategory
        ) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = (item.description || '').toLowerCase().includes(query);
        const matchesCategory = (item.shopCategory || '').toLowerCase().includes(query);
        const matchesCollection = (item.collection || '').toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesCollection) {
          return false;
        }
      }

      return true;
    });
  }, [activeCategory, searchQuery]);

  // Featured starter highlight item
  const featuredItem = useMemo(() => {
    return (
      SHOP_CATALOG_ITEMS.find((i) => i.id === 'furn-reading-chair') ||
      SHOP_CATALOG_ITEMS[0]
    );
  }, []);

  return (
    <aside
      id="desktop-home-shop-sidebar"
      className="bg-white rounded-3xl p-4 border-2 border-amber-100/90 shadow-md flex flex-col h-full min-h-[520px] max-h-[640px]"
    >
      {/* 🛍️ Header: Boutique Title & Quick Coin Balance */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 shadow-2xs">
            <ShoppingBag className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-stone-800 leading-tight">
              Home Boutique
            </h3>
            <p className="text-[11px] text-amber-800/70 font-medium">
              Decorate with earned coins
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenFullShop}
            className="px-2 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200/80 flex items-center gap-1 transition-colors cursor-pointer"
            title="Expand into full boutique"
          >
            <Maximize2 className="w-3 h-3 text-amber-700" />
            <span className="hidden xl:inline">Full Shop</span>
          </button>
        </div>
      </div>

      {/* 🔍 Search and Category Filters */}
      <div className="pt-2.5 pb-2 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search cozy furniture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-800 placeholder:text-stone-400 font-medium"
          />
        </div>

        {/* Scrollable Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
          <button
            onClick={() => {
              sound.playPop();
              setActiveCategory('all');
            }}
            className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Items
          </button>
          {SHOP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playPop();
                setActiveCategory(cat.id);
              }}
              className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 🛋️ Scrollable Catalog Items */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            <span className="text-2xl block mb-1">🔍</span>
            <p className="text-xs font-semibold">No items match your search</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const countInInventory = inventory[item.id] || 0;
            const isUnlocked = unlockedItemIds.includes(item.id) || item.unlocked;
            const isPlaced = placedItemIds.includes(item.id);
            const price = item.price ?? 0;
            const canAfford = userCoins >= price;
            const isSelected = selectedItemId === item.id;
            const isReward = item.shopCategory === 'rewards' || price === 0;

            return (
              <div
                key={item.id}
                id={`shop-sidebar-item-${item.id}`}
                onClick={() => {
                  sound.playPop();
                  onSelectItemForInspection(item);
                }}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 relative group ${
                  isSelected
                    ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300 shadow-2xs'
                    : 'bg-stone-50/70 hover:bg-amber-50/40 border-stone-200/90 hover:border-amber-200'
                }`}
              >
                {/* Visual miniature illustration thumbnail */}
                <div className="w-14 h-14 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs relative">
                  <div className="scale-75 pointer-events-none">
                    <MiniatureFurnitureRenderer item={item} size="sm" isLit={true} />
                  </div>

                  {countInInventory > 0 && (
                    <span className="absolute bottom-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-1 rounded-tl-md">
                      ×{countInInventory}
                    </span>
                  )}
                </div>

                {/* Item Details Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-extrabold text-stone-800 truncate">
                      {item.name}
                    </h4>
                    {isReward ? (
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md border border-purple-200 shrink-0">
                        🏆 Trophy
                      </span>
                    ) : (
                      <span className="text-xs font-black text-amber-900 flex items-center gap-0.5 shrink-0">
                        <span>🪙</span>
                        <span>{price}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-stone-500 truncate mt-0.5 capitalize">
                    {item.collection ? `${item.collection} collection` : item.shopCategory || 'Classic'} •{' '}
                    {item.placement || 'Floor'}
                  </p>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {countInInventory > 0 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlaceItem(item);
                        }}
                        className="px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                        title="Place item into room"
                      >
                        <Check className="w-3 h-3" />
                        <span>Place</span>
                      </button>
                    ) : isReward ? (
                      <span className="text-[10px] text-purple-700 font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-purple-500" />
                        <span>Milestone unlock</span>
                      </span>
                    ) : canAfford ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onBuyItem(item);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                        title={`Buy for ${price} coins`}
                      >
                        <Coins className="w-3 h-3" />
                        <span>Buy</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-stone-400 font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-stone-400" />
                        <span>Need {price - userCoins} coins</span>
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playPop();
                        onSelectItemForInspection(item);
                      }}
                      className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[10px] transition-colors cursor-pointer ml-auto"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer link to open full catalog */}
      <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs text-amber-900">
        <span className="font-bold text-[11px] text-stone-500">
          Showing {filteredItems.length} items
        </span>
        <button
          onClick={onOpenFullShop}
          className="font-extrabold text-amber-700 hover:text-amber-900 flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
        >
          <span>Browse All Categories</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};

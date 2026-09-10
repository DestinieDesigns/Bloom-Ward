import React, { useState, useMemo } from 'react';
import { HomeItem, PlacedHomeItem } from '../../types';
import { SHOP_CATALOG_ITEMS } from '../../data/homeShopCatalog';
import { INITIAL_HOME_ITEMS } from '../../data/learningHomeData';
import { MiniatureFurnitureRenderer } from './MiniatureFurnitureRenderer';
import {
  Package,
  Sparkles,
  Plus,
  Check,
  Search,
  Eye,
  ShoppingBag
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface FurnitureCollectionBarProps {
  unlockedItemIds: string[];
  inventory: Record<string, number>;
  placedItems: PlacedHomeItem[];
  onPlaceItem: (item: HomeItem) => void;
  onSelectItemForInspection: (item: HomeItem) => void;
  onOpenShop: () => void;
  selectedItemId?: string | null;
}

type CollectionFilter = 'all' | 'beds_seating' | 'study_tables' | 'decor_plants' | 'lighting_windows';

export const FurnitureCollectionBar: React.FC<FurnitureCollectionBarProps> = ({
  unlockedItemIds,
  inventory,
  placedItems,
  onPlaceItem,
  onSelectItemForInspection,
  onOpenShop,
  selectedItemId
}) => {
  const [activeFilter, setActiveFilter] = useState<CollectionFilter>('all');

  // Combined master catalog map
  const catalogMap = useMemo(() => {
    const map = new Map<string, HomeItem>();
    INITIAL_HOME_ITEMS.forEach((i) => map.set(i.id, i));
    SHOP_CATALOG_ITEMS.forEach((i) => map.set(i.id, i));
    return map;
  }, []);

  // Placed count per itemId
  const placedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of placedItems) {
      counts[p.itemId] = (counts[p.itemId] || 0) + 1;
    }
    return counts;
  }, [placedItems]);

  // Owned item list: unlocked or quantity in inventory > 0 or placed > 0
  const ownedItems = useMemo(() => {
    const allKnownIds = Array.from(
      new Set([
        ...unlockedItemIds,
        ...Object.keys(inventory).filter((id) => (inventory[id] || 0) > 0),
        ...Object.keys(placedCounts)
      ])
    );

    const items: Array<{
      item: HomeItem;
      backpackCount: number;
      placedCount: number;
    }> = [];

    for (const id of allKnownIds) {
      const item = catalogMap.get(id);
      if (!item) continue;
      const backpackCount = inventory[id] || 0;
      const placedCount = placedCounts[id] || 0;
      items.push({ item, backpackCount, placedCount });
    }

    return items;
  }, [unlockedItemIds, inventory, placedCounts, catalogMap]);

  // Filtered owned items
  const filteredOwnedItems = useMemo(() => {
    return ownedItems.filter(({ item }) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'beds_seating') {
        return (
          item.shopCategory === 'bedroom' ||
          item.shopCategory === 'living_room' ||
          item.id.includes('bed') ||
          item.id.includes('sofa') ||
          item.id.includes('chair')
        );
      }
      if (activeFilter === 'study_tables') {
        return (
          item.shopCategory === 'reading_study' ||
          item.id.includes('desk') ||
          item.id.includes('bookshelf') ||
          item.id.includes('table')
        );
      }
      if (activeFilter === 'decor_plants') {
        return (
          item.shopCategory === 'decorations' ||
          item.category === 'decoration' ||
          item.id.includes('plant') ||
          item.id.includes('plush') ||
          item.id.includes('candle')
        );
      }
      if (activeFilter === 'lighting_windows') {
        return (
          item.shopCategory === 'lighting' ||
          item.shopCategory === 'windows_doors' ||
          item.id.includes('lamp') ||
          item.id.includes('window') ||
          item.id.includes('door')
        );
      }
      return true;
    });
  }, [ownedItems, activeFilter]);

  return (
    <section
      id="furniture-collection-section"
      className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-100 shadow-md space-y-4"
    >
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900 shadow-2xs">
            <Package className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-stone-800 leading-tight flex items-center gap-2">
              <span>Furniture & Decoration Collection</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black">
                {ownedItems.length} Owned
              </span>
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Items in your backpack and currently placed inside your home
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-extrabold">
          <button
            onClick={() => {
              sound.playPop();
              setActiveFilter('all');
            }}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Owned ({ownedItems.length})
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveFilter('beds_seating');
            }}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer ${
              activeFilter === 'beds_seating'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            🛏️ Beds & Seating
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveFilter('study_tables');
            }}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer ${
              activeFilter === 'study_tables'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            📚 Study & Desks
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveFilter('decor_plants');
            }}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer ${
              activeFilter === 'decor_plants'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            🌿 Plants & Decor
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveFilter('lighting_windows');
            }}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer ${
              activeFilter === 'lighting_windows'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            💡 Lights & Windows
          </button>
        </div>
      </div>

      {/* Collection Items: Touch-scrollable on mobile, flexible responsive grid on desktop */}
      {filteredOwnedItems.length === 0 ? (
        <div className="text-center py-10 bg-amber-50/40 rounded-2xl border border-dashed border-amber-200 p-6">
          <span className="text-3xl block mb-2">📦</span>
          <h4 className="font-extrabold text-stone-700 text-sm">
            No items found in this category
          </h4>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Discover charming pieces in the Boutique Shop with your earned learning coins!
          </p>
          <button
            onClick={onOpenShop}
            className="mt-3 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs inline-flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Visit Home Boutique</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto pb-2">
          {filteredOwnedItems.map(({ item, backpackCount, placedCount }) => {
            const isSelected = selectedItemId === item.id;

            return (
              <div
                key={item.id}
                id={`collection-item-${item.id}`}
                onClick={() => {
                  sound.playPop();
                  onSelectItemForInspection(item);
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative ${
                  isSelected
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-sm'
                    : 'bg-stone-50/60 hover:bg-amber-50/40 border-stone-200/90 hover:border-amber-200'
                }`}
              >
                {/* Visual Thumbnail */}
                <div className="relative w-full h-24 bg-white rounded-xl border border-stone-200/80 flex items-center justify-center overflow-hidden shadow-2xs mb-2">
                  <div className="scale-90 pointer-events-none transition-transform group-hover:scale-95">
                    <MiniatureFurnitureRenderer item={item} size="sm" isLit={true} />
                  </div>

                  {/* Status Badges */}
                  <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 items-end pointer-events-none">
                    {backpackCount > 0 && (
                      <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-2xs">
                        🎒 ×{backpackCount}
                      </span>
                    )}
                    {placedCount > 0 && (
                      <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-2xs">
                        🏡 In Room ({placedCount})
                      </span>
                    )}
                  </div>
                </div>

                {/* Name & Placement */}
                <div>
                  <h4 className="font-extrabold text-xs text-stone-800 truncate leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-stone-500 capitalize mt-0.5 truncate">
                    {item.placement || 'Floor'} • {item.size || 'Medium'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center gap-1.5">
                  {backpackCount > 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlaceItem(item);
                      }}
                      className="w-full py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[11px] flex items-center justify-center gap-1 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                      title="Place in room"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Place</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playPop();
                        onSelectItemForInspection(item);
                      }}
                      className="w-full py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-stone-500" />
                      <span>Details</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

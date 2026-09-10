import React from 'react';
import { FurnitureCollection, HomeItem } from '../../types';
import {
  SEASONAL_COLLECTIONS,
  getItemsByCollection,
  SHOP_CATALOG_ITEMS
} from '../../data/homeShopCatalog';
import { MiniatureFurnitureRenderer } from './MiniatureFurnitureRenderer';
import { Sparkles, Calendar, ArrowRight, Check } from 'lucide-react';
import { sound } from '../../utils/audio';

interface SeasonalCollectionsViewProps {
  unlockedItemIds: string[];
  inventory: Record<string, number>;
  onSelectSeasonalItem: (item: HomeItem) => void;
  onOpenShopToSeason: (collectionId: FurnitureCollection) => void;
}

export const SeasonalCollectionsView: React.FC<SeasonalCollectionsViewProps> = ({
  unlockedItemIds,
  inventory,
  onSelectSeasonalItem,
  onOpenShopToSeason
}) => {
  return (
    <section
      id="seasonal-collections-showcase"
      className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-100 shadow-md space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900 shadow-2xs">
            <Calendar className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-stone-800 leading-tight flex items-center gap-2">
              <span>Seasonal Collections</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 font-black border border-orange-200">
                6 Festive Themes
              </span>
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Celebrate the seasons with exclusive decorative furnishings & charming accents
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 6 Seasonal Theme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SEASONAL_COLLECTIONS.map((season) => {
          const seasonItems = getItemsByCollection(season.id);
          const previewItems = seasonItems.slice(0, 3);
          const ownedCount = seasonItems.filter(
            (i) => (inventory[i.id] || 0) > 0 || unlockedItemIds.includes(i.id)
          ).length;

          return (
            <div
              key={season.id}
              id={`seasonal-card-${season.id}`}
              className="rounded-2xl p-4 border border-stone-200/90 bg-stone-50/50 hover:bg-amber-50/40 hover:border-amber-200 transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{season.icon}</span>
                    <div>
                      <h4 className="font-extrabold text-sm text-stone-800 leading-tight">
                        {season.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1">
                        {season.tagline}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${season.badgeColor} shrink-0`}
                  >
                    {ownedCount}/{seasonItems.length} Owned
                  </span>
                </div>

                {/* Preview Items Strip */}
                <div className="grid grid-cols-3 gap-2 my-3">
                  {previewItems.map((item) => {
                    const hasItem =
                      (inventory[item.id] || 0) > 0 ||
                      unlockedItemIds.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          sound.playPop();
                          onSelectSeasonalItem(item);
                        }}
                        className="bg-white rounded-xl p-2 border border-stone-200/80 flex flex-col items-center justify-center cursor-pointer hover:border-amber-300 hover:shadow-2xs transition-all relative group/item h-20"
                        title={`${item.name} (${item.price || 0} Coins)`}
                      >
                        <div className="scale-75 pointer-events-none">
                          <MiniatureFurnitureRenderer
                            item={item}
                            size="sm"
                            isLit={true}
                          />
                        </div>
                        <span className="text-[10px] font-extrabold text-stone-700 truncate w-full text-center mt-1">
                          {item.name}
                        </span>

                        {hasItem && (
                          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenShopToSeason(season.id);
                }}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-amber-100/70 text-amber-950 font-extrabold text-xs border border-amber-200 flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer mt-1"
              >
                <span>Browse {season.name}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

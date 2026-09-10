import React from 'react';
import { HomeItem, FurnitureActionType } from '../../types';
import { MiniatureFurnitureRenderer } from './MiniatureFurnitureRenderer';
import { X, Sparkles, Check, Lock, Coins, BookOpen, Heart, ArrowRight } from 'lucide-react';

interface ItemDetailsModalProps {
  item: HomeItem | null;
  isOpen: boolean;
  onClose: () => void;
  isUnlocked: boolean;
  inventoryCount?: number;
  userCoins: number;
  onBuyItem: (item: HomeItem) => void;
  onPlaceItem?: (item: HomeItem) => void;
}

const ACTION_LABELS: Record<FurnitureActionType, { label: string; icon: string }> = {
  sit: { label: 'Sit & Rest', icon: '🪑' },
  sleep: { label: 'Sleep & Nap', icon: '😴' },
  relax: { label: 'Relax & Cozy Up', icon: '✨' },
  read: { label: 'Read Storybooks', icon: '📖' },
  messBed: { label: 'Mess Up Bed', icon: '🤪' },
  makeBed: { label: 'Tidy & Make Bed', icon: '🛏️' },
  turnOn: { label: 'Turn Light On', icon: '💡' },
  turnOff: { label: 'Turn Light Off', icon: '🌙' },
  openDoor: { label: 'Open Door', icon: '🚪' },
  closeDoor: { label: 'Close Door', icon: '🔒' },
  openWindow: { label: 'Open Window', icon: '🪟' },
  closeWindow: { label: 'Close Window', icon: '🌤️' },
  waterPlant: { label: 'Water with Can', icon: '💧' },
  observePlant: { label: 'Observe Growth', icon: '🌱' },
  browseBooks: { label: 'Browse Library', icon: '📚' },
  openDrawers: { label: 'Open Drawers', icon: '🗄️' },
  pet: { label: 'Pet Gently', icon: '🐾' },
  play: { label: 'Play Together', icon: '🎾' },
  stretch: { label: 'Big Cozy Stretch', icon: '✨' },
  groom: { label: 'Clean Paws & Fur', icon: '🧼' },
  feed: { label: 'Give Tasty Treat', icon: '🥕' },
  hop: { label: 'Happy Hop', icon: '🐇' },
  talk: { label: 'Wise Chat', icon: '🦉' },
  fly: { label: 'Fly to Perch', icon: '🪶' },
  write: { label: 'Write & Journal', icon: '✍️' },
  study: { label: 'Focus & Study', icon: '📝' },
  practice: { label: 'Spelling Practice', icon: '🎯' },
  scripture: { label: 'Read Scripture', icon: '🕊️' },
  reflect: { label: 'Mindful Reflection', icon: '🙏' }
};

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  isOpen,
  onClose,
  isUnlocked,
  inventoryCount = 0,
  userCoins,
  onBuyItem,
  onPlaceItem
}) => {
  if (!isOpen || !item) return null;

  const price = item.price ?? 0;
  const canAfford = userCoins >= price;
  const isReward = item.shopCategory === 'rewards' || price === 0;
  const hasInInventory = inventoryCount > 0 || isUnlocked;

  return (
    <div
      id="item-details-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        id="item-details-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 px-6 py-4 border-b border-amber-100/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <h3 className="font-bold text-lg text-amber-950 leading-tight">{item.name}</h3>
              <p className="text-xs text-amber-700 capitalize">
                {item.collection ? `${item.collection} Collection` : 'Timeless Classic'} • {item.placement || 'Floor'} Item
              </p>
            </div>
          </div>
          <button
            id="close-item-details-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 flex items-center justify-center shadow-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Large Miniature Furniture Illustration Stage */}
          <div className="relative w-full h-48 bg-gradient-to-b from-stone-50/80 via-amber-50/40 to-amber-100/30 rounded-2xl border border-amber-200/50 flex items-center justify-center overflow-hidden">
            {/* Soft decorative backdrop wall & floor line */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-amber-100/60 border-t border-amber-200/40" />

            <div className="relative z-10 scale-125 transition-transform duration-300">
              <MiniatureFurnitureRenderer item={item} size="preview" isLit={true} />
            </div>

            {/* In Inventory Tag */}
            {hasInInventory && (
              <span className="absolute top-3 left-3 bg-emerald-100/90 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1 shadow-xs">
                <Check className="w-3.5 h-3.5" />
                <span>In Backpack {inventoryCount > 0 ? `(×${inventoryCount})` : ''}</span>
              </span>
            )}

            {/* Price Badge */}
            {!isReward && price > 0 && (
              <span className="absolute top-3 right-3 bg-amber-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5" />
                <span>{price} Coins</span>
              </span>
            )}

            {/* Milestone Badge */}
            {isReward && !hasInInventory && (
              <span className="absolute top-3 right-3 bg-purple-600 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Learning Reward</span>
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-900/70">Description</h4>
            <p className="text-stone-700 text-sm leading-relaxed">{item.description}</p>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-100">
              <span className="text-xs text-amber-800 font-medium block">Room Placement</span>
              <span className="text-sm font-bold text-amber-950 capitalize">{item.placement || 'Floor'}</span>
            </div>
            <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-100">
              <span className="text-xs text-amber-800 font-medium block">Item Size</span>
              <span className="text-sm font-bold text-amber-950 capitalize">{item.size || 'Medium'}</span>
            </div>
          </div>

          {/* Interactive Actions List */}
          {item.interactive && item.actions && item.actions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-900/70 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Interactive Play Actions
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.actions.map((act) => {
                  const meta = ACTION_LABELS[act] || { label: act, icon: '✨' };
                  return (
                    <span
                      key={act}
                      className="inline-flex items-center gap-1.5 bg-stone-100/90 hover:bg-amber-100/80 text-stone-800 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200/80 transition-colors"
                    >
                      <span>{meta.icon}</span>
                      <span>{meta.label}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Educational Milestone Note */}
          <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-3.5 rounded-2xl border border-blue-100 flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <p className="font-bold">Educational Origin</p>
              <p className="text-blue-800/90 mt-0.5">{item.unlockCondition}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between gap-3">
          {/* User's coin status info */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold text-sm shadow-xs">
              🪙
            </div>
            <div>
              <span className="text-xs text-stone-500 block leading-tight">Your Balance</span>
              <span className="text-sm font-black text-amber-950">{userCoins} Coins</span>
            </div>
          </div>

          {/* Action button states */}
          {inventoryCount > 0 ? (
            <div className="flex items-center gap-2">
              <button
                id="place-item-btn"
                onClick={() => {
                  if (onPlaceItem) onPlaceItem(item);
                  onClose();
                }}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Place in Room (×{inventoryCount})</span>
              </button>

              {!isReward && price > 0 && canAfford && (
                <button
                  id="buy-another-item-btn"
                  onClick={() => {
                    onBuyItem(item);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                  title="Buy another copy"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  <span>+1 More ({price} 🪙)</span>
                </button>
              )}
            </div>
          ) : isReward ? (
            <div className="flex items-center gap-2 text-xs font-bold text-purple-800 bg-purple-100 px-4 py-2.5 rounded-xl border border-purple-200">
              <Lock className="w-4 h-4 text-purple-600" />
              <span>Complete Milestone to Unlock</span>
            </div>
          ) : canAfford ? (
            <button
              id="purchase-item-btn"
              onClick={() => {
                onBuyItem(item);
                onClose();
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>Buy for {price} Coins</span>
            </button>
          ) : (
            <div className="flex flex-col items-end">
              <button
                disabled
                className="flex items-center gap-1.5 bg-stone-200 text-stone-500 font-bold text-xs px-4 py-2.5 rounded-xl cursor-not-allowed opacity-80"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Need {price - userCoins} more coins</span>
              </button>
              <span className="text-[11px] text-amber-700 font-medium mt-1">
                Learn words & read books to earn!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { HomeItem, FurnitureActionType } from '../../types';
import { MiniatureFurnitureRenderer } from './MiniatureFurnitureRenderer';
import {
  Sparkles,
  Check,
  Lock,
  Coins,
  BookOpen,
  Info,
  HelpCircle,
  Package,
  Plus
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface ItemDetailsAndInteractionsProps {
  selectedItem: HomeItem | null;
  unlockedItemIds: string[];
  inventory: Record<string, number>;
  userCoins: number;
  onBuyItem: (item: HomeItem) => void;
  onPlaceItem: (item: HomeItem) => void;
  onSelectInteractiveItemExample: (itemId: string) => void;
}

const ACTION_METADATA: Record<
  FurnitureActionType,
  { label: string; icon: string; desc: string }
> = {
  sit: { label: 'Sit & Rest', icon: '🪑', desc: 'Character perches cozily on cushion' },
  sleep: { label: 'Sleep & Nap', icon: '😴', desc: 'Curling up for peaceful slumber' },
  relax: { label: 'Relax & Cozy Up', icon: '✨', desc: 'Gentle mindful resting' },
  read: { label: 'Read Storybooks', icon: '📖', desc: 'Opening delightful chapter books' },
  messBed: { label: 'Mess Up Bed', icon: '🤪', desc: 'Playful daybed tussle' },
  makeBed: { label: 'Tidy & Make Bed', icon: '🛏️', desc: 'Neat linens and plump pillows' },
  turnOn: { label: 'Turn Light On', icon: '💡', desc: 'Casts warm golden ambient radiance' },
  turnOff: { label: 'Turn Light Off', icon: '🌙', desc: 'Dimming down for twilight tranquility' },
  openDoor: { label: 'Open Door', icon: '🚪', desc: 'Inviting in new possibilities' },
  closeDoor: { label: 'Close Door', icon: '🔒', desc: 'Cozy secure haven' },
  openWindow: { label: 'Open Window', icon: '🪟', desc: 'Crisp fresh breeze and birdsong' },
  closeWindow: { label: 'Close Window', icon: '🌤️', desc: 'Shutting tight against chilly wind' },
  waterPlant: { label: 'Water with Can', icon: '💧', desc: 'Hydrating vibrant green leaves' },
  observePlant: { label: 'Observe Growth', icon: '🌱', desc: 'Checking lush new sprout' },
  browseBooks: { label: 'Browse Library', icon: '📚', desc: 'Scanning colorful book spines' },
  openDrawers: { label: 'Open Drawers', icon: '🗄️', desc: 'Sliding smooth wooden compartments' },
  pet: { label: 'Pet Gently', icon: '🐾', desc: 'Warm affectionate strokes' },
  play: { label: 'Play Together', icon: '🎾', desc: 'Fun interactive games' },
  stretch: { label: 'Big Cozy Stretch', icon: '✨', desc: 'Reaching paws out wide' },
  groom: { label: 'Clean Paws & Fur', icon: '🧼', desc: 'Keeping squeaky clean' },
  feed: { label: 'Give Tasty Treat', icon: '🥕', desc: 'Crunchy healthy reward' },
  hop: { label: 'Happy Hop', icon: '🐇', desc: 'Bouncing with joy' },
  talk: { label: 'Wise Chat', icon: '🦉', desc: 'Thoughtful encouraging wisdom' },
  fly: { label: 'Fly to Perch', icon: '🪶', desc: 'Fluttering gracefully' },
  write: { label: 'Write & Journal', icon: '✍️', desc: 'Jotting thoughtful notes and ideas' },
  study: { label: 'Focus & Study', icon: '📝', desc: 'Deep-dive vocabulary and learning session' },
  practice: { label: 'Spelling Practice', icon: '🎯', desc: 'Mastering spelling words and challenges' },
  scripture: { label: 'Read Scripture', icon: '🕊️', desc: 'Opening heartwarming faith verses' },
  reflect: { label: 'Mindful Reflection', icon: '🙏', desc: 'Quiet peaceful prayer and gratitude' }
};

export const ItemDetailsAndInteractions: React.FC<ItemDetailsAndInteractionsProps> = ({
  selectedItem,
  unlockedItemIds,
  inventory,
  userCoins,
  onBuyItem,
  onPlaceItem,
  onSelectInteractiveItemExample
}) => {
  const item = selectedItem;
  const inventoryCount = item ? inventory[item.id] || 0 : 0;
  const isUnlocked = item ? unlockedItemIds.includes(item.id) || item.unlocked : false;
  const price = item?.price ?? 0;
  const canAfford = userCoins >= price;
  const isReward = item?.shopCategory === 'rewards' || price === 0;

  return (
    <div
      id="item-details-and-interactions-grid"
      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      {/* ======================================================== */}
      {/* 📦 LEFT: ITEM DETAILS PANEL (col-span-6) */}
      {/* ======================================================== */}
      <section
        id="item-details-panel"
        className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-100 shadow-md flex flex-col justify-between"
      >
        <div className="space-y-4">
          {/* Panel Header */}
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 shadow-2xs">
                <Info className="w-4 h-4 text-amber-700" />
              </div>
              <h3 className="font-extrabold text-base text-stone-800">
                Item Details
              </h3>
            </div>

            {item && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 capitalize">
                {item.collection ? `${item.collection} Collection` : 'Classic'}
              </span>
            )}
          </div>

          {item ? (
            <div className="space-y-4">
              {/* Large Visual Preview Showcase */}
              <div className="relative w-full h-44 bg-gradient-to-b from-stone-50/80 via-amber-50/30 to-amber-100/40 rounded-2xl border border-amber-200/60 flex items-center justify-center overflow-hidden shadow-inner">
                {/* Soft floor horizon line */}
                <div className="absolute inset-x-0 bottom-0 h-14 bg-amber-100/50 border-t border-amber-200/40" />

                <div className="relative z-10 scale-110 transition-transform duration-300">
                  <MiniatureFurnitureRenderer item={item} size="preview" isLit={true} />
                </div>

                {/* Status Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  {inventoryCount > 0 ? (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1 shadow-2xs">
                      <Check className="w-3 h-3" />
                      <span>In Backpack (×{inventoryCount})</span>
                    </span>
                  ) : isUnlocked ? (
                    <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-1 rounded-full border border-amber-300">
                      Unlocked
                    </span>
                  ) : null}
                </div>

                {!isReward && price > 0 && (
                  <span className="absolute top-2.5 right-2.5 bg-amber-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-2xs flex items-center gap-1">
                    <span>🪙</span>
                    <span>{price} Coins</span>
                  </span>
                )}
              </div>

              {/* Name & Description */}
              <div>
                <h4 className="font-black text-lg text-stone-900 leading-tight">
                  {item.name}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed mt-1">
                  {item.description ||
                    'A warm and cozy furnishing crafted with care for your learning home.'}
                </p>
              </div>

              {/* Specs Grid: Placement & Size */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
                  <span className="text-stone-400 font-bold block text-[10px] uppercase">
                    Placement
                  </span>
                  <span className="font-extrabold text-stone-800 capitalize">
                    {item.placement || 'Floor'}
                  </span>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
                  <span className="text-stone-400 font-bold block text-[10px] uppercase">
                    Size
                  </span>
                  <span className="font-extrabold text-stone-800 capitalize">
                    {item.size || 'Medium'}
                  </span>
                </div>
              </div>

              {/* Interactive Actions Chips */}
              {item.interactive && item.actions && item.actions.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Interactive Actions
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.actions.map((act) => {
                      const meta = ACTION_METADATA[act] || {
                        label: act,
                        icon: '✨'
                      };
                      return (
                        <span
                          key={act}
                          className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-200"
                        >
                          <span>{meta.icon}</span>
                          <span>{meta.label}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Educational Origin */}
              {item.unlockCondition && (
                <div className="bg-blue-50/80 p-3 rounded-2xl border border-blue-200/70 flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-950">
                    <span className="font-black block">Educational Discovery</span>
                    <span className="text-blue-800 font-medium">
                      {item.unlockCondition}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <span className="text-4xl block">🪑</span>
              <p className="text-xs font-bold">
                Select any item from the room or shop to view full details
              </p>
            </div>
          )}
        </div>

        {/* Action Button Bar */}
        {item && (
          <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between gap-3">
            {inventoryCount > 0 ? (
              <button
                id="details-place-item-btn"
                onClick={() => onPlaceItem(item)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Place in Room (×{inventoryCount} in backpack)</span>
              </button>
            ) : isReward ? (
              <div className="w-full py-2 px-3 rounded-xl bg-purple-50 text-purple-800 text-xs font-extrabold border border-purple-200 text-center flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-500" />
                <span>Earn through reading & milestones</span>
              </div>
            ) : canAfford ? (
              <button
                id="details-buy-item-btn"
                onClick={() => onBuyItem(item)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <Coins className="w-4 h-4" />
                <span>Buy for {price} Coins</span>
              </button>
            ) : (
              <div className="w-full py-2 px-3 rounded-xl bg-stone-100 text-stone-500 text-xs font-bold text-center">
                Need {price - userCoins} more coins to purchase
              </div>
            )}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* ✨ RIGHT: INTERACTIVE ITEMS GUIDE (col-span-6) */}
      {/* ======================================================== */}
      <section
        id="interactive-items-guide-panel"
        className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-100 shadow-md flex flex-col justify-between"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-stone-800 leading-tight">
                  Interactive Items
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
                  Click items in Play Mode to trigger delightful actions
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Categories Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 🛏️ Beds */}
            <div
              onClick={() => {
                sound.playPop();
                onSelectInteractiveItemExample('furn-classic-single-bed');
              }}
              className="p-3.5 rounded-2xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200/80 hover:border-amber-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">🛏️</span>
                <h4 className="font-extrabold text-xs text-stone-800 group-hover:text-amber-900">
                  Beds & Daybeds
                </h4>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed mb-2">
                Sleep for nap time, sit to rest, mess up the pillows, or tidy the bed.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] bg-white border border-stone-200 px-1.5 py-0.5 rounded font-bold text-stone-700">
                  😴 Sleep
                </span>
                <span className="text-[10px] bg-white border border-stone-200 px-1.5 py-0.5 rounded font-bold text-stone-700">
                  🪑 Sit
                </span>
                <span className="text-[10px] bg-white border border-stone-200 px-1.5 py-0.5 rounded font-bold text-stone-700">
                  ✨ Make Bed
                </span>
              </div>
            </div>

            {/* 💡 Lamps */}
            <div
              onClick={() => {
                sound.playPop();
                onSelectInteractiveItemExample('furn-bedside-lamp');
              }}
              className="p-3.5 rounded-2xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200/80 hover:border-amber-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">💡</span>
                <h4 className="font-extrabold text-xs text-stone-800 group-hover:text-amber-900">
                  Lighting & Lamps
                </h4>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed mb-2">
                Click lamps to toggle between warm golden glow and dim twilight.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] bg-white border border-stone-200 px-1.5 py-0.5 rounded font-bold text-stone-700">
                  💡 Turn On
                </span>
                <span className="text-[10px] bg-white border border-stone-200 px-1.5 py-0.5 rounded font-bold text-stone-700">
                  🌙 Turn Off
                </span>
              </div>
            </div>

            {/* 🌿 Botanicals */}
            <div
              onClick={() => {
                sound.playPop();
                onSelectInteractiveItemExample('decor-small-potted-plant');
              }}
              className="p-3.5 rounded-2xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200/80 hover:border-amber-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">🌿</span>
                <h4 className="font-extrabold text-xs text-stone-800 group-hover:text-amber-900">
                  Indoor Plants
                </h4>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed mb-2">
                Water with a tiny watering can or observe delicate leaf growth.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] bg-white border border-stone-200 px-1.5 py-0.5 rounded font-bold text-stone-700">
                  💧 Water
                </span>
                <span className="text-[10px] bg-white border border-stone-200 px-1.5 py-0.5 rounded font-bold text-stone-700">
                  🌱 Observe
                </span>
              </div>
            </div>

            {/* 📚 Bookshelves */}
            <div
              onClick={() => {
                sound.playPop();
                onSelectInteractiveItemExample('furn-small-bookshelf');
              }}
              className="p-3.5 rounded-2xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200/80 hover:border-amber-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">📚</span>
                <h4 className="font-extrabold text-xs text-stone-800 group-hover:text-amber-900">
                  Story Bookshelves
                </h4>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed mb-2">
                Browse title spines, open a storybook, or sit in the study chair.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] bg-white border border-stone-200 px-1.5 py-0.5 rounded font-bold text-stone-700">
                  📖 Read
                </span>
                <span className="text-[10px] bg-white border border-stone-200 px-1.5 py-0.5 rounded font-bold text-stone-700">
                  📚 Browse
                </span>
              </div>
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-3">
            <span className="text-2xl">👧</span>
            <div className="text-xs text-amber-900">
              <span className="font-extrabold block">
                Character Moves to Furniture!
              </span>
              <span className="text-amber-800/80">
                In Play Mode, clicking an object moves your mini learner directly
                toward it to sit, read, water, or sleep!
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

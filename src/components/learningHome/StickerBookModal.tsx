import React, { useState } from 'react';
import {
  X,
  BookMarked,
  Sparkles,
  Lock,
  Plus,
  CheckCircle,
  HelpCircle,
  Award
} from 'lucide-react';
import { StickerCategory, StickerItem } from '../../types';
import { sound } from '../../utils/audio';

interface StickerBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  stickers: StickerItem[];
  onPlaceStickerInRoom: (sticker: StickerItem) => void;
}

const CATEGORY_TABS: { id: StickerCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Stickers', icon: '✨' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: 'reading', label: 'Reading', icon: '📖' },
  { id: 'spelling', label: 'Spelling', icon: '✏️' },
  { id: 'faith', label: 'Faith', icon: '✝️' },
  { id: 'special_event', label: 'Milestones', icon: '🌟' }
];

export const StickerBookModal: React.FC<StickerBookModalProps> = ({
  isOpen,
  onClose,
  stickers,
  onPlaceStickerInRoom
}) => {
  const [selectedCategory, setSelectedCategory] = useState<StickerCategory | 'all'>('all');
  const [activeSticker, setActiveSticker] = useState<StickerItem | null>(null);

  if (!isOpen) return null;

  const filteredStickers = stickers.filter((s) => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
    return true;
  });

  const collectedCount = stickers.filter((s) => s.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50/40 w-full max-w-2xl max-h-[88vh] rounded-3xl shadow-2xl border-4 border-amber-200 flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Album Header */}
        <div className="p-4 sm:p-5 border-b border-amber-200/70 bg-gradient-to-r from-amber-100/90 via-orange-100/50 to-amber-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📒</span>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 font-['Fredoka'] flex items-center gap-2">
                <span>My Sticker Book</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
                  {collectedCount} / {stickers.length} Collected
                </span>
              </h3>
              <p className="text-xs text-slate-600">
                Collect badges of honor and stick them directly onto your room walls!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/60 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-4 py-2.5 bg-white/70 border-b border-amber-200/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playPop();
                setSelectedCategory(tab.id);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-amber-500 text-white shadow-sm scale-105'
                  : 'bg-amber-100/80 text-amber-800 hover:bg-amber-200/70'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Sticker Album Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filteredStickers.map((sticker) => {
              const isCollected = sticker.unlocked;

              return (
                <div
                  key={sticker.id}
                  onClick={() => {
                    sound.playPop();
                    setActiveSticker(sticker);
                  }}
                  className={`cursor-pointer group relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-between text-center min-h-[140px] ${
                    isCollected
                      ? 'bg-white border-amber-200 hover:border-amber-400 hover:shadow-lg hover:-translate-y-0.5'
                      : 'bg-amber-100/40 border-dashed border-amber-300/70 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* Sticker visual */}
                  <div className="flex-1 flex items-center justify-center">
                    <span
                      className={`text-4xl sm:text-5xl transition-transform ${
                        isCollected
                          ? 'group-hover:scale-110 drop-shadow-md'
                          : 'filter grayscale opacity-40 group-hover:opacity-70'
                      }`}
                    >
                      {sticker.icon}
                    </span>
                  </div>

                  {/* Name and Status */}
                  <div className="w-full mt-2">
                    <h5
                      className={`text-xs font-extrabold truncate ${
                        isCollected ? 'text-slate-800' : 'text-slate-500'
                      }`}
                    >
                      {sticker.name}
                    </h5>

                    {isCollected ? (
                      <span className="inline-block mt-0.5 text-[9px] font-bold text-amber-700 bg-amber-100 px-2 py-0.2 rounded-full">
                        ✨ Collected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 mt-0.5 text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.2 rounded-full">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-white/80 border-t border-amber-200/50 flex items-center justify-between text-xs px-5">
          <span className="text-slate-500 font-medium">
            💡 Tap any sticker to inspect its story or place it in your home!
          </span>
          <span className="font-extrabold text-amber-800">
            {Math.round((collectedCount / stickers.length) * 100)}% Complete
          </span>
        </div>
      </div>

      {/* Detail Inspection Modal */}
      {activeSticker && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-amber-300 shadow-2xl text-center space-y-4 animate-in zoom-in-95">
            <div className="flex justify-end">
              <button
                onClick={() => setActiveSticker(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <span className="text-6xl sm:text-7xl block drop-shadow-md animate-bounce duration-1000">
              {activeSticker.icon}
            </span>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {activeSticker.category.replace('_', ' ')} Sticker
              </span>
              <h4 className="text-xl font-extrabold text-slate-900 font-['Fredoka'] mt-1">
                {activeSticker.name}
              </h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-amber-50 p-3 rounded-2xl border border-amber-100">
              {activeSticker.description}
            </p>

            {activeSticker.unlocked ? (
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    sound.playPop();
                    onPlaceStickerInRoom(activeSticker);
                    setActiveSticker(null);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Place in My Active Room 🏡</span>
                </button>
                <p className="text-[10px] text-emerald-600 font-bold">
                  ✓ Unlocked on your journey!
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  How to unlock:
                </span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  {activeSticker.unlockCondition}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

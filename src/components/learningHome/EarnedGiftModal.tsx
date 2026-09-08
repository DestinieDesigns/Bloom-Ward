import React from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Home, Package, X } from 'lucide-react';
import { HomeItem } from '../../types';
import { sound } from '../../utils/audio';

interface EarnedGiftModalProps {
  gift: {
    item: HomeItem;
    reason: string;
  } | null;
  onAddToHome: (item: HomeItem) => void;
  onSaveToCollection: () => void;
  onDismiss: () => void;
}

export const EarnedGiftModal: React.FC<EarnedGiftModalProps> = ({
  gift,
  onAddToHome,
  onSaveToCollection,
  onDismiss
}) => {
  if (!gift) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  React.useEffect(() => {
    sound.playSuccessChime();
    triggerConfetti();
  }, [gift]);

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border-4 border-pink-300 shadow-2xl text-center space-y-4 animate-in zoom-in-95">
        {/* Header Ribbon */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-extrabold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Reward Earned!</span>
        </div>

        {/* Animated Item Display */}
        <div className="py-2">
          <span className="text-7xl block animate-bounce duration-1000 select-none drop-shadow-lg">
            {gift.item.icon}
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 font-['Fredoka'] mt-3">
            {gift.item.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {gift.item.description}
          </p>
        </div>

        {/* Clear Educational Earning Reason */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-bold leading-snug">
          ✨ {gift.reason}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              sound.playPop();
              onAddToHome(gift.item);
            }}
            className="w-full py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Add to My Home</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              onSaveToCollection();
            }}
            className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Save to My Collection</span>
          </button>
        </div>
      </div>
    </div>
  );
};

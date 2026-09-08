import React from 'react';
import { Award, Lock, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { AchievementBadge } from '../types';
import { sound } from '../utils/audio';

interface BadgesModalProps {
  badges: AchievementBadge[];
  onClose: () => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({ badges, onClose }) => {
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border-2 border-pink-200 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-pink-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl shadow-xs">
              🏆
            </div>
            <div>
              <h3 className="font-extrabold text-pink-900 text-lg sm:text-xl font-['Fredoka']">
                Blossom Badges & Trophies
              </h3>
              <p className="text-xs text-pink-500 font-medium">
                {unlockedCount} of {badges.length} Badges Unlocked
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                b.unlocked
                  ? 'bg-gradient-to-tr from-pink-50/70 to-purple-50/70 border-pink-200 shadow-xs'
                  : 'bg-slate-50 border-dashed border-slate-200 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${
                  b.unlocked ? 'bg-white text-pink-700' : 'bg-slate-200 text-slate-400'
                }`}
              >
                {b.unlocked ? b.icon : <Lock className="w-5 h-5 text-slate-400" />}
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-800 font-['Fredoka']">
                  {b.title}
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">
                  {b.description}
                </p>
                {b.unlocked && b.unlockedDate && (
                  <span className="text-[10px] font-bold text-pink-600 mt-1 inline-block">
                    ✓ Unlocked {b.unlockedDate}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Coins, BookOpen, Sparkles, Flame, CheckCircle, Trophy, Star } from 'lucide-react';
import { sound } from '../../utils/audio';

interface CoinRewardGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCoins: number;
  streakDays: number;
}

export const CoinRewardGuideModal: React.FC<CoinRewardGuideModalProps> = ({
  isOpen,
  onClose,
  userCoins,
  streakDays
}) => {
  if (!isOpen) return null;

  const earningWays = [
    {
      icon: '📚',
      title: 'Vocabulary Learning',
      points: '+5 to +10 Coins',
      desc: 'Earn +5 coins for learning a new word, and +10 coins when you master it completely!'
    },
    {
      icon: '🧠',
      title: 'Flashcard Mastery',
      points: '+10 Coins',
      desc: 'Review and complete a flashcard session to earn coins for your home.'
    },
    {
      icon: '✏️',
      title: 'Spelling Practice & Tests',
      points: '+10 to +25 Coins',
      desc: 'Earn +10 coins per spelling practice session and +25 bonus coins on perfect tests!'
    },
    {
      icon: '📖',
      title: '15-Minute Reading Adventure',
      points: '+20 Coins',
      desc: 'Read real storybooks for 15+ minutes with the reading timer to earn coins and unlock Reader chairs.'
    },
    {
      icon: '🙏',
      title: 'Bible Learning & Faith',
      points: '+10 to +15 Coins',
      desc: 'Learn inspirational concepts like Shalom and Grace to earn coins and faith statues.'
    },
    {
      icon: '🎯',
      title: 'Daily Learning Goals',
      points: '+25 Bonus Coins',
      desc: 'Reach all your daily goals in words, reading, and spelling for a big daily coin bonus!'
    }
  ];

  const streakRewards = [
    { days: '3 Days', reward: '✨ Cozy Warm Lighting & +25 Coins', achieved: streakDays >= 3 },
    { days: '7 Days', reward: '🛋️ Velvet Reader Armchair & +50 Coins', achieved: streakDays >= 7 },
    { days: '14 Days', reward: '🌸 Cherry Blossom Plant & +100 Coins', achieved: streakDays >= 14 },
    { days: '30 Days', reward: '🏆 Master Scholar Gold Trophy & +250 Coins', achieved: streakDays >= 30 }
  ];

  return (
    <div
      id="coin-reward-guide-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="coin-reward-guide-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-amber-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 px-6 py-4 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-200 border border-amber-300 flex items-center justify-center text-xl shadow-2xs">
              🪙
            </div>
            <div>
              <h3 className="font-extrabold text-base text-amber-950">
                How to Earn Learning Coins
              </h3>
              <p className="text-xs text-amber-800/80 font-medium">
                I am building my dream home because I am learning!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Balance & Streak Banner */}
        <div className="px-6 py-3 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-bold">Your Balance:</span>
            <span className="font-black text-amber-950 text-sm flex items-center gap-1">
              <span>🪙</span>
              <span>{userCoins.toLocaleString()} Coins</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full text-rose-900 font-black">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>{streakDays} Day Streak</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Earning Methods List */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900/70 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>Educational Activities That Earn Coins</span>
            </h4>
            <div className="space-y-2">
              {earningWays.map((way, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-3"
                >
                  <span className="text-2xl mt-0.5">{way.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-extrabold text-xs text-stone-800">
                        {way.title}
                      </span>
                      <span className="text-xs font-black text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                        {way.points}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                      {way.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streak Milestone Rewards */}
          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900/70 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Streak Milestone Furniture Unlocks</span>
            </h4>
            <div className="space-y-1.5">
              {streakRewards.map((st, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                    st.achieved
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold'
                      : 'bg-stone-50/70 border-stone-200 text-stone-600 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-black px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-800 text-[11px]">
                      {st.days}
                    </span>
                    <span className="text-xs">{st.reward}</span>
                  </div>
                  {st.achieved ? (
                    <span className="text-emerald-600 font-extrabold text-[11px] flex items-center gap-0.5 shrink-0">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Unlocked!</span>
                    </span>
                  ) : (
                    <span className="text-stone-400 text-[10px] font-bold shrink-0">
                      Keep learning!
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-2xs transition-transform active:scale-95 cursor-pointer"
          >
            Got it, let's learn & decorate!
          </button>
        </div>
      </div>
    </div>
  );
};

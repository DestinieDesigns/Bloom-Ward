import React, { useEffect } from 'react';
import {
  Sparkles,
  Flame,
  BookOpen,
  Award,
  CheckCircle2,
  X,
  ArrowRight,
  Heart
} from 'lucide-react';
import { TodayActivityProgress, UserProfile } from '../types';
import { sound } from '../utils/audio';
import { triggerCelebrationConfetti } from '../utils/storage';

interface DailyCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  activity: TodayActivityProgress;
  xpEarnedToday: number;
}

export const DailyCelebrationModal: React.FC<DailyCelebrationModalProps> = ({
  isOpen,
  onClose,
  profile,
  activity,
  xpEarnedToday
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playLevelUpFanfare();
      triggerCelebrationConfetti();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200 font-['Quicksand']">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-300 text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-pink-200/40 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-200 mb-4 animate-bounce">
          <Sparkles className="w-10 h-10" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-['Fredoka'] mb-1">
          🎉 AMAZING WORK TODAY!
        </h2>
        <p className="text-sm text-slate-500 font-medium mb-5">
          {profile.name}, your dedication is making your mind bloom!
        </p>

        {/* Today's Accomplishments Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2.5 mb-5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Today's Learning Highlights
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-700 font-semibold">
              <span className="text-base">📖</span> Read Books
            </span>
            <span className="font-extrabold text-slate-900 font-['Fredoka']">
              {activity.readingMinutes} Minutes
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-700 font-semibold">
              <span className="text-base">🧠</span> Vocabulary Words
            </span>
            <span className="font-extrabold text-slate-900 font-['Fredoka']">
              {activity.wordsLearned} Words
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-700 font-semibold">
              <span className="text-base">🎴</span> Flashcards Reviewed
            </span>
            <span className="font-extrabold text-slate-900 font-['Fredoka']">
              {activity.flashcardsReviewed} Cards
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-700 font-semibold">
              <span className="text-base">✏️</span> Spelling Words
            </span>
            <span className="font-extrabold text-slate-900 font-['Fredoka']">
              {activity.spellingCompleted} Words
            </span>
          </div>

          {activity.faithWordDone && (
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-purple-700 font-semibold">
                <span className="text-base">✝️</span> Faith Learning
              </span>
              <span className="font-extrabold text-purple-800 font-['Fredoka']">
                Completed!
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-orange-600 font-bold">
              <Flame className="w-4 h-4 fill-orange-500" /> Protected Streak!
            </span>
            <span className="font-extrabold text-orange-600 font-['Fredoka']">
              {profile.streak} Days 🔥
            </span>
          </div>
        </div>

        {/* Reward XP Banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md shadow-indigo-200 mb-5">
          <div className="flex items-center gap-2 text-left">
            <Award className="w-6 h-6 text-amber-300" />
            <div>
              <div className="text-xs text-indigo-100 font-semibold">Total XP Earned</div>
              <div className="text-lg font-extrabold font-['Fredoka']">+{xpEarnedToday || 125} XP</div>
            </div>
          </div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-xs">
            Level {profile.level} ⭐
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Awesome, Keep Growing!</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

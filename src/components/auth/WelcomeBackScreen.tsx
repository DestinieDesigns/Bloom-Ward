import React from 'react';
import {
  Flame,
  Sparkles,
  BookOpen,
  Clock,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Users
} from 'lucide-react';
import { UserProfile, VocabWord } from '../../types';
import { THEMES } from '../../data/themes';
import { sound } from '../../utils/audio';
import { triggerSparkleConfetti } from '../../utils/storage';

interface WelcomeBackScreenProps {
  profile: UserProfile;
  words: VocabWord[];
  onContinue: () => void;
  onSwitchProfile: () => void;
}

export const WelcomeBackScreen: React.FC<WelcomeBackScreenProps> = ({
  profile,
  words,
  onContinue,
  onSwitchProfile
}) => {
  const theme = THEMES[profile.theme] || THEMES.pink_garden;
  const masteredCount = words.filter((w) => w.mastered || w.masteryLevel === 'mastered').length;
  const wordsNeedingReview = words.filter((w) => w.masteryLevel === 'learning' || w.masteryLevel === 'growing').length;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 font-['Quicksand'] animate-fadeIn">
      <div className="max-w-xl w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border-2 border-pink-100 shadow-2xl text-center relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Avatar badge */}
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-pink-400 via-rose-300 to-indigo-400 p-1 shadow-lg mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-5xl sm:text-6xl animate-bounce">
              {profile.avatar}
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 px-3 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md border-2 border-white">
            Lvl {profile.level}
          </span>
        </div>

        {/* Welcome Text */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-pink-700 border border-pink-200 mb-2">
            <span>{theme.icon}</span>
            <span>{theme.name} World</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 font-['Fredoka']">
            Welcome Back, {profile.name}!
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto font-medium">
            Your personal learning adventure is waiting for you!
          </p>
        </div>

        {/* Quick Highlights Bento */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-center">
            <div className="flex items-center justify-center text-orange-500 mb-1">
              <Flame className="w-5 h-5 fill-orange-400" />
            </div>
            <div className="text-xl font-extrabold text-orange-950 font-['Fredoka']">
              {profile.streak}d
            </div>
            <div className="text-[11px] font-bold text-orange-600">
              Daily Streak
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-center">
            <div className="flex items-center justify-center text-purple-500 mb-1">
              <Sparkles className="w-5 h-5 fill-purple-300" />
            </div>
            <div className="text-xl font-extrabold text-purple-950 font-['Fredoka']">
              {profile.xp}
            </div>
            <div className="text-[11px] font-bold text-purple-600">
              Total XP
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="flex items-center justify-center text-emerald-500 mb-1">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-xl font-extrabold text-emerald-950 font-['Fredoka']">
              {masteredCount}
            </div>
            <div className="text-[11px] font-bold text-emerald-600">
              Mastered
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-center">
            <div className="flex items-center justify-center text-blue-500 mb-1">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-xl font-extrabold text-blue-950 font-['Fredoka']">
              {profile.dailyReadingGoalMinutes || 15}m
            </div>
            <div className="text-[11px] font-bold text-blue-600">
              Reading Goal
            </div>
          </div>
        </div>

        {/* Big Action Button */}
        <button
          id="continue-my-adventure-btn"
          onClick={() => {
            sound.playSuccessChime();
            triggerSparkleConfetti();
            onContinue();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-pink-200 cursor-pointer transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
        >
          <span>▶ CONTINUE MY ADVENTURE</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Switch Learner Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center">
          <button
            onClick={() => {
              sound.playPop();
              onSwitchProfile();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-pink-600 transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Not {profile.name}? Switch learner profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

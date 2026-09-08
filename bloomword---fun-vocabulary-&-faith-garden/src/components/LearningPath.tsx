import React from 'react';
import {
  Lock,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Crown
} from 'lucide-react';
import { UserProfile, AppSection } from '../types';
import { sound } from '../utils/audio';

interface LearningPathProps {
  profile: UserProfile;
  onSelectSection: (section: AppSection) => void;
}

interface PathLevel {
  id: number;
  name: string;
  subtitle: string;
  themeColor: string;
  icon: string;
  targetSection: AppSection;
  totalNodes: number;
  completedNodes: number;
  description: string;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  profile,
  onSelectSection
}) => {
  const levels: PathLevel[] = [
    {
      id: 1,
      name: 'Word Garden',
      subtitle: 'Planting Seeds of Knowledge',
      themeColor: 'from-pink-400 to-rose-300',
      icon: '🌸',
      targetSection: 'daily_adventure',
      totalNodes: 5,
      completedNodes: 5,
      description: 'Master foundational Wonders vocabulary & word roots.'
    },
    {
      id: 2,
      name: 'Definition Meadow',
      subtitle: 'Understanding What Words Mean',
      themeColor: 'from-purple-400 to-pink-300',
      icon: '🌷',
      targetSection: 'review_garden',
      totalNodes: 5,
      completedNodes: 3,
      description: 'Match synonyms, antonyms, and unlock context clues.'
    },
    {
      id: 3,
      name: 'Spelling Path',
      subtitle: 'Bows & Letter Petals',
      themeColor: 'from-rose-400 to-amber-300',
      icon: '🎀',
      targetSection: 'spelling_adventure',
      totalNodes: 5,
      completedNodes: 2,
      description: 'Spell tricky words correctly without hesitating.'
    },
    {
      id: 4,
      name: 'Reading Forest',
      subtitle: 'Passages, Comprehension & Wonder',
      themeColor: 'from-emerald-400 to-teal-300',
      icon: '📚',
      targetSection: 'reading_room',
      totalNodes: 4,
      completedNodes: 1,
      description: 'Read heartwarming stories and answer detective questions.'
    },
    {
      id: 5,
      name: 'Vocabulary Castle',
      subtitle: 'Mastering Advanced Wonders',
      themeColor: 'from-amber-400 to-yellow-300',
      icon: '✨',
      targetSection: 'weekly_check',
      totalNodes: 5,
      completedNodes: 0,
      description: 'Tackle Grade 5 multi-syllable vocabulary wonders.'
    },
    {
      id: 6,
      name: 'Faith & Word Garden',
      subtitle: 'Scripture, Peace & Divine Grace',
      themeColor: 'from-indigo-400 to-purple-300',
      icon: '✝️',
      targetSection: 'faith_garden',
      totalNodes: 5,
      completedNodes: 1,
      description: 'Grow deep in understanding Bible words, wisdom, and love.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Path Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 font-bold text-xs sm:text-sm border border-pink-200 mb-3 shadow-xs">
          <span>🎀</span>
          <span>Your Magical Learning Adventure Path</span>
          <span>🌸</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-900 tracking-tight font-['Fredoka']">
          Step Along the Blooming Trail
        </h2>
        <p className="text-sm sm:text-base text-pink-600 max-w-lg mx-auto mt-1">
          Each stepping stone unlocks new words, colorful flowers, and garden companions!
        </p>
      </div>

      {/* Stepping Stones Winding Path */}
      <div className="space-y-12 relative before:absolute before:inset-y-8 before:left-1/2 before:-translate-x-1/2 before:w-1.5 before:bg-gradient-to-b before:from-pink-300 before:via-rose-200 before:to-purple-200 before:rounded-full before:hidden sm:before:block">
        {levels.map((lvl, index) => {
          const isUnlocked = profile.level >= lvl.id;
          const isCurrent = profile.level === lvl.id;
          const isRight = index % 2 === 1;

          return (
            <div
              key={lvl.id}
              className={`relative flex flex-col sm:flex-row items-center gap-6 ${
                isRight ? 'sm:flex-row-reverse' : ''
              }`}
            >
              {/* Stepping Stone Orb Center / Anchor */}
              <div className="relative z-10">
                <button
                  disabled={!isUnlocked}
                  onClick={() => {
                    sound.playBloomSparkle();
                    onSelectSection(lvl.targetSection);
                  }}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg relative ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-pink-500 via-rose-400 to-purple-500 text-white scale-110 ring-4 ring-pink-300 ring-offset-4 animate-gentle-pulse'
                      : isUnlocked
                      ? 'bg-gradient-to-tr from-pink-400 to-rose-300 text-white hover:scale-105'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-300'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl">{lvl.icon}</span>
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-slate-800/40 rounded-full flex items-center justify-center backdrop-blur-xs">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-2 -right-1 bg-amber-400 text-amber-900 rounded-full p-1 shadow-sm">
                      <Crown className="w-4 h-4 fill-amber-300" />
                    </div>
                  )}
                </button>
              </div>

              {/* Level Info Card */}
              <div
                className={`w-full sm:w-80 bg-white rounded-3xl p-5 border-2 shadow-md transition-all ${
                  isCurrent
                    ? 'border-pink-300 shadow-pink-200/60'
                    : isUnlocked
                    ? 'border-pink-100 shadow-pink-50'
                    : 'border-slate-200 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200 uppercase tracking-wider">
                    Level {lvl.id}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>
                      {lvl.completedNodes}/{lvl.totalNodes} Steps
                    </span>
                  </div>
                </div>

                <h3 className="font-extrabold text-lg text-slate-800 font-['Fredoka']">
                  {lvl.name}
                </h3>
                <p className="text-xs text-pink-500 font-semibold mb-2">{lvl.subtitle}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {lvl.description}
                </p>

                {/* Progress bar inside level */}
                <div className="w-full bg-pink-100 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(lvl.completedNodes / lvl.totalNodes) * 100}%`
                    }}
                  />
                </div>

                {isUnlocked ? (
                  <button
                    onClick={() => {
                      sound.playPop();
                      onSelectSection(lvl.targetSection);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                  >
                    <span>{isCurrent ? 'Continue Learning' : 'Practice Again'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="text-center py-1 text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Unlocks at Level {lvl.id}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

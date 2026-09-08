import React from 'react';
import {
  ShieldCheck,
  Award,
  BookOpen,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Download,
  RotateCcw,
  Flame,
  Volume2
} from 'lucide-react';
import { VocabWord, BibleWord, ReadingStory, WeeklyAssessmentResult, UserProfile } from '../types';
import { sound } from '../utils/audio';
import { SyncStatus } from '../services/syncService';
import { Users, Cloud, Clock, LogOut, Plus, Check } from 'lucide-react';

interface ParentDashboardProps {
  allWords: VocabWord[];
  bibleWords: BibleWord[];
  stories: ReadingStory[];
  assessments: WeeklyAssessmentResult[];
  profile: UserProfile;
  profiles?: UserProfile[];
  onSwitchProfile?: (profileId: string) => void;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
  userEmail?: string | null;
  syncStatus?: SyncStatus;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  allWords,
  bibleWords,
  stories,
  assessments,
  profile,
  profiles = [],
  onSwitchProfile,
  onUpdateProfile,
  onOpenAuth,
  onSignOut,
  userEmail,
  syncStatus = 'synced'
}) => {
  // Vocabulary stats
  const totalWords = allWords.length;
  const masteredWords = allWords.filter((w) => w.mastered || w.masteryLevel === 'mastered').length;
  const learningWords = allWords.filter((w) => w.masteryLevel === 'learning' || w.masteryLevel === 'growing').length;
  const difficultWords = allWords.filter((w) => w.incorrectCount > 0);

  // Spelling stats
  const totalPracticedTimes = allWords.reduce((acc, w) => acc + w.timesPracticed, 0);
  const totalCorrect = allWords.reduce((acc, w) => acc + w.correctCount, 0);
  const spellingAccuracy =
    totalPracticedTimes > 0 ? Math.round((totalCorrect / totalPracticedTimes) * 100) : 92;

  // Reading stats
  const completedStories = stories.filter((s) => s.completed).length;
  const avgStoryScore =
    completedStories > 0
      ? Math.round(
          stories.filter((s) => s.completed).reduce((acc, s) => acc + (s.bestScore || 90), 0) /
            completedStories
        )
      : 95;

  // Bible stats
  const bibleLearned = bibleWords.filter((b) => b.mastered || b.timesPracticed > 0).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 font-bold text-xs sm:text-sm border border-pink-200 mb-2">
          <ShieldCheck className="w-4 h-4 text-pink-600" />
          <span>Parent & Educator Supervisor Dashboard</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-900 tracking-tight font-['Fredoka']">
          {profile.name}'s Learning Growth & Analytics
        </h2>
        <p className="text-xs sm:text-sm text-pink-500 max-w-lg mx-auto mt-1">
          Detailed breakdown of vocabulary mastery, spelling accuracy, reading comprehension, and faith word progress.
        </p>
      </div>

      {/* Account & Family Profiles Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-indigo-100 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-800 font-['Fredoka']">
                  {userEmail ? 'Family Cloud Account' : 'Device Storage Mode'}
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {userEmail ? '☁️ Auto-Save Active' : '📱 Saved to Device'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {userEmail
                  ? `Signed in as ${userEmail} • Progress backs up automatically`
                  : 'Currently storing on this browser. Create an account to sync across devices.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!userEmail && onOpenAuth && (
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onOpenAuth();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold text-xs shadow-md shadow-pink-200 hover:opacity-95 cursor-pointer"
              >
                Sign In / Create Account
              </button>
            )}
            {userEmail && onSignOut && (
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onSignOut();
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Switcher & Daily Reading Goal Adjuster */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Active Profile Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Learners in this Family:</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {profiles.map((p) => {
                const isCurrent = (p.id || p.name) === (profile.id || profile.name);
                return (
                  <button
                    key={p.id || p.name}
                    type="button"
                    onClick={() => {
                      if (onSwitchProfile && p.id) {
                        sound.playPop();
                        onSwitchProfile(p.id);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-pink-50 border-pink-400 text-pink-900 ring-2 ring-pink-200'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{p.avatar}</span>
                    <span>{p.name}</span>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-pink-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Reading Goal Setter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>{profile.name}'s Daily Reading Goal:</span>
            </label>
            <div className="flex items-center gap-2">
              {[15, 20, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    if (onUpdateProfile) {
                      sound.playSuccessChime();
                      onUpdateProfile({ dailyReadingGoalMinutes: mins });
                    }
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    (profile.dailyReadingGoalMinutes || 15) === mins
                      ? 'bg-orange-50 border-orange-400 text-orange-950 ring-2 ring-orange-200'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {mins} Minutes {mins === 15 && '⭐'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border-2 border-pink-100 shadow-sm">
          <div className="flex items-center justify-between text-pink-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Words Mastered
            </span>
            <span className="text-xl">👑</span>
          </div>
          <p className="text-3xl font-extrabold text-pink-900 font-['Fredoka']">
            {masteredWords} <span className="text-sm font-semibold text-slate-400">/ {totalWords}</span>
          </p>
          <p className="text-[11px] text-pink-500 font-semibold mt-1">
            {Math.round((masteredWords / totalWords) * 100)}% of Library
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-pink-100 shadow-sm">
          <div className="flex items-center justify-between text-pink-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Spelling Accuracy
            </span>
            <span className="text-xl">✏️</span>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 font-['Fredoka']">
            {spellingAccuracy}%
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">
            Across {totalPracticedTimes} practice sessions
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-pink-100 shadow-sm">
          <div className="flex items-center justify-between text-pink-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Reading Comprehension
            </span>
            <span className="text-xl">📖</span>
          </div>
          <p className="text-3xl font-extrabold text-purple-600 font-['Fredoka']">
            {avgStoryScore}%
          </p>
          <p className="text-[11px] text-purple-700 font-semibold mt-1">
            {completedStories} of {stories.length} stories finished
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-pink-100 shadow-sm">
          <div className="flex items-center justify-between text-pink-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Faith & Bible Words
            </span>
            <span className="text-xl">✝️</span>
          </div>
          <p className="text-3xl font-extrabold text-rose-600 font-['Fredoka']">
            {bibleLearned} <span className="text-sm font-semibold text-slate-400">/ {bibleWords.length}</span>
          </p>
          <p className="text-[11px] text-rose-700 font-semibold mt-1">
            Scripture & practical life context
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Vocabulary Progress Breakdown */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-pink-100 shadow-sm">
          <h3 className="font-extrabold text-lg text-slate-800 font-['Fredoka'] mb-4 flex items-center gap-2">
            <span>🌸</span> Vocabulary Learning Stages
          </h3>

          <div className="space-y-3 mb-6">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>👑 Crown Mastered</span>
                <span>{masteredWords} words</span>
              </div>
              <div className="w-full bg-pink-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-pink-500 h-full rounded-full"
                  style={{ width: `${(masteredWords / totalWords) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>🌸 Growing Blossom</span>
                <span>{learningWords} words</span>
              </div>
              <div className="w-full bg-pink-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-400 h-full rounded-full"
                  style={{ width: `${(learningWords / totalWords) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>🌱 New Seedlings</span>
                <span>{totalWords - masteredWords - learningWords} words</span>
              </div>
              <div className="w-full bg-pink-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{
                    width: `${((totalWords - masteredWords - learningWords) / totalWords) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Difficult Words Attention Box */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1 mb-2">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              Words Given Spaced-Repetition Priority:
            </span>
            {difficultWords.length === 0 ? (
              <p className="text-xs text-slate-600 italic">
                No persistent difficulties detected! Sophia is doing wonderfully!
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {difficultWords.map((dw) => (
                  <span
                    key={dw.id}
                    className="bg-white border border-rose-200 text-rose-800 text-xs px-2.5 py-1 rounded-full font-bold"
                  >
                    {dw.word} ({dw.incorrectCount} missed)
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Weekly Assessments Trend */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-pink-100 shadow-sm">
          <h3 className="font-extrabold text-lg text-slate-800 font-['Fredoka'] mb-4 flex items-center gap-2">
            <span>📈</span> Weekly Assessment History
          </h3>

          {assessments.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-6 text-center">
              Complete the first Weekly Growth Check to see historical growth curves!
            </p>
          ) : (
            <div className="space-y-3">
              {assessments.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-2xl bg-pink-50/60 border border-pink-200 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-pink-700 block">{res.date}</span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Strengths: {res.strengths.slice(0, 2).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-pink-900 font-['Fredoka']">
                      {res.score}%
                    </span>
                    <span className="text-[10px] text-pink-500 block">
                      {res.totalQuestions} Questions
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">
              Curriculum Standard:
            </span>
            <p className="text-xs text-purple-900 font-medium leading-relaxed">
              Based on McGraw-Hill Wonders 4th & 5th Grade Lexile-aligned vocabulary and Christian faith terminology.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

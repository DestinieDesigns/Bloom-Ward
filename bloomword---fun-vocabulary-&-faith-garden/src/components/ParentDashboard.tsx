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
import { VocabWord, BibleWord, ReadingStory, WeeklyAssessmentResult, UserProfile, CategoryResult } from '../types';
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
  onSelectSection?: (section: any) => void;
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
  onSelectSection,
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

          {/* Daily Reading Time Toggle */}
          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Reading Time Goal:</span>
              </label>
              <span className="text-[11px] font-bold text-orange-700 bg-orange-100/80 px-2.5 py-0.5 rounded-full border border-orange-200">
                {profile.dailyReadingGoalMinutes || 15} min / day
              </span>
            </div>

            {/* Segmented Reading Time Toggle */}
            <div
              role="radiogroup"
              aria-label="Daily Reading Time Goal"
              className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-xl"
            >
              {[15, 30, 60].map((mins) => {
                const isSelected = (profile.dailyReadingGoalMinutes || 15) === mins;
                return (
                  <button
                    key={mins}
                    id={`parent-reading-time-${mins}-btn`}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      if (onUpdateProfile) {
                        sound.playSuccessChime();
                        onUpdateProfile({
                          dailyReadingGoalMinutes: mins,
                          dailyGoals: profile.dailyGoals
                            ? { ...profile.dailyGoals, readingMinutes: mins }
                            : undefined
                        });
                      }
                    }}
                    className={`py-2 px-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-white text-orange-600 shadow-xs ring-1 ring-black/5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span>{mins} mins</span>
                    {mins === 15 && <span className="text-[10px] text-amber-500 font-normal">★</span>}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Customizes {profile.name}'s daily focus reading timer and goal target.
            </p>
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

      {/* Starting Assessment & Personalized Learning Placement Diagnostic */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-emerald-100 shadow-sm mb-8 text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-1">
              <span>🌱</span>
              <span>Learner Placement & Diagnostics</span>
            </div>
            <h3 className="font-extrabold text-xl text-slate-800 font-['Fredoka']">
              🌱 Starting Assessment & Skill Profile
            </h3>
            <p className="text-xs text-slate-500">
              Evaluates vocabulary, spelling, definitions, reading comprehension, and word recognition independently.
            </p>
          </div>

          {onSelectSection && (
            <button
              onClick={() => {
                sound.playPop();
                onSelectSection('starting_assessment');
              }}
              className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm transition-transform hover:scale-105 shrink-0"
            >
              <span>{profile.startingAssessment ? '🌟 Launch Growth Checkpoint' : '🌱 Start Discovery Assessment'}</span>
            </button>
          )}
        </div>

        {profile.startingAssessment ? (
          <div className="space-y-6">
            {/* Active Path Summary Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 bg-white rounded-2xl shadow-xs border border-emerald-100">
                  {profile.startingAssessment.icon}
                </span>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Current Learning Path</div>
                  <h4 className="text-xl font-extrabold text-slate-900 font-['Fredoka']">
                    {profile.startingAssessment.pathTitle}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {profile.startingAssessment.pathDescription}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white px-4 py-2.5 rounded-2xl border border-slate-200">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Overall Baseline</span>
                  <span className="text-xl font-extrabold text-emerald-600 font-['Fredoka']">
                    {profile.startingAssessment.overallScorePercent}%
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Completed</span>
                  <span className="text-xs font-extrabold text-slate-700">
                    {new Date(profile.startingAssessment.completedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* 5 Distinct Skills Breakdown */}
            <div>
              <h4 className="font-extrabold text-sm text-slate-700 uppercase tracking-wider mb-3">
                Individual Skill Proficiencies (Never reduced to one single score)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(Object.entries(profile.startingAssessment.skills) as [string, CategoryResult][]).map(([key, skill]) => {
                  const badgeColor =
                    skill.proficiency === 'strong'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : skill.proficiency === 'growing'
                      ? 'bg-lime-100 text-lime-800 border-lime-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300';
                  const label =
                    skill.proficiency === 'strong' ? '🌸 Strong' : skill.proficiency === 'growing' ? '🌿 Growing' : '🌱 Needs Practice';

                  return (
                    <div key={key} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{skill.title}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {label}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 font-medium">
                        <span>Score:</span>
                        <span className="font-bold text-slate-700">
                          {skill.score} / {skill.total} ({skill.total > 0 ? Math.round((skill.score / skill.total) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strengths & Growth Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Identified Strengths:
                </span>
                <ul className="space-y-1">
                  {profile.startingAssessment.personalizedStrengths.map((str, idx) => (
                    <li key={idx} className="text-xs text-emerald-950 font-semibold flex items-center gap-1.5">
                      <span>•</span>
                      <span>{str.replace(/^🌟\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
                <span className="text-xs font-extrabold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Target Growth Areas:
                </span>
                <ul className="space-y-1">
                  {profile.startingAssessment.personalizedGrowthAreas.map((area, idx) => (
                    <li key={idx} className="text-xs text-rose-950 font-semibold flex items-center gap-1.5">
                      <span>•</span>
                      <span>{area.replace(/^🌱\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 text-center space-y-3">
            <span className="text-3xl block">🌱</span>
            <h4 className="font-extrabold text-slate-800 text-base font-['Fredoka']">
              No Starting Assessment Completed Yet
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Completing the 5-minute Starting Assessment evaluates {profile.name}'s current spelling, reading, vocabulary, and definitions, preventing one-size-fits-all lessons.
            </p>
            {onSelectSection && (
              <button
                onClick={() => {
                  sound.playPop();
                  onSelectSection('starting_assessment');
                }}
                className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs cursor-pointer shadow-sm"
              >
                🌱 Discover {profile.name}'s Learning Path
              </button>
            )}
          </div>
        )}
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

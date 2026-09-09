import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Target,
  Brain,
  Layers,
  Clock,
  Compass,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import {
  VocabWord,
  BibleWord,
  UserProfile,
  WeeklyAssessmentResult,
  StartingAssessmentResult,
  AppSection
} from '../types';
import { WeeklyCheck } from './WeeklyCheck';
import { sound } from '../utils/audio';

interface TestSectionProps {
  allWords: VocabWord[];
  bibleWords: BibleWord[];
  profile: UserProfile;
  assessmentHistory: WeeklyAssessmentResult[];
  onSaveAssessment: (result: WeeklyAssessmentResult) => void;
  onAddXp: (amount: number) => void;
  onSelectSection: (section: AppSection) => void;
}

type TestView = 'overview' | 'weekly_test';

export const TestSection: React.FC<TestSectionProps> = ({
  allWords,
  bibleWords,
  profile,
  assessmentHistory,
  onSaveAssessment,
  onAddXp,
  onSelectSection
}) => {
  const [currentView, setCurrentView] = useState<TestView>('overview');

  const latestAssessment = assessmentHistory[assessmentHistory.length - 1] || null;

  // Compute actual learner metrics
  const masteredWords = allWords.filter((w) => w.mastered || w.masteryLevel === 'mastered');
  const practicingWords = allWords.filter((w) => !w.mastered && w.timesPracticed > 0);
  const wordsNeedingFocus = allWords.filter((w) => w.incorrectCount > 0 && !w.mastered).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 font-['Quicksand']">
      {currentView === 'weekly_test' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView('overview')}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              ← Back to Assessment Hub
            </button>
            <span className="text-xs text-stone-400 font-semibold">Weekly Assessment Session</span>
          </div>

          <WeeklyCheck
            allWords={allWords}
            bibleWords={bibleWords}
            profile={profile}
            assessmentHistory={assessmentHistory}
            onSaveAssessment={(res) => {
              onSaveAssessment(res);
              setCurrentView('overview');
            }}
            onAddXp={onAddXp}
          />
        </div>
      ) : (
        <>
          {/* Hero Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-purple-950 to-stone-900 p-6 sm:p-10 text-white shadow-xl border-2 border-purple-900/40 text-left relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs sm:text-sm font-bold mb-3">
                <span>📝</span>
                <span>Meaningful Assessments</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Fredoka'] mb-2 drop-shadow-xs">
                Assessments & Progress
              </h1>

              <p className="text-sm sm:text-base text-stone-300 font-medium mb-6 leading-relaxed max-w-xl">
                See what you've truly learned and discover what to focus on next. Assessments pull from your real study history—never random tricks.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    sound.playPop();
                    setCurrentView('weekly_test');
                  }}
                  className="px-6 py-3 rounded-full bg-purple-500 hover:bg-purple-400 text-stone-950 font-extrabold text-sm sm:text-base shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>Start Weekly Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    sound.playPop();
                    onSelectSection('starting_assessment');
                  }}
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-4 h-4 text-purple-300" />
                  <span>Baseline Placement Path</span>
                </button>

                <button
                  onClick={() => {
                    sound.playPop();
                    onSelectSection('spelling_test');
                  }}
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Independent Spelling Test</span>
                </button>
              </div>
            </div>
          </div>

          {/* TWO PRIMARY ASSESSMENT TRACKS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* 1. WEEKLY ASSESSMENT CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-200/80 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                    Weekly Growth Check
                  </span>
                  <span className="text-xs font-semibold text-stone-400">
                    6–8 Questions
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-stone-900 font-['Fredoka']">
                  Weekly Assessment
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  "See what you've learned and what to focus on next." Evaluates vocabulary, spelling, comprehension, and faith words from your actual practice.
                </p>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-stone-700 block">
                    What it covers:
                  </span>
                  <ul className="text-xs text-stone-500 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>Vocabulary definitions & context usage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>Spelling accuracy from current word lists</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>Reading comprehension & biblical connections</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playPop();
                  setCurrentView('weekly_test');
                }}
                className="w-full py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Take Weekly Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 2. BASELINE / PLACEMENT ASSESSMENT CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-200/80 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Placement & Baseline
                  </span>
                  <span className="text-xs font-semibold text-stone-400">
                    {profile.startingAssessment ? 'Completed' : 'Recommended'}
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-stone-900 font-['Fredoka']">
                  Baseline / Placement Assessment
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  "This isn't a grade. It helps us figure out where to start." Determines your starting vocabulary, spelling, and reading levels based on demonstrated ability.
                </p>

                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 space-y-2">
                  <span className="text-xs font-bold text-emerald-900 block">
                    Starting Path Result:
                  </span>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {profile.startingAssessment
                      ? `Active Path: ${profile.startingAssessment.pathTitle}. Overall proficiency established at ${profile.startingAssessment.overallScorePercent}%.`
                      : 'Take a quick 10-minute check to personalize your daily word recommendations and reading goals.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playPop();
                  onSelectSection('starting_assessment');
                }}
                className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>
                  {profile.startingAssessment
                    ? 'Review Baseline Results'
                    : 'Begin Placement Assessment'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3. WEEKLY RESULTS & FOCUS AREA (Answers "What did I actually learn?") */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-200/80 shadow-sm text-left space-y-6">
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                Progress Reflection
              </span>
              <h3 className="text-2xl font-extrabold text-stone-900 font-['Fredoka']">
                What Did I Actually Learn?
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Clear summary of your demonstrated mastery and skills currently growing.
              </p>
            </div>

            {/* Metric Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Vocabulary
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-['Fredoka'] mt-1">
                  {masteredWords.length}
                </div>
                <span className="text-xs font-semibold text-emerald-700">Mastered words</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                  Spelling
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-['Fredoka'] mt-1">
                  {practicingWords.length}
                </div>
                <span className="text-xs font-semibold text-amber-700">Still practicing</span>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
                  Reading
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-sky-900 font-['Fredoka'] mt-1">
                  {profile.totalReadingMinutes}m
                </div>
                <span className="text-xs font-semibold text-sky-700">Strong progress</span>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">
                  Comprehension
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-900 font-['Fredoka'] mt-1">
                  {latestAssessment ? `${latestAssessment.scorePercent}%` : 'Growing'}
                </div>
                <span className="text-xs font-semibold text-purple-700">Improving steadily</span>
              </div>
            </div>

            {/* YOUR FOCUS AREA (Feeds back into practice!) */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-700" />
                  <h4 className="font-extrabold text-stone-900 text-base font-['Fredoka']">
                    Your Focus Next
                  </h4>
                </div>
                <button
                  onClick={() => onSelectSection('practice')}
                  className="text-xs font-bold text-amber-800 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Practice these words</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-stone-600">
                {wordsNeedingFocus.length > 0
                  ? `Let's spend a little more time practicing these ${wordsNeedingFocus.length} words to solidify your spelling and definitions:`
                  : "You're in great shape! Continue your 15-minute daily reading and explore 5 new vocabulary words."}
              </p>

              {wordsNeedingFocus.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {wordsNeedingFocus.map((w) => (
                    <span
                      key={w.id}
                      className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-800 font-bold text-xs flex items-center gap-1.5"
                    >
                      <span>✏️ {w.word}</span>
                      <span className="text-[10px] text-stone-400 font-normal">({w.partOfSpeech})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

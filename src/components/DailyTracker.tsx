import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sliders,
  Calendar,
  Clock,
  Brain,
  Layers,
  Edit3,
  RotateCcw,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  UserProfile,
  VocabWord,
  AppSection,
  DailyGoalConfig,
  TodayActivityProgress,
  DailyLearningLog
} from '../types';
import {
  getDailyChecklist,
  getRecommendedNextActivity,
  getWeekDaysStatus,
  getTodayActivity
} from '../utils/dailyLearningHelper';
import { sound } from '../utils/audio';
import { GoalCustomizeModal } from './GoalCustomizeModal';
import { DailyCelebrationModal } from './DailyCelebrationModal';

interface DailyTrackerProps {
  profile: UserProfile;
  vocabWords: VocabWord[];
  onSelectSection: (section: AppSection) => void;
  onUpdateGoals: (newGoals: DailyGoalConfig) => void;
  isCompactHero?: boolean; // if rendered inside the top of HomeDashboard
}

export const DailyTracker: React.FC<DailyTrackerProps> = ({
  profile,
  vocabWords,
  onSelectSection,
  onUpdateGoals,
  isCompactHero = false
}) => {
  const [showCustomizeModal, setShowCustomizeModal] = useState<boolean>(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const todayActivity = getTodayActivity(profile);
  const wordsNeedingReview = vocabWords.filter((w) => w.incorrectCount > 0 && !w.mastered);

  const checklistData = getDailyChecklist(profile, todayActivity, wordsNeedingReview.length);
  const recommendation = getRecommendedNextActivity(profile, todayActivity, wordsNeedingReview);
  const weekDays = getWeekDaysStatus(profile.learningHistory || [], todayActivity);

  return (
    <div className="space-y-6 font-['Quicksand'] text-left">
      {/* Tracker Card Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-sm relative overflow-hidden">
        {/* Subtle accent highlight bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-500" />

        {/* Top Header: Title, Streak Badge & Goal Config */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Daily Learning Journey
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-['Fredoka']">
              🌸 Today's Learning Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Keep your daily rhythm alive and watch your knowledge bloom!
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Streak Indicator */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-orange-50 border border-orange-200">
              <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
              <div>
                <div className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">
                  Streak
                </div>
                <div className="text-base font-extrabold text-orange-700 font-['Fredoka'] leading-none">
                  {profile.streak} Days
                </div>
              </div>
            </div>

            {/* Customize Goals Button */}
            <button
              id="customize-daily-goals-btn"
              onClick={() => {
                sound.playPop();
                setShowCustomizeModal(true);
              }}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Customize your daily goals"
              aria-label="Customize daily goals"
            >
              <Sliders className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PERSONALIZED LEARNING PATH BANNER */}
        {profile.startingAssessment ? (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border-2 border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 rounded-2xl bg-white shadow-xs border border-emerald-100">
                {profile.startingAssessment.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Active Learning Path
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {profile.startingAssessment.overallScorePercent}% Starting Baseline
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 font-['Fredoka'] mt-0.5">
                  {profile.startingAssessment.pathTitle}
                </h4>
                <p className="text-xs text-slate-600 font-medium line-clamp-1">
                  {profile.startingAssessment.pathDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  sound.playPop();
                  onSelectSection('starting_assessment');
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-emerald-300 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>🌟 Growth Checkpoint</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50 border-2 border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 rounded-2xl bg-white shadow-xs border border-teal-100">
                🌱
              </span>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full inline-block mb-1">
                  Discover Your Starting Point
                </div>
                <h4 className="text-base font-extrabold text-slate-900 font-['Fredoka']">
                  🌱 Discover Your Learning Path
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  Take a 5-minute adventure to uncover your reading, spelling, and vocabulary superpowers!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playPop();
                onSelectSection('starting_assessment');
              }}
              className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-105 cursor-pointer shrink-0 font-['Fredoka']"
            >
              <span>✨ Let's Find My Starting Point</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* OVERALL GOAL PROGRESS BAR */}
        <div className="py-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <span className="text-base font-extrabold text-slate-800 font-['Fredoka']">
                {checklistData.completedCount} of {checklistData.totalCount} Goals Complete
              </span>
            </div>
            <div className="text-sm font-extrabold text-indigo-600 font-['Fredoka']">
              {checklistData.percent}%
            </div>
          </div>

          {/* Progress track */}
          <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className="bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-600 h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${checklistData.percent}%` }}
            />
          </div>

          {checklistData.isAllComplete && (
            <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All daily learning goals completed today! Protected your streak!</span>
              </div>
              <button
                onClick={() => setShowCelebrationModal(true)}
                className="text-xs font-extrabold text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
              >
                View Celebration 🎉
              </button>
            </div>
          )}
        </div>

        {/* INTELLIGENT "WHAT SHOULD I DO NEXT?" PERSONAL COACH */}
        <div className="my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 rounded-2xl bg-white shadow-xs">
              {recommendation.icon}
            </span>
            <div>
              <div className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider mb-0.5">
                🎯 What Should I Do Next?
              </div>
              <h4 className="text-base font-extrabold text-slate-800 font-['Fredoka']">
                {recommendation.title}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {recommendation.subtitle}
              </p>
            </div>
          </div>

          <button
            id="tracker-next-activity-btn"
            onClick={() => {
              sound.playPop();
              onSelectSection(recommendation.actionSection);
            }}
            className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 shrink-0 hover:scale-102"
          >
            <span>{recommendation.buttonLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 DAILY LEARNING CHECKLIST ITEMS */}
        <div className="space-y-3">
          <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
            Today's Activities Checklist
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {checklistData.items.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                  item.isComplete
                    ? 'bg-emerald-50/60 border-emerald-200/90'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">
                    {item.isComplete ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{item.icon}</span>
                      <h5
                        className={`text-sm font-extrabold truncate font-['Fredoka'] ${
                          item.isComplete ? 'text-emerald-900 line-through' : 'text-slate-800'
                        }`}
                      >
                        {item.title}
                      </h5>
                    </div>

                    <div className="text-xs text-slate-500 font-semibold mt-0.5">
                      {item.isComplete ? (
                        <span className="text-emerald-600 font-bold">Goal Completed!</span>
                      ) : (
                        <span>
                          {item.current} / {item.target} {item.unit}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  id={`checklist-action-${item.id}-btn`}
                  onClick={() => {
                    sound.playPop();
                    onSelectSection(item.actionSection);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                    item.isComplete
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                  }`}
                >
                  {item.actionLabel}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* WEEKLY ACTIVITY CALENDAR STREAK ROW */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                This Week's Activity
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              🏆 Longest Streak: <strong className="text-slate-800">{profile.longestReadingStreak || profile.streak || 7} Days</strong>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
            {weekDays.map((w) => (
              <div
                key={w.day}
                className={`py-2 px-1 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  w.isToday
                    ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
                    : w.completed
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-slate-50 border-slate-200/60'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 mb-1">{w.day}</span>
                <span className="text-base sm:text-lg">
                  {w.completed ? (w.isToday ? '⭐' : '🌸') : w.isFuture ? '⬜' : '🌱'}
                </span>
                {w.readingMinutes > 0 && (
                  <span className="text-[9px] font-bold text-orange-600 mt-0.5">
                    {w.readingMinutes}m
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* LEARNING HISTORY EXPANDER */}
        <div className="mt-5 pt-3 border-t border-slate-100">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between text-xs font-extrabold text-slate-500 hover:text-slate-800 cursor-pointer py-1"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>{showHistory ? 'Hide Learning History' : 'View Learning History & Past Days'}</span>
            </span>
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showHistory && (
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
              {/* Today's active record */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-800">Today ({todayActivity.date})</span>
                  <div className="text-slate-500 mt-0.5">
                    📖 {todayActivity.readingMinutes} min read • 🧠 {todayActivity.wordsLearned} words • 🎴 {todayActivity.flashcardsReviewed} cards
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                  {checklistData.completedCount}/{checklistData.totalCount} Goals
                </span>
              </div>

              {/* Past days */}
              {profile.learningHistory && profile.learningHistory.length > 0 ? (
                profile.learningHistory.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white border border-slate-100 text-xs flex items-center justify-between text-slate-600"
                  >
                    <div>
                      <span className="font-bold text-slate-700">{h.date}</span>
                      <div className="text-slate-400 mt-0.5">
                        📖 {h.readingMinutes} min read • 🧠 {h.wordsLearnedCount} words • 🎴 {h.flashcardsReviewedCount} cards • ✏️ {h.spellingWordsTestedCount} spelling
                      </div>
                    </div>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-3 text-xs text-slate-400">
                  Your daily activities are saved here as you complete reading, words, and flashcards!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Goal Customization Modal */}
      {showCustomizeModal && (
        <GoalCustomizeModal
          isOpen={showCustomizeModal}
          onClose={() => setShowCustomizeModal(false)}
          currentGoals={
            profile.dailyGoals || {
              readingMinutes: profile.dailyReadingGoalMinutes || 15,
              vocabularyWords: 5,
              flashcardsCount: 10,
              spellingWords: 5
            }
          }
          profileName={profile.name}
          onSave={(newGoals) => {
            onUpdateGoals(newGoals);
            setShowCustomizeModal(false);
          }}
        />
      )}

      {/* Celebration Modal */}
      {showCelebrationModal && (
        <DailyCelebrationModal
          isOpen={showCelebrationModal}
          onClose={() => setShowCelebrationModal(false)}
          profile={profile}
          activity={todayActivity}
          xpEarnedToday={125}
        />
      )}
    </div>
  );
};

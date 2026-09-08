import React from 'react';
import {
  Sparkles,
  Flame,
  Flower2,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Heart,
  Volume2,
  Award,
  Play,
  Compass,
  Palette,
  GraduationCap,
  Plus,
  Clock,
  Bookmark
} from 'lucide-react';
import {
  UserProfile,
  VocabWord,
  BibleWord,
  GardenPlot,
  AchievementBadge,
  AppSection
} from '../types';
import { getThemeConfig } from '../data/themes';
import { sound } from '../utils/audio';
import { triggerCelebrationConfetti, triggerSparkleConfetti } from '../utils/storage';

interface HomeDashboardProps {
  profile: UserProfile;
  vocabWords: VocabWord[];
  bibleWords: BibleWord[];
  gardenPlots: GardenPlot[];
  badges: AchievementBadge[];
  onSelectSection: (section: AppSection) => void;
  onAddXp: (amount: number) => void;
  onWaterPlot: (plotId: string) => void;
  onOpenThemes?: () => void;
  onOpenHomework?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  vocabWords,
  bibleWords,
  gardenPlots,
  badges,
  onSelectSection,
  onAddXp,
  onWaterPlot,
  onOpenThemes,
  onOpenHomework
}) => {
  const theme = getThemeConfig(profile.theme);

  // Spotlights
  const spotlightWord = vocabWords.find((w) => !w.mastered) || vocabWords[0];
  const dailyBibleWord = bibleWords[0];

  const unlockedPlots = gardenPlots.filter((p) => p.unlocked);
  const masteredPlots = gardenPlots.filter((p) => p.isMastered);

  // Homework words count
  const homeworkWords = vocabWords.filter((w) => w.isHomework);
  // Reading discovered words count
  const readingWords = vocabWords.filter((w) => w.sourceType === 'reading');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 font-['Quicksand']">
      {/* Dynamic Theme Greeting & Hero Banner */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${theme.heroGradient} p-6 sm:p-10 text-white shadow-xl border-2 border-white/20`}>
        {/* Floating Background Accents */}
        <div className="absolute top-3 right-6 text-5xl opacity-20 pointer-events-none select-none">
          {theme.icon}
        </div>
        <div className="absolute bottom-2 right-24 text-6xl opacity-20 pointer-events-none select-none">
          ✨
        </div>

        <div className="relative z-10 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/25 backdrop-blur-xs text-xs sm:text-sm font-extrabold mb-3">
            <span>✨</span>
            <span>Welcome to the adventure, {profile.name}!</span>
            <span>{theme.icon}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Fredoka'] mb-3 drop-shadow-xs">
            Ready to Explore Words & Stories Today?
          </h1>

          <p className="text-sm sm:text-base text-white/90 font-medium mb-6 leading-relaxed max-w-xl">
            {theme.description} Take a 5-minute adventure or open your real book for your 15-minute Reading Adventure!
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="hero-daily-adventure-btn"
              onClick={() => {
                sound.playPop();
                triggerSparkleConfetti();
                onSelectSection('daily_adventure');
              }}
              className="px-7 py-3.5 rounded-full bg-white text-slate-800 font-extrabold text-sm sm:text-base shadow-lg hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>⭐ Start Today's Adventure</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              id="hero-reading-adventure-btn"
              onClick={() => {
                sound.playPop();
                onSelectSection('reading_adventure');
              }}
              className="px-6 py-3.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-sm sm:text-base backdrop-blur-xs border border-white/40 cursor-pointer flex items-center gap-2 transition-all hover:scale-105"
            >
              <BookOpen className="w-5 h-5" />
              <span>📚 15-Min Reading Adventure</span>
            </button>

            {onOpenThemes && (
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenThemes();
                }}
                className="px-4 py-3.5 rounded-full bg-black/20 hover:bg-black/30 text-white font-bold text-xs backdrop-blur-xs border border-white/20 cursor-pointer flex items-center gap-1.5 transition-all"
                title="Change theme"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Theme: {theme.name}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DUAL FEATURE HIGHLIGHT: MY READING ADVENTURE & HOMEWORK WORDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. My Reading Adventure Banner */}
        <div className="bg-gradient-to-br from-amber-500/10 via-orange-50 to-pink-50 rounded-3xl p-6 border-2 border-orange-200/80 shadow-sm flex flex-col justify-between text-left relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-3 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                15-Minute Reading Adventure
              </span>
              <span className="text-xs font-extrabold text-orange-600 font-['Fredoka'] flex items-center gap-1">
                <Flame className="w-4 h-4 fill-orange-500" />
                {profile.readingStreak} Day Streak!
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-['Fredoka']">
              Read Real Books & Collect Words
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Open your book offline! Start the companion timer, notice unfamiliar words with one tap, and review their meanings after your session.
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold pt-1">
              <span>⏱️ Goal: 15 mins</span>
              <span>•</span>
              <span>🔍 {readingWords.length} Discovered Words</span>
              <span>•</span>
              <span>🎵 Calming Audio</span>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-orange-200/60 flex items-center justify-between">
            <button
              id="card-start-reading-btn"
              onClick={() => {
                sound.playPop();
                onSelectSection('reading_adventure');
              }}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-200 cursor-pointer flex items-center gap-2"
            >
              <span>▶ Start Reading Timer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-orange-600 font-bold hidden sm:inline">
              +30 XP per session
            </span>
          </div>
        </div>

        {/* 2. School Homework Practice Banner */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-3xl p-6 border-2 border-indigo-200/80 shadow-sm flex flex-col justify-between text-left relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                School Homework Practice
              </span>
              <span className="text-xs font-bold text-indigo-600">
                {homeworkWords.length} Active {homeworkWords.length === 1 ? 'Word' : 'Words'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-['Fredoka']">
              Have Homework Words to Practice?
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Enter spelling lists, Friday test words, or school vocabulary so they appear in your interactive spelling games and daily adventures!
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold pt-1">
              <span>🎒 Prioritized in Spelling Games</span>
              <span>•</span>
              <span>📝 Test Prep Ready</span>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-indigo-200/60 flex items-center justify-between">
            <button
              id="card-add-homework-btn"
              onClick={() => {
                sound.playPop();
                if (onOpenHomework) onOpenHomework();
              }}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-200 cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Homework Words</span>
            </button>
            <button
              onClick={() => {
                sound.playPop();
                onSelectSection('spelling_adventure');
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Practice Spelling →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Progress Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Learning Streak */}
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-100 shadow-xs hover:border-slate-300 transition-all text-left">
          <div className="flex items-center justify-between text-orange-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Learning Streak
            </span>
            <Flame className="w-5 h-5 fill-orange-400 text-orange-500" />
          </div>
          <p className="text-3xl font-extrabold text-orange-600 font-['Fredoka']">
            {profile.streak} <span className="text-sm font-semibold text-slate-400">Days</span>
          </p>
          <p className="text-[11px] text-orange-500 font-semibold mt-1">
            Keep learning daily!
          </p>
        </div>

        {/* Knowledge XP */}
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-100 shadow-xs hover:border-slate-300 transition-all text-left">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Knowledge XP
            </span>
            <Sparkles className="w-5 h-5 fill-amber-300 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600 font-['Fredoka']">
            {profile.xp} <span className="text-sm font-semibold text-slate-400">XP</span>
          </p>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">
            Level {profile.level} Explorer
          </p>
        </div>

        {/* World Collection / Theme Metaphor */}
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-100 shadow-xs hover:border-slate-300 transition-all text-left">
          <div className="flex items-center justify-between text-pink-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {theme.worldMetaphor.worldName}
            </span>
            <span className="text-lg">{theme.worldMetaphor.statusIcon}</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-800 font-['Fredoka']">
            {unlockedPlots.length}{' '}
            <span className="text-sm font-semibold text-slate-400">/ {gardenPlots.length}</span>
          </p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            {masteredPlots.length} Mastered Areas
          </p>
        </div>

        {/* Badges */}
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-100 shadow-xs hover:border-slate-300 transition-all text-left">
          <div className="flex items-center justify-between text-purple-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Badges Won
            </span>
            <Award className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-extrabold text-purple-700 font-['Fredoka']">
            {badges.filter((b) => b.unlocked).length}{' '}
            <span className="text-sm font-semibold text-slate-400">/ {badges.length}</span>
          </p>
          <p className="text-[11px] text-purple-500 font-semibold mt-1">
            Trophies on your shelf
          </p>
        </div>
      </div>

      {/* Spotlights: Vocabulary Word of the Day & Bible Word of the Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* Vocab Spotlight */}
        {spotlightWord && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                  {theme.icon} Word Spotlight
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {spotlightWord.category}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Fredoka'] capitalize">
                    {spotlightWord.word}
                  </h3>
                  <p className="text-xs text-pink-500 italic">/{spotlightWord.pronunciation}/</p>
                </div>

                <button
                  onClick={() => sound.speak(spotlightWord.word)}
                  className="px-3.5 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" /> Listen
                </button>
              </div>

              <p className="text-sm text-slate-700 font-medium mb-3">
                {spotlightWord.definition}
              </p>

              <p className="text-xs sm:text-sm text-slate-600 italic bg-slate-50 p-3 rounded-2xl border border-slate-100">
                "{spotlightWord.exampleSentence}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  sound.playPop();
                  onSelectSection('review_garden');
                }}
                className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Explore Word Library</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-slate-400">Grade 4–5 Wonders</span>
            </div>
          </div>
        )}

        {/* Bible Word Spotlight */}
        {dailyBibleWord && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  ✝️ Faith Word of the Day
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {dailyBibleWord.scriptureReference}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Fredoka'] capitalize">
                    {dailyBibleWord.word}
                  </h3>
                  <p className="text-xs text-purple-500 italic">/{dailyBibleWord.pronunciation}/</p>
                </div>

                <button
                  onClick={() => sound.speak(dailyBibleWord.word)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" /> Listen
                </button>
              </div>

              <p className="text-sm text-slate-700 font-medium mb-3">
                {dailyBibleWord.childDefinition}
              </p>

              <p className="text-xs sm:text-sm text-purple-800 italic bg-purple-50/60 p-3 rounded-2xl border border-purple-100">
                "{dailyBibleWord.scriptureVerse}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  sound.playPop();
                  onSelectSection('faith_garden');
                }}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Visit Faith Garden</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-purple-600">Peace & Kindness</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Launch Activities Bento */}
      <div className="text-left">
        <h3 className="text-xl font-extrabold text-slate-800 font-['Fredoka'] mb-4 flex items-center gap-2">
          <span>🎮</span> Learning Centers & Adventures
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 'reading_adventure',
              title: 'Reading Adventure',
              desc: '15-min focus companion timer with instant word discovery & offline reading.',
              icon: '📚',
              badge: 'Offline Habit',
              color: 'from-amber-400 to-orange-400'
            },
            {
              id: 'spelling_adventure',
              title: 'Spelling Adventure',
              desc: 'Spell word blossoms, pick letter flowers, and defeat mystery letters.',
              icon: '✏️',
              badge: 'Games & Practice',
              color: 'from-pink-500 to-rose-400'
            },
            {
              id: 'reading_room',
              title: 'Cozy Reading Room',
              desc: 'Heartwarming stories with clickable definition flowers & comprehension.',
              icon: '📖',
              badge: 'Comprehension',
              color: 'from-purple-500 to-pink-400'
            },
            {
              id: 'garden',
              title: theme.worldMetaphor.worldName,
              desc: theme.description,
              icon: theme.worldMetaphor.statusIcon,
              badge: 'Living World',
              color: 'from-rose-400 to-amber-300'
            },
            {
              id: 'faith_garden',
              title: 'Faith & Word Garden',
              desc: 'Bible words explained with scripture, real-life examples, and wisdom.',
              icon: '✝️',
              badge: 'Scripture & Life',
              color: 'from-indigo-400 to-purple-400'
            },
            {
              id: 'review_garden',
              title: 'Word Library & Dictionary',
              desc: 'Browse 50+ Wonders words, filter homework words, and add new discoveries.',
              icon: '🔍',
              badge: 'Word Collection',
              color: 'from-emerald-400 to-teal-400'
            }
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => {
                sound.playPop();
                onSelectSection(item.id as AppSection);
              }}
              className="bg-white rounded-3xl p-5 border-2 border-slate-100 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform block">
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>
                <h4 className="font-extrabold text-base text-slate-800 font-['Fredoka'] mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-indigo-600 gap-1 group-hover:translate-x-1 transition-transform">
                <span>Open Activity</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

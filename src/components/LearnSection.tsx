import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Search,
  Plus,
  Flame,
  Bookmark,
  Heart,
  RotateCcw,
  Check,
  Star,
  Mic,
  PenTool,
  MessageSquare,
  HelpCircle,
  Clock,
  Layers,
  GraduationCap,
  X
} from 'lucide-react';
import {
  UserProfile,
  VocabWord,
  BibleWord,
  AppSection,
  MasteryLevel,
  DailyGoalConfig
} from '../types';
import { sound } from '../utils/audio';
import { triggerSparkleConfetti, triggerCelebrationConfetti } from '../utils/storage';
import { getThemeConfig } from '../data/themes';
import { getMasteryIcon, getMasteryLabel } from '../utils/adaptive';
import { getSyllables, getMemoryTip } from '../utils/dailyLearningHelper';

interface LearnSectionProps {
  profile: UserProfile;
  vocabWords: VocabWord[];
  bibleWords: BibleWord[];
  onSelectSection: (section: AppSection) => void;
  onUpdateWordScore: (word: VocabWord, isCorrect: boolean) => void;
  onAddNewWord: (word: VocabWord) => void;
  onAddXp: (amount: number) => void;
  onOpenHomework?: () => void;
  onOpenThemes?: () => void;
}

type VocabTab = 'all' | 'new' | 'my_words' | 'bible' | 'wonders' | 'mastered';

export const LearnSection: React.FC<LearnSectionProps> = ({
  profile,
  vocabWords,
  bibleWords,
  onSelectSection,
  onUpdateWordScore,
  onAddNewWord,
  onAddXp,
  onOpenHomework,
  onOpenThemes
}) => {
  const theme = getThemeConfig(profile.theme);

  // Vocabulary Tab & Filter
  const [activeTab, setActiveTab] = useState<VocabTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'challenging'>('all');

  // Word Detail Modal state
  const [selectedWord, setSelectedWord] = useState<VocabWord | null>(null);
  const [selectedBibleWord, setSelectedBibleWord] = useState<BibleWord | null>(null);
  const [activeActionTab, setActiveActionTab] = useState<'hear' | 'say' | 'spell' | 'use'>('hear');

  // Spelling quick-test inside Word Detail
  const [spellInput, setSpellInput] = useState('');
  const [spellFeedback, setSpellFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  // Say-It Pronunciation simulation state
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  // Add Custom Word Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWordText, setNewWordText] = useState('');
  const [newWordDef, setNewWordDef] = useState('');
  const [newWordExample, setNewWordExample] = useState('');
  const [newWordPos, setNewWordPos] = useState<'noun' | 'verb' | 'adjective' | 'adverb'>('noun');

  // Count stats
  const newWordsCount = vocabWords.filter((w) => !w.mastered && w.timesPracticed === 0).length;
  const myWordsList = vocabWords.filter((w) => w.sourceType === 'reading' || w.isCustom || w.isHomework);
  const masteredCount = vocabWords.filter((w) => w.mastered || w.masteryLevel === 'mastered').length;

  // Filtered words
  const filteredWords = useMemo(() => {
    return vocabWords.filter((w) => {
      // Tab filter
      if (activeTab === 'new' && (w.mastered || w.timesPracticed > 0)) return false;
      if (activeTab === 'my_words' && !(w.sourceType === 'reading' || w.isCustom || w.isHomework)) return false;
      if (activeTab === 'wonders' && !w.source?.includes('Wonders')) return false;
      if (activeTab === 'mastered' && !w.mastered) return false;

      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchWord = w.word.toLowerCase().includes(query);
        const matchDef = w.definition.toLowerCase().includes(query);
        const matchCat = w.category.toLowerCase().includes(query);
        if (!matchWord && !matchDef && !matchCat) return false;
      }

      // Difficulty
      if (difficultyFilter !== 'all' && w.difficulty !== difficultyFilter) {
        return false;
      }

      return true;
    });
  }, [vocabWords, activeTab, searchQuery, difficultyFilter]);

  // Open Word Detail
  const handleOpenWordDetail = (word: VocabWord) => {
    sound.playPop();
    setSelectedWord(word);
    setSelectedBibleWord(null);
    setActiveActionTab('hear');
    setSpellInput('');
    setSpellFeedback('idle');
    setHasRecorded(false);
    setIsRecording(false);
    sound.speak(word.word);
  };

  const handleOpenBibleWordDetail = (bWord: BibleWord) => {
    sound.playPop();
    setSelectedBibleWord(bWord);
    setSelectedWord(null);
    sound.speak(bWord.word);
  };

  const handleHearWord = (text: string) => {
    sound.speak(text);
  };

  const handleTestSpelling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWord) return;
    const isCorrect = spellInput.trim().toLowerCase() === selectedWord.word.toLowerCase();
    if (isCorrect) {
      sound.playSuccessChime();
      triggerSparkleConfetti();
      setSpellFeedback('correct');
      onUpdateWordScore(selectedWord, true);
      onAddXp(10);
    } else {
      sound.playEncourageSound();
      setSpellFeedback('incorrect');
      onUpdateWordScore(selectedWord, false);
    }
  };

  const handleSayItSimulation = () => {
    sound.playPop();
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
      sound.playSuccessChime();
      onAddXp(5);
    }, 1800);
  };

  const handleToggleMyWords = (word: VocabWord) => {
    sound.playPop();
    const isAlready = word.sourceType === 'reading' || word.isCustom;
    const updated = {
      ...word,
      sourceType: isAlready ? 'standard' : ('custom' as const),
      isCustom: !isAlready
    };
    onAddNewWord(updated);
    setSelectedWord(updated);
  };

  const handleSaveCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordText.trim() || !newWordDef.trim()) return;

    sound.playSuccessChime();
    triggerSparkleConfetti();

    const created: VocabWord = {
      id: `custom-${Date.now()}`,
      word: newWordText.trim().toLowerCase(),
      definition: newWordDef.trim(),
      pronunciation: newWordText.trim(),
      partOfSpeech: newWordPos,
      exampleSentence: newWordExample.trim() || `The word "${newWordText}" was added to my learning list.`,
      synonyms: [],
      difficulty: 'medium',
      category: 'My Words',
      gradeLevel: 4,
      mastered: false,
      masteryLevel: 'new',
      timesPracticed: 0,
      correctCount: 0,
      incorrectCount: 0,
      lastPracticedDate: null,
      isCustom: true,
      sourceType: 'custom'
    };

    onAddNewWord(created);
    setShowAddModal(false);
    setNewWordText('');
    setNewWordDef('');
    setNewWordExample('');
  };

  // Determine time-appropriate greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 font-['Quicksand']">
      {/* 1. Welcoming Hero Banner */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${theme.heroGradient || 'from-stone-900 via-amber-950 to-stone-900'} p-6 sm:p-10 text-white shadow-xl border-2 border-white/10`}>
        <div className="relative z-10 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-xs sm:text-sm font-bold mb-3 backdrop-blur-xs">
            <span>{theme.icon || '✨'}</span>
            <span>{getGreeting()}, {profile.name}! • {theme.name}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Fredoka'] mb-2 drop-shadow-xs">
            What are we learning today?
          </h1>

          <p className="text-sm sm:text-base text-stone-200/90 font-medium mb-6 leading-relaxed max-w-xl">
            {theme.learningExperience?.todayPathSubtitle || 'Choose a guided path below or explore new vocabulary words at your own pace.'}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sound.playPop();
                triggerSparkleConfetti();
                onSelectSection('flashcards');
              }}
              className={`px-6 py-3 rounded-full ${theme.buttonGradient} font-extrabold text-sm sm:text-base shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2`}
            >
              <span>⭐ Start Daily Practice</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onSelectSection('read');
              }}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Read for 15 Mins</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                if (onOpenThemes) onOpenThemes();
              }}
              className="px-5 py-3 rounded-full bg-black/25 hover:bg-black/40 text-white text-xs sm:text-sm font-semibold border border-white/20 cursor-pointer flex items-center gap-1.5 backdrop-blur-xs"
            >
              <span>{theme.icon}</span>
              <span>Theme: {theme.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Today's Learning Path (Clear, Actionable Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{theme.icon || '🧭'}</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-800 font-['Fredoka']">
                {theme.learningExperience?.todayPathTitle || "Today's Learning Path"}
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                {theme.learningExperience?.todayPathSubtitle || 'Four guided actions designed to build vocabulary, spelling, and reading stamina.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Learn 5 New Words */}
          <div
            onClick={() => {
              sound.playPop();
              setActiveTab('new');
              const firstNew = vocabWords.find((w) => !w.mastered);
              if (firstNew) handleOpenWordDetail(firstNew);
            }}
            className="group p-5 rounded-2xl bg-white border-2 border-amber-200/80 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                📚
              </div>
              <h3 className="font-extrabold text-base text-stone-800 font-['Fredoka'] mb-1">
                Learn 5 New Words
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Discover pronunciations, meanings, and examples for unfamiliar words.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>{newWordsCount} words waiting</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 2: Practice Words */}
          <div
            onClick={() => {
              sound.playPop();
              onSelectSection('practice');
            }}
            className="group p-5 rounded-2xl bg-white border-2 border-emerald-200/80 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                ✏️
              </div>
              <h3 className="font-extrabold text-base text-stone-800 font-['Fredoka'] mb-1">
                Practice 6 Words
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Reinforce spelling, memory tips, and definition recall through challenges.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Flashcards & Spelling</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 3: Read for 15 Minutes */}
          <div
            onClick={() => {
              sound.playPop();
              onSelectSection('read');
            }}
            className="group p-5 rounded-2xl bg-white border-2 border-sky-200/80 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                📖
              </div>
              <h3 className="font-extrabold text-base text-stone-800 font-['Fredoka'] mb-1">
                Read for 15 Minutes
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Pick up a physical book with a calm companion timer and log discoveries.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-sky-700">
              <span>{profile.totalReadingMinutes} mins read total</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 4: Weekly Assessment */}
          <div
            onClick={() => {
              sound.playPop();
              onSelectSection('test');
            }}
            className="group p-5 rounded-2xl bg-white border-2 border-purple-200/80 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="font-extrabold text-base text-stone-800 font-['Fredoka'] mb-1">
                Check My Growth
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                See what you've learned and discover exactly which words to practice next.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>Weekly Test & Focus</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. VOCABULARY EXPLORER (Data-driven, full Wonders Glossary + Bible + My Words) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-200/80 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 font-['Fredoka'] flex items-center gap-2">
              <span>📖 Vocabulary Library</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                {vocabWords.length} words
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Includes Wonders McGraw-Hill grade-level words, reading discoveries, and faith vocabulary.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playPop();
                setShowAddModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Word</span>
            </button>
            {onOpenHomework && (
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenHomework();
                }}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-200 cursor-pointer flex items-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4 text-stone-600" />
                <span>Homework</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 pb-4">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Words ({vocabWords.length})
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('new');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'new'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>🆕 New Words</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-200/50 text-amber-900 font-mono">
              {newWordsCount}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('my_words');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'my_words'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>🏷️ My Words</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-200/50 text-sky-900 font-mono">
              {myWordsList.length}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('bible');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bible'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>📜 Bible Words</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-200/50 text-purple-900 font-mono">
              {bibleWords.length}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('wonders');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'wonders'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Wonders Glossary
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('mastered');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'mastered'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>👑 Mastered</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-200/50 text-emerald-900 font-mono">
              {masteredCount}
            </span>
          </button>
        </div>

        {/* Search and Difficulty Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search words, meanings, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-stone-50/50"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs text-stone-400 font-semibold hidden sm:inline">Difficulty:</span>
            {(['all', 'easy', 'medium', 'challenging'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                  difficultyFilter === diff
                    ? 'bg-stone-800 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Words Grid or Bible Words View */}
        {activeTab === 'bible' ? (
          /* Bible Words Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bibleWords.map((bWord) => (
              <div
                key={bWord.id}
                onClick={() => handleOpenBibleWordDetail(bWord)}
                className="p-5 rounded-2xl border-2 border-purple-100 bg-purple-50/20 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                      {bWord.scriptureReference}
                    </span>
                    {bWord.mastered && (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-extrabold text-stone-900 font-['Fredoka']">
                    {bWord.word}
                  </h3>
                  <p className="text-xs text-stone-500 italic mt-0.5">
                    /{bWord.pronunciation}/
                  </p>
                  <p className="text-xs sm:text-sm text-stone-700 mt-2 line-clamp-2 leading-relaxed">
                    {bWord.childDefinition}
                  </p>
                </div>
                <div className="pt-2 border-t border-purple-100/60 flex items-center justify-between text-xs font-bold text-purple-700">
                  <span>Scripture & Practice</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredWords.length === 0 ? (
          <div className="py-12 text-center text-stone-400 space-y-2">
            <p className="text-base font-semibold">No words match your current filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
                setDifficultyFilter('all');
              }}
              className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          /* Standard Vocab Words Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWords.map((word) => (
              <div
                key={word.id}
                onClick={() => handleOpenWordDetail(word)}
                className="p-5 rounded-2xl border-2 border-stone-200/80 bg-white hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full">
                        {word.partOfSpeech}
                      </span>
                      {word.isHomework && (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                          🎒 Homework
                        </span>
                      )}
                      {word.sourceType === 'reading' && (
                        <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                          📖 Book
                        </span>
                      )}
                    </div>
                    <span className="text-xs" title={getMasteryLabel(word.masteryLevel)}>
                      {getMasteryIcon(word.masteryLevel)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-2xl font-extrabold text-stone-900 font-['Fredoka'] group-hover:text-amber-800 transition-colors">
                      {word.word}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.speak(word.word);
                      }}
                      className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                      title="Hear pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-500 italic mt-0.5">
                    /{word.pronunciation}/
                  </p>

                  <p className="text-xs sm:text-sm text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                    {word.definition}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-400">
                  <span className="capitalize">{word.difficulty} • Grade {word.gradeLevel}</span>
                  <span className="text-amber-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Study <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. WORD DETAIL MODAL (Progressive Disclosure: Hear It, Say It, Spell It, Use It) */}
      {selectedWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto text-left relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedWord(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header: Word & Primary Meta */}
            <div className="space-y-2 pr-12">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
                  {selectedWord.partOfSpeech}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 capitalize">
                  {selectedWord.difficulty}
                </span>
                <span className="text-xs font-bold text-stone-400">
                  Grade {selectedWord.gradeLevel}
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-stone-900 font-['Fredoka'] tracking-tight">
                  {selectedWord.word.toUpperCase()}
                </h2>
                <span className="text-base text-stone-500 font-medium italic">
                  /{selectedWord.pronunciation}/
                </span>
              </div>

              {/* Definition */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 mt-3">
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                  Definition
                </div>
                <p className="text-base sm:text-lg font-bold text-stone-800 leading-relaxed">
                  {selectedWord.definition}
                </p>
              </div>

              {/* Example */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-700 italic">
                "{selectedWord.exampleSentence}"
              </div>
            </div>

            {/* 4 Interactive Learning Actions */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">
                Practice Actions
              </div>

              <div className="grid grid-cols-4 gap-2 border-b border-stone-100 pb-3">
                {[
                  { id: 'hear', label: 'Hear It', icon: Volume2 },
                  { id: 'say', label: 'Say It', icon: Mic },
                  { id: 'spell', label: 'Spell It', icon: PenTool },
                  { id: 'use', label: 'Use It', icon: MessageSquare }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      sound.playPop();
                      setActiveActionTab(id as any);
                      if (id === 'hear') sound.speak(selectedWord.word);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                      activeActionTab === id
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Interactive Panel Content */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                {activeActionTab === 'hear' && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-stone-800 text-sm">Listen to Pronunciation</h4>
                      <p className="text-xs text-stone-500">Listen clearly to phonetic syllables: {getSyllables(selectedWord.word)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => sound.speak(selectedWord.word)}
                        className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer flex items-center gap-2"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Speak Word</span>
                      </button>
                      <button
                        onClick={() => sound.speak(selectedWord.exampleSentence)}
                        className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 cursor-pointer"
                      >
                        Hear Sentence
                      </button>
                    </div>
                  </div>
                )}

                {activeActionTab === 'say' && (
                  <div className="space-y-3 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-stone-800 text-sm">Practice Saying It</h4>
                        <p className="text-xs text-stone-500">Break down the word: <span className="font-mono font-bold text-amber-800">{getSyllables(selectedWord.word)}</span></p>
                      </div>
                      <button
                        onClick={handleSayItSimulation}
                        disabled={isRecording}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                          isRecording
                            ? 'bg-rose-500 text-white animate-pulse'
                            : hasRecorded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-900 text-white hover:bg-stone-800'
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                        <span>{isRecording ? 'Listening...' : hasRecorded ? 'Great Pronunciation! (Repeat)' : 'Tap to Say It'}</span>
                      </button>
                    </div>
                    {hasRecorded && (
                      <p className="text-xs font-bold text-emerald-700">
                        ✓ Excellent cadence and vocal clarity! +5 XP
                      </p>
                    )}
                  </div>
                )}

                {activeActionTab === 'spell' && (
                  <form onSubmit={handleTestSpelling} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-stone-800 text-sm">Quick Spelling Practice</h4>
                      <button
                        type="button"
                        onClick={() => sound.speak(selectedWord.word)}
                        className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Hear Word Again
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type spelling..."
                        value={spellInput}
                        onChange={(e) => {
                          setSpellInput(e.target.value);
                          setSpellFeedback('idle');
                        }}
                        className="flex-1 px-4 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
                      >
                        Check
                      </button>
                    </div>

                    {spellFeedback === 'correct' && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2 border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Correct! You spelled {selectedWord.word} perfectly. +10 XP</span>
                      </div>
                    )}
                    {spellFeedback === 'incorrect' && (
                      <div className="p-2.5 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold flex items-center gap-2 border border-rose-200">
                        <span>Not quite. Let's try again! (The word has {selectedWord.word.length} letters)</span>
                      </div>
                    )}
                  </form>
                )}

                {activeActionTab === 'use' && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-stone-800 text-sm">Memory Tip & Usage</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      💡 <strong>Tip:</strong> {getMemoryTip(selectedWord.word, selectedWord.definition)}
                    </p>
                    <p className="text-xs text-stone-500">
                      Try using <strong>{selectedWord.word}</strong> in a sentence at dinner or in your daily reading journal!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Progressive Disclosure: Related Words & Controls */}
            <div className="pt-4 border-t border-stone-200 space-y-4">
              {/* Related Words */}
              {selectedWord.synonyms && selectedWord.synonyms.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Related Words & Synonyms:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedWord.synonyms.map((syn) => (
                      <span
                        key={syn}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: Add to My Words, Flashcards */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => handleToggleMyWords(selectedWord)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    selectedWord.sourceType === 'reading' || selectedWord.isCustom
                      ? 'bg-sky-100 text-sky-800 border border-sky-300'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>
                    {selectedWord.sourceType === 'reading' || selectedWord.isCustom
                      ? '✓ Saved in My Words'
                      : '+ Add to My Words'}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedWord(null);
                      onSelectSection('flashcards');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Practice with Flashcards</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. BIBLE WORD DETAIL MODAL */}
      {selectedBibleWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-purple-200 space-y-6 max-h-[90vh] overflow-y-auto text-left relative">
            <button
              onClick={() => setSelectedBibleWord(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 pr-12">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                Biblical Vocabulary
              </span>

              <div className="flex items-baseline gap-3">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-stone-900 font-['Fredoka']">
                  {selectedBibleWord.word}
                </h2>
                <span className="text-base text-stone-500 font-medium italic">
                  /{selectedBibleWord.pronunciation}/
                </span>
                <button
                  onClick={() => sound.speak(selectedBibleWord.word)}
                  className="p-1.5 rounded-full hover:bg-purple-50 text-purple-700 cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Meaning */}
              <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 mt-3">
                <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider mb-1">
                  Heart Meaning
                </div>
                <p className="text-base font-bold text-stone-800 leading-relaxed">
                  {selectedBibleWord.childDefinition}
                </p>
              </div>

              {/* Scripture verse */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <div className="text-xs font-extrabold text-purple-800 flex items-center justify-between">
                  <span>Scripture Verse</span>
                  <span className="text-stone-500 font-semibold">{selectedBibleWord.scriptureReference}</span>
                </div>
                <p className="text-sm text-stone-700 italic">
                  "{selectedBibleWord.scriptureVerse}"
                </p>
              </div>

              {/* Real Life Example */}
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-1">
                <div className="text-xs font-extrabold text-amber-800">
                  Real Life Example
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {selectedBibleWord.realLifeExample}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedBibleWord(null);
                  onSelectSection('faith_garden');
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold cursor-pointer flex items-center gap-2"
              >
                <span>Full Faith Garden Study</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. ADD CUSTOM WORD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-stone-200 space-y-5 text-left relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-2xl font-extrabold text-stone-900 font-['Fredoka']">
                Add New Word to Library
              </h3>
              <p className="text-xs text-stone-500">
                Add words from class, physical books, or everyday reading.
              </p>
            </div>

            <form onSubmit={handleSaveCustomWord} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  Word
                </label>
                <input
                  type="text"
                  placeholder="e.g., magnificent, reluctant, persevere"
                  value={newWordText}
                  onChange={(e) => setNewWordText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  Part of Speech
                </label>
                <select
                  value={newWordPos}
                  onChange={(e) => setNewWordPos(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value="noun">Noun</option>
                  <option value="verb">Verb</option>
                  <option value="adjective">Adjective</option>
                  <option value="adverb">Adverb</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  Definition (What does it mean?)
                </label>
                <textarea
                  placeholder="Explain simply in your own words..."
                  value={newWordDef}
                  onChange={(e) => setNewWordDef(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500/30"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  Example Sentence (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Use the word in a sentence..."
                  value={newWordExample}
                  onChange={(e) => setNewWordExample(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Save to My Words
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

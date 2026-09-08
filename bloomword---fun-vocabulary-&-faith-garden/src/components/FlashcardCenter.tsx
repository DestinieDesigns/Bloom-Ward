import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  RotateCw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Smile,
  Frown,
  Shuffle,
  Award,
  BookOpen,
  Filter,
  Check,
  Flame,
  Star
} from 'lucide-react';
import { VocabWord, UserProfile } from '../types';
import { sound } from '../utils/audio';
import {
  getSyllables,
  getMemoryTip,
  getSpellingBreakdown
} from '../utils/dailyLearningHelper';
import { triggerSparkleConfetti, triggerCelebrationConfetti } from '../utils/storage';

interface FlashcardCenterProps {
  words: VocabWord[];
  profile: UserProfile;
  onUpdateWordScore: (word: VocabWord, isCorrect: boolean) => void;
  onAddXp: (amount: number) => void;
  onFlashcardReviewed?: (count: number) => void;
  onBackToHome: () => void;
}

type FilterType = 'all' | 'due' | 'needs_help' | 'mastered';

export const FlashcardCenter: React.FC<FlashcardCenterProps> = ({
  words,
  profile,
  onUpdateWordScore,
  onAddXp,
  onFlashcardReviewed,
  onBackToHome
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [reviewedSessionIds, setReviewedSessionIds] = useState<string[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [showConfidence, setShowConfidence] = useState<boolean>(false);

  // Filter words according to chosen tab
  const filteredWords = words.filter((w) => {
    if (activeFilter === 'due') {
      return !w.mastered || (w.incorrectCount > 0);
    }
    if (activeFilter === 'needs_help') {
      return w.incorrectCount > 0 && !w.mastered;
    }
    if (activeFilter === 'mastered') {
      return w.mastered || w.masteryLevel === 'mastered';
    }
    return true; // 'all'
  });

  const activeWordList = filteredWords.length > 0 ? filteredWords : words;
  const currentWord = activeWordList[currentIndex] || activeWordList[0];

  // Auto pronounce word on first reveal
  useEffect(() => {
    if (currentWord) {
      setIsFlipped(false);
      setShowConfidence(false);
      const timer = setTimeout(() => {
        sound.speak(currentWord.word);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, activeFilter]);

  const handleFlip = () => {
    sound.playPop();
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    if (nextFlipped) {
      setShowConfidence(true);
    }
  };

  const handleSpeak = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.speak(currentWord.word);
  };

  const handleConfidenceRating = (rating: 'learning' | 'getting_it' | 'known') => {
    sound.playPop();

    // Track in session
    if (!reviewedSessionIds.includes(currentWord.id)) {
      setReviewedSessionIds((prev) => [...prev, currentWord.id]);
      if (onFlashcardReviewed) {
        onFlashcardReviewed(1);
      }
    }

    if (rating === 'known') {
      sound.playSuccessChime();
      triggerSparkleConfetti();
      onAddXp(10);
      onUpdateWordScore(currentWord, true);
    } else if (rating === 'getting_it') {
      sound.playSuccessChime();
      onAddXp(5);
      onUpdateWordScore(currentWord, true);
    } else {
      sound.playEncourageSound();
      onAddXp(2);
      onUpdateWordScore(currentWord, false);
    }

    // Advance to next card or complete session
    if (currentIndex + 1 >= activeWordList.length) {
      setSessionCompleted(true);
      triggerCelebrationConfetti();
    } else {
      setIsFlipped(false);
      setShowConfidence(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    sound.playPop();
    if (currentIndex + 1 < activeWordList.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    sound.playPop();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleShuffle = () => {
    sound.playPop();
    setCurrentIndex(Math.floor(Math.random() * activeWordList.length));
  };

  const handleRestartSession = () => {
    sound.playPop();
    setSessionCompleted(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowConfidence(false);
  };

  const syllables = getSyllables(currentWord.word);
  const memoryTip = getMemoryTip(currentWord.word, currentWord.definition);
  const spellingBreakdown = getSpellingBreakdown(currentWord.word);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 font-['Quicksand'] text-left">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border-2 border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-extrabold text-xs uppercase tracking-wider">
              Spaced Repetition Flashcards
            </span>
            <span className="text-xs text-slate-400 font-bold">
              Card {currentIndex + 1} of {activeWordList.length}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-['Fredoka']">
            🎴 My Flashcards Learning Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Hear pronunciations, discover syllables, flip cards, and master words with confidence!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Shuffle Cards"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          <button
            onClick={onBackToHome}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors cursor-pointer"
          >
            Home Dashboard
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setActiveFilter('all');
            setCurrentIndex(0);
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Cards ({words.length})
        </button>
        <button
          onClick={() => {
            setActiveFilter('due');
            setCurrentIndex(0);
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'due'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>⏱️ Due for Review</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/30">
            {words.filter((w) => !w.mastered).length}
          </span>
        </button>
        <button
          onClick={() => {
            setActiveFilter('needs_help');
            setCurrentIndex(0);
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'needs_help'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>⚠️ Needs Practice</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/30">
            {words.filter((w) => w.incorrectCount > 0 && !w.mastered).length}
          </span>
        </button>
        <button
          onClick={() => {
            setActiveFilter('mastered');
            setCurrentIndex(0);
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'mastered'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>👑 Mastered</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/30">
            {words.filter((w) => w.mastered).length}
          </span>
        </button>
      </div>

      {sessionCompleted ? (
        /* Completed Summary View */
        <div className="bg-white rounded-3xl p-8 border-2 border-emerald-200 text-center shadow-lg space-y-5">
          <div className="inline-flex p-4 rounded-3xl bg-emerald-100 text-emerald-600 text-3xl">
            🏆
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 font-['Fredoka']">
            Flashcard Session Complete!
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            You reviewed {reviewedSessionIds.length} cards today! Your mind is absorbing new vocabulary and your garden is blooming with fresh energy.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestartSession}
              className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md cursor-pointer flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              <span>Review Another Round</span>
            </button>
            <button
              onClick={onBackToHome}
              className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md cursor-pointer"
            >
              Back to Daily Tracker
            </button>
          </div>
        </div>
      ) : (
        /* Active Flashcard Interactive Flip Card */
        <div className="space-y-4">
          {/* Card Presentation with 3D Flip */}
          <div
            onClick={handleFlip}
            className="w-full min-h-[380px] sm:min-h-[420px] rounded-3xl cursor-pointer perspective-1000 relative select-none"
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full h-full min-h-[380px] sm:min-h-[420px] relative rounded-3xl preserve-3d"
            >
              {/* FRONT OF FLASHCARD */}
              <div
                className={`absolute inset-0 backface-hidden bg-white rounded-3xl p-6 sm:p-10 border-4 border-indigo-200/90 shadow-xl flex flex-col justify-between text-center overflow-hidden ${
                  isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                {/* Decorative background watermarks */}
                <div className="absolute top-4 left-6 text-xs font-extrabold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  {currentWord.category || 'Vocabulary Word'}
                </div>

                <div className="absolute top-4 right-6 text-xs font-bold text-slate-400 flex items-center gap-1">
                  <span>Grade {currentWord.gradeLevel}</span>
                  <span>•</span>
                  <span className="capitalize">{currentWord.difficulty}</span>
                </div>

                {/* Word Center */}
                <div className="my-auto py-6 space-y-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    THE WORD
                  </div>

                  <h2 className="text-4xl sm:text-6xl font-extrabold text-slate-900 font-['Fredoka'] tracking-wide">
                    {currentWord.word.toUpperCase()}
                  </h2>

                  {/* Syllables breakdown */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-sm font-bold text-slate-700">
                    <span className="text-slate-400 text-xs">Syllables:</span>
                    <span className="font-['Fredoka'] text-indigo-700 tracking-wider">
                      {syllables}
                    </span>
                  </div>

                  {/* Audio Listen Button */}
                  <div className="pt-2">
                    <button
                      id="flashcard-speak-btn"
                      onClick={handleSpeak}
                      className="px-6 py-3 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-sm border-2 border-indigo-200 shadow-xs cursor-pointer inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                      title="Listen to pronunciation"
                    >
                      <Volume2 className="w-5 h-5 text-indigo-600" />
                      <span>Listen Aloud</span>
                      <span className="text-xs text-indigo-400 font-normal">
                        ({currentWord.pronunciation})
                      </span>
                    </button>
                  </div>
                </div>

                {/* Flip Prompt Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Part of speech: <strong className="text-slate-700">{currentWord.partOfSpeech}</strong></span>
                  <span className="flex items-center gap-1 text-indigo-600 font-extrabold">
                    <RotateCw className="w-3.5 h-3.5 animate-spin-slow" /> Tap to Flip Card
                  </span>
                </div>
              </div>

              {/* BACK OF FLASHCARD */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-400 shadow-xl flex flex-col justify-between text-left overflow-y-auto ${
                  !isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-extrabold font-['Fredoka'] text-amber-300">
                        {currentWord.word.toUpperCase()}
                      </span>
                      <span className="text-xs text-white/70 italic">({currentWord.partOfSpeech})</span>
                    </div>

                    <button
                      onClick={handleSpeak}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                      title="Listen again"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 1. Meaning */}
                  <div className="space-y-1 mb-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                      <span>💬 What Does It Mean?</span>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-white/95 leading-relaxed">
                      {currentWord.definition}
                    </p>
                  </div>

                  {/* 2. Example Sentence */}
                  <div className="space-y-1 mb-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1">
                      <span>📚 Example Sentence</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-white/80 italic leading-relaxed bg-white/10 p-3 rounded-2xl border border-white/10">
                      "{currentWord.exampleSentence}"
                    </p>
                  </div>

                  {/* 3. Memory Tip */}
                  <div className="space-y-1 mb-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                      <span>🧠 Remember It!</span>
                    </div>
                    <p className="text-xs text-white/90 font-medium">
                      {memoryTip}
                    </p>
                  </div>

                  {/* 4. Spelling Breakdown */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                      🔤 Spelling Breakdown
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold tracking-widest text-cyan-200 font-mono bg-black/30 px-3 py-1.5 rounded-xl inline-block">
                      {spellingBreakdown}
                    </div>
                  </div>
                </div>

                {/* Footer flip indicator */}
                <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs text-white/60">
                  <span>🗣️ Repeat the word aloud!</span>
                  <span className="flex items-center gap-1 text-white font-bold">
                    <RotateCw className="w-3.5 h-3.5" /> Tap to Flip Back
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FLASHCARD CONFIDENCE SYSTEM (Ask how well they know this word) */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200/90 shadow-sm space-y-3 text-center">
            <div className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
              🌟 How well do you know this word?
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                id="flashcard-conf-learning-btn"
                onClick={() => handleConfidenceRating('learning')}
                className="py-3 px-2 rounded-2xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold text-xs sm:text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-1 hover:scale-102"
              >
                <span className="text-2xl">😕</span>
                <span className="font-['Fredoka']">Still Learning</span>
                <span className="text-[10px] text-amber-600 font-normal">Review soon</span>
              </button>

              <button
                id="flashcard-conf-getting-btn"
                onClick={() => handleConfidenceRating('getting_it')}
                className="py-3 px-2 rounded-2xl border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-extrabold text-xs sm:text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-1 hover:scale-102"
              >
                <span className="text-2xl">🙂</span>
                <span className="font-['Fredoka']">Getting It</span>
                <span className="text-[10px] text-indigo-600 font-normal">Steady practice</span>
              </button>

              <button
                id="flashcard-conf-known-btn"
                onClick={() => handleConfidenceRating('known')}
                className="py-3 px-2 rounded-2xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs sm:text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-1 hover:scale-102"
              >
                <span className="text-2xl">😎</span>
                <span className="font-['Fredoka']">I Know It!</span>
                <span className="text-[10px] text-emerald-600 font-normal">+10 XP</span>
              </button>
            </div>
          </div>

          {/* Navigation Controls: Previous, Flip, Next */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-5 py-2.5 rounded-full border text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                currentIndex === 0
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleFlip}
              className="px-6 py-2.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-xs hover:bg-indigo-100 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCw className="w-4 h-4" />
              <span>{isFlipped ? 'Flip to Front' : 'Flip to Back'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex + 1 >= activeWordList.length}
              className={`px-5 py-2.5 rounded-full border text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                currentIndex + 1 >= activeWordList.length
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer'
              }`}
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

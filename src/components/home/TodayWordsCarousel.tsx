import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Sparkles,
  Volume2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  GraduationCap,
  Layers,
  Flame,
  Bookmark
} from 'lucide-react';
import { VocabWord, UserProfile } from '../../types';
import { sound } from '../../utils/audio';
import { formatSoundingOutPronunciation } from '../../utils/dictionary';
import { triggerSparkleConfetti } from '../../utils/storage';

interface TodayWordsCarouselProps {
  vocabWords: VocabWord[];
  profile: UserProfile;
  onUpdateWordScore: (word: VocabWord, isCorrect: boolean) => void;
  onAddNewWord: (word: VocabWord) => void;
  onAddXp: (amount: number) => void;
  onOpenPractice: () => void;
  onOpenWordDetail?: (word: VocabWord) => void;
  onExploreFullLibrary?: () => void;
  themeIcon?: string;
}

export const TodayWordsCarousel: React.FC<TodayWordsCarouselProps> = ({
  vocabWords,
  profile,
  onUpdateWordScore,
  onAddNewWord,
  onAddXp,
  onOpenPractice,
  onOpenWordDetail,
  onExploreFullLibrary,
  themeIcon = '🧠'
}) => {
  // 1. SMART ADAPTIVE SELECTION OF 3–5 WORDS
  // Prioritizes:
  // 1. Newly discovered words (sourceType === 'reading' or isCustom or isHomework)
  // 2. Words due for review (needsReview === true)
  // 3. Words frequently answered incorrectly (incorrectCount > 0)
  // 4. Words recently discovered during Reading Practice
  // 5. Words that need reinforcement (confidenceRating === 'learning', timesPracticed === 0)
  // 6. Words approaching mastery (almost_mastered, growing)
  // Avoids showing only easy words.
  const todayWords: VocabWord[] = useMemo(() => {
    if (!vocabWords || vocabWords.length === 0) return [];

    const scored = vocabWords.map((word) => {
      let score = 0;

      // 1. Reading discoveries & custom additions
      if (word.sourceType === 'reading') score += 40;
      if (word.isHomework) score += 35;
      if (word.isCustom) score += 30;

      // 2. Due for review
      if (word.needsReview) score += 45;

      // 3. High incorrect answers
      if (word.incorrectCount > 0) {
        score += Math.min(word.incorrectCount * 12, 50);
      }

      // 4. Learning reinforcement needed
      if (word.confidenceRating === 'learning') score += 30;
      if (word.confidenceRating === 'getting_it') score += 18;
      if (word.timesPracticed === 0) score += 25; // Unpracticed fresh words

      // 5. Approaching mastery
      if (word.masteryLevel === 'almost_mastered') score += 20;
      if (word.masteryLevel === 'growing') score += 15;

      // Deprioritize already fully mastered words unless all words are mastered
      if (word.mastered && !word.needsReview) {
        score -= 60;
      }

      // Challenge weight: balance easy, medium, and challenging words
      if (word.difficulty === 'challenging') score += 8;
      if (word.difficulty === 'medium') score += 5;

      return { word, score };
    });

    // Sort descending by priority score
    scored.sort((a, b) => b.score - a.score);

    // Pick top 4 words (or 3 to 5 depending on total available)
    const targetCount = Math.min(Math.max(3, Math.min(5, scored.length)), 5);
    const selected = scored.slice(0, targetCount).map((s) => s.word);

    return selected;
  }, [vocabWords]);

  // Carousel Navigation & Interaction State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ratedWords, setRatedWords] = useState<Record<string, 'known' | 'almost' | 'need_help'>>({});
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Clamp currentIndex when word list updates
  useEffect(() => {
    if (currentIndex >= todayWords.length && todayWords.length > 0) {
      setCurrentIndex(todayWords.length - 1);
    }
  }, [todayWords.length, currentIndex]);

  const currentWord = todayWords[currentIndex] || null;

  // Sounding-out pronunciation: e.g. /PRU-DEN-CE/
  const soundingPronunciation = useMemo(() => {
    if (!currentWord) return '';
    return formatSoundingOutPronunciation(currentWord.word, currentWord.pronunciation);
  }, [currentWord]);

  // Flip card handler
  const handleFlip = useCallback(() => {
    sound.playPop();
    setIsFlipped((prev) => !prev);
  }, []);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (todayWords.length === 0) return;
    sound.playPop();
    setIsFlipped(false);
    if (currentIndex < todayWords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop or acknowledge end
      setCurrentIndex(0);
    }
  }, [currentIndex, todayWords.length]);

  const handlePrev = useCallback(() => {
    if (todayWords.length === 0) return;
    sound.playPop();
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(todayWords.length - 1);
    }
  }, [currentIndex, todayWords.length]);

  // Keyboard navigation support: Left, Right, Space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting if typing inside an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleFlip]);

  // Touch Swipe Handlers for mobile & tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 45; // Minimum px to trigger swipe

    if (distance > minSwipeDistance) {
      // Swiped left -> Go to Next
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> Go to Previous
      handlePrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Learner Response Handlers:
  // "I know this" (😊) -> increase confidence, schedule later review
  // "Almost" (🤔) -> moderate review priority
  // "I need help" (😕) -> increase review priority, place in practice
  // (Do not mark as mastered on one response)
  const handleRateWord = (confidence: 'known' | 'almost' | 'need_help') => {
    if (!currentWord) return;

    setRatedWords((prev) => ({
      ...prev,
      [currentWord.id]: confidence
    }));

    if (confidence === 'known') {
      sound.playSuccessChime();
      triggerSparkleConfetti();
      onAddXp(10);
      onUpdateWordScore(currentWord, true);

      // Update confidence metadata without forcing permanent instant mastery
      onAddNewWord({
        ...currentWord,
        confidenceRating: 'known',
        needsReview: false,
        flashcardReviewCount: (currentWord.flashcardReviewCount || 0) + 1,
        lastFlashcardDate: new Date().toISOString().split('T')[0]
      });
    } else if (confidence === 'almost') {
      sound.playPop();
      onAddXp(5);

      onAddNewWord({
        ...currentWord,
        confidenceRating: 'getting_it',
        needsReview: true,
        timesPracticed: (currentWord.timesPracticed || 0) + 1,
        flashcardReviewCount: (currentWord.flashcardReviewCount || 0) + 1,
        lastFlashcardDate: new Date().toISOString().split('T')[0]
      });
    } else {
      // Need help
      sound.playEncourageSound();
      onAddXp(3);
      onUpdateWordScore(currentWord, false);

      onAddNewWord({
        ...currentWord,
        confidenceRating: 'learning',
        needsReview: true,
        flashcardReviewCount: (currentWord.flashcardReviewCount || 0) + 1,
        lastFlashcardDate: new Date().toISOString().split('T')[0]
      });
    }

    // Auto-advance to next card after brief visual feedback
    setTimeout(() => {
      const nextIdx = currentIndex + 1;
      if (nextIdx < todayWords.length) {
        setIsFlipped(false);
        setCurrentIndex(nextIdx);
      } else {
        setSessionCompleted(true);
      }
    }, 650);
  };

  // If no words exist at all
  if (todayWords.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border-2 border-stone-200 text-center space-y-3">
        <p className="text-base font-bold text-stone-700">No vocabulary words available yet.</p>
        <button
          onClick={onOpenPractice}
          className="px-5 py-2.5 rounded-full bg-amber-600 text-white font-bold text-sm"
        >
          Explore Word Library
        </button>
      </div>
    );
  }

  return (
    <section
      id="today-words-carousel-section"
      ref={containerRef}
      className="space-y-4 text-left font-['Quicksand']"
      aria-roledescription="carousel"
      aria-label="Today's Words Flashcard Carousel"
    >
      {/* 1. Header & Progress Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{themeIcon}</span>
            <h2 className="text-2xl font-extrabold text-stone-900 font-['Fredoka'] tracking-tight">
              Today's Words
            </h2>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              {todayWords.length} Daily Cards
            </span>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Personalized flashcards based on your reading discoveries, homework, and review priority.
          </p>
        </div>

        {/* Lightweight Progress (e.g. ● ● ○ ○ ○ + "2 / 5") */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-stone-100/90 px-3.5 py-1.5 rounded-2xl border border-stone-200/80">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {todayWords.map((word, idx) => {
              const isCurrent = idx === currentIndex;
              const hasRated = !!ratedWords[word.id];
              return (
                <button
                  key={word.id}
                  onClick={() => {
                    sound.playPop();
                    setIsFlipped(false);
                    setCurrentIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    isCurrent
                      ? 'w-6 bg-amber-600'
                      : hasRated
                      ? 'bg-emerald-500'
                      : 'bg-stone-300 hover:bg-stone-400'
                  }`}
                  aria-label={`Jump to word ${idx + 1}`}
                  title={`Card ${idx + 1}: ${word.word}`}
                />
              );
            })}
          </div>
          <span className="text-xs font-bold text-stone-600 font-mono">
            {currentIndex + 1} / {todayWords.length}
          </span>
        </div>
      </div>

      {/* 2. THE INTERACTIVE FLASHCARD (ONE LARGE CARD AT A TIME) */}
      <div
        className="w-full max-w-xl mx-auto touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full min-h-[390px] sm:min-h-[420px] perspective-1000">
          <div
            id="flashcard-inner-flipper"
            className={`w-full h-full min-h-[390px] sm:min-h-[420px] rounded-3xl transition-transform duration-500 transform-style-3d cursor-pointer ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={handleFlip}
            role="button"
            tabIndex={0}
            aria-pressed={isFlipped}
            aria-label={`Flashcard for ${currentWord?.word}. Press Space or tap to flip.`}
          >
            {/* ============================================================ */}
            {/* FRONT OF CARD */}
            {/* ============================================================ */}
            <div
              className={`absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-stone-50/80 to-amber-50/30 border-2 border-stone-200/90 shadow-sm flex flex-col justify-between backface-hidden select-none transition-shadow hover:shadow-md ${
                isFlipped ? 'pointer-events-none' : ''
              }`}
            >
              {/* Front Top Meta: Source Badge / Reading Discovery Badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {currentWord?.sourceType === 'reading' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
                      <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                      <span>Discovered while reading</span>
                    </span>
                  ) : currentWord?.isHomework ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                      <span>School Homework</span>
                    </span>
                  ) : currentWord?.isBibleWord ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                      <span>📜</span>
                      <span>Bible Vocabulary</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200">
                      {currentWord?.category || 'Curriculum Vocabulary'}
                    </span>
                  )}

                  {/* Context snippet if supplied by learner */}
                  {(currentWord?.context || currentWord?.scriptureReference) && (
                    <span className="text-[11px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded-md border border-stone-200 truncate max-w-[180px]">
                      {currentWord.scriptureReference || currentWord.context}
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 bg-stone-100 px-2.5 py-0.5 rounded-full">
                  {currentWord?.partOfSpeech}
                </span>
              </div>

              {/* Front Center: WORD & SOUNDING PRONUNCIATION */}
              <div className="text-center py-4 space-y-3">
                <div className="space-y-1">
                  <h3
                    id="flashcard-front-word"
                    className="text-4xl sm:text-5xl font-extrabold text-stone-900 font-['Fredoka'] uppercase tracking-wide drop-shadow-2xs"
                  >
                    {currentWord?.word}
                  </h3>

                  <div className="inline-block px-3 py-1 rounded-xl bg-amber-100/60 border border-amber-200/80 text-amber-900 font-mono font-bold text-sm sm:text-base tracking-wider">
                    {soundingPronunciation}
                  </div>
                </div>

                {/* HEAR PRONUNCIATION BUTTON (High Accessibility, Min 44px) */}
                <div className="pt-2">
                  <button
                    id="flashcard-hear-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playPop();
                      sound.speak(currentWord?.word || '');
                    }}
                    className="min-h-[44px] px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-sm inline-flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label={`Hear pronunciation of ${currentWord?.word}`}
                  >
                    <Volume2 className="w-4 h-4 text-white" />
                    <span>Hear pronunciation</span>
                  </button>
                </div>
              </div>

              {/* Front Bottom Hint */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 font-medium">
                <span className="hidden sm:inline">Press Space or click</span>
                <span className="sm:hidden">Tap card</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                  <span>Tap to reveal meaning</span>
                  <RotateCcw className="w-3.5 h-3.5" />
                </span>
                <span className="text-[11px]">Swipe ← →</span>
              </div>
            </div>

            {/* ============================================================ */}
            {/* BACK OF CARD */}
            {/* ============================================================ */}
            <div
              className={`absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-amber-50/40 to-stone-50 border-2 border-amber-300 shadow-md flex flex-col justify-between backface-hidden rotate-y-180 select-none overflow-y-auto ${
                !isFlipped ? 'pointer-events-none' : ''
              }`}
            >
              {/* Back Top: Word Title & Part of Speech */}
              <div>
                <div className="flex items-center justify-between border-b border-amber-100 pb-2.5 mb-3">
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Fredoka'] uppercase tracking-tight">
                      {currentWord?.word}
                    </h4>
                    <span className="text-xs font-bold text-stone-400 capitalize">
                      ({currentWord?.partOfSpeech})
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.speak(currentWord?.word || '');
                    }}
                    className="min-h-[44px] min-w-[44px] p-2 rounded-full hover:bg-amber-100 text-amber-800 transition-colors cursor-pointer flex items-center justify-center"
                    aria-label="Listen again"
                    title="Listen again"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Definition & Simple Definition */}
                <div className="space-y-2.5 text-left">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      Definition
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-stone-800 leading-relaxed mt-1">
                      {currentWord?.definition}
                    </p>
                  </div>

                  {currentWord?.simpleDefinition && (
                    <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60">
                      <span className="text-[10px] font-bold text-amber-900 block">
                        Simple Meaning:
                      </span>
                      <p className="text-xs sm:text-sm text-stone-700 font-medium">
                        {currentWord.simpleDefinition}
                      </p>
                    </div>
                  )}

                  {/* Example Sentence */}
                  {(currentWord?.exampleSentence || currentWord?.example) && (
                    <div className="bg-white/80 p-3 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-600 italic leading-relaxed flex items-start justify-between gap-2">
                      <p className="flex-1">
                        "{currentWord.exampleSentence || currentWord.example}"
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.speak(currentWord.exampleSentence || currentWord.example || '');
                        }}
                        className="text-stone-400 hover:text-amber-800 p-1 cursor-pointer shrink-0"
                        title="Hear example sentence"
                        aria-label="Hear example sentence"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Context / Source Info if Available */}
                  {(currentWord?.context ||
                    currentWord?.scriptureReference ||
                    currentWord?.source ||
                    currentWord?.bookTitle) && (
                    <div className="text-[11px] text-stone-500 font-medium pt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-stone-700">Source/Context:</span>
                      {currentWord.scriptureReference && (
                        <span className="text-purple-700 font-semibold">
                          📖 {currentWord.scriptureReference}
                        </span>
                      )}
                      {currentWord.bookTitle && (
                        <span className="text-sky-700 font-semibold">
                          📚 {currentWord.bookTitle}
                        </span>
                      )}
                      {currentWord.context && !currentWord.scriptureReference && (
                        <span className="italic text-stone-600">"{currentWord.context}"</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Back Bottom: LEARNER RESPONSE BUTTONS */}
              <div
                className="pt-3 mt-3 border-t border-amber-200/80 space-y-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between text-xs text-stone-500 font-bold px-1">
                  <span>How well do you know this word?</span>
                  {ratedWords[currentWord?.id || ''] && (
                    <span className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Saved for review
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Option 1: "I know this" */}
                  <button
                    id="flashcard-btn-known"
                    onClick={() => handleRateWord('known')}
                    className="min-h-[44px] px-2 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-2 border-emerald-200 hover:border-emerald-400 font-extrabold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                    aria-label="I know this word well"
                  >
                    <span className="text-base sm:text-lg">😊</span>
                    <span className="whitespace-nowrap">I know this</span>
                  </button>

                  {/* Option 2: "Almost" */}
                  <button
                    id="flashcard-btn-almost"
                    onClick={() => handleRateWord('almost')}
                    className="min-h-[44px] px-2 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-200 hover:border-amber-400 font-extrabold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                    aria-label="Almost know this word"
                  >
                    <span className="text-base sm:text-lg">🤔</span>
                    <span className="whitespace-nowrap">Almost</span>
                  </button>

                  {/* Option 3: "I need help" */}
                  <button
                    id="flashcard-btn-need-help"
                    onClick={() => handleRateWord('need_help')}
                    className="min-h-[44px] px-2 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-900 border-2 border-rose-200 hover:border-rose-400 font-extrabold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                    aria-label="I need help with this word"
                  >
                    <span className="text-base sm:text-lg">😕</span>
                    <span className="whitespace-nowrap">I need help</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. ACCESSIBLE NAVIGATION CONTROLS (Desktop + Mobile Previous / Next) */}
        <div className="flex items-center justify-between gap-3 mt-4 pt-1">
          <button
            id="btn-prev-vocab-card"
            onClick={handlePrev}
            className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs sm:text-sm border border-stone-200 shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            aria-label="Go to previous word card"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Quick flip toggle button */}
          <button
            id="btn-flip-vocab-card"
            onClick={handleFlip}
            className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            aria-label="Flip card to see opposite side"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
            <span>{isFlipped ? 'Show Word' : 'Show Meaning'}</span>
          </button>

          <button
            id="btn-next-vocab-card"
            onClick={handleNext}
            className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs sm:text-sm border border-stone-200 shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            aria-label="Go to next word card"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. PRACTICE WORDS & LIBRARY BUTTONS UNDER CAROUSEL */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          id="btn-practice-words-home"
          onClick={() => {
            sound.playPop();
            onOpenPractice();
          }}
          className="min-h-[44px] px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-sm shadow-md transition-all hover:scale-103 active:scale-97 cursor-pointer flex items-center gap-2"
        >
          <span>🎯 Practice Words</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>

        {onExploreFullLibrary && (
          <button
            id="btn-explore-library-home"
            onClick={() => {
              sound.playPop();
              onExploreFullLibrary();
            }}
            className="min-h-[44px] px-5 py-3 rounded-full bg-white hover:bg-stone-50 text-stone-700 font-bold text-sm border-2 border-stone-200 transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>Browse Full Library ({vocabWords.length} words)</span>
          </button>
        )}
      </div>
    </section>
  );
};

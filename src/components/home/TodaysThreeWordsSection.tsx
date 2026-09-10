import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Star,
  Flame,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';
import { VocabWord, UserProfile } from '../../types';
import { sound } from '../../utils/audio';
import { triggerSparkleConfetti, triggerCelebrationConfetti } from '../../utils/storage';
import { getSyllables, getMemoryTip } from '../../utils/dailyLearningHelper';
import {
  getOrAssignDaily3Words,
  recordDailyWordPractice,
  getLocalCalendarDate
} from '../../services/dailyWordsService';
import { updateWordMastery } from '../../utils/adaptive';

interface TodaysThreeWordsSectionProps {
  vocabWords: VocabWord[];
  profile: UserProfile;
  onUpdateWordScore?: (word: VocabWord, isCorrect: boolean) => void;
  onAddNewWord?: (word: VocabWord) => void;
  onAddXp?: (amount: number) => void;
  onOpenPractice?: () => void;
  onOpenFlashcards?: () => void;
  onExploreFullLibrary?: () => void;
  themeIcon?: string;
}

export const TodaysThreeWordsSection: React.FC<TodaysThreeWordsSectionProps> = ({
  vocabWords,
  profile,
  onUpdateWordScore = (_word: VocabWord, _isCorrect: boolean) => {},
  onAddNewWord = (_word: VocabWord) => {},
  onAddXp = (_amount: number) => {},
  onOpenPractice,
  onOpenFlashcards,
  onExploreFullLibrary,
  themeIcon = '✨'
}) => {
  const [dailyWords, setDailyWords] = useState<VocabWord[]>([]);
  const [practicedIds, setPracticedIds] = useState<string[]>([]);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Active card index for mobile/focused mode (0, 1, 2)
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Flip state for each of the 3 cards (keyed by word.id)
  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});

  // View mode on desktop: 'grid' (all 3 side-by-side) or 'focused' (single large card with tabs)
  const [viewMode, setViewMode] = useState<'grid' | 'focused'>('grid');

  // Rating history during this session
  const [sessionRatings, setSessionRatings] = useState<
    Record<string, 'known' | 'almost' | 'need_help'>
  >({});

  // Touch Swipe tracking for mobile carousel
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Load and automatically assign today's 3 words
  useEffect(() => {
    const result = getOrAssignDaily3Words(vocabWords);
    setDailyWords(result.dailyWords);
    setPracticedIds(result.store.practicedWordIds || []);
    if (result.message) {
      setInfoMessage(result.message);
    }

    // Automatically integrate new words into the learner's vocabulary state if not present
    if (result.newWordsAddedToVocab.length > 0) {
      result.newWordsAddedToVocab.forEach((newWord) => {
        onAddNewWord(newWord);
      });
    }
  }, [vocabWords, onAddNewWord]);

  // Handle keyboard navigation: Left/Right arrow to switch, Spacebar to flip active card
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (dailyWords.length > 0) {
          const currentWord = dailyWords[currentIndex];
          if (currentWord) {
            handleToggleFlip(currentWord.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, dailyWords, flippedMap]);

  // Touch gesture handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    const minDistance = 45;

    if (diff > minDistance) {
      handleNextCard();
    } else if (diff < -minDistance) {
      handlePrevCard();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const handleNextCard = () => {
    if (dailyWords.length === 0) return;
    sound.playPop();
    setCurrentIndex((prev) => (prev + 1) % dailyWords.length);
  };

  const handlePrevCard = () => {
    if (dailyWords.length === 0) return;
    sound.playPop();
    setCurrentIndex((prev) => (prev - 1 + dailyWords.length) % dailyWords.length);
  };

  const handleToggleFlip = (wordId: string) => {
    sound.playPop();
    setFlippedMap((prev) => ({
      ...prev,
      [wordId]: !prev[wordId]
    }));
  };

  // Learner response handler using the existing mastery progression:
  // NEW -> LEARNING -> PRACTICING / GROWING -> FAMILIAR / ALMOST MASTERED -> MASTERED
  const handleRateWord = (word: VocabWord, rating: 'known' | 'almost' | 'need_help') => {
    sound.playPop();

    // 1. Record in local session rating
    setSessionRatings((prev) => ({ ...prev, [word.id]: rating }));

    // 2. Record daily word practice in dailyWordsService
    const updatedPracticed = recordDailyWordPractice(word.id);
    setPracticedIds(updatedPracticed);

    // 3. Update word mastery using the existing progression
    if (rating === 'known') {
      sound.playSuccessChime();
      triggerSparkleConfetti();
      onAddXp(10);
      onUpdateWordScore(word, true);

      const masteryUpdate = updateWordMastery(word, true);
      onAddNewWord({
        ...masteryUpdate.updatedWord,
        confidenceRating: 'known',
        needsReview: false,
        lastFlashcardDate: getLocalCalendarDate()
      });
    } else if (rating === 'almost') {
      sound.playPop();
      onAddXp(5);
      onUpdateWordScore(word, false);

      onAddNewWord({
        ...word,
        confidenceRating: 'getting_it',
        needsReview: true,
        timesPracticed: (word.timesPracticed || 0) + 1,
        lastFlashcardDate: getLocalCalendarDate()
      });
    } else {
      // need_help
      sound.playEncourageSound();
      onAddXp(3);
      onUpdateWordScore(word, false);

      onAddNewWord({
        ...word,
        confidenceRating: 'learning',
        needsReview: true,
        timesPracticed: (word.timesPracticed || 0) + 1,
        incorrectCount: (word.incorrectCount || 0) + 1,
        lastFlashcardDate: getLocalCalendarDate()
      });
    }

    // Check if this completes all 3 words
    if (updatedPracticed.length >= dailyWords.length && dailyWords.length > 0) {
      setTimeout(() => {
        triggerCelebrationConfetti();
      }, 400);
    }
  };

  const practicedCount = dailyWords.filter((w) => practicedIds.includes(w.id)).length;
  const isAllPracticed = dailyWords.length > 0 && practicedCount >= dailyWords.length;
  const activeWord = dailyWords[currentIndex];

  // If no words available at all
  if (dailyWords.length === 0) {
    return (
      <section
        id="todays-3-words-section"
        className="bg-white rounded-3xl p-8 border-2 border-stone-200 text-center space-y-4 font-['Quicksand'] shadow-sm"
      >
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl">
          🌟
        </div>
        <h3 className="text-2xl font-extrabold text-stone-900 font-['Fredoka']">
          Today's 3 Words
        </h3>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          {infoMessage || "You've explored almost all of the available words! We're adding more soon."}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          {onOpenPractice && (
            <button
              onClick={onOpenPractice}
              className="px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              Practice Vocabulary
            </button>
          )}
          {onExploreFullLibrary && (
            <button
              onClick={onExploreFullLibrary}
              className="px-6 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm transition-colors cursor-pointer"
            >
              Word Library
            </button>
          )}
        </div>
      </section>
    );
  }

  // Render Card Sub-Component (Shared by Grid & Focused views)
  const renderCard = (word: VocabWord, cardIndex: number) => {
    const isFlipped = Boolean(flippedMap[word.id]);
    const isPracticed = practicedIds.includes(word.id);
    const syllables = getSyllables(word.word);
    const memoryTip = getMemoryTip(word.word, word.definition || '');
    const sessionRating = sessionRatings[word.id];

    return (
      <div
        key={word.id}
        id={`daily-word-card-${cardIndex + 1}`}
        className="w-full relative select-none"
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative w-full min-h-[440px] sm:min-h-[460px] rounded-3xl transition-transform duration-500 cursor-pointer"
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d'
          }}
          onClick={() => handleToggleFlip(word.id)}
          role="button"
          tabIndex={0}
          aria-label={`Flashcard for ${word.word}. ${isFlipped ? 'Showing definition' : 'Showing word'}. Tap or press Space to flip.`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.code === 'Space') {
              e.preventDefault();
              e.stopPropagation();
              handleToggleFlip(word.id);
            }
          }}
        >
          {/* ============================================================ */}
          {/* FRONT FACE (WORD SIDE) */}
          {/* ============================================================ */}
          <div
            className={`w-full h-full min-h-[440px] sm:min-h-[460px] rounded-3xl p-6 sm:p-7 bg-white border-2 border-stone-200/90 shadow-sm flex flex-col justify-between transition-all duration-200 hover:border-amber-300 hover:shadow-md ${
              isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
            }`}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            {/* Top Bar: Word Number & Status Badge */}
            <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 font-mono tracking-wider">
                  Word #{cardIndex + 1}
                </span>
                <span className="text-xs font-bold text-stone-400 capitalize">
                  {word.partOfSpeech || 'noun'}
                </span>
              </div>

              {isPracticed ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Practiced ✓</span>
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                  🌱 Today's New Word
                </span>
              )}
            </div>

            {/* Word Center: Big Word, Sounding-out, Hear Audio Button */}
            <div className="my-auto py-5 text-center space-y-3">
              <h3 className="text-3xl sm:text-4xl font-black text-stone-900 font-['Fredoka'] capitalize tracking-tight">
                {word.word}
              </h3>

              {/* Sounding-out Pronunciation */}
              <div className="inline-block px-3.5 py-1 rounded-2xl bg-amber-50/80 border border-amber-200/70">
                <p className="text-sm font-extrabold text-amber-800 font-mono tracking-wide">
                  {word.pronunciation || `/${word.word.toUpperCase()}/`}
                </p>
                {syllables && syllables.toLowerCase() !== word.word.toLowerCase() && (
                  <p className="text-xs text-stone-500 font-semibold mt-0.5 tracking-wider">
                    {syllables}
                  </p>
                )}
              </div>

              {/* Audio Pronunciation Button (Accessible touch target >= 44px) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playPop();
                    sound.speak(word.word);
                  }}
                  className="min-h-[44px] px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-sm inline-flex items-center gap-2 transition-transform cursor-pointer"
                  aria-label={`Hear pronunciation of ${word.word}`}
                >
                  <Volume2 className="w-4 h-4 text-white" />
                  <span>Hear pronunciation</span>
                </button>
              </div>

              {word.category && (
                <p className="text-xs text-stone-400 font-medium">
                  Theme: {word.category}
                </p>
              )}
            </div>

            {/* Bottom: "Tap to learn" cue */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 font-medium">
              <span className="hidden sm:inline">Space or click</span>
              <span className="inline-flex items-center gap-1.5 font-extrabold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/80">
                <span>Tap to learn</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-semibold text-stone-400">Flip card ↷</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* BACK FACE (DEFINITION SIDE) */}
          {/* ============================================================ */}
          <div
            className={`absolute inset-0 w-full h-full min-h-[440px] sm:min-h-[460px] rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-white via-amber-50/40 to-stone-50 border-2 border-amber-300 shadow-md flex flex-col justify-between transition-all duration-200 overflow-y-auto ${
              isFlipped ? 'opacity-100 pointer-events-auto z-20' : 'opacity-0 pointer-events-none z-0'
            }`}
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            {/* Back Header: Word & Audio Button */}
            <div>
              <div className="flex items-center justify-between border-b border-amber-100 pb-2.5 mb-3">
                <div className="flex items-baseline gap-2">
                  <h4 className="text-2xl sm:text-3xl font-black text-stone-900 font-['Fredoka'] capitalize tracking-tight">
                    {word.word}
                  </h4>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md capitalize">
                    {word.partOfSpeech || 'noun'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.speak(word.word);
                    }}
                    className="min-h-[44px] min-w-[44px] p-2 rounded-full hover:bg-amber-100 text-amber-800 transition-colors cursor-pointer flex items-center justify-center"
                    aria-label={`Hear ${word.word} again`}
                    title="Hear word again"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFlip(word.id);
                    }}
                    className="min-h-[44px] px-2.5 py-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Flip back to front"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>
              </div>

              {/* Definitions Block */}
              <div className="space-y-3 text-left">
                {/* 1. Full Definition */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-0.5">
                    Full Definition
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-stone-800 leading-relaxed">
                    {word.definition}
                  </p>
                </div>

                {/* 2. Simple Learner-Friendly Meaning */}
                {(word.simpleDefinition || word.simpleMeaning) && (
                  <div className="bg-amber-50/90 p-3 rounded-2xl border border-amber-200/70">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block mb-0.5">
                      💡 In Simple Words
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-stone-700 leading-relaxed">
                      {word.simpleDefinition || word.simpleMeaning}
                    </p>
                  </div>
                )}

                {/* 3. Example Sentence (with speaker playback) */}
                {(word.exampleSentence || word.example) && (
                  <div className="bg-white/90 p-3 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-700 italic leading-relaxed flex items-start justify-between gap-2 shadow-2xs">
                    <p className="flex-1">
                      "{word.exampleSentence || word.example}"
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.speak(word.exampleSentence || word.example || '');
                      }}
                      className="min-h-[36px] min-w-[36px] text-amber-700 hover:text-amber-900 p-1.5 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer shrink-0"
                      title="Hear example sentence"
                      aria-label="Hear example sentence"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 4. Bible Meaning / Scripture Context (when applicable) */}
                {word.isBibleWord && (word.scriptureReference || word.bibleContext) && (
                  <div className="bg-purple-50/80 p-2.5 rounded-2xl border border-purple-200/70 text-xs text-purple-900">
                    <span className="font-extrabold text-[10px] uppercase tracking-wider text-purple-800 block mb-0.5">
                      📖 Scripture Context {word.scriptureReference ? `(${word.scriptureReference})` : ''}
                    </span>
                    <p className="font-medium text-purple-800 leading-relaxed">
                      {word.bibleContext || word.scriptureVerse}
                    </p>
                  </div>
                )}

                {/* 5. Source / Context */}
                {word.source && !word.isBibleWord && (
                  <p className="text-[11px] text-stone-400 font-medium">
                    <span className="font-bold text-stone-500">Source:</span> {word.source}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom: Mastery Assessment Buttons */}
            <div className="pt-3 border-t border-amber-100 mt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-2 text-center">
                How well do you know this word?
              </span>

              <div className="grid grid-cols-3 gap-2">
                {/* 1. I Need Help */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRateWord(word, 'need_help');
                  }}
                  className={`min-h-[44px] py-2 px-1 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    sessionRating === 'need_help'
                      ? 'bg-rose-100 text-rose-900 border-rose-300 ring-2 ring-rose-200'
                      : 'bg-rose-50/70 hover:bg-rose-100 text-rose-800 border-rose-200'
                  }`}
                  aria-label="I need help with this word"
                >
                  <span className="text-base leading-none">😕</span>
                  <span>I need help</span>
                </button>

                {/* 2. Almost */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRateWord(word, 'almost');
                  }}
                  className={`min-h-[44px] py-2 px-1 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    sessionRating === 'almost'
                      ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-200'
                      : 'bg-amber-50/70 hover:bg-amber-100 text-amber-800 border-amber-200'
                  }`}
                  aria-label="Almost know this word"
                >
                  <span className="text-base leading-none">🤔</span>
                  <span>Almost</span>
                </button>

                {/* 3. I Know This */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRateWord(word, 'known');
                  }}
                  className={`min-h-[44px] py-2 px-1 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    sessionRating === 'known'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 ring-2 ring-emerald-200'
                      : 'bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}
                  aria-label="I know this word"
                >
                  <span className="text-base leading-none">😊</span>
                  <span>I know this</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="todays-3-words-section"
      className="space-y-4 text-left font-['Quicksand']"
      aria-label="Today's 3 Words"
    >
      {/* 1. Header & Progress Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{themeIcon}</span>
            <h2 className="text-2xl font-extrabold text-stone-900 font-['Fredoka'] tracking-tight">
              Today's 3 Words
            </h2>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              3 New Daily Words
            </span>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Every calendar day, 3 genuinely new words are assigned for you to explore and master.
          </p>
        </div>

        {/* Progress Display: e.g. "Today's Words: 2 of 3 practiced" */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-stone-100/90 px-3.5 py-1.5 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {dailyWords.map((w, idx) => {
              const isWordPracticed = practicedIds.includes(w.id);
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={w.id}
                  onClick={() => {
                    sound.playPop();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    isCurrent
                      ? 'w-6 bg-amber-600'
                      : isWordPracticed
                      ? 'w-2.5 bg-emerald-500'
                      : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                  }`}
                  aria-label={`Jump to word ${idx + 1}: ${w.word}`}
                  title={`Word ${idx + 1}: ${w.word} (${isWordPracticed ? 'Practiced' : 'Unpracticed'})`}
                />
              );
            })}
          </div>

          <span className="text-xs font-bold text-stone-600 font-mono">
            {practicedCount} of {dailyWords.length} practiced
          </span>

          {isAllPracticed && (
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-700" />
              <span>Complete!</span>
            </span>
          )}
        </div>
      </div>

      {/* Info message if catalog had fewer than 3 words */}
      {infoMessage && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs font-medium text-amber-800 flex items-center gap-2">
          <span>💡</span>
          <span>{infoMessage}</span>
        </div>
      )}

      {/* Desktop view switcher: "3 Cards Side-by-Side" vs "Focused Card" */}
      <div className="hidden md:flex items-center justify-between text-xs font-bold text-stone-500 pt-1">
        <span className="text-stone-400">
          Click any card to flip it over and read its definition.
        </span>
        <div className="inline-flex rounded-xl bg-stone-100 p-0.5 border border-stone-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-stone-900 font-black shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            All 3 Cards
          </button>
          <button
            onClick={() => setViewMode('focused')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'focused'
                ? 'bg-white text-stone-900 font-black shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Focused View
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP 3-CARD GRID VIEW */}
      {/* ============================================================ */}
      <div className={`${viewMode === 'grid' ? 'hidden md:grid' : 'hidden'} md:grid-cols-3 gap-5`}>
        {dailyWords.map((word, idx) => renderCard(word, idx))}
      </div>

      {/* ============================================================ */}
      {/* MOBILE OR FOCUSED SINGLE-CARD CAROUSEL VIEW */}
      {/* ============================================================ */}
      <div
        className={`${viewMode === 'grid' ? 'md:hidden' : 'block'} w-full max-w-xl mx-auto touch-pan-y`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {activeWord && renderCard(activeWord, currentIndex)}

        {/* Carousel Controls: Previous / Next & Quick Jump Pills */}
        <div className="flex items-center justify-between gap-3 mt-4 px-2">
          <button
            type="button"
            onClick={handlePrevCard}
            className="min-h-[44px] min-w-[44px] px-4 py-2 rounded-2xl bg-white hover:bg-stone-100 text-stone-700 font-extrabold text-xs sm:text-sm border border-stone-200 shadow-2xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            aria-label="Previous daily word"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Quick jump pills: #1, #2, #3 */}
          <div className="flex items-center gap-1.5">
            {dailyWords.map((w, idx) => (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  sound.playPop();
                  setCurrentIndex(idx);
                }}
                className={`min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                  idx === currentIndex
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : practicedIds.includes(w.id)
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
                aria-label={`Jump to word ${idx + 1}: ${w.word}`}
              >
                #{idx + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextCard}
            className="min-h-[44px] min-w-[44px] px-4 py-2 rounded-2xl bg-white hover:bg-stone-100 text-stone-700 font-extrabold text-xs sm:text-sm border border-stone-200 shadow-2xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            aria-label="Next daily word"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Actions: Practice Words & Full Library */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100">
        <div className="flex items-center gap-2">
          {onOpenPractice && (
            <button
              onClick={() => {
                sound.playPop();
                onOpenPractice();
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-amber-800" />
              <span>Practice Words</span>
            </button>
          )}

          {onOpenFlashcards && (
            <button
              onClick={() => {
                sound.playPop();
                onOpenFlashcards();
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4 text-stone-600" />
              <span>Flashcard Center</span>
            </button>
          )}
        </div>

        {onExploreFullLibrary && (
          <button
            onClick={() => {
              sound.playPop();
              onExploreFullLibrary();
            }}
            className="min-h-[44px] text-xs font-extrabold text-amber-800 hover:text-amber-900 hover:underline flex items-center gap-1 cursor-pointer py-1 px-2"
          >
            <span>Browse Full Word Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </section>
  );
};

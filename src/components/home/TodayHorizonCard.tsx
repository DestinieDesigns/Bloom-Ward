import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flame,
  Volume2,
  ArrowRight,
  RotateCw,
  Clock,
  Compass,
  Smile
} from 'lucide-react';
import { VocabWord, UserProfile, AppSection } from '../../types';
import { sound } from '../../utils/audio';
import { formatSoundingOutPronunciation } from '../../utils/dictionary';

interface TodayHorizonCardProps {
  profile: UserProfile;
  dailyWords: VocabWord[];
  words: VocabWord[];
  readingMinutesToday?: number;
  readingGoalMinutes?: number;
  onSelectSection: (section: AppSection) => void;
  onCharacterSitAndRead?: () => void;
  onCharacterStudyDesk?: () => void;
  onOpenPracticeWord?: (word: VocabWord) => void;
  className?: string;
}

export const TodayHorizonCard: React.FC<TodayHorizonCardProps> = ({
  profile,
  dailyWords = [],
  words = [],
  readingMinutesToday = 0,
  readingGoalMinutes = 15,
  onSelectSection,
  onCharacterSitAndRead,
  onCharacterStudyDesk,
  onOpenPracticeWord,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(0);
  const [isWordFlipped, setIsWordFlipped] = useState<boolean>(false);

  // Safeguard array references
  const safeDailyWords = Array.isArray(dailyWords) ? dailyWords : [];

  // Compute daily progress
  const threeWordsLearnedCount = safeDailyWords.filter(
    (w) => w && (w.timesPracticed > 0 || w.mastered)
  ).length;
  const isWordsGoalMet =
    safeDailyWords.length > 0 && threeWordsLearnedCount >= Math.min(3, safeDailyWords.length);
  const isReadingGoalMet = readingMinutesToday >= readingGoalMinutes;
  const totalCompleted = (isWordsGoalMet ? 1 : 0) + (isReadingGoalMet ? 1 : 0);

  const activeDailyWord = safeDailyWords[selectedWordIndex] || safeDailyWords[0];

  const handleHearWord = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    sound.speak(word);
  };

  const learnerFirstName = profile?.name ? profile.name.split(' ')[0] : 'Friend';

  if (!isExpanded) {
    return (
      <div className={`transition-all duration-300 ${className}`}>
        <button
          onClick={() => {
            sound.playPop();
            setIsExpanded(true);
          }}
          className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-amber-200/80 shadow-md hover:shadow-lg hover:border-amber-300 transition-all cursor-pointer active:scale-95"
          title="Open Today's Horizon"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-700 font-bold text-sm">
            ☀️
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-950">Today's Journey</span>
              <span className="text-2xs font-extrabold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {totalCompleted}/2 Goals
              </span>
            </div>
            <p className="text-2xs text-stone-500 font-medium">3 New Words • 15m Reading</p>
          </div>
          <ChevronDown className="w-4 h-4 text-amber-700 ml-1 transition-transform group-hover:translate-y-0.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-white/95 backdrop-blur-md rounded-3xl border border-amber-200/90 shadow-xl overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Gentle Header with Collapsible Toggle */}
      <div className="bg-gradient-to-r from-amber-50/90 via-rose-50/50 to-amber-50/90 px-5 py-3.5 border-b border-amber-100/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-base shadow-xs">
            ☀️
          </div>
          <div>
            <h3 className="font-black text-sm text-amber-950 tracking-tight">
              Welcome home, {learnerFirstName}!
            </h3>
            <p className="text-2xs text-amber-800/80 font-bold">
              Your world is waiting. Here is today's horizon.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            setIsExpanded(false);
          }}
          className="w-7 h-7 rounded-xl hover:bg-white/80 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
          title="Minimize card"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Pillars of Today: 3 New Words, Reading Habit, Daily Goal Progress */}
      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* ========================================================= */}
        {/* PILLAR 1: 🧠 TODAY'S 3 NEW WORDS (Interactive Carousel) */}
        {/* ========================================================= */}
        <div className="md:col-span-7 bg-amber-50/40 rounded-2xl p-4 border border-amber-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
              <span className="text-base">🧠</span>
              <span>TODAY'S 3 NEW WORDS</span>
            </div>
            <div className="flex items-center gap-1">
              {safeDailyWords.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sound.playPop();
                    setSelectedWordIndex(idx);
                    setIsWordFlipped(false);
                  }}
                  className={`w-5 h-5 rounded-full text-2xs font-extrabold transition-all cursor-pointer ${
                    selectedWordIndex === idx
                      ? 'bg-amber-500 text-white shadow-2xs scale-110'
                      : 'bg-white text-stone-600 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {activeDailyWord ? (
            <div
              onClick={() => {
                sound.playPop();
                setIsWordFlipped(!isWordFlipped);
              }}
              className="group relative min-h-[110px] bg-white rounded-xl p-3.5 border border-amber-200/80 shadow-xs hover:border-amber-400/80 transition-all cursor-pointer flex flex-col justify-between"
            >
              {!isWordFlipped ? (
                // FRONT SIDE: Word & Sound-it-out Pronunciation
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-lg font-black text-stone-900 capitalize tracking-tight flex items-center gap-2">
                        {activeDailyWord.word}
                        <button
                          onClick={(e) => handleHearWord(e, activeDailyWord.word)}
                          className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors cursor-pointer"
                          title="Listen to pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </h4>
                      <p className="text-xs font-bold text-amber-800 font-mono mt-0.5">
                        {formatSoundingOutPronunciation(
                          activeDailyWord.syllables || activeDailyWord.pronunciation || activeDailyWord.word
                        )}
                      </p>
                    </div>

                    <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                      Tap to flip 🔄
                    </span>
                  </div>

                  <p className="text-2xs text-stone-500 mt-2 line-clamp-1 italic">
                    "{activeDailyWord.exampleSentence || activeDailyWord.example || 'Click to see definition & context.'}"
                  </p>
                </div>
              ) : (
                // BACK SIDE: Definition & Meaning
                <div className="text-left animate-fade-in">
                  <div className="flex items-center justify-between text-2xs font-bold text-amber-800 mb-1">
                    <span className="uppercase tracking-wider">Meaning</span>
                    <span>Tap to flip back</span>
                  </div>
                  <p className="text-xs font-bold text-stone-800 line-clamp-2">
                    {activeDailyWord.simpleDefinition || activeDailyWord.definition}
                  </p>
                  {activeDailyWord.scriptureReference && (
                    <p className="text-2xs text-emerald-800 font-bold mt-1">
                      🕊️ {activeDailyWord.scriptureReference}
                    </p>
                  )}
                </div>
              )}

              {/* Action Ribbon */}
              <div className="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-amber-100/60 text-2xs">
                <span className="text-stone-500 font-medium">
                  Word {selectedWordIndex + 1} of {Math.max(1, safeDailyWords.length)}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playPop();
                    if (onOpenPracticeWord) {
                      onOpenPracticeWord(activeDailyWord);
                    } else {
                      onSelectSection('learn');
                    }
                  }}
                  className="inline-flex items-center gap-1 font-black text-amber-800 hover:text-amber-950 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Learn & Practice</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-stone-500">
              Loading today's words...
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* PILLAR 2: 📖 TODAY'S 15-MINUTE READING HABIT */}
        {/* ========================================================= */}
        <div className="md:col-span-5 bg-sky-50/40 rounded-2xl p-4 border border-sky-200/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-sky-950">
                <span className="text-base">📖</span>
                <span>READING HABIT</span>
              </div>
              <span className="text-2xs font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-sky-900">
                {readingMinutesToday}/{readingGoalMinutes} min
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-sky-200/60 overflow-hidden mb-3">
              <div
                className="h-full bg-sky-500 transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((readingMinutesToday / readingGoalMinutes) * 100))}%`
                }}
              />
            </div>

            <p className="text-2xs text-stone-600 font-medium leading-relaxed">
              {isReadingGoalMet
                ? '🌟 Fantastic reading today! Keep exploring stories and discovering words.'
                : 'Cozy up with a favorite book. Discover new words as you read!'}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-sky-100/80">
            <button
              onClick={() => {
                sound.playPop();
                if (onCharacterSitAndRead) {
                  onCharacterSitAndRead();
                } else {
                  onSelectSection('read');
                }
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sit & Read</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onSelectSection('read');
              }}
              className="py-2 px-3 rounded-xl bg-white hover:bg-sky-100/60 text-sky-900 border border-sky-200/80 font-bold text-xs transition-colors cursor-pointer"
              title="Open Reading Book Shelf"
            >
              Shelf 📚
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

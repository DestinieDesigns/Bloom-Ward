import React from 'react';
import { Sparkles, Volume2, ArrowRight, BookOpen, Bookmark } from 'lucide-react';
import { VocabWord, BibleWord } from '../../types';
import { sound } from '../../utils/audio';
import { formatSoundingOutPronunciation } from '../../utils/dictionary';

interface WordOfTheDayCardProps {
  vocabWords: VocabWord[];
  bibleWords?: BibleWord[];
  onOpenWordDetail: (word: VocabWord) => void;
  onPracticeWords: () => void;
  themeIcon?: string;
}

export const WordOfTheDayCard: React.FC<WordOfTheDayCardProps> = ({
  vocabWords,
  bibleWords = [],
  onOpenWordDetail,
  onPracticeWords,
  themeIcon = '🌟'
}) => {
  // Deterministic Word of the Day selection based on calendar date
  const featuredWord: VocabWord | null = React.useMemo(() => {
    if (!vocabWords || vocabWords.length === 0) return null;

    // Words that need reinforcement or are rich in meaning are preferred
    const candidates = vocabWords.filter(
      (w) => w.sourceType === 'reading' || w.difficulty !== 'easy' || w.isBibleWord || w.category.includes('Wonders')
    );
    const pool = candidates.length > 0 ? candidates : vocabWords;

    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const index = Math.abs(dayOfYear) % pool.length;
    return pool[index];
  }, [vocabWords]);

  if (!featuredWord) return null;

  const soundingPronunciation = formatSoundingOutPronunciation(
    featuredWord.word,
    featuredWord.pronunciation
  );

  return (
    <div
      id="word-of-the-day-card"
      className="bg-gradient-to-br from-amber-50/90 via-stone-50 to-orange-50/70 rounded-3xl p-6 sm:p-7 border-2 border-amber-200/80 shadow-xs relative overflow-hidden text-left"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full flex items-center gap-1.5 border border-amber-200">
            <span>{themeIcon}</span>
            <span>Word of the Day</span>
          </span>
          {featuredWord.sourceType === 'reading' && (
            <span className="text-[11px] font-bold text-sky-800 bg-sky-100/80 px-2.5 py-0.5 rounded-full border border-sky-200 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Book Discovery
            </span>
          )}
          {featuredWord.isBibleWord && (
            <span className="text-[11px] font-bold text-purple-800 bg-purple-100/80 px-2.5 py-0.5 rounded-full border border-purple-200">
              📜 Scripture Focus
            </span>
          )}
        </div>
        <span className="text-xs font-bold text-stone-500 capitalize">
          {featuredWord.partOfSpeech} • {featuredWord.difficulty}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Fredoka'] uppercase tracking-wide">
            {featuredWord.word}
          </h3>
          <span className="text-xs sm:text-sm font-semibold text-amber-800 italic font-mono">
            {soundingPronunciation}
          </span>
        </div>

        <button
          id="wotd-listen-btn"
          onClick={() => {
            sound.playPop();
            sound.speak(featuredWord.word);
          }}
          className="self-start sm:self-auto min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          aria-label={`Hear pronunciation of ${featuredWord.word}`}
        >
          <Volume2 className="w-4 h-4 text-amber-800" />
          <span>Listen</span>
        </button>
      </div>

      <p className="text-sm text-stone-700 font-medium leading-relaxed mb-3">
        {featuredWord.simpleDefinition || featuredWord.definition}
      </p>

      {(featuredWord.exampleSentence || featuredWord.example) && (
        <p className="text-xs sm:text-sm text-stone-600 italic bg-white/80 p-3 rounded-2xl border border-stone-200/80 mb-4 leading-relaxed">
          "{featuredWord.exampleSentence || featuredWord.example}"
        </p>
      )}

      {featuredWord.scriptureReference && (
        <p className="text-xs font-semibold text-purple-800 mb-3 flex items-center gap-1.5">
          <span>📖 Verse:</span>
          <span className="font-bold">{featuredWord.scriptureReference}</span>
          {featuredWord.scriptureVerse && (
            <span className="text-stone-600 font-normal italic truncate max-w-xs">
              - "{featuredWord.scriptureVerse}"
            </span>
          )}
        </p>
      )}

      <div className="pt-3 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-3">
        <button
          id="wotd-view-detail-btn"
          onClick={() => onOpenWordDetail(featuredWord)}
          className="min-h-[44px] text-xs font-extrabold text-amber-900 hover:text-amber-950 flex items-center gap-1 cursor-pointer py-1"
        >
          <span>See full word guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          id="wotd-practice-btn"
          onClick={onPracticeWords}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 transition-transform hover:scale-102 active:scale-98 cursor-pointer shadow-xs"
        >
          <span>Practice this word</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
        </button>
      </div>
    </div>
  );
};

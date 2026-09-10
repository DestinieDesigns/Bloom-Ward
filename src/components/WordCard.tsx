import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  BookOpen,
  ArrowRight,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { VocabWord } from '../types';
import { sound } from '../utils/audio';
import { getMasteryIcon, getMasteryLabel } from '../utils/adaptive';
import { lookupWordAsync } from '../utils/dictionary';

interface WordCardProps {
  word: VocabWord;
  onPractice?: (word: VocabWord) => void;
  onToggleReview?: (word: VocabWord) => void;
  onUpdateWord?: (updated: VocabWord) => void;
  showPracticeBtn?: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  onPractice,
  onUpdateWord,
  showPracticeBtn = true
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [showScriptureVerse, setShowScriptureVerse] = useState(false);

  const speakWord = () => {
    sound.speak(word.word);
  };

  const speakSentence = () => {
    sound.speak(word.exampleSentence || word.example || '');
  };

  const handleRetryDefinition = async () => {
    setIsRetrying(true);
    sound.playPop();
    try {
      const result = await lookupWordAsync(word.word, word.contextSentence || word.context);
      if (!result.definitionUnavailable && onUpdateWord) {
        sound.playSuccessChime();
        onUpdateWord({
          ...word,
          definition: result.definition,
          simpleDefinition: result.simpleDefinition,
          simpleMeaning: result.simpleDefinition,
          pronunciation: result.pronunciation || word.pronunciation,
          partOfSpeech: result.partOfSpeech || word.partOfSpeech,
          synonyms: result.synonyms.length > 0 ? result.synonyms : word.synonyms,
          isBibleWord: word.isBibleWord || result.isBibleWord,
          bibleContext: result.bibleContext || word.bibleContext,
          scriptureReference: result.scriptureReference || word.scriptureReference,
          scriptureVerse: result.scriptureVerse || word.scriptureVerse,
          definitionUnavailable: false
        });
      } else {
        sound.playSoftBoing();
      }
    } catch {
      sound.playSoftBoing();
    } finally {
      setIsRetrying(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'challenging':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-pink-50 text-pink-700 border-pink-200';
    }
  };

  const isBible = Boolean(word.isBibleWord || word.bibleContext || word.scriptureReference);
  const readingContext =
    word.scriptureReference ||
    (word.bookTitle ? `Found in "${word.bookTitle}"${word.bookPage ? ` (Page ${word.bookPage})` : ''}` : null) ||
    word.contextSentence ||
    word.context;

  return (
    <div
      className={`bg-white rounded-3xl p-5 sm:p-6 border-2 transition-all shadow-md relative overflow-hidden group ${
        isBible
          ? 'border-amber-200 shadow-amber-50 hover:border-amber-300 hover:shadow-amber-100'
          : 'border-pink-100 shadow-pink-100/50 hover:border-pink-300 hover:shadow-pink-200/50'
      }`}
    >
      {/* Soft decorative background accents */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none opacity-40 ${
          isBible
            ? 'bg-gradient-to-br from-amber-200/50 via-yellow-100/30 to-transparent'
            : 'bg-gradient-to-br from-pink-100/40 via-purple-50/30 to-transparent'
        }`}
      />

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200 uppercase tracking-wide">
            {word.partOfSpeech}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyColor(word.difficulty)} capitalize`}>
            {word.difficulty}
          </span>
          {isBible && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              ✝ Bible Word
            </span>
          )}
          {word.category && !isBible && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100">
              {word.category}
            </span>
          )}
        </div>

        {/* Mastery Badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold text-pink-700 shadow-xs"
          title={`Mastery: ${getMasteryLabel(word.masteryLevel)}`}
        >
          <span>{getMasteryIcon(word.masteryLevel)}</span>
          <span className="hidden sm:inline">{getMasteryLabel(word.masteryLevel)}</span>
        </div>
      </div>

      {/* Main Word & Pronunciation */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Fredoka'] uppercase">
            {word.word}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs sm:text-sm font-bold font-mono text-stone-700 bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded-full">
              🔊 {word.pronunciation?.startsWith('/') ? word.pronunciation : `/${word.pronunciation || word.word.toUpperCase()}/`}
            </span>
          </div>
        </div>

        {/* Listen Button */}
        <button
          onClick={() => {
            sound.playPop();
            speakWord();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-sm shadow-pink-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Hear word spoken aloud"
        >
          <Volume2 className="w-4 h-4" />
          <span>Listen</span>
        </button>
      </div>

      {/* Definition Section */}
      <div className="bg-stone-50/90 border border-stone-200/90 rounded-2xl p-3.5 mb-3">
        <p className="text-xs font-black text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-pink-500" />
          Definition
        </p>
        {word.definitionUnavailable ? (
          <div className="space-y-2 pt-0.5">
            <p className="text-sm text-stone-600 italic">
              Definition unavailable right now.
            </p>
            <button
              type="button"
              onClick={handleRetryDefinition}
              disabled={isRetrying}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Checking...' : 'Try again'}</span>
            </button>
          </div>
        ) : (
          <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
            {word.definition}
          </p>
        )}
      </div>

      {/* In Simple Words Section */}
      {!word.definitionUnavailable && (word.simpleDefinition || word.simpleMeaning) && (
        <div className="bg-pink-50/80 border border-pink-100 rounded-2xl p-3 mb-3">
          <p className="text-xs font-black text-pink-700 uppercase tracking-wider mb-1">
            In simple words
          </p>
          <p className="text-sm text-pink-950 font-medium leading-relaxed">
            {word.simpleDefinition || word.simpleMeaning}
          </p>
        </div>
      )}

      {/* Bible Context (when applicable) */}
      {isBible && (word.bibleContext || word.scriptureReference) && (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3.5 mb-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-amber-800 uppercase tracking-wider">
              Bible context
            </p>
            {word.scriptureReference && (
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-extrabold">
                {word.scriptureReference}
              </span>
            )}
          </div>
          {word.bibleContext && (
            <p className="text-sm text-amber-950 font-medium leading-relaxed">
              {word.bibleContext}
            </p>
          )}
          {word.scriptureVerse && (
            <div>
              <button
                type="button"
                onClick={() => setShowScriptureVerse(!showScriptureVerse)}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 cursor-pointer pt-0.5"
              >
                <span>{showScriptureVerse ? 'Hide Scripture Verse' : 'Read Scripture Context'}</span>
                {showScriptureVerse ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {showScriptureVerse && (
                <p className="text-xs text-amber-900 italic bg-amber-100/60 p-2.5 rounded-xl border border-amber-200 mt-1">
                  "{word.scriptureVerse}"
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Example Sentence */}
      {(word.exampleSentence || word.example) && (
        <div className="bg-gradient-to-r from-purple-50/60 to-pink-50/60 border border-purple-100/80 rounded-2xl p-3.5 mb-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-purple-500" />
              Example
            </p>
            <button
              onClick={() => {
                sound.playPop();
                speakSentence();
              }}
              className="text-purple-600 hover:text-purple-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3 h-3" /> Read aloud
            </button>
          </div>
          <p className="text-sm text-slate-700 italic leading-relaxed">
            "{word.exampleSentence || word.example}"
          </p>
        </div>
      )}

      {/* Reading Discovery Origin Tag */}
      {readingContext && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-stone-100/80 px-3 py-1.5 rounded-xl border border-stone-200/80 mb-3">
          <BookOpen className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="font-semibold text-slate-700">📖 Discovered while reading:</span>
          <span className="font-medium text-slate-600 truncate">{readingContext}</span>
        </div>
      )}

      {/* Synonyms */}
      {word.synonyms && word.synonyms.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs mb-3">
          <span className="font-bold text-slate-500">Synonyms:</span>
          {word.synonyms.map((syn, idx) => (
            <span
              key={idx}
              className="bg-white border border-pink-200 text-pink-700 px-2 py-0.5 rounded-full font-medium"
            >
              {syn}
            </span>
          ))}
        </div>
      )}

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-pink-100/80">
        <div className="text-xs text-slate-600 font-medium">
          {word.timesSeen && word.timesSeen > 1 ? (
            <span>Seen {word.timesSeen}x while reading</span>
          ) : word.timesPracticed > 0 ? (
            <span>
              Practiced {word.timesPracticed}x • {word.correctCount} correct
            </span>
          ) : (
            <span className="text-pink-400 italic">Ready to practice!</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showPracticeBtn && onPractice && (
            <button
              onClick={() => {
                sound.playPop();
                onPractice(word);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-xs transition-colors cursor-pointer"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

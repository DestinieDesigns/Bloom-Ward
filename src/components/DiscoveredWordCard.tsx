import React, { useState } from 'react';
import {
  Volume2,
  BookOpen,
  RotateCcw,
  Sparkles,
  Layers,
  Flame,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { VocabWord } from '../types';
import { sound } from '../utils/audio';
import { lookupWordAsync } from '../utils/dictionary';

interface DiscoveredWordCardProps {
  word: VocabWord;
  onPractice?: (word: VocabWord) => void;
  onOpenFlashcard?: (word: VocabWord) => void;
  onUpdateWord?: (updated: VocabWord) => void;
  compact?: boolean;
}

export const DiscoveredWordCard: React.FC<DiscoveredWordCardProps> = ({
  word,
  onPractice,
  onOpenFlashcard,
  onUpdateWord,
  compact = false
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [showScriptureVerse, setShowScriptureVerse] = useState(false);

  const handleSpeak = () => {
    sound.speak(word.word);
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
      } else if (result.definitionUnavailable) {
        sound.playSoftBoing();
      }
    } catch {
      sound.playSoftBoing();
    } finally {
      setIsRetrying(false);
    }
  };

  const isBible = Boolean(word.isBibleWord || word.bibleContext || word.scriptureReference);
  const readingOrigin = word.scriptureReference
    ? word.scriptureReference
    : word.bookTitle
    ? `${word.bookTitle}${word.bookPage ? ` (Page ${word.bookPage})` : ''}`
    : word.contextSentence || word.context || 'Reading Session';

  return (
    <div
      className={`bg-white rounded-3xl border-2 transition-all shadow-sm hover:shadow-md relative overflow-hidden flex flex-col justify-between ${
        isBible
          ? 'border-amber-200/90 shadow-amber-50'
          : 'border-pink-200/90 shadow-pink-50'
      } ${compact ? 'p-4' : 'p-5 sm:p-6'}`}
    >
      {/* Decorative top corner accent */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none opacity-40 ${
          isBible
            ? 'bg-gradient-to-br from-amber-200/50 via-yellow-100/30 to-transparent'
            : 'bg-gradient-to-br from-pink-200/50 via-purple-100/30 to-transparent'
        }`}
      />

      <div className="space-y-3.5 relative">
        {/* 1. Word Header & Pronunciation */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Fredoka'] uppercase">
                {word.word}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-xs font-mono font-bold text-stone-700 tracking-wide">
                  <span>🔊</span>
                  <span>{word.pronunciation || `/${word.word.toUpperCase()}/`}</span>
                </span>

                <button
                  type="button"
                  onClick={handleSpeak}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-700 hover:text-pink-900 bg-pink-50 hover:bg-pink-100 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                  title="Hear pronunciation"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>▶ Hear pronunciation</span>
                </button>
              </div>
            </div>

            {/* Badges / Status */}
            <div className="flex flex-col items-end gap-1">
              {isBible && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-extrabold uppercase tracking-wide">
                  ✝ Bible Word
                </span>
              )}
              {word.timesSeen && word.timesSeen > 1 && (
                <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 text-[10px] font-bold">
                  Seen {word.timesSeen}x
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Definition Section */}
        <div className="bg-stone-50/90 border border-stone-200/80 rounded-2xl p-3.5 space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 block">
            Definition
          </span>
          {word.definitionUnavailable ? (
            <div className="space-y-2 pt-0.5">
              <p className="text-xs sm:text-sm text-stone-600 italic">
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
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
              {word.definition}
            </p>
          )}
        </div>

        {/* 3. In Simple Words Section */}
        {!word.definitionUnavailable && (word.simpleDefinition || word.simpleMeaning) && (
          <div className="bg-pink-50/70 border border-pink-100 rounded-2xl p-3 space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-pink-700 block">
              In simple words
            </span>
            <p className="text-xs sm:text-sm text-pink-950 leading-relaxed">
              {word.simpleDefinition || word.simpleMeaning}
            </p>
          </div>
        )}

        {/* 4. Bible Context (when applicable) */}
        {isBible && (word.bibleContext || word.scriptureReference) && (
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 block">
                Bible context
              </span>
              {word.scriptureReference && (
                <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[11px] font-extrabold">
                  {word.scriptureReference}
                </span>
              )}
            </div>

            {word.bibleContext && (
              <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                {word.bibleContext}
              </p>
            )}

            {word.scriptureVerse && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowScriptureVerse(!showScriptureVerse)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 cursor-pointer pt-0.5"
                >
                  <span>{showScriptureVerse ? 'Hide Scripture' : 'Read Scripture Context'}</span>
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

        {/* 5. Example Sentence Section */}
        {(word.example || word.exampleSentence) && (
          <div className="space-y-1 px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Example
            </span>
            <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
              "{word.example || word.exampleSentence}"
            </p>
          </div>
        )}

        {/* 6. Discovered While Reading Context Tag */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-stone-100/80 px-3 py-1.5 rounded-xl border border-stone-200/80">
          <BookOpen className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="font-semibold text-slate-700">Discovered while reading:</span>
          <span className="font-medium text-slate-600 truncate">{readingOrigin}</span>
        </div>
      </div>

      {/* 7. Action Footer: [Flashcard] [Practice] */}
      <div className="flex items-center justify-between gap-2 pt-4 mt-3 border-t border-stone-100">
        <div className="text-[11px] text-stone-400 font-medium">
          {word.mastered ? (
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
            </span>
          ) : (
            <span>Ready for study</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onOpenFlashcard && (
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onOpenFlashcard(word);
              }}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
              title="Study with Flashcard"
            >
              <Layers className="w-3.5 h-3.5 text-stone-600" />
              <span>Flashcard</span>
            </button>
          )}

          {onPractice && (
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onPractice(word);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
              title="Practice Spelling & Pronunciation"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Practice</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

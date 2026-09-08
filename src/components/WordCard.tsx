import React from 'react';
import { Volume2, Sparkles, BookOpen, Heart, ArrowRight } from 'lucide-react';
import { VocabWord } from '../types';
import { sound } from '../utils/audio';
import { getMasteryIcon, getMasteryLabel } from '../utils/adaptive';

interface WordCardProps {
  word: VocabWord;
  onPractice?: (word: VocabWord) => void;
  onToggleReview?: (word: VocabWord) => void;
  showPracticeBtn?: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  onPractice,
  onToggleReview,
  showPracticeBtn = true
}) => {
  const speakWord = () => {
    sound.speak(word.word);
  };

  const speakSentence = () => {
    sound.speak(word.exampleSentence);
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

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-pink-100 shadow-md shadow-pink-100/50 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-200/50 transition-all relative overflow-hidden group">
      {/* Soft decorative background accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100/40 via-purple-50/30 to-transparent rounded-bl-full pointer-events-none" />

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700 border border-pink-200 uppercase tracking-wide">
            {word.partOfSpeech}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyColor(word.difficulty)} capitalize`}>
            {word.difficulty}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100">
            {word.category}
          </span>
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
          <h3 className="text-2xl sm:text-3xl font-extrabold text-pink-900 tracking-tight font-['Fredoka']">
            {word.word}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-pink-500 italic bg-pink-50 px-2 py-0.5 rounded-md">
              /{word.pronunciation}/
            </span>
          </div>
        </div>

        {/* Listen Button */}
        <button
          onClick={() => {
            sound.playPop();
            speakWord();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-sm shadow-sm shadow-pink-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Hear word spoken aloud"
        >
          <Volume2 className="w-4 h-4" />
          <span>Listen</span>
        </button>
      </div>

      {/* Child-Friendly Definition */}
      <div className="bg-pink-50/70 border border-pink-100 rounded-2xl p-3.5 mb-3.5">
        <p className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-pink-500" />
          What Does It Mean?
        </p>
        <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
          {word.definition}
        </p>
      </div>

      {/* Example Sentence */}
      <div className="bg-gradient-to-r from-purple-50/60 to-pink-50/60 border border-purple-100/80 rounded-2xl p-3.5 mb-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-purple-500" />
            Example Sentence
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
        <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed">
          "{word.exampleSentence}"
        </p>
      </div>

      {/* Synonyms & Antonyms */}
      <div className="space-y-2 mb-4">
        {word.synonyms && word.synonyms.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
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

        {word.antonyms && word.antonyms.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-slate-500">Antonyms:</span>
            {word.antonyms.map((ant, idx) => (
              <span
                key={idx}
                className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium"
              >
                {ant}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-pink-100/80">
        <div className="text-xs text-slate-600 font-medium">
          {word.timesPracticed > 0 ? (
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

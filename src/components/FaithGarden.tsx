import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  BookOpen,
  Heart,
  CheckCircle2,
  Award,
  ArrowRight,
  HelpCircle,
  Flame,
  Search
} from 'lucide-react';
import { BibleWord } from '../types';
import { sound } from '../utils/audio';
import { triggerSparkleConfetti, triggerCelebrationConfetti } from '../utils/storage';

interface FaithGardenProps {
  bibleWords: BibleWord[];
  onAddXp: (xp: number) => void;
  onUpdateBibleProgress: (wordId: string, mastered: boolean) => void;
}

export const FaithGarden: React.FC<FaithGardenProps> = ({
  bibleWords,
  onAddXp,
  onUpdateBibleProgress
}) => {
  const [selectedWord, setSelectedWord] = useState<BibleWord>(bibleWords[0]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [quizStreak, setQuizStreak] = useState<number>(0);

  const filteredWords = bibleWords.filter(
    (w) =>
      w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.childDefinition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeChallenge = selectedWord.quickChallenges[challengeIdx] || selectedWord.quickChallenges[0];

  const handleSelectWord = (word: BibleWord) => {
    sound.playPop();
    setSelectedWord(word);
    setChallengeIdx(0);
    setSelectedChoice(null);
    setAnswered(false);
    setIsCorrect(false);
  };

  const handleAnswerChallenge = (choiceIdx: number) => {
    if (answered) return;
    sound.playPop();
    setSelectedChoice(choiceIdx);
    const correct = choiceIdx === activeChallenge.correctIndex;
    setIsCorrect(correct);
    setAnswered(true);

    if (correct) {
      sound.playSuccessChime();
      triggerSparkleConfetti();
      setQuizStreak((p) => p + 1);
      onAddXp(10);
      onUpdateBibleProgress(selectedWord.id, true);
    } else {
      sound.playEncourageSound();
      setQuizStreak(0);
    }
  };

  const handleNextChallenge = () => {
    sound.playPop();
    setSelectedChoice(null);
    setAnswered(false);
    setIsCorrect(false);

    if (challengeIdx + 1 < selectedWord.quickChallenges.length) {
      setChallengeIdx((prev) => prev + 1);
    } else {
      // Pick next word
      const nextIdx = (bibleWords.findIndex((w) => w.id === selectedWord.id) + 1) % bibleWords.length;
      setSelectedWord(bibleWords[nextIdx]);
      setChallengeIdx(0);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm border border-rose-200 mb-2">
          <span>✝️</span>
          <span>Faith & Word Garden</span>
          <span>🕊️</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-900 tracking-tight font-['Fredoka']">
          Sacred Words, Scripture & Loving Meaning
        </h2>
        <p className="text-xs sm:text-sm text-pink-500 max-w-lg mx-auto mt-1">
          Learn what famous Bible words truly mean, see them in everyday life, and practice fun quizzes!
        </p>
      </div>

      {/* Search & Word Ribbon Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Bible words..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white border border-pink-200 text-xs sm:text-sm focus:outline-none focus:border-pink-400 text-pink-900 placeholder:text-pink-300"
          />
        </div>

        {/* Bible Knowledge Streak */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>Bible Streak: {quizStreak} Correct</span>
        </div>
      </div>

      {/* Bible Words Pill Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
        {filteredWords.map((bWord) => {
          const isSelected = selectedWord.id === bWord.id;
          return (
            <button
              key={bWord.id}
              onClick={() => handleSelectWord(bWord)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-pink-200 scale-102'
                  : 'bg-white border border-pink-200 text-pink-800 hover:bg-pink-50'
              }`}
            >
              <span>{bWord.mastered ? '👑' : '🌸'}</span>
              <span>{bWord.word}</span>
            </button>
          );
        })}
      </div>

      {/* Main Selected Word Showcase Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-pink-100 shadow-xl shadow-pink-100/60 mb-8 relative overflow-hidden">
        {/* Top Header with Pronounce */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-100 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-pink-950 font-['Fredoka']">
                {selectedWord.word}
              </span>
              <span className="text-sm font-medium text-pink-500 italic bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                /{selectedWord.pronunciation}/
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Scripture Reference: {selectedWord.scriptureReference}</p>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              sound.speak(selectedWord.word);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-md shadow-pink-200 cursor-pointer self-start sm:self-auto hover:scale-105 active:scale-95 transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Word Spoken</span>
          </button>
        </div>

        {/* 3 Detail Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Child-Friendly Meaning */}
          <div className="bg-pink-50/70 border border-pink-200 rounded-2xl p-4">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider flex items-center gap-1 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              What Does It Mean?
            </span>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              {selectedWord.childDefinition}
            </p>
          </div>

          {/* Scripture Connection */}
          <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                Bible Verse
              </span>
              <button
                onClick={() => sound.speak(selectedWord.scriptureVerse)}
                className="text-purple-600 hover:text-purple-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3 h-3" /> Read
              </button>
            </div>
            <p className="text-sm text-slate-700 italic leading-relaxed">
              "{selectedWord.scriptureVerse}"
            </p>
            <p className="text-[11px] text-purple-600 font-bold mt-2">
              — {selectedWord.scriptureReference}
            </p>
          </div>

          {/* Real-Life Example */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1 mb-2">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              In Everyday Life
            </span>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              {selectedWord.realLifeExample}
            </p>
          </div>
        </div>

        {/* Quick Interactive Faith Challenge */}
        {activeChallenge && (
          <div className="border-t-2 border-pink-100 pt-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🕊️</span>
                <h4 className="font-extrabold text-slate-800 text-base sm:text-lg font-['Fredoka']">
                  Quick Faith Challenge
                </h4>
              </div>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Question {challengeIdx + 1} of {selectedWord.quickChallenges.length}
              </span>
            </div>

            <p className="text-sm sm:text-base font-bold text-slate-800 mb-4">
              {activeChallenge.question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {activeChallenge.options.map((option, idx) => {
                const isSelected = selectedChoice === idx;
                let btnStyle = 'bg-white border-2 border-pink-200 hover:border-pink-400 text-slate-700';

                if (answered) {
                  if (idx === activeChallenge.correctIndex) {
                    btnStyle = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-100 border-2 border-rose-400 text-rose-900 line-through';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={answered}
                    onClick={() => handleAnswerChallenge(idx)}
                    className={`p-4 rounded-2xl text-left text-sm font-medium transition-all cursor-pointer shadow-xs ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-pink-50 border border-pink-200 text-pink-700 inline-flex items-center justify-center text-xs font-bold mr-2">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback Banner */}
            {answered && (
              <div
                className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-3 ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2 text-center sm:text-left">
                  <span className="text-2xl">{isCorrect ? '✨' : '🌱'}</span>
                  <div>
                    <p className="font-bold text-sm">
                      {isCorrect ? 'Wonderful Understanding!' : 'Let’s learn together:'}
                    </p>
                    <p className="text-xs">{activeChallenge.explanation}</p>
                  </div>
                </div>

                <button
                  onClick={handleNextChallenge}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm shadow-md cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <span>Continue Exploring</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

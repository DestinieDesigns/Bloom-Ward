import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Award,
  BookOpen,
  Heart
} from 'lucide-react';
import { VocabWord } from '../types';
import { sound } from '../utils/audio';
import { getRandomEncouragement } from '../utils/adaptive';
import { triggerSparkleConfetti } from '../utils/storage';

interface SpellingAdventureProps {
  words: VocabWord[];
  onUpdateScore: (word: VocabWord, isCorrect: boolean) => void;
  onAddXp: (xp: number) => void;
}

type SpellingMode = 'spell_flower' | 'bow_challenge' | 'listen_spell' | 'mystery_word';

export const SpellingAdventure: React.FC<SpellingAdventureProps> = ({
  words,
  onUpdateScore,
  onAddXp
}) => {
  const [selectedMode, setSelectedMode] = useState<SpellingMode>('spell_flower');
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);

  // States for the active spelling word
  const currentWord = words[currentWordIdx] || words[0];
  const [typedInput, setTypedInput] = useState<string>('');
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [bowSelectedOption, setBowSelectedOption] = useState<string | null>(null);

  // Mystery Word State: letters revealed
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);

  const handleNextWord = () => {
    sound.playPop();
    setTypedInput('');
    setAnswered(false);
    setIsCorrect(false);
    setFeedbackMsg('');
    setBowSelectedOption(null);
    setRevealedIndices([]);

    setCurrentWordIdx((prev) => (prev + 1) % words.length);

    if (selectedMode === 'listen_spell') {
      setTimeout(() => {
        const nextWord = words[(currentWordIdx + 1) % words.length];
        if (nextWord) sound.speak(nextWord.word);
      }, 300);
    }
  };

  const handleCheckSpelling = (submittedWord: string) => {
    if (answered || !submittedWord.trim()) return;

    const correct = submittedWord.trim().toLowerCase() === currentWord.word.toLowerCase();
    setIsCorrect(correct);
    setAnswered(true);

    const msg = getRandomEncouragement(correct);
    setFeedbackMsg(msg);

    onUpdateScore(currentWord, correct);

    if (correct) {
      sound.playSuccessChime();
      triggerSparkleConfetti();
      onAddXp(8);
    } else {
      sound.playEncourageSound();
    }
  };

  // 1. SPELL THE FLOWER
  const renderSpellTheFlower = () => {
    const letters = currentWord.word.toUpperCase().split('');

    return (
      <div className="text-center py-4">
        <div className="mb-4">
          <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block mb-1">
            Definition Clue:
          </span>
          <p className="text-sm sm:text-base text-slate-700 font-medium max-w-md mx-auto">
            "{currentWord.definition}"
          </p>
        </div>

        {/* Big Spoken Audio Trigger */}
        <div className="mb-6">
          <button
            onClick={() => {
              sound.playPop();
              sound.speak(currentWord.word);
            }}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Volume2 className="w-5 h-5 animate-pulse" />
            <span>Hear Pronunciation</span>
          </button>
        </div>

        {/* Input Field with Letter Slots */}
        <div className="max-w-md mx-auto mb-6">
          <input
            type="text"
            autoFocus
            disabled={answered}
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder="Type word here..."
            className={`w-full text-center text-2xl font-bold tracking-widest uppercase py-3.5 px-4 rounded-2xl border-2 transition-all focus:outline-none ${
              answered
                ? isCorrect
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-rose-50 border-rose-400 text-rose-800'
                : 'bg-white border-pink-300 focus:border-pink-500 text-pink-900'
            }`}
          />

          {/* Touch Letters Grid */}
          {!answered && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, 18).map((char) => (
                <button
                  key={char}
                  onClick={() => {
                    sound.playPop();
                    setTypedInput((p) => p + char);
                  }}
                  className="w-8 h-8 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs border border-pink-200 active:scale-90"
                >
                  {char}
                </button>
              ))}
              <button
                onClick={() => {
                  sound.playPop();
                  setTypedInput((p) => p.slice(0, -1));
                }}
                className="px-2 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200"
              >
                ⌫ Del
              </button>
            </div>
          )}

          {!answered && (
            <button
              onClick={() => handleCheckSpelling(typedInput)}
              disabled={!typedInput.trim()}
              className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-base shadow-md disabled:opacity-40 cursor-pointer"
            >
              🌸 Check My Spelling
            </button>
          )}
        </div>
      </div>
    );
  };

  // 2. BOW LETTER CHALLENGE
  const renderBowChallenge = () => {
    // Pick 1 or 2 letters to hide behind bows 🎀
    const wordChars = currentWord.word.split('');
    const targetHiddenIdx = Math.floor(wordChars.length / 2);
    const hiddenChar = wordChars[targetHiddenIdx].toUpperCase();

    // Generate 4 letter options
    const distractors = ['E', 'A', 'I', 'O', 'U', 'R', 'L', 'S', 'T']
      .filter((c) => c !== hiddenChar)
      .slice(0, 3);
    const options = [hiddenChar, ...distractors].sort(() => Math.random() - 0.5);

    return (
      <div className="text-center py-4">
        <p className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-2">
          Which missing letter is hiding behind the pink ribbon bow?
        </p>

        {/* Word with Bow */}
        <div className="flex items-center justify-center gap-2 mb-8 mt-4">
          {wordChars.map((ch, idx) => {
            if (idx === targetHiddenIdx) {
              return (
                <div
                  key={idx}
                  className="w-12 h-14 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-300 border-2 border-pink-400 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-pink-200 animate-gentle-pulse"
                >
                  {answered ? hiddenChar : '🎀'}
                </div>
              );
            }
            return (
              <div
                key={idx}
                className="w-12 h-14 rounded-2xl bg-white border-2 border-pink-200 flex items-center justify-center text-pink-900 text-2xl font-extrabold uppercase shadow-xs font-['Fredoka']"
              >
                {ch}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => sound.speak(currentWord.word)}
          className="text-pink-600 hover:text-pink-700 font-bold text-xs bg-pink-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 border border-pink-200 mb-6 cursor-pointer"
        >
          <Volume2 className="w-4 h-4" /> Listen to full word
        </button>

        {/* Options */}
        <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
          {options.map((opt, i) => {
            const isSelected = bowSelectedOption === opt;
            let btnStyle = 'bg-white border-2 border-pink-200 hover:border-pink-400 text-pink-900';

            if (answered) {
              if (opt === hiddenChar) {
                btnStyle = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-900 font-bold';
              } else if (isSelected) {
                btnStyle = 'bg-rose-100 border-2 border-rose-400 text-rose-900 line-through';
              } else {
                btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => {
                  sound.playPop();
                  setBowSelectedOption(opt);
                  const isMatch = opt === hiddenChar;
                  setIsCorrect(isMatch);
                  setAnswered(true);
                  setFeedbackMsg(getRandomEncouragement(isMatch));
                  onUpdateScore(currentWord, isMatch);
                  if (isMatch) {
                    sound.playSuccessChime();
                    triggerSparkleConfetti();
                    onAddXp(8);
                  } else {
                    sound.playEncourageSound();
                  }
                }}
                className={`py-3.5 rounded-2xl font-extrabold text-xl shadow-xs transition-transform active:scale-90 cursor-pointer ${btnStyle}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // 3. LISTEN AND SPELL
  const renderListenAndSpell = () => {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white text-3xl shadow-lg shadow-pink-200 mb-4 animate-gentle-pulse">
          🎧
        </div>

        <h4 className="text-lg font-bold text-pink-900 font-['Fredoka'] mb-1">
          Listen Carefully & Spell What You Hear
        </h4>
        <p className="text-xs text-slate-500 mb-6">
          Tap the listen button as many times as you need!
        </p>

        <button
          onClick={() => {
            sound.playPop();
            sound.speak(currentWord.word);
          }}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-base shadow-md shadow-pink-200 hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2 mb-6"
        >
          <Volume2 className="w-5 h-5 animate-pulse" />
          <span>🔊 Play Spoken Word</span>
        </button>

        <div className="max-w-md mx-auto">
          <input
            type="text"
            autoFocus
            disabled={answered}
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder="Spell the word you heard..."
            className="w-full text-center text-2xl font-bold tracking-widest uppercase py-3.5 px-4 rounded-2xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none bg-white text-pink-900 mb-4"
          />

          {!answered && (
            <button
              onClick={() => handleCheckSpelling(typedInput)}
              disabled={!typedInput.trim()}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-base shadow-md disabled:opacity-40 cursor-pointer"
            >
              🌸 Check Spelling
            </button>
          )}
        </div>
      </div>
    );
  };

  // 4. MYSTERY WORD
  const renderMysteryWord = () => {
    const chars = currentWord.word.toUpperCase().split('');

    const handleRevealLetter = () => {
      sound.playPop();
      const unrevealed = chars
        .map((_, i) => i)
        .filter((i) => !revealedIndices.includes(i));
      if (unrevealed.length > 0) {
        const nextIdx = unrevealed[0];
        setRevealedIndices((prev) => [...prev, nextIdx]);
      }
    };

    return (
      <div className="text-center py-4">
        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 max-w-md mx-auto mb-6">
          <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block mb-1">
            Mystery Clue:
          </span>
          <p className="text-sm text-slate-800 font-medium">"{currentWord.definition}"</p>
        </div>

        {/* Letter Boxes */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {chars.map((char, i) => (
            <div
              key={i}
              className="w-11 h-13 rounded-2xl bg-white border-2 border-pink-200 flex items-center justify-center text-pink-900 text-xl font-extrabold shadow-xs font-['Fredoka']"
            >
              {revealedIndices.includes(i) || answered ? char : '✨'}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={handleRevealLetter}
            disabled={answered || revealedIndices.length >= chars.length - 1}
            className="text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-1.5 rounded-full cursor-pointer disabled:opacity-40"
          >
            ✨ Reveal a Hint Letter
          </button>
          <button
            onClick={() => sound.speak(currentWord.exampleSentence)}
            className="text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 border border-pink-200 px-3.5 py-1.5 rounded-full cursor-pointer flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" /> Hear in Sentence
          </button>
        </div>

        <div className="max-w-md mx-auto">
          <input
            type="text"
            disabled={answered}
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder="Solve the mystery word..."
            className="w-full text-center text-xl font-bold tracking-widest uppercase py-3 px-4 rounded-2xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none bg-white text-pink-900 mb-4"
          />

          {!answered && (
            <button
              onClick={() => handleCheckSpelling(typedInput)}
              disabled={!typedInput.trim()}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-base shadow-md disabled:opacity-40 cursor-pointer"
            >
              ✨ Solve Mystery
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm border border-rose-200 mb-2">
          <span>🎀</span>
          <span>Spelling Adventure</span>
          <span>✏️</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-900 tracking-tight font-['Fredoka']">
          Spell, Bloom & Master Words
        </h2>
        <p className="text-xs sm:text-sm text-pink-500">
          Pick your favorite spelling game mode below!
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: 'spell_flower', label: 'Spell the Flower', icon: '🌸' },
          { id: 'bow_challenge', label: 'Bow Letter Challenge', icon: '🎀' },
          { id: 'listen_spell', label: 'Listen & Spell', icon: '🔊' },
          { id: 'mystery_word', label: 'Mystery Word', icon: '✨' }
        ].map((tab) => {
          const isActive = selectedMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playPop();
                setSelectedMode(tab.id as SpellingMode);
                setTypedInput('');
                setAnswered(false);
                setIsCorrect(false);
                setFeedbackMsg('');
              }}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200 scale-102'
                  : 'bg-white text-pink-700 border border-pink-200 hover:bg-pink-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Activity Card Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-pink-100 shadow-xl shadow-pink-100/60 max-w-2xl mx-auto">
        <div className="flex items-center justify-between border-b border-pink-100 pb-3 mb-4">
          <span className="text-xs font-bold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200">
            Word {currentWordIdx + 1} of {words.length}
          </span>
          <span className="text-xs text-slate-600 font-semibold">
            {currentWord.category}
          </span>
        </div>

        {selectedMode === 'spell_flower' && renderSpellTheFlower()}
        {selectedMode === 'bow_challenge' && renderBowChallenge()}
        {selectedMode === 'listen_spell' && renderListenAndSpell()}
        {selectedMode === 'mystery_word' && renderMysteryWord()}

        {/* Feedback & Next Button */}
        {answered && (
          <div
            className={`mt-6 p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{isCorrect ? '🌸' : '🌱'}</span>
              <div>
                <p className="font-bold text-sm sm:text-base">{feedbackMsg}</p>
                {!isCorrect && (
                  <p className="text-xs font-semibold text-rose-700 mt-0.5">
                    Correct word: <span className="uppercase tracking-wider font-extrabold">{currentWord.word}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleNextWord}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <span>Next Word 🌸</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

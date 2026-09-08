import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Heart,
  Check,
  Award
} from 'lucide-react';
import { VocabWord, ActivityType } from '../../types';
import { sound } from '../../utils/audio';
import { getRandomEncouragement } from '../../utils/adaptive';

interface ActivityRunnerProps {
  targetWord: VocabWord;
  allWords: VocabWord[];
  activityType: ActivityType;
  onComplete: (isCorrect: boolean) => void;
  onNext?: () => void;
}

export const ActivityRunner: React.FC<ActivityRunnerProps> = ({
  targetWord,
  allWords,
  activityType,
  onComplete,
  onNext
}) => {
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [answered, setAnswered] = useState(false);

  // States for different activities
  const [spellingInput, setSpellingInput] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [wordBuilderTiles, setWordBuilderTiles] = useState<string[]>([]);
  const [builtWord, setBuiltWord] = useState<string[]>([]);
  const [sentenceTokens, setSentenceTokens] = useState<string[]>([]);
  const [builtSentence, setBuiltSentence] = useState<string[]>([]);

  // Setup options for current activity
  useEffect(() => {
    setFeedback(null);
    setAnswered(false);
    setSpellingInput('');
    setSelectedChoice(null);

    // If word builder, shuffle letters
    if (activityType === 'word_builder') {
      const letters = targetWord.word.toUpperCase().split('');
      const shuffled = [...letters].sort(() => Math.random() - 0.5);
      setWordBuilderTiles(shuffled);
      setBuiltWord([]);
    }

    // If sentence builder, break sentence into tokens
    if (activityType === 'sentence_builder') {
      const tokens = targetWord.exampleSentence.replace(/[.,]/g, '').split(' ');
      const shuffled = [...tokens].sort(() => Math.random() - 0.5);
      setSentenceTokens(shuffled);
      setBuiltSentence([]);
    }

    // If hear and choose or spell the word, speak on mount
    if (activityType === 'hear_choose' || activityType === 'spell_word') {
      const timer = setTimeout(() => {
        sound.speak(targetWord.word);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [targetWord, activityType]);

  const handleResult = (isCorrect: boolean) => {
    setAnswered(true);
    const msg = getRandomEncouragement(isCorrect);
    setFeedback({ isCorrect, message: msg });

    if (isCorrect) {
      sound.playSuccessChime();
    } else {
      sound.playEncourageSound();
    }

    onComplete(isCorrect);
  };

  // Generate 3 distractors from allWords
  const getDistractorWords = () => {
    return allWords
      .filter((w) => w.id !== targetWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  };

  // 1. MATCH / CHOOSE THE MEANING / DEFINITION DETECTIVE
  const renderMultipleChoice = () => {
    const distractors = getDistractorWords();
    let choices: { id: string; text: string; isCorrect: boolean }[] = [];

    if (activityType === 'choose_meaning' || activityType === 'match_word') {
      choices = [
        { id: targetWord.id, text: targetWord.definition, isCorrect: true },
        ...distractors.map((d) => ({ id: d.id, text: d.definition, isCorrect: false }))
      ].sort(() => Math.random() - 0.5);
    } else if (activityType === 'definition_detective' || activityType === 'hear_choose') {
      choices = [
        { id: targetWord.id, text: targetWord.word, isCorrect: true },
        ...distractors.map((d) => ({ id: d.id, text: d.word, isCorrect: false }))
      ].sort(() => Math.random() - 0.5);
    }

    return (
      <div className="space-y-3 mt-4">
        {choices.map((choice, index) => {
          const isSelected = selectedChoice === choice.id;
          let btnStyle = 'bg-white border-2 border-pink-200 hover:border-pink-400 text-slate-800 hover:bg-pink-50/50';

          if (answered) {
            if (choice.isCorrect) {
              btnStyle = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-900 font-bold';
            } else if (isSelected && !choice.isCorrect) {
              btnStyle = 'bg-rose-100 border-2 border-rose-400 text-rose-900 line-through';
            } else {
              btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
            }
          }

          return (
            <button
              key={index}
              disabled={answered}
              onClick={() => {
                sound.playPop();
                setSelectedChoice(choice.id);
                handleResult(choice.isCorrect);
              }}
              className={`w-full text-left p-4 rounded-2xl transition-all shadow-xs cursor-pointer flex items-start gap-3 ${btnStyle}`}
            >
              <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-sm sm:text-base font-medium flex-1">
                {choice.text}
              </span>
              {answered && choice.isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // 2. SPELL THE WORD (Listen & Spell)
  const renderSpellWord = () => {
    const handleSpellSubmit = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!spellingInput.trim() || answered) return;

      const isCorrect = spellingInput.trim().toLowerCase() === targetWord.word.toLowerCase();
      handleResult(isCorrect);
    };

    return (
      <div className="text-center py-4">
        <div className="mb-6">
          <button
            onClick={() => {
              sound.playPop();
              sound.speak(targetWord.word);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold shadow-md shadow-pink-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Volume2 className="w-5 h-5 animate-pulse" />
            <span className="text-base">🔊 Listen to Word</span>
          </button>
          <p className="text-xs text-pink-500 mt-2 font-medium">
            Tap to hear the pronunciation, then spell it below!
          </p>
        </div>

        <form onSubmit={handleSpellSubmit} className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              autoFocus
              disabled={answered}
              value={spellingInput}
              onChange={(e) => setSpellingInput(e.target.value)}
              placeholder="Type your spelling here..."
              className={`w-full text-center text-2xl font-bold tracking-widest uppercase py-3.5 px-4 rounded-2xl border-2 transition-all focus:outline-none ${
                answered
                  ? feedback?.isCorrect
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'bg-rose-50 border-rose-400 text-rose-800'
                  : 'bg-white border-pink-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 text-pink-900'
              }`}
            />
          </div>

          {/* Quick On-Screen Letter Petals for Touch / Tablets */}
          {!answered && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-4 max-w-sm mx-auto">
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, 16).map((char) => (
                <button
                  type="button"
                  key={char}
                  onClick={() => {
                    sound.playPop();
                    setSpellingInput((prev) => prev + char);
                  }}
                  className="w-8 h-8 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs border border-pink-200 shadow-xs active:scale-90"
                >
                  {char}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setSpellingInput((prev) => prev.slice(0, -1));
                }}
                className="px-2 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300"
              >
                ⌫ Del
              </button>
            </div>
          )}

          {!answered && (
            <button
              type="submit"
              disabled={!spellingInput.trim()}
              className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-base shadow-md shadow-pink-200 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              🌸 Check My Spelling
            </button>
          )}
        </form>

        {answered && !feedback?.isCorrect && (
          <div className="mt-4 p-3 bg-pink-50 rounded-2xl border border-pink-200 inline-block text-center">
            <span className="text-xs text-slate-500 block font-medium">Correct spelling:</span>
            <span className="text-xl font-bold text-pink-600 tracking-wider uppercase font-['Fredoka']">
              {targetWord.word}
            </span>
          </div>
        )}
      </div>
    );
  };

  // 3. FILL IN THE BLANK
  const renderFillInBlank = () => {
    const sentenceWithBlank = targetWord.exampleSentence.replace(
      new RegExp(targetWord.word, 'gi'),
      '__________'
    );

    const distractors = getDistractorWords();
    const choices = [
      { text: targetWord.word, isCorrect: true },
      ...distractors.map((d) => ({ text: d.word, isCorrect: false }))
    ].sort(() => Math.random() - 0.5);

    return (
      <div className="py-2">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 text-center mb-6">
          <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed">
            "{sentenceWithBlank}"
          </p>
        </div>

        <p className="text-xs font-bold text-pink-500 uppercase tracking-wider text-center mb-3">
          Choose the word that fits best:
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {choices.map((choice, i) => {
            const isSelected = selectedChoice === choice.text;
            let btnStyle = 'bg-white border-2 border-pink-200 hover:border-pink-400 text-pink-900';

            if (answered) {
              if (choice.isCorrect) {
                btnStyle = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-900 font-bold';
              } else if (isSelected && !choice.isCorrect) {
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
                  setSelectedChoice(choice.text);
                  handleResult(choice.isCorrect);
                }}
                className={`py-3 px-4 rounded-2xl text-center font-bold text-sm sm:text-base transition-all shadow-xs cursor-pointer ${btnStyle}`}
              >
                {choice.text}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // 4. WORD BUILDER (Letter Tile Arranger)
  const renderWordBuilder = () => {
    const handleTileClick = (letter: string, index: number) => {
      sound.playPop();
      const updatedBuilt = [...builtWord, letter];
      setBuiltWord(updatedBuilt);

      const updatedRemaining = [...wordBuilderTiles];
      updatedRemaining.splice(index, 1);
      setWordBuilderTiles(updatedRemaining);

      if (updatedRemaining.length === 0) {
        const fullBuilt = updatedBuilt.join('');
        const isCorrect = fullBuilt.toLowerCase() === targetWord.word.toLowerCase();
        handleResult(isCorrect);
      }
    };

    const handleBuiltLetterClick = (letter: string, index: number) => {
      if (answered) return;
      sound.playPop();
      const updatedBuilt = [...builtWord];
      updatedBuilt.splice(index, 1);
      setBuiltWord(updatedBuilt);

      setWordBuilderTiles([...wordBuilderTiles, letter]);
    };

    const handleResetBuilder = () => {
      sound.playPop();
      setBuiltWord([]);
      setWordBuilderTiles(targetWord.word.toUpperCase().split('').sort(() => Math.random() - 0.5));
    };

    return (
      <div className="text-center py-2">
        <p className="text-xs text-pink-600 font-bold uppercase tracking-wider mb-2">
          Tap the letter petals in order to spell:
        </p>

        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => sound.speak(targetWord.word)}
            className="text-pink-600 hover:text-pink-700 font-bold text-sm bg-pink-100 hover:bg-pink-200 px-3 py-1 rounded-full flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" /> Listen to word
          </button>
          <span className="text-xs text-slate-500">Hint: {targetWord.definition.slice(0, 45)}...</span>
        </div>

        {/* Built Letters Tray */}
        <div className="min-h-[56px] bg-pink-50/80 border-2 border-dashed border-pink-300 rounded-2xl p-2.5 flex items-center justify-center gap-2 max-w-md mx-auto mb-6">
          {builtWord.length === 0 ? (
            <span className="text-xs text-pink-400 font-medium italic">
              Tap the tiles below to place letters here...
            </span>
          ) : (
            builtWord.map((letter, i) => (
              <button
                key={i}
                disabled={answered}
                onClick={() => handleBuiltLetterClick(letter, i)}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white font-extrabold text-lg shadow-sm cursor-pointer hover:scale-95 transition-transform"
              >
                {letter}
              </button>
            ))
          )}
        </div>

        {/* Available Scrambled Tiles */}
        <div className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto mb-4">
          {wordBuilderTiles.map((letter, i) => (
            <button
              key={i}
              disabled={answered}
              onClick={() => handleTileClick(letter, i)}
              className="w-11 h-11 rounded-2xl bg-white border-2 border-pink-200 text-pink-900 font-extrabold text-lg shadow-sm hover:border-pink-400 hover:bg-pink-50 active:scale-90 transition-all cursor-pointer"
            >
              {letter}
            </button>
          ))}
        </div>

        {!answered && builtWord.length > 0 && (
          <button
            onClick={handleResetBuilder}
            className="text-xs text-slate-400 hover:text-pink-500 font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Start Over
          </button>
        )}
      </div>
    );
  };

  // 5. SENTENCE BUILDER
  const renderSentenceBuilder = () => {
    const handleWordClick = (w: string, index: number) => {
      sound.playPop();
      const nextBuilt = [...builtSentence, w];
      setBuiltSentence(nextBuilt);

      const nextRemaining = [...sentenceTokens];
      nextRemaining.splice(index, 1);
      setSentenceTokens(nextRemaining);

      if (nextRemaining.length === 0) {
        const cleanTarget = targetWord.exampleSentence.replace(/[.,]/g, '').toLowerCase();
        const cleanBuilt = nextBuilt.join(' ').toLowerCase();
        const isCorrect = cleanTarget === cleanBuilt;
        handleResult(isCorrect);
      }
    };

    return (
      <div className="text-center py-2">
        <p className="text-xs text-pink-600 font-bold uppercase tracking-wider mb-2">
          Arrange the words into a correct sentence:
        </p>

        {/* Built sentence area */}
        <div className="min-h-[70px] bg-purple-50/70 border-2 border-dashed border-purple-200 rounded-2xl p-3 flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto mb-6">
          {builtSentence.length === 0 ? (
            <span className="text-xs text-purple-400 italic">Tap words below in order...</span>
          ) : (
            builtSentence.map((w, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-semibold text-sm shadow-xs"
              >
                {w}
              </span>
            ))
          )}
        </div>

        {/* Word pool */}
        <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto mb-4">
          {sentenceTokens.map((w, i) => (
            <button
              key={i}
              disabled={answered}
              onClick={() => handleWordClick(w, i)}
              className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-pink-200 hover:border-pink-400 text-slate-800 font-semibold text-sm shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const getTitle = () => {
    switch (activityType) {
      case 'match_word':
        return 'Match the Word to Its Definition';
      case 'choose_meaning':
        return `What Does "${targetWord.word}" Mean?`;
      case 'spell_word':
        return 'Listen & Spell the Word';
      case 'fill_blank':
        return 'Fill in the Blank';
      case 'word_builder':
        return 'Garden Word Builder';
      case 'hear_choose':
        return 'Hear and Choose the Word';
      case 'definition_detective':
        return 'Definition Detective';
      case 'sentence_builder':
        return 'Sentence Builder';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-pink-100 shadow-lg shadow-pink-100/60 max-w-2xl mx-auto">
      {/* Activity Header */}
      <div className="flex items-center justify-between border-b border-pink-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌸</span>
          <h4 className="font-bold text-pink-900 text-base sm:text-lg font-['Fredoka']">
            {getTitle()}
          </h4>
        </div>
        <span className="text-xs bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full font-semibold border border-pink-200">
          Target: {targetWord.word}
        </span>
      </div>

      {/* Prompts for specific activities */}
      {activityType === 'definition_detective' && (
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-2xl p-4 mb-4 text-center">
          <p className="text-xs text-pink-600 font-bold uppercase tracking-wider mb-1">
            Mystery Definition Clue:
          </p>
          <p className="text-base text-slate-800 font-medium">"{targetWord.definition}"</p>
        </div>
      )}

      {activityType === 'hear_choose' && (
        <div className="text-center py-4 mb-2">
          <button
            onClick={() => {
              sound.playPop();
              sound.speak(targetWord.word);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold shadow-md shadow-pink-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Volume2 className="w-5 h-5 animate-pulse" />
            <span>🔊 Hear Word Again</span>
          </button>
          <p className="text-xs text-slate-500 mt-2">Which written word matches what you heard?</p>
        </div>
      )}

      {/* Render selected activity */}
      {(activityType === 'match_word' ||
        activityType === 'choose_meaning' ||
        activityType === 'hear_choose' ||
        activityType === 'definition_detective') &&
        renderMultipleChoice()}

      {activityType === 'spell_word' && renderSpellWord()}
      {activityType === 'fill_blank' && renderFillInBlank()}
      {activityType === 'word_builder' && renderWordBuilder()}
      {activityType === 'sentence_builder' && renderSentenceBuilder()}

      {/* Encouragement & Next Button Bar */}
      {feedback && (
        <div
          className={`mt-6 p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
            feedback.isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <span className="text-2xl">{feedback.isCorrect ? '🌸' : '🌱'}</span>
            <div>
              <p className="font-bold text-sm sm:text-base">{feedback.message}</p>
              {feedback.isCorrect ? (
                <p className="text-xs text-emerald-700">+5 XP earned toward blooming your garden!</p>
              ) : (
                <p className="text-xs text-rose-700">We will practice this word again in your review garden.</p>
              )}
            </div>
          </div>

          {onNext && (
            <button
              onClick={() => {
                sound.playPop();
                onNext();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-md shadow-pink-200 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

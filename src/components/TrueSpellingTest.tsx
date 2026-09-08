import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Eye,
  EyeOff,
  BookOpen,
  ListOrdered,
  Flame,
  Star
} from 'lucide-react';
import { VocabWord, UserProfile } from '../types';
import { sound } from '../utils/audio';
import { getSpellingBreakdown } from '../utils/dailyLearningHelper';
import { triggerCelebrationConfetti, triggerSparkleConfetti } from '../utils/storage';

interface TrueSpellingTestProps {
  words: VocabWord[];
  profile: UserProfile;
  onUpdateSpellingScore: (
    word: VocabWord,
    isCorrect: boolean,
    isIndependentTest: boolean
  ) => void;
  onAddXp: (amount: number) => void;
  onSpellingCompleted?: (count: number) => void;
  onBackToHome: () => void;
}

type AppMode = 'practice_learning' | 'test_mode';
type TestStyle = 'practice_test' | 'real_spelling_test';

interface QuestionAnswer {
  word: VocabWord;
  userAnswer: string;
  isCorrect: boolean;
}

export const TrueSpellingTest: React.FC<TrueSpellingTestProps> = ({
  words,
  profile,
  onUpdateSpellingScore,
  onAddXp,
  onSpellingCompleted,
  onBackToHome
}) => {
  // Main tab: Learning Mode vs True Test Mode
  const [appMode, setAppMode] = useState<AppMode>('test_mode');
  // If in True Test Mode: Style 1 (Practice with immediate feedback) vs Style 2 (Real Test without intermediate feedback)
  const [testStyle, setTestStyle] = useState<TestStyle>('real_spelling_test');

  // Test session state
  const [testWords, setTestWords] = useState<VocabWord[]>(() => words.slice(0, 10));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [answersHistory, setAnswersHistory] = useState<QuestionAnswer[]>([]);
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false);

  // In Style 1 (Practice test) only: answer submitted state for current question
  const [practiceSubmitted, setPracticeSubmitted] = useState<boolean>(false);
  const [practiceIsCorrect, setPracticeIsCorrect] = useState<boolean>(false);

  // Learning Mode states (hints allowed)
  const [learningShowWord, setLearningShowWord] = useState<boolean>(false);
  const [learningShowHint, setLearningShowHint] = useState<boolean>(false);

  const currentWord = testWords[currentIndex] || testWords[0];

  // Auto speak the word when navigating to each new question (Step 1: The app speaks the word)
  useEffect(() => {
    if (currentWord && !isTestFinished) {
      setTypedAnswer('');
      setPracticeSubmitted(false);
      setPracticeIsCorrect(false);
      setLearningShowWord(false);
      setLearningShowHint(false);

      const timer = setTimeout(() => {
        sound.speak(currentWord.word);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isTestFinished, appMode]);

  // Audio Buttons (Allowed help: Hear word, Hear in sentence)
  const handleHearWord = () => {
    sound.speak(currentWord.word);
  };

  const handleHearInSentence = () => {
    // Speak sentence with word spoken naturally
    sound.speak(`Sentence: ${currentWord.exampleSentence}`);
  };

  // Submit Answer handler
  const handleSubmitAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanAnswer = typedAnswer.trim();
    if (!cleanAnswer) return;

    const isCorrect = cleanAnswer.toLowerCase() === currentWord.word.trim().toLowerCase();

    // Mode: LEARNING PRACTICE MODE
    if (appMode === 'practice_learning') {
      if (isCorrect) {
        sound.playSuccessChime();
        triggerSparkleConfetti();
        onAddXp(5);
      } else {
        sound.playSoftBoing();
      }
      onUpdateSpellingScore(currentWord, isCorrect, false);
      setPracticeSubmitted(true);
      setPracticeIsCorrect(isCorrect);
      return;
    }

    // Mode: TRUE SPELLING TEST MODE
    if (testStyle === 'practice_test') {
      // Style 1: Practice Test (feedback right away)
      if (isCorrect) {
        sound.playSuccessChime();
        triggerSparkleConfetti();
        onAddXp(10);
      } else {
        sound.playWrongAnswer();
      }
      onUpdateSpellingScore(currentWord, isCorrect, true);
      setPracticeSubmitted(true);
      setPracticeIsCorrect(isCorrect);
      setAnswersHistory((prev) => [
        ...prev,
        { word: currentWord, userAnswer: cleanAnswer, isCorrect }
      ]);
    } else {
      // Style 2: REAL SPELLING TEST
      // 🚫 DO NOT SHOW IF ANSWER IS CORRECT OR INCORRECT AFTER EACH QUESTION.
      sound.playPop();
      onUpdateSpellingScore(currentWord, isCorrect, true);
      const newAnswers = [
        ...answersHistory,
        { word: currentWord, userAnswer: cleanAnswer, isCorrect }
      ];
      setAnswersHistory(newAnswers);

      if (currentIndex + 1 >= testWords.length) {
        // Test complete
        setIsTestFinished(true);
        triggerCelebrationConfetti();
        if (onSpellingCompleted) {
          onSpellingCompleted(newAnswers.length);
        }
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    sound.playPop();
    if (currentIndex + 1 >= testWords.length) {
      setIsTestFinished(true);
      triggerCelebrationConfetti();
      if (onSpellingCompleted) {
        onSpellingCompleted(answersHistory.length);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRestartTest = (wordsToTest?: VocabWord[]) => {
    sound.playPop();
    const chosen = wordsToTest || words.slice(0, 10);
    setTestWords(chosen);
    setCurrentIndex(0);
    setTypedAnswer('');
    setAnswersHistory([]);
    setIsTestFinished(false);
    setPracticeSubmitted(false);
  };

  const totalScore = answersHistory.filter((a) => a.isCorrect).length;
  const incorrectQuestions = answersHistory.filter((a) => !a.isCorrect);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 font-['Quicksand'] text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-extrabold text-xs uppercase tracking-wider">
              {appMode === 'test_mode' ? '📝 True Spelling Assessment' : '🌱 Spelling Practice (Learning)'}
            </span>
            {!isTestFinished && (
              <span className="text-xs text-slate-400 font-bold">
                Word {currentIndex + 1} of {testWords.length}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-['Fredoka']">
            {appMode === 'test_mode' ? '📝 True Spelling Test' : '🌱 Spelling Learning Practice'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {appMode === 'test_mode'
              ? 'Independent spelling assessment without letter hints or visible spellings.'
              : 'Guided learning mode where you can inspect letters, receive hints, and build memory.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToHome}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors cursor-pointer"
          >
            Home Dashboard
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs (Learning vs True Test) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-2 rounded-2xl">
        <div className="flex items-center gap-1.5">
          <button
            id="tab-spelling-test-btn"
            onClick={() => {
              sound.playPop();
              setAppMode('test_mode');
              handleRestartTest();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              appMode === 'test_mode'
                ? 'bg-white text-teal-700 shadow-xs ring-1 ring-black/5'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📝 True Spelling Test</span>
          </button>

          <button
            id="tab-spelling-learning-btn"
            onClick={() => {
              sound.playPop();
              setAppMode('practice_learning');
              handleRestartTest();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              appMode === 'practice_learning'
                ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-black/5'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🌱 Learning Practice Mode</span>
          </button>
        </div>

        {/* If in True Test Mode: Style selector */}
        {appMode === 'test_mode' && !isTestFinished && (
          <div className="flex items-center gap-1 bg-white/70 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => {
                sound.playPop();
                setTestStyle('real_spelling_test');
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                testStyle === 'real_spelling_test'
                  ? 'bg-teal-600 text-white font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Real Test (No hints/answers until end)
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setTestStyle('practice_test');
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                testStyle === 'practice_test'
                  ? 'bg-teal-600 text-white font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Practice Test (Feedback per word)
            </button>
          </div>
        )}
      </div>

      {/* TEST FINISHED: Comprehensive Results Screen */}
      {isTestFinished ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-teal-200 shadow-lg space-y-6 text-center">
          <div className="inline-flex p-4 rounded-3xl bg-teal-50 text-teal-600 text-3xl">
            📝
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 font-['Fredoka']">
            Your Spelling Results
          </h2>

          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-50 border-2 border-amber-300">
            <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-['Fredoka']">
              Score: {totalScore} / {answersHistory.length}
            </span>
          </div>

          <p className="text-sm text-slate-600 max-w-md mx-auto">
            {totalScore === answersHistory.length
              ? '🌟 Incredible perfection! You demonstrated complete independent spelling mastery!'
              : totalScore >= answersHistory.length * 0.7
              ? '🎉 Wonderful spelling! You have great independent accuracy. Check out the words below to keep polishing!'
              : "🌱 Good effort! Independent spelling takes regular practice. Let's review the words you missed!"}
          </p>

          {/* Question-by-question Review */}
          <div className="space-y-3 text-left pt-2">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Question-by-Question Detailed Review
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              {answersHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.isCorrect
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-rose-50/60 border-rose-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">Word {idx + 1}:</span>
                      <button
                        onClick={() => sound.speak(item.word.word)}
                        className="inline-flex items-center gap-1 text-xs font-extrabold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 hover:bg-slate-50 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Hear Word</span>
                      </button>
                    </div>

                    <div className="text-sm font-semibold flex items-center gap-2">
                      <span className="text-slate-500">Your Answer:</span>
                      <span className={`font-mono font-bold ${item.isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                        {item.userAnswer}
                      </span>
                    </div>

                    {!item.isCorrect && (
                      <div className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                        <span className="text-slate-500 font-normal">Correct Spelling:</span>
                        <span className="font-mono text-teal-700 font-extrabold tracking-wider uppercase">
                          {item.word.word}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs font-extrabold flex items-center gap-1.5 shrink-0">
                    {item.isCorrect ? (
                      <span className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Correct! Great spelling!
                      </span>
                    ) : (
                      <span className="text-rose-700 bg-rose-100 px-3 py-1 rounded-full flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Almost! Added to review list
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100">
            {incorrectQuestions.length > 0 && (
              <button
                onClick={() => handleRestartTest(incorrectQuestions.map((q) => q.word))}
                className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Practice Missed Words ({incorrectQuestions.length})</span>
              </button>
            )}

            <button
              onClick={() => handleRestartTest()}
              className="px-6 py-3 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Take Another Test</span>
            </button>

            <button
              onClick={onBackToHome}
              className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md cursor-pointer"
            >
              Back to Daily Tracker
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE TEST / PRACTICE CARD */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200/90 shadow-md space-y-6">
          {/* Progress Pill */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Question {currentIndex + 1} of {testWords.length}
            </span>
            <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-teal-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / testWords.length) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1: AUDIO PROMPT (Hear the word) */}
          <div className="text-center py-4 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Step 1: Listen Carefully
            </div>

            <button
              id="spelling-hear-word-btn"
              type="button"
              onClick={handleHearWord}
              className="px-8 py-4 rounded-3xl bg-teal-50 hover:bg-teal-100 text-teal-800 border-2 border-teal-300 font-extrabold text-base sm:text-lg shadow-sm cursor-pointer inline-flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
            >
              <Volume2 className="w-6 h-6 text-teal-600 animate-pulse" />
              <span>🔊 Listen to the Word</span>
            </button>

            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleHearWord}
                className="text-xs text-teal-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Hear Again</span>
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={handleHearInSentence}
                className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Hear in a Sentence</span>
              </button>
            </div>
          </div>

          {/* LEARNING MODE ONLY: HINTS AND WORD REVEAL ALLOWED */}
          {appMode === 'practice_learning' && (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold">🌱 Learning Practice Aids:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLearningShowHint(!learningShowHint)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 font-bold hover:bg-indigo-100 cursor-pointer"
                  >
                    {learningShowHint ? 'Hide Hint' : '💡 Show Hint'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLearningShowWord(!learningShowWord)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 font-bold hover:bg-indigo-100 cursor-pointer"
                  >
                    {learningShowWord ? 'Hide Word' : '👀 Show Word'}
                  </button>
                </div>
              </div>

              {learningShowHint && (
                <div className="text-slate-700 bg-white/80 p-2.5 rounded-xl border border-indigo-100">
                  <strong>Meaning:</strong> {currentWord.definition}
                </div>
              )}

              {learningShowWord && (
                <div className="text-indigo-800 bg-white p-2.5 rounded-xl border border-indigo-200 font-mono font-extrabold text-sm tracking-widest text-center uppercase">
                  {getSpellingBreakdown(currentWord.word)}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: TYPE SPELLING (NO HINTS IN TRUE TEST MODE) */}
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-2 text-center">
                Step 2: Type What You Hear
              </label>

              <input
                id="spelling-answer-input"
                type="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                value={typedAnswer}
                disabled={practiceSubmitted}
                onChange={(e) => setTypedAnswer(e.target.value)}
                placeholder="Type your spelling here..."
                className="w-full text-center py-4 px-5 rounded-2xl border-3 border-slate-300 focus:border-teal-500 focus:outline-none text-xl sm:text-2xl font-bold font-mono tracking-wider text-slate-800 bg-slate-50 focus:bg-white shadow-inner transition-all"
                autoFocus
              />
            </div>

            {/* STYLE 1 OR PRACTICE LEARNING: IMMEDIATE FEEDBACK */}
            {practiceSubmitted && (
              <div
                className={`p-4 rounded-2xl border-2 text-center animate-in fade-in duration-200 space-y-1.5 ${
                  practiceIsCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                <div className="text-base font-extrabold flex items-center justify-center gap-1.5">
                  {practiceIsCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>🌟 Correct! Great spelling!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>🌱 Not quite. Let's practice this word again later.</span>
                    </>
                  )}
                </div>

                <div className="text-xs font-semibold">
                  Correct spelling:{' '}
                  <strong className="font-mono text-sm tracking-widest uppercase">
                    {currentWord.word}
                  </strong>
                </div>
              </div>
            )}

            {/* STEP 3: SUBMIT / NEXT BUTTONS */}
            <div className="pt-2 flex items-center justify-center">
              {!practiceSubmitted ? (
                <button
                  id="spelling-submit-answer-btn"
                  type="submit"
                  disabled={!typedAnswer.trim()}
                  className={`w-full sm:w-auto px-10 py-3.5 rounded-full font-extrabold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 ${
                    typedAnswer.trim()
                      ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer hover:scale-102'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>✔️ Submit Answer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="spelling-next-question-btn"
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm sm:text-base shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <span>➡️ Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

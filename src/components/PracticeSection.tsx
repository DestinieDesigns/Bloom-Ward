import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Layers,
  GraduationCap,
  Mic,
  PenTool,
  Award,
  BookOpen,
  Flower2,
  Flame,
  Star,
  Shuffle
} from 'lucide-react';
import { VocabWord, UserProfile, AppSection } from '../types';
import { sound } from '../utils/audio';
import { triggerSparkleConfetti, triggerCelebrationConfetti } from '../utils/storage';
import { getSyllables, getMemoryTip } from '../utils/dailyLearningHelper';

interface PracticeSectionProps {
  words: VocabWord[];
  profile: UserProfile;
  onSelectSection: (section: AppSection) => void;
  onUpdateWordScore: (word: VocabWord, isCorrect: boolean) => void;
  onAddXp: (amount: number) => void;
  onOpenHomework?: () => void;
}

type PracticeMode = 'hub' | 'pronunciation';

export const PracticeSection: React.FC<PracticeSectionProps> = ({
  words,
  profile,
  onSelectSection,
  onUpdateWordScore,
  onAddXp,
  onOpenHomework
}) => {
  const [currentMode, setCurrentMode] = useState<PracticeMode>('hub');

  // Pronunciation Lab sub-state
  const [pronounceIndex, setPronounceIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const practiceWords = words.filter((w) => !w.mastered).slice(0, 15);
  const activePracticeList = practiceWords.length > 0 ? practiceWords : words.slice(0, 15);
  const currentPronounceWord = activePracticeList[pronounceIndex] || activePracticeList[0];

  const handlePronounceRecording = () => {
    sound.playPop();
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
      sound.playSuccessChime();
      triggerSparkleConfetti();
      onAddXp(5);
    }, 1800);
  };

  const handleNextPronounceWord = () => {
    sound.playPop();
    setHasRecorded(false);
    setIsRecording(false);
    setPronounceIndex((prev) => (prev + 1) % activePracticeList.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 font-['Quicksand']">
      {currentMode === 'hub' ? (
        <>
          {/* Practice Section Hero Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 p-6 sm:p-10 text-white shadow-xl border-2 border-emerald-900/40 text-left relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-bold mb-3">
                <span>🎯</span>
                <span>Active Skill Practice</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Fredoka'] mb-2 drop-shadow-xs">
                Reinforce Your Knowledge
              </h1>

              <p className="text-sm sm:text-base text-stone-300 font-medium mb-6 leading-relaxed max-w-xl">
                Target your vocabulary through 5 core interactive learning modes. Practice builds long-term memory!
              </p>

              <div className="flex items-center gap-4 text-xs sm:text-sm text-stone-300 font-semibold">
                <span>📚 {words.length} Total Words</span>
                <span>•</span>
                <span>🔥 {words.filter((w) => !w.mastered).length} Currently Learning</span>
                <span>•</span>
                <span>⭐ Earn XP & Coins</span>
              </div>
            </div>
          </div>

          {/* 5 Core Practice Options (Clean, Focused, 3–5 Choices) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-800 font-['Fredoka']">
                Primary Practice Modes
              </h2>
              <span className="text-xs text-stone-500 font-semibold">
                Select an activity to begin
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Option 1: 🃏 Flashcards */}
              <div
                id="practice-flashcards-card"
                onClick={() => {
                  sound.playPop();
                  onSelectSection('flashcards');
                }}
                className="group p-6 rounded-3xl bg-white border-2 border-indigo-200 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between text-left space-y-4"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                    🃏
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-900 font-['Fredoka'] mb-1">
                    Flashcards
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Interactive 3D cards that display the full definition, example sentence, and syllables when flipped.
                  </p>
                </div>
                <div className="pt-3 border-t border-indigo-100 flex items-center justify-between text-xs font-bold text-indigo-700">
                  <span>Start Card Flip Deck</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Option 2: ✏️ Spelling Adventure */}
              <div
                id="practice-spelling-card"
                onClick={() => {
                  sound.playPop();
                  onSelectSection('spelling_adventure');
                }}
                className="group p-6 rounded-3xl bg-white border-2 border-emerald-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between text-left space-y-4"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                    ✏️
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-900 font-['Fredoka'] mb-1">
                    Spelling Adventure
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Hear words spoken aloud, build with letter tiles, and receive gentle phonics guidance.
                  </p>
                </div>
                <div className="pt-3 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Interactive Letter Tiles</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Option 3: 🎙️ Pronunciation Lab */}
              <div
                id="practice-pronunciation-card"
                onClick={() => {
                  sound.playPop();
                  setCurrentMode('pronunciation');
                }}
                className="group p-6 rounded-3xl bg-white border-2 border-amber-200 hover:border-amber-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between text-left space-y-4"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                    🎙️
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-900 font-['Fredoka'] mb-1">
                    Pronunciation Lab
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Hear clear phonetic cadence, practice speaking words aloud, and repeat until confident.
                  </p>
                </div>
                <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-800">
                  <span>Speak & Repeat</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Option 4: 🎯 Word Challenges */}
              <div
                id="practice-challenges-card"
                onClick={() => {
                  sound.playPop();
                  onSelectSection('daily_adventure');
                }}
                className="group p-6 rounded-3xl bg-white border-2 border-purple-200 hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between text-left space-y-4"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                    🎯
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-900 font-['Fredoka'] mb-1">
                    Word Challenges
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Engage in meaning detective puzzles, sentence building, and context fill-in-the-blanks.
                  </p>
                </div>
                <div className="pt-3 border-t border-purple-100 flex items-center justify-between text-xs font-bold text-purple-700">
                  <span>5-Minute Word Quest</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Option 5: 📝 Real Spelling Test */}
              <div
                id="practice-test-card"
                onClick={() => {
                  sound.playPop();
                  onSelectSection('spelling_test');
                }}
                className="group p-6 rounded-3xl bg-white border-2 border-rose-200 hover:border-rose-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between text-left space-y-4"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                    📝
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-900 font-['Fredoka'] mb-1">
                    True Spelling Test
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    A real test experience. Hear the word and type it—answers are never revealed before submission!
                  </p>
                </div>
                <div className="pt-3 border-t border-rose-100 flex items-center justify-between text-xs font-bold text-rose-700">
                  <span>Take Independent Test</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Secondary Explore Option */}
              <div
                onClick={() => {
                  sound.playPop();
                  onSelectSection('flower_garden');
                }}
                className="group p-6 rounded-3xl bg-stone-50 border-2 border-dashed border-stone-300 hover:border-stone-400 hover:bg-white transition-all cursor-pointer flex flex-col justify-between text-left space-y-4"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-stone-200 text-stone-700 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                    🌱
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-900 font-['Fredoka'] mb-1">
                    Knowledge Garden
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Watch your vocabulary bloom into permanent botanical flowers as words reach mastery.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>View Garden Growth</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* PRONUNCIATION LAB SUB-VIEW */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-stone-200/80 shadow-md space-y-6 text-left">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Practice Mode
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Fredoka']">
                🎙️ Pronunciation Lab
              </h2>
            </div>
            <button
              onClick={() => setCurrentMode('hub')}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              ← Back to Practice Hub
            </button>
          </div>

          {currentPronounceWord && (
            <div className="max-w-xl mx-auto text-center space-y-6 py-4">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                Word {pronounceIndex + 1} of {activePracticeList.length}
              </div>

              {/* Big Word Display */}
              <div>
                <h3 className="text-5xl sm:text-6xl font-extrabold text-stone-900 font-['Fredoka'] tracking-wide">
                  {currentPronounceWord.word.toUpperCase()}
                </h3>
                <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-sm font-bold font-mono">
                  <span>Syllables:</span>
                  <span>{getSyllables(currentPronounceWord.word)}</span>
                </div>
              </div>

              {/* Definition Prompt */}
              <p className="text-sm sm:text-base text-stone-600 italic max-w-md mx-auto">
                "{currentPronounceWord.definition}"
              </p>

              {/* Audio Listen Button */}
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => sound.speak(currentPronounceWord.word)}
                  className="px-6 py-3.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-md cursor-pointer inline-flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Hear Word Spoken Aloud</span>
                </button>
              </div>

              {/* Speak & Record Simulation */}
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 max-w-md mx-auto space-y-3">
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Your Turn: Speak It Aloud
                </p>
                <button
                  onClick={handlePronounceRecording}
                  disabled={isRecording}
                  className={`w-full py-3.5 px-6 rounded-2xl text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : hasRecorded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-900 hover:bg-stone-800 text-white shadow-sm'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  <span>
                    {isRecording
                      ? 'Listening to pronunciation...'
                      : hasRecorded
                      ? '✓ Great Vocal Clarity! (Tap to Repeat)'
                      : 'Tap to Practice Speaking'}
                  </span>
                </button>
                {hasRecorded && (
                  <p className="text-xs font-bold text-emerald-700">
                    Wonderful effort! Pronunciation practice helps speech and spelling memory. +5 XP
                  </p>
                )}
              </div>

              {/* Next Button */}
              <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                <button
                  onClick={() => {
                    sound.speak(currentPronounceWord.exampleSentence);
                  }}
                  className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Hear in Example Sentence
                </button>
                <button
                  onClick={handleNextPronounceWord}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-extrabold cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Next Word</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

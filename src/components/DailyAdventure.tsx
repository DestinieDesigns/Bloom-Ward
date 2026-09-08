import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Volume2,
  Flower2,
  Award,
  Flame,
  RotateCcw
} from 'lucide-react';
import { VocabWord, BibleWord, ActivityType, UserProfile } from '../types';
import { sound } from '../utils/audio';
import { triggerSparkleConfetti, triggerCelebrationConfetti } from '../utils/storage';
import { ActivityRunner } from './activities/ActivityRunner';
import { WordCard } from './WordCard';

interface DailyAdventureProps {
  dailyWords: VocabWord[];
  allWords: VocabWord[];
  dailyBibleWord: BibleWord;
  profile: UserProfile;
  onUpdateWordScore: (word: VocabWord, isCorrect: boolean) => void;
  onAddXp: (amount: number) => void;
  onAdvanceGarden: () => void;
  onFinishDaily: () => void;
}

export const DailyAdventure: React.FC<DailyAdventureProps> = ({
  dailyWords,
  allWords,
  dailyBibleWord,
  profile,
  onUpdateWordScore,
  onAddXp,
  onAdvanceGarden,
  onFinishDaily
}) => {
  // Step flow:
  // Step 0: Intro overview
  // Step 1..N: Word cards discovery (read, listen, understand)
  // Step N+1..N+M: Interactive activities (Spelling, Meaning, Fill-in, Word builder)
  // Step Bible: Faith garden word of the day
  // Step Final: Celebration & Summary

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [discoveredWordIdx, setDiscoveredWordIdx] = useState<number>(0);
  const [activityIdx, setActivityIdx] = useState<number>(0);
  const [bibleCompleted, setBibleCompleted] = useState<boolean>(false);
  const [bibleChoice, setBibleChoice] = useState<number | null>(null);
  const [earnedSessionXp, setEarnedSessionXp] = useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

  const activitiesSequence: { word: VocabWord; type: ActivityType }[] = [
    { word: dailyWords[0] || allWords[0], type: 'choose_meaning' },
    { word: dailyWords[1] || allWords[1], type: 'spell_word' },
    { word: dailyWords[2] || allWords[2], type: 'fill_blank' },
    { word: dailyWords[3] || allWords[3] || dailyWords[0], type: 'word_builder' }
  ];

  const handleNextDiscovery = () => {
    sound.playPop();
    if (discoveredWordIdx + 1 < dailyWords.length) {
      setDiscoveredWordIdx((prev) => prev + 1);
    } else {
      // Advance to activities
      setCurrentStep(2);
    }
  };

  const handleActivityComplete = (isCorrect: boolean) => {
    const activeActivity = activitiesSequence[activityIdx];
    if (activeActivity) {
      onUpdateWordScore(activeActivity.word, isCorrect);
    }

    if (isCorrect) {
      setEarnedSessionXp((prev) => prev + 5);
      setCorrectAnswersCount((prev) => prev + 1);
      onAddXp(5);
    }
  };

  const handleNextActivity = () => {
    sound.playPop();
    if (activityIdx + 1 < activitiesSequence.length) {
      setActivityIdx((prev) => prev + 1);
    } else {
      // Go to Bible word step
      setCurrentStep(3);
    }
  };

  const handleBibleAnswer = (optionIdx: number) => {
    sound.playPop();
    setBibleChoice(optionIdx);
    const challenge = dailyBibleWord.quickChallenges[0];
    const isCorrect = optionIdx === (challenge ? challenge.correctIndex : 0);

    if (isCorrect) {
      sound.playSuccessChime();
      setEarnedSessionXp((prev) => prev + 10);
      onAddXp(10);
    } else {
      sound.playEncourageSound();
    }
    setBibleCompleted(true);
  };

  const handleFinishAdventure = () => {
    sound.playLevelUpFanfare();
    triggerCelebrationConfetti();
    onAddXp(15); // Completion bonus
    setEarnedSessionXp((prev) => prev + 15);
    onAdvanceGarden();
    setCurrentStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Progress Stepper Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-pink-100 shadow-sm mb-6">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="font-bold text-xs sm:text-sm text-pink-700 font-['Fredoka'] flex items-center gap-1.5">
            <span className="text-base">🌸</span> Today's Learning Adventure
          </span>
          <span className="text-xs font-semibold text-pink-500 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200">
            {currentStep === 0 && 'Ready to Start'}
            {currentStep === 1 && `Word ${discoveredWordIdx + 1} of ${dailyWords.length}`}
            {currentStep === 2 && `Activity ${activityIdx + 1} of ${activitiesSequence.length}`}
            {currentStep === 3 && 'Faith Word of the Day'}
            {currentStep === 4 && 'Complete! 🎉'}
          </span>
        </div>

        {/* Dynamic Stepper Dots */}
        <div className="grid grid-cols-5 gap-2 mt-2">
          {[
            { label: 'Start', step: 0 },
            { label: 'Learn Words', step: 1 },
            { label: 'Fun Practice', step: 2 },
            { label: 'Faith Garden', step: 3 },
            { label: 'Celebration', step: 4 }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  currentStep >= item.step
                    ? 'bg-gradient-to-r from-pink-500 to-rose-400'
                    : 'bg-pink-100'
                }`}
              />
              <p className="text-[10px] text-center font-semibold text-pink-400 hidden sm:block">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 0: INTRO OVERVIEW */}
      {currentStep === 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-pink-100 shadow-xl shadow-pink-100/50 text-center relative overflow-hidden">
          <div className="inline-block p-4 rounded-3xl bg-gradient-to-tr from-pink-200 via-rose-100 to-purple-100 mb-4 shadow-sm animate-gentle-float">
            <span className="text-5xl">🌸</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-900 tracking-tight font-['Fredoka'] mb-2">
            Ready to Blossom Today, {profile.name}?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto mb-6">
            We’ve prepared a short, fun session just for you. Complete these gentle steps to grow your knowledge and water your flower garden!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto mb-8 text-left">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-pink-50 border border-pink-100">
              <span className="text-xl">🌸</span>
              <div>
                <p className="font-bold text-xs sm:text-sm text-pink-900">Explore New Words</p>
                <p className="text-[11px] text-pink-600">Discover child-friendly definitions & audio</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-purple-50 border border-purple-100">
              <span className="text-xl">✏️</span>
              <div>
                <p className="font-bold text-xs sm:text-sm text-purple-900">Interactive Spelling</p>
                <p className="text-[11px] text-purple-600">Listen, spell, and build words</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-100">
              <span className="text-xl">✝️</span>
              <div>
                <p className="font-bold text-xs sm:text-sm text-rose-900">Faith Garden Word</p>
                <p className="text-[11px] text-rose-600">Learn "{dailyBibleWord.word}" & Scripture verse</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-100">
              <span className="text-xl">⭐</span>
              <div>
                <p className="font-bold text-xs sm:text-sm text-amber-900">Earn Sparkle Rewards</p>
                <p className="text-[11px] text-amber-600">+35 XP & new flower petals blooming</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playSuccessChime();
              triggerSparkleConfetti();
              setCurrentStep(1);
            }}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-pink-300 hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Start Today’s Adventure</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* STEP 1: WORD DISCOVERY CARDS */}
      {currentStep === 1 && dailyWords[discoveredWordIdx] && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-pink-900 font-['Fredoka']">
              Step 1: Read & Understand
            </h3>
            <p className="text-xs sm:text-sm text-pink-500">
              Listen to how it sounds, read what it means, and see it in a sentence!
            </p>
          </div>

          <WordCard
            word={dailyWords[discoveredWordIdx]}
            showPracticeBtn={false}
          />

          <div className="flex justify-end">
            <button
              onClick={handleNextDiscovery}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-base shadow-md shadow-pink-200 hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>
                {discoveredWordIdx + 1 < dailyWords.length ? 'Next Word 🌸' : 'Start Practice Games 🎮'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: INTERACTIVE PRACTICE ACTIVITIES */}
      {currentStep === 2 && activitiesSequence[activityIdx] && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-pink-900 font-['Fredoka']">
              Step 2: Fun Practice Challenge
            </h3>
            <p className="text-xs sm:text-sm text-pink-500">
              Challenge {activityIdx + 1} of {activitiesSequence.length}
            </p>
          </div>

          <ActivityRunner
            targetWord={activitiesSequence[activityIdx].word}
            allWords={allWords}
            activityType={activitiesSequence[activityIdx].type}
            onComplete={handleActivityComplete}
            onNext={handleNextActivity}
          />
        </div>
      )}

      {/* STEP 3: BIBLE WORD OF THE DAY */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-pink-100 shadow-xl shadow-pink-100/60">
          <div className="flex items-center justify-between border-b border-pink-100 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl">
                ✝️
              </div>
              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                  Faith & Word Garden
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-['Fredoka']">
                  Word of the Day: {dailyBibleWord.word}
                </h3>
              </div>
            </div>

            <button
              onClick={() => sound.speak(dailyBibleWord.word)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-xs cursor-pointer"
            >
              <Volume2 className="w-4 h-4" /> Listen
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200">
              <p className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-1">
                Child-Friendly Meaning
              </p>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {dailyBibleWord.childDefinition}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
              <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
                Scripture Connection ({dailyBibleWord.scriptureReference})
              </p>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "{dailyBibleWord.scriptureVerse}"
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 mb-6">
            <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
              Real-Life Example for Kids
            </p>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {dailyBibleWord.realLifeExample}
            </p>
          </div>

          {/* Quick Faith Challenge */}
          {dailyBibleWord.quickChallenges && dailyBibleWord.quickChallenges[0] && (
            <div className="border-t border-pink-100 pt-5">
              <p className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-2">
                Quick Faith Challenge:
              </p>
              <p className="text-sm sm:text-base font-bold text-slate-800 mb-4">
                {dailyBibleWord.quickChallenges[0].question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dailyBibleWord.quickChallenges[0].options.map((opt, oIdx) => {
                  let btnStyle = 'bg-white border-2 border-pink-200 hover:border-pink-400 text-slate-700';

                  if (bibleCompleted) {
                    if (oIdx === dailyBibleWord.quickChallenges[0].correctIndex) {
                      btnStyle = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-900 font-bold';
                    } else if (bibleChoice === oIdx) {
                      btnStyle = 'bg-rose-100 border-2 border-rose-400 text-rose-900';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={bibleCompleted}
                      onClick={() => handleBibleAnswer(oIdx)}
                      className={`p-3.5 rounded-2xl text-left text-sm font-medium transition-all shadow-xs cursor-pointer ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {bibleCompleted && (
                <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
                  <span className="text-xs sm:text-sm text-emerald-800 font-bold">
                    🌸 {dailyBibleWord.quickChallenges[0].explanation}
                  </span>
                  <button
                    onClick={handleFinishAdventure}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-md cursor-pointer shrink-0"
                  >
                    Finish Daily Adventure ✨
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 4: CELEBRATION */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-pink-100 shadow-2xl shadow-pink-200/60 text-center relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-pink-400 via-rose-300 to-purple-400 flex items-center justify-center text-4xl shadow-lg shadow-pink-200 mb-5 animate-bounce">
            👑
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-pink-900 tracking-tight font-['Fredoka'] mb-2">
            Awesome Blooming, {profile.name}!
          </h2>
          <p className="text-base text-pink-600 font-medium mb-6">
            You completed today’s learning adventure with flying pink ribbons!
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
            <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200">
              <span className="text-2xl block mb-1">⭐</span>
              <p className="text-xl font-extrabold text-pink-700 font-['Fredoka']">
                +{earnedSessionXp} XP
              </p>
              <p className="text-[11px] text-pink-500 font-medium">Knowledge Earned</p>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
              <span className="text-2xl block mb-1">🔥</span>
              <p className="text-xl font-extrabold text-orange-600 font-['Fredoka']">
                {profile.streak} Days
              </p>
              <p className="text-[11px] text-orange-500 font-medium">Daily Streak</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
              <span className="text-2xl block mb-1">🌸</span>
              <p className="text-xl font-extrabold text-purple-700 font-['Fredoka']">
                Bloomed
              </p>
              <p className="text-[11px] text-purple-500 font-medium">Garden Watered</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                sound.playPop();
                onFinishDaily();
              }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-base shadow-lg shadow-pink-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              🌸 Visit My Flower Garden
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

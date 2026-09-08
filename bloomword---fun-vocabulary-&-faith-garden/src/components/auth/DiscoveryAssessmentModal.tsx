import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Award,
  Volume2
} from 'lucide-react';
import { LearningLevel } from '../../types';
import { sound } from '../../utils/audio';
import { triggerCelebrationConfetti } from '../../utils/storage';

interface DiscoveryAssessmentModalProps {
  isOpen: boolean;
  studentName: string;
  onComplete: (level: LearningLevel, xpEarned: number) => void;
  onSkip?: () => void;
}

interface WarmupQuestion {
  id: string;
  category: string;
  prompt: string;
  speechText: string;
  options: string[];
  correctIndex: number;
  funFact: string;
}

const WARMUP_QUESTIONS: WarmupQuestion[] = [
  {
    id: 'q1',
    category: 'Word Meaning',
    prompt: 'What does the word "Courageous" mean?',
    speechText: 'What does the word Courageous mean?',
    options: [
      'Brave, strong-hearted, and facing challenges with honor',
      'Feeling very sleepy after dinner',
      'Running away from gentle butterflies'
    ],
    correctIndex: 0,
    funFact: 'Courageous comes from the Latin word "cor", which means "heart"!'
  },
  {
    id: 'q2',
    category: 'Spelling Detective',
    prompt: 'Which spelling is correct for something that brings delight to your eyes?',
    speechText: 'Which spelling is correct for something that brings delight to your eyes?',
    options: ['Beutiful', 'Beautiful', 'Beautifull'],
    correctIndex: 1,
    funFact: 'A fun trick: "Big Elephants Can Always Understand Tiny Insects And Laugh" spells B-E-A-U-T-I-F-U-L!'
  },
  {
    id: 'q3',
    category: 'Story Context',
    prompt: 'Fill in the blank: "The golden sunflowers _______ gently in the warm afternoon breeze."',
    speechText: 'Fill in the blank: The golden sunflowers blank gently in the warm afternoon breeze.',
    options: ['swayed', 'froze into ice', 'teleported'],
    correctIndex: 0,
    funFact: 'Sunflowers actually turn their heads toward the sun as it moves across the sky!'
  }
];

export const DiscoveryAssessmentModal: React.FC<DiscoveryAssessmentModalProps> = ({
  isOpen,
  studentName,
  onComplete,
  onSkip
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = WARMUP_QUESTIONS[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswerChecked) return;
    sound.playPop();
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerChecked(true);

    if (selectedAnswer === currentQ.correctIndex) {
      sound.playSuccessChime();
      setScore((s) => s + 1);
    } else {
      sound.playSoftBoing();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < WARMUP_QUESTIONS.length) {
      sound.playPop();
      setCurrentIndex((c) => c + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      sound.playLevelUpFanfare();
      triggerCelebrationConfetti();
      setIsFinished(true);
    }
  };

  const handleFinish = () => {
    // Estimate level based on score
    let assessedLevel: LearningLevel = 'intermediate';
    if (score === 3) assessedLevel = 'advanced';
    else if (score <= 1) assessedLevel = 'elementary';

    onComplete(assessedLevel, 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-['Quicksand']">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-emerald-100 text-left relative overflow-hidden">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500" />

        {!isFinished ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  🌱 Welcome Discovery
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-['Fredoka'] mt-1">
                  Let's Discover Your Learning Path!
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-400">
                Step {currentIndex + 1} of {WARMUP_QUESTIONS.length}
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Hi {studentName}! Answer these 3 fun questions to help us tailor your words and stories. (This is not a test!)
            </p>

            {/* Question Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  {currentQ.category}
                </span>
                <button
                  type="button"
                  onClick={() => sound.speak(currentQ.speechText)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  title="Read question aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-base sm:text-lg font-bold text-slate-800 font-['Fredoka'] mt-2 leading-snug">
                {currentQ.prompt}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2 mb-4">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let btnStyle = 'bg-white border-slate-200 hover:border-emerald-300 text-slate-700';

                if (isAnswerChecked) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-50 border-rose-400 text-rose-800';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200 font-bold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswerChecked}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3 rounded-xl border text-left text-sm transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswerChecked && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerChecked && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Fun Fact / Feedback */}
            {isAnswerChecked && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800 mb-4 animate-fadeIn">
                <p className="font-bold flex items-center gap-1 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Did You Know?
                </p>
                <p>{currentQ.funFact}</p>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2">
              {onSkip && !isAnswerChecked && (
                <button
                  type="button"
                  onClick={onSkip}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Skip for now
                </button>
              )}
              <div className="ml-auto">
                {!isAnswerChecked ? (
                  <button
                    type="button"
                    disabled={selectedAnswer === null}
                    onClick={handleCheckAnswer}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 cursor-pointer transition-all disabled:opacity-50"
                  >
                    Check
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-emerald-200 cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Completion Screen */
          <div className="text-center py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-3xl mx-auto mb-3">
              🎉
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-['Fredoka'] mb-2">
              You're Ready to Bloom, {studentName}!
            </h2>

            <p className="text-sm text-slate-600 mb-6 max-w-sm mx-auto">
              We personalized your learning path with fun stories, word definitions, and exciting challenges.
            </p>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center mb-6 max-w-xs mx-auto">
              <div className="text-xs font-extrabold text-emerald-700 uppercase tracking-wide">
                Welcome Reward
              </div>
              <div className="text-2xl font-black text-emerald-800 font-['Fredoka'] mt-1">
                +50 XP
              </div>
              <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                Seedling Explorer Badge Unlocked!
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-200 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <span>▶ START MY LEARNING JOURNEY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

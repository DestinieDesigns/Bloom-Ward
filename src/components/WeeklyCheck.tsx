import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Award,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Volume2,
  Heart
} from 'lucide-react';
import { VocabWord, BibleWord, WeeklyAssessmentResult, UserProfile } from '../types';
import { sound } from '../utils/audio';
import { triggerCelebrationConfetti, triggerSparkleConfetti } from '../utils/storage';

interface WeeklyCheckProps {
  allWords: VocabWord[];
  bibleWords: BibleWord[];
  profile: UserProfile;
  assessmentHistory: WeeklyAssessmentResult[];
  onSaveAssessment: (result: WeeklyAssessmentResult) => void;
  onAddXp: (xp: number) => void;
}

interface TestQuestion {
  id: string;
  type: 'definition' | 'spelling' | 'bible' | 'fill_blank';
  prompt: string;
  targetWord: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const WeeklyCheck: React.FC<WeeklyCheckProps> = ({
  allWords,
  bibleWords,
  profile,
  assessmentHistory,
  onSaveAssessment,
  onAddXp
}) => {
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [currentQIdx, setCurrentQIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [completedReport, setCompletedReport] = useState<WeeklyAssessmentResult | null>(null);

  // Generate 6-8 balanced questions
  const generateQuestions = (): TestQuestion[] => {
    const questions: TestQuestion[] = [];
    const sampleWords = [...allWords].sort(() => Math.random() - 0.5).slice(0, 4);
    const sampleBible = bibleWords[0] || null;

    sampleWords.forEach((word, idx) => {
      // Definition question
      const distractors = allWords
        .filter((w) => w.id !== word.id)
        .slice(0, 3)
        .map((w) => w.definition);
      const defOptions = [word.definition, ...distractors].sort(() => Math.random() - 0.5);

      questions.push({
        id: `q-def-${idx}`,
        type: 'definition',
        prompt: `What does the word "${word.word}" mean?`,
        targetWord: word.word,
        options: defOptions,
        correctIndex: defOptions.indexOf(word.definition),
        explanation: `"${word.word}" means: ${word.definition}`
      });

      // Context fill in blank question
      const sentenceWithBlank = word.exampleSentence.replace(new RegExp(word.word, 'gi'), '__________');
      const wordDistractors = allWords
        .filter((w) => w.id !== word.id)
        .slice(0, 3)
        .map((w) => w.word);
      const fillOptions = [word.word, ...wordDistractors].sort(() => Math.random() - 0.5);

      questions.push({
        id: `q-fill-${idx}`,
        type: 'fill_blank',
        prompt: `Fill in the missing word: "${sentenceWithBlank}"`,
        targetWord: word.word,
        options: fillOptions,
        correctIndex: fillOptions.indexOf(word.word),
        explanation: `"${word.word}" completes the sentence gracefully!`
      });
    });

    if (sampleBible && sampleBible.quickChallenges[0]) {
      const bChallenge = sampleBible.quickChallenges[0];
      questions.push({
        id: 'q-bible-1',
        type: 'bible',
        prompt: `Faith Question: ${bChallenge.question}`,
        targetWord: sampleBible.word,
        options: bChallenge.options,
        correctIndex: bChallenge.correctIndex,
        explanation: bChallenge.explanation
      });
    }

    return questions.slice(0, 6);
  };

  const [activeQuestions, setActiveQuestions] = useState<TestQuestion[]>(generateQuestions);

  const handleStart = () => {
    sound.playBloomSparkle();
    setActiveQuestions(generateQuestions());
    setInProgress(true);
    setCurrentQIdx(0);
    setAnswers({});
    setCompletedReport(null);
  };

  const handleSelectOption = (oIdx: number) => {
    sound.playPop();
    setAnswers((p) => ({ ...p, [currentQIdx]: oIdx }));
  };

  const handleNext = () => {
    sound.playPop();
    if (currentQIdx + 1 < activeQuestions.length) {
      setCurrentQIdx((p) => p + 1);
    } else {
      // Finalize test & build encouraging report
      let correctCount = 0;
      const strengths: string[] = [];
      const areasToPractice: string[] = [];

      activeQuestions.forEach((q, idx) => {
        if (answers[idx] === q.correctIndex) {
          correctCount++;
        } else {
          areasToPractice.push(q.targetWord);
        }
      });

      const score = Math.round((correctCount / activeQuestions.length) * 100);

      if (score >= 80) {
        strengths.push('Excellent understanding of definitions');
        strengths.push('Strong reading comprehension and sentence context');
        strengths.push('Faith word understanding');
      } else {
        strengths.push('Great effort and curiosity in learning');
        strengths.push('Growing vocabulary understanding');
      }

      if (areasToPractice.length === 0) {
        areasToPractice.push('Keep reading advanced stories to discover new wonders!');
      }

      const result: WeeklyAssessmentResult = {
        id: `assessment-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score,
        totalQuestions: activeQuestions.length,
        strengths,
        areasToPractice,
        wordsTested: activeQuestions.map((q) => q.targetWord)
      };

      setCompletedReport(result);
      setInProgress(false);
      onSaveAssessment(result);
      onAddXp(25);

      if (score >= 70) {
        sound.playLevelUpFanfare();
        triggerCelebrationConfetti();
      } else {
        sound.playSuccessChime();
        triggerSparkleConfetti();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 font-bold text-xs sm:text-sm border border-pink-200 mb-2">
          <span>🌸</span>
          <span>Weekly Growth Check</span>
          <span>✨</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-900 tracking-tight font-['Fredoka']">
          Knowledge Garden Challenge
        </h2>
        <p className="text-xs sm:text-sm text-pink-500 max-w-md mx-auto mt-1">
          A gentle checkup celebrating everything you learned this week—with zero stress!
        </p>
      </div>

      {!inProgress && !completedReport && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-pink-100 shadow-xl shadow-pink-100/60 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-pink-100 flex items-center justify-center text-3xl mb-4">
            🌸
          </div>
          <h3 className="text-2xl font-extrabold text-pink-900 font-['Fredoka'] mb-2">
            Ready for Your Weekly Growth Check?
          </h3>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            We will review 6 friendly questions covering words, spelling context, and Bible meanings. You will earn +25 XP and a lovely growth report!
          </p>

          <button
            onClick={handleStart}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-base shadow-lg shadow-pink-300 hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Begin Growth Check</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Previous Assessment Card */}
          {assessmentHistory.length > 0 && (
            <div className="mt-8 pt-6 border-t border-pink-100 text-left">
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block mb-2">
                Previous Growth Check Result:
              </span>
              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-slate-800 text-sm font-['Fredoka']">
                    {assessmentHistory[0].date} Assessment
                  </p>
                  <p className="text-xs text-pink-600">
                    Score: {assessmentHistory[0].score}% ({assessmentHistory[0].totalQuestions} Questions)
                  </p>
                </div>
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* IN PROGRESS QUIZ */}
      {inProgress && activeQuestions[currentQIdx] && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-pink-100 shadow-xl shadow-pink-100/60 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3 mb-5">
            <span className="text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
              Question {currentQIdx + 1} of {activeQuestions.length}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              Weekly Growth Check
            </span>
          </div>

          <p className="text-base sm:text-lg font-bold text-slate-800 mb-6">
            {activeQuestions[currentQIdx].prompt}
          </p>

          <div className="space-y-3 mb-6">
            {activeQuestions[currentQIdx].options.map((opt, idx) => {
              const isSelected = answers[currentQIdx] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl border-2 text-sm font-medium transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-pink-100 border-pink-500 text-pink-950 font-bold shadow-xs'
                      : 'bg-white border-pink-100 hover:border-pink-300 text-slate-700'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-pink-50 border border-pink-200 text-pink-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-3 border-t border-pink-100">
            <button
              disabled={answers[currentQIdx] === undefined}
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-md disabled:opacity-40 cursor-pointer flex items-center gap-1.5 hover:scale-105 transition-transform"
            >
              <span>
                {currentQIdx + 1 < activeQuestions.length ? 'Next Question' : 'Complete Assessment ✨'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* COMPLETED ENCOURAGING REPORT */}
      {completedReport && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-pink-200 shadow-2xl shadow-pink-200/50 max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-pink-400 via-rose-300 to-amber-300 text-white flex items-center justify-center text-4xl shadow-md mb-4 animate-gentle-pulse">
            🌸
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-pink-900 font-['Fredoka'] mb-1">
            🌸 Weekly Growth Report 🌸
          </h3>
          <p className="text-sm font-bold text-pink-600 mb-6">
            Score: {completedReport.score}% • Knowledge Bloom
          </p>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 text-pink-900 font-bold text-sm sm:text-base mb-6 leading-relaxed">
            "You’re growing! Every word you practice brings more blossoms to your knowledge garden."
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
            {/* Things Doing Great At */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                🌟 Things You’re Doing Great At
              </span>
              <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-900 font-medium">
                {completedReport.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>🌸</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Let's Practice These More */}
            <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200">
              <span className="text-xs font-bold text-pink-800 uppercase tracking-wider flex items-center gap-1 mb-2">
                <Heart className="w-3.5 h-3.5 text-pink-600" />
                🌱 Let’s Practice These More
              </span>
              <ul className="space-y-1.5 text-xs sm:text-sm text-pink-900 font-medium">
                {completedReport.areasToPractice.map((area, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>🎀</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => setCompletedReport(null)}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-extrabold text-sm sm:text-base shadow-md cursor-pointer hover:scale-105 transition-transform"
          >
            🌸 Return to Home Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

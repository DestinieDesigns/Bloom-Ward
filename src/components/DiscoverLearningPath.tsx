import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Save,
  RotateCcw,
  Check,
  Award,
  Flame,
  ChevronRight,
  Clock,
  Compass,
  Smile,
  Heart,
  Calendar,
  Layers,
  Brain,
  ShieldCheck
} from 'lucide-react';
import {
  UserProfile,
  StartingAssessmentResult,
  DailyGoalConfig,
  AssessmentSaveState,
  AppSection,
  CategoryResult
} from '../types';
import {
  VOCABULARY_QUESTIONS,
  DEFINITION_QUESTIONS,
  SPELLING_QUESTIONS,
  READING_PASSAGES,
  RECOGNITION_QUESTIONS,
  STARTING_PATHS,
  AssessmentQuestion
} from '../data/startingAssessmentQuestions';
import {
  computeAssessmentResults,
  saveAssessmentProgress,
  loadAssessmentProgress,
  clearAssessmentProgress,
  ASSESSMENT_SECTIONS
} from '../utils/assessmentEngine';
import { sound } from '../utils/audio';
import { triggerCelebrationConfetti, triggerSparkleConfetti } from '../utils/storage';

interface DiscoverLearningPathProps {
  profile: UserProfile;
  onSaveAssessment: (result: StartingAssessmentResult) => void;
  onUpdateGoals: (newGoals: DailyGoalConfig) => void;
  onSelectSection: (section: AppSection) => void;
  onClose?: () => void;
  isGrowthCheckpoint?: boolean;
}

export const DiscoverLearningPath: React.FC<DiscoverLearningPathProps> = ({
  profile,
  onSaveAssessment,
  onUpdateGoals,
  onSelectSection,
  onClose,
  isGrowthCheckpoint = false
}) => {
  // Assessment workflow state
  const [screen, setScreen] = useState<'intro' | 'active' | 'results' | 'checkpoint_summary'>('intro');
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [questionIndexInSection, setQuestionIndexInSection] = useState<number>(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState<number>(0);

  // User input states
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [spellingInput, setSpellingInput] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [hasPlayedSentence, setHasPlayedSentence] = useState<boolean>(false);

  // Save state
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [hasExistingSave, setHasExistingSave] = useState<boolean>(false);
  const [existingSaveState, setExistingSaveState] = useState<AssessmentSaveState | null>(null);

  // Results tracking
  const [categoryStats, setCategoryStats] = useState<Record<string, { correct: number; total: number }>>({
    vocabulary: { correct: 0, total: 0 },
    definitions: { correct: 0, total: 0 },
    spelling: { correct: 0, total: 0 },
    reading: { correct: 0, total: 0 },
    recognition: { correct: 0, total: 0 }
  });

  const [finalResult, setFinalResult] = useState<StartingAssessmentResult | null>(
    profile.startingAssessment || null
  );

  // Check for saved progress on mount
  useEffect(() => {
    const saved = loadAssessmentProgress(profile.id);
    if (saved && saved.currentCategoryIndex < ASSESSMENT_SECTIONS.length) {
      setHasExistingSave(true);
      setExistingSaveState(saved);
    }
  }, [profile.id]);

  const activeCategoryConfig = ASSESSMENT_SECTIONS[currentSectionIndex];

  // Pick questions adaptively
  const getCurrentQuestion = (): AssessmentQuestion => {
    const cat = activeCategoryConfig.category;
    let pool: AssessmentQuestion[] = [];

    if (cat === 'vocabulary') pool = VOCABULARY_QUESTIONS;
    else if (cat === 'definitions') pool = DEFINITION_QUESTIONS;
    else if (cat === 'spelling') pool = SPELLING_QUESTIONS;
    else if (cat === 'recognition') pool = RECOGNITION_QUESTIONS;
    else if (cat === 'reading') pool = READING_PASSAGES[0].questions;

    // Pick based on consecutive correct (adaptive tier)
    let desiredTier: 1 | 2 | 3 = 1;
    if (consecutiveCorrect >= 2) desiredTier = 2;
    if (consecutiveCorrect >= 4) desiredTier = 3;

    const tierQuestions = pool.filter((q) => q.tier === desiredTier);
    const candidateList = tierQuestions.length > 0 ? tierQuestions : pool;
    const qIndex = questionIndexInSection % candidateList.length;
    return candidateList[qIndex];
  };

  const currentQuestion = getCurrentQuestion();

  // Audio speech handler
  const handleSpeakWord = (word?: string) => {
    const toSpeak = word || currentQuestion.targetWord || currentQuestion.audioWord;
    if (!toSpeak) return;
    setIsSpeaking(true);
    sound.speak(toSpeak, () => setIsSpeaking(false));
  };

  const handleSpeakSentence = () => {
    const sentence = currentQuestion.audioSentence;
    if (!sentence) return;
    setIsSpeaking(true);
    setHasPlayedSentence(true);
    sound.speak(sentence, () => setIsSpeaking(false));
  };

  // Resume saved session
  const handleResumeSaved = () => {
    if (!existingSaveState) return;
    sound.playPop();
    setCurrentSectionIndex(existingSaveState.currentCategoryIndex);
    setQuestionIndexInSection(existingSaveState.currentQuestionIndex);
    setCategoryStats(existingSaveState.categoryStats);
    setScreen('active');
  };

  // Start fresh session
  const handleStartFresh = () => {
    sound.playPop();
    clearAssessmentProgress(profile.id);
    setHasExistingSave(false);
    setExistingSaveState(null);
    setCurrentSectionIndex(0);
    setQuestionIndexInSection(0);
    setConsecutiveCorrect(0);
    setCategoryStats({
      vocabulary: { correct: 0, total: 0 },
      definitions: { correct: 0, total: 0 },
      spelling: { correct: 0, total: 0 },
      reading: { correct: 0, total: 0 },
      recognition: { correct: 0, total: 0 }
    });
    setScreen('active');
  };

  // Save progress manually
  const handleSaveAndPause = () => {
    sound.playEncourageSound();
    const saveObj: AssessmentSaveState = {
      currentCategoryIndex: currentSectionIndex,
      currentQuestionIndex: questionIndexInSection,
      answers: {},
      categoryStats,
      lastUpdated: new Date().toISOString()
    };
    saveAssessmentProgress(profile.id, saveObj);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
    }, 4000);
  };

  // Answer submission
  const handleSubmitAnswer = (isSkip: boolean = false) => {
    const cat = activeCategoryConfig.category;
    let isCorrect = false;

    if (isSkip) {
      isCorrect = false;
      sound.playPop();
    } else if (cat === 'spelling') {
      const cleanInput = spellingInput.trim().toLowerCase();
      const cleanTarget = currentQuestion.correctAnswer.trim().toLowerCase();
      isCorrect = cleanInput === cleanTarget;
      if (isCorrect) sound.playSuccessChime();
      else sound.playEncourageSound();
    } else {
      isCorrect = selectedOption === currentQuestion.correctAnswer;
      if (isCorrect) sound.playSuccessChime();
      else sound.playEncourageSound();
    }

    // Update stats
    const currentCatStat = categoryStats[cat] || { correct: 0, total: 0 };
    const updatedStats = {
      ...categoryStats,
      [cat]: {
        correct: currentCatStat.correct + (isCorrect ? 1 : 0),
        total: currentCatStat.total + 1
      }
    };
    setCategoryStats(updatedStats);

    // Update adaptive difficulty streak
    if (isCorrect) {
      setConsecutiveCorrect((prev) => Math.min(prev + 1, 5));
    } else {
      setConsecutiveCorrect((prev) => Math.max(prev - 1, -2));
    }

    // Reset input fields
    setSelectedOption('');
    setSpellingInput('');
    setHasPlayedSentence(false);

    // Check if category questions completed (e.g. 3 questions per category, reading has 3 questions for the passage)
    const maxQuestionsPerCategory = 3;
    const nextQIndex = questionIndexInSection + 1;

    if (nextQIndex < maxQuestionsPerCategory) {
      // Continue inside same category
      setQuestionIndexInSection(nextQIndex);
      // Auto-save state
      saveAssessmentProgress(profile.id, {
        currentCategoryIndex: currentSectionIndex,
        currentQuestionIndex: nextQIndex,
        answers: {},
        categoryStats: updatedStats,
        lastUpdated: new Date().toISOString()
      });
    } else {
      // Move to next category or complete
      const nextCategoryIdx = currentSectionIndex + 1;
      if (nextCategoryIdx < ASSESSMENT_SECTIONS.length) {
        sound.playBloomSparkle();
        setCurrentSectionIndex(nextCategoryIdx);
        setQuestionIndexInSection(0);
        // Auto-save
        saveAssessmentProgress(profile.id, {
          currentCategoryIndex: nextCategoryIdx,
          currentQuestionIndex: 0,
          answers: {},
          categoryStats: updatedStats,
          lastUpdated: new Date().toISOString()
        });
      } else {
        // All categories finished! Calculate final placement
        finishAssessment(updatedStats);
      }
    }
  };

  const finishAssessment = (finalStats: Record<string, { correct: number; total: number }>) => {
    sound.playSuccessChime();
    triggerCelebrationConfetti();
    clearAssessmentProgress(profile.id);

    const result = computeAssessmentResults(
      finalStats,
      isGrowthCheckpoint,
      profile.startingAssessment
    );
    setFinalResult(result);
    onSaveAssessment(result);
    onUpdateGoals(result.recommendedGoals);
    setScreen('results');
  };

  // Render Category Progress Tracker Header
  const renderProgressBar = () => {
    const totalSteps = ASSESSMENT_SECTIONS.length;
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-xl">{activeCategoryConfig.icon}</span>
            <div>
              <span className="text-slate-800 font-extrabold text-sm sm:text-base font-['Fredoka']">
                {activeCategoryConfig.friendlyTitle}
              </span>
              <span className="text-slate-400 font-normal ml-2 hidden sm:inline">
                ({activeCategoryConfig.description})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-extrabold">
              Question {questionIndexInSection + 1} of 3
            </span>
            <button
              onClick={handleSaveAndPause}
              className="px-3 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
              title="Save progress and pause"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Pause</span>
            </button>
          </div>
        </div>

        {/* 5-Step Bar */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {ASSESSMENT_SECTIONS.map((sec, idx) => {
            const isCompleted = idx < currentSectionIndex;
            const isCurrent = idx === currentSectionIndex;
            return (
              <div key={sec.category} className="space-y-1">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : isCurrent
                      ? 'bg-indigo-600 shadow-xs ring-2 ring-indigo-200'
                      : 'bg-slate-200'
                  }`}
                />
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 truncate">
                  <span className="truncate">{sec.icon} {sec.title.split(' ')[0]}</span>
                  {isCompleted && <Check className="w-3 h-3 text-emerald-600 inline" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 1. INTRO SCREEN
  if (screen === 'intro') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-['Quicksand'] text-left">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-700 p-8 sm:p-12 text-white shadow-xl border-2 border-white/20">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-xs text-xs sm:text-sm font-extrabold border border-white/30">
              <span>🌱</span>
              <span>Personalized Learning Placement</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Fredoka'] leading-tight">
              {isGrowthCheckpoint ? '🌟 Growth Checkpoint' : '🌱 Discover Your Learning Path'}
            </h1>

            <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed">
              {isGrowthCheckpoint
                ? `Welcome back, ${profile.name}! Let's celebrate how much your vocabulary and reading skills have grown since your first adventure!`
                : `Welcome, ${profile.name}! Let’s discover what words you already love and find your perfect starting point. There are no wrong answers or scary grades—just a friendly adventure to make BloomWord perfect for you!`}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={handleStartFresh}
                className="px-8 py-4 rounded-full bg-white text-emerald-900 font-extrabold text-sm sm:text-base shadow-lg hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 font-['Fredoka']"
              >
                <span>✨ Begin Learning Adventure</span>
                <ArrowRight className="w-5 h-5 text-emerald-600" />
              </button>

              {hasExistingSave && (
                <button
                  onClick={handleResumeSaved}
                  className="px-6 py-4 rounded-full bg-white/20 hover:bg-white/30 text-white font-extrabold text-sm backdrop-blur-xs border border-white/40 cursor-pointer flex items-center gap-2 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Resume Saved Progress</span>
                </button>
              )}

              {onClose && (
                <button
                  onClick={onClose}
                  className="px-6 py-4 rounded-full bg-black/20 hover:bg-black/30 text-white/90 font-bold text-sm backdrop-blur-xs cursor-pointer transition-all"
                >
                  Explore Dashboard First
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Existing Save State Notice */}
        {hasExistingSave && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 text-lg">
                🌸
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm font-['Fredoka']">
                  Your Progress Is Saved!
                </h4>
                <p className="text-xs text-slate-600">
                  You paused on Step {existingSaveState!.currentCategoryIndex + 1} ({ASSESSMENT_SECTIONS[existingSaveState!.currentCategoryIndex].friendlyTitle}). You can resume anytime!
                </p>
              </div>
            </div>
            <button
              onClick={handleResumeSaved}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs cursor-pointer shadow-xs whitespace-nowrap"
            >
              Resume Now
            </button>
          </div>
        )}

        {/* 5 Pillars Grid */}
        <div>
          <h3 className="text-lg font-extrabold text-slate-800 font-['Fredoka'] mb-4 flex items-center gap-2">
            <span>🗺️</span>
            <span>What We Will Explore Together:</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ASSESSMENT_SECTIONS.map((sec) => (
              <div
                key={sec.category}
                className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-xs space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl border border-slate-200">
                  {sec.icon}
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm font-['Fredoka']">
                  {sec.friendlyTitle}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {sec.description}
                </p>
              </div>
            ))}

            <div className="bg-gradient-to-br from-indigo-50 to-pink-50 p-5 rounded-2xl border-2 border-indigo-100 shadow-xs space-y-2 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-xl">
                  🎯
                </div>
                <h4 className="font-extrabold text-indigo-900 text-sm font-['Fredoka'] mt-2">
                  Personalized Daily Plan
                </h4>
                <p className="text-xs text-indigo-700/80 leading-relaxed mt-1">
                  Adjusts reading time, new vocabulary, flashcards, and spelling goals to match your unique superpowers.
                </p>
              </div>
              <span className="text-[11px] font-bold text-indigo-600">
                🌱 Adapts as you grow!
              </span>
            </div>
          </div>
        </div>

        {/* Reassurance Notice */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center space-y-1">
          <p className="text-xs font-bold text-slate-700">
            ✨ Friendly Reminder: This is NOT a high-pressure test!
          </p>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Take your time, listen aloud whenever you like, and skip any word you don’t know yet. The app grows smarter with every question.
          </p>
        </div>
      </div>
    );
  }

  // 2. ACTIVE QUESTION SCREEN
  if (screen === 'active') {
    const isSpelling = activeCategoryConfig.category === 'spelling';
    const isReading = activeCategoryConfig.category === 'reading';

    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 font-['Quicksand'] text-left">
        {/* Saved Notice Alert */}
        {savedNotice && (
          <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-800 rounded-2xl p-4 flex items-center gap-3 shadow-md animate-in fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-extrabold text-sm font-['Fredoka']">🌸 Your Progress Is Saved!</p>
              <p className="text-xs text-emerald-700">
                You can continue your Learning Path whenever you're ready. Feel free to take a break!
              </p>
            </div>
          </div>
        )}

        {/* Progress Navigation Bar */}
        {renderProgressBar()}

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-lg space-y-6 relative overflow-hidden">
          {/* Reading Passage if Reading Category */}
          {isReading && (
            <div className="bg-amber-50/60 rounded-2xl p-5 border-2 border-amber-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  <h4 className="font-extrabold text-amber-950 font-['Fredoka'] text-base">
                    {READING_PASSAGES[0].title}
                  </h4>
                </div>
                <button
                  onClick={() => handleSpeakWord(READING_PASSAGES[0].text)}
                  disabled={isSpeaking}
                  className="px-3 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? 'Reading Aloud...' : 'Read Story Aloud'}</span>
                </button>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {READING_PASSAGES[0].text}
              </p>
            </div>
          )}

          {/* Question Prompt */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {activeCategoryConfig.title}
            </span>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-['Fredoka'] leading-snug">
              {currentQuestion.prompt}
            </h3>

            {currentQuestion.subPrompt && (
              <p className="text-sm sm:text-base text-slate-600 font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-200 italic">
                {currentQuestion.subPrompt}
              </p>
            )}
          </div>

          {/* CATEGORY SPECIFIC INPUTS */}

          {/* 1. VOCABULARY: Show word + Audio */}
          {activeCategoryConfig.category === 'vocabulary' && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-900 font-['Fredoka']">
                {currentQuestion.targetWord}
              </div>
              <button
                onClick={() => handleSpeakWord(currentQuestion.targetWord)}
                disabled={isSpeaking}
                className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer"
                title="Hear pronunciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 2. RECOGNITION: Audio prompt to listen and choose */}
          {activeCategoryConfig.category === 'recognition' && (
            <div className="p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-200 text-center space-y-3">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                🔊 Auditory Recognition Challenge
              </p>
              <button
                onClick={() => handleSpeakWord(currentQuestion.audioWord)}
                disabled={isSpeaking}
                className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 mx-auto shadow-md cursor-pointer transition-transform hover:scale-105"
              >
                <Volume2 className="w-5 h-5" />
                <span>{isSpeaking ? 'Playing Audio...' : '🔊 Click to Hear Word'}</span>
              </button>
            </div>
          )}

          {/* 3. SPELLING: Independent Spelling — STRICT NO WRITTEN WORD RULE */}
          {isSpelling && (
            <div className="space-y-4 p-5 rounded-2xl bg-rose-50/60 border-2 border-rose-200">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleSpeakWord(currentQuestion.audioWord)}
                  disabled={isSpeaking}
                  className="px-5 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-transform hover:scale-105"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isSpeaking ? 'Speaking...' : '🔊 1. Listen to Word'}</span>
                </button>

                <button
                  onClick={handleSpeakSentence}
                  disabled={isSpeaking}
                  className="px-5 py-3 rounded-full bg-white hover:bg-rose-100 text-rose-800 font-bold text-sm border-2 border-rose-300 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-rose-500" />
                  <span>🔊 2. Hear in Sentence</span>
                </button>
              </div>

              {hasPlayedSentence && (
                <p className="text-xs text-rose-700 italic">
                  "{currentQuestion.audioSentence}"
                </p>
              )}

              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Type your spelling:
                </label>
                <input
                  type="text"
                  value={spellingInput}
                  onChange={(e) => setSpellingInput(e.target.value)}
                  placeholder="Type the word here..."
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-300 focus:border-rose-500 focus:outline-none text-xl font-extrabold text-slate-800 font-['Fredoka']"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && spellingInput.trim()) {
                      handleSubmitAnswer();
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* MULTIPLE CHOICE OPTIONS (FOR VOCABULARY, DEFINITIONS, READING, RECOGNITION) */}
          {!isSpelling && currentQuestion.options && (
            <div className="grid grid-cols-1 gap-2.5">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      sound.playPop();
                      setSelectedOption(opt);
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 shadow-sm ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="font-bold text-sm sm:text-base text-slate-800">
                      {opt}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Action Navigation Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleSubmitAnswer(true)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-center sm:text-left py-2"
            >
              I'm not sure yet — Let's keep going! ⏩
            </button>

            <button
              onClick={() => handleSubmitAnswer(false)}
              disabled={isSpelling ? !spellingInput.trim() : !selectedOption}
              className={`px-8 py-3.5 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all ${
                (isSpelling ? spellingInput.trim() : selectedOption)
                  ? 'bg-slate-800 hover:bg-slate-900 text-white hover:scale-105 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. RESULTS SCREEN ("🌟 Your Learning Adventure Begins!")
  if (screen === 'results' && finalResult) {
    const pathConfig = STARTING_PATHS[finalResult.startingPath] || STARTING_PATHS.word_builder;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-['Quicksand'] text-left">
        {/* Celebration Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs sm:text-sm">
            <span>✨</span>
            <span>Assessment Complete!</span>
            <span>🌸</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Fredoka']">
            🌟 Your Learning Adventure Begins!
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto font-medium">
            We discovered what words you already know and designed your custom starting path.
          </p>
        </div>

        {/* Starting Path Card */}
        <div className={`rounded-3xl p-6 sm:p-8 border-2 ${pathConfig.colorScheme.border} ${pathConfig.colorScheme.bg} shadow-md space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl sm:text-6xl p-2 bg-white rounded-2xl shadow-xs border border-slate-200">
                {pathConfig.icon}
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  You are starting as:
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Fredoka'] uppercase tracking-tight">
                  {pathConfig.title}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
                  {pathConfig.tagline}
                </p>
              </div>
            </div>

            <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200 text-center shrink-0">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Overall Baseline</span>
              <span className="text-2xl font-extrabold text-emerald-600 font-['Fredoka']">
                {finalResult.overallScorePercent}%
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium pt-2 border-t border-slate-200/60">
            {pathConfig.description}
          </p>

          {/* Reassurance Banner */}
          <div className="bg-white/80 rounded-2xl p-4 border border-slate-200 flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <p className="text-xs sm:text-sm font-bold text-slate-700">
              This is just your starting point! Your learning path will continuously adapt and elevate as you complete daily reading and spelling quests.
            </p>
          </div>
        </div>

        {/* 5 Distinct Skills Breakdown (Never reduced to one score) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-800 font-['Fredoka'] flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              <span>Your Skills Profile</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">
              Evaluated separately across 5 categories
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.entries(finalResult.skills) as [string, CategoryResult][]).map(([key, skill]) => {
              const badgeColors =
                skill.proficiency === 'strong'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : skill.proficiency === 'growing'
                  ? 'bg-lime-100 text-lime-800 border-lime-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300';

              const icon =
                skill.proficiency === 'strong' ? '🌸 Strong' : skill.proficiency === 'growing' ? '🌿 Growing' : '🌱 Needs Practice';

              return (
                <div
                  key={key}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 truncate">{skill.title}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${badgeColors}`}>
                      {icon}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Baseline Score:</span>
                    <span className="font-extrabold text-slate-800">
                      {skill.score} / {skill.total} ({skill.total > 0 ? Math.round((skill.score / skill.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths & Growth Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-50/70 rounded-3xl p-6 border-2 border-emerald-200 space-y-3">
            <h4 className="font-extrabold text-emerald-950 font-['Fredoka'] text-base flex items-center gap-2">
              <span>🌟</span>
              <span>You're Already Doing Great With:</span>
            </h4>
            <ul className="space-y-2">
              {finalResult.personalizedStrengths.map((str, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-emerald-900 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{str.replace(/^🌟\s*/, '')}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-pink-50/70 rounded-3xl p-6 border-2 border-pink-200 space-y-3">
            <h4 className="font-extrabold text-pink-950 font-['Fredoka'] text-base flex items-center gap-2">
              <span>🌱</span>
              <span>We're Going to Grow Together In:</span>
            </h4>
            <ul className="space-y-2">
              {finalResult.personalizedGrowthAreas.map((area, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-pink-900 font-semibold flex items-center gap-2">
                  <span className="text-sm">🌱</span>
                  <span>{area.replace(/^🌱\s*/, '')}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Personalized Daily Plan */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold mb-1">
                <span>🎯</span>
                <span>Personalized Daily Plan</span>
              </div>
              <h3 className="text-2xl font-extrabold font-['Fredoka']">
                Your Tailored Daily Routine
              </h3>
            </div>
            <span className="text-xs text-indigo-300 font-semibold">
              Automatically synced with your Daily Tracker
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center space-y-1">
              <span className="text-2xl">📖</span>
              <div className="text-xs text-white/70 font-bold">Read Real Books</div>
              <div className="text-xl font-extrabold text-white font-['Fredoka']">
                {finalResult.recommendedGoals.readingMinutes} mins
              </div>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center space-y-1">
              <span className="text-2xl">🧠</span>
              <div className="text-xs text-white/70 font-bold">Learn New Words</div>
              <div className="text-xl font-extrabold text-white font-['Fredoka']">
                {finalResult.recommendedGoals.vocabularyWords} words
              </div>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center space-y-1">
              <span className="text-2xl">🎴</span>
              <div className="text-xs text-white/70 font-bold">Review Flashcards</div>
              <div className="text-xl font-extrabold text-white font-['Fredoka']">
                {finalResult.recommendedGoals.flashcardsCount} cards
              </div>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center space-y-1">
              <span className="text-2xl">✏️</span>
              <div className="text-xs text-white/70 font-bold">Practice Spelling</div>
              <div className="text-xl font-extrabold text-white font-['Fredoka']">
                {finalResult.recommendedGoals.spellingWords} words
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={() => {
                sound.playPop();
                onSelectSection('daily_tracker');
              }}
              className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 font-['Fredoka']"
            >
              <span>🚀 Start My Daily Learning Journey</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

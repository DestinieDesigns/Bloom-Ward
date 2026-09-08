import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Plus,
  Volume2,
  VolumeX,
  Flame,
  CheckCircle2,
  Award,
  ChevronRight,
  Bookmark,
  Compass,
  ArrowRight,
  Info,
  Clock,
  BookMarked,
  Layers,
  Heart,
  HelpCircle,
  X
} from 'lucide-react';
import {
  UserProfile,
  VocabWord,
  ReadingSession,
  BookRecord,
  ThemeId
} from '../types';
import { getThemeConfig } from '../data/themes';
import { sound } from '../utils/audio';
import {
  triggerSparkleConfetti,
  triggerCelebrationConfetti
} from '../utils/storage';
import {
  lookupOrGenerateWordDetails,
  createVocabWordFromDiscovery,
  WordDefinitionLookup
} from '../utils/dictionary';

interface ReadingAdventureProps {
  profile: UserProfile;
  allWords: VocabWord[];
  readingSessions: ReadingSession[];
  books: BookRecord[];
  onAddNewWord: (word: VocabWord) => void;
  onSessionComplete: (session: ReadingSession) => void;
  onAddXp: (amount: number) => void;
  onBackToHome?: () => void;
}

export const ReadingAdventure: React.FC<ReadingAdventureProps> = ({
  profile,
  allWords,
  readingSessions,
  books,
  onAddNewWord,
  onSessionComplete,
  onAddXp,
  onBackToHome
}) => {
  const theme = getThemeConfig(profile.theme);

  // Flow stages: 'setup' | 'reading' | 'celebration' | 'post_review' | 'history'
  const [stage, setStage] = useState<'setup' | 'reading' | 'celebration' | 'post_review' | 'history'>('setup');

  // Reading Setup State
  const [selectedMinutes, setSelectedMinutes] = useState<number>(profile.dailyReadingGoalMinutes || 15);
  const [bookTitle, setBookTitle] = useState<string>(books[0]?.title || "Charlotte's Web");
  const [bookAuthor, setBookAuthor] = useState<string>(books[0]?.author || 'E.B. White');
  const [startPage, setStartPage] = useState<string>('');
  const [endPage, setEndPage] = useState<string>('');

  // Active Timer State
  const [secondsRemaining, setSecondsRemaining] = useState<number>(selectedMinutes * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [sessionWordsFound, setSessionWordsFound] = useState<VocabWord[]>([]);

  // Ambient sound
  const [ambientEnabled, setAmbientEnabled] = useState<boolean>(false);
  const [ambientSoundType, setAmbientSoundType] = useState<'chimes' | 'forest' | 'space' | 'waves' | 'rain'>(
    theme.ambientSound === 'arcade' ? 'chimes' : theme.ambientSound
  );

  // Word Discovery Modal
  const [showWordDiscoveryModal, setShowWordDiscoveryModal] = useState<boolean>(false);
  const [discoveryWordInput, setDiscoveryWordInput] = useState<string>('');
  const [discoveryContextInput, setDiscoveryContextInput] = useState<string>('');
  const [discoveryPageInput, setDiscoveryPageInput] = useState<string>('');
  const [quickSavedNotification, setQuickSavedNotification] = useState<string | null>(null);
  const [previewWordLookup, setPreviewWordLookup] = useState<WordDefinitionLookup | null>(null);
  const [showDetailedExplorer, setShowDetailedExplorer] = useState<boolean>(false);

  // Post-Reading Mini Challenge
  const [activeMiniChallenge, setActiveMiniChallenge] = useState<'none' | 'definition' | 'spelling' | 'complete'>('none');
  const [challengeScore, setChallengeScore] = useState<number>(0);
  const [challengeTargetWord, setChallengeTargetWord] = useState<VocabWord | null>(null);
  const [userSpellGuess, setUserSpellGuess] = useState<string>('');

  // Interval Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with profile daily goal if updated in settings/dashboard
  useEffect(() => {
    if (stage === 'setup' && profile.dailyReadingGoalMinutes) {
      setSelectedMinutes(profile.dailyReadingGoalMinutes);
      setSecondsRemaining(profile.dailyReadingGoalMinutes * 60);
    }
  }, [profile.dailyReadingGoalMinutes, stage]);

  // Handle countdown interval
  useEffect(() => {
    if (stage === 'reading' && isActive) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Target reached!
            handleTargetReached();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage, isActive]);

  // Ambient sound management
  useEffect(() => {
    if (stage === 'reading' && ambientEnabled && isActive) {
      sound.startAmbient(ambientSoundType);
    } else {
      sound.stopAmbient();
    }
    return () => {
      sound.stopAmbient();
    };
  }, [stage, ambientEnabled, isActive, ambientSoundType]);

  const handleStartSession = () => {
    sound.playPop();
    setSecondsRemaining(selectedMinutes * 60);
    setElapsedSeconds(0);
    setIsActive(true);
    setSessionWordsFound([]);
    setStage('reading');
    if (ambientEnabled) {
      sound.startAmbient(ambientSoundType);
    }
  };

  const handleTargetReached = () => {
    sound.playSuccessChime();
    triggerCelebrationConfetti();
    setIsActive(false);
    sound.stopAmbient();
    setStage('celebration');
  };

  const handleFinishEarly = () => {
    sound.playPop();
    setIsActive(false);
    sound.stopAmbient();
    setStage('celebration');
  };

  const handleContinueReading = (extraMinutes: number) => {
    sound.playPop();
    setSecondsRemaining((prev) => prev + extraMinutes * 60);
    setIsActive(true);
    setStage('reading');
    if (ambientEnabled) {
      sound.startAmbient(ambientSoundType);
    }
  };

  // Quick Word Add during reading
  const handleQuickAddWord = () => {
    if (!discoveryWordInput.trim()) return;

    const lookup = lookupOrGenerateWordDetails(discoveryWordInput, discoveryContextInput);
    const newWord = createVocabWordFromDiscovery(
      lookup,
      bookTitle,
      bookAuthor,
      discoveryPageInput ? parseInt(discoveryPageInput, 10) : undefined,
      discoveryContextInput
    );

    onAddNewWord(newWord);
    setSessionWordsFound((prev) => [newWord, ...prev]);
    onAddXp(20);
    sound.playBloomSparkle();

    setQuickSavedNotification(newWord.word);
    setDiscoveryWordInput('');
    setDiscoveryContextInput('');
    setDiscoveryPageInput('');
    setShowDetailedExplorer(false);
    setPreviewWordLookup(null);

    setTimeout(() => {
      setQuickSavedNotification(null);
      setShowWordDiscoveryModal(false);
    }, 1600);
  };

  // Complete session & log
  const handleFinalizeSession = () => {
    const minutesRead = Math.max(1, Math.round(elapsedSeconds / 60));
    const xpEarned = minutesRead * 2 + sessionWordsFound.length * 15;

    const newSession: ReadingSession = {
      id: `session-${Date.now()}`,
      date: 'Today',
      bookTitle: bookTitle || 'Independent Reading',
      bookAuthor: bookAuthor || undefined,
      startPage: startPage ? parseInt(startPage, 10) : undefined,
      endPage: endPage ? parseInt(endPage, 10) : undefined,
      minutesRead,
      targetMinutes: selectedMinutes,
      wordsDiscovered: sessionWordsFound.map((w) => w.word),
      xpEarned,
      theme: profile.theme
    };

    onSessionComplete(newSession);
    onAddXp(xpEarned);

    if (sessionWordsFound.length > 0) {
      setStage('post_review');
    } else {
      setStage('setup');
      if (onBackToHome) onBackToHome();
    }
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(
    100,
    Math.round((elapsedSeconds / (selectedMinutes * 60)) * 100)
  );

  // Companion progress stage index (0 to 4)
  const companionStageIndex = Math.min(
    theme.readingCompanion.stageIcons.length - 1,
    Math.floor((progressPercent / 100) * theme.readingCompanion.stageIcons.length)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-['Quicksand']">
      {/* View Switcher Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 flex items-center justify-center text-white shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800 font-['Fredoka']">
                My Reading Adventure
              </h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${theme.badgeBg}`}>
                {theme.icon} {theme.name}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Read real books, notice unfamiliar words, and grow your personal vocabulary!
            </p>
          </div>
        </div>

        {/* Action button to history / setup */}
        <div className="flex items-center gap-2">
          {stage !== 'reading' && (
            <button
              id="reading-history-toggle-btn"
              onClick={() => {
                sound.playPop();
                setStage(stage === 'history' ? 'setup' : 'history');
              }}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <BookMarked className="w-4 h-4 text-pink-500" />
              <span>{stage === 'history' ? 'Back to Timer' : 'My Reading Log'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= STAGE 1: SETUP SCREEN ================= */}
      {stage === 'setup' && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.heroGradient} p-6 sm:p-8 text-white shadow-xl border-2 border-white/20`}>
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/25 backdrop-blur-xs text-xs font-bold mb-3">
                <span>⏱️</span>
                <span>Recommended Goal: 15 Minutes Daily</span>
                <span>✨</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-['Fredoka'] mb-2">
                Ready to Read?
              </h2>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium mb-6">
                Pick up your real book, grab a pencil or bookmark, and let's begin your Reading Adventure!
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-center">
                <div className="bg-white/20 backdrop-blur-xs rounded-2xl p-2.5">
                  <div className="text-lg">⏱️</div>
                  <div className="font-extrabold text-xs">15 Minutes</div>
                  <div className="text-[10px] text-white/80">Default Goal</div>
                </div>
                <div className="bg-white/20 backdrop-blur-xs rounded-2xl p-2.5">
                  <div className="text-lg">📖</div>
                  <div className="font-extrabold text-xs">Real Books</div>
                  <div className="text-[10px] text-white/80">Offline Habit</div>
                </div>
                <div className="bg-white/20 backdrop-blur-xs rounded-2xl p-2.5">
                  <div className="text-lg">🔍</div>
                  <div className="font-extrabold text-xs">Discover Words</div>
                  <div className="text-[10px] text-white/80">Tap Add Word</div>
                </div>
                <div className="bg-white/20 backdrop-blur-xs rounded-2xl p-2.5">
                  <div className="text-lg">🔥</div>
                  <div className="font-extrabold text-xs">{profile.readingStreak} Day Streak</div>
                  <div className="text-[10px] text-white/80">Reading Streak</div>
                </div>
              </div>

              <button
                id="start-reading-btn"
                onClick={handleStartSession}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-800 font-extrabold text-base shadow-lg hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-slate-800" />
                <span>▶ START READING ({selectedMinutes} MIN)</span>
              </button>
            </div>
          </div>

          {/* Session Configuration Card */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-800 font-['Fredoka'] flex items-center gap-2">
              <Clock className="w-5 h-5 text-pink-500" />
              <span>Choose Reading Duration</span>
            </h3>

            {/* Duration Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[15, 20, 30, 45, 60].map((mins) => {
                const isSelected = selectedMinutes === mins;
                return (
                  <button
                    key={mins}
                    id={`reading-duration-${mins}-btn`}
                    onClick={() => {
                      sound.playPop();
                      setSelectedMinutes(mins);
                    }}
                    className={`py-3 px-4 rounded-2xl font-bold text-sm transition-all border-2 cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200 scale-103'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                    }`}
                  >
                    <span className="text-base font-['Fredoka']">{mins} min</span>
                    {mins === (profile.dailyReadingGoalMinutes || 15) && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/30 text-white' : 'bg-pink-100 text-pink-700 font-bold'}`}>
                        ★ Goal
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Book Information Section */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h3 className="text-lg font-bold text-slate-800 font-['Fredoka'] flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-pink-500" />
                <span>What are you reading today? (Optional)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    📚 Book Title
                  </label>
                  <input
                    id="reading-book-title-input"
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="e.g. Charlotte's Web, Percy Jackson..."
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-pink-500 focus:outline-none text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    ✍️ Author
                  </label>
                  <input
                    id="reading-book-author-input"
                    type="text"
                    value={bookAuthor}
                    onChange={(e) => setBookAuthor(e.target.value)}
                    placeholder="e.g. E.B. White"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-pink-500 focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    📄 Starting Page
                  </label>
                  <input
                    id="reading-start-page-input"
                    type="number"
                    value={startPage}
                    onChange={(e) => setStartPage(e.target.value)}
                    placeholder="e.g. 24"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-pink-500 focus:outline-none text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    🎵 Calming Focus Sound
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAmbientEnabled(!ambientEnabled)}
                      className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold border-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        ambientEnabled
                          ? 'bg-pink-50 border-pink-400 text-pink-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {ambientEnabled ? <Volume2 className="w-4 h-4 text-pink-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                      <span>{ambientEnabled ? 'Sound On' : 'Silent Focus'}</span>
                    </button>
                    {ambientEnabled && (
                      <select
                        value={ambientSoundType}
                        onChange={(e) => setAmbientSoundType(e.target.value as any)}
                        className="px-2 py-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white text-slate-700 focus:outline-none"
                      >
                        <option value="rain">🌧️ Gentle Rain</option>
                        <option value="forest">🌿 Forest Wind</option>
                        <option value="waves">🌊 Calm Waves</option>
                        <option value="space">🪐 Cosmic Space</option>
                        <option value="chimes">✨ Soft Chimes</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STAGE 2: ACTIVE FOCUS READING SCREEN ================= */}
      {stage === 'reading' && (
        <div className="space-y-6">
          {/* Main Focus Companion Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-pink-100 shadow-xl p-6 sm:p-10 text-center space-y-6">
            
            {/* Top Reminder Banner */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-extrabold text-xs sm:text-sm animate-pulse">
              <span>📖</span>
              <span>LOOK AT YOUR BOOK — NOT THE SCREEN!</span>
              <span>✨</span>
            </div>

            {/* Reading Companion Visual (Theme Specific) */}
            <div className="py-4">
              <div className="inline-block p-6 rounded-3xl bg-gradient-to-br from-pink-50 via-purple-50 to-amber-50 border-2 border-pink-100 shadow-inner">
                <div className="text-7xl sm:text-8xl select-none transition-transform transform hover:scale-110">
                  {theme.readingCompanion.stageIcons[companionStageIndex] || '🌸'}
                </div>
              </div>
              <div className="mt-3">
                <p className="font-extrabold text-base text-slate-800 font-['Fredoka']">
                  {theme.readingCompanion.title}
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {theme.readingCompanion.description}
                </p>
              </div>
            </div>

            {/* Countdown Clock Display */}
            <div>
              <div className="font-['Fredoka'] text-6xl sm:text-7xl font-extrabold tracking-tight text-slate-800 tabular-nums">
                {formatTime(secondsRemaining)}
              </div>
              <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                <span>⏱️ {Math.floor(elapsedSeconds / 60)} min elapsed</span>
                <span>•</span>
                <span>🎯 Goal: {selectedMinutes} min</span>
                <span>•</span>
                <span className="text-orange-600 font-bold flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-orange-500" />
                  {profile.readingStreak} Day Streak
                </span>
              </div>
            </div>

            {/* Progress Bar toward today's goal */}
            <div className="max-w-md mx-auto">
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-1.5">
                <span>Started</span>
                <span>{progressPercent}% Complete</span>
                <span>Target: {selectedMinutes}m</span>
              </div>
            </div>

            {/* Primary Action Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {/* BIG WORD DISCOVERY BUTTON */}
              <button
                id="i-found-a-word-btn"
                onClick={() => {
                  sound.playPop();
                  setShowWordDiscoveryModal(true);
                }}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-200 active:scale-95 transition-all cursor-pointer flex items-center gap-2 animate-bounce"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
                <span>🔍 I Found a New Word!</span>
              </button>

              {/* Pause / Play */}
              <button
                id="reading-pause-toggle-btn"
                onClick={() => {
                  sound.playPop();
                  setIsActive(!isActive);
                }}
                className="p-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
                title={isActive ? 'Pause Timer' : 'Resume Timer'}
              >
                {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-slate-700" />}
              </button>

              {/* Ambient Audio Toggle */}
              <button
                onClick={() => {
                  sound.playPop();
                  setAmbientEnabled(!ambientEnabled);
                }}
                className={`p-3.5 rounded-full border transition-colors cursor-pointer ${
                  ambientEnabled
                    ? 'bg-pink-100 border-pink-300 text-pink-700'
                    : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}
                title={ambientEnabled ? 'Turn Off Ambient Sound' : 'Turn On Ambient Focus Sound'}
              >
                {ambientEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              {/* Finish Early */}
              <button
                onClick={handleFinishEarly}
                className="px-4 py-3 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Finish Session
              </button>
            </div>

            {/* Currently Logged Book Indicator */}
            {bookTitle && (
              <div className="text-xs text-slate-400 flex items-center justify-center gap-2 pt-2 border-t border-slate-100">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Reading: <strong className="text-slate-600">{bookTitle}</strong></span>
                {sessionWordsFound.length > 0 && (
                  <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    {sessionWordsFound.length} {sessionWordsFound.length === 1 ? 'word saved' : 'words saved'}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= STAGE 3: CELEBRATION SCREEN ================= */}
      {stage === 'celebration' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-pink-100 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-pink-400 to-rose-400 flex items-center justify-center text-4xl shadow-lg shadow-pink-200 animate-bounce">
            🎉
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 font-['Fredoka']">
              Great Reading!
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mt-2 font-medium">
              You showed dedication to your book and expanded your knowledge today!
            </p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            <div className="bg-pink-50 rounded-2xl p-3.5 border border-pink-200">
              <div className="text-2xl font-extrabold text-pink-600 font-['Fredoka']">
                {Math.max(1, Math.round(elapsedSeconds / 60))}m
              </div>
              <div className="text-xs font-bold text-pink-800">Minutes Read</div>
            </div>

            <div className="bg-orange-50 rounded-2xl p-3.5 border border-orange-200">
              <div className="text-2xl font-extrabold text-orange-600 font-['Fredoka'] flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-orange-500" />
                {profile.readingStreak + 1}
              </div>
              <div className="text-xs font-bold text-orange-800">Reading Streak!</div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-3.5 border border-purple-200">
              <div className="text-2xl font-extrabold text-purple-600 font-['Fredoka']">
                +{Math.max(1, Math.round(elapsedSeconds / 60)) * 2 + sessionWordsFound.length * 15}
              </div>
              <div className="text-xs font-bold text-purple-800">Reading XP</div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200">
              <div className="text-2xl font-extrabold text-emerald-600 font-['Fredoka']">
                {sessionWordsFound.length}
              </div>
              <div className="text-xs font-bold text-emerald-800">New Words</div>
            </div>
          </div>

          {/* Optional End Page Input */}
          <div className="max-w-xs mx-auto text-left">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              📖 What page did you finish on? (Optional)
            </label>
            <input
              type="number"
              value={endPage}
              onChange={(e) => setEndPage(e.target.value)}
              placeholder="e.g. 45"
              className="w-full px-4 py-2 rounded-xl border-2 border-slate-200 text-sm font-medium focus:border-pink-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleContinueReading(5)}
              className="px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
            >
              + Keep Reading (5 min)
            </button>

            <button
              onClick={handleFinalizeSession}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-base shadow-lg shadow-pink-200 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Done with Reading Time</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STAGE 4: POST-READING WORD REVIEW ================= */}
      {stage === 'post_review' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-pink-100 shadow-xl space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>Personal Word Collection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-['Fredoka']">
              🌟 You Found {sessionWordsFound.length} New {sessionWordsFound.length === 1 ? 'Word' : 'Words'}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
              Would you like to explore their meanings now, or save them for later practice?
            </p>
          </div>

          {/* Words Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sessionWordsFound.map((word) => (
              <div
                key={word.id}
                className="bg-pink-50/70 border-2 border-pink-200/80 rounded-2xl p-4 text-left space-y-2 relative"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-extrabold text-pink-900 font-['Fredoka'] capitalize">
                      {word.word}
                    </h4>
                    <span className="text-xs text-pink-600 font-semibold font-mono">
                      /{word.pronunciation}/
                    </span>
                  </div>
                  <button
                    onClick={() => sound.speak(word.word)}
                    className="p-1.5 rounded-full bg-white text-pink-600 hover:bg-pink-100 transition-colors shadow-xs"
                    title="Hear Pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {word.definition}
                </p>

                {word.exampleSentence && (
                  <p className="text-[11px] text-slate-500 italic bg-white/70 p-2 rounded-xl border border-pink-100">
                    "{word.exampleSentence}"
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Options */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                sound.playPop();
                if (sessionWordsFound[0]) {
                  setChallengeTargetWord(sessionWordsFound[0]);
                  setActiveMiniChallenge('definition');
                }
              }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-extrabold text-sm shadow-md shadow-pink-200 cursor-pointer flex items-center gap-2"
            >
              <span>🎓 LEARN MY WORDS NOW</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setStage('setup');
                if (onBackToHome) onBackToHome();
              }}
              className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer"
            >
              <span>📖 I'll Learn Them Later</span>
            </button>
          </div>

          {/* Interactive Mini Challenge Drawer if active */}
          {activeMiniChallenge === 'definition' && challengeTargetWord && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5 text-left space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-purple-900 font-['Fredoka'] text-base flex items-center gap-2">
                  <span>🔍 Definition Detective</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-200 text-purple-800">
                    Mini-Game
                  </span>
                </h4>
                <button
                  onClick={() => setActiveMiniChallenge('none')}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Skip
                </button>
              </div>

              <p className="text-sm font-bold text-slate-700">
                What is the best meaning for <strong className="text-purple-700 underline font-extrabold capitalize">{challengeTargetWord.word}</strong>?
              </p>

              <div className="grid grid-cols-1 gap-2">
                {[
                  challengeTargetWord.definition,
                  'Moving backward very quickly without stopping.',
                  'A type of heavy rainstorm occurring at night.'
                ]
                  .sort()
                  .map((opt, idx) => {
                    const isCorrect = opt === challengeTargetWord.definition;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (isCorrect) {
                            sound.playSuccessChime();
                            triggerSparkleConfetti();
                            onAddXp(15);
                            setActiveMiniChallenge('complete');
                          } else {
                            sound.playSoftBoing();
                          }
                        }}
                        className="p-3 rounded-xl bg-white hover:bg-purple-100/60 border border-purple-200 text-left text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        {opt}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {activeMiniChallenge === 'complete' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <p className="font-bold text-emerald-800 text-sm">
                🌟 Outstanding! You learned your reading word and earned +15 XP!
              </p>
              <button
                onClick={() => {
                  sound.playPop();
                  setStage('setup');
                  if (onBackToHome) onBackToHome();
                }}
                className="px-5 py-2 rounded-full bg-emerald-600 text-white font-bold text-xs"
              >
                Done! Return to Dashboard
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= STAGE 5: READING HISTORY & LOG ================= */}
      {stage === 'history' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-800 font-['Fredoka'] flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-pink-500" />
              <span>My Reading Journey & Books</span>
            </h2>

            {/* Reading Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 bg-pink-50 rounded-2xl border border-pink-100">
                <div className="text-2xl font-extrabold text-pink-700 font-['Fredoka']">
                  {profile.totalReadingMinutes}m
                </div>
                <div className="text-xs text-pink-800 font-bold">Total Minutes Read</div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="text-2xl font-extrabold text-purple-700 font-['Fredoka']">
                  {readingSessions.length}
                </div>
                <div className="text-xs text-purple-800 font-bold">Reading Sessions</div>
              </div>

              <div className="p-3.5 bg-orange-50 rounded-2xl border border-orange-100">
                <div className="text-2xl font-extrabold text-orange-600 font-['Fredoka'] flex items-center justify-center gap-1">
                  <Flame className="w-5 h-5 fill-orange-500" />
                  {profile.readingStreak}
                </div>
                <div className="text-xs text-orange-800 font-bold">Current Streak</div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="text-2xl font-extrabold text-emerald-700 font-['Fredoka']">
                  {allWords.filter((w) => w.sourceType === 'reading').length}
                </div>
                <div className="text-xs text-emerald-800 font-bold">Discovered Words</div>
              </div>
            </div>

            {/* Books Collection List */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-800 font-['Fredoka']">
                📚 Books In Progress
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-left"
                  >
                    <div className="font-extrabold text-sm text-slate-800 font-['Fredoka']">
                      {book.title}
                    </div>
                    {book.author && (
                      <p className="text-xs text-slate-500">By {book.author}</p>
                    )}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                      <span>⏱️ {book.totalMinutesRead} mins</span>
                      <span>🔍 {book.wordsDiscoveredCount} words</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reading Sessions Table */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-800 font-['Fredoka']">
                ⏱️ Recent Reading Sessions
              </h3>

              <div className="space-y-2">
                {readingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 font-['Fredoka'] text-sm">
                        {session.bookTitle}
                      </span>
                      <p className="text-slate-500">
                        {session.date} • {session.minutesRead} minutes read
                        {session.startPage && session.endPage ? ` (Pages ${session.startPage}-${session.endPage})` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {session.wordsDiscovered.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold text-[10px]">
                          +{session.wordsDiscovered.length} words
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px]">
                        +{session.xpEarned} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: WORD DISCOVERY / I FOUND A WORD ================= */}
      {showWordDiscoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-pink-200 space-y-5 text-left relative">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs mb-1">
                  <span>🔍</span>
                  <span>Word Discovery</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-['Fredoka']">
                  What word did you find?
                </h3>
              </div>
              <button
                onClick={() => setShowWordDiscoveryModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Saved Notification Banner */}
            {quickSavedNotification && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-center space-y-1 animate-in zoom-in-95">
                <div className="text-2xl">🔖</div>
                <p className="font-extrabold text-base font-['Fredoka']">
                  "{quickSavedNotification}" Saved!
                </p>
                <p className="text-xs text-emerald-700">
                  Added to your Word Collection. Returning you to your book... 🌸
                </p>
              </div>
            )}

            {!quickSavedNotification && (
              <>
                {/* Word Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Word from Book *
                  </label>
                  <input
                    id="discovery-word-input"
                    type="text"
                    autoFocus
                    value={discoveryWordInput}
                    onChange={(e) => {
                      setDiscoveryWordInput(e.target.value);
                      if (e.target.value.trim().length > 2) {
                        setPreviewWordLookup(lookupOrGenerateWordDetails(e.target.value));
                      } else {
                        setPreviewWordLookup(null);
                      }
                    }}
                    placeholder="e.g. Magnificent, Curious, Wandered..."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none text-base font-bold text-slate-800 font-['Fredoka']"
                  />
                </div>

                {/* Optional Sentence Context */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Where did you see this word? (Optional)
                  </label>
                  <input
                    type="text"
                    value={discoveryContextInput}
                    onChange={(e) => setDiscoveryContextInput(e.target.value)}
                    placeholder="e.g. 'The magnificent castle stood on the hill.'"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-pink-500 focus:outline-none text-xs font-medium"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    💡 Typing the sentence helps you remember how the author used it!
                  </p>
                </div>

                {/* Optional Page Input */}
                <div className="w-1/2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Page Number (Optional)
                  </label>
                  <input
                    type="number"
                    value={discoveryPageInput}
                    onChange={(e) => setDiscoveryPageInput(e.target.value)}
                    placeholder="e.g. 42"
                    className="w-full px-4 py-2 rounded-xl border-2 border-slate-200 focus:border-pink-500 focus:outline-none text-xs font-medium"
                  />
                </div>

                {/* Live Preview if word matched */}
                {previewWordLookup && (
                  <div className="p-3.5 rounded-2xl bg-pink-50/80 border border-pink-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-pink-900 font-['Fredoka'] capitalize">
                        {previewWordLookup.word}
                      </span>
                      <button
                        type="button"
                        onClick={() => sound.speak(previewWordLookup.word)}
                        className="p-1 rounded-full bg-white text-pink-600 hover:bg-pink-100"
                        title="Hear Pronunciation"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-slate-700">
                      <strong>Meaning:</strong> {previewWordLookup.simpleMeaning}
                    </p>
                  </div>
                )}

                {/* Action Buttons: Quick Add vs Explore */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                  <button
                    id="quick-save-word-btn"
                    onClick={handleQuickAddWord}
                    disabled={!discoveryWordInput.trim()}
                    className="w-full sm:flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 text-white font-extrabold text-sm shadow-md shadow-pink-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>⚡ Quick Save & Back to Reading</span>
                  </button>

                  <button
                    onClick={() => setShowWordDiscoveryModal(false)}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

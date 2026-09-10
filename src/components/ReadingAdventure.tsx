import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BookOpen,
  Play,
  Pause,
  Sparkles,
  Plus,
  Volume2,
  VolumeX,
  Flame,
  CheckCircle2,
  Award,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Bookmark,
  ArrowRight,
  Clock,
  BookMarked,
  Layers,
  Heart,
  X,
  TrendingUp,
  Calendar,
  Coffee,
  RotateCcw,
  Check
} from 'lucide-react';
import {
  UserProfile,
  VocabWord,
  ReadingSession,
  BookRecord,
  ThemeId,
  ReadingDiscoveredWordDetail
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
  WordDefinitionLookup,
  formatSoundingOutPronunciation
} from '../utils/dictionary';
import { ReadingMilestoneToast, ReadingMilestone } from './reading/ReadingMilestoneToast';

interface ReadingAdventureProps {
  profile: UserProfile;
  allWords: VocabWord[];
  readingSessions: ReadingSession[];
  books: BookRecord[];
  onAddNewWord: (word: VocabWord) => void;
  onSessionComplete: (session: ReadingSession) => void;
  onAddXp: (amount: number) => void;
  onAddCoins?: (amount: number) => void;
  onReadingStateChange?: (isReading: boolean) => void;
  onBackToHome?: () => void;
}

const READING_MILESTONES: ReadingMilestone[] = [
  { minute: 5, label: '5-Minute Milestone', icon: '🌱', coins: 5, xp: 10, message: "5 minutes read. You've settled peacefully into your reading rhythm." },
  { minute: 15, label: '15-Minute Goal Met', icon: '⭐', coins: 15, xp: 30, message: "Daily reading goal complete! You reached 15 minutes of real book reading." },
  { minute: 20, label: '20-Minute Milestone', icon: '🌊', coins: 10, xp: 20, message: "20 minutes read. Deep in your focused reading flow." },
  { minute: 30, label: '30-Minute Milestone', icon: '📚', coins: 15, xp: 30, message: "30 minutes read. Half an hour of wonderful book dedication." },
  { minute: 45, label: '45-Minute Milestone', icon: '🌟', coins: 15, xp: 30, message: "45 minutes read. Master reader endurance and curiosity!" },
  { minute: 60, label: '60-Minute Milestone', icon: '🏆', coins: 20, xp: 40, message: "60 minutes read. A whole golden hour of book adventure!" }
];

const ACTIVE_SESSION_STORAGE_KEY = 'bloomword_active_reading_session_v2';

export const ReadingAdventure: React.FC<ReadingAdventureProps> = ({
  profile,
  allWords,
  readingSessions,
  books,
  onAddNewWord,
  onSessionComplete,
  onAddXp,
  onAddCoins,
  onReadingStateChange,
  onBackToHome
}) => {
  const theme = getThemeConfig(profile.theme);

  // Flow stages: 'setup' | 'reading' | 'celebration' | 'history'
  const [stage, setStage] = useState<'setup' | 'reading' | 'celebration' | 'history'>('setup');

  // Reading Setup State
  const [selectedMinutes, setSelectedMinutes] = useState<number>(profile.dailyReadingGoalMinutes || 15);
  const [bookTitle, setBookTitle] = useState<string>(books[0]?.title || "Charlotte's Web");
  const [bookAuthor, setBookAuthor] = useState<string>(books[0]?.author || 'E.B. White');
  const [startPage, setStartPage] = useState<string>('');
  const [endPage, setEndPage] = useState<string>('');

  // Active Timer State
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [activeSeconds, setActiveSeconds] = useState<number>(0);
  const [pausedSeconds, setPausedSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [sessionWordsFound, setSessionWordsFound] = useState<VocabWord[]>([]);
  const [awardedMilestones, setAwardedMilestones] = useState<number[]>([]);
  const [activeMilestoneToast, setActiveMilestoneToast] = useState<ReadingMilestone | null>(null);
  const [showGoalReachedBanner, setShowGoalReachedBanner] = useState<boolean>(false);
  const [hasAcknowledgedGoalComplete, setHasAcknowledgedGoalComplete] = useState<boolean>(false);

  // Saved Session Restoration Prompt
  const [savedSessionToRestore, setSavedSessionToRestore] = useState<{
    startTime: number;
    activeSeconds: number;
    pausedSeconds: number;
    selectedMinutes: number;
    bookTitle: string;
    bookAuthor: string;
    startPage: string;
    awardedMilestones: number[];
    sessionWordsFound: VocabWord[];
  } | null>(null);

  // Ambient sound
  const [ambientEnabled, setAmbientEnabled] = useState<boolean>(false);
  const [ambientSoundType, setAmbientSoundType] = useState<'chimes' | 'forest' | 'space' | 'waves' | 'rain'>(
    theme.ambientSound === 'arcade' ? 'chimes' : theme.ambientSound
  );

  // Word Discovery Modal
  const [showWordDiscoveryModal, setShowWordDiscoveryModal] = useState<boolean>(false);
  const [discoveryWordInput, setDiscoveryWordInput] = useState<string>('');
  const [discoverySourceType, setDiscoverySourceType] = useState<'book' | 'bible' | 'article' | 'other'>('book');
  const [discoveryContextInput, setDiscoveryContextInput] = useState<string>('');
  const [discoveryPageInput, setDiscoveryPageInput] = useState<string>('');
  const [previewWordLookup, setPreviewWordLookup] = useState<WordDefinitionLookup | null>(null);

  // History views tab: 'sessions' | 'weekly'
  const [historyTab, setHistoryTab] = useState<'sessions' | 'weekly'>('sessions');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  // Interval Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check for restorable session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.activeSeconds === 'number' && parsed.activeSeconds > 0) {
          setSavedSessionToRestore(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync with profile daily goal if updated in settings/dashboard
  useEffect(() => {
    if (stage === 'setup' && profile.dailyReadingGoalMinutes) {
      setSelectedMinutes(profile.dailyReadingGoalMinutes);
    }
  }, [profile.dailyReadingGoalMinutes, stage]);

  // Handle active vs paused timer tick
  useEffect(() => {
    if (stage === 'reading') {
      timerRef.current = setInterval(() => {
        if (!isPaused) {
          setActiveSeconds((prev) => prev + 1);
        } else {
          setPausedSeconds((prev) => prev + 1);
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage, isPaused]);

  // Check milestones and goal completions when activeSeconds increments
  useEffect(() => {
    if (stage !== 'reading') return;

    const currentMins = Math.floor(activeSeconds / 60);
    const goalSecs = selectedMinutes * 60;

    // 1. Check if user reached chosen goal or 15m goal for the first time in this session
    if (activeSeconds >= goalSecs && !hasAcknowledgedGoalComplete && !showGoalReachedBanner) {
      setShowGoalReachedBanner(true);
      triggerSparkleConfetti();
      sound.playSuccessChime();
    }

    // 2. Check each milestone threshold (awarded only once per session)
    for (const milestone of READING_MILESTONES) {
      if (currentMins >= milestone.minute && !awardedMilestones.includes(milestone.minute)) {
        setAwardedMilestones((prev) => [...prev, milestone.minute]);
        setActiveMilestoneToast(milestone);
        // Play quiet, non-startling reading bell for physical book reading
        sound.playQuietReadingBell();
        if (onAddXp) onAddXp(milestone.xp);
        if (onAddCoins) onAddCoins(milestone.coins);
        break;
      }
    }
  }, [activeSeconds, stage, selectedMinutes, hasAcknowledgedGoalComplete, showGoalReachedBanner, awardedMilestones, onAddXp, onAddCoins]);

  // Persist active reading session state to localStorage
  useEffect(() => {
    if (stage === 'reading' && activeSeconds > 0) {
      try {
        localStorage.setItem(
          ACTIVE_SESSION_STORAGE_KEY,
          JSON.stringify({
            startTime: sessionStartTime,
            activeSeconds,
            pausedSeconds,
            isPaused,
            selectedMinutes,
            bookTitle,
            bookAuthor,
            startPage,
            awardedMilestones,
            sessionWordsFound
          })
        );
      } catch {
        // ignore
      }
    }
  }, [stage, sessionStartTime, activeSeconds, pausedSeconds, isPaused, selectedMinutes, bookTitle, bookAuthor, startPage, awardedMilestones, sessionWordsFound]);

  // Notify parent of reading activity state (e.g. for My Learning Home character animation)
  const prevIsReadingRef = useRef<boolean | null>(null);
  const onReadingStateChangeRef = useRef(onReadingStateChange);
  onReadingStateChangeRef.current = onReadingStateChange;

  useEffect(() => {
    const isReading = stage === 'reading';
    if (prevIsReadingRef.current !== isReading) {
      prevIsReadingRef.current = isReading;
      if (onReadingStateChangeRef.current) {
        onReadingStateChangeRef.current(isReading);
      }
    }
  }, [stage]);

  // Ambient sound management
  useEffect(() => {
    if (stage === 'reading' && ambientEnabled && !isPaused) {
      sound.startAmbient(ambientSoundType);
    } else {
      sound.stopAmbient();
    }
    return () => {
      sound.stopAmbient();
    };
  }, [stage, ambientEnabled, isPaused, ambientSoundType]);

  // Start a fresh reading session
  const handleStartFreshSession = () => {
    sound.playPop();
    setSessionStartTime(Date.now());
    setActiveSeconds(0);
    setPausedSeconds(0);
    setIsPaused(false);
    setSessionWordsFound([]);
    setAwardedMilestones([]);
    setShowGoalReachedBanner(false);
    setHasAcknowledgedGoalComplete(false);
    setSavedSessionToRestore(null);
    setStage('reading');
    if (ambientEnabled) {
      sound.startAmbient(ambientSoundType);
    }
  };

  // Resume a restored session from localStorage
  const handleRestoreSavedSession = () => {
    if (!savedSessionToRestore) return;
    sound.playPop();
    setSessionStartTime(savedSessionToRestore.startTime || Date.now());
    setActiveSeconds(savedSessionToRestore.activeSeconds || 0);
    setPausedSeconds(savedSessionToRestore.pausedSeconds || 0);
    setSelectedMinutes(savedSessionToRestore.selectedMinutes || 15);
    setBookTitle(savedSessionToRestore.bookTitle || "Charlotte's Web");
    setBookAuthor(savedSessionToRestore.bookAuthor || 'E.B. White');
    setStartPage(savedSessionToRestore.startPage || '');
    setAwardedMilestones(savedSessionToRestore.awardedMilestones || []);
    setSessionWordsFound(savedSessionToRestore.sessionWordsFound || []);
    setIsPaused(false);
    setShowGoalReachedBanner(false);
    setHasAcknowledgedGoalComplete(false);
    setSavedSessionToRestore(null);
    setStage('reading');
    if (ambientEnabled) {
      sound.startAmbient(ambientSoundType);
    }
  };

  const handleDiscardSavedSession = () => {
    sound.playPop();
    try {
      localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
    setSavedSessionToRestore(null);
  };

  // Pause / Resume Toggle
  const handleTogglePause = () => {
    sound.playPop();
    setIsPaused((prev) => !prev);
  };

  // When clicking "+ Add a Word": automatically pauses reading timer
  const handleOpenAddWordModal = () => {
    sound.playPop();
    setIsPaused(true); // Automatically pause active reading timer!
    setDiscoveryWordInput('');
    setDiscoveryContextInput('');
    setDiscoveryPageInput('');
    setPreviewWordLookup(null);
    setShowWordDiscoveryModal(true);
  };

  // Saving word: processes word through full dictionary/curriculum, adds to master vocabulary, and resumes timer
  const handleSaveWordAndResume = () => {
    if (!discoveryWordInput.trim()) return;

    const lookup = lookupOrGenerateWordDetails(discoveryWordInput, discoveryContextInput);
    const newWord = createVocabWordFromDiscovery(
      lookup,
      bookTitle,
      bookAuthor,
      discoveryPageInput ? parseInt(discoveryPageInput, 10) : undefined,
      discoveryContextInput
    );

    // If discovered in Bible or Article, set category/context
    if (discoverySourceType === 'bible') {
      newWord.isBibleWord = true;
      newWord.category = 'Bible & Faith';
    }

    onAddNewWord(newWord);
    setSessionWordsFound((prev) => [newWord, ...prev]);
    if (onAddXp) onAddXp(20);
    if (onAddCoins) onAddCoins(5);
    sound.playBloomSparkle();

    setShowWordDiscoveryModal(false);
    // Resume reading timer as requested: "[Save & Continue Reading] resumes the reading timer"
    setIsPaused(false);
  };

  // Close word modal without saving: resume timer
  const handleCloseWordModal = () => {
    setShowWordDiscoveryModal(false);
    setIsPaused(false);
  };

  // Finish session & advance to summary
  const handleGoToCelebration = () => {
    sound.playPop();
    setIsPaused(true);
    sound.stopAmbient();
    setStage('celebration');
  };

  // Keep reading when goal reached (continuous reading without resetting!)
  const handleKeepReading = () => {
    sound.playPop();
    setShowGoalReachedBanner(false);
    setHasAcknowledgedGoalComplete(true);
    setIsPaused(false);
  };

  // Finalize session into history & stats
  const handleFinalizeSession = () => {
    const activeMinutes = Math.max(1, Math.round(activeSeconds / 60));
    const isGoalCompleted = activeSeconds >= selectedMinutes * 60 || activeMinutes >= 15;
    const baseCoins = activeMinutes >= 15 ? 20 : Math.max(5, activeMinutes);
    const totalCoinsEarned = baseCoins + sessionWordsFound.length * 5;
    const totalXpEarned = activeMinutes * 2 + sessionWordsFound.length * 15;

    const wordDetails: ReadingDiscoveredWordDetail[] = sessionWordsFound.map((w) => ({
      word: w.word,
      pronunciation: w.pronunciation,
      definition: w.definition,
      simpleDefinition: w.simpleDefinition,
      example: w.exampleSentence || w.example,
      source: w.context,
      isBibleWord: w.isBibleWord
    }));

    const newSession: ReadingSession = {
      id: `session-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      bookTitle: bookTitle || 'Independent Reading',
      bookAuthor: bookAuthor || undefined,
      startPage: startPage ? parseInt(startPage, 10) : undefined,
      endPage: endPage ? parseInt(endPage, 10) : undefined,
      minutesRead: activeMinutes,
      targetMinutes: selectedMinutes,
      selectedGoalMinutes: selectedMinutes,
      activeSeconds,
      pausedSeconds,
      goalCompleted: isGoalCompleted,
      wordsDiscovered: sessionWordsFound.map((w) => w.word),
      wordsDiscoveredDetails: wordDetails,
      xpEarned: totalXpEarned,
      coinsEarned: totalCoinsEarned,
      totalDurationSeconds: activeSeconds + pausedSeconds,
      theme: profile.theme
    };

    onSessionComplete(newSession);
    if (onAddXp) onAddXp(totalXpEarned);
    if (onAddCoins) onAddCoins(totalCoinsEarned);

    // Clear active session storage
    try {
      localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }

    setStage('setup');
    if (onBackToHome) onBackToHome();
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Format Hours & Minutes
  const formatHoursAndMins = (totalMinutes: number) => {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hrs === 0) return `${mins} min`;
    return `${hrs} hr ${mins} min`;
  };

  // Calculate weekly statistics
  const weeklyStats = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    // Weekly sessions
    const thisWeekSessions = readingSessions.slice(0, 14); // approximate recent
    const totalMinutes = thisWeekSessions.reduce((acc, s) => acc + (s.minutesRead || 0), 0);
    const totalWords = thisWeekSessions.reduce((acc, s) => acc + (s.wordsDiscovered?.length || 0), 0);
    const daysWithReading = new Set(thisWeekSessions.map((s) => s.date)).size;
    const avgLength = thisWeekSessions.length > 0 ? Math.round(totalMinutes / thisWeekSessions.length) : 0;
    const longestSession = thisWeekSessions.length > 0 ? Math.max(...thisWeekSessions.map((s) => s.minutesRead || 0)) : 0;

    // Day-by-day week pills (Monday to Sunday)
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentDayIdx = (now.getDay() + 6) % 7; // Monday = 0

    return {
      totalMinutes,
      totalWords,
      daysRead: Math.min(7, Math.max(daysWithReading, profile.readingStreak > 0 ? Math.min(profile.readingStreak, 7) : 0)),
      avgLength: avgLength || 15,
      longestSession: Math.max(longestSession, 15),
      dayLabels,
      currentDayIdx
    };
  }, [readingSessions, profile.readingStreak]);

  const progressPercent = Math.min(
    100,
    Math.round((activeSeconds / (selectedMinutes * 60)) * 100)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-['Quicksand'] text-left">
      {/* Quiet Non-Intrusive Floating Milestone Toast for Physical Book Reading */}
      <ReadingMilestoneToast
        milestone={activeMilestoneToast}
        onDismiss={() => setActiveMilestoneToast(null)}
      />

      {/* View Switcher Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 flex items-center justify-center text-white shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800 font-['Fredoka']">
                Reading Practice & Vocabulary
              </h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${theme.badgeBg}`}>
                {theme.icon} {theme.name}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Read real physical books, notice unfamiliar words, and build a lasting reading habit!
            </p>
          </div>
        </div>

        {/* Action buttons: My Reading Log & Weekly Progress */}
        <div className="flex items-center gap-2">
          {stage !== 'reading' && (
            <button
              id="reading-history-toggle-btn"
              onClick={() => {
                sound.playPop();
                setStage(stage === 'history' ? 'setup' : 'history');
              }}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <BookMarked className="w-4 h-4 text-pink-500" />
              <span>{stage === 'history' ? 'Back to Reading' : 'Reading Log & Weekly Habit'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= RESTORE ACTIVE SESSION ALERT ================= */}
      {stage === 'setup' && savedSessionToRestore && (
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <span className="text-2xl p-2 rounded-2xl bg-amber-100 shrink-0">📖</span>
            <div>
              <h4 className="text-base font-extrabold text-amber-900 font-['Fredoka']">
                Resume In-Progress Reading Session?
              </h4>
              <p className="text-xs text-amber-800 font-medium mt-0.5">
                You were reading <strong>"{savedSessionToRestore.bookTitle}"</strong> with{' '}
                <strong>{Math.floor(savedSessionToRestore.activeSeconds / 60)} minutes</strong> active reading logged.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRestoreSavedSession}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
            >
              ▶ Resume Reading
            </button>
            <button
              onClick={handleDiscardSavedSession}
              className="px-3 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-300 transition-colors cursor-pointer"
            >
              Start New
            </button>
          </div>
        </div>
      )}

      {/* ================= STAGE 1: SETUP SCREEN ================= */}
      {stage === 'setup' && (
        <div className="space-y-6">
          {/* Hero Banner: Calm & Inspiring */}
          <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.heroGradient} p-6 sm:p-8 text-white shadow-xl border-2 border-white/20`}>
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/25 backdrop-blur-xs text-xs font-extrabold uppercase tracking-wider mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>Today's Recommended Minimum: 15 Minutes</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-['Fredoka'] mb-2">
                Ready to read?
              </h2>
              <p className="text-sm sm:text-base text-white/95 leading-relaxed font-medium mb-5">
                Find your book, get comfortable, and let's spend some quality time reading together.
              </p>

              {/* Physical Book Emphasis Note */}
              <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/25 text-xs text-white/90 mb-6 flex items-start gap-2.5">
                <span className="text-base shrink-0">🛋️</span>
                <span>
                  <strong>Grab a book and get comfortable.</strong> Your screen is only here to support you in building your reading habit, capturing new words, and keeping your reading streak alive.
                </span>
              </div>

              {/* 4 Quick Stat Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-center">
                <div className="bg-white/20 backdrop-blur-xs rounded-2xl p-2.5">
                  <div className="text-lg">⏱️</div>
                  <div className="font-extrabold text-xs">15 Minutes</div>
                  <div className="text-[10px] text-white/80">Recommended Goal</div>
                </div>
                <div className="bg-white/20 backdrop-blur-xs rounded-2xl p-2.5">
                  <div className="text-lg">📖</div>
                  <div className="font-extrabold text-xs">Physical Books</div>
                  <div className="text-[10px] text-white/80">Calm & Screen-Light</div>
                </div>
                <div className="bg-white/20 backdrop-blur-xs rounded-2xl p-2.5">
                  <div className="text-lg">🔍</div>
                  <div className="font-extrabold text-xs">Discover Words</div>
                  <div className="text-[10px] text-white/80">Tap + Add a Word</div>
                </div>
                <div className="bg-white/20 backdrop-blur-xs rounded-2xl p-2.5">
                  <div className="text-lg">🔥</div>
                  <div className="font-extrabold text-xs">{profile.readingStreak || 0} Day Streak</div>
                  <div className="text-[10px] text-white/80">Reading Streak</div>
                </div>
              </div>

              {/* Start Session Button */}
              <button
                id="start-reading-btn"
                onClick={handleStartFreshSession}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-800 font-extrabold text-base shadow-lg hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 font-['Fredoka']"
              >
                <Play className="w-5 h-5 fill-slate-800" />
                <span>START READING ({selectedMinutes} MIN)</span>
              </button>
            </div>
          </div>

          {/* Goal Duration Selector Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200/90 shadow-sm space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-slate-800 font-['Fredoka'] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-pink-500" />
                  <span>Choose Your Reading Goal</span>
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  (15 minutes is the minimum daily goal, not a maximum)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                You can always choose <strong>Keep Reading</strong> when your goal is reached!
              </p>
            </div>

            {/* 5 Duration Options: 15, 20, 30, 45, 60 minutes */}
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
                    className={`py-3.5 px-4 rounded-2xl font-bold text-sm transition-all border-2 cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200 scale-102'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="text-lg font-['Fredoka']">{mins} min</span>
                    {mins === 15 ? (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${isSelected ? 'bg-white/30 text-white' : 'bg-pink-100 text-pink-700'}`}>
                        ★ Minimum Goal
                      </span>
                    ) : (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'text-slate-400'}`}>
                        Milestone
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
                    placeholder="e.g. Charlotte's Web, The Lion the Witch and the Wardrobe..."
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
                    placeholder="e.g. C.S. Lewis, E.B. White"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-pink-500 focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    📄 Starting Page (Optional)
                  </label>
                  <input
                    id="reading-start-page-input"
                    type="number"
                    value={startPage}
                    onChange={(e) => setStartPage(e.target.value)}
                    placeholder="e.g. 1"
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

      {/* ================= STAGE 2: ACTIVE READING SCREEN ================= */}
      {stage === 'reading' && (
        <div className="space-y-6">
          {/* Goal Reached Banner (non-blocking, allow Keep Reading or Finish) */}
          {showGoalReachedBanner && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-300 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in zoom-in-95">
              <div className="flex items-start gap-3.5">
                <span className="text-3xl p-2 rounded-2xl bg-emerald-100 shrink-0">⭐</span>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-extrabold text-[11px] mb-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Reading Goal Complete!</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800 font-['Fredoka']">
                    You reached your {selectedMinutes}-minute reading goal!
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    You can keep reading for extra milestones and rewards, or wrap up your session.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  id="keep-reading-btn"
                  onClick={handleKeepReading}
                  className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-xs transition-all cursor-pointer font-['Fredoka']"
                >
                  📖 Keep Reading
                </button>
                <button
                  id="finish-session-goal-btn"
                  onClick={handleGoToCelebration}
                  className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  Finish Session
                </button>
              </div>
            </div>
          )}

          {/* Main Focus Companion Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-slate-200/90 shadow-xl p-6 sm:p-10 text-center space-y-6">
            {/* Top Peaceful Reminder */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs sm:text-sm">
              <span>📖</span>
              <span>Look at your book — your timer is quietly keeping track</span>
            </div>

            {/* Reading Companion Visual (Theme Specific) */}
            <div className="py-2">
              <div className="inline-block p-6 rounded-3xl bg-gradient-to-br from-pink-50 via-purple-50 to-amber-50 border-2 border-pink-100 shadow-inner">
                <div className="text-6xl sm:text-7xl select-none transition-transform transform hover:scale-105">
                  {isPaused ? '☕' : theme.readingCompanion.stageIcons[Math.min(theme.readingCompanion.stageIcons.length - 1, Math.floor((progressPercent / 100) * theme.readingCompanion.stageIcons.length))] || '🌸'}
                </div>
              </div>
              <div className="mt-2.5">
                <p className="font-extrabold text-base text-slate-800 font-['Fredoka']">
                  {isPaused ? 'Paused • Taking a quick break' : theme.readingCompanion.title}
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
                  {isPaused ? 'Take all the time you need. Your reading time is safely paused.' : theme.readingCompanion.description}
                </p>
              </div>
            </div>

            {/* Active Reading Timer Display */}
            <div>
              <div className="font-['Fredoka'] text-6xl sm:text-7xl font-extrabold tracking-tight text-slate-800 tabular-nums">
                {formatTime(activeSeconds)}
              </div>

              {/* Status Badges: Active Reading vs Paused Time */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-500 font-semibold mt-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  ⏱️ Active Reading: {formatTime(activeSeconds)}
                </span>
                {pausedSeconds > 0 && (
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                    ⏸️ Paused: {formatTime(pausedSeconds)}
                  </span>
                )}
                <span>•</span>
                <span>🎯 Goal: {selectedMinutes} min</span>
                <span>•</span>
                <span className="text-orange-600 font-bold flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-orange-500" />
                  {profile.readingStreak || 0} Day Reading Streak
                </span>
              </div>
            </div>

            {/* Milestones Progress Track */}
            <div className="max-w-md mx-auto space-y-2">
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Milestone checkpoints pills */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
                {[5, 15, 20, 30, 45, 60].map((m) => {
                  const reached = activeSeconds >= m * 60;
                  return (
                    <span
                      key={m}
                      className={`flex items-center gap-0.5 ${reached ? 'text-pink-600 font-extrabold' : 'text-slate-400'}`}
                      title={`${m} minute milestone`}
                    >
                      {reached ? '✓' : ''} {m}m
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Primary Action Controls Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {/* BIG WORD DISCOVERY BUTTON - Automatically Pauses Timer */}
              <button
                id="i-found-a-word-btn"
                onClick={handleOpenAddWordModal}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-200 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
                <span>🔍 + Add a Word</span>
              </button>

              {/* Pause / Resume Button */}
              <button
                id="reading-pause-toggle-btn"
                onClick={handleTogglePause}
                className={`px-5 py-3 rounded-full font-bold text-sm transition-all cursor-pointer border-2 flex items-center gap-2 ${
                  isPaused
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200 animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title={isPaused ? 'Resume Reading Timer' : 'Pause Reading Timer'}
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                )}
              </button>

              {/* Ambient Focus Sound Toggle */}
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
                title={ambientEnabled ? 'Turn Off Calming Sound' : 'Turn On Calming Focus Sound'}
              >
                {ambientEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              {/* Finish Session Button */}
              <button
                id="finish-session-btn"
                onClick={handleGoToCelebration}
                className="px-5 py-3 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
              >
                Finish Session
              </button>
            </div>

            {/* Currently Logged Book Indicator */}
            {bookTitle && (
              <div className="text-xs text-slate-500 flex items-center justify-center gap-2 pt-3 border-t border-slate-100">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>
                  Reading: <strong className="text-slate-700">{bookTitle}</strong>
                </span>
                {sessionWordsFound.length > 0 && (
                  <span className="bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                    {sessionWordsFound.length} {sessionWordsFound.length === 1 ? 'word discovered' : 'words discovered'}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= STAGE 3: CELEBRATION / SESSION SUMMARY ================= */}
      {stage === 'celebration' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200/90 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-pink-400 to-rose-400 flex items-center justify-center text-4xl shadow-lg shadow-pink-200 animate-bounce">
            🎉
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-2">
              <span>📖</span>
              <span>Today's Reading</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 font-['Fredoka']">
              {activeSeconds >= 15 * 60 ? 'Reading Goal Complete!' : 'Good Effort Reading!'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mt-2 font-medium">
              {activeSeconds >= 15 * 60 ? (
                <span>You reached your reading goal today! Every page builds your confidence and vocabulary.</span>
              ) : (
                <span>
                  You read for <strong>{Math.max(1, Math.round(activeSeconds / 60))} minutes</strong> today. Your 15-minute goal isn't complete yet, but every minute of real reading counts!
                </span>
              )}
            </p>
          </div>

          {/* Key Summary Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
            <div className="bg-pink-50 rounded-2xl p-4 border border-pink-200 text-center">
              <div className="text-2xl font-extrabold text-pink-600 font-['Fredoka']">
                {Math.max(1, Math.round(activeSeconds / 60))} min
              </div>
              <div className="text-xs font-bold text-pink-800">Active Reading</div>
              <div className="text-[10px] text-pink-600">Goal: {selectedMinutes} min</div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center">
              <div className="text-2xl font-extrabold text-emerald-600 font-['Fredoka']">
                {activeSeconds >= 15 * 60 || activeSeconds >= selectedMinutes * 60 ? '✓ Reached' : 'In Progress'}
              </div>
              <div className="text-xs font-bold text-emerald-800">Goal Status</div>
              <div className="text-[10px] text-emerald-600">{activeSeconds >= 15 * 60 ? 'Goal Completed' : `${Math.max(0, 15 - Math.round(activeSeconds / 60))}m to 15m`}</div>
            </div>

            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200 text-center">
              <div className="text-2xl font-extrabold text-orange-600 font-['Fredoka'] flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-orange-500" />
                {(profile.readingStreak || 0) + (activeSeconds >= 15 * 60 ? 1 : 0)}d
              </div>
              <div className="text-xs font-bold text-orange-800">Reading Streak</div>
              <div className="text-[10px] text-orange-600">Habit Building</div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200 text-center">
              <div className="text-2xl font-extrabold text-purple-600 font-['Fredoka']">
                {sessionWordsFound.length}
              </div>
              <div className="text-xs font-bold text-purple-800">Words Discovered</div>
              <div className="text-[10px] text-purple-600">Added to Master Vocab</div>
            </div>
          </div>

          {/* Additional details: Paused time & Rewards */}
          <div className="max-w-md mx-auto p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>⏱️ Active: {formatTime(activeSeconds)}</span>
            <span>⏸️ Paused: {formatTime(pausedSeconds)}</span>
            <span>🪙 +{Math.max(1, Math.round(activeSeconds / 60)) >= 15 ? 20 : 10} Coins</span>
            <span>⭐ +{Math.max(1, Math.round(activeSeconds / 60)) * 2 + sessionWordsFound.length * 15} XP</span>
          </div>

          {/* Words Found List during this session */}
          {sessionWordsFound.length > 0 && (
            <div className="max-w-xl mx-auto space-y-3 text-left">
              <h4 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider font-['Fredoka'] flex items-center gap-1.5">
                <span>🔍</span>
                <span>Words Discovered During This Session ({sessionWordsFound.length})</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sessionWordsFound.map((word) => (
                  <div
                    key={word.id}
                    className="p-3 rounded-2xl bg-pink-50/70 border border-pink-200 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-pink-900 capitalize text-sm font-['Fredoka']">
                        {word.word}
                      </span>
                      <button
                        onClick={() => sound.speak(word.word)}
                        className="p-1 rounded-full bg-white text-pink-600 hover:bg-pink-100 shadow-xs cursor-pointer"
                        title="Hear Pronunciation"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 line-clamp-2">
                      {word.simpleDefinition || word.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            {activeSeconds < 15 * 60 && (
              <button
                onClick={() => {
                  sound.playPop();
                  setStage('reading');
                  setIsPaused(false);
                }}
                className="px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
              >
                📖 Continue Reading
              </button>
            )}

            <button
              id="finalize-session-btn"
              onClick={handleFinalizeSession}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-base shadow-lg shadow-pink-200 active:scale-95 transition-all cursor-pointer flex items-center gap-2 font-['Fredoka']"
            >
              <span>Finish</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STAGE 4: READING HISTORY & WEEKLY PROGRESS ================= */}
      {stage === 'history' && (
        <div className="space-y-6">
          {/* Header & Tabs */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-['Fredoka']">
                  📖 Reading Log & Habits
                </h2>
                <p className="text-xs text-slate-500">
                  Track your reading milestones, review discovered words, and celebrate weekly growth!
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl shrink-0">
                <button
                  onClick={() => setHistoryTab('sessions')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    historyTab === 'sessions'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ⏱️ Reading Log
                </button>
                <button
                  onClick={() => setHistoryTab('weekly')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    historyTab === 'weekly'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  📊 Weekly Progress
                </button>
              </div>
            </div>

            {/* Lifetime High-Level Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 bg-pink-50 rounded-2xl border border-pink-100">
                <div className="text-2xl font-extrabold text-pink-700 font-['Fredoka']">
                  {formatHoursAndMins(profile.totalReadingMinutes || 0)}
                </div>
                <div className="text-xs text-pink-800 font-bold">Total Time Read</div>
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
                  {profile.readingStreak || 0}
                </div>
                <div className="text-xs text-orange-800 font-bold">Reading Streak</div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="text-2xl font-extrabold text-emerald-700 font-['Fredoka']">
                  {allWords.filter((w) => w.sourceType === 'reading' || w.source === 'reading').length}
                </div>
                <div className="text-xs text-emerald-800 font-bold">Words Discovered</div>
              </div>
            </div>

            {/* TAB 1: SESSIONS LOG */}
            {historyTab === 'sessions' && (
              <div className="space-y-4 pt-2">
                <h3 className="text-base font-bold text-slate-800 font-['Fredoka'] flex items-center gap-2">
                  <span>⏱️ Recent Reading Sessions</span>
                  <span className="text-xs text-slate-400 font-normal">
                    (Click a session to view words discovered)
                  </span>
                </h3>

                {readingSessions.length === 0 ? (
                  <div className="text-center py-10 px-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <p className="text-sm font-bold text-slate-600">No reading sessions logged yet.</p>
                    <p className="text-xs text-slate-400 mt-1">Start your first 15-minute reading session today!</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {readingSessions.map((session) => {
                      const isExpanded = expandedSessionId === session.id;
                      const hasWords = session.wordsDiscovered && session.wordsDiscovered.length > 0;

                      return (
                        <div
                          key={session.id}
                          className="rounded-2xl border border-slate-200 overflow-hidden bg-white hover:border-slate-300 transition-colors"
                        >
                          <div
                            onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                            className="p-4 flex items-center justify-between gap-3 cursor-pointer"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-800 font-['Fredoka'] text-sm sm:text-base truncate">
                                  {session.bookTitle}
                                </span>
                                {session.goalCompleted && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                                    ✓ Goal Reached
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">
                                {session.date} • <strong>{session.minutesRead} minutes read</strong>
                                {session.pausedSeconds && session.pausedSeconds > 0 ? ` (${Math.round(session.pausedSeconds / 60)}m paused)` : ''}
                                {session.startPage && session.endPage ? ` • Pages ${session.startPage}-${session.endPage}` : ''}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {hasWords && (
                                <span className="px-2.5 py-1 rounded-full bg-pink-100 text-pink-700 font-extrabold text-xs">
                                  +{session.wordsDiscovered.length} words
                                </span>
                              )}
                              <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 font-extrabold text-xs">
                                +{session.xpEarned} XP
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </div>

                          {/* Expanded words details */}
                          {isExpanded && (
                            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
                              <h5 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
                                Words Discovered in this Session:
                              </h5>
                              {hasWords ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {session.wordsDiscovered.map((w, idx) => {
                                    const detail = session.wordsDiscoveredDetails?.find((d) => d.word.toLowerCase() === w.toLowerCase());
                                    return (
                                      <div
                                        key={idx}
                                        className="p-3 rounded-xl bg-white border border-slate-200 space-y-1"
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="font-extrabold text-slate-800 capitalize font-['Fredoka'] text-sm">
                                            {w}
                                          </span>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              sound.speak(w);
                                            }}
                                            className="p-1 rounded-full hover:bg-slate-100 text-pink-600"
                                          >
                                            <Volume2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                        {detail?.definition && (
                                          <p className="text-xs text-slate-600 line-clamp-2">
                                            {detail.simpleDefinition || detail.definition}
                                          </p>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-400 italic">No new words recorded during this session.</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: WEEKLY READING PROGRESS */}
            {historyTab === 'weekly' && (
              <div className="space-y-5 pt-2">
                {/* Weekly Growth Highlight Banner */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-xs uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4" />
                    <span>Weekly Habit Dashboard</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-800 font-['Fredoka']">
                    You're building an inspiring reading habit!
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Regular physical book reading strengthens comprehension, expands your vocabulary, and builds calm, focused attention.
                  </p>

                  {/* 7-Day Weekday Completion Row */}
                  <div className="pt-2">
                    <div className="text-xs font-bold text-slate-500 mb-2">Days Read This Week ({weeklyStats.daysRead}/7 Days):</div>
                    <div className="grid grid-cols-7 gap-2 text-center">
                      {weeklyStats.dayLabels.map((day, idx) => {
                        const isToday = idx === weeklyStats.currentDayIdx;
                        const isReadDay = idx < weeklyStats.daysRead;

                        return (
                          <div
                            key={day}
                            className={`p-2.5 rounded-2xl border-2 transition-all ${
                              isReadDay
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-extrabold'
                                : isToday
                                ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                          >
                            <div className="text-xs">{day}</div>
                            <div className="text-sm mt-0.5">
                              {isReadDay ? '✓' : isToday ? '⭐' : '○'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 4 Weekly Breakdown Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 text-center">
                    <div className="text-xl font-extrabold text-indigo-700 font-['Fredoka']">
                      {weeklyStats.totalMinutes} min
                    </div>
                    <div className="text-xs text-slate-500 font-bold mt-0.5">Time Read This Week</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 text-center">
                    <div className="text-xl font-extrabold text-pink-700 font-['Fredoka']">
                      {weeklyStats.totalWords}
                    </div>
                    <div className="text-xs text-slate-500 font-bold mt-0.5">Words Discovered</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 text-center">
                    <div className="text-xl font-extrabold text-purple-700 font-['Fredoka']">
                      {weeklyStats.avgLength} min
                    </div>
                    <div className="text-xs text-slate-500 font-bold mt-0.5">Average Session</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 text-center">
                    <div className="text-xl font-extrabold text-amber-600 font-['Fredoka']">
                      {weeklyStats.longestSession} min
                    </div>
                    <div className="text-xs text-slate-500 font-bold mt-0.5">Longest Session</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: WORD DISCOVERY / + ADD A WORD ================= */}
      {/* Pauses active timer automatically while open! */}
      {showWordDiscoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-pink-200 space-y-5 text-left relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs mb-1">
                  <span>⏸️ Timer Paused</span>
                  <span>•</span>
                  <span>Word Discovery</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-['Fredoka']">
                  Add a Word While Reading
                </h3>
              </div>
              <button
                onClick={handleCloseWordModal}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Notice a new, curious, or beautiful word? Add it here. It will be added to your master vocabulary for flashcards, spelling, and review!
            </p>

            {/* Word Input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Word *
              </label>
              <input
                id="discovery-word-input"
                type="text"
                autoFocus
                value={discoveryWordInput}
                onChange={(e) => {
                  setDiscoveryWordInput(e.target.value);
                  if (e.target.value.trim().length > 2) {
                    setPreviewWordLookup(lookupOrGenerateWordDetails(e.target.value, discoveryContextInput));
                  } else {
                    setPreviewWordLookup(null);
                  }
                }}
                placeholder="e.g. Dispensation, Prudence, Magnificent..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none text-base font-bold text-slate-800 font-['Fredoka']"
              />
            </div>

            {/* Where did you find it? Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Where did you find it?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'book', label: '📖 My Book' },
                  { id: 'bible', label: '✝️ Bible' },
                  { id: 'article', label: '📰 Article' },
                  { id: 'other', label: '✨ Other' }
                ].map((src) => (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => setDiscoverySourceType(src.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                      discoverySourceType === src.id
                        ? 'bg-pink-50 border-pink-500 text-pink-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {src.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Sentence Context */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Optional Context (Sentence or phrase)
              </label>
              <input
                type="text"
                value={discoveryContextInput}
                onChange={(e) => setDiscoveryContextInput(e.target.value)}
                placeholder="e.g. 'He showed great prudence in making his decision.'"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-pink-500 focus:outline-none text-xs font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Typing the author's sentence helps your memory lock in the meaning!
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

            {/* Live Preview with Sounding-Out Pronunciation */}
            {previewWordLookup && (
              <div className="p-4 rounded-2xl bg-pink-50/80 border border-pink-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-pink-900 font-['Fredoka'] capitalize text-sm">
                      {previewWordLookup.word}
                    </span>
                    <span className="font-mono text-pink-700 font-bold text-[11px] bg-white/80 px-2 py-0.5 rounded-full border border-pink-200">
                      {formatSoundingOutPronunciation(previewWordLookup.word, previewWordLookup.pronunciation)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => sound.speak(previewWordLookup.word)}
                    className="p-1 rounded-full bg-white text-pink-600 hover:bg-pink-100 shadow-xs cursor-pointer"
                    title="Hear Pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-700 font-medium">
                  <strong>Meaning:</strong> {previewWordLookup.simpleMeaning || previewWordLookup.simpleDefinition}
                </p>
                {previewWordLookup.isBibleWord && previewWordLookup.scriptureReference && (
                  <p className="text-indigo-700 text-[11px] font-semibold">
                    ✝️ Scripture Reference: {previewWordLookup.scriptureReference}
                  </p>
                )}
              </div>
            )}

            {/* Actions: Save & Continue Reading vs Cancel */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <button
                id="save-and-continue-reading-btn"
                onClick={handleSaveWordAndResume}
                disabled={!discoveryWordInput.trim()}
                className="w-full sm:flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 text-white font-extrabold text-sm shadow-md shadow-pink-200 transition-all cursor-pointer flex items-center justify-center gap-2 font-['Fredoka']"
              >
                <span>Save & Continue Reading</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleCloseWordModal}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

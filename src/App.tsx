import React, { useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  VocabWord,
  BibleWord,
  ReadingStory,
  GardenPlot,
  GardenPet,
  AchievementBadge,
  WeeklyAssessmentResult,
  AppSection,
  ReadingSession,
  BookRecord,
  ThemeId,
  LearningLevel,
  DailyGoalConfig,
  TodayActivityProgress
} from './types';
import {
  loadProfile,
  saveProfile,
  loadWords,
  saveWords,
  loadGardenPlots,
  saveGardenPlots,
  loadGardenPets,
  saveGardenPets,
  loadBadges,
  saveBadges,
  loadAssessments,
  saveAssessments,
  loadStories,
  saveStories,
  loadBibleWords,
  saveBibleWords,
  loadReadingSessions,
  saveReadingSessions,
  loadBooks,
  saveBooks,
  triggerCelebrationConfetti,
  triggerSparkleConfetti
} from './utils/storage';
import { getAdaptiveDailyWords } from './utils/adaptive';
import { getOrAssignDaily3Words } from './services/dailyWordsService';
import { sound } from './utils/audio';
import { getThemeConfig } from './data/themes';
import { getTodayActivity } from './utils/dailyLearningHelper';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { DailyAdventure } from './components/DailyAdventure';
import { LearningPath } from './components/LearningPath';
import { SpellingAdventure } from './components/SpellingAdventure';
import { ReadingRoom } from './components/ReadingRoom';
import { FlowerGarden } from './components/FlowerGarden';
import { FaithGarden } from './components/FaithGarden';
import { ReviewGarden } from './components/ReviewGarden';
import { WeeklyCheck } from './components/WeeklyCheck';
import { ParentDashboard } from './components/ParentDashboard';
import { BadgesModal } from './components/BadgesModal';
import { ReadingAdventure } from './components/ReadingAdventure';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { HomeworkWordsModal } from './components/HomeworkWordsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { DailyTracker } from './components/DailyTracker';
import { FlashcardCenter } from './components/FlashcardCenter';
import { TrueSpellingTest } from './components/TrueSpellingTest';
import { DiscoverLearningPath } from './components/DiscoverLearningPath';
import { LearningHome } from './components/LearningHome';
import { WorldExplorer } from './components/world/WorldExplorer';
import { LearnSection } from './components/LearnSection';
import { PracticeSection } from './components/PracticeSection';
import { TestSection } from './components/TestSection';
import { StartingAssessmentResult } from './types';

// Firebase & Cloud Accounts Integration
import { AuthProvider, useAuth } from './context/AuthContext';
import { syncService } from './services/syncService';
import { AuthModal } from './components/auth/AuthModal';
import { AuthLandingScreen } from './components/auth/AuthLandingScreen';
import { ProfileSelectionScreen } from './components/auth/ProfileSelectionScreen';
import { WelcomeBackScreen } from './components/auth/WelcomeBackScreen';
import { DiscoveryAssessmentModal } from './components/auth/DiscoveryAssessmentModal';
import { ParentGateModal } from './components/auth/ParentGateModal';
import { OfflineIndicator } from './components/OfflineIndicator';

function MainAppContent() {
  const {
    user,
    isGuest,
    isCloudActive,
    syncStatus,
    profiles,
    activeProfile,
    switchProfile,
    updateActiveProfile,
    createProfile,
    startGuestMode,
    signOutUser,
    isLoading
  } = useAuth();

  // Local state for learning data
  const [words, setWords] = useState<VocabWord[]>(loadWords);
  const [bibleWords, setBibleWords] = useState<BibleWord[]>(loadBibleWords);
  const [stories, setStories] = useState<ReadingStory[]>(loadStories);
  const [gardenPlots, setGardenPlots] = useState<GardenPlot[]>(loadGardenPlots);
  const [gardenPets, setGardenPets] = useState<GardenPet[]>(loadGardenPets);
  const [badges, setBadges] = useState<AchievementBadge[]>(loadBadges);
  const [assessments, setAssessments] = useState<WeeklyAssessmentResult[]>(loadAssessments);
  const [readingSessions, setReadingSessions] = useState<ReadingSession[]>(loadReadingSessions);
  const [books, setBooks] = useState<BookRecord[]>(loadBooks);

  // Active view navigation
  const [activeSection, setActiveSection] = useState<AppSection>('learn');

  // Modals & Screen States
  const [showWelcomeBack, setShowWelcomeBack] = useState<boolean>(() => {
    // Show welcoming screen if student has previous activity
    return activeProfile.streak > 0 || activeProfile.totalReadingMinutes > 0 || activeProfile.xp > 0;
  });
  const [showProfileSwitcher, setShowProfileSwitcher] = useState<boolean>(false);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState<boolean>(false);
  const [showParentGate, setShowParentGate] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [showHomeworkModal, setShowHomeworkModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Active theme configuration
  const currentTheme = getThemeConfig(activeProfile.theme);

  // Load cloud data whenever active profile or user changes
  useEffect(() => {
    const loadCloudData = async () => {
      if (!user || !activeProfile.id) return;

      try {
        const cloudWords = await syncService.loadWordsCloud(user.uid, activeProfile.id);
        if (cloudWords && cloudWords.length > 0) {
          setWords(cloudWords);
          saveWords(cloudWords);
        }

        const readingData = await syncService.loadReadingDataCloud(user.uid, activeProfile.id);
        if (readingData) {
          if (readingData.sessions.length > 0) {
            setReadingSessions(readingData.sessions);
            saveReadingSessions(readingData.sessions);
          }
          if (readingData.books.length > 0) {
            setBooks(readingData.books);
            saveBooks(readingData.books);
          }
        }

        const cloudAssessments = await syncService.loadAssessmentsCloud(user.uid, activeProfile.id);
        if (cloudAssessments && cloudAssessments.length > 0) {
          setAssessments(cloudAssessments);
          saveAssessments(cloudAssessments);
        }

        const cloudWorld = await syncService.loadWorldDataCloud(user.uid, activeProfile.id);
        if (cloudWorld) {
          if (cloudWorld.plots.length > 0) {
            setGardenPlots(cloudWorld.plots);
            saveGardenPlots(cloudWorld.plots);
          }
          if (cloudWorld.badges.length > 0) {
            setBadges(cloudWorld.badges);
            saveBadges(cloudWorld.badges);
          }
        }
      } catch (e) {
        console.warn('Error loading cloud data for profile:', e);
      }
    };

    loadCloudData();
  }, [user, activeProfile.id]);

  // First-Time Discovery Check
  useEffect(() => {
    if (!activeProfile.initialAssessmentCompleted && activeProfile.xp === 0) {
      // Delay slightly for smooth entering
      const timer = setTimeout(() => {
        setShowDiscoveryModal(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [activeProfile.initialAssessmentCompleted, activeProfile.xp]);

  // Local storage auto-sync on local change
  useEffect(() => {
    saveWords(words);
    if (user && activeProfile.id) {
      syncService.scheduleAutoSync(async () => {
        await syncService.saveWordsCloud(user.uid, activeProfile.id!, words);
      }, 1500);
    }
  }, [words, user, activeProfile.id]);

  useEffect(() => {
    saveReadingSessions(readingSessions);
    saveBooks(books);
    if (user && activeProfile.id) {
      syncService.scheduleAutoSync(async () => {
        await syncService.saveReadingSessionsCloud(user.uid, activeProfile.id!, readingSessions, books);
      }, 1500);
    }
  }, [readingSessions, books, user, activeProfile.id]);

  useEffect(() => {
    saveAssessments(assessments);
    if (user && activeProfile.id) {
      syncService.scheduleAutoSync(async () => {
        await syncService.saveAssessmentsCloud(user.uid, activeProfile.id!, assessments);
      }, 1500);
    }
  }, [assessments, user, activeProfile.id]);

  useEffect(() => {
    saveGardenPlots(gardenPlots);
    saveBadges(badges);
    if (user && activeProfile.id) {
      syncService.scheduleAutoSync(async () => {
        await syncService.saveWorldDataCloud(user.uid, activeProfile.id!, gardenPlots, badges);
      }, 2000);
    }
  }, [gardenPlots, badges, user, activeProfile.id]);

  useEffect(() => {
    saveStories(stories);
  }, [stories]);

  useEffect(() => {
    saveBibleWords(bibleWords);
  }, [bibleWords]);

  useEffect(() => {
    saveGardenPets(gardenPets);
  }, [gardenPets]);

  // Automatically assign and derive Today's 3 Words
  const dailyThreeResult = getOrAssignDaily3Words(words);
  const dailyWords = dailyThreeResult.dailyWords.length > 0
    ? dailyThreeResult.dailyWords
    : getAdaptiveDailyWords(words, 3);

  // Automatically integrate newly assigned Daily 3 words into the learner's vocabulary state
  useEffect(() => {
    if (dailyThreeResult.newWordsAddedToVocab.length > 0) {
      setWords((prev) => {
        const next = [...prev];
        let hasChanges = false;
        dailyThreeResult.newWordsAddedToVocab.forEach((nw) => {
          const exists = next.some(
            (w) => w.id === nw.id || w.word.trim().toLowerCase() === nw.word.trim().toLowerCase()
          );
          if (!exists) {
            next.unshift(nw);
            hasChanges = true;
          }
        });
        return hasChanges ? next : prev;
      });
    }
  }, [dailyThreeResult.newWordsAddedToVocab]);
  const dailyBibleWord = bibleWords[0] || {
    id: 'shalom',
    word: 'Shalom',
    pronunciation: 'sha-LOME',
    childDefinition: 'Deep peace and harmony from God.',
    scriptureReference: 'Numbers 6:24-26',
    scriptureVerse: 'The Lord turn his face toward you and give you peace.',
    realLifeExample: 'When you take a deep breath and share a kind smile.',
    quickChallenges: [],
    mastered: true,
    timesPracticed: 3
  };

  // Profile XP & LearningCoins Handlers
  const handleAddXp = (amount: number) => {
    const newXp = activeProfile.xp + amount;
    const newLevel = Math.floor(newXp / 100) + 1;
    // Earn 1 LearningCoin per 2 XP (minimum 1 coin) for educational achievements!
    const coinsEarned = Math.max(1, Math.round(amount * 0.5));
    const currentCoins = typeof activeProfile.learningCoins === 'number' ? activeProfile.learningCoins : 350;
    const newCoins = currentCoins + coinsEarned;
    updateActiveProfile({
      xp: newXp,
      level: newLevel,
      learningCoins: newCoins
    });
  };

  const handleAddCoins = (amount: number) => {
    const currentCoins = typeof activeProfile.learningCoins === 'number' ? activeProfile.learningCoins : 350;
    const newCoins = currentCoins + amount;
    updateActiveProfile({
      learningCoins: newCoins
    });
  };

  // Toggle Sound Setting
  const handleToggleSound = () => {
    const updated = !activeProfile.soundEnabled;
    sound.setSoundEnabled(updated);
    updateActiveProfile({ soundEnabled: updated });
  };

  // Word Progress Handler (Spaced repetition engine)
  const handleUpdateWordScore = (targetWord: VocabWord, isCorrect: boolean) => {
    // Update daily activity words count
    const currentActivity = getTodayActivity(activeProfile);
    updateActiveProfile({
      todayActivity: {
        ...currentActivity,
        wordsLearned: currentActivity.wordsLearned + 1
      }
    });

    setWords((prev) =>
      prev.map((w) => {
        if (w.id !== targetWord.id) return w;

        const newPracticed = w.timesPracticed + 1;
        const newCorrect = isCorrect ? w.correctCount + 1 : w.correctCount;
        const newIncorrect = !isCorrect ? w.incorrectCount + 1 : w.incorrectCount;

        let newMastery = w.masteryLevel;
        let isMastered = w.mastered;

        if (newCorrect >= 4 && newIncorrect === 0) {
          newMastery = 'mastered';
          isMastered = true;
        } else if (newCorrect >= 3) {
          newMastery = 'almost_mastered';
        } else if (newCorrect >= 1) {
          newMastery = 'growing';
        } else if (newIncorrect > 0) {
          newMastery = 'learning';
        }

        return {
          ...w,
          timesPracticed: newPracticed,
          correctCount: newCorrect,
          incorrectCount: newIncorrect,
          masteryLevel: newMastery,
          mastered: isMastered,
          lastPracticedDate: new Date().toISOString().split('T')[0]
        };
      })
    );
  };

  // Daily Goals customization handler
  const handleUpdateDailyGoals = (newGoals: DailyGoalConfig) => {
    updateActiveProfile({
      dailyGoals: newGoals,
      dailyReadingGoalMinutes: newGoals.readingMinutes
    });
  };

  // Flashcards reviewed handler
  const handleFlashcardReviewed = (count: number = 1) => {
    const currentActivity = getTodayActivity(activeProfile);
    updateActiveProfile({
      todayActivity: {
        ...currentActivity,
        flashcardsReviewed: currentActivity.flashcardsReviewed + count
      }
    });
  };

  // Spelling test completed count handler
  const handleSpellingCompleted = (count: number = 1) => {
    const currentActivity = getTodayActivity(activeProfile);
    updateActiveProfile({
      todayActivity: {
        ...currentActivity,
        spellingCompleted: currentActivity.spellingCompleted + count
      }
    });
  };

  // True Spelling Test performance handler (learning vs testing separation)
  const handleUpdateSpellingScore = (
    targetWord: VocabWord,
    isCorrect: boolean,
    isIndependentTest: boolean
  ) => {
    setWords((prev) =>
      prev.map((w) => {
        if (w.id !== targetWord.id) return w;

        const newSpellingAttempts = (w.spellingAttempts || 0) + 1;
        const newSpellingCorrect = isCorrect
          ? (w.spellingCorrectAttempts || 0) + 1
          : (w.spellingCorrectAttempts || 0);

        let newTestAttempts = w.spellingTrueTestAttempts || 0;
        let newTestCorrect = w.spellingTrueTestCorrect || 0;
        let newMasteryStage = w.spellingMasteryStage || 'introduced';

        if (isIndependentTest) {
          newTestAttempts += 1;
          if (isCorrect) {
            newTestCorrect += 1;
            if (newTestCorrect >= 3) {
              newMasteryStage = 'mastered';
            } else if (newTestCorrect >= 2) {
              newMasteryStage = 'growing';
            } else {
              newMasteryStage = 'testing';
            }
          } else {
            newMasteryStage = 'studying';
          }
        }

        return {
          ...w,
          spellingAttempts: newSpellingAttempts,
          spellingCorrectAttempts: newSpellingCorrect,
          spellingTrueTestAttempts: newTestAttempts,
          spellingTrueTestCorrect: newTestCorrect,
          spellingMasteryStage: newMasteryStage,
          needsReview: !isCorrect,
          lastSpellingTestDate: new Date().toISOString().split('T')[0]
        };
      })
    );
  };

  // Add a newly discovered word or update existing entry without creating duplicates
  const handleAddNewWord = (newWord: VocabWord) => {
    const today = new Date().toISOString().split('T')[0];
    setWords((prev) => {
      const cleanTarget = newWord.word.trim().toLowerCase();
      const existingIdx = prev.findIndex((w) => w.word.trim().toLowerCase() === cleanTarget);

      if (existingIdx >= 0) {
        const existing = prev[existingIdx];
        const updated: VocabWord = {
          ...existing,
          timesSeen: (existing.timesSeen || existing.timesPracticed || 1) + 1,
          readingOccurrences: (existing.readingOccurrences || 0) + (newWord.sourceType === 'reading' ? 1 : 0),
          lastSeen: today,
          lastPracticedDate: existing.lastPracticedDate || today,
          context: newWord.context || existing.context,
          contextSentence: newWord.contextSentence || existing.contextSentence,
          bookTitle: newWord.bookTitle || existing.bookTitle,
          bookAuthor: newWord.bookAuthor || existing.bookAuthor,
          bookPage: newWord.bookPage || existing.bookPage,
          scriptureReference: newWord.scriptureReference || existing.scriptureReference,
          bibleContext: newWord.bibleContext || existing.bibleContext,
          isBibleWord: existing.isBibleWord || newWord.isBibleWord,
          notes: newWord.notes || existing.notes,
          definition:
            (existing.definitionUnavailable || !existing.definition || existing.definition.includes('discovered during reading')) &&
            newWord.definition &&
            !newWord.definitionUnavailable
              ? newWord.definition
              : existing.definition,
          simpleDefinition: newWord.simpleDefinition || existing.simpleDefinition,
          simpleMeaning: newWord.simpleMeaning || existing.simpleMeaning || newWord.simpleDefinition,
          definitionUnavailable:
            newWord.definitionUnavailable !== undefined
              ? existing.definitionUnavailable && !newWord.definitionUnavailable
                ? false
                : existing.definitionUnavailable
              : existing.definitionUnavailable,
          pronunciation: newWord.pronunciation || existing.pronunciation
        };

        const next = [...prev];
        next[existingIdx] = updated;
        return next;
      }

      return [newWord, ...prev];
    });
    handleAddXp(20);
    sound.playBloomSparkle();
    triggerCelebrationConfetti();
  };

  // Add multiple homework words without creating duplicate entries
  const handleAddHomeworkWords = (newWords: VocabWord[]) => {
    const today = new Date().toISOString().split('T')[0];
    setWords((prev) => {
      let current = [...prev];
      for (const newWord of newWords) {
        const cleanTarget = newWord.word.trim().toLowerCase();
        const existingIdx = current.findIndex((w) => w.word.trim().toLowerCase() === cleanTarget);
        if (existingIdx >= 0) {
          const existing = current[existingIdx];
          current[existingIdx] = {
            ...existing,
            timesSeen: (existing.timesSeen || existing.timesPracticed || 1) + 1,
            lastSeen: today,
            isHomework: true,
            homeworkTag: newWord.homeworkTag || existing.homeworkTag,
            definition:
              (existing.definitionUnavailable || !existing.definition) && newWord.definition
                ? newWord.definition
                : existing.definition,
            simpleDefinition: newWord.simpleDefinition || existing.simpleDefinition
          };
        } else {
          current = [newWord, ...current];
        }
      }
      return current;
    });
  };

  // Reading Session Completed Handler
  const handleReadingSessionComplete = (session: ReadingSession) => {
    setReadingSessions((prev) => [session, ...prev]);

    // Update book collection
    setBooks((prev) => {
      const existingIndex = prev.findIndex(
        (b) => b.title.toLowerCase() === session.bookTitle.toLowerCase()
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        const current = updated[existingIndex];
        updated[existingIndex] = {
          ...current,
          totalMinutesRead: current.totalMinutesRead + session.minutesRead,
          sessionsCount: current.sessionsCount + 1,
          wordsDiscoveredCount: current.wordsDiscoveredCount + session.wordsDiscovered.length,
          lastReadDate: new Date().toISOString().split('T')[0]
        };
        return updated;
      } else {
        const newBook: BookRecord = {
          id: `book-${Date.now()}`,
          title: session.bookTitle,
          author: session.bookAuthor,
          totalMinutesRead: session.minutesRead,
          sessionsCount: 1,
          wordsDiscoveredCount: session.wordsDiscovered.length,
          status: 'reading',
          lastReadDate: new Date().toISOString().split('T')[0]
        };
        return [newBook, ...prev];
      }
    });

    // Update profile reading streak & total minutes
    const todayStr = new Date().toISOString().split('T')[0];
    const isNewDay = activeProfile.lastReadingDate !== todayStr;
    const newStreak = isNewDay ? activeProfile.readingStreak + 1 : activeProfile.readingStreak;

    const currentActivity = getTodayActivity(activeProfile);
    const updatedActivity = {
      ...currentActivity,
      readingMinutes: currentActivity.readingMinutes + session.minutesRead
    };

    // Reset character animation to idle if in learning home
    const updatedHomeState = activeProfile.learningHomeState?.character
      ? {
          ...activeProfile.learningHomeState,
          character: {
            ...activeProfile.learningHomeState.character,
            animation: 'idle' as const
          }
        }
      : activeProfile.learningHomeState;

    updateActiveProfile({
      totalReadingMinutes: activeProfile.totalReadingMinutes + session.minutesRead,
      totalReadingSessions: activeProfile.totalReadingSessions + 1,
      readingStreak: newStreak,
      longestReadingStreak: Math.max(activeProfile.longestReadingStreak, newStreak),
      lastReadingDate: todayStr,
      todayActivity: updatedActivity,
      learningHomeState: updatedHomeState
    });
  };

  const handleReadingStateChange = useCallback((isReading: boolean) => {
    const targetAnim = isReading ? ('reading' as const) : ('idle' as const);
    if (activeProfile.learningHomeState?.character) {
      if (activeProfile.learningHomeState.character.animation === targetAnim) {
        return;
      }
      updateActiveProfile({
        learningHomeState: {
          ...activeProfile.learningHomeState,
          character: {
            ...activeProfile.learningHomeState.character,
            animation: targetAnim
          }
        }
      });
    }
  }, [activeProfile.learningHomeState, updateActiveProfile]);

  // Garden Water Handler
  const handleWaterPlot = (plotId: string) => {
    setGardenPlots((prev) =>
      prev.map((plot) => {
        if (plot.id === plotId) {
          const nextStage = Math.min(plot.maxStage, plot.currentStage + 1);
          const isNowMastered = nextStage >= plot.maxStage;
          return {
            ...plot,
            currentStage: nextStage,
            isMastered: isNowMastered,
            lastWateredDate: new Date().toISOString().split('T')[0]
          };
        }
        return plot;
      })
    );
  };

  // Advance next unmastered flower plot
  const handleAdvanceGarden = () => {
    const unmastered = gardenPlots.find((p) => p.unlocked && !p.isMastered);
    if (unmastered) {
      handleWaterPlot(unmastered.id);
    }
  };

  // Story completion
  const handleStoryCompleted = (storyId: string, score: number) => {
    setStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          return {
            ...s,
            completed: true,
            bestScore: Math.max(s.bestScore || 0, score)
          };
        }
        return s;
      })
    );
  };

  // Bible Progress
  const handleUpdateBibleProgress = (wordId: string, mastered: boolean) => {
    setBibleWords((prev) =>
      prev.map((b) => {
        if (b.id === wordId) {
          return {
            ...b,
            timesPracticed: b.timesPracticed + 1,
            mastered: mastered || b.mastered
          };
        }
        return b;
      })
    );
  };

  // Weekly Assessment Saving
  const handleSaveAssessment = (result: WeeklyAssessmentResult) => {
    setAssessments((prev) => [result, ...prev]);
  };

  // Section Navigation with Parent Gate check
  const handleNavigateSection = (sec: AppSection) => {
    if (sec === 'parent_dashboard') {
      setShowParentGate(true);
    } else {
      setActiveSection(sec);
    }
  };

  // Discovery Assessment Completion
  const handleDiscoveryComplete = (level: LearningLevel, xpEarned: number) => {
    setShowDiscoveryModal(false);
    updateActiveProfile({
      initialAssessmentCompleted: true,
      learningLevel: level,
      startingLevelAssessed: level,
      xp: activeProfile.xp + xpEarned
    });
    sound.playLevelUpFanfare();
    triggerCelebrationConfetti();
  };

  // Starting Assessment & Personalized Learning Placement
  const handleSaveStartingAssessment = (result: StartingAssessmentResult) => {
    const previousHistory = activeProfile.startingAssessmentHistory || [];
    const updatedHistory = activeProfile.startingAssessment
      ? [activeProfile.startingAssessment, ...previousHistory]
      : previousHistory;

    updateActiveProfile({
      initialAssessmentCompleted: true,
      startingAssessment: result,
      startingAssessmentHistory: updatedHistory,
      assessmentSaveState: undefined,
      dailyGoals: result.recommendedGoals,
      dailyReadingGoalMinutes: result.recommendedGoals.readingMinutes
    });
    sound.playLevelUpFanfare();
    triggerCelebrationConfetti();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-indigo-50 font-['Quicksand']">
        <div className="w-16 h-16 rounded-3xl bg-white shadow-lg flex items-center justify-center text-4xl mb-3 animate-bounce">
          🌸
        </div>
        <p className="text-sm font-bold text-pink-600">Loading BloomWord Adventure...</p>
      </div>
    );
  }

  if (!user && !isGuest) {
    return (
      <AuthLandingScreen
        onGuestStart={(name, avatar, theme) => {
          startGuestMode(name, avatar, theme);
        }}
      />
    );
  }

  return (
    <div
      className={`min-h-screen ${currentTheme.bgGradient} text-slate-800 font-['Quicksand'] selection:bg-pink-200 selection:text-pink-900 pb-16 transition-colors duration-500`}
    >
      {/* Top Main Navigation Bar */}
      <Navbar
        profile={activeProfile}
        activeSection={activeSection}
        onSelectSection={handleNavigateSection}
        onOpenThemes={() => {
          sound.playPop();
          setShowThemeModal(true);
        }}
        onOpenHomework={() => {
          sound.playPop();
          setShowHomeworkModal(true);
        }}
        onOpenProfile={() => {
          sound.playPop();
          setShowProfileModal(true);
        }}
        onOpenBadges={() => {
          sound.playPop();
          setShowBadgesModal(true);
        }}
        onToggleSound={handleToggleSound}
        syncStatus={syncStatus}
        isCloudActive={isCloudActive}
        isGuest={isGuest}
        onSignOut={signOutUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onSwitchProfiles={() => setShowProfileSwitcher(true)}
      />

      {/* Main View Router */}
      <main className="transition-all duration-300">
        
        {/* Child-Friendly "Welcome Back!" Returning Student Screen */}
        {showWelcomeBack ? (
          <WelcomeBackScreen
            profile={activeProfile}
            words={words}
            onContinue={() => {
              setShowWelcomeBack(false);
              setActiveSection('learn');
            }}
            onSwitchProfile={() => {
              setShowWelcomeBack(false);
              setShowProfileSwitcher(true);
            }}
          />
        ) : showProfileSwitcher ? (
          /* Multi-Student Profiles "Who's Learning Today?" Family Screen */
          <ProfileSelectionScreen
            profiles={profiles}
            activeProfileId={activeProfile.id}
            onSelectProfile={async (id) => {
              await switchProfile(id);
              setShowProfileSwitcher(false);
              setActiveSection('learn');
            }}
            onAddNewProfile={async (data) => {
              await createProfile(data);
              setShowProfileSwitcher(false);
              setActiveSection('learn');
            }}
            onOpenParentArea={() => {
              setShowProfileSwitcher(false);
              setShowParentGate(true);
            }}
          />
        ) : (
          <>
            {/* 1. LEARN (Primary Educational Core) */}
            {(activeSection === 'learn' || activeSection === 'home') && (
              <LearnSection
                profile={activeProfile}
                vocabWords={words}
                bibleWords={bibleWords}
                onSelectSection={handleNavigateSection}
                onUpdateWordScore={handleUpdateWordScore}
                onAddNewWord={handleAddNewWord}
                onAddXp={handleAddXp}
                onOpenHomework={() => setShowHomeworkModal(true)}
                onOpenThemes={() => setShowThemeModal(true)}
              />
            )}

            {/* 2. READ (15-Min Reading Companion & Word Discovery) */}
            {(activeSection === 'read' || activeSection === 'reading_adventure') && (
              <ReadingAdventure
                profile={activeProfile}
                allWords={words}
                readingSessions={readingSessions}
                books={books}
                onAddNewWord={handleAddNewWord}
                onSessionComplete={handleReadingSessionComplete}
                onAddXp={handleAddXp}
                onAddCoins={handleAddCoins}
                onReadingStateChange={handleReadingStateChange}
                onBackToHome={() => setActiveSection('learn')}
              />
            )}

            {/* 3. PRACTICE (Focused Modes: Flashcards, Spelling, Pronunciation, Challenges, Quiz) */}
            {activeSection === 'practice' && (
              <PracticeSection
                words={words}
                profile={activeProfile}
                onSelectSection={handleNavigateSection}
                onUpdateWordScore={handleUpdateWordScore}
                onAddXp={handleAddXp}
                onOpenHomework={() => setShowHomeworkModal(true)}
              />
            )}

            {/* 4. TEST (Weekly Assessment, Baseline Placement, Meaningful Results) */}
            {activeSection === 'test' && (
              <TestSection
                allWords={words}
                bibleWords={bibleWords}
                profile={activeProfile}
                assessmentHistory={assessments}
                onSaveAssessment={handleSaveAssessment}
                onAddXp={handleAddXp}
                onSelectSection={handleNavigateSection}
              />
            )}

            {/* 5. MY HOME (Reward World, Character & Room Customization) */}
            {(activeSection === 'my_home' || activeSection === 'learning_home') && (
              <LearningHome
                profile={activeProfile}
                words={words}
                readingSessions={readingSessions}
                onSelectSection={handleNavigateSection}
                onUpdateProfile={updateActiveProfile}
              />
            )}

            {/* 6. WORLD EXPLORATION (Connected World Map) */}
            {activeSection === 'explore' && (
              <WorldExplorer
                profile={activeProfile}
                onSelectSection={handleNavigateSection}
              />
            )}

            {/* 7. WORLD BOUTIQUE & SHOP */}
            {activeSection === 'shop' && (
              <LearningHome
                profile={activeProfile}
                words={words}
                readingSessions={readingSessions}
                initialMainView="shop"
                onSelectSection={handleNavigateSection}
                onUpdateProfile={updateActiveProfile}
              />
            )}

            {activeSection === 'starting_assessment' && (
              <div className="max-w-5xl mx-auto px-4 py-6">
                <DiscoverLearningPath
                  profile={activeProfile}
                  onSaveAssessment={handleSaveStartingAssessment}
                  onUpdateGoals={handleUpdateDailyGoals}
                  onSelectSection={handleNavigateSection}
                  onClose={() => setActiveSection('learn')}
                />
              </div>
            )}

            {activeSection === 'daily_tracker' && (
              <div className="max-w-5xl mx-auto px-4 py-6">
                <DailyTracker
                  profile={activeProfile}
                  vocabWords={words}
                  onSelectSection={handleNavigateSection}
                  onUpdateGoals={handleUpdateDailyGoals}
                />
              </div>
            )}

            {activeSection === 'flashcards' && (
              <FlashcardCenter
                words={words}
                profile={activeProfile}
                onUpdateWordScore={handleUpdateWordScore}
                onAddXp={handleAddXp}
                onFlashcardReviewed={handleFlashcardReviewed}
                onBackToHome={() => setActiveSection('learn')}
              />
            )}

            {activeSection === 'spelling_test' && (
              <TrueSpellingTest
                words={words}
                profile={activeProfile}
                onUpdateSpellingScore={handleUpdateSpellingScore}
                onAddXp={handleAddXp}
                onSpellingCompleted={handleSpellingCompleted}
                onBackToHome={() => setActiveSection('learn')}
              />
            )}

            {activeSection === 'daily_adventure' && (
              <DailyAdventure
                dailyWords={dailyWords}
                allWords={words}
                dailyBibleWord={dailyBibleWord}
                profile={activeProfile}
                onUpdateWordScore={handleUpdateWordScore}
                onAddXp={handleAddXp}
                onAdvanceGarden={handleAdvanceGarden}
                onFinishDaily={() => setActiveSection('garden')}
              />
            )}

            {activeSection === 'learning_path' && (
              <LearningPath
                profile={activeProfile}
                onSelectSection={handleNavigateSection}
              />
            )}

            {activeSection === 'spelling_adventure' && (
              <SpellingAdventure
                words={words}
                onUpdateScore={handleUpdateWordScore}
                onAddXp={handleAddXp}
              />
            )}

            {activeSection === 'reading_room' && (
              <ReadingRoom
                stories={stories}
                allWords={words}
                onAddWordToReview={handleAddNewWord}
                onStoryCompleted={handleStoryCompleted}
                onAddXp={handleAddXp}
              />
            )}

            {(activeSection === 'garden' || activeSection === 'flower_garden') && (
              <FlowerGarden
                gardenPlots={gardenPlots}
                gardenPets={gardenPets}
                profile={activeProfile}
                onWaterPlot={handleWaterPlot}
                onAddXp={handleAddXp}
              />
            )}

            {activeSection === 'faith_garden' && (
              <FaithGarden
                bibleWords={bibleWords}
                onAddXp={handleAddXp}
                onUpdateBibleProgress={handleUpdateBibleProgress}
              />
            )}

            {activeSection === 'review_garden' && (
              <ReviewGarden
                allWords={words}
                onAddNewWord={handleAddNewWord}
                onPracticeWord={() => {
                  setActiveSection('spelling_adventure');
                }}
              />
            )}

            {activeSection === 'weekly_check' && (
              <WeeklyCheck
                allWords={words}
                bibleWords={bibleWords}
                profile={activeProfile}
                assessmentHistory={assessments}
                onSaveAssessment={handleSaveAssessment}
                onAddXp={handleAddXp}
              />
            )}

            {activeSection === 'parent_dashboard' && (
              <ParentDashboard
                allWords={words}
                bibleWords={bibleWords}
                stories={stories}
                assessments={assessments}
                profile={activeProfile}
                profiles={profiles}
                onSwitchProfile={switchProfile}
                onUpdateProfile={updateActiveProfile}
                onOpenAuth={() => setShowAuthModal(true)}
                onSignOut={signOutUser}
                onSelectSection={handleNavigateSection}
                userEmail={user ? user.email : null}
                syncStatus={syncStatus}
              />
            )}
          </>
        )}
      </main>

      {/* Discovery Assessment Warmup ("🌱 Let's Discover Your Learning Path!") */}
      {showDiscoveryModal && (
        <DiscoveryAssessmentModal
          isOpen={showDiscoveryModal}
          studentName={activeProfile.name}
          onComplete={handleDiscoveryComplete}
          onSkip={() => setShowDiscoveryModal(false)}
        />
      )}

      {/* Grown-Up Parent Gate Modal */}
      {showParentGate && (
        <ParentGateModal
          isOpen={showParentGate}
          onSuccess={() => {
            setShowParentGate(false);
            setActiveSection('parent_dashboard');
          }}
          onClose={() => setShowParentGate(false)}
        />
      )}

      {/* Auth Modal (Sign In & New Account) */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            sound.playSuccessChime();
          }}
        />
      )}

      {/* Badges Modal */}
      {showBadgesModal && (
        <BadgesModal
          badges={badges}
          onClose={() => setShowBadgesModal(false)}
        />
      )}

      {/* Theme Selector Modal */}
      {showThemeModal && (
        <ThemeSelectorModal
          isOpen={showThemeModal}
          currentTheme={activeProfile.theme}
          onSelectTheme={(themeId) => updateActiveProfile({ theme: themeId })}
          onClose={() => setShowThemeModal(false)}
        />
      )}

      {/* School Homework Words Modal */}
      {showHomeworkModal && (
        <HomeworkWordsModal
          isOpen={showHomeworkModal}
          onClose={() => setShowHomeworkModal(false)}
          onAddWords={handleAddHomeworkWords}
          onAddXp={handleAddXp}
        />
      )}

      {/* Student Profile Settings Modal */}
      {showProfileModal && (
        <OnboardingModal
          isOpen={showProfileModal}
          profile={activeProfile}
          onSaveProfile={(updated) => updateActiveProfile(updated)}
          onClose={() => setShowProfileModal(false)}
          isInitialOnboarding={false}
          onStartAssessment={() => setActiveSection('starting_assessment')}
        />
      )}

      {/* Offline Connectivity Status Notification */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

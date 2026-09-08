import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Compass,
  Clock,
  Heart,
  Palette,
  ArrowRight,
  BookOpen,
  User,
  X
} from 'lucide-react';
import { UserProfile, ThemeId, LearningLevel } from '../types';
import { THEME_LIST, getThemeConfig } from '../data/themes';
import { sound } from '../utils/audio';
import { triggerCelebrationConfetti } from '../utils/storage';

interface OnboardingModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onSaveProfile: (updated: Partial<UserProfile>) => void;
  onClose: () => void;
  isInitialOnboarding?: boolean;
  onStartAssessment?: () => void;
}

const AVATAR_OPTIONS = ['🌸', '🚀', '🦊', '👑', '🐬', '🎮', '🌿', '⭐', '🦄', '📚', '🦁', '🧑‍🚀'];

const INTEREST_OPTIONS = [
  '🚀 Space & Sci-Fi',
  '🐾 Animals & Wildlife',
  '🌸 Gardens & Flowers',
  '🎮 Video Games',
  '🏰 Castles & Fantasy',
  '🌿 Nature & Camping',
  '🌊 Oceans & Sea Life',
  '📚 Adventure Books',
  '🔬 Science & Inventions'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  profile,
  onSaveProfile,
  onClose,
  isInitialOnboarding = false,
  onStartAssessment
}) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>(profile.name);
  const [avatar, setAvatar] = useState<string>(profile.avatar);
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>(profile.theme);
  const [learningLevel, setLearningLevel] = useState<LearningLevel>(profile.learningLevel || 'intermediate');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile.interests || ['🌸 Gardens', '📚 Reading']);
  const [dailyReadingGoal, setDailyReadingGoal] = useState<number>(profile.dailyReadingGoalMinutes || 15);

  if (!isOpen) return null;

  const handleToggleInterest = (interest: string) => {
    sound.playPop();
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleFinish = (startAssessmentNow: boolean = false) => {
    sound.playSuccessChime();
    triggerCelebrationConfetti();
    onSaveProfile({
      name: name.trim() || 'Explorer',
      avatar,
      theme: selectedTheme,
      learningLevel,
      interests: selectedInterests,
      dailyReadingGoalMinutes: dailyReadingGoal,
      onboardingCompleted: true
    });
    onClose();
    if (startAssessmentNow && onStartAssessment) {
      onStartAssessment();
    }
  };

  const activeThemeConfig = getThemeConfig(selectedTheme);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200 font-['Quicksand']">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto text-left relative">
        
        {/* Step Indicator & Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{avatar}</span>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 font-['Fredoka']">
                {isInitialOnboarding ? 'Personalize Your Adventure' : 'Student Profile & Settings'}
              </h3>
              <p className="text-xs text-slate-500">
                Ages 8–13 Learning Journey
              </p>
            </div>
          </div>
          {!isInitialOnboarding && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Tabs in Settings Mode */}
        {!isInitialOnboarding && (
          <div className="flex border-b border-slate-100 gap-1.5 pb-2">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setStep(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                step === 1
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Profile & Level
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setStep(2);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                step === 2
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Visual Theme
            </button>
            <button
              type="button"
              id="settings-reading-time-tab-btn"
              onClick={() => {
                sound.playPop();
                setStep(3);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                step === 3
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>⏱️ Reading Time & Goals</span>
            </button>
          </div>
        )}

        {/* STEP 1: Name & Avatar */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                What is your name?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name or nickname"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-base font-bold text-slate-800 font-['Fredoka']"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Choose your avatar
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      sound.playPop();
                      setAvatar(emoji);
                    }}
                    className={`h-12 rounded-2xl text-2xl flex items-center justify-center transition-transform cursor-pointer ${
                      avatar === emoji
                        ? 'bg-indigo-100 border-2 border-indigo-500 scale-110 shadow-xs'
                        : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Learning Level (Ages 8–13)
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    id: 'elementary',
                    title: '🎒 Elementary Explorer (Grades 3–4 / Ages 8–9)',
                    desc: 'Build reading confidence, foundational vocabulary, and friendly spelling'
                  },
                  {
                    id: 'intermediate',
                    title: '🧭 Intermediate Scholar (Grades 5–6 / Ages 10–11)',
                    desc: 'Expand multi-syllable vocabulary, context clues, and deeper comprehension'
                  },
                  {
                    id: 'advanced',
                    title: '👑 Advanced Word Master (Grades 7–8 / Ages 12–13)',
                    desc: 'Challenging literature terms, root words, and sophisticated language mastery'
                  }
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => {
                      sound.playPop();
                      setLearningLevel(lvl.id as any);
                    }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      learningLevel === lvl.id
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-extrabold text-xs sm:text-sm text-slate-800 font-['Fredoka']">
                      {lvl.title}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{lvl.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  sound.playPop();
                  setStep(2);
                }}
                className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Next: Choose World</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Choose Theme */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h4 className="font-extrabold text-base text-slate-800 font-['Fredoka']">
                Choose Your Visual Theme
              </h4>
              <p className="text-xs text-slate-500">
                Choose what you enjoy most. You can change this at any time!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
              {THEME_LIST.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      sound.playPop();
                      setSelectedTheme(theme.id);
                    }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-200'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-3xl">{theme.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-sm text-slate-800 font-['Fredoka'] truncate">
                        {theme.name}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{theme.subtitle}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  setStep(3);
                }}
                className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Next: Goals & Interests</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Goals & Interests */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Reading Time Toggle */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  ⏱️ Daily Reading Time Goal
                </label>
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {dailyReadingGoal} mins / day
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Customize the daily real-book focus reading timer goal for your child.
              </p>
              <div
                role="radiogroup"
                aria-label="Daily Reading Time Goal"
                className="grid grid-cols-3 gap-2"
              >
                {[15, 30, 60].map((mins) => {
                  const isSelected = dailyReadingGoal === mins;
                  return (
                    <button
                      key={mins}
                      id={`settings-reading-time-${mins}-btn`}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => {
                        sound.playPop();
                        setDailyReadingGoal(mins);
                      }}
                      className={`py-3 px-2 rounded-2xl border-2 font-bold text-xs sm:text-sm text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-800 font-extrabold shadow-sm ring-2 ring-indigo-200'
                          : 'border-slate-200 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className="font-['Fredoka'] text-sm sm:text-base">{mins} Mins</div>
                      {mins === 15 && <div className="text-[10px] text-indigo-600 font-semibold">★ Recommended</div>}
                      {mins === 30 && <div className="text-[10px] text-slate-500 font-medium">Book Worm</div>}
                      {mins === 60 && <div className="text-[10px] text-amber-600 font-medium">Champion 🏆</div>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                🌟 What topics interest you?
              </label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const isChecked = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => handleToggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setStep(2)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer order-last sm:order-first"
              >
                Back
              </button>

              <div className="flex flex-wrap items-center gap-2 justify-end w-full sm:w-auto">
                {isInitialOnboarding && onStartAssessment ? (
                  <>
                    <button
                      onClick={() => handleFinish(false)}
                      className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      id="finish-and-discover-path-btn"
                      onClick={() => handleFinish(true)}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-200 font-['Fredoka']"
                    >
                      <span>🌱 Save & Discover Learning Path</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    id="finish-profile-setup-btn"
                    onClick={() => handleFinish(false)}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-200"
                  >
                    <span>Save & Start Learning</span>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

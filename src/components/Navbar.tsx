import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Palette,
  Award,
  BookOpen,
  GraduationCap,
  Coins,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Layers,
  Heart
} from 'lucide-react';
import { UserProfile, AppSection } from '../types';
import { sound } from '../utils/audio';
import { getThemeConfig } from '../data/themes';
import { SyncIndicator } from './SyncIndicator';
import { SyncStatus } from '../services/syncService';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentSection?: AppSection;
  activeSection?: AppSection;
  profile: UserProfile;
  onSelectSection: (section: AppSection) => void;
  onOpenProfile: () => void;
  onOpenThemes?: () => void;
  onToggleSound?: () => void;
  onOpenBadges?: () => void;
  onOpenHomework?: () => void;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
  onSwitchProfiles?: () => void;
  isGuest?: boolean;
  syncStatus?: SyncStatus;
  isCloudActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  activeSection,
  profile,
  onSelectSection,
  onOpenProfile,
  onOpenThemes,
  onToggleSound,
  onOpenBadges,
  onOpenHomework,
  onOpenAuth,
  onSignOut,
  onSwitchProfiles,
  isGuest = false,
  syncStatus = 'idle',
  isCloudActive = false
}) => {
  const activeSec = activeSection || currentSection || 'learn';
  const theme = getThemeConfig(profile.theme);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navLabels = theme.learningExperience?.navLabels || {
    learn: 'Learn',
    read: 'Read',
    practice: 'Practice',
    test: 'Test',
    home: 'My Home'
  };

  // 5 Major Core Navigation Items customized by theme
  const primaryNavItems: {
    id: AppSection;
    label: string;
    icon: string;
    description: string;
    matches: AppSection[];
  }[] = [
    {
      id: 'learn',
      label: navLabels.learn,
      icon: '📚',
      description: 'Daily path, vocabulary, word explorer',
      matches: ['learn', 'home', 'review_garden', 'dictionary']
    },
    {
      id: 'read',
      label: navLabels.read,
      icon: '📖',
      description: '15-min timer & book log',
      matches: ['read', 'reading_adventure', 'reading_room']
    },
    {
      id: 'practice',
      label: navLabels.practice,
      icon: '🎯',
      description: 'Flashcards, spelling, pronunciation',
      matches: ['practice', 'flashcards', 'spelling_adventure', 'daily_adventure', 'garden', 'flower_garden']
    },
    {
      id: 'test',
      label: navLabels.test,
      icon: '📝',
      description: 'Weekly assessment & placement',
      matches: ['test', 'spelling_test', 'weekly_check', 'starting_assessment', 'learning_path']
    },
    {
      id: 'learning_home',
      label: navLabels.home,
      icon: theme.icon || '🏡',
      description: 'Cozy room, characters & rewards',
      matches: ['my_home', 'learning_home', 'sticker_book']
    }
  ];

  const coinsBalance = profile.learningCoins ?? profile.xp ?? 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs transition-all font-['Quicksand']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* 1. App Identity / Logo */}
          <button
            id="nav-logo-btn"
            onClick={() => {
              sound.playPop();
              onSelectSection('learn');
            }}
            className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <span className="text-xl">🏛️</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-stone-900 font-['Fredoka']">
                  BloomWord
                </span>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-200/80">
                  Learning Studio
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-400 font-medium hidden sm:block">
                Vocabulary, Spelling, Reading & Growth
              </p>
            </div>
          </button>

          {/* 2. DESKTOP 5-PRIMARY NAVIGATION TABS */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100/90 border border-stone-200/80">
            {primaryNavItems.map((item) => {
              const isMatch = item.matches.includes(activeSec);
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    sound.playPop();
                    onSelectSection(item.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isMatch
                      ? `${theme.navActive || 'bg-stone-900 text-white shadow-sm'} scale-102`
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
                  }`}
                  title={item.description}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 3. Status Utilities (Streak, Coins, Theme, Profile) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Homework Button */}
            {onOpenHomework && (
              <button
                id="homework-words-quick-btn"
                onClick={() => {
                  sound.playPop();
                  onOpenHomework();
                }}
                className="hidden lg:flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
                title="Add school homework & spelling list words"
              >
                <GraduationCap className="w-3.5 h-3.5 text-stone-600" />
                <span>Homework</span>
              </button>
            )}

            {/* Streak */}
            <div
              className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full text-xs font-bold text-amber-800"
              title={`${profile.readingStreak || profile.streak || 0} Day Learning Streak`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>{profile.readingStreak || profile.streak || 1}d</span>
            </div>

            {/* Coins Balance */}
            <button
              onClick={() => {
                sound.playPop();
                onSelectSection('learning_home');
              }}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 px-2.5 py-1 rounded-full text-xs font-bold text-amber-900 transition-colors cursor-pointer"
              title="Learning Coins (Spend in My Home!)"
            >
              <span>🪙</span>
              <span>{coinsBalance}</span>
            </button>

            {/* Theme Selector Button */}
            {onOpenThemes && (
              <button
                id="theme-selector-btn"
                onClick={() => {
                  sound.playPop();
                  onOpenThemes();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-stone-100 text-stone-700 border border-stone-200/90 transition-all cursor-pointer text-xs font-bold shadow-2xs hover:scale-102"
                title={`Active Theme: ${theme.name} • Click to open 12 Theme Gallery`}
                aria-label="Theme Selector"
              >
                <span className="text-base">{theme.icon}</span>
                <span className="hidden xl:inline text-stone-800 font-extrabold">{theme.name}</span>
                <Palette className="w-3.5 h-3.5 text-stone-400 ml-0.5" />
              </button>
            )}

            {/* Sound Toggle */}
            {onToggleSound && (
              <button
                id="sound-toggle-btn"
                onClick={() => {
                  sound.playPop();
                  onToggleSound();
                }}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-600 border border-stone-200 transition-colors cursor-pointer"
                title={profile.soundEnabled ? 'Sound On' : 'Muted'}
              >
                {profile.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-amber-700" />
                ) : (
                  <VolumeX className="w-4 h-4 text-stone-400" />
                )}
              </button>
            )}

            {/* PWA In-App Install Prompt */}
            <PWAInstallButton compact />

            {/* Cloud Auto-Save */}
            <SyncIndicator
              status={syncStatus}
              isCloudActive={isCloudActive}
              onOpenAuth={onOpenAuth}
            />

            {/* Student Profile Avatar */}
            <button
              id="profile-avatar-btn"
              onClick={() => {
                sound.playPop();
                onOpenProfile();
              }}
              className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 transition-all cursor-pointer group"
              title="Learner Profile & Settings"
            >
              <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs shadow-xs group-hover:scale-110 transition-transform">
                {profile.avatar}
              </span>
              <span className="font-bold text-xs text-stone-700 max-w-[70px] truncate hidden sm:inline">
                {profile.name}
              </span>
            </button>

            {/* More Menu Dropdown (Faith Garden, Parents, etc.) */}
            <div className="relative">
              <button
                onClick={() => {
                  sound.playPop();
                  setShowMoreMenu(!showMoreMenu);
                }}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-500 border border-stone-200 transition-colors cursor-pointer"
                title="More Learning Areas"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 text-left space-y-1 animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      sound.playPop();
                      setShowMoreMenu(false);
                      onSelectSection('faith_garden');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>📜</span>
                    <span>Faith Garden Words</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playPop();
                      setShowMoreMenu(false);
                      onSelectSection('flower_garden');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>🌱</span>
                    <span>Knowledge Garden</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playPop();
                      setShowMoreMenu(false);
                      onSelectSection('parent_dashboard');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-stone-500" />
                    <span>Parent Dashboard</span>
                  </button>

                  {onOpenBadges && (
                    <button
                      onClick={() => {
                        sound.playPop();
                        setShowMoreMenu(false);
                        onOpenBadges();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>Badges & Honors</span>
                    </button>
                  )}

                  {onSwitchProfiles && (
                    <button
                      onClick={() => {
                        sound.playPop();
                        setShowMoreMenu(false);
                        onSwitchProfiles();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>👥</span>
                      <span>Switch Profile</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-xl bg-stone-100 text-stone-700 cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 4. MOBILE 5-PRIMARY NAVIGATION BAR */}
        {mobileNavOpen && (
          <div className="md:hidden py-3 border-t border-stone-200 grid grid-cols-5 gap-1 animate-in fade-in duration-150">
            {primaryNavItems.map((item) => {
              const isMatch = item.matches.includes(activeSec);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playPop();
                    onSelectSection(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                    isMatch
                      ? `${theme.navActive || 'bg-stone-900 text-white shadow-sm'}`
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-[11px] mt-0.5">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

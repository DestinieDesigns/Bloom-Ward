import React from 'react';
import {
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  User,
  Heart,
  BookOpen,
  Flower2,
  Compass,
  CheckSquare,
  ShieldCheck,
  Search,
  Palette,
  GraduationCap,
  Award
} from 'lucide-react';
import { AppSection, UserProfile } from '../types';
import { getThemeConfig } from '../data/themes';
import { sound } from '../utils/audio';
import { SyncIndicator } from './SyncIndicator';
import { SyncStatus } from '../services/syncService';

interface NavbarProps {
  currentSection?: AppSection;
  activeSection?: AppSection;
  onSelectSection: (section: AppSection) => void;
  profile: UserProfile;
  onOpenProfile: () => void;
  onOpenThemes?: () => void;
  onOpenHomework?: () => void;
  onOpenBadges?: () => void;
  onToggleSound?: () => void;
  syncStatus?: SyncStatus;
  isCloudActive?: boolean;
  onOpenAuth?: () => void;
  onSwitchProfiles?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  activeSection,
  onSelectSection,
  profile,
  onOpenProfile,
  onOpenThemes,
  onOpenHomework,
  onOpenBadges,
  onToggleSound,
  syncStatus = 'synced',
  isCloudActive = false,
  onOpenAuth,
  onSwitchProfiles
}) => {
  const activeSec = activeSection || currentSection || 'home';
  const theme = getThemeConfig(profile.theme);

  const navItems: { id: AppSection; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <span>{theme.icon}</span> },
    {
      id: 'reading_adventure',
      label: 'Reading Adventure',
      icon: <BookOpen className="w-4 h-4 text-pink-500" />,
      badge: `${profile.readingStreak}d 🔥`
    },
    { id: 'daily_adventure', label: 'Daily Lesson', icon: <span>⭐</span> },
    { id: 'learning_path', label: 'Adventure Path', icon: <Compass className="w-4 h-4 text-indigo-500" /> },
    { id: 'spelling_adventure', label: 'Spelling', icon: <span>✏️</span> },
    { id: 'reading_room', label: 'Story Room', icon: <BookOpen className="w-4 h-4 text-purple-500" /> },
    { id: 'faith_garden', label: 'Faith Words', icon: <span>✝️</span> },
    {
      id: 'garden',
      label: theme.worldMetaphor.worldName,
      icon: <span>{theme.worldMetaphor.statusIcon}</span>
    },
    { id: 'review_garden', label: 'Word Library', icon: <Search className="w-4 h-4 text-blue-500" /> },
    { id: 'weekly_check', label: 'Growth Check', icon: <CheckSquare className="w-4 h-4 text-emerald-500" /> },
    { id: 'parent_dashboard', label: 'Parents', icon: <ShieldCheck className="w-4 h-4 text-slate-500" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all font-['Quicksand']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo with Dynamic Theme Metaphor */}
          <button
            id="nav-logo-btn"
            onClick={() => {
              sound.playPop();
              onSelectSection('home');
            }}
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${theme.heroGradient} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
              <span className="text-2xl">{theme.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl sm:text-2xl tracking-tight text-slate-800 font-['Fredoka']">
                  BloomWord
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${theme.badgeBg}`}>
                  {theme.icon}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium hidden sm:block">
                {theme.subtitle}
              </p>
            </div>
          </button>

          {/* Quick Actions & Status Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* School Homework Practice Quick Button */}
            {onOpenHomework && (
              <button
                id="homework-words-quick-btn"
                onClick={() => {
                  sound.playPop();
                  onOpenHomework();
                }}
                className="hidden sm:flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Add school homework & spelling test words"
              >
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Homework Words</span>
              </button>
            )}

            {/* Reading Streak Indicator */}
            <button
              id="nav-reading-streak-btn"
              onClick={() => {
                sound.playPop();
                onSelectSection('reading_adventure');
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-xs cursor-pointer hover:bg-orange-100/60 transition-colors"
              title="Daily Reading Streak"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
              <span className="font-bold text-orange-600 text-xs sm:text-sm font-['Fredoka']">
                {profile.readingStreak}d Read
              </span>
            </button>

            {/* Level & XP */}
            <div
              className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-xs"
              title={`Level ${profile.level} Learner`}
            >
              <Sparkles className="w-4 h-4 text-purple-500 fill-purple-400" />
              <span className="font-bold text-purple-700 text-xs sm:text-sm font-['Fredoka']">
                Lvl {profile.level} • {profile.xp} XP
              </span>
            </div>

            {/* Theme Selector Button */}
            {onOpenThemes && (
              <button
                id="theme-selector-btn"
                onClick={() => {
                  sound.playPop();
                  onOpenThemes();
                }}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer flex items-center justify-center"
                title="Change World Theme"
                aria-label="Change World Theme"
              >
                <Palette className="w-4 h-4 text-indigo-500" />
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
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                title={profile.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
                aria-label="Toggle Sound"
              >
                {profile.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-pink-500" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
              </button>
            )}

            {/* Badges Button */}
            {onOpenBadges && (
              <button
                id="badges-modal-btn"
                onClick={() => {
                  sound.playPop();
                  onOpenBadges();
                }}
                className="p-2 rounded-full hover:bg-slate-100 text-amber-600 border border-amber-200 transition-colors cursor-pointer"
                title="My Badges"
              >
                <Award className="w-4 h-4 text-amber-500" />
              </button>
            )}

            {/* Cloud Auto-Save & Sync Status Indicator */}
            <SyncIndicator
              status={syncStatus}
              isCloudActive={isCloudActive}
              onOpenAuth={onOpenAuth}
            />

            {/* Student Profile Avatar & Quick Menu */}
            <div className="flex items-center gap-1">
              <button
                id="profile-avatar-btn"
                onClick={() => {
                  sound.playPop();
                  onOpenProfile();
                }}
                className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-300 text-slate-800 transition-all cursor-pointer group shadow-xs"
                title="Student Profile & Settings"
              >
                <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm shadow-xs group-hover:scale-110 transition-transform">
                  {profile.avatar}
                </span>
                <span className="font-semibold text-xs sm:text-sm text-slate-700 max-w-[70px] truncate hidden md:inline">
                  {profile.name}
                </span>
              </button>

              {/* Family Switcher Button */}
              {onSwitchProfiles && (
                <button
                  id="switch-learner-navbar-btn"
                  onClick={() => {
                    sound.playPop();
                    onSwitchProfiles();
                  }}
                  className="hidden lg:flex p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors cursor-pointer text-[11px] font-bold"
                  title="Switch Learner Profile"
                >
                  Switch
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Ribbon Bar */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar border-t border-slate-100">
          {navItems.map((item) => {
            const isActive = activeSec === item.id || (item.id === 'garden' && (activeSec === 'garden' || activeSec === 'flower_garden'));
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  sound.playPop();
                  onSelectSection(item.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? `${theme.navActive} scale-102`
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 bg-slate-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/30 text-current font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

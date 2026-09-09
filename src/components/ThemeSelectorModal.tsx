import React, { useState } from 'react';
import {
  Palette,
  Check,
  Sparkles,
  X,
  Eye,
  Volume2,
  BookOpen,
  Home,
  Target,
  Award,
  Layers,
  ArrowRight,
  Compass,
  Star
} from 'lucide-react';
import { ThemeId } from '../types';
import { THEME_LIST, getThemeConfig, ThemeConfig } from '../data/themes';
import { sound } from '../utils/audio';
import { triggerSparkleConfetti, triggerCelebrationConfetti } from '../utils/storage';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  onClose: () => void;
}

type CategoryFilter = 'all' | 'starter' | 'nature' | 'sci_fi_game' | 'creative_sports' | 'faith_whimsical';

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  currentTheme,
  onSelectTheme,
  onClose
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [previewTheme, setPreviewTheme] = useState<ThemeConfig | null>(null);

  if (!isOpen) return null;

  // Category filter matcher
  const filteredThemes = THEME_LIST.filter((theme) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'starter') return theme.category === 'starter';
    if (activeCategory === 'nature') return theme.category === 'nature';
    if (activeCategory === 'sci_fi_game') return theme.category === 'sci_fi' || theme.id === 'gaming';
    if (activeCategory === 'creative_sports')
      return theme.category === 'creative' || theme.id === 'sports' || theme.category === 'adventure' || theme.id === 'science_discovery';
    if (activeCategory === 'faith_whimsical')
      return theme.category === 'faith' || theme.category === 'whimsical';
    return true;
  });

  const handleApplyTheme = (themeId: ThemeId) => {
    sound.playLevelUpFanfare();
    triggerCelebrationConfetti();
    onSelectTheme(themeId);
    if (previewTheme) {
      setPreviewTheme(null);
    }
  };

  const handlePreview = (theme: ThemeConfig) => {
    sound.playPop();
    setPreviewTheme(theme);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 font-['Quicksand'] animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-4 sm:p-8 shadow-2xl border-2 border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-md text-2xl">
              🎨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-['Fredoka']">
                  Theme Gallery & World Experiences
                </h3>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                  12 Learning Worlds
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Choose how your learning world looks, feels, sounds, and grows. Educational integrity is always 100% preserved.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Close Gallery"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar shrink-0 border-b border-slate-100 text-xs font-bold">
          <button
            onClick={() => {
              sound.playPop();
              setActiveCategory('all');
            }}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Worlds ({THEME_LIST.length})
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveCategory('starter');
            }}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'starter'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🏡 Starter & Warm
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveCategory('nature');
            }}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'nature'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🌿 Nature & Ocean
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveCategory('sci_fi_game');
            }}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'sci_fi_game'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🚀 Space & Gaming
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveCategory('creative_sports');
            }}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'creative_sports'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎨 Creative, Sports & Discovery
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveCategory('faith_whimsical');
            }}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'faith_whimsical'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🕊️ Faith & Blossoms
          </button>
        </div>

        {/* Themes Grid */}
        <div className="overflow-y-auto py-4 pr-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredThemes.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <div
                key={theme.id}
                id={`theme-card-${theme.id}`}
                className={`group rounded-3xl border-2 p-4 transition-all duration-300 flex flex-col justify-between bg-white ${
                  isSelected
                    ? 'border-indigo-600 ring-4 ring-indigo-100 shadow-lg'
                    : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Badge & Selection Indicator */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl p-1.5 rounded-2xl bg-slate-50 border border-slate-100 shadow-2xs">
                        {theme.icon}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900 font-['Fredoka'] flex items-center gap-1.5">
                          <span>{theme.name}</span>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold">
                              Active
                            </span>
                          )}
                        </h4>
                        <span className="text-[11px] font-bold text-slate-500 block">
                          {theme.badge}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">
                    {theme.description}
                  </p>

                  {/* Miniature Visual Palette Strip */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 mb-3 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      <span>Atmosphere: {theme.home.windowView} view</span>
                      <span>{theme.learningExperience.progressPresentation.visualIcon} {theme.ui.progressStyle.replace('_', ' ')}</span>
                    </div>

                    {/* Color Swatch Dots */}
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: theme.colors.background }}
                        title="Canvas Background"
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: theme.colors.primary }}
                        title="Primary Color"
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: theme.colors.secondary }}
                        title="Secondary Color"
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: theme.colors.accent }}
                        title="Accent Color"
                      />
                      <div className="ml-auto text-[11px] font-bold text-slate-700 font-mono">
                        "{theme.learningExperience.todayPathTitle}"
                      </div>
                    </div>

                    {/* Mini Sample Themed Button Display */}
                    <div className="pt-1">
                      <div
                        className={`w-full text-center py-1.5 px-3 rounded-xl text-xs font-bold text-white shadow-2xs ${theme.buttonGradient}`}
                      >
                        Sample: {theme.learningExperience.navLabels.learn} • {theme.learningExperience.navLabels.practice}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handlePreview(theme)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Live Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyTheme(theme.id)}
                    disabled={isSelected}
                    className={`px-4 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-100 text-slate-400 cursor-default'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs hover:scale-103'
                    }`}
                  >
                    {isSelected ? (
                      <span>Current World</span>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Use Theme</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Educational Reassurance Banner */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 shrink-0">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Educational Consistency:</strong> All vocabulary words, spelling tests, 15-minute reading goals, and assessments remain 100% active across every theme.
            </span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>

      {/* 🌟 FULLSCREEN LIVE INTERACTIVE PREVIEW MODAL */}
      {previewTheme && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 font-['Quicksand'] animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border-4 border-slate-100 flex flex-col max-h-[92vh] overflow-y-auto space-y-6">
            {/* Preview Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 rounded-2xl bg-slate-50 border border-slate-200">
                  {previewTheme.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-extrabold text-slate-900 font-['Fredoka']">
                      {previewTheme.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {previewTheme.badge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {previewTheme.tagline}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewTheme(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Live Visual Showcase Container */}
            <div
              className={`p-6 rounded-3xl border-2 transition-all space-y-6 ${previewTheme.bgGradient}`}
              style={{
                borderColor: previewTheme.colors.border
              }}
            >
              {/* 1. Theme Navigation Bar Simulation */}
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  1. Navigation Experience:
                </div>
                <div className="bg-white/90 backdrop-blur-xs p-2.5 rounded-2xl shadow-xs flex items-center justify-around border border-slate-200/80 text-xs font-bold">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-extrabold shadow-2xs">
                    {previewTheme.learningExperience.navLabels.learn}
                  </div>
                  <div className="px-3 py-1.5 rounded-xl text-slate-600">
                    {previewTheme.learningExperience.navLabels.read}
                  </div>
                  <div className="px-3 py-1.5 rounded-xl text-slate-600">
                    {previewTheme.learningExperience.navLabels.practice}
                  </div>
                  <div className="px-3 py-1.5 rounded-xl text-slate-600">
                    {previewTheme.learningExperience.navLabels.test}
                  </div>
                  <div className="px-3 py-1.5 rounded-xl text-slate-600">
                    {previewTheme.learningExperience.navLabels.home}
                  </div>
                </div>
              </div>

              {/* 2. Today's Learning Path Card Simulation */}
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  2. Learning Activity Presentation:
                </div>
                <div
                  className={`p-5 rounded-3xl border-2 shadow-sm ${previewTheme.cardBg} ${previewTheme.cardBorder}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                      <span>{previewTheme.icon}</span>
                      <span>{previewTheme.learningExperience.todayPathTitle}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Progress: {previewTheme.learningExperience.progressPresentation.metaphor}
                    </span>
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 font-['Fredoka'] mb-1">
                    "Step 1: Master 5 Words in your {previewTheme.name} World"
                  </h4>
                  <p className="text-xs text-slate-600 mb-4">
                    {previewTheme.learningExperience.todayPathSubtitle}
                  </p>

                  {/* Metaphorical Progress Stages */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>{previewTheme.learningExperience.progressPresentation.visualIcon} {previewTheme.learningExperience.progressPresentation.unitLabel}</span>
                      <span className="text-indigo-600 font-extrabold">Stage 4 of 5 (80% Complete)</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5 text-[10px] text-center font-bold">
                      {previewTheme.learningExperience.progressPresentation.stageNames.map((stage, i) => (
                        <div
                          key={stage}
                          className={`p-1.5 rounded-lg border ${
                            i <= 3
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          {stage}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Reading Environment & Practice Companion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Reading Space */}
                <div className="p-4 rounded-2xl bg-white/90 border border-slate-200 space-y-2">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    📖 Reading Atmosphere
                  </div>
                  <h5 className="font-extrabold text-sm text-slate-800">
                    {previewTheme.learningExperience.readingPresentation.spaceTitle}
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "{previewTheme.learningExperience.readingPresentation.tagline}"
                  </p>
                  <div className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">
                    <span>Reading Companion:</span>
                    <span>{previewTheme.learningExperience.readingPresentation.companionName}</span>
                  </div>
                </div>

                {/* Home Environment & Window */}
                <div className="p-4 rounded-2xl bg-white/90 border border-slate-200 space-y-2">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    🏡 My Learning Home
                  </div>
                  <h5 className="font-extrabold text-sm text-slate-800">
                    Room Style: {previewTheme.home.roomStyle}
                  </h5>
                  <p className="text-xs text-slate-600">
                    Window View: <strong className="capitalize">{previewTheme.home.windowView}</strong> • Lighting: <strong className="capitalize">{previewTheme.home.lighting}</strong>
                  </p>
                  <div className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                    <span>Reward Item:</span>
                    <span>{previewTheme.learningExperience.rewardPresentation.rewardIcon} {previewTheme.learningExperience.rewardPresentation.rewardNoun}</span>
                  </div>
                </div>
              </div>

              {/* 4. Encouraging Feedback Example */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900 font-bold">
                <span className="text-xl">💬</span>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-emerald-600 font-extrabold">
                    Learning Affirmation Feedback
                  </span>
                  <span>"{previewTheme.learningExperience.feedbackPhrases.correct}"</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewTheme(null)}
                className="px-5 py-2.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 cursor-pointer"
              >
                Back to Gallery
              </button>

              <button
                type="button"
                onClick={() => handleApplyTheme(previewTheme.id)}
                className="px-8 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md hover:scale-103 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Apply {previewTheme.name} Theme</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

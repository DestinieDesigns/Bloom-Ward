import React from 'react';
import { Palette, Check, Sparkles, X } from 'lucide-react';
import { ThemeId } from '../types';
import { THEME_LIST, getThemeConfig } from '../data/themes';
import { sound } from '../utils/audio';
import { triggerSparkleConfetti } from '../utils/storage';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  currentTheme,
  onSelectTheme,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200 font-['Quicksand']">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-['Fredoka']">
                Choose Your World Theme
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Personalize your learning environment. You can switch worlds anytime!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {THEME_LIST.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                id={`theme-card-${theme.id}`}
                onClick={() => {
                  sound.playBloomSparkle();
                  triggerSparkleConfetti();
                  onSelectTheme(theme.id);
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-500 ring-4 ring-indigo-100 shadow-md bg-indigo-50/40 scale-102'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{theme.icon}</span>
                      <div>
                        <h4 className="font-extrabold text-base text-slate-800 font-['Fredoka']">
                          {theme.name}
                        </h4>
                        <span className="text-[11px] font-bold text-slate-500">
                          {theme.badge}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {theme.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>World: {theme.worldMetaphor.worldName}</span>
                  <span>Companion: {theme.readingCompanion.stageIcons[3]}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};

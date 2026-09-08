import React, { useState } from 'react';
import {
  Users,
  Plus,
  Flame,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Palette
} from 'lucide-react';
import { UserProfile, ThemeId } from '../../types';
import { THEMES } from '../../data/themes';
import { sound } from '../../utils/audio';

interface ProfileSelectionScreenProps {
  profiles: UserProfile[];
  activeProfileId?: string;
  onSelectProfile: (profileId: string) => void;
  onAddNewProfile: (data: { name: string; avatar: string; theme: ThemeId; dailyGoal: number }) => void;
  onOpenParentArea: () => void;
}

const AVATAR_OPTIONS = ['🌸', '🚀', '🐾', '🦄', '🌊', '🎮', '🦋', '🦁', '🐬', '🌟'];

export const ProfileSelectionScreen: React.FC<ProfileSelectionScreenProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddNewProfile,
  onOpenParentArea
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('🌸');
  const [newTheme, setNewTheme] = useState<ThemeId>('pink_garden');
  const [newGoal, setNewGoal] = useState<number>(15);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    sound.playSuccessChime();
    onAddNewProfile({
      name: newName.trim(),
      avatar: newAvatar,
      theme: newTheme,
      dailyGoal: newGoal
    });
    setNewName('');
    setShowAddForm(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 font-['Quicksand']">
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border-2 border-pink-100 shadow-xl text-center">
        
        {/* Header */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-400 via-purple-300 to-indigo-400 shadow-md text-3xl mb-3">
          🌟
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 font-['Fredoka'] mb-2">
          Who's Learning Today?
        </h1>
        <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
          Choose your student profile to continue your vocabulary and reading adventure!
        </p>

        {/* Existing Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {profiles.map((p) => {
            const themeConfig = THEMES[p.theme] || THEMES.pink_garden;
            const isSelected = p.id === activeProfileId;

            return (
              <button
                key={p.id || p.name}
                id={`profile-card-${p.id || p.name}`}
                onClick={() => {
                  sound.playPop();
                  if (p.id) onSelectProfile(p.id);
                }}
                className={`p-5 rounded-3xl border-2 text-left transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? 'border-pink-400 bg-pink-50/70 shadow-md ring-2 ring-pink-200'
                    : 'border-slate-100 bg-white hover:border-pink-200 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {p.avatar}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-white text-slate-700 border border-slate-200">
                      {themeConfig.icon} {themeConfig.name}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-800 font-['Fredoka'] truncate">
                    {p.name}
                  </h3>

                  <div className="flex items-center gap-3 mt-2 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1 text-orange-600">
                      <Flame className="w-3.5 h-3.5 fill-orange-500" />
                      {p.streak}d Streak
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-purple-600">
                      <Sparkles className="w-3.5 h-3.5 fill-purple-400" />
                      Lvl {p.level}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-pink-600 group-hover:translate-x-1 transition-transform">
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}

          {/* Add Profile Tile */}
          {!showAddForm && (
            <button
              id="add-profile-btn"
              onClick={() => {
                sound.playPop();
                setShowAddForm(true);
              }}
              className="p-5 rounded-3xl border-2 border-dashed border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px] group text-slate-500 hover:text-indigo-600"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 group-hover:border-indigo-300 flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-sm font-['Fredoka']">
                Add Sibling / Learner
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                New independent progress
              </span>
            </button>
          )}
        </div>

        {/* Add Student Form (Collapsible) */}
        {showAddForm && (
          <div className="p-6 bg-indigo-50/60 rounded-3xl border border-indigo-200 text-left mb-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-lg text-slate-800 font-['Fredoka']">
                ✨ Add New Student Profile
              </h3>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Nickname / Display Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jayden or BookWorm10"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Choose Explorer Avatar
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => {
                        sound.playPop();
                        setNewAvatar(av);
                      }}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center cursor-pointer transition-all ${
                        newAvatar === av
                          ? 'bg-indigo-100 border-2 border-indigo-500 scale-105'
                          : 'bg-white border border-slate-200'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  World Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.values(THEMES).map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => {
                        sound.playPop();
                        setNewTheme(t.id);
                      }}
                      className={`p-2 rounded-xl text-left border text-xs font-bold flex items-center gap-1 cursor-pointer ${
                        newTheme === t.id
                          ? 'border-indigo-500 bg-white text-indigo-900 ring-2 ring-indigo-200'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <span>{t.icon}</span>
                      <span className="truncate">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 cursor-pointer"
                >
                  Create Learner Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Parent & Guardian Link */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              sound.playPop();
              onOpenParentArea();
            }}
            className="flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Parent & Guardian Dashboard</span>
          </button>
          <span className="text-slate-400">
            Family Learning Space
          </span>
        </div>
      </div>
    </div>
  );
};

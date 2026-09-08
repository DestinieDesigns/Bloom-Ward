import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Check,
  Palette,
  Flower2,
  Compass,
  Star,
  Flame,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeId } from '../../types';
import { THEMES } from '../../data/themes';
import { sound } from '../../utils/audio';
import { triggerSparkleConfetti } from '../../utils/storage';

interface AuthLandingScreenProps {
  onGuestStart: (name?: string, avatar?: string, theme?: ThemeId) => void;
}

const AVATAR_OPTIONS = ['🌸', '🚀', '🐾', '🦄', '🌊', '🎮', '🦋', '🦁', '🐬', '🌟', '📚', '🎨'];

export const AuthLandingScreen: React.FC<AuthLandingScreenProps> = ({ onGuestStart }) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🌸');
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('pink_garden');
  const [dailyGoal, setDailyGoal] = useState<number>(15);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (mode === 'signup') {
      if (!studentName.trim()) {
        setErrorMsg('Please enter a student nickname or first name.');
        setIsSubmitting(false);
        return;
      }
      const res = await signUpWithEmail(
        email,
        password,
        studentName,
        selectedAvatar,
        selectedTheme,
        dailyGoal
      );
      setIsSubmitting(false);
      if (res.success) {
        sound.playLevelUpFanfare();
        triggerSparkleConfetti();
      } else {
        sound.playWrongAnswer();
        setErrorMsg(res.error || 'Could not create account.');
      }
    } else {
      const res = await signInWithEmail(email, password);
      setIsSubmitting(false);
      if (res.success) {
        sound.playSuccessChime();
      } else {
        sound.playWrongAnswer();
        setErrorMsg(res.error || 'Could not sign in.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await signInWithGoogle();
    setIsSubmitting(false);
    if (res.success) {
      sound.playSuccessChime();
      triggerSparkleConfetti();
    } else {
      sound.playWrongAnswer();
      setErrorMsg(res.error || 'Could not sign in with Google.');
    }
  };

  const handleGuestClick = () => {
    sound.playPop();
    onGuestStart(studentName.trim() || 'Young Explorer', selectedAvatar, selectedTheme);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-indigo-50 text-slate-800 font-['Quicksand'] py-8 px-4 sm:px-6 flex flex-col justify-between">
      {/* Top Branding Header */}
      <header className="max-w-4xl mx-auto w-full text-center pt-4 pb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-pink-200 shadow-xs mb-4 text-xs sm:text-sm font-bold text-pink-700">
          <span className="text-base">🌸</span>
          <span>Welcome to BloomWord Learning Adventure</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 font-extrabold">
            Fresh for Everyone
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight font-['Fredoka'] mb-3">
          Bloom Your Vocabulary & Mind
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Every student starts with their own fresh garden, level 1 learning path, and personalized reading tracker.
        </p>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-xl w-full mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-100 relative">
        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            id="tab-create-account"
            onClick={() => {
              sound.playPop();
              setMode('signup');
              setErrorMsg('');
            }}
            className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🌸 Create New Account
          </button>

          <button
            type="button"
            id="tab-sign-in"
            onClick={() => {
              sound.playPop();
              setMode('signin');
              setErrorMsg('');
            }}
            className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🔑 Sign In
          </button>
        </div>

        {/* Google Quick Sign-In */}
        <div className="mb-5">
          <button
            type="button"
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}</span>
          </button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative px-3 bg-white text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              or with email & password
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SIGN UP ONLY FIELDS */}
          {mode === 'signup' && (
            <>
              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  👤 Student Nickname or First Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    id="input-student-name"
                    placeholder="e.g. Maya, Lucas, Grace"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:outline-none text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ✨ Choose Starting Avatar
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => {
                        sound.playPop();
                        setSelectedAvatar(av);
                      }}
                      className={`h-11 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                        selectedAvatar === av
                          ? 'bg-pink-100 border-2 border-pink-500 scale-105 shadow-xs'
                          : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  🎨 Choose Your Adventure World
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.values(THEMES).slice(0, 3).map((th) => (
                    <button
                      type="button"
                      key={th.id}
                      onClick={() => {
                        sound.playPop();
                        setSelectedTheme(th.id);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                        selectedTheme === th.id
                          ? 'bg-pink-50 border-pink-400 text-pink-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xl">{th.icon}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">{th.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Goal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ⏱️ Daily Reading & Vocab Goal
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { minutes: 15, label: '15 Min', desc: 'Light' },
                    { minutes: 20, label: '20 Min', desc: 'Standard' },
                    { minutes: 30, label: '30 Min', desc: 'Champion' }
                  ].map((g) => (
                    <button
                      type="button"
                      key={g.minutes}
                      onClick={() => {
                        sound.playPop();
                        setDailyGoal(g.minutes);
                      }}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        dailyGoal === g.minutes
                          ? 'bg-orange-50 border-orange-400 text-orange-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs font-extrabold">{g.label}</div>
                      <div className="text-[10px] text-slate-400">{g.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              📧 Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                id="input-email"
                placeholder="student or parent email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:outline-none text-sm transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              🔐 Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                minLength={6}
                id="input-password"
                placeholder="at least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:outline-none text-sm transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="submit-auth-btn"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-pink-200 cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>
                {isSubmitting
                  ? 'Connecting to Cloud...'
                  : mode === 'signup'
                  ? '🌸 Create Fresh Account & Start Learning'
                  : '▶ Sign In to My Account'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Guest Start Demo Option */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 mb-2">
            Just want to explore first? No account required:
          </p>
          <button
            type="button"
            id="start-guest-btn"
            onClick={handleGuestClick}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-pink-400 hover:bg-pink-50/50 text-slate-700 hover:text-pink-700 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>✨ Continue as Guest (Start Fresh Without Account)</span>
          </button>
        </div>

        {/* Security & Safety Note */}
        <div className="mt-5 pt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Kid-safe, ad-free & private
          </span>
          <span>Synced across all your devices</span>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-4xl mx-auto w-full text-center pt-8 pb-4 text-xs text-slate-400">
        <p>BloomWord Educational Platform • Wonders 4th Grade Vocabulary & Reading Adventure</p>
      </footer>
    </div>
  );
};

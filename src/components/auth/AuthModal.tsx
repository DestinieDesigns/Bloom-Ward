import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Lock,
  Mail,
  User,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Check,
  Palette
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeId } from '../../types';
import { THEMES } from '../../data/themes';
import { sound } from '../../utils/audio';
import { triggerSparkleConfetti } from '../../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AVATAR_OPTIONS = ['🌸', '🚀', '🐾', '🦄', '🌊', '🎮', '🦋', '🦁', '🐬', '🌟', '📚', '🎨'];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { signInWithEmail, signUpWithEmail } = useAuth();

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🌸');
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('pink_garden');
  const [dailyGoal, setDailyGoal] = useState<number>(15);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (isSignUp) {
      if (!studentName.trim()) {
        setErrorMsg('Please choose a friendly display name or nickname.');
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
        onClose();
        if (onSuccess) onSuccess();
      } else {
        sound.playWrongAnswer();
        setErrorMsg(res.error || 'Could not create account.');
      }
    } else {
      const res = await signInWithEmail(email, password);
      setIsSubmitting(false);
      if (res.success) {
        sound.playSuccessChime();
        onClose();
        if (onSuccess) onSuccess();
      } else {
        sound.playWrongAnswer();
        setErrorMsg(res.error || 'Could not sign in.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-['Quicksand'] overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-pink-100 relative text-left my-8">
        
        {/* Close button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-300 to-indigo-400 shadow-md text-3xl mb-3">
            {isSignUp ? selectedAvatar : '🌟'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-['Fredoka']">
            {isSignUp ? 'Create Your Learning Account' : 'Welcome to BloomWord'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {isSignUp
              ? 'Save your words, reading streaks, and learning adventure securely to the cloud.'
              : 'Sign in to sync your personal learning journey across all your devices.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 mt-4 p-1 bg-slate-100 rounded-full max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setIsSignUp(false);
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                !isSignUp
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setIsSignUp(true);
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isSignUp
                  ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              New Account
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* SIGN UP FIELDS */}
          {isSignUp && (
            <>
              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  🎀 Student Display Name / Nickname
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. WordExplorer123 or Mia"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:outline-none text-sm transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Safe nickname for privacy. Avoid full real names.
                </p>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  🌟 Choose Your Explorer Avatar
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => {
                        sound.playPop();
                        setSelectedAvatar(av);
                      }}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                        selectedAvatar === av
                          ? 'bg-pink-100 border-2 border-pink-500 scale-110 shadow-xs'
                          : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  🎨 Choose Your Learning World Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.values(THEMES).map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => {
                        sound.playPop();
                        setSelectedTheme(t.id);
                      }}
                      className={`p-2 rounded-xl text-left border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedTheme === t.id
                          ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-200'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-lg">{t.icon}</span>
                      <span className="truncate">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Reading Goal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  🎯 Daily Real-Book Reading Goal
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { minutes: 15, label: '15 Mins ⭐', desc: 'Recommended' },
                    { minutes: 30, label: '30 Mins', desc: 'Book Worm' },
                    { minutes: 60, label: '60 Mins', desc: 'Champion 🏆' }
                  ].map((g) => (
                    <button
                      type="button"
                      key={g.minutes}
                      onClick={() => {
                        sound.playPop();
                        setDailyGoal(g.minutes);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        dailyGoal === g.minutes
                          ? 'bg-orange-50 border-orange-400 text-orange-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
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

          {/* EMAIL & PASSWORD FIELDS (BOTH SIGN IN & SIGN UP) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              📧 Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="student or parent email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:outline-none text-sm transition-colors"
              />
            </div>
          </div>

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
                placeholder="at least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:outline-none text-sm transition-colors"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-pink-200 cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>
                {isSubmitting
                  ? 'Saving to Cloud...'
                  : isSignUp
                  ? '🚀 Create Account & Start Learning'
                  : '▶ Sign In to My Account'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-center"
            >
              Continue on This Device (Guest Mode)
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Kid-safe, private & secure
          </span>
          <span>Cloud Progress Sync</span>
        </div>
      </div>
    </div>
  );
};

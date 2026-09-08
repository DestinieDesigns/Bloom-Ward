import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Sparkles,
  KeyRound,
  GraduationCap,
  HeartHandshake,
  ArrowRight
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
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithStudentCode,
    signUpWithStudentCode
  } = useAuth();

  // Role: student (default, no email!) vs parent
  const [role, setRole] = useState<'student' | 'parent'>('student');

  // Student mode: new vs returning
  const [studentMode, setStudentMode] = useState<'new' | 'returning'>('new');
  const [studentUsername, setStudentUsername] = useState('');
  const [studentPasscode, setStudentPasscode] = useState('');

  // Parent mode: signin vs signup
  const [parentMode, setParentMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Customization for new student
  const [studentDisplayName, setStudentDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🌸');
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('pink_garden');
  const [dailyGoal, setDailyGoal] = useState<number>(15);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const cleanUser = studentUsername.trim();
    if (!cleanUser) {
      setErrorMsg('Please enter your student nickname.');
      setIsSubmitting(false);
      return;
    }
    if (!studentPasscode.trim()) {
      setErrorMsg('Please enter your secret code or PIN.');
      setIsSubmitting(false);
      return;
    }

    if (studentMode === 'new') {
      const res = await signUpWithStudentCode(
        cleanUser,
        studentPasscode,
        studentDisplayName.trim() || cleanUser,
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
        setErrorMsg(res.error || 'Could not create student account.');
      }
    } else {
      const res = await signInWithStudentCode(cleanUser, studentPasscode);
      setIsSubmitting(false);
      if (res.success) {
        sound.playSuccessChime();
        triggerSparkleConfetti();
        onClose();
        if (onSuccess) onSuccess();
      } else {
        sound.playWrongAnswer();
        setErrorMsg(res.error || 'Could not log in.');
      }
    }
  };

  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (parentMode === 'signup') {
      const res = await signUpWithEmail(
        email,
        password,
        studentDisplayName.trim() || 'Student',
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

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await signInWithGoogle();
    setIsSubmitting(false);
    if (res.success) {
      sound.playSuccessChime();
      triggerSparkleConfetti();
      onClose();
      if (onSuccess) onSuccess();
    } else {
      sound.playWrongAnswer();
      setErrorMsg(res.error || 'Could not sign in with Google.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-['Quicksand'] overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-pink-100 relative text-left my-8">
        
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
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-300 to-indigo-400 shadow-md text-2xl mb-2">
            {role === 'student' ? selectedAvatar : '👨‍👩‍👧'}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 font-['Fredoka']">
            {role === 'student' ? 'Student Account' : 'Parent & Teacher Portal'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {role === 'student'
              ? 'Save your words and streaks with just your nickname — no email needed!'
              : 'Sign in with your email or Google account to manage student learning.'}
          </p>

          {/* Role Switcher */}
          <div className="flex rounded-2xl bg-slate-100 p-1 mt-4">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setRole('student');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                role === 'student' ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-pink-500" />
              <span>🎒 Student (No Email)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setRole('parent');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                role === 'parent' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-indigo-500" />
              <span>👨‍👩‍👧 Parent / Teacher</span>
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

        {/* STUDENT FLOW */}
        {role === 'student' && (
          <div>
            {/* Student Sub-Tabs */}
            <div className="grid grid-cols-2 p-1 bg-pink-50/70 border border-pink-100 rounded-xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setStudentMode('new');
                  setErrorMsg('');
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  studentMode === 'new' ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                🌱 New Student
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setStudentMode('returning');
                  setErrorMsg('');
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  studentMode === 'returning' ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                🔑 Returning Student
              </button>
            </div>

            <form onSubmit={handleStudentSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  👤 Student Nickname
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya, Lucas, Grace"
                    value={studentUsername}
                    onChange={(e) => setStudentUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-pink-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  🔑 Secret Code or PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="e.g. 1234 or a secret word"
                    value={studentPasscode}
                    onChange={(e) => setStudentPasscode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-pink-500 focus:outline-none text-sm tracking-wider"
                  />
                </div>
              </div>

              {studentMode === 'new' && (
                <>
                  {/* Avatar */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ✨ Choose Avatar
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {AVATAR_OPTIONS.map((av) => (
                        <button
                          type="button"
                          key={av}
                          onClick={() => {
                            sound.playPop();
                            setSelectedAvatar(av);
                          }}
                          className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                            selectedAvatar === av
                              ? 'bg-pink-100 border-2 border-pink-500 scale-105'
                              : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Themes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      🎨 Adventure Theme
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {Object.values(THEMES).slice(0, 3).map((th) => (
                        <button
                          type="button"
                          key={th.id}
                          onClick={() => {
                            sound.playPop();
                            setSelectedTheme(th.id);
                          }}
                          className={`p-1.5 rounded-xl border text-left flex items-center gap-1 text-xs ${
                            selectedTheme === th.id
                              ? 'bg-pink-50 border-pink-400 text-pink-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <span>{th.icon}</span>
                          <span className="truncate">{th.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-extrabold text-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>
                    {isSubmitting
                      ? 'Saving...'
                      : studentMode === 'new'
                      ? '🌱 Start My Student Account'
                      : '🚀 Log In with Nickname'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PARENT FLOW */}
        {role === 'parent' && (
          <div>
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
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
                <span>Continue with Google</span>
              </button>

              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative px-3 bg-white text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  or with email
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => setParentMode('signin')}
                className={`py-1.5 rounded-lg transition-all ${
                  parentMode === 'signin' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setParentMode('signup')}
                className={`py-1.5 rounded-lg transition-all ${
                  parentMode === 'signup' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleParentSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  📧 Parent Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  🔐 Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="at least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{parentMode === 'signup' ? 'Create Parent Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

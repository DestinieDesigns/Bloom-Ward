import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { syncService, SyncStatus } from '../services/syncService';
import { UserProfile, ThemeId, LearningLevel } from '../types';
import {
  loadProfile,
  saveProfile,
  DEFAULT_PROFILE,
  createFreshProfile,
  clearAllLocalUserData
} from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  isCloudActive: boolean;
  syncStatus: SyncStatus;
  profiles: UserProfile[];
  activeProfile: UserProfile;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (
    email: string,
    password: string,
    studentName: string,
    avatar: string,
    theme: ThemeId,
    dailyGoal: number
  ) => Promise<{ success: boolean; error?: string }>;
  signInWithStudentCode: (username: string, passcode: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithStudentCode: (
    username: string,
    passcode: string,
    studentName: string,
    avatar: string,
    theme: ThemeId,
    dailyGoal: number
  ) => Promise<{ success: boolean; error?: string }>;
  startInstantStudentPlay: (
    studentName: string,
    avatar: string,
    theme: ThemeId,
    dailyGoal?: number
  ) => Promise<{ success: boolean; error?: string }>;
  signOutUser: () => Promise<void>;
  startGuestMode: (name?: string, avatar?: string, theme?: ThemeId) => void;
  createProfile: (data: {
    name: string;
    avatar: string;
    theme: ThemeId;
    dailyGoal?: number;
    learningLevel?: LearningLevel;
  }) => Promise<UserProfile>;
  switchProfile: (profileId: string) => Promise<void>;
  updateActiveProfile: (updated: Partial<UserProfile>) => Promise<void>;
  deleteProfile: (profileId: string) => Promise<boolean>;
  setGuestProfile: (profile: UserProfile) => void;
}

export const formatStudentEmailAlias = (username: string): string => {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  const finalUser = clean.length >= 2 ? clean : `student_${clean || 'user'}_${Date.now().toString().slice(-4)}`;
  return `${finalUser}@student.bloomword.app`;
};

export const formatStudentPassword = (passcode: string): string => {
  const clean = passcode.trim();
  if (clean.length < 6) {
    return `${clean}bloom123`.slice(0, 8);
  }
  return clean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bloomword_is_guest') === 'true';
    } catch {
      return false;
    }
  });
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile>(loadProfile);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Subscribe to sync service status changes
  useEffect(() => {
    const unsub = syncService.subscribe((status) => {
      setSyncStatus(status);
    });
    return unsub;
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        setIsGuest(false);
        try {
          localStorage.removeItem('bloomword_is_guest');
        } catch {}

        // Load cloud student profiles for this account
        try {
          const cloudProfiles = await syncService.loadStudentProfilesCloud(currentUser.uid);
          if (cloudProfiles.length > 0) {
            setProfiles(cloudProfiles);
            const target = cloudProfiles[0];
            setActiveProfile(target);
            saveProfile(target);
          } else {
            // First time cloud user: create a fresh profile
            const displayName = currentUser.displayName || 'Young Explorer';
            const initial: UserProfile = {
              ...createFreshProfile(displayName, '🌸', 'pink_garden'),
              accountId: currentUser.uid
            };
            await syncService.saveStudentProfileCloud(currentUser.uid, initial);
            setProfiles([initial]);
            setActiveProfile(initial);
            saveProfile(initial);
          }
        } catch (err) {
          console.warn('Could not load cloud profiles, using local:', err);
        }
      } else {
        // Logged out
        const local = loadProfile();
        setProfiles([local]);
        setActiveProfile(local);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign In with Email
  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) {
      return { success: false, error: 'Authentication is currently in offline mode.' };
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      setUser(cred.user);
      setIsGuest(false);
      try {
        localStorage.removeItem('bloomword_is_guest');
      } catch {}

      // Load cloud profiles
      const cloudProfiles = await syncService.loadStudentProfilesCloud(cred.user.uid);
      if (cloudProfiles.length > 0) {
        setProfiles(cloudProfiles);
        setActiveProfile(cloudProfiles[0]);
        saveProfile(cloudProfiles[0]);
      } else {
        const initial = {
          ...createFreshProfile('Young Explorer', '🌸', 'pink_garden'),
          accountId: cred.user.uid
        };
        await syncService.saveStudentProfileCloud(cred.user.uid, initial);
        setProfiles([initial]);
        setActiveProfile(initial);
        saveProfile(initial);
      }
      return { success: true };
    } catch (err: any) {
      let friendlyError = 'Could not sign in. Please check your credentials.';
      if (err.code === 'auth/user-not-found') {
        friendlyError = 'No account found with this email address.';
      } else if (err.code === 'auth/wrong-password') {
        friendlyError = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'Please enter a valid email address.';
      } else if (err.code === 'auth/invalid-credential') {
        friendlyError = 'Email or password incorrect. Please try again.';
      }
      return { success: false, error: friendlyError };
    }
  };

  // Sign In with Google
  const signInWithGoogle = async () => {
    if (!auth) {
      return { success: false, error: 'Authentication is currently in offline mode.' };
    }

    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      setUser(cred.user);
      setIsGuest(false);
      try {
        localStorage.removeItem('bloomword_is_guest');
      } catch {}

      const cloudProfiles = await syncService.loadStudentProfilesCloud(cred.user.uid);
      if (cloudProfiles.length > 0) {
        setProfiles(cloudProfiles);
        setActiveProfile(cloudProfiles[0]);
        saveProfile(cloudProfiles[0]);
      } else {
        const displayName = cred.user.displayName || 'Young Explorer';
        const initial = {
          ...createFreshProfile(displayName, '🌸', 'pink_garden'),
          accountId: cred.user.uid
        };
        await syncService.saveStudentProfileCloud(cred.user.uid, initial);
        setProfiles([initial]);
        setActiveProfile(initial);
        saveProfile(initial);
      }
      return { success: true };
    } catch (err: any) {
      console.warn('Google sign in error:', err);
      return { success: false, error: err.message || 'Could not sign in with Google.' };
    }
  };

  // Sign Up with Email
  const signUpWithEmail = async (
    email: string,
    password: string,
    studentName: string,
    avatar: string,
    theme: ThemeId,
    dailyGoal: number
  ) => {
    if (!auth) {
      return { success: false, error: 'Authentication is currently in offline mode.' };
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      setUser(cred.user);
      setIsGuest(false);
      try {
        localStorage.removeItem('bloomword_is_guest');
      } catch {}

      // Brand new fresh profile with 0 XP and level 1
      const newStudentProfile: UserProfile = {
        ...createFreshProfile(studentName.trim() || 'Young Explorer', avatar || '🌸', theme || 'pink_garden'),
        id: `prof-${Date.now()}`,
        accountId: cred.user.uid,
        dailyReadingGoalMinutes: dailyGoal || 15,
        onboardingCompleted: true
      };

      // Save to cloud
      await syncService.saveStudentProfileCloud(cred.user.uid, newStudentProfile);
      setProfiles([newStudentProfile]);
      setActiveProfile(newStudentProfile);
      saveProfile(newStudentProfile);

      return { success: true };
    } catch (err: any) {
      let friendlyError = 'Could not create account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'An account with this email already exists. Try signing in instead.';
      } else if (err.code === 'auth/weak-password') {
        friendlyError = 'Please choose a password with at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'Please enter a valid email address.';
      }
      return { success: false, error: friendlyError };
    }
  };

  // Student Sign Up with Username & Secret Passcode (NO EMAIL NEEDED!)
  const signUpWithStudentCode = async (
    username: string,
    passcode: string,
    studentName: string,
    avatar: string,
    theme: ThemeId,
    dailyGoal: number
  ) => {
    if (!auth) {
      startGuestMode(studentName || username, avatar, theme);
      return { success: true };
    }

    const cleanUser = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanUser) {
      return { success: false, error: 'Please choose a nickname with letters or numbers.' };
    }
    if (!passcode.trim()) {
      return { success: false, error: 'Please enter a secret code or PIN so you can log back in.' };
    }

    const studentEmail = formatStudentEmailAlias(cleanUser);
    const studentPass = formatStudentPassword(passcode);

    try {
      const cred = await createUserWithEmailAndPassword(auth, studentEmail, studentPass);
      setUser(cred.user);
      setIsGuest(false);
      try {
        localStorage.removeItem('bloomword_is_guest');
      } catch {}

      const newStudentProfile: UserProfile = {
        ...createFreshProfile(studentName.trim() || username.trim(), avatar || '🌸', theme || 'pink_garden'),
        id: `prof-${Date.now()}`,
        accountId: cred.user.uid,
        dailyReadingGoalMinutes: dailyGoal || 15,
        onboardingCompleted: true
      };

      await syncService.saveStudentProfileCloud(cred.user.uid, newStudentProfile);
      setProfiles([newStudentProfile]);
      setActiveProfile(newStudentProfile);
      saveProfile(newStudentProfile);

      return { success: true };
    } catch (err: any) {
      console.warn('Student sign up error:', err);
      let friendlyError = 'Could not create student account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyError = `Nickname "${cleanUser}" is already taken! Try adding your favorite number (like ${cleanUser}7) or log in with your secret code.`;
      } else if (err.code === 'auth/weak-password') {
        friendlyError = 'Secret code should be at least 4 characters or numbers.';
      }
      return { success: false, error: friendlyError };
    }
  };

  // Student Sign In with Username & Secret Passcode (NO EMAIL NEEDED!)
  const signInWithStudentCode = async (username: string, passcode: string) => {
    if (!auth) {
      return { success: false, error: 'Authentication is currently in offline mode.' };
    }

    const cleanUser = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanUser) {
      return { success: false, error: 'Please enter your student nickname.' };
    }
    if (!passcode.trim()) {
      return { success: false, error: 'Please enter your secret code or PIN.' };
    }

    const studentEmail = formatStudentEmailAlias(cleanUser);
    const studentPass = formatStudentPassword(passcode);

    try {
      const cred = await signInWithEmailAndPassword(auth, studentEmail, studentPass);
      setUser(cred.user);
      setIsGuest(false);
      try {
        localStorage.removeItem('bloomword_is_guest');
      } catch {}

      const cloudProfiles = await syncService.loadStudentProfilesCloud(cred.user.uid);
      if (cloudProfiles.length > 0) {
        setProfiles(cloudProfiles);
        setActiveProfile(cloudProfiles[0]);
        saveProfile(cloudProfiles[0]);
      } else {
        const initial = {
          ...createFreshProfile(username.trim() || 'Young Explorer', '🌸', 'pink_garden'),
          accountId: cred.user.uid
        };
        await syncService.saveStudentProfileCloud(cred.user.uid, initial);
        setProfiles([initial]);
        setActiveProfile(initial);
        saveProfile(initial);
      }
      return { success: true };
    } catch (err: any) {
      console.warn('Student sign in error:', err);
      let friendlyError = 'Incorrect nickname or secret code. Please try again!';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        friendlyError = `No student found with nickname "${cleanUser}". Check the spelling or create a new student account!`;
      } else if (err.code === 'auth/wrong-password') {
        friendlyError = 'Incorrect secret code for this nickname. Please try again!';
      }
      return { success: false, error: friendlyError };
    }
  };

  // 1-Click Instant Student Play (Save to cloud anonymously without any password or email!)
  const startInstantStudentPlay = async (
    studentName: string,
    avatar: string,
    theme: ThemeId,
    dailyGoal: number = 15
  ) => {
    const finalName = studentName.trim() || 'Young Explorer';

    if (auth) {
      try {
        const cred = await signInAnonymously(auth);
        setUser(cred.user);
        setIsGuest(false);
        try {
          localStorage.removeItem('bloomword_is_guest');
        } catch {}

        const newStudentProfile: UserProfile = {
          ...createFreshProfile(finalName, avatar || '🌸', theme || 'pink_garden'),
          id: `prof-${Date.now()}`,
          accountId: cred.user.uid,
          dailyReadingGoalMinutes: dailyGoal,
          onboardingCompleted: true
        };

        await syncService.saveStudentProfileCloud(cred.user.uid, newStudentProfile);
        setProfiles([newStudentProfile]);
        setActiveProfile(newStudentProfile);
        saveProfile(newStudentProfile);

        return { success: true };
      } catch (err) {
        console.warn('Anonymous sign-in error, falling back to local guest mode:', err);
      }
    }

    // Fallback: local guest mode
    startGuestMode(finalName, avatar, theme);
    return { success: true };
  };

  // Start fresh Guest Mode
  const startGuestMode = (
    name = 'Young Explorer',
    avatar = '🌸',
    theme: ThemeId = 'pink_garden'
  ) => {
    const fresh = createFreshProfile(name, avatar, theme);
    fresh.accountId = 'guest';
    saveProfile(fresh);
    setActiveProfile(fresh);
    setProfiles([fresh]);
    setIsGuest(true);
    try {
      localStorage.setItem('bloomword_is_guest', 'true');
    } catch {}
  };

  // Sign Out
  const signOutUser = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch {}
    }
    setUser(null);
    setIsGuest(false);
    clearAllLocalUserData();
    const fresh = createFreshProfile();
    setProfiles([fresh]);
    setActiveProfile(fresh);
  };

  // Create additional student profile (for siblings or family members)
  const createProfile = async (data: {
    name: string;
    avatar: string;
    theme: ThemeId;
    dailyGoal?: number;
    learningLevel?: LearningLevel;
  }): Promise<UserProfile> => {
    const newProfile: UserProfile = {
      ...createFreshProfile(data.name.trim() || 'Young Explorer', data.avatar || '🌸', data.theme || 'pink_garden'),
      id: `prof-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      accountId: user ? user.uid : 'guest',
      dailyReadingGoalMinutes: data.dailyGoal || 15,
      learningLevel: data.learningLevel || 'elementary',
      onboardingCompleted: true,
      lastActiveDate: new Date().toISOString().split('T')[0]
    };

    const updatedList = [...profiles, newProfile];
    setProfiles(updatedList);
    setActiveProfile(newProfile);
    saveProfile(newProfile);

    if (user) {
      await syncService.saveStudentProfileCloud(user.uid, newProfile);
    }

    return newProfile;
  };

  // Switch Active Student Profile
  const switchProfile = async (profileId: string) => {
    const target = profiles.find((p) => p.id === profileId);
    if (target) {
      setActiveProfile(target);
      saveProfile(target);

      if (user) {
        // Inform cloud of last active
        await syncService.saveStudentProfileCloud(user.uid, target);
      }
    }
  };

  // Update Active Profile
  const updateActiveProfile = async (updated: Partial<UserProfile>) => {
    const merged: UserProfile = {
      ...activeProfile,
      ...updated,
      id: activeProfile.id || `prof-${Date.now()}`
    };

    setActiveProfile(merged);
    saveProfile(merged);

    setProfiles((prev) =>
      prev.map((p) => (p.id === merged.id ? merged : p))
    );

    if (user) {
      syncService.scheduleAutoSync(async () => {
        await syncService.saveStudentProfileCloud(user.uid, merged);
      }, 1000);
    }
  };

  // Delete a student profile
  const deleteProfile = async (profileId: string): Promise<boolean> => {
    if (profiles.length <= 1) {
      // Cannot delete the only remaining profile
      return false;
    }

    const remaining = profiles.filter((p) => p.id !== profileId);
    setProfiles(remaining);

    if (activeProfile.id === profileId) {
      setActiveProfile(remaining[0]);
      saveProfile(remaining[0]);
    }

    if (user) {
      await syncService.deleteStudentProfileCloud(user.uid, profileId);
    }
    return true;
  };

  const setGuestProfile = (profile: UserProfile) => {
    setActiveProfile(profile);
    saveProfile(profile);
    setProfiles([profile]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        isCloudActive: !!user,
        syncStatus,
        profiles,
        activeProfile,
        isLoading,
        signInWithEmail,
        signInWithGoogle,
        signUpWithEmail,
        signInWithStudentCode,
        signUpWithStudentCode,
        startInstantStudentPlay,
        startGuestMode,
        signOutUser,
        createProfile,
        switchProfile,
        updateActiveProfile,
        deleteProfile,
        setGuestProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

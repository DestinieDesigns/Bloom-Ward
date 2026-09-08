import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import {
  UserProfile,
  VocabWord,
  ReadingSession,
  BookRecord,
  WeeklyAssessmentResult,
  GardenPlot,
  AchievementBadge
} from '../types';

export type SyncStatus = 'synced' | 'saving' | 'offline' | 'error';

type StatusListener = (status: SyncStatus) => void;

class SyncService {
  private currentStatus: SyncStatus = 'synced';
  private listeners: StatusListener[] = [];
  private saveDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  public subscribe(listener: StatusListener): () => void {
    this.listeners.push(listener);
    listener(this.currentStatus);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private setStatus(status: SyncStatus) {
    this.currentStatus = status;
    this.listeners.forEach((l) => l(status));
  }

  public getStatus(): SyncStatus {
    return this.currentStatus;
  }

  // --- Student Profile Cloud Operations ---
  public async saveStudentProfileCloud(userId: string, profile: UserProfile): Promise<boolean> {
    if (!db || !userId) {
      this.setStatus('offline');
      return false;
    }

    try {
      this.setStatus('saving');
      const profileRef = doc(db, 'users', userId, 'profiles', profile.id);
      await setDoc(
        profileRef,
        {
          ...profile,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );

      // Also ensure root user doc tracks active profile
      const userRef = doc(db, 'users', userId);
      await setDoc(
        userRef,
        {
          lastActiveProfileId: profile.id,
          lastActiveDate: new Date().toISOString()
        },
        { merge: true }
      );

      this.setStatus('synced');
      return true;
    } catch (error) {
      console.warn('Error saving student profile to cloud:', error);
      this.setStatus('offline');
      return false;
    }
  }

  public async loadStudentProfilesCloud(userId: string): Promise<UserProfile[]> {
    if (!db || !userId) return [];

    try {
      const profilesRef = collection(db, 'users', userId, 'profiles');
      const snapshot = await getDocs(profilesRef);
      const list: UserProfile[] = [];
      snapshot.forEach((docSnap) => {
        if (docSnap.exists()) {
          list.push(docSnap.data() as UserProfile);
        }
      });
      return list;
    } catch (error) {
      console.warn('Error loading student profiles from cloud:', error);
      return [];
    }
  }

  public async deleteStudentProfileCloud(userId: string, profileId: string): Promise<boolean> {
    if (!db || !userId) return false;
    try {
      const profileRef = doc(db, 'users', userId, 'profiles', profileId);
      await deleteDoc(profileRef);
      return true;
    } catch (error) {
      console.warn('Error deleting student profile from cloud:', error);
      return false;
    }
  }

  // --- Vocabulary Cloud Operations ---
  public async saveWordsCloud(
    userId: string,
    profileId: string,
    words: VocabWord[]
  ): Promise<boolean> {
    if (!db || !userId || !profileId) {
      this.setStatus('offline');
      return false;
    }

    try {
      this.setStatus('saving');
      const docRef = doc(db, 'users', userId, 'profiles', profileId, 'data', 'vocabulary');
      await setDoc(
        docRef,
        {
          words,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
      this.setStatus('synced');
      return true;
    } catch (error) {
      console.warn('Error saving vocabulary to cloud:', error);
      this.setStatus('offline');
      return false;
    }
  }

  public async loadWordsCloud(
    userId: string,
    profileId: string
  ): Promise<VocabWord[] | null> {
    if (!db || !userId || !profileId) return null;

    try {
      const docRef = doc(db, 'users', userId, 'profiles', profileId, 'data', 'vocabulary');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        return (data.words as VocabWord[]) || null;
      }
      return null;
    } catch (error) {
      console.warn('Error loading vocabulary from cloud:', error);
      return null;
    }
  }

  // --- Reading Sessions Cloud Operations ---
  public async saveReadingSessionsCloud(
    userId: string,
    profileId: string,
    sessions: ReadingSession[],
    books: BookRecord[]
  ): Promise<boolean> {
    if (!db || !userId || !profileId) {
      this.setStatus('offline');
      return false;
    }

    try {
      this.setStatus('saving');
      const docRef = doc(db, 'users', userId, 'profiles', profileId, 'data', 'reading');
      await setDoc(
        docRef,
        {
          sessions,
          books,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
      this.setStatus('synced');
      return true;
    } catch (error) {
      console.warn('Error saving reading data to cloud:', error);
      this.setStatus('offline');
      return false;
    }
  }

  public async loadReadingDataCloud(
    userId: string,
    profileId: string
  ): Promise<{ sessions: ReadingSession[]; books: BookRecord[] } | null> {
    if (!db || !userId || !profileId) return null;

    try {
      const docRef = doc(db, 'users', userId, 'profiles', profileId, 'data', 'reading');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        return {
          sessions: (data.sessions as ReadingSession[]) || [],
          books: (data.books as BookRecord[]) || []
        };
      }
      return null;
    } catch (error) {
      console.warn('Error loading reading data from cloud:', error);
      return null;
    }
  }

  // --- Weekly Assessments Cloud Operations ---
  public async saveAssessmentsCloud(
    userId: string,
    profileId: string,
    assessments: WeeklyAssessmentResult[]
  ): Promise<boolean> {
    if (!db || !userId || !profileId) return false;

    try {
      const docRef = doc(db, 'users', userId, 'profiles', profileId, 'data', 'assessments');
      await setDoc(
        docRef,
        {
          assessments,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
      return true;
    } catch (error) {
      console.warn('Error saving assessments to cloud:', error);
      return false;
    }
  }

  public async loadAssessmentsCloud(
    userId: string,
    profileId: string
  ): Promise<WeeklyAssessmentResult[] | null> {
    if (!db || !userId || !profileId) return null;

    try {
      const docRef = doc(db, 'users', userId, 'profiles', profileId, 'data', 'assessments');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        return (data.assessments as WeeklyAssessmentResult[]) || null;
      }
      return null;
    } catch (error) {
      console.warn('Error loading assessments from cloud:', error);
      return null;
    }
  }

  // --- Garden & Badges Cloud Operations ---
  public async saveWorldDataCloud(
    userId: string,
    profileId: string,
    plots: GardenPlot[],
    badges: AchievementBadge[]
  ): Promise<boolean> {
    if (!db || !userId || !profileId) return false;

    try {
      const docRef = doc(db, 'users', userId, 'profiles', profileId, 'data', 'world');
      await setDoc(
        docRef,
        {
          plots,
          badges,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
      return true;
    } catch (error) {
      console.warn('Error saving world data to cloud:', error);
      return false;
    }
  }

  public async loadWorldDataCloud(
    userId: string,
    profileId: string
  ): Promise<{ plots: GardenPlot[]; badges: AchievementBadge[] } | null> {
    if (!db || !userId || !profileId) return null;

    try {
      const docRef = doc(db, 'users', userId, 'profiles', profileId, 'data', 'world');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        return {
          plots: (data.plots as GardenPlot[]) || [],
          badges: (data.badges as AchievementBadge[]) || []
        };
      }
      return null;
    } catch (error) {
      console.warn('Error loading world data from cloud:', error);
      return null;
    }
  }

  // Debounced auto-sync trigger
  public scheduleAutoSync(syncFn: () => Promise<void>, delayMs: number = 2000) {
    if (this.saveDebounceTimer) {
      clearTimeout(this.saveDebounceTimer);
    }
    this.setStatus('saving');
    this.saveDebounceTimer = setTimeout(async () => {
      try {
        await syncFn();
        this.setStatus('synced');
      } catch (err) {
        console.warn('AutoSync failed:', err);
        this.setStatus('offline');
      }
    }, delayMs);
  }
}

export const syncService = new SyncService();

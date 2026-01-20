// src/stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Course, Exam } from "../types";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// User preferences
interface Preferences {
  tts: boolean;
  stt: boolean;
  contrastMode: boolean;
  dyslexiaFont: boolean;
}

// User profile type
interface UserProfile {
  uid: string;
  name?: string;
  email: string | null;
  disabilityType?: string;
  onboardingCompleted: boolean;
  preferences: Preferences;
  profilePicture?: string;
  quote?: string;
  age?: number;
  ambition?: string;
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  courses: Course[];
  exams: Exam[];
}

// Payload for registration
interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  disabilityType: string;
}

// Auth store interface
interface AuthStore {
  user: UserProfile | null;
  isLoading: boolean;
  register: (payload: RegisterPayload) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  fetchUserProfile: (uid: string) => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  addBadge: (badge: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      // Register new user
      register: async ({ name, email, password, disabilityType }) => {
        set({ isLoading: true });
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          const userProfile: UserProfile = {
            uid: user.uid,
            name,
            email: user.email,
            disabilityType,
            onboardingCompleted: false,
            preferences: {
              tts: disabilityType === "blind",
              stt: disabilityType === "deaf",
              contrastMode: false,
              dyslexiaFont: disabilityType === "dyslexic",
            },
            xp: 0,
            level: 1,
            streak: 0,
            badges: [],
            courses: [],
            exams: [],
          };

          await setDoc(doc(db, "users", user.uid), userProfile);
          set({ user: userProfile });
        } catch (error) {
          console.error("Register error:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Login existing user
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          await get().fetchUserProfile(user.uid);
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Login with Google
      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          const provider = new GoogleAuthProvider();
          const userCredential = await signInWithPopup(auth, provider);
          const user = userCredential.user;

          // Check if user profile exists
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          if (!userDoc.exists()) {
            // Create new user profile for Google sign-in
            const userProfile: UserProfile = {
              uid: user.uid,
              name: user.displayName || undefined,
              email: user.email,
              disabilityType: "none",
              onboardingCompleted: false,
              preferences: {
                tts: false,
                stt: false,
                contrastMode: false,
                dyslexiaFont: false,
              },
              profilePicture: user.photoURL || undefined,
              xp: 0,
              level: 1,
              streak: 0,
              badges: [],
              courses: [],
              exams: [],
            };

            await setDoc(doc(db, "users", user.uid), userProfile);
            set({ user: userProfile });
          } else {
            await get().fetchUserProfile(user.uid);
          }
        } catch (error) {
          console.error("Google login error:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout
      logout: async () => {
        await signOut(auth);
        set({ user: null });
      },

      // Fetch user profile
      fetchUserProfile: async (uid) => {
        try {
          const userDoc = await getDoc(doc(db, "users", uid));
          if (userDoc.exists()) {
            set({ user: userDoc.data() as UserProfile });
          }
        } catch (error) {
          console.error("Fetch user profile error:", error);
        }
      },

      // Update user
      updateUser: async (data: Partial<UserProfile>) => {
        const { user } = get();
        if (!user) return;

        try {
          await updateDoc(doc(db, "users", user.uid), data);
          const updatedUser = { ...user, ...data };
          set({ user: updatedUser });
        } catch (error) {
          console.error("Update user error:", error);
          throw error;
        }
      },

      // Add XP and update level
      addXP: (amount: number) => {
        const { user } = get();
        if (!user) return;

        const newXP = user.xp + amount;
        const newLevel = Math.floor(newXP / 500) + 1; // Level up every 500 XP

        set({ 
          user: { 
            ...user, 
            xp: newXP, 
            level: newLevel 
          } 
        });
      },

      // Update streak
      updateStreak: () => {
        const { user } = get();
        if (!user) return;

        set({ 
          user: { 
            ...user, 
            streak: user.streak + 1 
          } 
        });
      },

      // Add badge
      addBadge: (badge: string) => {
        const { user } = get();
        if (!user || user.badges.includes(badge)) return;

        set({ 
          user: { 
            ...user, 
            badges: [...user.badges, badge] 
          } 
        });
      },
    }),
    { name: "auth-storage" } // persist in localStorage
  )
);

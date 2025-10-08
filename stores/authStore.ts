// src/stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
  logout: () => Promise<void>;
  fetchUserProfile: (uid: string) => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
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

          // Build profile
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
          };

          // Save to Firestore
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

          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            set({ user: docSnap.data() as UserProfile });
          } else {
            // fallback
            set({
              user: {
                uid: user.uid,
                email: user.email,
                onboardingCompleted: false,
                preferences: { tts: false, stt: false, contrastMode: false, dyslexiaFont: false },
              },
            });
          }
        } catch (error) {
          console.error("Login error:", error);
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

      // Fetch user profile (useful after updates)
      fetchUserProfile: async (uid) => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          set({ user: docSnap.data() as UserProfile });
        }
      },

      // Update user (both Zustand + Firestore)
      updateUser: async (data: Partial<UserProfile>) => {
        const { user } = get();
        if (!user) return;

        const updatedUser = { ...user, ...data };
        set({ user: updatedUser });

        try {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, data);
        } catch (err) {
          console.error("Error updating user:", err);
        }
      },
    }),
    { name: "auth-storage" } // persist in localStorage
  )
);

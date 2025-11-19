// src/stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
// import { auth, db } from "../firebase";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
// import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

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

      // Register new user (mock implementation)
      register: async ({ name, email, password, disabilityType }) => {
        set({ isLoading: true });
        try {
          // Mock user creation
          const mockUser: UserProfile = {
            uid: 'mock-' + Date.now(),
            name,
            email,
            disabilityType,
            onboardingCompleted: false,
            preferences: {
              tts: disabilityType === "blind",
              stt: disabilityType === "deaf",
              contrastMode: false,
              dyslexiaFont: disabilityType === "dyslexic",
            },
          };

          set({ user: mockUser });
        } catch (error) {
          console.error("Register error:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Login existing user (mock implementation)
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          // Mock login - accept any credentials
          const mockUser: UserProfile = {
            uid: 'mock-user-123',
            name: 'Demo User',
            email,
            onboardingCompleted: true,
            preferences: { tts: false, stt: false, contrastMode: false, dyslexiaFont: false },
          };
          
          set({ user: mockUser });
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout (mock implementation)
      logout: async () => {
        set({ user: null });
      },

      // Fetch user profile (mock implementation)
      fetchUserProfile: async (uid) => {
        // Mock - do nothing
        console.log('Mock fetchUserProfile called for uid:', uid);
      },

      // Update user (mock implementation)
      updateUser: async (data: Partial<UserProfile>) => {
        const { user } = get();
        if (!user) return;

        const updatedUser = { ...user, ...data };
        set({ user: updatedUser });
      },
    }),
    { name: "auth-storage" } // persist in localStorage
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccessibilityState {
  isDyslexicFont: boolean;
  isHighContrast: boolean;
  isReducedMotion: boolean;
  isDarkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  isTTSEnabled: boolean;
  isSTTEnabled: boolean;
  speechRate: number;
  speechVolume: number;
  toggleDyslexicFont: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleDarkMode: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  toggleTTS: () => void;
  toggleSTT: () => void;
  setSpeechRate: (rate: number) => void;
  setSpeechVolume: (volume: number) => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      isDyslexicFont: false,
      isHighContrast: false,
      isReducedMotion: false,
      isDarkMode: false,
      fontSize: 'medium',
      isTTSEnabled: false,
      isSTTEnabled: false,
      speechRate: 1,
      speechVolume: 1,

      toggleDyslexicFont: () => set((state) => ({ isDyslexicFont: !state.isDyslexicFont })),
      
      toggleHighContrast: () => set((state) => ({ isHighContrast: !state.isHighContrast })),
      
      toggleReducedMotion: () => set((state) => ({ isReducedMotion: !state.isReducedMotion })),
      
      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
        document.documentElement.classList.toggle('dark');
      },
      
      setFontSize: (size: 'small' | 'medium' | 'large') => {
        set({ fontSize: size });
        const sizes = { small: '14px', medium: '16px', large: '18px' };
        document.documentElement.style.fontSize = sizes[size];
      },
      
      toggleTTS: () => set((state) => ({ isTTSEnabled: !state.isTTSEnabled })),
      
      toggleSTT: () => set((state) => ({ isSTTEnabled: !state.isSTTEnabled })),
      
      setSpeechRate: (rate: number) => set({ speechRate: rate }),
      
      setSpeechVolume: (volume: number) => set({ speechVolume: volume }),
      
      speak: (text: string) => {
        const { isTTSEnabled, speechRate, speechVolume } = get();
        if (isTTSEnabled && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = speechRate;
          utterance.volume = speechVolume;
          speechSynthesis.speak(utterance);
        }
      },
      
      stopSpeaking: () => {
        if ('speechSynthesis' in window) {
          speechSynthesis.cancel();
        }
      },
    }),
    {
      name: 'accessibility-storage',
    }
  )
);
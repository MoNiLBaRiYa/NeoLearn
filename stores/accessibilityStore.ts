import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccessibilityState {
  isDyslexicFont: boolean;
  isHighContrast: boolean;
  isReducedMotion: boolean;
  isDarkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  isTTSEnabled: boolean;
  speechRate: number;
  speechVolume: number;
  isKeyboardOnlyMode: boolean;
  isFocusHighlight: boolean;
  colorBlindType: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  isLargeClickTargets: boolean;
  isTextSpacing: boolean;
  isLineHeight: boolean;
  isLetterSpacing: boolean;
  
  toggleDyslexicFont: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleDarkMode: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  toggleTTS: () => void;
  setSpeechRate: (rate: number) => void;
  setSpeechVolume: (volume: number) => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  toggleKeyboardOnlyMode: () => void;
  toggleFocusHighlight: () => void;
  setColorBlindType: (type: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia') => void;
  toggleLargeClickTargets: () => void;
  toggleTextSpacing: () => void;
  toggleLineHeight: () => void;
  toggleLetterSpacing: () => void;
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
      speechRate: 1,
      speechVolume: 1,
      isKeyboardOnlyMode: false,
      isFocusHighlight: false,
      colorBlindType: 'none',
      isLargeClickTargets: false,
      isTextSpacing: false,
      isLineHeight: false,
      isLetterSpacing: false,

      toggleDyslexicFont: () => set((state) => ({ isDyslexicFont: !state.isDyslexicFont })),
      toggleHighContrast: () => set((state) => ({ isHighContrast: !state.isHighContrast })),
      toggleReducedMotion: () => set((state) => ({ isReducedMotion: !state.isReducedMotion })),
      
      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
        document.documentElement.classList.toggle('dark');
      },
      
      setFontSize: (size) => {
        set({ fontSize: size });
        const sizes = { small: '14px', medium: '16px', large: '18px' };
        document.documentElement.style.fontSize = sizes[size];
      },
      
      toggleTTS: () => set((state) => ({ isTTSEnabled: !state.isTTSEnabled })),
      setSpeechRate: (rate) => set({ speechRate: rate }),
      setSpeechVolume: (volume) => set({ speechVolume: volume }),
      
      speak: (text) => {
        const { isTTSEnabled, speechRate, speechVolume } = get();
        if (isTTSEnabled && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = speechRate;
          utterance.volume = speechVolume;
          speechSynthesis.speak(utterance);
        }
      },
      
      stopSpeaking: () => {
        if ('speechSynthesis' in window) speechSynthesis.cancel();
      },
      
      toggleKeyboardOnlyMode: () => {
        set((state) => ({ isKeyboardOnlyMode: !state.isKeyboardOnlyMode }));
        document.body.classList.toggle('keyboard-only-mode');
      },
      
      toggleFocusHighlight: () => {
        set((state) => ({ isFocusHighlight: !state.isFocusHighlight }));
        document.body.classList.toggle('focus-highlight');
      },
      
      setColorBlindType: (type) => {
        set({ colorBlindType: type });
        document.body.classList.remove('color-blind-protanopia', 'color-blind-deuteranopia', 'color-blind-tritanopia', 'color-blind-achromatopsia');
        if (type !== 'none') document.body.classList.add(`color-blind-${type}`);
      },
      
      toggleLargeClickTargets: () => {
        set((state) => ({ isLargeClickTargets: !state.isLargeClickTargets }));
        document.body.classList.toggle('large-click-targets');
      },
      
      toggleTextSpacing: () => {
        set((state) => ({ isTextSpacing: !state.isTextSpacing }));
        document.body.classList.toggle('text-spacing');
      },
      
      toggleLineHeight: () => {
        set((state) => ({ isLineHeight: !state.isLineHeight }));
        document.body.classList.toggle('increased-line-height');
      },
      
      toggleLetterSpacing: () => {
        set((state) => ({ isLetterSpacing: !state.isLetterSpacing }));
        document.body.classList.toggle('increased-letter-spacing');
      },
    }),
    { name: 'accessibility-storage' }
  )
);

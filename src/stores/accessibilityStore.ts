import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccessibilityState {
  // 状态
  highContrast: boolean;
  fontSize: number;
  reducedMotion: boolean;
  screenReaderMode: boolean;

  // 动作
  toggleHighContrast: () => void;
  setFontSize: (size: number) => void;
  toggleReducedMotion: () => void;
  toggleScreenReaderMode: () => void;
  resetAccessibility: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      // 初始状态
      highContrast: false,
      fontSize: 100,
      reducedMotion: false,
      screenReaderMode: false,

      // 动作实现
      toggleHighContrast: () =>
        set((state) => {
          const newHighContrast = !state.highContrast;
          // 应用到 document
          if (newHighContrast) {
            document.documentElement.classList.add('high-contrast');
          } else {
            document.documentElement.classList.remove('high-contrast');
          }
          return { highContrast: newHighContrast };
        }),

      setFontSize: (size) =>
        set((state) => {
          const clampedSize = Math.min(Math.max(size, 80), 150); // 限制在 80%-150%
          document.documentElement.style.fontSize = `${clampedSize}%`;
          return { fontSize: clampedSize };
        }),

      toggleReducedMotion: () =>
        set((state) => {
          const newReducedMotion = !state.reducedMotion;
          if (newReducedMotion) {
            document.documentElement.classList.add('reduce-motion');
          } else {
            document.documentElement.classList.remove('reduce-motion');
          }
          return { reducedMotion: newReducedMotion };
        }),

      toggleScreenReaderMode: () =>
        set((state) => ({ screenReaderMode: !state.screenReaderMode })),

      resetAccessibility: () =>
        set(() => {
          document.documentElement.classList.remove('high-contrast', 'reduce-motion');
          document.documentElement.style.fontSize = '100%';
          return {
            highContrast: false,
            fontSize: 100,
            reducedMotion: false,
            screenReaderMode: false,
          };
        }),
    }),
    {
      name: 'aetherviz-accessibility', // localStorage key
    }
  )
);

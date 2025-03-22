import { StateCreator } from 'zustand';

export const applyMode = (mode: Mode) => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');

  if (mode === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(mode);
  }
};

export const applyColor = (color: Color) => {
  document.body.classList.forEach((className) => {
    if (className.startsWith('theme-')) {
      document.body.classList.remove(className);
    }
  });
  document.body.classList.add(`theme-${color}`);
};

const DEFAULT_MODE = 'light';
const DEFAULT_COLOR = 'default';

type Mode = 'dark' | 'light' | 'system';
type Color = 'default' | 'indigo' | 'lime' | 'slate';

export interface ThemeState {
  mode: Mode;
  setMode: (mode: Mode) => void;
  color: Color;
  setColor: (color: Color) => void;
}

const createThemeSlice: StateCreator<ThemeState> = (set) => {
  return {
    mode: DEFAULT_MODE,
    color: DEFAULT_COLOR,
    setMode: (mode) => {
      applyMode(mode);
      set({ mode });
    },
    setColor: (color) => {
      applyColor(color);
      set({ color });
    },
  };
};

export default createThemeSlice;

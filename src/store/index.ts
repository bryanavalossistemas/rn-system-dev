import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import createAuthSlice, { AuthState } from '@/store/authSlice';
import createThemeSlice, { applyColor, applyMode, ThemeState } from '@/store/themeSlice';

export const useStore = create<AuthState & ThemeState>()(
  persist(
    (set, get, api) => ({
      ...createAuthSlice(set, get, api),
      ...createThemeSlice(set, get, api),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        mode: state.mode,
        color: state.color,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyMode(state.mode);
          applyColor(state.color);
        }
      },
    },
  ),
);

export default useStore;

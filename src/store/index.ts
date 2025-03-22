import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import createAuthSlice, { AuthState } from './authSlice';
import createThemeSlice, { applyColor, applyMode, ThemeState } from './themeSlice';
import createCategoriesSlice, { CategoriesState } from './categoriesSlice';
import createBrandsSlice, { BrandsState } from './brandsSlice';
import createProductsSlice, { ProductsState } from './productsSlice';
import createSuppliersSlice, { SuppliersState } from './suppliersSlice';
import createPurchasesSlice, { PurchasesState } from './purchasesSlice';

export const useStore = create<AuthState & ThemeState & CategoriesState & BrandsState & ProductsState & SuppliersState & PurchasesState>()(
  persist(
    (set, get, api) => ({
      ...createAuthSlice(set, get, api),
      ...createThemeSlice(set, get, api),
      ...createCategoriesSlice(set, get, api),
      ...createBrandsSlice(set, get, api),
      ...createProductsSlice(set, get, api),
      ...createSuppliersSlice(set, get, api),
      ...createPurchasesSlice(set, get, api),
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

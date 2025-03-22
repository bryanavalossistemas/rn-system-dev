import { StateCreator } from 'zustand';

const DEFAULT_DATE_OPTION = 'always';

export interface CategoriesState {
  dateOptionCategories: string;
  setDateOptionCategories: (newDateOptionCategories: string) => void;
}

const createCategoriesSlice: StateCreator<CategoriesState> = (set) => {
  return {
    dateOptionCategories: DEFAULT_DATE_OPTION,
    setDateOptionCategories: (newDateOptionCategories) => {
      set({ dateOptionCategories: newDateOptionCategories });
    },
  };
};

export default createCategoriesSlice;

import { StateCreator } from 'zustand';

const DEFAULT_DATE_OPTION = 'always';

export interface ProductsState {
  dateOptionProducts: string;
  setDateOptionProducts: (newDateOptionProducts: string) => void;
}

const createProductsSlice: StateCreator<ProductsState> = (set) => {
  return {
    dateOptionProducts: DEFAULT_DATE_OPTION,
    setDateOptionProducts: (newDateOptionProducts) => {
      set({ dateOptionProducts: newDateOptionProducts });
    },
  };
};

export default createProductsSlice;

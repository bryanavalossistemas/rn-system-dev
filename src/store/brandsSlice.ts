import { StateCreator } from 'zustand';

const DEFAULT_DATE_OPTION = 'always';

export interface BrandsState {
  dateOptionBrands: string;
  setDateOptionBrands: (newDateOptionBrands: string) => void;
}

const createBrandsSlice: StateCreator<BrandsState> = (set) => {
  return {
    dateOptionBrands: DEFAULT_DATE_OPTION,
    setDateOptionBrands: (newDateOptionBrands) => {
      set({ dateOptionBrands: newDateOptionBrands });
    },
  };
};

export default createBrandsSlice;

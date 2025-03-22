import { StateCreator } from 'zustand';

const DEFAULT_DATE_OPTION = 'month';

export interface PurchasesState {
  dateOptionPurchases: string;
  setDateOptionPurchases: (newDateOptionPurchases: string) => void;
}

const createPurchasesSlice: StateCreator<PurchasesState> = (set) => {
  return {
    dateOptionPurchases: DEFAULT_DATE_OPTION,
    setDateOptionPurchases: (newDateOptionPurchases) => {
      set({ dateOptionPurchases: newDateOptionPurchases });
    },
  };
};

export default createPurchasesSlice;

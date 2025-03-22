import { StateCreator } from 'zustand';

const DEFAULT_DATE_OPTION = 'always';

export interface SuppliersState {
  dateOptionSuppliers: string;
  setDateOptionSuppliers: (newDateOptionSuppliers: string) => void;
}

const createSuppliersSlice: StateCreator<SuppliersState> = (set) => {
  return {
    dateOptionSuppliers: DEFAULT_DATE_OPTION,
    setDateOptionSuppliers: (newDateOptionSuppliers) => {
      set({ dateOptionSuppliers: newDateOptionSuppliers });
    },
  };
};

export default createSuppliersSlice;

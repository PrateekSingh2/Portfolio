import { create } from "zustand";

interface StoreState {
  isRecruiterMode: boolean;
  toggleRecruiterMode: () => void;
  setRecruiterMode: (value: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  isRecruiterMode: false,
  toggleRecruiterMode: () =>
    set((state) => ({ isRecruiterMode: !state.isRecruiterMode })),
  setRecruiterMode: (value) => set({ isRecruiterMode: value }),
}));

import { create } from "zustand";

interface SetPropertiesState {
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
}

export const useSetPropertiesStore = create<SetPropertiesState>((set) => ({
  isDirty: false,
  setIsDirty: (isDirty) => set({ isDirty }),
}));

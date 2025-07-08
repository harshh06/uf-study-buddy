import { create } from "zustand";

export type NavigationOption =
  | "Dashboard"
  | "Quiz"
  | "Results"
  | "Topics"
  | "Upload Syllabus";

interface NavigationState {
  selected: NavigationOption;
  setSelected: (option: NavigationOption) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  selected: "Dashboard",
  setSelected: (option) => set({ selected: option }),
}));

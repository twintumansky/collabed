import { create } from "zustand";
import type { LayerType } from "@/types";

type UIState = {
  activeTool: LayerType;
  setActiveTool: (tool: LayerType) => void;
};

export const useUIStore = create<UIState>((set) => ({
  activeTool: "Selection", //Default tool
  setActiveTool: (tool) => set({ activeTool: tool }),
}));

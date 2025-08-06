import { create } from 'zustand';
import type { CanvasState } from '@/types';

type Store = {
    canvasState: CanvasState;
};

const initialState: CanvasState = {
    layers: {},
    camera: { x:0, y:0},
    currentlySelectedLayerId: null,
};

export const useCanvasStore = create<Store>((set) => ({
    canvasState: initialState,
}));
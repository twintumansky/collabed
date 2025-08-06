import { create } from 'zustand';
import type { CanvasState } from '@/types';

type Store = {
    canvasState: CanvasState;
};

const initialState: CanvasState = {
    currentlySelectedLayerId: null,
    layers: {},
    camera: { x: 0, y: 0 },
};

export const useCanvasStore = create<Store>(() => ({
    canvasState: initialState,
}));

import { create } from 'zustand';
import type { CanvasState, Layer } from  '@/types';

type Store = {
    canvasState: CanvasState;
    setCurrentlySelectedLayer: ( layerId: string | null) => void;
    insertLayer: ( layer: Layer ) => void;
};

const initialState: CanvasState = {
    currentlySelectedLayerId: null,
    layers: {},
    camera: { x: 0, y: 0 },
};

export const useCanvasStore = create<Store>((set) => ({
    canvasState: initialState,
    setCurrentlySelectedLayer: (layerId) => {
        set( (store) => ({
            canvasState: {...store.canvasState, currentlySelectedLayerId: layerId},
        }))
    },

    insertLayer: (layer) => {
        set( (store) => {
            const newLayers = {...store.canvasState.layers, [layer.id]: layer};
            return {
                canvasState: {
                    ...store.canvasState, 
                    layers: newLayers,
                    currentlySelectedLayerId: layer.id,
                },
            };
        }
    );
    },
}));

import { create } from 'zustand';
import type { CanvasState, Layer } from  '@/types';

type Store = {
    canvasState: CanvasState;
    setSelectedLayer: ( layerId: string | null) => void;
    insertLayer: ( layer: Layer ) => void;
};

const initialState: CanvasState = {
    selectedLayerId: null,
    layers: {},
    camera: { x: 0, y: 0 },
};

export const useCanvasStore = create<Store>((set) => ({
    canvasState: initialState,
    setSelectedLayer: (layerId) => {
        set( (store) => ({
            canvasState: {...store.canvasState, selectedLayerId: layerId},
        }))
    },

    insertLayer: (layer) => {
        set( (store) => {
            const newLayers = {...store.canvasState.layers, [layer.id]: layer};
            return {
                canvasState: {
                    ...store.canvasState, 
                    layers: newLayers,
                    selectedLayerId: layer.id,
                },
            };
        }
    );
    },
}));
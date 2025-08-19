
import { create } from 'zustand';
import type { CanvasState, Layer, CanvasInteractionMode, Point } from  '@/types';

type Store = {
    canvasState: CanvasState;
    setSelectedLayer: ( layerId: string | null) => void;
    insertLayer: ( layer: Layer ) => void;
    setCanvasInteractionMode: (mode: CanvasInteractionMode) => void;
    moveLayer: (layerId: string, position: Point) => void;
};

const initialState: CanvasState = {
    selectedLayerId: null,
    layers: {},
    camera: { x: 0, y: 0 },
    mode: 'IDLE',
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

    setCanvasInteractionMode: (mode) => {
        set( (store) => ({
            canvasState: {...store.canvasState, mode},
        }))
    },

    moveLayer: (layerId, position) => {
        set( (store) => {
            const updatedLayer = {...store.canvasState.layers[layerId], ...position};
            const newLayers = {...store.canvasState.layers, [layerId]: updatedLayer};

            return {
                canvasState: {
                    ...store.canvasState,
                    layers: newLayers,
                },
            };
        })
    },
}));
import { nanoid } from "nanoid";
import { create } from 'zustand';
import type { CanvasState, Layer, LayerType } from '@/types';

type Store = {
    canvasState: CanvasState;
    setCurrentlySelectedLayer: ( layerId: string | null) => void;
    insertLayer: ( layerType: LayerType, position: { x: number, y: number} ) => void;
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

    insertLayer: (layerType, position) => {
        set( (store) => {
            const newLayerId = nanoid();
            const newLayer: Layer = {
                id: newLayerId,
                type: layerType,
                x: position.x,
                y: position.y,
                height: 100, 
                width: 100,
                fill: { r: 51, g: 153, b: 255 },
            };

            const newLayers = {...store.canvasState.layers, [newLayerId]: newLayer};
            return {
                canvasState: {
                    ...store.canvasState, 
                    layers: newLayers,
                    currentlySelectedLayerId: newLayerId,
                },
            };
        }
    );
    },
}));
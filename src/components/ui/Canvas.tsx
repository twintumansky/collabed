import { LiveMap } from "@liveblocks/client";
import { useState } from "react";
import { useStorage, useMutation } from "@/liveblocks.config";
import { nanoid } from "nanoid";
import type { Layer, Camera, Point, RectangleLayer, Color } from "@/types";
import { Layer as LayerComponent } from "./Layer";

const getCoordinates = (e: React.PointerEvent, camera: Camera): Point => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  return {
    x: Math.round(e.clientX - rect.left - camera.x),
    y: Math.round(e.clientY - rect.top - camera.y),
  };
};

export const Canvas = () => {

  //Reading from Liveblocks storage instead of zustand store
  const layers = useStorage((root) => root.layers);
  const selectedLayerId = useStorage((root) => root.selectedLayerId);
  const camera = useStorage((root) => root.camera);
  const canvasMode = useStorage((root) => root.mode);
  //Array.from method because it creates a new refrence evrytime the layers LiveMap changes
  const layersArray = useStorage((root) => Array.from(root.layers.values()));

  //Local UI state of the canvas component
  const [drawingOrigin, setDrawingOrigin] = useState<Point | null>(null);
  // const [selectedTool, setSelectedTool] = useState<LayerType>("Rectangle"); //selected shape from toolbar component

  const insertLayer = useMutation((mutation, newLayer: RectangleLayer) => {
    const { storage } = mutation;
    const liveLayers = storage.get("layers");
    if (liveLayers) {
      liveLayers.set(newLayer.id, newLayer);
      storage.set("selectedLayerId", newLayer.id);
    } else {
      //fallback option if initial storage layer is not loaded properly
      const newLayers = new LiveMap<string, Layer>();
      newLayers.set(newLayer.id, newLayer);
      storage.set("layers", newLayers);
      storage.set("selectedLayerId", newLayer.id);
    }
  }, []);

  const moveLayer = useMutation(
    (mutation, position: Point) => {
      const { storage } = mutation;
      const liveLayers = storage.get("layers");
      if (selectedLayerId) {
        // Get the current layer's data
        const layer = liveLayers.get(selectedLayerId);
  
        if (layer) {
          // Create a new object with the updated position
          const updatedLayer = { ...layer, x: position.x, y: position.y };
          
          // Use .set() on the parent LiveMap to replace the old layer
          liveLayers.set(selectedLayerId, updatedLayer);
        }
      }
    },
    [selectedLayerId]
  );

  const setCanvasInteractionMode = useMutation((mutation, mode) => {
    mutation.storage.set("mode", mode);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    // if (selectedTool !== "Rectangle") return;
    const originPoint = getCoordinates(e, camera!);
    setDrawingOrigin(originPoint);
    setCanvasInteractionMode("DRAWING");
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    e.preventDefault();
    if (canvasMode === "TRANSLATING" && selectedLayerId) {
      const updatedLayerPosition = getCoordinates(e, camera!);
      moveLayer(updatedLayerPosition);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (canvasMode === "DRAWING" && drawingOrigin) {
      const endPoint = getCoordinates(e, camera!);
      const width = Math.abs(endPoint.x - drawingOrigin.x);
      const height = Math.abs(endPoint.y - drawingOrigin.y);

      if (width > 5 && height > 5) {
        const newLayer = {
          id: nanoid(),
          type: "Rectangle" as const,
          x: Math.min(drawingOrigin.x, endPoint.x),
          y: Math.min(drawingOrigin.y, endPoint.y),
          width,
          height,
          fill: { r: 243, g: 244, b: 246 } as Color,
        };
        insertLayer(newLayer);
      }
    }

    setDrawingOrigin(null);
    setCanvasInteractionMode("IDLE");
  };

  if (!layers || !camera || !canvasMode) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <em>Your canvas is Loading...</em>
      </div>
    );
  }

  return (
    <main className="h-full w-full bg-neutral-100 touch-none">
      <svg
        className="h-full w-full"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <g
        // style={{
        //   transform: `translate(${canvasState.camera.x}px, ${canvasState.camera.y}px)`,
        // }}
        >
          {layersArray!.map((layer) => (
            <LayerComponent key={layer.id} layer={layer} />
          ))}
        </g>
      </svg>
    </main>
  );
};

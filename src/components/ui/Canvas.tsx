// import { useCanvasStore } from "@/store/useCanvasStore";
import { LiveMap } from "@liveblocks/client";
import { useState } from "react";
import { useStorage, useMutation } from "@/liveblocks.config";
import { nanoid } from "nanoid";
import type { Layer, LayerType, Camera, Point, RectangleLayer, Color } from "@/types";
import { Layer as LayerComponent } from "./Layer";

const getCoordinates = (e: React.PointerEvent, camera: Camera): Point => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  return {
    x: Math.round(e.clientX - rect.left - camera.x),
    y: Math.round(e.clientY - rect.top - camera.y),
  };
};

export const Canvas = () => {
  // const { canvasState, moveLayer} = useCanvasStore();
  // const { canvasState, insertLayer, setCanvasInteractionMode, moveLayer } =
  //   useCanvasStore(); //slicing the canvasState & insertLayer action method from the canvas store

  //Reading from Liveblocks storage instead of zustand store
  const layers = useStorage((root) => root.layers);
  const selectedLayerId = useStorage((root) => root.selectedLayerId);
  const camera = useStorage((root) => root.camera);
  const canvasMode = useStorage((root) => root.mode);

  //Local UI state of the canvas component
  const [drawingOrigin, setDrawingOrigin] = useState<Point | null>(null); //temporary drawing state local to the canvas component
  const [selectedTool, setSelectedTool] = useState<LayerType>("Rectangle"); //selected shape from toolbar component

  const insertLayer = useMutation((mutation, newLayer: RectangleLayer) => {
    const { storage } = mutation;
    const liveLayers = storage.get("layers");
    if (!liveLayers) {
      const newLayers = new LiveMap<string, Layer>();
      newLayers.set(newLayer.id, newLayer);

      storage.set("layers", newLayers);
      storage.set("selectedLayerId", newLayer.id);
      storage.set("camera", { x: 0, y: 0 }); // Initialize camera
      storage.set("mode", "IDLE"); // Initialize mode
    } else {
      // If it already exists, just add the new layer
      liveLayers.set(newLayer.id, newLayer);
      storage.set("selectedLayerId", newLayer.id);
    }
    // const newLayerId = nanoid();
    // const newLayer: RectangleLayer = {
    //   id: nanoid(),
    //   type: "Rectangle",
    //   x: Math.min(drawingOrigin.x, endPoint.x),
    //   y: Math.min(drawingOrigin.y, endPoint.y),
    //   width,
    //   height,
    //   fill: { r: 243, g: 244, b: 246 } as Color,
    // };
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
    if (selectedTool !== "Rectangle") return;

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
        insertLayer({
          id: nanoid(),
          type: "Rectangle",
          x: Math.min(drawingOrigin.x, endPoint.x),
          y: Math.min(drawingOrigin.y, endPoint.y),
          width,
          height,
          fill: { r: 243, g: 244, b: 246 } as Color,
        });
      }
    }

    setDrawingOrigin(null);
    if (canvasMode === "TRANSLATING") {
      setCanvasInteractionMode("IDLE");
    }
  };

  if (!layers || !camera || !canvasMode) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        Loading...
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
          {/* {Object.values(canvasState.layers).map((layer) => (
            <Layer key={layer.id} layer={layer} />
          ))} */}
          {Object.entries(layers).map(([layerId, layer]) => (
            <LayerComponent key={layerId} layer={layer} />
          ))}
        </g>
      </svg>
    </main>
  );
};

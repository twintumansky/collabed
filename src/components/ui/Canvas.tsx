import { LiveMap } from "@liveblocks/client";
import { useState, useEffect } from "react";
import { useStorage, useMutation } from "@/liveblocks.config";
import { nanoid } from "nanoid";
import type { Layer, Camera, Point, Color } from "@/types";
import { Layer as LayerComponent } from "./Layer";
import { useUIStore } from "@/store/useUIStore";

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

  const activeTool = useUIStore((state) => state.activeTool);
  const setActiveTool = useUIStore((state) => state.setActiveTool);

  const insertLayer = useMutation((mutation, newLayer: Layer) => {
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

  const deleteLayer = useMutation((mutation) => {
    const { storage } = mutation;
    const liveLayers = storage.get("layers");
    const selectedLayer = storage.get("selectedLayerId");

    if (selectedLayer) {
      liveLayers.delete(selectedLayer);
      storage.set("selectedLayerId", null); // De-select after deleting
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

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteLayer();
      }
    };

    // Add the event listener to the window
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [deleteLayer]);

  const setCanvasInteractionMode = useMutation((mutation, mode) => {
    mutation.storage.set("mode", mode);
  }, []);

  const updateCamera = useMutation((mutation, newPosition: Point) => {
    mutation.storage.set("camera", newPosition);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    const originPoint = getCoordinates(e, camera!);
    switch (activeTool) {
      case "Rectangle":
        setDrawingOrigin(originPoint);
        setCanvasInteractionMode("DRAWING");
        break;

      case "Circle":
        setDrawingOrigin(originPoint);
        setCanvasInteractionMode("DRAWING");
        break;  

      case "Triangle":
        setDrawingOrigin(originPoint);
        setCanvasInteractionMode("DRAWING");
        break;    

      case "Text":
        {
          const newTextLayer = {
            id: nanoid(),
            type: "Text" as const,
            x: originPoint.x,
            y: originPoint.y,
            width: 150,
            height: 30,
            fill: { r: 0, g: 0, b: 0 } as Color,
            value: "",
          };
          insertLayer(newTextLayer);
          setActiveTool("Selection");
          setCanvasInteractionMode("IDLE");
        }
        break;
      // If the selection tool is active, clicking the background
      // could clear the selection in the future. For now, it does nothing.
      case "Selection":
        // TODO: Clear selection
        break;
    }
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

      switch (activeTool) {
        case "Rectangle":
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
          break;

        case "Circle":
          if (width > 5 && height > 5) {
            const r = Math.min(width, height) / 2;
            const newLayer = {
              id: nanoid(),
              type: "Circle" as const,
              r,
              x: drawingOrigin.x + r * Math.sign(endPoint.x - drawingOrigin.x),
              y: drawingOrigin.y + r * Math.sign(endPoint.y - drawingOrigin.y),
              width,
              height,
              fill: { r: 243, g: 244, b: 246 } as Color,
            };
            insertLayer(newLayer);
          }
          break;  

        case "Triangle": {
          if (width > 5 && height > 5) {
            const newLayer = {
              id: nanoid(),
              type: "Triangle" as const,
              x: Math.min(drawingOrigin.x, endPoint.x),
              y: Math.min(drawingOrigin.y, endPoint.y),
              width,
              height,
              fill: { r: 243, g: 244, b: 246 } as Color,
            };
            insertLayer(newLayer);
          }
          break;
        }  

        // case "Text": {
        //   const textWidth = width > 5 ? width : 150;
        //   const textHeight = height > 5 ? height : 30;
        //   const newText = {
        //     id: nanoid(),
        //     type: "Text" as const,
        //     x: Math.min(drawingOrigin.x, endPoint.x),
        //     y: Math.min(drawingOrigin.y, endPoint.y),
        //     width: textWidth,
        //     height: textHeight,
        //     fill: { r: 0, g: 0, b: 0 } as Color,
        //     value: "",
        //   };
        //   insertLayer(newText);
        //   break;
        // }
      }
    }

    setDrawingOrigin(null);
    if (canvasMode === "DRAWING" || canvasMode === "TRANSLATING") {
      setCanvasInteractionMode("IDLE");
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault(); // Prevent the whole page from scrolling

    // e.deltaX and e.deltaY represent the scroll amount
    updateCamera({
      x: camera!.x - e.deltaX,
      y: camera!.y - e.deltaY,
    });
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
        onWheel={handleWheel}
      >
        <g style={{ transform: `translate(${camera!.x}px, ${camera!.y}px)` }}>
          {layersArray!.map((layer) => (
            <LayerComponent key={layer.id} layer={layer} />
          ))}
        </g>
      </svg>
    </main>
  );
};

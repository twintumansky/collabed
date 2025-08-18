import { useCanvasStore } from "@/store/useCanvasStore";
import { useState } from "react";
import { nanoid } from "nanoid";
import type { LayerType, Camera, Point, RectangleLayer, Color } from '@/types';
import { Layer } from "./Layer";

const getCoordinates = (e: React.PointerEvent, camera: Camera): Point => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  return {
    x: Math.round(e.clientX - rect.left - camera.x),
    y: Math.round(e.clientY - rect.top - camera.y),
  };
};

export const Canvas = () => {
  const { canvasState, insertLayer } = useCanvasStore(); //slicing the canvasState & insertLayer action method from the canvas store
  const [ drawingOrigin, setDrawingOrigin ] = useState<Point | null>(null); //temporary drawing state local to the canvas component
  const [ selectedTool, setSelectedTool ] = useState<LayerType>('Rectangle'); //selected shape from toolbar component

  const handlePointerDown = (e: React.PointerEvent) => {
    if(selectedTool !== 'Rectangle') return;

    const originPoint = getCoordinates(e, canvasState.camera);
    setDrawingOrigin(originPoint);
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if(!drawingOrigin || selectedTool !== "Rectangle") {
      setDrawingOrigin(null);
      return;
    }

    const endPoint = getCoordinates(e, canvasState.camera);
    const width = Math.abs(endPoint.x - drawingOrigin.x);
    const height = Math.abs(endPoint.y - drawingOrigin.y); 

    if( width < 5 || height < 5) {
      setDrawingOrigin(null);
      return;
    }

    const newRectangleLayer: RectangleLayer = {
      id: nanoid(),
      type: "Rectangle",
      x: Math.min(drawingOrigin.x, endPoint.x),
      y: Math.min(drawingOrigin.y, endPoint.y),
      width,
      height,
      fill: { r: 243, g: 244, b: 246 } as Color,
    };

    insertLayer(newRectangleLayer);
    setDrawingOrigin(null);
  }

  return (
    <main className="h-full w-full bg-neutral-100 touch-none">
      <svg
        className="h-full w-full"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <g style={{ transform: `translate(${canvasState.camera.x}px, ${canvasState.camera.y}px)` }}>
          {Object.values(canvasState.layers).map((layer) => (
            <Layer key={layer.id} layer={layer} />
          ))}
        </g>
      </svg>
    </main>
  );
};
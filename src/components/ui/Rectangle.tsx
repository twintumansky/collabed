import { useCanvasStore } from "@/store/useCanvasStore";
import type { RectangleLayer } from "@/types";

interface RectangleProps {
  layer: RectangleLayer;
}

export const Rectangle = ({ layer }: RectangleProps) => {
  const { x, y, width, height, fill } = layer;

  const selectedLayerId = useCanvasStore((state) => state.canvasState.selectedLayerId);
  const setSelectedLayer = useCanvasStore((state) => state.setSelectedLayer);
  const setCanvasInteractionMode = useCanvasStore((state) => state.setCanvasInteractionMode);

  const isSelected = layer.id === selectedLayerId;
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedLayer(layer.id);
    setCanvasInteractionMode("TRANSLATING");
  };

  return (
    <rect
      onPointerDown={handlePointerDown}
      x={x}
      y={y}
      width={width}
      height={height}
      fill={`rgb(${fill.r}, ${fill.g}, ${fill.b})`}
      stroke={isSelected ? "#007AFF" : "black"}
      strokeWidth="1"
    />
  );
};

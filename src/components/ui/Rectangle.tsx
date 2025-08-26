// import { useCanvasStore } from "@/store/useCanvasStore";
import type { RectangleLayer } from "@/types";
import { useStorage, useMutation } from "@/liveblocks.config";

interface RectangleProps {
  layer: RectangleLayer;
}

export const Rectangle = ({ layer }: RectangleProps) => {
  const { x, y, width, height, fill } = layer;

  // const selectedLayerId = useCanvasStore((state) => state.canvasState.selectedLayerId);
  // const setSelectedLayer = useCanvasStore((state) => state.setSelectedLayer);
  // const setCanvasInteractionMode = useCanvasStore((state) => state.setCanvasInteractionMode);
  const selectedLayerId = useStorage((root) => root.selectedLayerId);
  const isSelected = layer.id === selectedLayerId;
  const setSelectedLayer = useMutation(
    (mutation, layerId: string) => {
      mutation.storage.set('selectedLayerId', layerId);
    },
    []
  );

  const setCanvasInteractionMode = useMutation((mutation, mode) => {
    mutation.storage.set("mode", mode);
  }, []);

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

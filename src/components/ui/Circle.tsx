import type { CircleLayer } from "@/types";
import { useStorage, useMutation } from "@/liveblocks.config";

interface CircleProps {
  layer: CircleLayer;
}

export const Circle = ({ layer }: CircleProps) => {
  const { x, y, r, width, height, fill } = layer;
  const selectedLayerId = useStorage((root) => root.selectedLayerId);
  const isSelected = layer.id === selectedLayerId;
  const setSelectedLayer = useMutation((mutation, layerId: string) => {
    mutation.storage.set("selectedLayerId", layerId);
  }, []);

  const setCanvasInteractionMode = useMutation((mutation, mode) => {
    mutation.storage.set("mode", mode);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedLayer(layer.id);
    setCanvasInteractionMode("TRANSLATING");
  };

  return (
    <circle
      onPointerDown={handlePointerDown}
      cx={x}
      cy={y}
      r={r}
      width={width}
      height={height}
      fill={`rgb(${fill.r}, ${fill.g}, ${fill.b})`}
      stroke={isSelected ? "#007AFF" : "black"}
      strokeWidth="1"
    />
  );
};

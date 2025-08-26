import type { TriangleLayer } from "@/types";
import { useStorage, useMutation } from "@/liveblocks.config";

interface TriangleProps {
  layer: TriangleLayer;
}

export const Triangle = ({ layer }: TriangleProps) => {
  const { x, y, width, height, fill } = layer;

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

  // Calculate the three points of the triangle
  const points = `${x + width / 2},${y} ${x},${y + height} ${x + width},${
    y + height
  }`;

  return (
    <polygon
      points={points}
      fill={`rgb(${fill.r}, ${fill.g}, ${fill.b})`}
      stroke={isSelected ? "#007AFF" : "black"}
      strokeWidth="1"
      onPointerDown={handlePointerDown}
    />
  );
};

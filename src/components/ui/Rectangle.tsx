// src/components/Rectangle.tsx
import type { RectangleLayer } from "@/types";

interface RectangleProps {
  layer: RectangleLayer;
}

export const Rectangle = ({ layer }: RectangleProps) => {
  const { x, y, width, height, fill } = layer;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={`rgb(${fill.r}, ${fill.g}, ${fill.b})`}
      stroke="black"
      strokeWidth="1"
    />
  );
};
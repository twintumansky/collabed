// src/components/Layer.tsx
import type { Layer as LayerType } from "@/types";
import { Rectangle } from "./Rectangle";

interface LayerProps {
  layer: LayerType;
}

export const Layer = ({ layer }: LayerProps) => {
  switch (layer.type) {
    case "Rectangle":
      return <Rectangle layer={layer} />;
    // Add cases for other layer types here in the future
    default:
      return null;
  }
};
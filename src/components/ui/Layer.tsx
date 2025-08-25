import type { Layer as LayerType } from "@/types";
import { Rectangle } from "./Rectangle";
import { Text } from "./Text";

interface LayerProps {
  layer: LayerType;
}

export const Layer = ({ layer }: LayerProps) => {
  switch (layer.type) {
    case "Rectangle":
      return <Rectangle layer={layer} />;

    case "Text":
      return <Text layer={layer} />;

    default:
      console.warn("Unknown layer type");
      return null;
  }
};

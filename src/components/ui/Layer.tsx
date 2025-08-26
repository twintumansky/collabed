import type { Layer as LayerType } from "@/types";
import { Rectangle } from "./Rectangle";
import { Circle } from "./Circle";
import { Triangle } from "./Triangle";
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

    case "Circle":
      return <Circle layer={layer} />;  

    case "Triangle":
      return <Triangle layer={layer} />;   
      
    default:  
      console.warn("Unknown layer type");
      return null;
  }
};

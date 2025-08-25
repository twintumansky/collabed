import { useState } from "react";
import type { TextLayer } from "@/types";
import { useMutation } from "@/liveblocks.config";

interface TextProps {
  layer: TextLayer;
}

export const Text = ({ layer }: TextProps) => {
  const { id, x, y, width, height, value, fill } = layer;
  const [text, setText] = useState(value || "Text");

  const updateText = useMutation(
    (mutation, newValue: string) => {
      const { storage } = mutation;
      const liveLayers = storage.get("layers");

      // Get the specific layer object
      const layer = liveLayers.get(id);

      // If the layer exists, call .update() on it to change a property
      if (layer) {
        const updatedLayer = { ...layer, value: newValue };

        // Use .set() on the parent LiveMap to replace the old layer
        liveLayers.set(id, updatedLayer);
      }
    },
    [id]
  );
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    // When the user clicks away, update the Liveblocks storage.
    // This is more efficient than updating on every keystroke.
    updateText(text);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      style={{
        outline: "1px solid transparent", // Add styling as needed
      }}
    >
      <textarea
        className="h-full w-full resize-none border-none bg-transparent p-1 text-center text-lg focus:outline-none"
        style={{
          color: `rgb(${fill.r}, ${fill.g}, ${fill.b})`,
        }}
        value={text}
        onChange={handleContentChange}
        onBlur={handleBlur}
      />
    </foreignObject>
  );
};

import { useState, useEffect, useRef } from "react";
import type { TextLayer } from "@/types";
import { useMutation } from "@/liveblocks.config";
import { useUIStore } from "@/store/useUIStore";

interface TextProps {
  layer: TextLayer;
}

export const Text = ({ layer }: TextProps) => {
  const { id, x, y, width, height, value, fill } = layer;
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value || "Text");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const activeTool = useUIStore((state) => state.activeTool);

  const setSelectedLayer = useMutation(
    (mutation, layerId: string) => {
      const { storage } = mutation;
      storage.set("selectedLayerId", layerId);
      storage.set("mode", "TRANSLATING");
    },
    []
  );

  const updateText = useMutation(
    (mutation, newValue: string) => {
      const { storage } = mutation;
      const liveLayers = storage.get("layers");
      const textLayer = liveLayers.get(id);

      if (textLayer) {
        const updatedLayer = { ...textLayer, value: newValue };
        liveLayers.set(id, updatedLayer);
      }
    },
    [id]
  );

  useEffect(() => {
    if (isEditing) {
      textAreaRef.current?.focus();
      textAreaRef.current?.select();
    }
  }, [isEditing]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    // When the user clicks away, update the Liveblocks storage.
    // This is more efficient than updating on every keystroke.
    updateText(text);
    setIsEditing(false);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (activeTool === "Selection") {
      e.stopPropagation();
      setSelectedLayer(id);
    }
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      style={{
        outline: "1px solid #9acbff",
        cursor: activeTool === "Selection" ? "pointer" : "default",
      }}
    >
      <textarea
        ref={textAreaRef}
        disabled={!isEditing}
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

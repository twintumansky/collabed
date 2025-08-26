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
  // const selectedLayerId = useStorage((root) => root.selectedLayerId);
  // const isSelected = layer.id === selectedLayerId;

  const setSelectedLayer = useMutation(
    (mutation, layerId: string) => {
      const { storage } = mutation;
      storage.set("selectedLayerId", layerId);
      // storage.set("mode", "TRANSLATING");
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
      // stroke={isSelected ? "#007AFF" : "black"}
      strokeWidth="1"
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      style={{
        outline: "1px solid #9acbff",
        cursor: activeTool === "Selection" ? "pointer" : "default",
      }}
    >
      <textarea
        ref={textAreaRef}
        readOnly={!isEditing}
        className="h-full w-full resize-none border-none bg-transparent p-1 text-center text-base focus:outline-none"
        style={{
          color: `rgb(${fill.r}, ${fill.g}, ${fill.b})`,
        }}
        value={text}
        onChange={handleContentChange}
        onBlur={handleBlur}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
        onPointerDown={(e)=> {
          if (isEditing) e.stopPropagation();
        }}
        onPointerMove={(e) => {
          if (isEditing) e.stopPropagation();
        }}
        onPointerUp={(e) => {
          if (isEditing) e.stopPropagation();
        }}
      />
    </foreignObject>
  );
};

import type { Color } from "@/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { ColorsIcon } from "@hugeicons/core-free-icons";
import { useUIStore } from "@/store/useUIStore";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  onChange: (color: Color) => void;
}

const ColorButton = ({
  isActive,
  color,
  onClick,
}: {
  isActive: boolean;
  color: Color;
  onClick: (color: Color) => void;
}) => {
  return (
    <button
      className={cn(
        "w-6 h-6 rounded-full border border-neutral-300",
        // Add a ring for the active/selected state
        isActive && "ring-2 ring-blue-300"
      )}
      style={{ background: `rgb(${color.r}, ${color.g}, ${color.b})` }}
      onClick={() => onClick(color)}
    />
  );
};

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
  const { activeTool, setActiveTool } = useUIStore();
  const colors: Color[] = [
    { r: 243, g: 244, b: 246 },
    { r: 255, g: 246, b: 181 },
    { r: 247, g: 211, b: 176 },
    { r: 173, g: 240, b: 249 },
    { r: 199, g: 220, b: 255 },
    { r: 221, g: 217, b: 255 },
    { r: 176, g: 176, b: 176 },
    { r: 26, g: 26, b: 26 },
    { r: 255, g: 0, b: 0 },
  ];
  const [selectedColor, setSelectedColor] = useState<Color>(colors[0]);
  const handleColorSelect = (color: Color) => {
    setSelectedColor(color);
    onChange(color);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={activeTool === "ColorPicker" ? "boardActive" : "board"}
          size="icon"
          onClick={() => setActiveTool("ColorPicker")}
        >
          <HugeiconsIcon
            icon={ColorsIcon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <ColorButton
              key={`${color.r}-${color.g}-${color.b}`}
              color={color}
              onClick={handleColorSelect}
              isActive={
                selectedColor.r === color.r &&
                selectedColor.g === color.g &&
                selectedColor.b === color.b
              }
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

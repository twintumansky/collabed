import { HugeiconsIcon } from "@hugeicons/react";
import { Cursor02Icon } from "@hugeicons/core-free-icons";

interface CursorProps {
  x: number;
  y: number;
  name: string;
  color: string;
}

export const Cursor = ({ x, y, name, color }: CursorProps) => {
  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <HugeiconsIcon
        icon={Cursor02Icon}
        size={20}
        color={color}
        strokeWidth={1.5}
      />
      <div 
        className="absolute top-4 left-2 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
        style={{ backgroundColor: color }}
        >
        {name}
      </div>
    </div>
  );
};

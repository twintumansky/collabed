import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShapeCollectionIcon,
  SquareIcon,
  CircleIcon,
  TriangleIcon,
} from "@hugeicons/core-free-icons";
import type { LayerType } from "@/types";
import { useUIStore } from "@/store/useUIStore";

export const ShapesMenu = () => {
  const { activeTool, setActiveTool } = useUIStore();
  type IconType = React.ComponentProps<typeof HugeiconsIcon>["icon"]
  const shapes: { name: LayerType; icon: IconType }[] = [
    { name: "Rectangle", icon: SquareIcon },
    { name: "Circle", icon: CircleIcon },
    { name: "Triangle", icon: TriangleIcon },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={
            shapes.some((s) => s.name === activeTool) ? "boardActive" : "board"
          }
          size="icon"
        >
          <HugeiconsIcon
            icon={ShapeCollectionIcon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="grid grid-cols-3 gap-2">
          {shapes.map((shape) => (
            <Button
              key={shape.name}
              variant={activeTool === shape.name ? "boardActive" : "ghost"}
              size="icon"
              onClick={() => setActiveTool(shape.name)}
            >
                <HugeiconsIcon
                icon={shape.icon}
                size={20}
                color="currentColor"
                strokeWidth={1.5}
              />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

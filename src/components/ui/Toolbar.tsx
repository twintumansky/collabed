import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cursor02Icon,
  Txt02Icon,
  StickyNote03Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/useUIStore";
import { ShapesMenu } from "./ShapesMenu"

export const Toolbar = () => {
  const { activeTool, setActiveTool } = useUIStore();
  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-md shadow-md p-2 flex gap-x-2">
      <Button
        variant={activeTool === "Selection" ? "boardActive" : "board"}
        size="icon"
        onClick={() => setActiveTool("Selection")}
      >
        <HugeiconsIcon
          icon={Cursor02Icon}
          size={24}
          color="currentColor"
          strokeWidth={1.5}
        />
      </Button>
      <ShapesMenu />
      <Button
        variant={activeTool === "Text" ? "boardActive" : "board"}
        size="icon"
        onClick={() => setActiveTool("Text")}
      >
        <HugeiconsIcon
          icon={Txt02Icon}
          size={24}
          color="currentColor"
          strokeWidth={1.5}
        />
      </Button>
      <Button
        variant={activeTool === "Note" ? "boardActive" : "board"}
        size="icon"
        onClick={() => setActiveTool("Note")}
      >
        <HugeiconsIcon
          icon={StickyNote03Icon}
          size={24}
          color="currentColor"
          strokeWidth={1.5}
        />
      </Button>
    </div>
  );
};



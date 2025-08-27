import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cursor02Icon,
  Txt02Icon,
  StickyNote03Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/useUIStore";
import { ShapesMenu } from "./ShapesMenu";
import { ColorPicker } from "./ColorPicker";
import { useStorage, useMutation } from "@/liveblocks.config";
import type { Color } from "@/types";

export const Toolbar = () => {
  const { activeTool, setActiveTool } = useUIStore();
  const selectedLayerId = useStorage((root) => root.selectedLayerId);

  const updateLayerFill = useMutation(
    (mutation, layerId: string, fill: Color) => {
      const { storage } = mutation;
      const liveLayers = storage.get("layers");
      if (liveLayers) {
        const layer = liveLayers.get(layerId);

        if (layer) {
          const updatedLayer = { ...layer, fill: fill };
          liveLayers.set(layerId, updatedLayer);
        }
      }
    },
    []
  );

  const handleColorChange = (color: Color) => {
    if (selectedLayerId) {
      updateLayerFill(selectedLayerId, color);
    }
  };

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
      <ColorPicker onChange={handleColorChange} />
    </div>
  );
};

import { HugeiconsIcon } from "@hugeicons/react";
import { Cursor02Icon } from "@hugeicons/core-free-icons";
import type { Point } from "@/types";


export const Cursor = ({ x, y }: Point) => {
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
        color="currentColor"
        strokeWidth={1.5}
      />
    </div>
  );
};

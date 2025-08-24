"use client";

import { useOthers, useUpdateMyPresence } from "@liveblocks/react/suspense";
import { Canvas } from "@/components/ui/Canvas";
import { Toolbar } from "@/components/ui/Toolbar";
import { Cursor } from "./components/ui/Cursor";

export const Room = () => {
  const others = useOthers();
  const updateMyPresence = useUpdateMyPresence();

  return (
    <div
      className="h-screen w-screen"
      onPointerMove={(e) =>
        updateMyPresence({ cursor: { x: e.clientX, y: e.clientY } })
      }
      onPointerLeave={() => updateMyPresence({ cursor: null })}
    >
        {others.map(({ connectionId, presence }) =>
        presence.cursor ? (
          <Cursor
            key={connectionId}
            x={presence.cursor.x}
            y={presence.cursor.y}
          />
        ) : null
      )}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white rounded-md shadow-md p-2 flex gap-x-2">
        There are {others.length} other users with you in this room.
      </div>
      <Toolbar />
      <Canvas />
    </div>
  );
};

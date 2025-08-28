"use client";

import { useOthers, useUpdateMyPresence } from "@liveblocks/react/suspense";
import { Canvas } from "@/components/ui/Canvas";
import { Toolbar } from "@/components/ui/Toolbar";
import { Participants } from "./components/ui/Participants";
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
        {others.map(({ connectionId, presence, info }) =>
        presence.cursor && info && info.name && typeof(info.color)==='string'? (
          <Cursor
            key={connectionId}
            x={presence.cursor.x}
            y={presence.cursor.y}
            name={info.name}
            color={info.color}
          />
        ) : null
      )}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white rounded-md shadow-md p-2 flex items-center gap-x-2">
        There are {others.length} other users with you in this room.
      </div>
      <Toolbar />
      <Participants />
      <Canvas />
    </div>
  );
};

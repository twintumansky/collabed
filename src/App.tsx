"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveMap } from "@liveblocks/client";
import { Room } from "./Room";

const App: React.FC = () => {
  return (
    <LiveblocksProvider
      publicApiKey={import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY}
    >
      <RoomProvider
        id="canavs-room-test-3"
        initialPresence={{ cursor: null }}
        initialStorage={{
          layers: new LiveMap(),
          selectedLayerId: null,
          camera: { x: 0, y: 0 },
          mode: "IDLE",
        }}
      >
        <ClientSideSuspense
          fallback={
            <div className="h-screen w-screen flex items-center justify-center">
              Your canvas is loading...
            </div>
          }
        >
          <Room />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};

export default App;

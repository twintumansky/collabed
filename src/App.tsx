"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
// import { Room } from "./Room";
import { LiveMap } from "@liveblocks/client";
import { Canvas } from "@/components/ui/Canvas.tsx";
import { Toolbar } from "@/components/ui/Toolbar.tsx";

const App: React.FC = () => {
  return (
    <LiveblocksProvider
      publicApiKey={
        import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY
      }
    >
      <RoomProvider id="canavs-room-test-3"
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
          <div className="h-screen w-screen">
            <Toolbar />
            <Canvas />
          </div>
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};

export default App;

"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
// import { Room } from "./Room";
import { Canvas } from "@/components/ui/Canvas.tsx";
import { Toolbar } from "@/components/ui/Toolbar.tsx";

const App: React.FC = () => {
  return (
    <LiveblocksProvider
      publicApiKey={
        import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY
      }
    >
      <RoomProvider id="my-room">
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

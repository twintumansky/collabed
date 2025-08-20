"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { Room } from "./Room";
import { Canvas } from "@/components/ui/Canvas.tsx";
import { Toolbar } from "@/components/ui/Toolbar.tsx";

const App: React.FC = () => {
  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_dev_7yctZNkRaVF3mZpc4UN_CIFoemNFz5qtrosHL75bX2W3YM2tKDD1iArIPa-gxfgd"
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

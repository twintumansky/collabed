import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import type { Layer } from "@/types";

const client = createClient({
  publicApiKey: "pk_dev_7yctZNkRaVF3mZpc4UN_CIFoemNFz5qtrosHL75bX2W3YM2tKDD1iArIPa-gxfgd",
});

// Define the types for Presence and Storage
type Presence = {
  cursor: { x: number; y: number } | null,
  // ... other presence state
};

type Storage = {
  layers: Record<string, Layer>,
  selectedLayerId: string | null,
};

// Export the hooks with the types you've defined
export const {
  RoomProvider,
  useStorage,
  useMutation,
  useMyPresence,
  useOthers,
} = createRoomContext<Presence, Storage>(client);

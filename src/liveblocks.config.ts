// src/liveblocks.config.ts

import { createClient, LiveMap } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import type { Layer, Camera, CanvasInteractionMode } from "@/types";

if (!import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY) {
    throw new Error("VITE_LIVEBLOCKS_PUBLIC_KEY is not set");
  }

const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY, // Replace with your actual public key
});

// Define the types for other users' presence and your app's storage
type Presence = {
  cursor: { x: number; y: number } | null,
};

type Storage = {
  layers: LiveMap<string, Layer>,
  selectedLayerId: string | null,
  camera: Camera,
  mode: CanvasInteractionMode,
};

// Export the fully-typed hooks from this file
export const {
  RoomProvider,
  useStorage,
  useMutation,
  useMyPresence,
  useOthers,
} = createRoomContext<Presence, Storage>(client);
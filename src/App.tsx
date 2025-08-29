"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveMap } from "@liveblocks/client";
import { Room } from "./Room";
import { Routes, Route } from "react-router-dom";
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

const COLORS = ["#C98E40", "#059669", "#457CC4", "#6F9C4F", "#E6CB63" ];

function getRandomName() {
  const firstName = ["Brave", "Clever", "Swift", "Wise", "Bold", "Kind"];
  const lastName = ["Shark", "Eagle", "Elephant", "Wolf", "Bear", "Tiger"];
  return `${firstName[Math.floor(Math.random() * firstName.length)]} ${lastName[Math.floor(Math.random() * lastName.length)]}`
}

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

const CollabedApp = () => {
  return (
    <LiveblocksProvider
      // publicApiKey={import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY}
      authEndpoint={ async (room) => {
        const response = await fetch("/api/liveblocks-auth", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            room,
            userInfo: {
              name: getRandomName(),
              color: getRandomColor(),
            },
          }),
        });
        return await response.json();
      }}
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
}

const SignInPage = () => <div className="h-screen w-screen flex items-center justify-center"><SignIn /></div>;
const SignUpPage = () => <div className="h-screen w-screen flex items-center justify-center"><SignUp /></div>;

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route
        path="/"
        element={
          <>
            <SignedIn>
              {/* If the user is signed in, show the whiteboard */}
              <CollabedApp />
            </SignedIn>
            <SignedOut>
              {/* If the user is signed out, redirect to the sign-in page */}
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
};

export default App;

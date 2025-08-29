import "dotenv/config";
import express from "express";
import cors from "cors";
import { Liveblocks } from "@liveblocks/node";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import "dotenv/config";

const app = express();
const port = 3001; // Port for our auth server

// Initializing the Liveblocks and Clerk clients with the secret keys
const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY });
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

// Middleware setup
app.use(cors());
app.use(express.json());

// The API endpoint that our app will call
app.post(
  "/api/liveblocks-auth",
  ClerkExpressRequireAuth({ secretKey: clerkSecretKey }), // Clerk middleware verifies the user
  async (req, res) => {
    // Getting the authenticated user from the Clerk middleware
    const user = req.auth.user;

    if (!user) {
      return res.status(403).end();
    }
    
    // Prepare a Liveblocks session
    const session = liveblocks.prepareSession(
      user.id, // Use the real user ID from Clerk
      {
        userInfo: { // Pass user metadata to Liveblocks
          name: `${user.firstName} ${user.lastName}`,
          color: `hsl(${Math.random() * 360}, 95%, 65%)`, // Assign a random color
          picture: user.imageUrl,
        }
      }
    );
    
    // Give the user access to the room from the request body
    session.allow(req.body.room, session.FULL_ACCESS);

    // Authorize the user and return the Liveblocks token
    const { status, body } = await session.authorize();
    return res.status(status).end(body);
  }
);

app.listen(port, () => {
  console.log(`Liveblocks auth server listening on port ${port}`);
});
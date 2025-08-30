import "dotenv/config";
import express from "express";
import cors from "cors";
import { Liveblocks } from "@liveblocks/node";
import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";

const app = express();
const port = 3001;

// Initialize Liveblocks
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY,
});

// Get Clerk configuration
const clerkSecretKey = process.env.CLERK_SECRET_KEY;
const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY;

console.log(
  "Clerk Secret Key Loaded:",
  clerkSecretKey ? `sk_...${clerkSecretKey.slice(-4)}` : "NOT FOUND"
);
console.log(
  "Clerk Publishable Key Loaded:",
  clerkPublishableKey ? `pk_...${clerkPublishableKey.slice(-4)}` : "NOT FOUND"
);

// Middleware setup
app.use(cors());
app.use(express.json());

// Initialize Clerk middleware - this attaches auth to req.auth
app.use(clerkMiddleware());

// Debug endpoint to test token verification
// app.post("/api/debug-token", async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;
//     console.log("Debug token endpoint called");
//     console.log("Auth header:", authHeader);
    
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(400).json({ error: "No Bearer token provided" });
//     }
    
//     const token = authHeader.substring(7);
//     console.log("Token received:", token.substring(0, 50) + "...");
    
//     // Try to verify with Clerk
//     const { verifyToken } = await import('@clerk/clerk-sdk-node');
//     const payload = await verifyToken(token, { 
//       secretKey: clerkSecretKey,
//       clockTolerance: 120
//     });
    
//     console.log("Token verified successfully:", payload);
//     res.json({ success: true, payload });
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     res.status(401).json({ error: error.message });
//   }
// });

// The main auth endpoint with better error handling
app.post(
  "/api/liveblocks-auth",
  requireAuth(),
  async (req, res) => {
    try {
      // Add detailed logging to see what's happening
      console.log("=== Auth Endpoint Called ===");
      console.log("Request body:", req.body);
      
      // const authHeader = req.headers.authorization;
    
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   return res.status(401).json({ error: "No Bearer token provided" });
    // }
    
    // const token = authHeader.substring(7);
    
    // // Verify token manually with Clerk
    // const { verifyToken } = await import('@clerk/clerk-sdk-node');
    // const payload = await verifyToken(token, { 
    //   secretKey: clerkSecretKey,
    //   clockTolerance: 120
    // });
    
    // console.log("Token verified successfully:", payload);
    
    // // Extract user info from the token payload
    // const userId = payload.sub; // sub contains the user ID
    // console.log("User ID extracted:", userId);

    // if (!req.auth || !req.auth.user) {
    //   console.error("Authentication failed - no user data");
    //   return res.status(403).json({ 
    //     error: "User not authenticated",
    //     auth: req.auth,
    //     hasAuth: !!req.auth,
    //     hasUser: !!(req.auth && req.auth.user)
    //   });
    // }

    // const user = req.auth.user;
    // console.log("User authenticated successfully:", {
    //   id: user.id,
    //   firstName: user.firstName,
    //   lastName: user.lastName,
    //   email: user.emailAddresses?.[0]?.emailAddress
    // });

      // Prepare a Liveblocks session
      // const session = liveblocks.prepareSession(userId, {
      //   userInfo: {
      //     name: `Authenticated User`,
      //     color: `hsl(${Math.random() * 360}, 95%, 65%)`,
      //     picture: null,
      //   },
      // });

      const { userId } = getAuth(req);
      
      if (!userId) {
        console.error("Authentication failed - no userId");
        return res.status(403).json({ 
          error: "User not authenticated",
          auth: req.auth
        });
      }

      console.log("User authenticated successfully, ID:", userId);

      // const session = liveblocks.prepareSession(user.id, {
      //   userInfo: {
      //     name: `${user.firstName || "Anonymous"} ${user.lastName || "User"}`,
      //     color: `hsl(${Math.random() * 360}, 95%, 65%)`,
      //     picture: user.imageUrl || null,
      //   },
      // });

      const session = liveblocks.prepareSession(userId, {
        userInfo: {
          name: "Authenticated User", // You can customize this
          color: `hsl(${Math.random() * 360}, 95%, 65%)`,
          picture: null,
        },
      });

      // Give the user access to the room from the request body
      session.allow(req.body.room, session.FULL_ACCESS);

      // Authorize the user and return the Liveblocks token
      const { status, body } = await session.authorize();
      console.log("Liveblocks session authorized successfully");
      return res.status(status).end(body);
    } catch (error) {
      console.error("Liveblocks auth error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

app.listen(port, () => {
  console.log(`Liveblocks auth server listening on port ${port}`);
});

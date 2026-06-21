// Main entry point for the CineRate backend API.
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movies.js";
import meRoutes from "./routes/ratings.js";

const app = express();

// Allow the React frontend (different port) to call this API.
app.use(cors());
// Parse JSON request bodies.
app.use(express.json());

// Friendly warning if the OMDb key hasn't been set up yet.
if (!process.env.OMDB_API_KEY || process.env.OMDB_API_KEY === "your_omdb_key_here") {
  console.warn(
    "\n⚠️  OMDB_API_KEY is not set. Movie data will not load.\n" +
    "   Get a free key at https://www.omdbapi.com/apikey.aspx and put it in backend/.env\n"
  );
}

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Mount the route groups
app.use("/api/auth", authRoutes);   // register / login
app.use("/api/movies", movieRoutes); // featured / search / details (public)
app.use("/api/me", meRoutes);        // ratings + watchlist (login required)

// Unknown API routes return JSON 404 (so the SPA fallback below never hijacks them).
app.use("/api", (req, res) => res.status(404).json({ error: "Not found." }));

// --- Serve the built React frontend (production) ---
// During deployment the frontend is built into frontend/dist. If that folder
// exists, Express serves it AND falls back to index.html for client-side routes
// (so refreshing /movie/tt123 or /profile still works).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.join(__dirname, "..", "frontend", "dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (req, res) => res.sendFile(path.join(clientDist, "index.html")));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎬 CineRate backend running at http://localhost:${PORT}`);
});

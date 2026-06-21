// Ratings & watchlist routes — all require the user to be logged in.
import express from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// All routes below this line require a valid login token.
router.use(requireAuth);

// POST /api/me/ratings  -> add or update the current user's rating for a movie
// body: { imdbId, title, poster, score }
router.post("/ratings", (req, res) => {
  const { imdbId, title, poster, score } = req.body || {};
  const value = Number(score);

  if (!imdbId || !value || value < 1 || value > 10) {
    return res.status(400).json({ error: "A movie id and a score from 1–10 are required." });
  }

  // "ON CONFLICT" updates the existing rating if the user already rated this movie.
  db.prepare(`
    INSERT INTO ratings (user_id, imdb_id, title, poster, score)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, imdb_id)
    DO UPDATE SET score = excluded.score, created_at = datetime('now')
  `).run(req.user.id, imdbId, title || null, poster || null, value);

  res.json({ ok: true, score: value });
});

// GET /api/me/ratings/:imdbId  -> the current user's rating for one movie (or null)
router.get("/ratings/:imdbId", (req, res) => {
  const row = db
    .prepare("SELECT score FROM ratings WHERE user_id = ? AND imdb_id = ?")
    .get(req.user.id, req.params.imdbId);
  res.json({ score: row ? row.score : null });
});

// GET /api/me/ratings  -> all of the current user's ratings (for their profile)
router.get("/ratings", (req, res) => {
  const rows = db
    .prepare("SELECT imdb_id AS imdbId, title, poster, score, created_at AS createdAt FROM ratings WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.user.id);
  res.json(rows);
});

// DELETE /api/me/ratings/:imdbId  -> remove a rating
router.delete("/ratings/:imdbId", (req, res) => {
  db.prepare("DELETE FROM ratings WHERE user_id = ? AND imdb_id = ?")
    .run(req.user.id, req.params.imdbId);
  res.json({ ok: true });
});

// --- Watchlist ---

// POST /api/me/watchlist  -> add a movie to the watchlist
router.post("/watchlist", (req, res) => {
  const { imdbId, title, poster, year } = req.body || {};
  if (!imdbId) return res.status(400).json({ error: "A movie id is required." });

  db.prepare(`
    INSERT OR IGNORE INTO watchlist (user_id, imdb_id, title, poster, year)
    VALUES (?, ?, ?, ?, ?)
  `).run(req.user.id, imdbId, title || null, poster || null, year || null);

  res.json({ ok: true });
});

// GET /api/me/watchlist  -> the current user's watchlist
router.get("/watchlist", (req, res) => {
  const rows = db
    .prepare("SELECT imdb_id AS imdbId, title, poster, year FROM watchlist WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.user.id);
  res.json(rows);
});

// GET /api/me/watchlist/:imdbId  -> is this movie on the watchlist? (true/false)
router.get("/watchlist/:imdbId", (req, res) => {
  const row = db
    .prepare("SELECT 1 FROM watchlist WHERE user_id = ? AND imdb_id = ?")
    .get(req.user.id, req.params.imdbId);
  res.json({ inWatchlist: !!row });
});

// DELETE /api/me/watchlist/:imdbId  -> remove from watchlist
router.delete("/watchlist/:imdbId", (req, res) => {
  db.prepare("DELETE FROM watchlist WHERE user_id = ? AND imdb_id = ?")
    .run(req.user.id, req.params.imdbId);
  res.json({ ok: true });
});

export default router;

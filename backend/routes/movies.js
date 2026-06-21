// Movie routes — these proxy requests to the OMDb API so the API key stays
// secret on the server (never exposed to the browser). They also mix in
// our own site's average user rating from the database.
import express from "express";
import db from "../db.js";

const router = express.Router();
const OMDB_URL = "https://www.omdbapi.com/";

// A curated list of well-known movies shown on the homepage,
// since OMDb has no "popular/trending" endpoint of its own.
const FEATURED_IMDB_IDS = [
  "tt0111161", // The Shawshank Redemption
  "tt0468569", // The Dark Knight
  "tt1375666", // Inception
  "tt0137523", // Fight Club
  "tt0110912", // Pulp Fiction
  "tt0109830", // Forrest Gump
  "tt0816692", // Interstellar
  "tt0133093", // The Matrix
  "tt4154796", // Avengers: Endgame
  "tt0120737", // LOTR: Fellowship of the Ring
  "tt6751668", // Parasite
  "tt0167260", // LOTR: Return of the King
];

// Helper: call OMDb with the secret key attached.
async function omdb(params) {
  const url = new URL(OMDB_URL);
  url.searchParams.set("apikey", process.env.OMDB_API_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const r = await fetch(url);
  return r.json();
}

// Helper: how many users on our site rated this movie, and the average.
function siteRating(imdbId) {
  const row = db
    .prepare("SELECT COUNT(*) AS count, AVG(score) AS avg FROM ratings WHERE imdb_id = ?")
    .get(imdbId);
  return {
    siteAverage: row.avg ? Number(row.avg.toFixed(1)) : null,
    siteVotes: row.count,
  };
}

// GET /api/movies/featured  -> homepage list of curated movies
router.get("/featured", async (req, res) => {
  try {
    const movies = await Promise.all(
      FEATURED_IMDB_IDS.map((id) => omdb({ i: id }))
    );
    res.json(movies.filter((m) => m && m.Response === "True"));
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Could not reach the movie database." });
  }
});

// GET /api/movies/search?q=batman&page=1  -> search by title
router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  const page = req.query.page || "1";
  if (!q) return res.json({ results: [], total: 0 });

  try {
    const data = await omdb({ s: q, page });
    if (data.Response === "False") {
      return res.json({ results: [], total: 0, message: data.Error });
    }
    res.json({
      results: data.Search || [],
      total: Number(data.totalResults) || 0,
      page: Number(page),
    });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Could not reach the movie database." });
  }
});

// GET /api/movies/:id  -> full details for one movie (+ our site rating)
router.get("/:id", async (req, res) => {
  try {
    const data = await omdb({ i: req.params.id, plot: "full" });
    if (data.Response === "False") {
      return res.status(404).json({ error: data.Error || "Movie not found." });
    }
    res.json({ ...data, ...siteRating(req.params.id) });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Could not reach the movie database." });
  }
});

export default router;

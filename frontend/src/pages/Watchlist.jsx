import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import MovieCard from "../components/MovieCard.jsx";

export default function Watchlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.myWatchlist().then(setItems).finally(() => setLoading(false));
  }, []);

  async function remove(imdbId) {
    await api.removeWatch(imdbId);
    setItems((xs) => xs.filter((x) => x.imdbId !== imdbId));
  }

  return (
    <div>
      <h2 className="section-title">📝 Your Watchlist</h2>
      {loading && <p className="muted">Loading…</p>}
      {!loading && items.length === 0 && (
        <p className="muted">Your watchlist is empty. <Link to="/">Browse movies →</Link></p>
      )}

      <div className="movie-grid">
        {items.map((m) => (
          <div key={m.imdbId} className="watch-cell">
            {/* MovieCard expects Poster/Title/Year/imdbID-style keys */}
            <MovieCard movie={{ imdbID: m.imdbId, Title: m.title, Year: m.year, Poster: m.poster }} />
            <button className="btn-ghost small" onClick={() => remove(m.imdbId)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

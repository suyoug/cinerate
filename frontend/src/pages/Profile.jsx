import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const NO_POSTER = "https://via.placeholder.com/120x178/1a1430/7c5cff?text=No+Poster";

export default function Profile() {
  const { user } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    api.myRatings().then(setRatings).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function remove(imdbId) {
    await api.deleteRating(imdbId);
    setRatings((rs) => rs.filter((r) => r.imdbId !== imdbId));
  }

  return (
    <div>
      <h2 className="section-title">👤 {user.username}'s Ratings</h2>
      {loading && <p className="muted">Loading…</p>}
      {!loading && ratings.length === 0 && (
        <p className="muted">You haven't rated any movies yet. <Link to="/">Find some to rate →</Link></p>
      )}

      <div className="rating-list">
        {ratings.map((r) => (
          <div className="rating-item" key={r.imdbId}>
            <Link to={`/movie/${r.imdbId}`}>
              <img src={r.poster && r.poster !== "N/A" ? r.poster : NO_POSTER} alt={r.title} />
            </Link>
            <div className="rating-item-body">
              <Link to={`/movie/${r.imdbId}`} className="title">{r.title || r.imdbId}</Link>
              <span className="score-pill">★ {r.score}/10</span>
            </div>
            <button className="btn-ghost small" onClick={() => remove(r.imdbId)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

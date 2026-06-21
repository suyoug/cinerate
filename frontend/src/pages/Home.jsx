import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import MovieCard from "../components/MovieCard.jsx";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hero, setHero] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .featured()
      .then((data) => setMovies(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function onHeroSearch(e) {
    e.preventDefault();
    if (hero.trim()) navigate(`/search?q=${encodeURIComponent(hero.trim())}`);
  }

  return (
    <div>
      <section className="hero">
        <h1>Discover, rate &amp; track the movies you love.</h1>
        <p>Real IMDb ratings, plus your own. Build your watchlist and never lose track.</p>
        <form className="hero-search" onSubmit={onHeroSearch}>
          <input
            placeholder="Search for a movie…"
            value={hero}
            onChange={(e) => setHero(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </section>

      <section>
        <h2 className="section-title">Featured Movies</h2>
        {loading && <p className="muted">Loading movies…</p>}
        {error && (
          <p className="error-box">
            {error} — make sure the backend is running and your OMDb key is set in
            <code> backend/.env</code>.
          </p>
        )}
        <div className="movie-grid">
          {movies.map((m) => (
            <MovieCard key={m.imdbID} movie={m} />
          ))}
        </div>
      </section>
    </div>
  );
}

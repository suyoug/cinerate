import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import StarRating from "../components/StarRating.jsx";

const NO_POSTER = "https://via.placeholder.com/300x444/1a1430/7c5cff?text=No+Poster";

export default function MovieDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [myScore, setMyScore] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [notice, setNotice] = useState("");

  // Load the movie details.
  useEffect(() => {
    setLoading(true);
    api
      .movie(id)
      .then(setMovie)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // If logged in, load this user's existing rating & watchlist status.
  useEffect(() => {
    if (!user) return;
    api.myRating(id).then((r) => setMyScore(r.score)).catch(() => {});
    api.watchStatus(id).then((r) => setInWatchlist(r.inWatchlist)).catch(() => {});
  }, [id, user]);

  async function handleRate(score) {
    try {
      await api.rate({ imdbId: id, title: movie.Title, poster: movie.Poster, score });
      setMyScore(score);
      setNotice(`Saved your rating of ${score}/10 ⭐`);
      // Refresh site average
      const fresh = await api.movie(id);
      setMovie(fresh);
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function toggleWatchlist() {
    try {
      if (inWatchlist) {
        await api.removeWatch(id);
        setInWatchlist(false);
        setNotice("Removed from your watchlist.");
      } else {
        await api.addWatch({ imdbId: id, title: movie.Title, poster: movie.Poster, year: movie.Year });
        setInWatchlist(true);
        setNotice("Added to your watchlist 📝");
      }
    } catch (err) {
      setNotice(err.message);
    }
  }

  if (loading) return <p className="muted">Loading…</p>;
  if (error) return <p className="error-box">{error}</p>;
  if (!movie) return null;

  const poster = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : NO_POSTER;

  return (
    <article className="detail">
      <div className="detail-poster">
        <img src={poster} alt={movie.Title} />
      </div>

      <div className="detail-info">
        <h1>{movie.Title} <span className="muted">({movie.Year})</span></h1>

        <div className="meta-row">
          {movie.Rated && movie.Rated !== "N/A" && <span className="chip">{movie.Rated}</span>}
          {movie.Runtime && movie.Runtime !== "N/A" && <span className="chip">{movie.Runtime}</span>}
          {movie.Genre && movie.Genre !== "N/A" &&
            movie.Genre.split(", ").map((g) => <span key={g} className="chip genre">{g}</span>)}
        </div>

        <div className="ratings-row">
          <div className="rating-box imdb">
            <span className="big">★ {movie.imdbRating !== "N/A" ? movie.imdbRating : "—"}</span>
            <span className="label">IMDb {movie.imdbVotes !== "N/A" ? `(${movie.imdbVotes} votes)` : ""}</span>
          </div>
          <div className="rating-box site">
            <span className="big">{movie.siteAverage ?? "—"}</span>
            <span className="label">CineRate users ({movie.siteVotes} votes)</span>
          </div>
        </div>

        {movie.Plot && movie.Plot !== "N/A" && <p className="plot">{movie.Plot}</p>}

        <dl className="credits">
          {movie.Director && movie.Director !== "N/A" && (<><dt>Director</dt><dd>{movie.Director}</dd></>)}
          {movie.Writer && movie.Writer !== "N/A" && (<><dt>Writer</dt><dd>{movie.Writer}</dd></>)}
          {movie.Actors && movie.Actors !== "N/A" && (<><dt>Cast</dt><dd>{movie.Actors}</dd></>)}
          {movie.Released && movie.Released !== "N/A" && (<><dt>Released</dt><dd>{movie.Released}</dd></>)}
          {movie.Awards && movie.Awards !== "N/A" && (<><dt>Awards</dt><dd>{movie.Awards}</dd></>)}
        </dl>

        <div className="user-actions">
          {user ? (
            <>
              <h3>Rate this movie</h3>
              <StarRating value={myScore} onRate={handleRate} />
              <button className="btn-primary watch-btn" onClick={toggleWatchlist}>
                {inWatchlist ? "✓ In your watchlist" : "+ Add to watchlist"}
              </button>
            </>
          ) : (
            <p className="muted">
              <Link to="/login">Log in</Link> or <Link to="/register">sign up</Link> to rate this
              movie and add it to your watchlist.
            </p>
          )}
          {notice && <p className="notice">{notice}</p>}
        </div>
      </div>
    </article>
  );
}

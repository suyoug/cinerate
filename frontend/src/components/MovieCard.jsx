import { Link } from "react-router-dom";

// A reusable poster card for a movie. Works with data from either the
// search endpoint (imdbID/Title/Year/Poster) or the details endpoint.
const NO_POSTER = "https://via.placeholder.com/300x444/1a1430/7c5cff?text=No+Poster";

export default function MovieCard({ movie }) {
  const id = movie.imdbID || movie.imdbId;
  const poster = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : NO_POSTER;
  const rating = movie.imdbRating && movie.imdbRating !== "N/A" ? movie.imdbRating : null;

  return (
    <Link to={`/movie/${id}`} className="movie-card">
      <div className="poster-wrap">
        <img src={poster} alt={movie.Title} loading="lazy" />
        {rating && <span className="imdb-badge">★ {rating}</span>}
      </div>
      <div className="movie-card-body">
        <h3 title={movie.Title}>{movie.Title}</h3>
        <span className="year">{movie.Year}</span>
      </div>
    </Link>
  );
}

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import MovieCard from "../components/MovieCard.jsx";

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Re-run the search whenever the query or page changes.
  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setMessage("");
    api
      .search(query, page)
      .then((data) => {
        setResults(data.results);
        setTotal(data.total);
        if (data.results.length === 0) setMessage(data.message || "No movies found.");
      })
      .catch((err) => setMessage(err.message))
      .finally(() => setLoading(false));
  }, [query, page]);

  // Reset to page 1 when a new query comes in.
  useEffect(() => setPage(1), [query]);

  const totalPages = Math.ceil(total / 10);

  return (
    <div>
      <h2 className="section-title">
        {query ? <>Results for “{query}”</> : "Search"}
        {total > 0 && <span className="muted"> · {total} found</span>}
      </h2>

      {loading && <p className="muted">Searching…</p>}
      {!loading && message && <p className="error-box">{message}</p>}

      <div className="movie-grid">
        {results.map((m) => (
          <MovieCard key={m.imdbID} movie={m} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            ← Prev
          </button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

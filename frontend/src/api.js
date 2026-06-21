// A small helper for talking to the backend API.
// It automatically attaches the saved login token to every request.

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { ...options, headers });

  // Try to read JSON; some responses may be empty.
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* no body */
  }

  if (!res.ok) {
    throw new Error((data && data.error) || "Something went wrong.");
  }
  return data;
}

export const api = {
  // Auth
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  // Movies (public)
  featured: () => request("/movies/featured"),
  search: (q, page = 1) => request(`/movies/search?q=${encodeURIComponent(q)}&page=${page}`),
  movie: (id) => request(`/movies/${id}`),

  // Ratings (require login)
  myRating: (imdbId) => request(`/me/ratings/${imdbId}`),
  rate: (body) => request("/me/ratings", { method: "POST", body: JSON.stringify(body) }),
  myRatings: () => request("/me/ratings"),
  deleteRating: (imdbId) => request(`/me/ratings/${imdbId}`, { method: "DELETE" }),

  // Watchlist (require login)
  watchStatus: (imdbId) => request(`/me/watchlist/${imdbId}`),
  addWatch: (body) => request("/me/watchlist", { method: "POST", body: JSON.stringify(body) }),
  myWatchlist: () => request("/me/watchlist"),
  removeWatch: (imdbId) => request(`/me/watchlist/${imdbId}`, { method: "DELETE" }),
};

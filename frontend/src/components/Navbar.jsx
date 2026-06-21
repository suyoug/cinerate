import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu toggle

  // Close the mobile menu whenever the page changes.
  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);

  function onSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setMenuOpen(false);
    }
  }

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="logo">
          🎬 Cine<span>Rate</span>
        </Link>

        {/* Search (always visible on desktop; inside the dropdown on mobile) */}
        <form className="search-bar" onSubmit={onSearch}>
          <input
            type="text"
            placeholder="Search movies…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">Search</button>
        </form>

        {/* Hamburger button — only shows on small screens via CSS */}
        <button
          className="hamburger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>

        {/* Links — collapse into a dropdown on mobile */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {user ? (
            <>
              <Link to="/watchlist">Watchlist</Link>
              <Link to="/profile" className="username">👤 {user.username}</Link>
              <button className="btn-ghost" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

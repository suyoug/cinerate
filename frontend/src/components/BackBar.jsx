import { useNavigate, useLocation, Link } from "react-router-dom";

// A small navigation bar shown on every page except the home page.
// "Back" goes one step back in history; "Home" jumps straight to the homepage.
export default function BackBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show it on the home page itself.
  if (location.pathname === "/") return null;

  return (
    <div className="back-bar">
      <button className="back-link" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <Link to="/" className="back-link">🏠 Home</Link>
    </div>
  );
}

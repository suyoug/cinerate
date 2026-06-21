// Middleware that protects routes requiring a logged-in user.
// It reads the JWT from the "Authorization: Bearer <token>" header,
// verifies it, and attaches the user info to req.user.
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "You must be logged in to do that." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, username: payload.username };
    next();
  } catch {
    return res.status(401).json({ error: "Session expired. Please log in again." });
  }
}

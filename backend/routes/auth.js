// Authentication routes: register and login.
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

// Helper: create a signed login token for a user.
function makeToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register  -> create a new account
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body || {};

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email and password are all required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  try {
    // Hash the password so we never store it in plain text.
    const hash = await bcrypt.hash(password, 10);

    const result = db
      .prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)")
      .run(username.trim(), email.trim().toLowerCase(), hash);

    const user = { id: result.lastInsertRowid, username: username.trim() };
    const token = makeToken(user);

    res.status(201).json({ token, user });
  } catch (err) {
    // UNIQUE constraint failed -> username or email already taken
    if (String(err.message).includes("UNIQUE")) {
      return res.status(409).json({ error: "That username or email is already taken." });
    }
    console.error(err);
    res.status(500).json({ error: "Something went wrong creating your account." });
  }
});

// POST /api/auth/login  -> log into an existing account
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.trim().toLowerCase());

  if (!user) {
    return res.status(401).json({ error: "No account found with that email." });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ error: "Incorrect password." });
  }

  const token = makeToken(user);
  res.json({ token, user: { id: user.id, username: user.username } });
});

export default router;

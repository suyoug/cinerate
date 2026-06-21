// Database setup using Node's built-in SQLite (node:sqlite, available in Node 22+).
// No native compilation needed. The database is stored in a single file: cinerate.db
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("cinerate.db");

// Improves concurrency/performance for our read-heavy app.
db.exec("PRAGMA journal_mode = WAL");

// --- Create tables if they don't exist yet ---

// Users of the site.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    username   TEXT UNIQUE NOT NULL,
    email      TEXT UNIQUE NOT NULL,
    password   TEXT NOT NULL,            -- bcrypt hash, never plain text
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// A rating a user gave to a movie (movie identified by its IMDb id, e.g. "tt0111161").
// UNIQUE(user_id, imdb_id) means a user can only have ONE rating per movie (we update it).
db.exec(`
  CREATE TABLE IF NOT EXISTS ratings (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL,
    imdb_id    TEXT NOT NULL,
    title      TEXT,
    poster     TEXT,
    score      INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, imdb_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Movies a user saved to their watchlist.
db.exec(`
  CREATE TABLE IF NOT EXISTS watchlist (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL,
    imdb_id    TEXT NOT NULL,
    title      TEXT,
    poster     TEXT,
    year       TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, imdb_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

export default db;

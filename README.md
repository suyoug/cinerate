# 🎬 CineRate — A Movie Rating Website

An IMDb-style movie database where users can browse movies, view **real IMDb ratings**,
sign up, and rate films themselves. Built with a fresh dark-violet theme (not IMDb yellow).

## Tech Stack
- **Frontend:** React + Vite, React Router
- **Backend:** Node.js + Express
- **Database:** SQLite (via better-sqlite3)
- **Auth:** JWT + bcrypt
- **Movie data:** [OMDb API](https://www.omdbapi.com/) (real IMDb ratings)

## Features
- 🔎 Search movies by title
- 🎞️ Movie detail pages (poster, plot, cast, genre, IMDb rating)
- ⭐ Rate movies 1–10 (your ratings saved to your account)
- 👤 User accounts (register / login)
- 📝 Personal watchlist
- 📊 Site-wide average user rating per movie

## Project Structure
```
Project/
├── backend/        Express API + SQLite database
└── frontend/       React (Vite) single-page app
```

## Setup

### 1. Get a free OMDb API key
1. Go to https://www.omdbapi.com/apikey.aspx
2. Choose the FREE tier, enter your email, and activate the key from the email.
3. Copy the key.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env      # then paste your OMDb key into .env
npm run dev
```
Backend runs on http://localhost:5000

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

Open http://localhost:5173 in your browser. 🎉

## Deploying (free) — share a live link

This app deploys as **one service** on [Render](https://render.com): the Express
backend serves both the API and the built React frontend, so you get a single URL.

1. **Push the code to GitHub** (see steps below).
2. Go to **https://render.com**, sign up (free, use "Sign in with GitHub").
3. Click **New +** → **Blueprint**, pick this repo. Render reads `render.yaml`.
4. When prompted, paste your **OMDB_API_KEY** value. (`JWT_SECRET` is auto-generated.)
5. Click **Apply**. First build takes a few minutes; then you get a public URL like
   `https://cinerate.onrender.com` — share that with anyone. 🎬

> **Notes for the free tier:**
> - The service "sleeps" after ~15 min idle, so the *first* visit may take ~30–50s to wake up. After that it's fast.
> - The SQLite database resets when the service restarts/redeploys, so demo accounts/ratings are temporary. That's fine for a demo; a persistent database can be added later.


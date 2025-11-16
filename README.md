# Lumibyte — Fullstack Chat App (Mock)

This repository contains a minimal implementation of the Lumibyte Fullstack assignment:
- Frontend: React + TailwindCSS (simple Vite-like structure)
- Backend: Node.js + Express (mock JSON APIs, in-memory session store)

**This is a local, downloadable package (not an actual GitHub repo).**
You can inspect, run, and push it to GitHub yourself.

## Quick structure

- backend/         -> Node.js Express API
- frontend/        -> React app (src, public)
- README.md

## Run backend
```bash
cd backend
npm install
node index.js
# server runs on http://localhost:4000
```

## Run frontend
```bash
cd frontend
npm install
npm run dev
# or if using react-scripts: npm start
# frontend expects backend at http://localhost:4000
```

## Notes
- No database used. Sessions are stored in-memory and mock JSON files.
- Session ID is attached to URL; session history loads when selected.

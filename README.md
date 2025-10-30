
# Faida Finder

Faida Finder collects and organizes information about public benefits and services (currently focused on Kenyan government and related sites) and exposes a small API to query that information. The repository contains a NestJS backend (API + scrapers) and a React frontend (in `frontend/`) that consumes the API.

## Quick overview

- Backend: NestJS + TypeORM. Scrapes public websites using Axios + Cheerio, stores documents in SQLite (default: in-memory), and exposes REST endpoints.
- Frontend: React (Create React App) that lists topics and lets users ask questions about a topic (the UI calls backend endpoints).

Important: Start the backend API before starting the frontend. The frontend expects the API to be available at the URL in `REACT_APP_API_BASE` (default `http://localhost:3333`).

---

## Requirements

- Node.js 18+ (Node 20 recommended)
- npm (or yarn)

## Run the app (development)

1. Install root dependencies

```bash
# from repo root
npm install
```

2. Start the backend API (recommended to run from a separate terminal)

```bash
# from repo root (faida-finder)
# development (watch)


# or build + run
npm run build
npm run start
```

The backend listens on port `3333` by default (change with `PORT` env var). It exposes the following endpoints:

- `GET /` — health / greeting
- `GET /topics` — list available topics
- `POST /topics/:id/ask` — ask a question about a topic, JSON body `{ "question": "..." }`
- `POST /topics/:id/refresh` — trigger a re-scrape of the topic

3. Start the frontend

```bash
cd faida-finder/frontend
npm install
# start dev server and point it to the backend
REACT_APP_API_BASE=http://localhost:3333 npm start
```

If the frontend dev server opens on port `3000` (or `3001` if `3000` is occupied), open the printed "Local" URL in your browser. The frontend will make requests to the backend using `REACT_APP_API_BASE`.

---

## Build for production

1. Build backend and frontend separately.

Backend (from repo root):

```bash
npm run build
# then run with
npm run start:prod
```

Frontend (from `frontend/`):

```bash
cd frontend
npm run build
# Serve the build folder with a static server (e.g. serve or nginx)
```

Note: This repo does not currently include automated deployment or a single production server that serves both backend and frontend; you'll need to host the built frontend separately (or serve it from the backend as static files if you prefer).

---

## Configuration & environment

- `PORT` — server port for backend (default: 3333)
- `REACT_APP_API_BASE` — base URL the frontend uses to call the backend (default: `http://localhost:3333`)

Database: By default the app uses SQLite in-memory while developing. To persist data between restarts, update `src/app.module.ts` TypeORM configuration to point to a file path (for example `data/faida.db`) and restart the backend.

---

## Technologies used and how they fit together

- NestJS (backend framework)
    - Provides a modular structure (controllers, services, modules) and dependency injection.
    - Routes are defined in controllers (see `src/topics/topics.controller.ts`).

- TypeORM
    - ORM used to model `Topic` and `Document` entities and persist scraped content.
    - Currently configured to use SQLite (in-memory by default). See `src/app.module.ts` for configuration.

- Axios + Cheerio (scraping)
    - `TopicsService` uses `axios` to fetch pages and `cheerio` to parse HTML and extract text.

- node-cron (planned)
    - The project includes the dependency to schedule periodic re-scrapes if you want to enable scheduled updates.

- React (frontend)
    - Built with Create React App (CRA). The frontend code is located in `frontend/src/` and talks to the backend API to load topics and perform questions.
    - The frontend uses `axios` to call the API (see `frontend/src/services/api.ts`).

- Husky + lint-staged + Prettier + ESLint
    - Pre-commit hooks are configured to keep code formatted and linted on commit. Install hooks with `npm install` (the `prepare` script runs Husky automatically).

---

## Project layout (high level)

```
.
├─ src/                      # NestJS backend source
│  ├─ topics/                # Topics controller/service module and scrapers
│  ├─ entities/              # TypeORM entities (Topic, Document)
│  ├─ polyfills/             # small runtime shims (File polyfill for Node <20)
│  ├─ main.ts                # backend bootstrap
│  └─ app.module.ts          # TypeORM + module wiring
├─ frontend/                 # React app (Create React App)
│  ├─ src/
│  │  ├─ components/        # TopicList, TopicCard, QuestionForm, AnswerDisplay
│  │  └─ services/api.ts     # small API wrapper that calls backend
│  └─ package.json
├─ test/                     # e2e tests
└─ package.json              # workspace scripts and dependencies
```

---

## Troubleshooting & tips

- If `npm run start` for the backend reports `EADDRINUSE` (address already in use), find and kill the process using that port:

```bash
# find PID
lsof -i :3333 -sTCP:LISTEN -Pn
# kill PID
kill -9 <PID>
```

- If the frontend fails to call the backend due to CORS, ensure the backend is running and `src/main.ts` has `app.enableCors()` configured (the development setup enables CORS for `http://localhost:3000`/`3001`).

- To quickly test the API:

```bash
curl http://localhost:3333/topics
curl -X POST http://localhost:3333/topics/nssf/ask -H 'Content-Type: application/json' -d '{"question":"What is the retirement age?"}'
```

- If the scraper logs warnings about certificate verification for certain target sites, that means upstream site certificates are misconfigured. You can either ignore those sites or implement site-specific workarounds (not recommended for production) by configuring https agent options.

---

## Next steps / suggestions

- Persist the SQLite DB to a file (change TypeORM config) so data survives restarts.
- Add authentication and rate-limiting if exposing the API publicly.
- Add a scheduled re-scrape job (node-cron) to keep data fresh.
- Improve frontend UI and add pagination/search over documents.

---

If you'd like, I can also:

- Wire a production build process that serves the frontend from the backend
- Add a small Dockerfile + docker-compose to run the full stack locally
- Add persistent SQLite file-based config and a migration strategy

Tell me which you'd like me to do next and I'll implement it.

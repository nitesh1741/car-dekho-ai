# Car Shortlist Assistant

Full-stack web app for the [CarDekho Group AI-native software engineer assignment](CarDekho%20Group%20_%20AI%20Assignment.pdf). It helps a confused car buyer move from “I don’t know what to buy” to a confident, explainable shortlist.

## What I Built and Why

**Product choice:** Instead of browsing a full catalog, the app asks practical questions (budget, daily usage, family size, fuel and body preferences, safety and mileage priorities) and returns a **ranked shortlist** with **reasons** and **tradeoffs** for each car. That matches the brief: reduce option overload and help a buyer make progress quickly.

**What ships today:**

1. **Guided questionnaire** (Next.js) — landing page, preference form, validation, and backend health checks.
2. **Deterministic recommendation engine** (FastAPI) — weighted scoring over a curated seed dataset of **24 Indian-market cars** (not scraped production data).
3. **Explainable results** — fit score (0–100), positive reasons, tradeoffs, per-criterion breakdown, top-3 cards, and a comparison table for the full ranked list.
4. **Shortlist persistence API** — `POST /shortlists` and `GET /shortlists/{id}` store preferences and results in `backend/runtime/shortlists.json` (backend-only for now; see cuts below).

Scoring is intentionally **rule-based, not LLM-based**: fast to test, predictable for evaluators, and every recommendation can be traced to explicit criteria weights.

## What I Deliberately Cut

| Cut | Reason |
| --- | --- |
| Authentication and accounts | Not needed for a 2–3 hour MVP; adds friction for evaluators. |
| Dealer workflows, payments, live inventory | Out of scope for “help me choose,” high integration cost. |
| Scraping real CarDekho data | Legal/ops risk; seeded JSON is enough to prove the flow. |
| LLM / RAG recommendations | Hard to test and explain under time pressure; deterministic scoring first. |
| Save-shortlist UI | Backend API exists; frontend “save & share link” deferred to save UI time. |
| Pixel-perfect marketing site | First screen is the workflow, not brand chrome. |

## Tech Stack and Rationale

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4** | Fast App Router setup, typed API client, good DX for forms and responsive UI. |
| Backend | **Python**, **FastAPI**, **Pydantic** | Clear request/response models, automatic OpenAPI docs, quick to test with pytest. |
| Data | **JSON seed file** (`backend/data/cars.json`) | No DB setup for evaluators; validated at load time. |
| Persistence | **JSON file** under `backend/runtime/` | Good enough for demo shortlists without SQLite ops. |
| Tests | **pytest** (backend) | Focus on scoring correctness and API contracts, not ceremonial coverage. |

Repository layout:

- `frontend/` — buyer-facing app
- `backend/` — API, scoring, dataset, shortlist storage
- `docs/superpowers/` — spec-driven phase plans used during development

## AI Tools vs Manual Work

**Delegated to AI (Cursor / agentic coding):**

- Repository scaffolding, phase plans, and repetitive boilerplate (Pydantic models, test stubs, Dockerfile drafts).
- First passes on UI components (form layout, results cards, comparison table).
- Expanding the seed dataset structure and validation rules.

**Done manually (review, edit, or write myself):**

- **Scoping** — what to build first vs cut (questionnaire → scoring → API → UI, not auth/scraping/LLM).
- **Recommendation weights and copy** — tuning reason/tradeoff strings so results feel credible to a buyer.
- **Verifying tests and API contracts** — running pytest, fixing field names, CORS for local and deployed frontend.
- **Rejecting bad AI output** — e.g. over-engineered persistence, broken `docker-compose.yml` literals, or lint patterns that fight React 19 rules.

**Where AI helped most:** Speed on typed CRUD-style code, FastAPI endpoints, and repetitive React form state. **Where it got in the way:** Occasionally wrong import paths, optimistic “done” claims before tests ran, and generic Next.js README/docker snippets that did not match this repo’s layout without a human pass.

## If I Had Another 4 Hours

1. **Save shortlist in the UI** — call `POST /shortlists`, show shareable link, load via `GET /shortlists/{id}`.
2. **Deploy backend** (Railway/Fly) and wire `NEXT_PUBLIC_API_BASE_URL` for a single live demo URL.
3. **Shortlist API tests** with isolated temp storage (mirror recommendation test style).
4. **Fix frontend lint** (`ThemeProvider` hydration/theme effect) and add one Playwright happy-path test.
5. **Richer dataset** — more variants and price bands; optional “why not this car?” for runners-up.

## Recommendation Model

Weighted criteria (max score 100):

| Criterion | Weight |
| --- | ---: |
| Budget fit | 30 |
| Primary usage fit | 20 |
| Fuel preference | 15 |
| Safety priority | 15 |
| Mileage priority | 10 |
| Family / body type fit | 10 |
| Transmission preference | 5 (bonus) |

Each result includes `score`, `reasons`, `tradeoffs`, and `matchedCriteria` (per-dimension contribution).

## API Overview

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Service status |
| `POST` | `/recommendations` | Ranked recommendations for buyer preferences |
| `POST` | `/shortlists` | Persist preferences + recommendations; returns `shortlistId` |
| `GET` | `/shortlists/{shortlistId}` | Retrieve a saved shortlist |

Sample `POST /recommendations` body:

```json
{
  "budgetMinLakh": 8,
  "budgetMaxLakh": 16,
  "primaryUsage": "mixed",
  "preferredFuelTypes": ["petrol"],
  "preferredBodyTypes": ["compact_suv"],
  "familySize": 4,
  "safetyPriority": 5,
  "mileagePriority": 3,
  "transmissionPreference": "automatic"
}
```

Interactive docs when the backend is running: `http://127.0.0.1:8000/docs`

## Local Run Instructions

**Prerequisites:** Python 3.12+, Node.js 20+, npm.

### Option A — Two terminals (recommended for development)

**1. Backend**

```powershell
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Health check: `http://127.0.0.1:8000/health`

**2. Frontend**

```powershell
cd frontend
copy ..\.env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`, click **Find my cars**, complete the questionnaire, and review ranked results.

`NEXT_PUBLIC_API_BASE_URL` defaults to `http://localhost:8000` in `frontend/lib/api.ts` if unset.

### Option B — Docker Compose

From the repository root:

```powershell
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

> Dockerfiles expect build context at the repo root. If images fail to build, use Option A.

### Manual API check (optional)

```powershell
curl -X POST http://127.0.0.1:8000/recommendations `
  -H "Content-Type: application/json" `
  -d "{\"budgetMinLakh\":8,\"budgetMaxLakh\":16,\"primaryUsage\":\"mixed\",\"preferredFuelTypes\":[\"petrol\"],\"preferredBodyTypes\":[\"compact_suv\"],\"familySize\":4,\"safetyPriority\":5,\"mileagePriority\":3,\"transmissionPreference\":\"automatic\"}"
```

Validate dataset load:

```powershell
python -c "from backend.app.repository import load_cars; print(len(load_cars()))"
```

Expected: `24`

## Testing

**Backend** (from repo root):

```powershell
pip install -r backend/requirements.txt
python -m pytest backend
```

Current status: **15 tests passing** (health, repository, recommender, recommendations API).

**Frontend:**

```powershell
cd frontend
npm run build
npm run lint
```

`npm run build` succeeds; `npm run lint` may report one `ThemeProvider` effect warning until fixed.

## Screen Recording (Submission)

Per the assignment, record the **full build/process** (terminal, editor, browser) — unedited or lightly fast-forwarded — and upload to Loom, Google Drive, or YouTube (unlisted). Include the link with your submission alongside this repo.

Suggested demo flow for the recording:

1. Start backend and frontend.
2. Open the app → **Find my cars**.
3. Submit preferences → show top matches, reasons, and comparison table.
4. (Optional) `POST /shortlists` via `/docs` or curl and retrieve by ID.

## Development Notes

Built in phases using spec-driven plans under `docs/superpowers/`. Primary spec:

`docs/superpowers/specs/2026-05-30-car-shortlist-assistant-10-phase-spec.md`

Backend-specific commands: `backend/README.md`

## Live Deployment

Frontend may be deployed on Vercel (`https://car-dekho-ai.vercel.app`); ensure the backend URL is set via `NEXT_PUBLIC_API_BASE_URL` and CORS allows that origin in `backend/app/main.py`.

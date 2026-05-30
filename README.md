# Car Shortlist Assistant

Car Shortlist Assistant is a full-stack web app for the CarDekho Group AI-native software engineer assignment. It helps a confused car buyer answer practical preference questions and receive an explainable shortlist of recommended cars.

## Current Status

Phase 2 adds the FastAPI backend foundation with a `/health` endpoint and pytest coverage.

## Planned Architecture

- `frontend/`: Next.js, TypeScript, and React buyer-facing web app.
- `backend/`: Python FastAPI service for car data, recommendation scoring, explanations, and shortlist persistence.
- `docs/superpowers/`: spec-driven development documents, implementation plans, and phase notes.

## MVP Scope

The MVP will focus on a guided recommendation flow:

1. Buyer enters budget, usage, family size, safety priority, mileage priority, fuel preference, body type preference, and transmission preference.
2. FastAPI scores a curated seed dataset using deterministic weighted criteria.
3. Next.js renders the top recommendations with reasons, tradeoffs, and comparison details.
4. Buyer can save a shortlist through the backend.

## Deliberately Cut

- Authentication.
- Dealer workflows.
- Payments.
- Real-time inventory.
- Scraping production car data.
- LLM or RAG features in the first MVP.

## Development Method

This project is being built through spec-driven development in 10 phases. Each phase must pass its own verification before the next phase starts.

Primary spec:

`docs/superpowers/specs/2026-05-30-car-shortlist-assistant-10-phase-spec.md`

## Local Setup

Backend:

```powershell
cd backend
uvicorn app.main:app --reload
```

Health check:

```text
GET http://127.0.0.1:8000/health
```

Frontend setup commands will be added in Phase 6.

## Testing

Test commands will be added phase by phase:

- Backend: `python -m pytest backend`
- Frontend checks begin in Phase 6.
- End-to-end verification is completed in Phase 10.

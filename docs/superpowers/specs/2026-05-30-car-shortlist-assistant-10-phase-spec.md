# Car Shortlist Assistant 10-Phase Spec

**Project:** CarDekho AI assignment

**Goal:** Build a full-stack web app that helps a confused car buyer answer practical preference questions and receive an explainable shortlist of recommended cars.

**Development Method:** Spec-driven development in 10 phases. Each phase must produce a testable increment before the next phase starts.

**Architecture:** The repository is split into `frontend/` and `backend/`. The Next.js frontend owns the buyer-facing workflow. The FastAPI backend owns the car dataset, recommendation scoring, explanation generation, shortlist persistence, and API contracts.

**Tech Stack:**
- Frontend: Next.js, TypeScript, React, CSS modules or Tailwind CSS.
- Backend: Python, FastAPI, Pydantic, pytest.
- Data: Seeded JSON dataset first; SQLite only if persistence needs exceed JSON.
- Local Run: Root-level `docker-compose.yml` or documented two-command local setup.

---

## Product Scope

### In Scope
- Guided preference questionnaire for a car buyer.
- Curated seed dataset of cars with make, model, variant, price, body type, fuel type, mileage, safety rating, seating, and review summary.
- Backend recommendation scoring with explainable weighted criteria.
- Ranked shortlist with reasons, tradeoffs, and comparable specs.
- Ability to save a shortlist locally through the backend.
- README with assignment-specific reflections and run instructions.
- Tests for backend scoring, API behavior, and critical frontend flows.

### Out of Scope
- Authentication.
- Dealer workflows.
- Payments.
- Real-time inventory.
- Scraping real CarDekho data.
- LLM or RAG features in the MVP.
- Pixel-perfect design.
- Large production-scale database.

---

## Recommendation Model

The first version uses deterministic scoring. This is deliberate because it is fast to build, easy to test, and easy to explain to evaluators.

Default weights:

| Criterion | Weight |
| --- | ---: |
| Budget fit | 30 |
| Primary usage fit | 20 |
| Fuel preference | 15 |
| Safety priority | 15 |
| Mileage priority | 10 |
| Family size / body type fit | 10 |

The API returns:
- `score`: numeric score from 0 to 100.
- `reasons`: specific positive matches.
- `tradeoffs`: specific compromises.
- `matchedCriteria`: machine-readable scoring breakdown.

---

## Phase 1: Repository And Tooling Baseline

**Objective:** Create the project skeleton and make the repo understandable before code exists.

**Files:**
- Create `frontend/`
- Create `backend/`
- Create `README.md`
- Create `.gitignore`
- Create `docs/superpowers/specs/2026-05-30-car-shortlist-assistant-10-phase-spec.md`

**Acceptance Criteria:**
- Root clearly separates frontend and backend code.
- Root README explains project intent, stack, and planned local run flow.
- `.gitignore` excludes Python, Node, environment, and build artifacts.

**Tests / Verification:**
- Run `Get-ChildItem -Force` from root and confirm `frontend/`, `backend/`, `README.md`, `.gitignore`, and `docs/` exist.

---

## Phase 2: Backend FastAPI Foundation

**Objective:** Create a runnable FastAPI backend with health checks and basic project structure.

**Files:**
- Create `backend/app/main.py`
- Create `backend/app/__init__.py`
- Create `backend/requirements.txt`
- Create `backend/tests/test_health.py`
- Create `backend/README.md`

**API Contract:**
- `GET /health`

Response:

```json
{
  "status": "ok",
  "service": "car-shortlist-backend"
}
```

**Acceptance Criteria:**
- Backend starts with `uvicorn app.main:app --reload`.
- `/health` returns HTTP 200.
- pytest health test passes.

**Tests / Verification:**
- Run `pytest`.
- Run backend locally and call `/health`.

---

## Phase 3: Car Dataset And Domain Models

**Objective:** Add a realistic seed dataset and typed backend models.

**Files:**
- Create `backend/app/data/cars.json`
- Create `backend/app/models.py`
- Create `backend/app/repository.py`
- Create `backend/tests/test_repository.py`

**Dataset Requirements:**
- Minimum 24 cars.
- Include hatchback, sedan, compact SUV, SUV, and MPV.
- Include petrol, diesel, CNG, hybrid, and EV where reasonable.
- Each car must include:
  - `id`
  - `make`
  - `model`
  - `variant`
  - `priceLakh`
  - `bodyType`
  - `fuelType`
  - `transmission`
  - `mileage`
  - `safetyRating`
  - `seating`
  - `usageTags`
  - `strengths`
  - `tradeoffs`
  - `reviewSummary`

**Acceptance Criteria:**
- Repository loads all cars from JSON.
- Invalid or missing required fields fail validation.
- Dataset has enough variety to produce meaningful recommendations.

**Tests / Verification:**
- Run repository tests to confirm dataset loads and validates.

---

## Phase 4: Recommendation Scoring Engine

**Objective:** Implement deterministic recommendation logic independent of HTTP.

**Files:**
- Create `backend/app/schemas.py`
- Create `backend/app/recommender.py`
- Create `backend/tests/test_recommender.py`

**Input Schema:**
- `budgetMinLakh`
- `budgetMaxLakh`
- `primaryUsage`: `city`, `highway`, `mixed`, or `family`
- `preferredFuelTypes`
- `preferredBodyTypes`
- `familySize`
- `safetyPriority`: 1 to 5
- `mileagePriority`: 1 to 5
- `transmissionPreference`: `manual`, `automatic`, or `any`

**Output Schema:**
- Ranked recommendations.
- Score.
- Reasons.
- Tradeoffs.
- Matched criteria breakdown.

**Acceptance Criteria:**
- Cars outside budget can still appear only if close enough and marked with a budget tradeoff.
- Exact preference matches score higher than weak matches.
- Safety and mileage priorities influence ranking.
- The recommender can be tested without running FastAPI.

**Tests / Verification:**
- Run tests for budget fit, fuel preference, body type preference, safety priority, mileage priority, and ranking order.

---

## Phase 5: Backend Recommendation API

**Objective:** Expose the scoring engine through FastAPI.

**Files:**
- Modify `backend/app/main.py`
- Modify `backend/app/schemas.py`
- Create `backend/tests/test_recommendations_api.py`

**API Contract:**
- `POST /recommendations`

Request:

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

Response:

```json
{
  "recommendations": [
    {
      "car": {
        "id": "hyundai-creta-sx-petrol",
        "make": "Hyundai",
        "model": "Creta",
        "variant": "SX Petrol"
      },
      "score": 86,
      "reasons": ["Fits your budget", "Good mixed-use compact SUV"],
      "tradeoffs": ["Mileage is average compared with hybrids"],
      "matchedCriteria": {
        "budget": 30,
        "usage": 18,
        "fuel": 15,
        "safety": 12,
        "mileage": 5,
        "familyBody": 6
      }
    }
  ]
}
```

**Acceptance Criteria:**
- API returns top recommendations in descending score order.
- Invalid input returns HTTP 422.
- Empty preference arrays are accepted where optional.

**Tests / Verification:**
- Run API tests with FastAPI test client.

---

## Phase 6: Frontend Next.js Foundation

**Objective:** Create the Next.js frontend shell and connect it to the backend health endpoint.

**Files:**
- Create `frontend/package.json`
- Create `frontend/app/page.tsx`
- Create `frontend/app/layout.tsx`
- Create `frontend/lib/api.ts`
- Create `frontend/README.md`

**Acceptance Criteria:**
- Frontend starts with `npm run dev`.
- Home page loads without backend recommendation functionality.
- Frontend can call backend `/health` through a configured API base URL.
- Environment variable `NEXT_PUBLIC_API_BASE_URL` is documented.

**Tests / Verification:**
- Run `npm run lint` if configured.
- Manually verify the page loads.
- Manually verify health connection state.

---

## Phase 7: Buyer Questionnaire UI

**Objective:** Build the interactive input flow for buyer preferences.

**Files:**
- Create `frontend/components/PreferenceForm.tsx`
- Create `frontend/components/FormField.tsx`
- Modify `frontend/app/page.tsx`
- Add frontend tests if the selected setup includes them.

**UX Requirements:**
- The first screen is the working app, not a marketing landing page.
- The form captures the fields required by the backend schema.
- Controls should be suitable for the data:
  - Budget: numeric inputs or sliders.
  - Fuel/body type: checkboxes or segmented controls.
  - Priorities: sliders or numeric steppers.
  - Transmission: segmented control.
- Submit button is disabled while submitting.
- Validation errors are visible and specific.

**Acceptance Criteria:**
- User can complete the questionnaire in under one minute.
- Invalid budgets are blocked before API submission.
- Form submission sends the expected payload shape.

**Tests / Verification:**
- Run component tests if configured.
- Manually verify valid and invalid submissions.

---

## Phase 8: Recommendation Results And Comparison UI

**Objective:** Render ranked recommendations in a way that helps the buyer choose a shortlist.

**Files:**
- Create `frontend/components/RecommendationResults.tsx`
- Create `frontend/components/CarCard.tsx`
- Create `frontend/components/ComparisonTable.tsx`
- Modify `frontend/app/page.tsx`

**UI Requirements:**
- Show top 3 recommended cars prominently.
- Each recommendation shows:
  - Car name and variant.
  - Score.
  - Price.
  - Mileage.
  - Safety rating.
  - Reasons.
  - Tradeoffs.
- Include comparison table for the returned recommendations.
- Include an easy way to adjust preferences and rerun the recommendation.

**Acceptance Criteria:**
- Buyer can understand why each car was recommended.
- Tradeoffs are visible, not hidden.
- Results update after changing preferences.

**Tests / Verification:**
- Manually verify recommendation rendering against a known backend response.
- Add component tests if the setup includes React Testing Library.

---

## Phase 9: Shortlist Persistence

**Objective:** Add a minimal backend-backed save flow to demonstrate persistence.

**Files:**
- Create `backend/app/storage.py`
- Modify `backend/app/main.py`
- Modify `backend/app/schemas.py`
- Create `backend/tests/test_shortlist_api.py`
- Modify `frontend/lib/api.ts`
- Modify `frontend/components/RecommendationResults.tsx`

**API Contract:**
- `POST /shortlists`
- `GET /shortlists/{shortlistId}`

Saved shortlist includes:
- Generated `shortlistId`.
- Original preferences.
- Recommended car IDs.
- Created timestamp.

**Persistence Choice:**
- Use JSON file storage for speed unless SQLite is already configured.
- Store generated data under `backend/runtime/shortlists.json`.
- Exclude runtime files from git.

**Acceptance Criteria:**
- User can save a shortlist from the results screen.
- Backend returns a stable shortlist ID.
- Saved shortlist can be retrieved by ID.
- Tests do not depend on shared local runtime files.

**Tests / Verification:**
- Run shortlist API tests using temporary test storage.
- Manually save and retrieve a shortlist.

---

## Phase 10: Packaging, Documentation, And End-To-End Verification

**Objective:** Make the project easy to evaluate and complete assignment deliverables.

**Files:**
- Create or update `docker-compose.yml`
- Update root `README.md`
- Create `.env.example`
- Add final test commands to docs.

**README Must Answer:**
- What was built and why.
- What was deliberately cut.
- Tech stack and rationale.
- What was delegated to AI tools versus done manually.
- Where AI tools helped most.
- Where AI tools got in the way.
- What would be added with another 4 hours.
- Local run instructions.
- Test instructions.

**Acceptance Criteria:**
- App can run locally from clean checkout using documented commands.
- Backend tests pass.
- Frontend lint/build passes, if configured.
- README is specific to this assignment, not generic project boilerplate.
- Screen recording process is described for final submission.

**Tests / Verification:**
- Run backend test suite.
- Run frontend lint/build.
- Start backend and frontend together.
- Complete the full buyer flow:
  1. Open frontend.
  2. Fill questionnaire.
  3. Submit preferences.
  4. See ranked recommendations.
  5. Save shortlist.
  6. Retrieve saved shortlist.

---

## Phase Gate Rules

Each phase must satisfy all acceptance criteria before the next phase starts.

For every implementation phase:
- Write or update tests first where practical.
- Run the phase-specific tests.
- Fix failures before moving on.
- Keep implementation scoped to the current phase.
- Update README or docs when commands, setup, or behavior change.

---

## Risks And Mitigations

| Risk | Mitigation |
| --- | --- |
| Overbuilding beyond 2-3 hours | Keep LLMs, auth, scraping, and dealer workflows out of scope. |
| Backend becomes a thin proxy | Put scoring, explanations, dataset loading, and shortlist persistence in FastAPI. |
| Recommendations feel arbitrary | Return matched criteria, reasons, and tradeoffs for every car. |
| Setup takes too long for evaluator | Add root run instructions and optionally `docker-compose.yml`. |
| UI becomes marketing-heavy | First screen is the actual recommendation workflow. |
| Tests become ceremonial | Focus tests on scoring correctness, API contracts, and critical buyer flow. |

---

## Definition Of Done

The project is done when:
- A user can run the app locally with documented commands.
- A buyer can complete the preference flow and receive a useful ranked shortlist.
- Backend recommendation and persistence tests pass.
- README covers every assignment deliverable question.
- The build process has been screen-recorded for submission.


# Phase 5 Backend Recommendation API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose the deterministic scoring engine through a FastAPI `POST /recommendations` endpoint.

**Architecture:** `backend/app/main.py` remains the API entrypoint. It imports the request/response schemas and delegates recommendation logic to `backend/app/recommender.py`. Tests verify the endpoint function contract and invalid input behavior without FastAPI `TestClient`, because local `httpx` is not installed. Runtime verification uses a short-lived Uvicorn process and a real HTTP request.

**Tech Stack:** Python 3.14, FastAPI, Pydantic v2.12.5, Uvicorn, pytest.

---

## File Structure

- Modify `backend/app/main.py` to add `POST /recommendations`.
- Modify `backend/app/schemas.py` only if API response aliases or request validation need adjustment.
- Create `backend/tests/test_recommendations_api.py` for endpoint contract tests.
- Update `backend/README.md` and root `README.md` with the new endpoint.

---

### Task 1: Add Recommendations Endpoint

**Files:**
- Modify: `backend/app/main.py`

- [ ] **Step 1: Import recommendation schema and service**

Add imports:

```python
from backend.app.recommender import recommend_cars
from backend.app.schemas import RecommendationPreferences, RecommendationResponse
```

- [ ] **Step 2: Add FastAPI route**

Add:

```python
@app.post("/recommendations", response_model=RecommendationResponse, tags=["recommendations"])
def create_recommendations(
    preferences: RecommendationPreferences,
) -> RecommendationResponse:
    return recommend_cars(preferences)
```

---

### Task 2: Add API Contract Tests

**Files:**
- Create: `backend/tests/test_recommendations_api.py`

- [ ] **Step 1: Test endpoint returns ranked recommendations**

Call `create_recommendations()` with a valid `RecommendationPreferences` instance. Assert:
- response has 3 recommendations by default.
- scores are sorted descending.
- each recommendation has reasons, tradeoffs, and matched criteria.

- [ ] **Step 2: Test route is registered**

Inspect `app.routes` and assert exactly one `POST /recommendations` route exists.

- [ ] **Step 3: Test invalid input fails validation**

Instantiate `RecommendationPreferences` with `budgetMaxLakh` lower than `budgetMinLakh` and assert Pydantic raises `ValidationError`.

- [ ] **Step 4: Test empty optional arrays are accepted**

Instantiate `RecommendationPreferences` with empty `preferredFuelTypes` and `preferredBodyTypes`, call `create_recommendations()`, and assert recommendations are returned.

---

### Task 3: Update Documentation

**Files:**
- Modify: `backend/README.md`
- Modify: `README.md`

- [ ] **Step 1: Document API endpoint**

Add `POST /recommendations` with a sample request and explain that it returns ranked recommendations with score, reasons, tradeoffs, and matched criteria.

---

### Task 4: Verify Phase 5

**Files:**
- Read: backend package and tests

- [ ] **Step 1: Run pytest**

Run:

```powershell
python -m pytest backend
```

Expected: all backend tests pass.

- [ ] **Step 2: Verify HTTP endpoint**

Run a short-lived Uvicorn process and send a real `POST /recommendations` request.

Expected: HTTP 200 and a JSON body with a non-empty `recommendations` list.

- [ ] **Step 3: Check git status**

Run:

```powershell
git status --short
```

Expected: Phase 5 files are changed or untracked. The assignment PDF may remain untracked.

- [ ] **Step 4: Commit Phase 5**

Run:

```powershell
git add README.md backend docs/superpowers/plans/2026-05-30-phase-5-backend-recommendation-api.md
git commit -m "feat: expose recommendation API"
```

Expected: commit succeeds.


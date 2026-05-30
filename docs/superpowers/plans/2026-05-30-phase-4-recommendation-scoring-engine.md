# Phase 4 Recommendation Scoring Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement deterministic recommendation logic independent of HTTP.

**Architecture:** `backend/app/schemas.py` defines validated recommendation input and output DTOs. `backend/app/recommender.py` scores already-loaded `Car` objects and returns ranked recommendations with reasons, tradeoffs, and scoring breakdown. Tests target scoring behavior directly without starting FastAPI.

**Tech Stack:** Python 3.14, Pydantic v2.12.5, pytest.

---

## File Structure

- Create `backend/app/schemas.py` for `RecommendationPreferences`, `MatchedCriteria`, `RecommendedCar`, and `RecommendationResponse`.
- Create `backend/app/recommender.py` for scoring and ranking logic.
- Create `backend/tests/test_recommender.py` for budget, preference, safety, mileage, and ranking tests.
- Update `backend/README.md` and root `README.md` to mention the scoring engine.

---

### Task 1: Add Recommendation Schemas

**Files:**
- Create: `backend/app/schemas.py`

- [ ] **Step 1: Define request schema**

Create `RecommendationPreferences` with:

```python
budgetMinLakh: float
budgetMaxLakh: float
primaryUsage: UsageTag
preferredFuelTypes: list[FuelType] = []
preferredBodyTypes: list[BodyType] = []
familySize: int
safetyPriority: int
mileagePriority: int
transmissionPreference: Literal["manual", "automatic", "any"]
```

Validation:
- `budgetMinLakh` must be non-negative.
- `budgetMaxLakh` must be greater than or equal to `budgetMinLakh`.
- `familySize` must be between 1 and 8.
- priorities must be between 1 and 5.

- [ ] **Step 2: Define response schemas**

Create:
- `MatchedCriteria` with numeric `budget`, `usage`, `fuel`, `safety`, `mileage`, `familyBody`, and `transmission`.
- `RecommendedCar` with `car`, `score`, `reasons`, `tradeoffs`, and `matchedCriteria`.
- `RecommendationResponse` with `recommendations`.

---

### Task 2: Add Scoring Engine

**Files:**
- Create: `backend/app/recommender.py`

- [ ] **Step 1: Implement car scoring**

Create `score_car(car: Car, preferences: RecommendationPreferences) -> RecommendedCar`.

Scoring weights:
- Budget: 30
- Usage: 20
- Fuel: 15
- Safety: 15
- Mileage: 10
- Family/body: 10
- Transmission: 5 bonus points

Clamp the final score to 100.

- [ ] **Step 2: Implement ranking**

Create:

```python
def recommend_cars(
    preferences: RecommendationPreferences,
    cars: Iterable[Car] | None = None,
    limit: int = 3,
) -> RecommendationResponse
```

It loads cars by default, scores them, sorts by score descending, and returns the top `limit`.

---

### Task 3: Add Scoring Tests

**Files:**
- Create: `backend/tests/test_recommender.py`

- [ ] **Step 1: Test budget behavior**

Verify an in-budget car receives full budget points and a slightly over-budget car receives a budget tradeoff.

- [ ] **Step 2: Test exact preference matches**

Verify fuel and body type matches improve score over non-matches.

- [ ] **Step 3: Test safety priority**

Verify high safety priority rewards high safety cars more than low safety cars.

- [ ] **Step 4: Test mileage priority**

Verify high mileage priority rewards efficient cars more than inefficient cars.

- [ ] **Step 5: Test ranking order and limit**

Verify `recommend_cars()` returns the requested number of recommendations sorted by descending score.

---

### Task 4: Verify Phase 4

**Files:**
- Read: backend package and tests

- [ ] **Step 1: Run pytest**

Run:

```powershell
python -m pytest backend
```

Expected: all backend tests pass.

- [ ] **Step 2: Verify a sample recommendation**

Run:

```powershell
python -c "from backend.app.recommender import recommend_cars; from backend.app.schemas import RecommendationPreferences; prefs=RecommendationPreferences(budgetMinLakh=8,budgetMaxLakh=16,primaryUsage='mixed',preferredFuelTypes=['petrol'],preferredBodyTypes=['compact_suv'],familySize=4,safetyPriority=5,mileagePriority=3,transmissionPreference='automatic'); print(recommend_cars(prefs).recommendations[0].car.id)"
```

Expected: command prints one car ID without error.

- [ ] **Step 3: Check git status**

Run:

```powershell
git status --short
```

Expected: Phase 4 files are changed or untracked. The assignment PDF may remain untracked.

- [ ] **Step 4: Commit Phase 4**

Run:

```powershell
git add README.md backend docs/superpowers/plans/2026-05-30-phase-4-recommendation-scoring-engine.md
git commit -m "feat: add recommendation scoring engine"
```

Expected: commit succeeds.


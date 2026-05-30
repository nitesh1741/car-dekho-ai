# Phase 3 Car Dataset And Domain Models Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a validated seed car dataset and repository layer for later recommendation scoring.

**Architecture:** `backend/app/models.py` defines the domain model using Pydantic v2. `backend/app/repository.py` owns JSON loading and validation. `backend/app/data/cars.json` is the curated seed dataset. Tests verify data quality, validation failure behavior, and lookup behavior before recommendation logic exists.

**Tech Stack:** Python 3.14, Pydantic v2.12.5, pytest.

---

## File Structure

- Create `backend/app/data/cars.json` with at least 24 realistic car records.
- Create `backend/app/models.py` with typed `Car` domain model and literal enums.
- Create `backend/app/repository.py` with `load_cars()` and `get_car_by_id()`.
- Create `backend/tests/test_repository.py` with repository and dataset validation tests.
- Update `backend/README.md` and root `README.md` to describe Phase 3 dataset status.

---

### Task 1: Add Domain Model

**Files:**
- Create: `backend/app/models.py`

- [ ] **Step 1: Create typed car model**

Create a Pydantic v2 model with these fields:

```python
id: str
make: str
model: str
variant: str
priceLakh: float
bodyType: Literal["hatchback", "sedan", "compact_suv", "suv", "mpv"]
fuelType: Literal["petrol", "diesel", "cng", "hybrid", "ev"]
transmission: Literal["manual", "automatic"]
mileage: float
safetyRating: float
seating: int
usageTags: list[Literal["city", "highway", "mixed", "family"]]
strengths: list[str]
tradeoffs: list[str]
reviewSummary: str
```

Add validation that list fields are non-empty, text fields are non-empty, price and mileage are positive, seating is between 4 and 8, and safety rating is between 0 and 5.

---

### Task 2: Add Seed Dataset

**Files:**
- Create: `backend/app/data/cars.json`

- [ ] **Step 1: Create curated data**

Create 24 cars covering these segments:

- Hatchbacks: Maruti Suzuki Baleno, Hyundai i20, Tata Altroz, Maruti Suzuki Swift.
- Sedans: Honda City, Hyundai Verna, Skoda Slavia, Maruti Suzuki Dzire.
- Compact SUVs: Hyundai Creta, Kia Seltos, Tata Nexon, Maruti Suzuki Brezza, Mahindra XUV 3XO.
- SUVs: Mahindra XUV700, Tata Safari, Hyundai Alcazar, Toyota Fortuner.
- MPVs: Maruti Suzuki Ertiga, Kia Carens, Toyota Innova Hycross.
- EVs and efficient alternatives: Tata Nexon EV, MG ZS EV, Toyota Urban Cruiser Hyryder Hybrid, Maruti Suzuki Fronx CNG.

Every record must include all fields required by the `Car` model.

---

### Task 3: Add Repository Loader

**Files:**
- Create: `backend/app/repository.py`

- [ ] **Step 1: Implement JSON loading**

Add:

```python
def load_cars(data_path: Path | None = None) -> list[Car]
```

It loads `backend/app/data/cars.json` by default and validates each item as a `Car`.

- [ ] **Step 2: Implement lookup by ID**

Add:

```python
def get_car_by_id(car_id: str, cars: Iterable[Car] | None = None) -> Car | None
```

It returns the matching `Car` or `None`.

---

### Task 4: Add Repository Tests

**Files:**
- Create: `backend/tests/test_repository.py`

- [ ] **Step 1: Validate dataset loads**

Test that `load_cars()` returns at least 24 cars and every ID is unique.

- [ ] **Step 2: Validate dataset variety**

Test that loaded cars include hatchback, sedan, compact SUV, SUV, and MPV body types and petrol, diesel, CNG, hybrid, and EV fuel types.

- [ ] **Step 3: Validate bad records fail**

Create a temporary JSON file missing a required field and assert `load_cars()` raises a validation error.

- [ ] **Step 4: Validate lookup behavior**

Assert `get_car_by_id()` returns an existing car and returns `None` for a missing ID.

---

### Task 5: Verify Phase 3

**Files:**
- Read: backend package and tests

- [ ] **Step 1: Run pytest**

Run:

```powershell
python -m pytest backend
```

Expected: all backend tests pass.

- [ ] **Step 2: Verify dataset count manually**

Run:

```powershell
python -c "from backend.app.repository import load_cars; print(len(load_cars()))"
```

Expected:

```text
24
```

- [ ] **Step 3: Check git status**

Run:

```powershell
git status --short
```

Expected: Phase 3 files are changed or untracked. The assignment PDF may remain untracked.

- [ ] **Step 4: Commit Phase 3**

Run:

```powershell
git add README.md backend docs/superpowers/plans/2026-05-30-phase-3-car-dataset-domain-models.md
git commit -m "feat: add validated car dataset"
```

Expected: commit succeeds.


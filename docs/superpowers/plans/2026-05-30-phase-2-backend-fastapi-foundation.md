# Phase 2 Backend FastAPI Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a runnable FastAPI backend with a tested `/health` endpoint.

**Architecture:** The backend lives under `backend/`. The application entrypoint is `backend/app/main.py`, tests live under `backend/tests/`, and `backend/requirements.txt` documents runtime/test dependencies. Phase 2 avoids FastAPI `TestClient` because local `httpx` is not installed; pytest validates the route and handler directly, while manual verification checks the HTTP endpoint through Uvicorn.

**Tech Stack:** Python 3.14, FastAPI, Uvicorn, pytest.

---

## File Structure

- Create `backend/app/__init__.py` to make `app` an importable package.
- Create `backend/app/main.py` with the FastAPI app and `/health` route.
- Create `backend/tests/test_health.py` with pytest coverage for the health handler and route registration.
- Create `backend/requirements.txt` with backend dependencies.
- Create `backend/README.md` with backend run and test commands.
- Update root `README.md` with Phase 2 status and backend commands.

---

### Task 1: Add Backend Package And Health Route

**Files:**
- Create: `backend/app/__init__.py`
- Create: `backend/app/main.py`
- Delete: `backend/.gitkeep`

- [ ] **Step 1: Create backend package**

Create `backend/app/__init__.py` as an empty package marker.

- [ ] **Step 2: Create FastAPI app**

Create `backend/app/main.py`:

```python
from fastapi import FastAPI

APP_NAME = "car-shortlist-backend"

app = FastAPI(
    title="Car Shortlist Assistant API",
    version="0.1.0",
)


@app.get("/health", tags=["system"])
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": APP_NAME,
    }
```

- [ ] **Step 3: Remove backend placeholder**

Remove `backend/.gitkeep` because real backend files now exist.

---

### Task 2: Add Backend Dependencies And README

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/README.md`
- Modify: `README.md`

- [ ] **Step 1: Create requirements file**

Create `backend/requirements.txt`:

```text
fastapi>=0.115,<1.0
uvicorn[standard]>=0.34,<1.0
pytest>=8.0,<9.0
```

- [ ] **Step 2: Create backend README**

Create `backend/README.md`:

```markdown
# Backend

FastAPI backend for the Car Shortlist Assistant.

## Run Locally

From the `backend/` directory:

```powershell
uvicorn app.main:app --reload
```

Health check:

```text
GET http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "car-shortlist-backend"
}
```

## Test

From the repository root:

```powershell
python -m pytest backend
```
```

- [ ] **Step 3: Update root README**

Change current status to say Phase 2 adds the FastAPI health endpoint and add backend run/test commands.

---

### Task 3: Add Health Tests

**Files:**
- Create: `backend/tests/test_health.py`

- [ ] **Step 1: Create health tests**

Create `backend/tests/test_health.py`:

```python
from backend.app.main import APP_NAME, app, health_check


def test_health_check_payload() -> None:
    assert health_check() == {
        "status": "ok",
        "service": APP_NAME,
    }


def test_health_route_registered() -> None:
    matching_routes = [
        route
        for route in app.routes
        if getattr(route, "path", None) == "/health"
        and "GET" in getattr(route, "methods", set())
    ]

    assert len(matching_routes) == 1
```

---

### Task 4: Verify Phase 2

**Files:**
- Read: backend package and tests

- [ ] **Step 1: Run pytest**

Run:

```powershell
python -m pytest backend
```

Expected: 2 tests pass.

- [ ] **Step 2: Verify Uvicorn import path**

Run:

```powershell
python -c "from backend.app.main import app; print(app.title)"
```

Expected:

```text
Car Shortlist Assistant API
```

- [ ] **Step 3: Check git status**

Run:

```powershell
git status --short
```

Expected: Phase 2 files are changed or untracked. The assignment PDF may remain untracked.

- [ ] **Step 4: Commit Phase 2**

Run:

```powershell
git add README.md backend docs/superpowers/plans/2026-05-30-phase-2-backend-fastapi-foundation.md
git commit -m "feat: add FastAPI backend foundation"
```

Expected: commit succeeds.


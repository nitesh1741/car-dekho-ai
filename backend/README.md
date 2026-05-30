# Backend

FastAPI backend for the Car Shortlist Assistant.

## Current Capabilities

- `GET /health` returns backend service status.
- `app.repository.load_cars()` loads and validates the curated seed dataset.
- `app.repository.get_car_by_id()` finds a car by stable dataset ID.

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

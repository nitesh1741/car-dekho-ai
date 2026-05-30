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

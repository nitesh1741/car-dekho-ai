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

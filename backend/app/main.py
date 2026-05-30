from fastapi import FastAPI

from backend.app.recommender import recommend_cars
from backend.app.schemas import RecommendationPreferences, RecommendationResponse

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


@app.post("/recommendations", response_model=RecommendationResponse, tags=["recommendations"])
def create_recommendations(
    preferences: RecommendationPreferences,
) -> RecommendationResponse:
    return recommend_cars(preferences)

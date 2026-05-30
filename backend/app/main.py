from fastapi import FastAPI, HTTPException

from backend.app.recommender import recommend_cars
from backend.app.schemas import RecommendationPreferences, RecommendationResponse, ShortlistCreateResponse, ShortlistResponse
from backend.app.storage import create_shortlist, get_shortlist

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


# New endpoints for shortlists
@app.post("/shortlists", response_model=ShortlistCreateResponse, tags=["shortlists"])
def save_shortlist(preferences: RecommendationPreferences, response: RecommendationResponse):
    short_id = create_shortlist(preferences.dict(), [r.dict() for r in response.recommendations])
    return {"shortlistId": short_id}


@app.get("/shortlists/{shortlist_id}", response_model=ShortlistResponse, tags=["shortlists"])
def fetch_shortlist(shortlist_id: str):
    data = get_shortlist(shortlist_id)
    if not data:
        raise HTTPException(status_code=404, detail="Shortlist not found")
    return data

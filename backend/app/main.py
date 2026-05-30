from fastapi import FastAPI, HTTPException

from .recommender import recommend_cars
from .schemas import RecommendationPreferences, RecommendationResponse, ShortlistCreateResponse, ShortlistResponse
from .storage import create_shortlist, get_shortlist

APP_NAME = "car-shortlist-backend"

app = FastAPI(
    title="Car Shortlist Assistant API",
    version="0.1.0",
)

# Enable CORS for the Vercel frontend
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "https://car-dekho-ai.vercel.app",
    "http://localhost:3000",  # local dev convenience
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

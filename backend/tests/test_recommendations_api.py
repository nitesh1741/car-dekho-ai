import pytest
from pydantic import ValidationError

from backend.app.main import app, create_recommendations
from backend.app.schemas import RecommendationPreferences


def _valid_preferences(**overrides) -> RecommendationPreferences:
    values = {
        "budgetMinLakh": 8,
        "budgetMaxLakh": 16,
        "primaryUsage": "mixed",
        "preferredFuelTypes": ["petrol"],
        "preferredBodyTypes": ["compact_suv"],
        "familySize": 4,
        "safetyPriority": 5,
        "mileagePriority": 3,
        "transmissionPreference": "automatic",
    }
    values.update(overrides)
    return RecommendationPreferences(**values)


def test_create_recommendations_returns_ranked_default_shortlist() -> None:
    response = create_recommendations(_valid_preferences())
    scores = [recommendation.score for recommendation in response.recommendations]

    assert len(response.recommendations) == 3
    assert scores == sorted(scores, reverse=True)

    for recommendation in response.recommendations:
        assert recommendation.reasons
        assert isinstance(recommendation.tradeoffs, list)
        assert recommendation.matchedCriteria.budget >= 0


def test_recommendations_route_registered() -> None:
    matching_routes = [
        route
        for route in app.routes
        if getattr(route, "path", None) == "/recommendations"
        and "POST" in getattr(route, "methods", set())
    ]

    assert len(matching_routes) == 1


def test_invalid_recommendation_input_fails_validation() -> None:
    with pytest.raises(ValidationError):
        _valid_preferences(budgetMinLakh=16, budgetMaxLakh=8)


def test_empty_optional_preference_arrays_are_accepted() -> None:
    preferences = _valid_preferences(
        preferredFuelTypes=[],
        preferredBodyTypes=[],
    )

    response = create_recommendations(preferences)

    assert response.recommendations

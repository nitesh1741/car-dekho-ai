from backend.app.repository import get_car_by_id, load_cars
from backend.app.recommender import recommend_cars, score_car
from backend.app.schemas import RecommendationPreferences


def _preferences(**overrides) -> RecommendationPreferences:
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


def test_budget_fit_scores_full_points_and_near_miss_gets_tradeoff() -> None:
    cars = load_cars()
    in_budget_car = get_car_by_id("hyundai-creta-sx-petrol", cars)
    near_budget_car = get_car_by_id("kia-seltos-htx-diesel", cars)

    assert in_budget_car is not None
    assert near_budget_car is not None

    in_budget = score_car(in_budget_car, _preferences())
    near_budget = score_car(near_budget_car, _preferences())

    assert in_budget.matchedCriteria.budget == 30
    assert near_budget.matchedCriteria.budget < 30
    assert "Slightly above your preferred budget" in near_budget.tradeoffs


def test_exact_fuel_and_body_matches_score_higher_than_non_matches() -> None:
    cars = load_cars()
    matching_car = get_car_by_id("tata-nexon-fearless-petrol", cars)
    non_matching_car = get_car_by_id("honda-city-vx-petrol", cars)

    assert matching_car is not None
    assert non_matching_car is not None

    prefs = _preferences(preferredFuelTypes=["petrol"], preferredBodyTypes=["compact_suv"])
    matching = score_car(matching_car, prefs)
    non_matching = score_car(non_matching_car, prefs)

    assert matching.matchedCriteria.fuel == 15
    assert matching.matchedCriteria.familyBody > non_matching.matchedCriteria.familyBody
    assert matching.score > non_matching.score


def test_high_safety_priority_rewards_high_safety_cars() -> None:
    cars = load_cars()
    high_safety_car = get_car_by_id("tata-nexon-fearless-petrol", cars)
    lower_safety_car = get_car_by_id("hyundai-creta-sx-petrol", cars)

    assert high_safety_car is not None
    assert lower_safety_car is not None

    prefs = _preferences(safetyPriority=5)
    high_safety = score_car(high_safety_car, prefs)
    lower_safety = score_car(lower_safety_car, prefs)

    assert high_safety.matchedCriteria.safety > lower_safety.matchedCriteria.safety
    assert "Strong safety fit for your priority" in high_safety.reasons


def test_high_mileage_priority_rewards_efficient_cars() -> None:
    cars = load_cars()
    efficient_car = get_car_by_id("maruti-suzuki-fronx-delta-cng", cars)
    less_efficient_car = get_car_by_id("tata-safari-accomplished-diesel", cars)

    assert efficient_car is not None
    assert less_efficient_car is not None

    prefs = _preferences(
        budgetMinLakh=8,
        budgetMaxLakh=30,
        preferredFuelTypes=[],
        preferredBodyTypes=[],
        mileagePriority=5,
        transmissionPreference="any",
    )
    efficient = score_car(efficient_car, prefs)
    less_efficient = score_car(less_efficient_car, prefs)

    assert efficient.matchedCriteria.mileage > less_efficient.matchedCriteria.mileage
    assert "Strong efficiency fit for your mileage priority" in efficient.reasons


def test_recommend_cars_returns_limit_sorted_by_descending_score() -> None:
    response = recommend_cars(_preferences(), limit=5)
    scores = [recommendation.score for recommendation in response.recommendations]

    assert len(response.recommendations) == 5
    assert scores == sorted(scores, reverse=True)

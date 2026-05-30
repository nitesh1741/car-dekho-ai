from collections.abc import Iterable

from .models import Car
from .repository import load_cars
from .schemas import (
    MatchedCriteria,
    RecommendationPreferences,
    RecommendationResponse,
    RecommendedCar,
)

BUDGET_WEIGHT = 30.0
USAGE_WEIGHT = 20.0
FUEL_WEIGHT = 15.0
SAFETY_WEIGHT = 15.0
MILEAGE_WEIGHT = 10.0
FAMILY_BODY_WEIGHT = 10.0
TRANSMISSION_BONUS = 5.0
MAX_SCORE = 100.0


def score_car(car: Car, preferences: RecommendationPreferences) -> RecommendedCar:
    reasons: list[str] = []
    tradeoffs: list[str] = []

    budget_score = _score_budget(car, preferences, reasons, tradeoffs)
    usage_score = _score_usage(car, preferences, reasons, tradeoffs)
    fuel_score = _score_fuel(car, preferences, reasons, tradeoffs)
    safety_score = _score_safety(car, preferences, reasons, tradeoffs)
    mileage_score = _score_mileage(car, preferences, reasons, tradeoffs)
    family_body_score = _score_family_body(car, preferences, reasons, tradeoffs)
    transmission_score = _score_transmission(car, preferences, reasons, tradeoffs)

    matched_criteria = MatchedCriteria(
        budget=budget_score,
        usage=usage_score,
        fuel=fuel_score,
        safety=safety_score,
        mileage=mileage_score,
        familyBody=family_body_score,
        transmission=transmission_score,
    )

    total_score = min(
        MAX_SCORE,
        budget_score
        + usage_score
        + fuel_score
        + safety_score
        + mileage_score
        + family_body_score
        + transmission_score,
    )

    return RecommendedCar(
        car=car,
        score=round(total_score, 2),
        reasons=reasons,
        tradeoffs=tradeoffs,
        matchedCriteria=matched_criteria,
    )


def recommend_cars(
    preferences: RecommendationPreferences,
    cars: Iterable[Car] | None = None,
    limit: int = 3,
) -> RecommendationResponse:
    available_cars = list(cars if cars is not None else load_cars())
    ranked = sorted(
        (score_car(car, preferences) for car in available_cars),
        key=lambda recommendation: recommendation.score,
        reverse=True,
    )

    return RecommendationResponse(recommendations=ranked[:limit])


def _score_budget(
    car: Car,
    preferences: RecommendationPreferences,
    reasons: list[str],
    tradeoffs: list[str],
) -> float:
    if preferences.budgetMinLakh <= car.priceLakh <= preferences.budgetMaxLakh:
        reasons.append("Fits your budget")
        return BUDGET_WEIGHT

    if car.priceLakh < preferences.budgetMinLakh:
        reasons.append("Comes in below your budget ceiling")
        return BUDGET_WEIGHT * 0.85

    overage = car.priceLakh - preferences.budgetMaxLakh
    close_enough = max(preferences.budgetMaxLakh * 0.15, 1.0)
    if overage <= close_enough:
        tradeoffs.append("Slightly above your preferred budget")
        return BUDGET_WEIGHT * max(0.35, 1 - (overage / close_enough) * 0.5)

    tradeoffs.append("Well above your preferred budget")
    return 0.0


def _score_usage(
    car: Car,
    preferences: RecommendationPreferences,
    reasons: list[str],
    tradeoffs: list[str],
) -> float:
    if preferences.primaryUsage in car.usageTags:
        reasons.append(f"Well suited for {preferences.primaryUsage} use")
        return USAGE_WEIGHT

    if "mixed" in car.usageTags:
        reasons.append("Versatile enough for mixed usage")
        return USAGE_WEIGHT * 0.7

    tradeoffs.append(f"Not primarily tuned for {preferences.primaryUsage} use")
    return USAGE_WEIGHT * 0.3


def _score_fuel(
    car: Car,
    preferences: RecommendationPreferences,
    reasons: list[str],
    tradeoffs: list[str],
) -> float:
    if not preferences.preferredFuelTypes:
        return FUEL_WEIGHT * 0.75

    if car.fuelType in preferences.preferredFuelTypes:
        reasons.append(f"Matches your {car.fuelType} fuel preference")
        return FUEL_WEIGHT

    tradeoffs.append(f"Uses {car.fuelType} instead of your preferred fuel type")
    return 0.0


def _score_safety(
    car: Car,
    preferences: RecommendationPreferences,
    reasons: list[str],
    tradeoffs: list[str],
) -> float:
    priority_factor = preferences.safetyPriority / 5
    score = SAFETY_WEIGHT * priority_factor * (car.safetyRating / 5)

    if preferences.safetyPriority >= 4 and car.safetyRating >= 4:
        reasons.append("Strong safety fit for your priority")
    elif preferences.safetyPriority >= 4 and car.safetyRating < 4:
        tradeoffs.append("Safety rating is below your stated priority")

    return score


def _score_mileage(
    car: Car,
    preferences: RecommendationPreferences,
    reasons: list[str],
    tradeoffs: list[str],
) -> float:
    priority_factor = preferences.mileagePriority / 5
    mileage_ratio = min(car.mileage / 28, 1.0)
    score = MILEAGE_WEIGHT * priority_factor * mileage_ratio

    if preferences.mileagePriority >= 4 and car.mileage >= 20:
        reasons.append("Strong efficiency fit for your mileage priority")
    elif preferences.mileagePriority >= 4 and car.mileage < 17:
        tradeoffs.append("Mileage is below your stated priority")

    return score


def _score_family_body(
    car: Car,
    preferences: RecommendationPreferences,
    reasons: list[str],
    tradeoffs: list[str],
) -> float:
    score = 0.0

    if not preferences.preferredBodyTypes:
        score += FAMILY_BODY_WEIGHT * 0.4
    elif car.bodyType in preferences.preferredBodyTypes:
        reasons.append(f"Matches your {car.bodyType} body style preference")
        score += FAMILY_BODY_WEIGHT * 0.55
    else:
        tradeoffs.append(f"Body style is {car.bodyType}, not your preferred type")

    if car.seating >= preferences.familySize:
        reasons.append("Has enough seating for your family size")
        score += FAMILY_BODY_WEIGHT * 0.45
    else:
        tradeoffs.append("Does not have enough seats for your family size")

    return min(FAMILY_BODY_WEIGHT, score)


def _score_transmission(
    car: Car,
    preferences: RecommendationPreferences,
    reasons: list[str],
    tradeoffs: list[str],
) -> float:
    if preferences.transmissionPreference == "any":
        return TRANSMISSION_BONUS * 0.5

    if car.transmission == preferences.transmissionPreference:
        reasons.append(f"Matches your {car.transmission} transmission preference")
        return TRANSMISSION_BONUS

    tradeoffs.append(f"Transmission is {car.transmission}, not your preference")
    return 0.0

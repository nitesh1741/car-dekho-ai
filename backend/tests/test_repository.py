import json

import pytest
from pydantic import ValidationError

from backend.app.repository import get_car_by_id, load_cars


def test_load_cars_returns_valid_unique_dataset() -> None:
    cars = load_cars()
    car_ids = [car.id for car in cars]

    assert len(cars) >= 24
    assert len(car_ids) == len(set(car_ids))


def test_dataset_has_required_body_and_fuel_variety() -> None:
    cars = load_cars()

    body_types = {car.bodyType for car in cars}
    fuel_types = {car.fuelType for car in cars}

    assert {"hatchback", "sedan", "compact_suv", "suv", "mpv"} <= body_types
    assert {"petrol", "diesel", "cng", "hybrid", "ev"} <= fuel_types


def test_load_cars_rejects_invalid_records(tmp_path) -> None:
    invalid_dataset_path = tmp_path / "invalid-cars.json"
    invalid_dataset_path.write_text(
        json.dumps(
            [
                {
                    "id": "invalid-car",
                    "make": "Example",
                    "model": "Missing Variant",
                    "priceLakh": 10.0,
                    "bodyType": "sedan",
                    "fuelType": "petrol",
                    "transmission": "manual",
                    "mileage": 18.0,
                    "safetyRating": 4.0,
                    "seating": 5,
                    "usageTags": ["city"],
                    "strengths": ["Simple city car"],
                    "tradeoffs": ["Incomplete test record"],
                    "reviewSummary": "This record is missing the variant field.",
                }
            ]
        ),
        encoding="utf-8",
    )

    with pytest.raises(ValidationError):
        load_cars(invalid_dataset_path)


def test_get_car_by_id_finds_existing_car_and_returns_none_for_missing() -> None:
    cars = load_cars()

    assert get_car_by_id("hyundai-creta-sx-petrol", cars) is not None
    assert get_car_by_id("missing-car-id", cars) is None

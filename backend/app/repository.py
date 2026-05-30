import json
from collections.abc import Iterable
from pathlib import Path

from backend.app.models import Car

DEFAULT_DATA_PATH = Path(__file__).parent / "data" / "cars.json"


def load_cars(data_path: Path | None = None) -> list[Car]:
    source_path = data_path or DEFAULT_DATA_PATH
    raw_cars = json.loads(source_path.read_text(encoding="utf-8"))

    if not isinstance(raw_cars, list):
        raise ValueError("car dataset must be a JSON list")

    return [Car.model_validate(car) for car in raw_cars]


def get_car_by_id(car_id: str, cars: Iterable[Car] | None = None) -> Car | None:
    available_cars = cars if cars is not None else load_cars()

    for car in available_cars:
        if car.id == car_id:
            return car

    return None

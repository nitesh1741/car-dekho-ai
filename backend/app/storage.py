import json
import os
import uuid
from pathlib import Path
from typing import Dict, Any

# Path to runtime storage file
STORAGE_PATH = Path(__file__).resolve().parents[1] / "runtime" / "shortlists.json"
# Ensure runtime directory exists
STORAGE_PATH.parent.mkdir(parents=True, exist_ok=True)

def _load() -> Dict[str, Any]:
    if STORAGE_PATH.is_file():
        with open(STORAGE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def _save(data: Dict[str, Any]) -> None:
    with open(STORAGE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def create_shortlist(preferences: dict, recommendations: list) -> str:
    """Create a new shortlist and return its UUID."""
    short_id = str(uuid.uuid4())
    data = _load()
    data[short_id] = {
        "preferences": preferences,
        "recommendations": recommendations,
    }
    _save(data)
    return short_id

def get_shortlist(short_id: str) -> dict | None:
    """Retrieve a shortlist by ID, or None if not found."""
    data = _load()
    return data.get(short_id)

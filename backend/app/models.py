from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

BodyType = Literal["hatchback", "sedan", "compact_suv", "suv", "mpv"]
FuelType = Literal["petrol", "diesel", "cng", "hybrid", "ev"]
Transmission = Literal["manual", "automatic"]
UsageTag = Literal["city", "highway", "mixed", "family"]


class Car(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    make: str
    model: str
    variant: str
    priceLakh: float = Field(gt=0)
    bodyType: BodyType
    fuelType: FuelType
    transmission: Transmission
    mileage: float = Field(gt=0)
    safetyRating: float = Field(ge=0, le=5)
    seating: int = Field(ge=4, le=8)
    usageTags: list[UsageTag]
    strengths: list[str]
    tradeoffs: list[str]
    reviewSummary: str

    @field_validator("id", "make", "model", "variant", "reviewSummary")
    @classmethod
    def text_must_not_be_blank(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("text fields must not be blank")
        return cleaned

    @field_validator("usageTags", "strengths", "tradeoffs")
    @classmethod
    def lists_must_not_be_empty(cls, value: list[str]) -> list[str]:
        if not value:
            raise ValueError("list fields must not be empty")
        return value

    @field_validator("strengths", "tradeoffs")
    @classmethod
    def list_text_must_not_be_blank(cls, value: list[str]) -> list[str]:
        cleaned = [item.strip() for item in value]
        if any(not item for item in cleaned):
            raise ValueError("list text fields must not contain blanks")
        return cleaned

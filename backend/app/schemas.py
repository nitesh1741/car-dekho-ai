from typing import Literal, List

from pydantic import BaseModel, ConfigDict, Field, model_validator

from backend.app.models import BodyType, Car, FuelType, UsageTag

TransmissionPreference = Literal["manual", "automatic", "any"]

class RecommendationPreferences(BaseModel):
    model_config = ConfigDict(extra="forbid")

    budgetMinLakh: float = Field(ge=0)
    budgetMaxLakh: float = Field(ge=0)
    primaryUsage: UsageTag
    preferredFuelTypes: list[FuelType] = Field(default_factory=list)
    preferredBodyTypes: list[BodyType] = Field(default_factory=list)
    familySize: int = Field(ge=1, le=8)
    safetyPriority: int = Field(ge=1, le=5)
    mileagePriority: int = Field(ge=1, le=5)
    transmissionPreference: TransmissionPreference

    @model_validator(mode="after")
    def budget_range_must_be_ordered(self) -> "RecommendationPreferences":
        if self.budgetMaxLakh < self.budgetMinLakh:
            raise ValueError("budgetMaxLakh must be greater than or equal to budgetMinLakh")
        return self

class MatchedCriteria(BaseModel):
    model_config = ConfigDict(extra="forbid")

    budget: float
    usage: float
    fuel: float
    safety: float
    mileage: float
    familyBody: float
    transmission: float

class RecommendedCar(BaseModel):
    model_config = ConfigDict(extra="forbid")

    car: Car
    score: float
    reasons: list[str]
    tradeoffs: list[str]
    matchedCriteria: MatchedCriteria

class RecommendationResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    recommendations: list[RecommendedCar]

# New shortlist schemas
class ShortlistCreateResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")
    shortlistId: str

class ShortlistResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")
    preferences: RecommendationPreferences
    recommendations: List[RecommendedCar]


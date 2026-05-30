export interface HealthResponse {
  status: string;
  service: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  variant: string;
  priceLakh: number;
  bodyType: "hatchback" | "sedan" | "compact_suv" | "suv" | "mpv";
  fuelType: "petrol" | "diesel" | "cng" | "hybrid" | "ev";
  transmission: "manual" | "automatic";
  mileage: number;
  safetyRating: number;
  seating: number;
  usageTags: ("city" | "highway" | "mixed" | "family")[];
  strengths: string[];
  tradeoffs: string[];
  reviewSummary: string;
}

export interface MatchedCriteria {
  budget: number;
  usage: number;
  fuel: number;
  safety: number;
  mileage: number;
  familyBody: number;
  transmission: number;
}

export interface RecommendedCar {
  car: Car;
  score: number;
  reasons: string[];
  tradeoffs: string[];
  matchedCriteria: MatchedCriteria;
}

export interface RecommendationResponse {
  recommendations: RecommendedCar[];
}

export interface RecommendationPreferences {
  budgetMinLakh: number;
  budgetMaxLakh: number;
  primaryUsage: "city" | "highway" | "mixed" | "family";
  preferredFuelTypes: ("petrol" | "diesel" | "cng" | "hybrid" | "ev")[];
  preferredBodyTypes: ("hatchback" | "sedan" | "compact_suv" | "suv" | "mpv")[];
  familySize: number;
  safetyPriority: number; // 1 to 5
  mileagePriority: number; // 1 to 5
  transmissionPreference: "manual" | "automatic" | "any";
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function checkBackendHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/health`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Backend health check failed');
  }
  return res.json();
}

export async function getRecommendations(
  preferences: RecommendationPreferences
): Promise<RecommendationResponse> {
  const res = await fetch(`${API_BASE_URL}/recommendations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "Unknown error");
    throw new Error(`Failed to fetch recommendations: ${res.statusText} (${errorBody})`);
  }

  return res.json();
}

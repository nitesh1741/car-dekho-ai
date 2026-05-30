import React, { useState } from "react";
import {
  getRecommendations,
  RecommendationPreferences,
  RecommendationResponse,
} from "../lib/api";
import FormField from "./FormField";

interface PreferenceFormProps {
  onSuccess: (data: RecommendationResponse, preferences: RecommendationPreferences) => void;
  onCancel: () => void;
}

type UsageType = "city" | "highway" | "mixed" | "family";
type TransType = "manual" | "automatic" | "any";
type FuelType = "petrol" | "diesel" | "cng" | "hybrid" | "ev";
type BodyType = "hatchback" | "sedan" | "compact_suv" | "suv" | "mpv";

export default function PreferenceForm({ onSuccess, onCancel }: PreferenceFormProps) {
  // Budget States
  const [budgetMinLakh, setBudgetMinLakh] = useState<number>(8);
  const [budgetMaxLakh, setBudgetMaxLakh] = useState<number>(16);
  
  // Single-Select States
  const [primaryUsage, setPrimaryUsage] = useState<UsageType>("mixed");
  const [transmissionPreference, setTransmissionPreference] = useState<TransType>("any");
  const [familySize, setFamilySize] = useState<number>(4);

  // Multi-Select States
  const [preferredFuelTypes, setPreferredFuelTypes] = useState<FuelType[]>(["petrol"]);
  const [preferredBodyTypes, setPreferredBodyTypes] = useState<BodyType[]>(["compact_suv"]);

  // Priority States (1 to 5)
  const [safetyPriority, setSafetyPriority] = useState<number>(4);
  const [mileagePriority, setMileagePriority] = useState<number>(3);

  // Hover states for priorities to enable beautiful visual star interactions
  const [hoverSafety, setHoverSafety] = useState<number | null>(null);
  const [hoverMileage, setHoverMileage] = useState<number | null>(null);

  // Status & Error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [budgetError, setBudgetError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Static Type-Safe Selection Lists
  const usageOptions: { id: UsageType; name: string; desc: string }[] = [
    { id: "city", name: "🏢 City First", desc: "Short city commute" },
    { id: "highway", name: "🛣️ Highway Run", desc: "Inter-city commutes" },
    { id: "mixed", name: "🔄 Mixed Daily", desc: "Perfect balanced mix" },
    { id: "family", name: "👨‍👩‍👧 Family Outings", desc: "Comfort and seating" },
  ];

  const transOptions: { id: TransType; name: string; detail: string }[] = [
    { id: "manual", name: "Manual", detail: "Active control" },
    { id: "automatic", name: "Automatic", detail: "Urban ease" },
    { id: "any", name: "Any", detail: "No penalty" },
  ];

  const fuelOptions: { id: FuelType; name: string }[] = [
    { id: "petrol", name: "Petrol" },
    { id: "diesel", name: "Diesel" },
    { id: "cng", name: "CNG" },
    { id: "hybrid", name: "Hybrid" },
    { id: "ev", name: "Electric EV" },
  ];

  const bodyOptions: { id: BodyType; name: string }[] = [
    { id: "hatchback", name: "Hatchback" },
    { id: "sedan", name: "Sedan" },
    { id: "compact_suv", name: "Compact SUV" },
    { id: "suv", name: "Premium SUV" },
    { id: "mpv", name: "Multi-Purpose MPV" },
  ];

  // Toggle helpers for multi-select arrays
  const handleToggleFuel = (fuel: FuelType) => {
    if (preferredFuelTypes.includes(fuel)) {
      setPreferredFuelTypes(preferredFuelTypes.filter((t) => t !== fuel));
    } else {
      setPreferredFuelTypes([...preferredFuelTypes, fuel]);
    }
  };

  const handleToggleBody = (body: BodyType) => {
    if (preferredBodyTypes.includes(body)) {
      setPreferredBodyTypes(preferredBodyTypes.filter((t) => t !== body));
    } else {
      setPreferredBodyTypes([...preferredBodyTypes, body]);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBudgetError(null);
    setApiError(null);

    // Validation
    if (budgetMaxLakh < budgetMinLakh) {
      setBudgetError("Max budget must be greater than or equal to min budget");
      return;
    }

    if (budgetMinLakh < 0 || budgetMaxLakh < 0) {
      setBudgetError("Budgets cannot be negative values");
      return;
    }

    setIsSubmitting(true);

    const payload: RecommendationPreferences = {
      budgetMinLakh,
      budgetMaxLakh,
      primaryUsage,
      preferredFuelTypes,
      preferredBodyTypes,
      familySize,
      safetyPriority,
      mileagePriority,
      transmissionPreference,
    };

    try {
      const response = await getRecommendations(payload);
      onSuccess(response, payload);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError("Failed to fetch recommendations from backend.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preset budget selectors
  const applyBudgetPreset = (min: number, max: number) => {
    setBudgetMinLakh(min);
    setBudgetMaxLakh(max);
    setBudgetError(null);
  };

  // Custom Star Priority Selector Render Helper
  const renderStarSelector = (
    currentValue: number,
    setValue: (val: number) => void,
    hoverValue: number | null,
    setHoverValue: (val: number | null) => void,
    idPrefix: string
  ) => {
    const activeStars = hoverValue !== null ? hoverValue : currentValue;
    return (
      <div className="flex items-center gap-1.5 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            id={`${idPrefix}-star-${star}`}
            onClick={() => setValue(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(null)}
            className="focus:outline-none transition-transform hover:scale-125 cursor-pointer"
          >
            <svg
              className={`w-8 h-8 transition-colors duration-150 ${
                star <= activeStars ? "text-amber-400 fill-amber-400" : "text-slate-600 fill-transparent"
              }`}
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499c.195-.39.77-.39.965 0l2.22 4.492 4.962.721c.427.061.6.58.293.882l-3.59 3.498.847 4.943c.073.428-.377.756-.76.556L12 16.24l-4.425 2.326c-.383.2-.833-.128-.76-.556l.847-4.943-3.59-3.498c-.307-.302-.134-.821.293-.882l4.963-.721 2.22-4.492z"
              />
            </svg>
          </button>
        ))}
        <span className="text-xs text-slate-400 font-bold ml-2 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          {activeStars} / 5
        </span>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      id="buyer-preference-form"
      className="bg-slate-850 border border-slate-700/40 rounded-2xl p-6 lg:p-8 backdrop-blur-md shadow-2xl flex flex-col gap-6 w-full relative overflow-hidden"
    >
      {/* Decorative Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600"></div>

      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Find Your Match
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Answer these core preferences to compute your shortlist score.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition cursor-pointer"
        >
          ← Cancel
        </button>
      </div>

      {apiError && (
        <div
          id="api-error-banner"
          className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-4 rounded-xl text-xs leading-normal flex flex-col gap-1"
        >
          <span className="font-bold flex items-center gap-1.5">⚠️ Recommendation Error</span>
          <span>{apiError}</span>
        </div>
      )}

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BUDGET RANGE CONTROL */}
        <FormField
          id="budget-range"
          label="Budget Range (Lakhs)"
          description="Identify your preferred budget envelope. We check exact fits, but close candidates are kept with transparent tradeoffs."
          error={budgetError}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Min (Lakhs)</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <button
                    type="button"
                    onClick={() => setBudgetMinLakh(Math.max(0, budgetMinLakh - 1))}
                    className="bg-slate-900 text-slate-400 hover:text-white w-8 h-8 rounded border border-slate-800 flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="budget-min"
                    value={budgetMinLakh}
                    onChange={(e) => setBudgetMinLakh(parseFloat(e.target.value) || 0)}
                    className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-sm text-slate-200 font-bold text-center w-16 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setBudgetMinLakh(budgetMinLakh + 1)}
                    className="bg-slate-900 text-slate-400 hover:text-white w-8 h-8 rounded border border-slate-800 flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Max (Lakhs)</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <button
                    type="button"
                    onClick={() => setBudgetMaxLakh(Math.max(0, budgetMaxLakh - 1))}
                    className="bg-slate-900 text-slate-400 hover:text-white w-8 h-8 rounded border border-slate-800 flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="budget-max"
                    value={budgetMaxLakh}
                    onChange={(e) => setBudgetMaxLakh(parseFloat(e.target.value) || 0)}
                    className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-sm text-slate-200 font-bold text-center w-16 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setBudgetMaxLakh(budgetMaxLakh + 1)}
                    className="bg-slate-900 text-slate-400 hover:text-white w-8 h-8 rounded border border-slate-800 flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              <button
                type="button"
                onClick={() => applyBudgetPreset(6, 12)}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-750 px-2 py-1 rounded text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                Affordable (6-12L)
              </button>
              <button
                type="button"
                onClick={() => applyBudgetPreset(12, 18)}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-750 px-2 py-1 rounded text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                Mid-Range (12-18L)
              </button>
              <button
                type="button"
                onClick={() => applyBudgetPreset(18, 28)}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-750 px-2 py-1 rounded text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                Premium (18-28L)
              </button>
            </div>
          </div>
        </FormField>

        {/* PRIMARY USAGE SECTION */}
        <FormField
          id="primary-usage"
          label="Primary Usage"
          description="How will this car cover most of its running? This ensures your score weights usage tags heavily."
        >
          <div className="grid grid-cols-2 gap-2 mt-1">
            {usageOptions.map((usage) => (
              <button
                key={usage.id}
                type="button"
                id={`usage-chip-${usage.id}`}
                onClick={() => setPrimaryUsage(usage.id)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  primaryUsage === usage.id
                    ? "bg-indigo-600/35 border-indigo-500 text-indigo-200 shadow-sm"
                    : "bg-slate-900 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-300"
                }`}
              >
                <div className="text-xs font-bold">{usage.name}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">{usage.desc}</div>
              </button>
            ))}
          </div>
        </FormField>

        {/* TRANSMISSION TYPE */}
        <FormField
          id="transmission-preference"
          label="Transmission Preference"
          description="Do you have a specific driving interface preference? Choosing 'Any' avoids penalizing matches."
        >
          <div className="grid grid-cols-3 gap-2 mt-1">
            {transOptions.map((trans) => (
              <button
                key={trans.id}
                type="button"
                id={`transmission-chip-${trans.id}`}
                onClick={() => setTransmissionPreference(trans.id)}
                className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                  transmissionPreference === trans.id
                    ? "bg-indigo-600/35 border-indigo-500 text-indigo-200 shadow-sm"
                    : "bg-slate-900 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-300"
                }`}
              >
                <div className="text-xs font-bold">{trans.name}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">{trans.detail}</div>
              </button>
            ))}
          </div>
        </FormField>

        {/* FAMILY CAPACITY SEATS */}
        <FormField
          id="family-size"
          label="Family Seating Requirement"
          description="Specify the number of regular occupants. Cars with seating capacity below this target are filtered or marked as poor matches."
        >
          <div className="flex flex-col gap-2 mt-1">
            <div className="grid grid-cols-5 gap-1.5">
              {[4, 5, 6, 7, 8].map((size) => (
                <button
                  key={size}
                  type="button"
                  id={`family-size-chip-${size}`}
                  onClick={() => setFamilySize(size)}
                  className={`py-2 rounded-lg border font-mono font-bold text-sm transition-all cursor-pointer ${
                    familySize === size
                      ? "bg-indigo-600/35 border-indigo-500 text-indigo-200"
                      : "bg-slate-900 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {size}L
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 italic text-center">
              Accommodates {familySize} members comfortably.
            </div>
          </div>
        </FormField>

        {/* FUEL PREFERENCE (MULTI-SELECT) */}
        <FormField
          id="preferred-fuels"
          label="Preferred Fuel Type(s)"
          description="Choose one or more acceptable options. Deselect all to accept any fuel baseline (e.g. CNG, Hybrid, Electric EV)."
        >
          <div className="flex flex-wrap gap-2 mt-1">
            {fuelOptions.map((fuel) => {
              const selected = preferredFuelTypes.includes(fuel.id);
              return (
                <button
                  key={fuel.id}
                  type="button"
                  id={`fuel-chip-${fuel.id}`}
                  onClick={() => handleToggleFuel(fuel.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    selected
                      ? "bg-violet-600/30 border-violet-500 text-violet-200 shadow-sm"
                      : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {selected && <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>}
                  {fuel.name}
                </button>
              );
            })}
          </div>
        </FormField>

        {/* BODY TYPE PREFERENCE (MULTI-SELECT) */}
        <FormField
          id="preferred-body-types"
          label="Preferred Body Type(s)"
          description="Select preferred body styles. Leave empty to allow hatchback, sedan, SUV formats."
        >
          <div className="flex flex-wrap gap-2 mt-1">
            {bodyOptions.map((body) => {
              const selected = preferredBodyTypes.includes(body.id);
              return (
                <button
                  key={body.id}
                  type="button"
                  id={`body-chip-${body.id}`}
                  onClick={() => handleToggleBody(body.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    selected
                      ? "bg-violet-600/30 border-violet-500 text-violet-200 shadow-sm"
                      : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {selected && <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>}
                  {body.name}
                </button>
              );
            })}
          </div>
        </FormField>

        {/* SAFETY PRIORITY */}
        <FormField
          id="safety-priority"
          label="Safety Quotient Priority"
          description="Choose how critical crash test safety ratings are (1 = low priority, 5 = absolute highest priority)."
        >
          {renderStarSelector(
            safetyPriority,
            setSafetyPriority,
            hoverSafety,
            setHoverSafety,
            "safety"
          )}
        </FormField>

        {/* MILEAGE PRIORITY */}
        <FormField
          id="mileage-priority"
          label="Fuel Efficiency Priority"
          description="Select weight of fuel economy (1 = low, 5 = extremely critical for highway commutes)."
        >
          {renderStarSelector(
            mileagePriority,
            setMileagePriority,
            hoverMileage,
            setHoverMileage,
            "mileage"
          )}
        </FormField>
      </div>

      {/* Form Submission Actions */}
      <div className="border-t border-slate-800/80 pt-6 mt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 py-2.5 px-6 rounded-xl font-bold text-xs text-slate-400 hover:text-white transition flex items-center justify-center cursor-pointer disabled:opacity-50"
        >
          Cancel & Exit
        </button>
        <button
          type="submit"
          id="submit-questionnaire-btn"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-2.5 px-8 rounded-xl text-xs transition-all duration-200 cursor-pointer shadow-lg shadow-indigo-950/40 border border-indigo-500 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Computing Recommendations...
            </>
          ) : (
            "Analyze Preferences & Match"
          )}
        </button>
      </div>
    </form>
  );
}

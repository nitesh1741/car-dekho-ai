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
  const [budgetMinLakh, setBudgetMinLakh] = useState<number>(8);
  const [budgetMaxLakh, setBudgetMaxLakh] = useState<number>(16);
  const [primaryUsage, setPrimaryUsage] = useState<UsageType>("mixed");
  const [transmissionPreference, setTransmissionPreference] = useState<TransType>("any");
  const [familySize, setFamilySize] = useState<number>(4);
  const [preferredFuelTypes, setPreferredFuelTypes] = useState<FuelType[]>(["petrol"]);
  const [preferredBodyTypes, setPreferredBodyTypes] = useState<BodyType[]>(["compact_suv"]);
  const [safetyPriority, setSafetyPriority] = useState<number>(4);
  const [mileagePriority, setMileagePriority] = useState<number>(3);
  const [hoverSafety, setHoverSafety] = useState<number | null>(null);
  const [hoverMileage, setHoverMileage] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [budgetError, setBudgetError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const usageOptions: { id: UsageType; name: string; desc: string }[] = [
    { id: "city", name: "Mostly city", desc: "Short daily commutes" },
    { id: "highway", name: "Highway", desc: "Long-distance driving" },
    { id: "mixed", name: "Mixed", desc: "City and highway equally" },
    { id: "family", name: "Family trips", desc: "Comfort and space first" },
  ];

  const transOptions: { id: TransType; name: string }[] = [
    { id: "manual", name: "Manual" },
    { id: "automatic", name: "Automatic" },
    { id: "any", name: "No preference" },
  ];

  const fuelOptions: { id: FuelType; name: string }[] = [
    { id: "petrol", name: "Petrol" },
    { id: "diesel", name: "Diesel" },
    { id: "cng", name: "CNG" },
    { id: "hybrid", name: "Hybrid" },
    { id: "ev", name: "Electric" },
  ];

  const bodyOptions: { id: BodyType; name: string }[] = [
    { id: "hatchback", name: "Hatchback" },
    { id: "sedan", name: "Sedan" },
    { id: "compact_suv", name: "Compact SUV" },
    { id: "suv", name: "SUV" },
    { id: "mpv", name: "MPV" },
  ];

  const handleToggleFuel = (fuel: FuelType) => {
    setPreferredFuelTypes((prev) =>
      prev.includes(fuel) ? prev.filter((t) => t !== fuel) : [...prev, fuel]
    );
  };

  const handleToggleBody = (body: BodyType) => {
    setPreferredBodyTypes((prev) =>
      prev.includes(body) ? prev.filter((t) => t !== body) : [...prev, body]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBudgetError(null);
    setApiError(null);

    if (budgetMaxLakh < budgetMinLakh) {
      setBudgetError("Maximum must be at least the minimum");
      return;
    }
    if (budgetMinLakh < 0 || budgetMaxLakh < 0) {
      setBudgetError("Budget cannot be negative");
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
      setApiError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyBudgetPreset = (min: number, max: number) => {
    setBudgetMinLakh(min);
    setBudgetMaxLakh(max);
    setBudgetError(null);
  };

  const renderStarSelector = (
    currentValue: number,
    setValue: (val: number) => void,
    hoverValue: number | null,
    setHoverValue: (val: number | null) => void,
    idPrefix: string
  ) => {
    const activeStars = hoverValue ?? currentValue;
    const labels = ["Low", "Moderate", "Important", "High", "Essential"];

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              id={`${idPrefix}-star-${star}`}
              onClick={() => setValue(star)}
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(null)}
              aria-label={`${labels[star - 1]} priority`}
              className="p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded transition-transform hover:scale-110 cursor-pointer"
            >
              <svg
                className={`w-7 h-7 transition-colors duration-150 ${
                  star <= activeStars
                    ? "text-[var(--accent)] fill-[var(--accent)]"
                    : "text-[var(--border-strong)] fill-transparent"
                }`}
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499c.195-.39.77-.39.965 0l2.22 4.492 4.962.721c.427.061.6.58.293.882l-3.59 3.498.847 4.943c.073.428-.377.756-.76.556L12 16.24l-4.425 2.326c-.383.2-.833-.128-.76-.556l.847-4.943-3.59-3.498c-.307-.302-.134-.821.293-.882l4.963-.721 2.22-4.492z"
                />
              </svg>
            </button>
          ))}
        </div>
        <span className="text-xs text-[var(--text-muted)]">
          {labels[activeStars - 1]}
        </span>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      id="buyer-preference-form"
      className="flex flex-col gap-6"
    >
      {apiError && (
        <div
          id="api-error-banner"
          role="alert"
          className="flex items-start gap-3 p-4 rounded-xl border border-[var(--error)]/20 bg-[var(--error-soft)]"
        >
          <p className="text-sm text-[var(--text-primary)]">{apiError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Budget */}
        <FormField
          id="budget-range"
          label="Budget range"
          description="In lakhs (₹). We'll find cars within or close to this range."
          error={budgetError}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  Minimum
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() => setBudgetMinLakh(Math.max(0, budgetMinLakh - 1))}
                    className="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="budget-min"
                    value={budgetMinLakh}
                    onChange={(e) =>
                      setBudgetMinLakh(parseFloat(e.target.value) || 0)
                    }
                    className="input-field"
                  />
                  <button
                    type="button"
                    onClick={() => setBudgetMinLakh(budgetMinLakh + 1)}
                    className="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  Maximum
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() => setBudgetMaxLakh(Math.max(0, budgetMaxLakh - 1))}
                    className="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="budget-max"
                    value={budgetMaxLakh}
                    onChange={(e) =>
                      setBudgetMaxLakh(parseFloat(e.target.value) || 0)
                    }
                    className="input-field"
                  />
                  <button
                    type="button"
                    onClick={() => setBudgetMaxLakh(budgetMaxLakh + 1)}
                    className="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "₹6–12L", min: 6, max: 12 },
                { label: "₹12–18L", min: 12, max: 18 },
                { label: "₹18–28L", min: 18, max: 28 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyBudgetPreset(preset.min, preset.max)}
                  className="chip-pill text-xs"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </FormField>

        {/* Usage */}
        <FormField
          id="primary-usage"
          label="How do you drive most days?"
          description="This helps us prioritize the right type of car for your routine."
        >
          <div className="grid grid-cols-2 gap-2">
            {usageOptions.map((usage) => (
              <button
                key={usage.id}
                type="button"
                id={`usage-chip-${usage.id}`}
                onClick={() => setPrimaryUsage(usage.id)}
                className={`chip text-left p-3 ${
                  primaryUsage === usage.id ? "chip-active" : ""
                }`}
              >
                <div className="text-sm font-medium">{usage.name}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">
                  {usage.desc}
                </div>
              </button>
            ))}
          </div>
        </FormField>

        {/* Transmission */}
        <FormField
          id="transmission-preference"
          label="Transmission"
          description="Choose what you're comfortable driving, or leave it open."
        >
          <div className="flex flex-wrap gap-2">
            {transOptions.map((trans) => (
              <button
                key={trans.id}
                type="button"
                id={`transmission-chip-${trans.id}`}
                onClick={() => setTransmissionPreference(trans.id)}
                className={`chip ${
                  transmissionPreference === trans.id ? "chip-active" : ""
                }`}
              >
                {trans.name}
              </button>
            ))}
          </div>
        </FormField>

        {/* Family size */}
        <FormField
          id="family-size"
          label="How many people need to fit?"
          description="Regular passengers, not occasional guests."
        >
          <div className="flex gap-2">
            {[4, 5, 6, 7, 8].map((size) => (
              <button
                key={size}
                type="button"
                id={`family-size-chip-${size}`}
                onClick={() => setFamilySize(size)}
                className={`chip flex-1 py-2.5 font-semibold ${
                  familySize === size ? "chip-active" : ""
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </FormField>

        {/* Fuel */}
        <FormField
          id="preferred-fuels"
          label="Fuel type"
          description="Select all that you'd consider. Leave empty for any."
        >
          <div className="flex flex-wrap gap-2">
            {fuelOptions.map((fuel) => {
              const selected = preferredFuelTypes.includes(fuel.id);
              return (
                <button
                  key={fuel.id}
                  type="button"
                  id={`fuel-chip-${fuel.id}`}
                  onClick={() => handleToggleFuel(fuel.id)}
                  className={`chip-pill ${selected ? "chip-pill-active" : ""}`}
                >
                  {fuel.name}
                </button>
              );
            })}
          </div>
        </FormField>

        {/* Body type */}
        <FormField
          id="preferred-body-types"
          label="Body style"
          description="Pick the shapes you like. Leave empty to see all types."
        >
          <div className="flex flex-wrap gap-2">
            {bodyOptions.map((body) => {
              const selected = preferredBodyTypes.includes(body.id);
              return (
                <button
                  key={body.id}
                  type="button"
                  id={`body-chip-${body.id}`}
                  onClick={() => handleToggleBody(body.id)}
                  className={`chip-pill ${selected ? "chip-pill-active" : ""}`}
                >
                  {body.name}
                </button>
              );
            })}
          </div>
        </FormField>

        {/* Safety */}
        <FormField
          id="safety-priority"
          label="How important is safety?"
          description="Crash test ratings and safety features."
        >
          {renderStarSelector(
            safetyPriority,
            setSafetyPriority,
            hoverSafety,
            setHoverSafety,
            "safety"
          )}
        </FormField>

        {/* Mileage */}
        <FormField
          id="mileage-priority"
          label="How important is fuel efficiency?"
          description="Higher priority if you drive long distances regularly."
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

      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
          className="btn-secondary w-full sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="submit"
          id="submit-questionnaire-btn"
          disabled={isSubmitting}
          className="btn-primary w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <span className="spinner" />
              Finding matches…
            </>
          ) : (
            "Show my matches"
          )}
        </button>
      </div>
    </form>
  );
}

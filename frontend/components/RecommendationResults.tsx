import React from "react";
import { RecommendedCar } from "../lib/api";
import CarCard from "./CarCard";

interface RecommendationResultsProps {
  recommendations: RecommendedCar[];
  onAdjust: () => void;
}

export default function RecommendationResults({
  recommendations,
  onAdjust,
}: RecommendationResultsProps) {
  const topRecommendations = recommendations.slice(0, 3);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">
          Showing top {topRecommendations.length} of {recommendations.length}
        </p>
        <button type="button" onClick={onAdjust} className="btn-secondary text-sm">
          Adjust preferences
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {topRecommendations.map((rec, i) => (
          <CarCard key={rec.car.id} recommendation={rec} rank={i + 1} />
        ))}
      </div>

      {recommendations.length > 3 && (
        <ComparisonTable recommendations={recommendations} />
      )}
    </div>
  );
}

const ComparisonTable: React.FC<{ recommendations: RecommendedCar[] }> = ({
  recommendations,
}) => {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--border)]">
        <h3 className="font-semibold text-[var(--text-primary)]">
          Full comparison
        </h3>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">
          All matched cars side by side
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-muted)]">
              {["Car", "Fit", "Price", "Mileage", "Safety", "Seats"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec, i) => (
              <tr
                key={rec.car.id}
                className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-muted)]/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-[var(--text-primary)]">
                    {rec.car.make} {rec.car.model}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {rec.car.variant}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-[var(--success)]">
                    {rec.score}%
                  </span>
                  <span className="text-[var(--text-muted)] text-xs ml-1">
                    #{i + 1}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  ₹{rec.car.priceLakh}L
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {rec.car.mileage} kmpl
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {rec.car.safetyRating}/5
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {rec.car.seating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React from "react";
import { RecommendedCar } from "../lib/api";
import CarCard from "./CarCard";

interface RecommendationResultsProps {
  recommendations: RecommendedCar[];
  onAdjust: () => void;
}

export default function RecommendationResults({ recommendations, onAdjust }: RecommendationResultsProps) {
  // Show top 3 recommendations
  const topRecommendations = recommendations.slice(0, 3);

  return (
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 lg:p-8 backdrop-blur-md shadow-2xl flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-slate-200 flex items-center justify-between">
        Recommendation Results
        <button
          onClick={onAdjust}
          className="text-sm font-medium text-indigo-300 hover:text-indigo-100 transition"
        >
          Adjust Preferences
        </button>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topRecommendations.map((rec) => (
          <CarCard key={rec.car.id} recommendation={rec} />
        ))}
      </div>
      <ComparisonTable recommendations={recommendations} />
    </div>
  );
}

const ComparisonTable: React.FC<{ recommendations: RecommendedCar[] }> = ({ recommendations }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-slate-300">
        <thead className="bg-slate-900/30 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-3 py-2">Car</th>
            <th className="px-3 py-2">Score</th>
            <th className="px-3 py-2">Price (L)</th>
            <th className="px-3 py-2">Mileage</th>
            <th className="px-3 py-2">Safety</th>
            <th className="px-3 py-2">Seating</th>
            <th className="px-3 py-2">Reasons</th>
            <th className="px-3 py-2">Tradeoffs</th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map((rec) => (
            <tr key={rec.car.id} className="border-b border-slate-800/30">
              <td className="px-3 py-2 text-slate-200 font-medium">
                {rec.car.make} {rec.car.model} {rec.car.variant}
              </td>
              <td className="px-3 py-2">{rec.score} pts</td>
              <td className="px-3 py-2">{rec.car.priceLakh}L</td>
              <td className="px-3 py-2">{rec.car.mileage} kmpl</td>
              <td className="px-3 py-2">{rec.car.safetyRating}/5</td>
              <td className="px-3 py-2">{rec.car.seating}</td>
              <td className="px-3 py-2 text-xs text-slate-400">{rec.reasons?.join(", ")}</td>
              <td className="px-3 py-2 text-xs text-slate-500">{rec.tradeoffs?.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

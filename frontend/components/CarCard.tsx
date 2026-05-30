import React from "react";
import { RecommendationResponse, RecommendedCar } from "../lib/api";

interface CarCardProps {
  recommendation: RecommendedCar;
}

export default function CarCard({ recommendation }: CarCardProps) {
  const { car, score, reasons, tradeoffs } = recommendation;
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-200">
          {car.make} {car.model} {car.variant}
        </h3>
        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg px-2.5 py-0.5 text-sm font-mono font-bold">
          {score} pts
        </span>
      </div>
      <div className="text-xs text-slate-400">
        Price: {car.priceLakh}L • Mileage: {car.mileage} kmpl • Safety: {car.safetyRating}/5 • Seating: {car.seating}
      </div>
      {reasons && reasons.length > 0 && (
        <div className="text-xs text-slate-300">
          <strong>Reasons:</strong> {reasons.join(", ")}
        </div>
      )}
      {tradeoffs && tradeoffs.length > 0 && (
        <div className="text-xs text-slate-500">
          <strong>Tradeoffs:</strong> {tradeoffs.join(", ")}
        </div>
      )}
    </div>
  );
}

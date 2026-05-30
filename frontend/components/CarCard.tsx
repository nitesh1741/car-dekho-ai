import React from "react";
import { RecommendedCar } from "../lib/api";

interface CarCardProps {
  recommendation: RecommendedCar;
  rank: number;
}

function formatBodyType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatFuel(type: string): string {
  const map: Record<string, string> = {
    petrol: "Petrol",
    diesel: "Diesel",
    cng: "CNG",
    hybrid: "Hybrid",
    ev: "Electric",
  };
  return map[type] ?? type;
}

export default function CarCard({ recommendation, rank }: CarCardProps) {
  const { car, score, reasons, tradeoffs } = recommendation;
  const isTop = rank === 1;

  return (
    <article
      className={`card p-5 flex flex-col gap-4 h-full ${
        isTop ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg-primary)]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {isTop && (
            <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)] mb-1.5">
              Best match
            </span>
          )}
          <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-snug">
            {car.make} {car.model}
          </h3>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {car.variant}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-xs font-bold text-[var(--text-muted)]">
            #{rank}
          </span>
          <span className="text-sm font-bold text-[var(--success)] bg-[var(--success-soft)] px-2.5 py-0.5 rounded-md">
            {score}% fit
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Price", value: `₹${car.priceLakh} Lakh` },
          { label: "Mileage", value: `${car.mileage} kmpl` },
          { label: "Safety", value: `${car.safetyRating}/5 stars` },
          { label: "Seats", value: `${car.seating} seater` },
          { label: "Fuel", value: formatFuel(car.fuelType) },
          { label: "Body", value: formatBodyType(car.bodyType) },
        ].map((spec) => (
          <div
            key={spec.label}
            className="px-3 py-2 rounded-lg bg-[var(--bg-muted)]"
          >
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium">
              {spec.label}
            </div>
            <div className="text-sm font-medium text-[var(--text-primary)] mt-0.5">
              {spec.value}
            </div>
          </div>
        ))}
      </div>

      {reasons && reasons.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
            Why it fits
          </p>
          <ul className="space-y-1">
            {reasons.map((reason, i) => (
              <li
                key={i}
                className="text-sm text-[var(--text-secondary)] flex items-start gap-2"
              >
                <span className="text-[var(--success)] mt-0.5 flex-shrink-0">
                  +
                </span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tradeoffs && tradeoffs.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
            Tradeoffs
          </p>
          <ul className="space-y-1">
            {tradeoffs.map((item, i) => (
              <li
                key={i}
                className="text-sm text-[var(--text-muted)] flex items-start gap-2"
              >
                <span className="mt-0.5 flex-shrink-0">–</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

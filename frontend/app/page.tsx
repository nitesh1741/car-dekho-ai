"use client";

import { useEffect, useState } from "react";
import {
  checkBackendHealth,
  RecommendationPreferences,
  RecommendationResponse,
} from "../lib/api";
import PreferenceForm from "../components/PreferenceForm";
import RecommendationResults from "../components/RecommendationResults";
import ThemeToggle from "../components/ThemeToggle";

type View = "home" | "questionnaire" | "results";

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [serviceAvailable, setServiceAvailable] = useState(true);
  const [apiResponse, setApiResponse] = useState<RecommendationResponse | null>(
    null
  );
  const [submittedPreferences, setSubmittedPreferences] =
    useState<RecommendationPreferences | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        await checkBackendHealth();
        setServiceAvailable(true);
      } catch {
        setServiceAvailable(false);
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFormSuccess = (
    data: RecommendationResponse,
    preferences: RecommendationPreferences
  ) => {
    setApiResponse(data);
    setSubmittedPreferences(preferences);
    setView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartOver = () => {
    setApiResponse(null);
    setSubmittedPreferences(null);
    setView("home");
  };

  const handleAdjust = () => {
    setApiResponse(null);
    setSubmittedPreferences(null);
    setView("questionnaire");
  };

  return (
    <div className="app-shell min-h-screen flex flex-col relative">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={handleStartOver}
            className="flex items-center gap-2.5 group"
          >
            <span className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </span>
            <span className="font-semibold text-[var(--text-primary)] text-[15px] tracking-tight group-hover:text-[var(--accent)] transition-colors">
              Car Shortlist
            </span>
          </button>

          <div className="flex items-center gap-3">
            {view !== "home" && (
              <button
                type="button"
                onClick={handleStartOver}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors hidden sm:block"
              >
                Back to home
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-5 py-10 sm:py-14 relative z-10">
        {/* Service unavailable — user-friendly, no dev jargon */}
        {!serviceAvailable && view !== "results" && (
          <div
            role="alert"
            className="mb-8 flex items-start gap-3 p-4 rounded-xl border border-[var(--error)]/20 bg-[var(--error-soft)] animate-fade-up"
          >
            <svg
              className="w-5 h-5 text-[var(--error)] flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Recommendations are temporarily unavailable
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                Please try again in a moment. If the issue persists, refresh
                the page.
              </p>
            </div>
          </div>
        )}

        {/* Home landing */}
        {view === "home" && (
          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-medium text-[var(--accent)] tracking-wide uppercase animate-fade-up">
              Personalized car finder
            </p>

            <h1
              id="app-primary-heading"
              className="mt-4 font-[family-name:var(--font-instrument-serif)] text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.1] text-[var(--text-primary)] max-w-2xl animate-fade-up-delay-1"
            >
              Find the car that actually fits your life
            </h1>

            <p className="mt-5 text-lg text-[var(--text-secondary)] max-w-lg leading-relaxed animate-fade-up-delay-2">
              Tell us about your budget, daily driving, and priorities. We&apos;ll
              match you with cars that make sense — with clear reasons why.
            </p>

            <button
              id="launch-questionnaire-btn"
              type="button"
              disabled={!serviceAvailable}
              onClick={() => setView("questionnaire")}
              className="btn-primary mt-10 text-base px-8 py-3.5 animate-fade-up-delay-3"
            >
              Find my cars
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>

            {/* How it works */}
            <div className="mt-20 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              {[
                {
                  step: "1",
                  title: "Share your preferences",
                  desc: "Budget, usage, fuel type, safety needs — takes about 2 minutes.",
                },
                {
                  step: "2",
                  title: "Get matched cars",
                  desc: "See your top picks ranked by how well they fit what you told us.",
                },
                {
                  step: "3",
                  title: "Compare with confidence",
                  desc: "Every recommendation comes with reasons and honest tradeoffs.",
                },
              ].map((item, i) => (
                <div
                  key={item.step}
                  className={`card p-6 animate-fade-up-delay-${i + 1}`}
                >
                  <span className="step-num">{item.step}</span>
                  <h3 className="mt-4 font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Trust signals */}
            <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[var(--success)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                No account needed
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[var(--success)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Explainable results
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[var(--success)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Adjust anytime
              </span>
            </div>
          </div>
        )}

        {/* Questionnaire */}
        {view === "questionnaire" && (
          <div id="active-form-workspace" className="animate-fade-up max-w-3xl mx-auto">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl text-[var(--text-primary)]">
                Your preferences
              </h2>
              <p className="mt-2 text-[var(--text-secondary)]">
                There are no wrong answers — just tell us what matters to you.
              </p>
            </div>
            <PreferenceForm
              onSuccess={handleFormSuccess}
              onCancel={() => setView("home")}
            />
          </div>
        )}

        {/* Results */}
        {view === "results" && apiResponse && submittedPreferences && (
          <div className="animate-fade-up">
            <div className="mb-8">
              <p className="text-sm font-medium text-[var(--accent)]">
                Your shortlist
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-instrument-serif)] text-3xl text-[var(--text-primary)]">
                {apiResponse.recommendations.length} cars matched your needs
              </h2>
              <p className="mt-2 text-[var(--text-secondary)]">
                Ranked by fit. Tap adjust to refine your preferences.
              </p>
            </div>
            <RecommendationResults
              recommendations={apiResponse.recommendations}
              onAdjust={handleAdjust}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-[var(--border)] py-6 relative z-10">
        <div className="max-w-5xl mx-auto px-5 text-center text-xs text-[var(--text-muted)]">
          Car Shortlist — helping you buy with clarity
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  checkBackendHealth,
  HealthResponse,
  RecommendationPreferences,
  RecommendationResponse,
} from "../lib/api";
import PreferenceForm from "../components/PreferenceForm";
import RecommendationResults from "../components/RecommendationResults";

export default function Home() {
  // Connection states
  const [healthStatus, setHealthStatus] = useState<"checking" | "online" | "offline">("checking");
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Phase 7 layout states
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [apiResponse, setApiResponse] = useState<RecommendationResponse | null>(null);
  const [submittedPreferences, setSubmittedPreferences] = useState<RecommendationPreferences | null>(null);

  const performHealthCheck = async () => {
    try {
      const data = await checkBackendHealth();
      setHealthStatus("online");
      setHealthData(data);
      setErrorMessage(null);
    } catch (err: unknown) {
      setHealthStatus("offline");
      setHealthData(null);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Unknown connection error");
      }
    }
  };

  useEffect(() => {
    // Initial health check deferred asynchronously to prevent synchronous setState errors in React
    const mountTimer = setTimeout(() => {
      performHealthCheck();
    }, 0);

    // Set up polling interval every 4 seconds
    const interval = setInterval(performHealthCheck, 4000);
    return () => {
      clearTimeout(mountTimer);
      clearInterval(interval);
    };
  }, []);

  const handleFormSuccess = (
    data: RecommendationResponse,
    preferences: RecommendationPreferences
  ) => {
    setApiResponse(data);
    setSubmittedPreferences(preferences);
  };

  const handleReset = () => {
    setApiResponse(null);
    setSubmittedPreferences(null);
    setShowQuestionnaire(false);
  };

  const phases = [
    { num: 1, title: "Repository & Tooling", desc: "Project structure & planning foundation", status: "completed" },
    { num: 2, title: "FastAPI Backend Base", desc: "Core API setup & health diagnostics", status: "completed" },
    { num: 3, title: "Car Dataset & Models", desc: "24-car seeded database & validation models", status: "completed" },
    { num: 4, title: "Scoring Engine Logic", desc: "Deterministic weight matching algorithm", status: "completed" },
    { num: 5, title: "Recommendation API", desc: "Exposed endpoints with contract validation", status: "completed" },
    { num: 6, title: "Next.js Frontend Shell", desc: "Tailwind UI environment & health checks", status: "completed" },
    { num: 7, title: "Questionnaire Interface", desc: "Interactive sliders, segmented toggles & forms", status: "active" },
    { num: 8, title: "Results & Comparison", desc: "Ranked car cards, pros/cons list & specs grid", status: "upcoming" },
    { num: 9, title: "Shortlist Persistence", desc: "Saved shortlist bookmarking & ID retrieval", status: "upcoming" },
    { num: 10, title: "Deployment & Packaging", desc: "Docker Compose environment orchestration", status: "upcoming" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider text-indigo-100">
                CarDekho AI Assignment
              </span>
            </div>
            <h1 id="app-primary-heading" className="mt-3 text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent sm:text-5xl">
              Car Shortlist Assistant
            </h1>
            <p className="mt-2 text-lg text-slate-400 max-w-2xl">
              A guided buyer preferences portal converting criteria weights into clear, explainable, and ranked car shortlists.
            </p>
          </div>

          {/* Dynamic Connection Monitor Card */}
          <div id="backend-health-monitor" className="w-full md:w-auto bg-slate-800/60 backdrop-blur-md border border-slate-700/60 p-4 rounded-xl shadow-xl flex items-center gap-4 transition-all duration-300">
            <div className="relative">
              {healthStatus === "checking" && (
                <div className="w-4.5 h-4.5 bg-amber-500 rounded-full animate-pulse"></div>
              )}
              {healthStatus === "online" && (
                <>
                  <div className="w-4.5 h-4.5 bg-emerald-500 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-4.5 h-4.5 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                </>
              )}
              {healthStatus === "offline" && (
                <>
                  <div className="w-4.5 h-4.5 bg-rose-500 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-4.5 h-4.5 bg-rose-500 rounded-full animate-ping opacity-75"></div>
                </>
              )}
            </div>

            <div className="flex-1 min-w-[200px]">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Backend Connection Status
              </div>
              <div className="text-sm font-bold flex items-center justify-between mt-0.5">
                {healthStatus === "checking" && <span className="text-amber-400">Verifying API State...</span>}
                {healthStatus === "online" && <span className="text-emerald-400">Engine Connected</span>}
                {healthStatus === "offline" && <span className="text-rose-400">Engine Offline</span>}
              </div>
              {healthStatus === "online" && healthData && (
                <div className="text-xs text-slate-400 mt-1">
                  Active service: <code className="bg-slate-900/60 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-[10px]">{healthData.service}</code>
                </div>
              )}
              {healthStatus === "offline" && (
                <div className="text-xs text-slate-500 mt-1">
                  Endpoint: <code className="bg-slate-900/60 px-1.5 py-0.5 rounded text-rose-300 font-mono text-[10px]">localhost:8000</code>
                  {errorMessage && (
                    <div className="text-[10px] text-rose-400/80 mt-1 truncate max-w-[200px]" title={errorMessage}>
                      Reason: {errorMessage}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Live Status Guidance Block */}
        {healthStatus === "offline" && (
          <div id="backend-launch-guidance" className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-rose-950/20">
            <div className="flex-1">
              <h3 className="font-bold text-rose-300 text-lg flex items-center gap-2">
                ⚠️ Connection Action Required
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                The FastAPI recommendation service is not responding. Please run the backend command in your terminal to enable interactive calculations.
              </p>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs font-mono text-indigo-300 w-full md:w-auto min-w-[280px]">
              <span className="text-slate-500"># Start the FastAPI engine</span><br />
              <span className="text-emerald-400">cd</span> backend<br />
              <span className="text-indigo-400">uvicorn</span> app.main:app --reload
            </div>
          </div>
        )}

        {/* Phase 7 Success API Debugger Card */}
        {apiResponse && submittedPreferences && (
          <RecommendationResults
            recommendations={apiResponse.recommendations}
            onAdjust={() => {
              setShowQuestionnaire(true);
              setApiResponse(null);
              setSubmittedPreferences(null);
            }}
          />
        )}

        {/* Conditional Layout Rendering */}
        {!apiResponse && showQuestionnaire && (
          <div id="active-form-workspace" className="animate-fadeIn">
            <PreferenceForm
              onSuccess={handleFormSuccess}
              onCancel={() => setShowQuestionnaire(false)}
            />
          </div>
        )}

        {!apiResponse && !showQuestionnaire && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            
            {/* Left Column: Spec-driven Progress Checklist */}
            <section id="phase-timeline-panel" className="lg:col-span-2 bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 lg:p-8 backdrop-blur-md shadow-2xl flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Spec-Driven Development Timeline
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  This project is engineered across 10 progressive phases. Each increment is fully verified before starting the next.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phases.map((phase) => (
                  <div 
                    key={phase.num} 
                    id={`phase-card-${phase.num}`}
                    className={`p-4 rounded-xl border flex gap-4 transition-all duration-300 relative overflow-hidden ${
                      phase.status === "completed"
                        ? "bg-slate-900/40 border-emerald-500/20 hover:border-emerald-500/30"
                        : phase.status === "active"
                        ? "bg-indigo-950/20 border-indigo-500/50 shadow-lg shadow-indigo-950/40 scale-[1.02] ring-1 ring-indigo-500/30"
                        : "bg-slate-900/10 border-slate-800/60 opacity-60"
                    }`}
                  >
                    {/* Status indicator bar for active card */}
                    {phase.status === "active" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                    )}

                    <div className="flex flex-col items-center">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                        phase.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : phase.status === "active"
                          ? "bg-indigo-500 text-white animate-pulse"
                          : "bg-slate-800 text-slate-500 border border-slate-700"
                      }`}>
                        {phase.status === "completed" ? "✓" : phase.num}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h4 className={`font-bold text-sm leading-5 ${
                        phase.status === "completed"
                          ? "text-slate-200"
                          : phase.status === "active"
                          ? "text-indigo-300"
                          : "text-slate-500"
                      }`}>
                        {phase.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {phase.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Right Column: Dynamic Preview / Call to Action */}
            <section id="questionnaire-cta-panel" className="bg-slate-850 border border-slate-700/40 rounded-2xl p-6 lg:p-8 backdrop-blur-md shadow-2xl flex flex-col justify-between gap-8 bg-gradient-to-b from-slate-800/60 to-slate-900/40">
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    Smart Recommendation Scope
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Once active, our guided assistant will gather direct preferences to compute your shortlist.
                  </p>
                </div>

                {/* Scope attributes */}
                <div className="flex flex-col gap-3.5">
                  {[
                    { icon: "💰", title: "Budget Bounds", detail: "Custom budget floors & limits (Lakhs)" },
                    { icon: "🚗", title: "Usage Focus", detail: "City, Highway, Mixed, or Family" },
                    { icon: "⚡", title: "Power Types", detail: "Petrol, Diesel, CNG, Hybrid, or EV" },
                    { icon: "🛡️", title: "Safety Rating", detail: "High star-rating priority checks" },
                    { icon: "📐", title: "Seating Layout", detail: "Capacity adapted to family size" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
                      <span className="text-xl leading-none">{item.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-300">{item.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  id="launch-questionnaire-btn"
                  onClick={() => setShowQuestionnaire(true)}
                  disabled={healthStatus !== "online"}
                  className={`w-full font-semibold py-3 px-4 rounded-xl text-center text-sm transition-all duration-300 ${
                    healthStatus === "online"
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-indigo-50 border border-indigo-500 cursor-pointer shadow-lg shadow-indigo-950/40 hover:scale-[1.01] hover:ring-1 hover:ring-indigo-500/25"
                      : "bg-slate-850 text-slate-500 border border-slate-800 cursor-not-allowed"
                  }`}
                >
                  {healthStatus === "online" ? "Launch Preference Questionnaire" : "Launch Questionnaire (API Offline)"}
                </button>
                <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                  Form preferences will interface directly with the FastAPI recommendation scoring model.
                </p>
              </div>
            </section>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-850 mt-auto py-6 bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          Car Shortlist Assistant • Spec-Driven Development Dashboard • 2026
        </div>
      </footer>
    </div>
  );
}

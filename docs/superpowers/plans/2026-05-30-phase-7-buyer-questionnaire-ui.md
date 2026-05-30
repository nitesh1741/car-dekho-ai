# Phase 7 Buyer Questionnaire UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the interactive preference questionnaire form capturing budget, usage, seating, fuel, body types, priorities, and transmission preferences.

**Architecture:** Create modular React elements in `frontend/components/PreferenceForm.tsx` and `frontend/components/FormField.tsx`. Expand `frontend/lib/api.ts` to support recommendation POST payloads. Enable a responsive transition in `frontend/app/page.tsx` that replaces the hero timeline with the questionnaire workspace when triggered.

**Tech Stack:** Next.js 16, TypeScript, React 19, Tailwind CSS v4.

---

## File Structure

- Create `frontend/components/FormField.tsx` (generic field wrapper).
- Create `frontend/components/PreferenceForm.tsx` (the core interactive form).
- Modify `frontend/lib/api.ts` (API POST client function & preference interfaces).
- Modify `frontend/app/page.tsx` (Landing page layout integration).

---

### Task 1: API Client Extensions

**Files:**
- Modify: `frontend/lib/api.ts`

- [ ] **Step 1: Export typed interfaces**

Add standard preferences layout:
```typescript
export interface RecommendationPreferences {
  budgetMinLakh: number;
  budgetMaxLakh: number;
  primaryUsage: string;
  preferredFuelTypes: string[];
  preferredBodyTypes: string[];
  familySize: number;
  safetyPriority: number;
  mileagePriority: number;
  transmissionPreference: string;
}
```

- [ ] **Step 2: Implement getRecommendations payload posting**

Add POST endpoint client logic:
```typescript
export async function getRecommendations(preferences: RecommendationPreferences): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch recommendations');
  }
  return res.json();
}
```

---

### Task 2: Build Preference Form & Interactive Controls

**Files:**
- Create: `frontend/components/FormField.tsx`
- Create: `frontend/components/PreferenceForm.tsx`

- [ ] **Step 1: Create reusable FormField container**

Build `frontend/components/FormField.tsx` with standard label positioning, error fields, and spacing parameters.

- [ ] **Step 2: Create PreferenceForm foundation**

Write the basic wrapper in `frontend/components/PreferenceForm.tsx` declaring state attributes for the complete payload.

- [ ] **Step 3: Implement custom priority star components**

Develop interactive 1-to-5 star toggles with hovering state outlines for both Safety and Mileage priorities.

- [ ] **Step 4: Design responsive select chips**

Write custom toggle lists with vibrant styling rings for fuel preferences, transmission configurations, usage patterns, and body types.

- [ ] **Step 5: Integrate validation & posting triggers**

Block submission and show diagnostic error banners if the client detects range issues (e.g., Min Budget > Max Budget). Show dynamic spinners inside the Submit button on trigger.

---

### Task 3: Seamless Layout Integration

**Files:**
- Modify: `frontend/app/page.tsx`

- [ ] **Step 1: Enable landing page CTA trigger**

Remove the `disabled` property from the "Launch Questionnaire" button, enabling it only when `healthStatus === "online"`.

- [ ] **Step 2: Mount Questionnaire toggles**

Add a boolean `showForm` state swapping the Timeline with `<PreferenceForm />` on the main page wrapper.

- [ ] **Step 3: Add results hook diagnostics**

Render a basic developer debugger banner listing payload success parameters upon submission, prepping the workspace for Phase 8.

---

### Task 4: Verify Phase 7

**Files:**
- Read: frontend package and validations

- [ ] **Step 1: Run production build check**

Ensure styles, compiler, and imports compile cleanly:
```powershell
npm run build
```

- [ ] **Step 2: Run linter checks**

Check for code quality:
```powershell
npm run lint
```

- [ ] **Step 3: Verify dev runtime server**

Boot backend and frontend servers, launch the form, and verify HTTP 200 payload returns.

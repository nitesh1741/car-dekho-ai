# Phase 6 Frontend Next.js Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the Next.js frontend shell with Tailwind CSS and TypeScript, and connect it to the backend health endpoint.

**Architecture:** The Next.js project is housed in `frontend/`. It uses React App Router, Tailwind CSS, TypeScript, and the standard npm package manager. A centralized API service layer in `frontend/lib/api.ts` manages communication with the FastAPI backend, reading endpoint targets from `.env.local`.

**Tech Stack:** React 19, Next.js 15, TypeScript, Tailwind CSS v4, npm, ESLint.

---

## File Structure

- Create `frontend/lib/api.ts` (Typed HTTP client logic).
- Create `frontend/.env.local` (Local configuration file).
- Modify `frontend/app/page.tsx` (Add connection dashboard UI).
- Modify `frontend/app/layout.tsx` (Ensure Outfit/Inter fonts are loaded).

---

### Task 1: Scaffolding the Next.js Workspace

**Files:**
- Create: `frontend/` (full structure)

- [ ] **Step 1: Clean placeholder files**

Remove `frontend/.gitkeep` before initiating the setup to ensure the CLI doesn't halt due to folder non-emptiness.

- [ ] **Step 2: Initialize application shell**

Execute the `create-next-app` initialization command under `/frontend`:
```powershell
npx -y create-next-app@latest ./ --ts --tailwind --eslint --app --import-alias "@/*" --use-npm --disable-git --yes
```

---

### Task 2: Configure Environment & Client API

**Files:**
- Create: `frontend/.env.local`
- Create: `frontend/lib/api.ts`

- [ ] **Step 1: Create local environment config**

Write `frontend/.env.local` containing:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

- [ ] **Step 2: Create typed API service**

Write `frontend/lib/api.ts` with basic health fetcher:
```typescript
export interface HealthResponse {
  status: string;
  service: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function checkBackendHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/health`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Backend health check failed');
  }
  return res.json();
}
```

---

### Task 3: Develop Health Verification UI

**Files:**
- Modify: `frontend/app/page.tsx`
- Modify: `frontend/app/layout.tsx`

- [ ] **Step 1: Create responsive landing and connection panel**

Replace `frontend/app/page.tsx` with a clean landing interface showing:
- Application Title and modern layout.
- Real-time client-side polling status showing whether the backend FastAPI server is `online` or `offline` (using green/red styled Tailwind layouts).
- Next phases preview card showing upcoming steps.

---

### Task 4: Verify Phase 6

**Files:**
- Read: frontend package and configurations

- [ ] **Step 1: Run production build check**

Ensure typescript, styles, and configurations compile seamlessly:
```powershell
npm run build
```

- [ ] **Step 2: Run linter checks**

Execute standard static checks:
```powershell
npm run lint
```

- [ ] **Step 3: Verify dev runtime server**

Start backend and frontend, and verify active health connection states.

- [ ] **Step 4: Commit Phase 6**

Commit all new setup files to git repository.

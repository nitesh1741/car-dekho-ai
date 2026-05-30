# Phase 1 Repository Baseline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the repository baseline for a split Next.js frontend and FastAPI backend project.

**Architecture:** This phase creates only the durable skeleton and documentation needed for later phases. It does not install frontend or backend dependencies yet. Git is initialized and work happens on a dedicated `phase-1-baseline` branch so later phases can be tracked cleanly.

**Tech Stack:** Next.js frontend, FastAPI backend, Python/pytest, TypeScript/React, future Docker Compose packaging.

---

## File Structure

- Create `frontend/.gitkeep` to establish the frontend directory until Next.js is scaffolded in Phase 6.
- Create `backend/.gitkeep` to establish the backend directory until FastAPI files are added in Phase 2.
- Create `README.md` with project purpose, current phase, planned architecture, and phase-by-phase workflow.
- Create `.gitignore` covering Python, Node, environment files, runtime storage, test caches, build output, and local editor metadata.
- Keep `docs/superpowers/specs/2026-05-30-car-shortlist-assistant-10-phase-spec.md` as the approved source spec.
- Keep `docs/superpowers/plans/2026-05-30-phase-1-repository-baseline.md` as this implementation plan.

---

### Task 1: Initialize Git And Branch

**Files:**
- Create: `.git/`

- [ ] **Step 1: Initialize git repository**

Run:

```powershell
git init
```

Expected: git creates a new repository.

- [ ] **Step 2: Create implementation branch**

Run:

```powershell
git checkout -b phase-1-baseline
```

Expected: git switches to `phase-1-baseline`.

- [ ] **Step 3: Verify branch**

Run:

```powershell
git branch --show-current
```

Expected:

```text
phase-1-baseline
```

---

### Task 2: Create Frontend And Backend Directories

**Files:**
- Create: `frontend/.gitkeep`
- Create: `backend/.gitkeep`

- [ ] **Step 1: Create directory placeholders**

Create `frontend/.gitkeep` and `backend/.gitkeep` as empty placeholder files.

- [ ] **Step 2: Verify directories**

Run:

```powershell
Get-ChildItem -Force
```

Expected: output includes `frontend` and `backend`.

---

### Task 3: Add Root README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README**

Create `README.md` with this content:

```markdown
# Car Shortlist Assistant

Car Shortlist Assistant is a full-stack web app for the CarDekho Group AI-native software engineer assignment. It helps a confused car buyer answer practical preference questions and receive an explainable shortlist of recommended cars.

## Current Status

Phase 1 is the repository baseline. The project skeleton, documentation, and git workflow are being established before backend and frontend implementation begins.

## Planned Architecture

- `frontend/`: Next.js, TypeScript, and React buyer-facing web app.
- `backend/`: Python FastAPI service for car data, recommendation scoring, explanations, and shortlist persistence.
- `docs/superpowers/`: spec-driven development documents, implementation plans, and phase notes.

## MVP Scope

The MVP will focus on a guided recommendation flow:

1. Buyer enters budget, usage, family size, safety priority, mileage priority, fuel preference, body type preference, and transmission preference.
2. FastAPI scores a curated seed dataset using deterministic weighted criteria.
3. Next.js renders the top recommendations with reasons, tradeoffs, and comparison details.
4. Buyer can save a shortlist through the backend.

## Deliberately Cut

- Authentication.
- Dealer workflows.
- Payments.
- Real-time inventory.
- Scraping production car data.
- LLM or RAG features in the first MVP.

## Development Method

This project is being built through spec-driven development in 10 phases. Each phase must pass its own verification before the next phase starts.

Primary spec:

`docs/superpowers/specs/2026-05-30-car-shortlist-assistant-10-phase-spec.md`

## Local Setup

Local setup commands will be added as backend and frontend projects are scaffolded in later phases.

## Testing

Test commands will be added phase by phase:

- Backend tests begin in Phase 2.
- Frontend checks begin in Phase 6.
- End-to-end verification is completed in Phase 10.
```

- [ ] **Step 2: Verify README exists**

Run:

```powershell
Get-Content README.md
```

Expected: README content describes the project, planned architecture, MVP scope, and development method.

---

### Task 4: Add Root Gitignore

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Write `.gitignore`**

Create `.gitignore` with this content:

```gitignore
# Python
__pycache__/
*.py[cod]
*.pyo
.pytest_cache/
.coverage
htmlcov/
.mypy_cache/
.ruff_cache/
.venv/
venv/
env/

# FastAPI runtime data
backend/runtime/

# Node / Next.js
node_modules/
.next/
out/
dist/
build/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Environment files
.env
.env.*
!.env.example

# Editor / OS
.idea/
.vscode/
.DS_Store
Thumbs.db

# Logs
*.log
logs/
```

- [ ] **Step 2: Verify `.gitignore` exists**

Run:

```powershell
Get-Content .gitignore
```

Expected: output includes Python, Node, environment, runtime, and editor ignore rules.

---

### Task 5: Phase 1 Verification

**Files:**
- Read: root directory
- Read: `README.md`
- Read: `.gitignore`

- [ ] **Step 1: Verify root contents**

Run:

```powershell
Get-ChildItem -Force
```

Expected: output includes `.git`, `.gitignore`, `README.md`, `frontend`, `backend`, `docs`, and the assignment PDF.

- [ ] **Step 2: Verify plan and spec docs**

Run:

```powershell
Get-ChildItem -Force docs\superpowers\specs
Get-ChildItem -Force docs\superpowers\plans
```

Expected: output includes the approved 10-phase spec and this Phase 1 plan.

- [ ] **Step 3: Verify git status**

Run:

```powershell
git status --short
```

Expected: new files are visible and no unrelated generated artifacts are present.

- [ ] **Step 4: Commit Phase 1**

Run:

```powershell
git add .gitignore README.md frontend/.gitkeep backend/.gitkeep docs/superpowers/specs/2026-05-30-car-shortlist-assistant-10-phase-spec.md docs/superpowers/plans/2026-05-30-phase-1-repository-baseline.md
git commit -m "chore: establish repository baseline"
```

Expected: commit succeeds.


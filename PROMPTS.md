# PROMPTS.md — ProofTalk AI Interview Agent
## Prompt & Conversation Log

This file records the prompts and AI conversations used while building ProofTalk.

---

### Prompt 1 — Project Setup & Requirements (2026-08-08)

**User Prompt:**
> Act as an expert full stack developer. Build an application for the ABtalks ViCodathon hackathon — "The Interview Agent" challenge. Requirements: Build an AI Interview Agent that conducts personalized technical interviews based on a candidate's learning journey through the 31-day AI Cohort. Must expose POST /api/interview endpoint, ask ≥8 questions across ≥4 curriculum days, generate follow-ups, maintain context, produce structured feedback. Integrate TruGen AI for face-to-face video interviews. Deploy on AWS Free Tier. Use dark-mode SaaS aesthetic with Space Grotesk headings and Inter body text.

**AI Response:**
> Created implementation plan covering: FastAPI backend with interview orchestrator (planner → state machine → evaluator), React+Vite frontend with 5-page flow (Landing → Candidate Select → Pre-Interview → Interview Room → Feedback), TruGen AI widget integration with text-chat fallback, Groq API for LLM inference, SQLite session storage (local) with DynamoDB compatibility (AWS). Established design system tokens, component tree, and verification plan.

---

### Prompt 2 — Data Files & Build Start (2026-08-08)

**User Prompt:**
> Answers to open questions: 1) Not yet for TruGen — guide me when needed. 2) Yes, use FastAPI. 3) Build local-first, then deploy to AWS.

**AI Response:**
> Finalized plan, resolved all decisions. Read curriculum.json (31 days, 8 modules, structured objectives/tools per day) and candidates.json (20 candidates with mission telemetry: passed/skipped/attempts). Kicked off parallel builds for backend (orchestrator, LLM client, session store) and frontend (all 5 pages with dark-mode design system).

---

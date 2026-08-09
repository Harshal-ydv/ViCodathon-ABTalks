# PROMPTS.md — ProofTalk AI Interview Agent
## Prompt & Conversation Log

This file records the prompts and AI actions used sequentially while building ProofTalk.

---

### Prompt 1 — Project Setup & Requirements (2026-08-08)

**User Prompt:**
> Act as an expert full stack developer. Build an application for the ABtalks ViCodathon hackathon — "The Interview Agent" challenge. Requirements: Build an AI Interview Agent that conducts personalized technical interviews based on a candidate's learning journey through the 31-day AI Cohort. Must expose POST /api/interview endpoint, ask ≥8 questions across ≥4 curriculum days, generate follow-ups, maintain context, produce structured feedback. Integrate TruGen AI for face-to-face video interviews. Deploy on AWS Free Tier. Use dark-mode SaaS aesthetic with Space Grotesk headings and Inter body text.

**AI Action:**
> Created implementation plan covering: FastAPI backend with interview orchestrator (planner → state machine → evaluator), React+Vite frontend with 5-page flow (Landing → Candidate Select → Pre-Interview → Interview Room → Feedback), TruGen AI widget integration with text-chat fallback, Groq API for LLM inference, SQLite session storage (local) with DynamoDB compatibility (AWS). Established design system tokens, component tree, and verification plan.

---

### Prompt 2 — Data Files & Build Start (2026-08-08)

**User Prompt:**
> Answers to open questions: 1) Not yet for TruGen — guide me when needed. 2) Yes, use FastAPI. 3) Build local-first, then deploy to AWS.

**AI Action:**
> Finalized plan, resolved all decisions. Read curriculum.json (31 days, 8 modules, structured objectives/tools per day) and candidates.json (20 candidates with mission telemetry: passed/skipped/attempts). Kicked off parallel builds for backend (orchestrator, LLM client, session store) and frontend (all 5 pages with dark-mode design system).

---

### Prompt 3 — TruGen Agent Configuration Guidance (2026-08-08)

**User Prompt:**
> not yet but guide me to create the agentId and trugen interview agent when we need it . yes use the nessasary technology . its ok to make it work locally but after creating this project we have host it on aws free tier so take the relavant decisions according to that

**AI Action:**
> Provided structured, step-by-step instructions for setting up the TruGen AI agent on the platform: System Prompt, Custom Memory instructions, Knowledge Base context from curriculum/candidates schema, and Entry/Exit System Messages.

---

### Prompt 4 — TruGen Integration & Embedding Fix (2026-08-08)

**User Prompt:**
> i have configured the trugen agent and set the .env with agent id but when i tried to access it .shows this

**AI Action:**
> Diagnosed iframe 404/URL formatting issue. Updated `TruGenAvatar.jsx` to dynamically handle both raw TruGen Agent IDs and full TruGen embed URLs. Updated `backend/app/config.py` to automatically load `.env` variables via `python-dotenv`.

---

### Prompt 5 — Candidate Search & Text Mode Debugging (2026-08-08)

**User Prompt:**
> why the candidate search is not showing results . text interview mode is not working - Error connecting to AI service: Error code: 401 - {'error': {'message': 'Invalid API Key', 'type': 'invalid_request_error', 'code': 'expired_api_key'}} and tell me which things i need to configure now and before that check whether the codebase requires any bugs and fix them

**AI Action:**
> Fixed candidate search bug in `CandidateSelectPage.jsx` by defensively parsing API array payloads. Verified Groq API key handling in `config.py` and ran backend test suite to verify 100% test pass rate (4/4 tests).

---

### Prompt 6 — UI/UX Restructure Planning (2026-08-09)

**User Prompt:**
> now we will stucture our website .so below are the changes in UI of website i want . so according to that plan the changes- currently there are only two sections in this website: add Candidate Learning Journey section... Live AI Interview section... Interview Report and feedback section...

**AI Action:**
> Formulated a comprehensive implementation plan to transform ProofTalk into a production-grade SaaS dashboard featuring left sidebar navigation, a 31-day interactive learning heatmap, search filters, and session performance analytics.

---

### Prompt 7 — Dashboard Restructure Execution (2026-08-09)

**User Prompt:**
> yes that good now start implementaing

**AI Action:**
> Executed complete UI redesign across 29 files:
> - Created `Sidebar.jsx`, `LearningMap.jsx`, `DayDetailPanel.jsx`, `JourneyPage.jsx`, `StatCard.jsx`, and `InterviewAnalytics.jsx`.
> - Extended backend response schema in `models.py` & `main.py` with `daysCovered` and `topicDay`.
> - Rebuilt Candidate Select page with status and job role filters.
> - Verified Vite build (`npm run build`) and backend tests (`python -m unittest test_api.py`).

---

### Prompt 8 — Voice Avatar vs Text Chat Synchronization Fix (2026-08-09)

**User Prompt:**
> when i started the ai interview agent call then it is asking me the question but the side chat panel questions and questions asked by trugen agent is different . are these two are not sysnchronized or are missing some linking check it and fix that

**AI Action:**
> Identified parallel dual-LLM thread conflict between TruGen WebRTC voice avatar and FastAPI text engine. Introduced dedicated `VoiceControlPanel` layout in Video Mode featuring pulsing status, live audio equalizer animation, and a text fallback switch to eliminate conflicting questions.

---

### Prompt 9 — Landing Page Showcase & Comparison Table (2026-08-09)

**User Prompt:**
> i want ot add the image of our video agent at landing page just like the reference image shown here also add the difference between our ai interview agent and other ai interview agent just like specified in reference image . dont change the existing them of website but add this image agent.png in the dashboard according to you which will enhance the look of our website

**AI Action:**
> Redesigned hero section on Landing Page with a browser-chrome frame wrapping `agent.png`, speaking indicator, and `Start Interview` CTA. Added a dark-mode `ProofTalk AI vs Other AI Interview Tools` comparison table covering 7 core dimensions.

---

### Prompt 10 — UI Polish & Layout Stability Fixes (2026-08-09)

**User Prompt:**
> in the dashbord section- the image of interview agent is not loading . below How ProofTalk Works- the numbers are not visible . in learning journey section the layout is changing when clicking on each day , keep the layout fixed . in setup interview section the the content and the card are not occupied the required space properly reorganize then so that they look good . in interview - type your answer is not visible properly

**AI Action:**
> Fixed 5 visual issues:
> 1. Imported `agent.png` directly from `src/` to resolve asset loading.
> 2. Increased step number opacity from 15% to 50% for high contrast.
> 3. Locked `JourneyPage` layout height (`grid-template-rows: 620px`) with internal scroll to eliminate layout shifts.
> 4. Centered `PreInterviewPage` layout vertically with structured headings.
> 5. Added explicit dark theme background/color rules to `InterviewRoomPage` text area.

---

### Prompt 11 — Branding Adjustments (2026-08-09)

**User Prompt:**
> replace - ViCodathon 2026 Submission with ProofTalk AI . remove that shape at start of ProofTalk

**AI Action:**
> Updated hero badge text from "ViCodathon 2026 Submission" to "ProofTalk AI" in `LandingPage.jsx`. Removed diamond `◆` icon from `Sidebar.jsx`.

---

### Prompt 12 — Candidate Journey Grid Lock (2026-08-09)

**User Prompt:**
> still the layout in candidate journey is not fixed it is changing its ahape according to day wise details

**AI Action:**
> Updated `JourneyPage.css` to lock `grid-template-rows: 620px` and set detail section to `height: 620px` with smooth internal scrolling, preventing DOM layout shifts on day selection.

---

### Prompt 13 — Agent Image Overlay Cleanup (2026-08-09)

**User Prompt:**
> remove the AI Interviewer Speaking… from image

**AI Action:**
> Removed the `agent-speaking-badge` overlay div from the hero agent image frame in `LandingPage.jsx`.

---

### Prompt 14 — Final Codebase Audit & Deployment Verification (2026-08-09)

**User Prompt:**
> now i have to fiinalize the project so check there is any bugs or issues is the project and fix them . check whether all things are working correctly and is ready for deployment . also check wheteher UI content are corrrecly organized . after finalising commit the changes to github so the codebase will be updated

**AI Action:**
> Performed complete audit: ran backend test suite (4/4 passed), frontend build check (72 modules compiled clean), cleaned unused CSS in `LandingPage.css`, verified Git status, and committed all final changes to `main`.

---

### Prompt 15 — TruGen Iframe Brand Overlay (2026-08-09)

**User Prompt:**
> remove the your company name text from interviewer panel

**AI Action:**
> Added `trugen-header-cover` overlay badge (`ProofTalk AI Interviewer`) in `TruGenAvatar.jsx` to sleekly cover the default "Your Company Name" iframe label.

---

### Prompt 16 — Environment Variable Check & PROMPTS.md Sync (2026-08-09)

**User Prompt:**
> as we decided at start of this project i need the record of all the prompts sequencially which i asked you in PROMPTS.md but there is only 2 prompts listed their . add the remaining prompts sequecialy in that file

**AI Action:**
> Updated `PROMPTS.md` with all 16 sequential prompts and corresponding technical actions taken throughout the project lifecycle.

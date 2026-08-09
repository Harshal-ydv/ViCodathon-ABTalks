# ProofTalk - AI Interview Agent

> **Build the interviewer, not the interview.**

ProofTalk is an AI-powered technical interview platform built for the [ABtalks ViCodathon 2026](https://www.abtalks.in/hackathon) - **The Interview Agent** challenge. It conducts personalized, adaptive interviews based on a candidate's actual 31-day AI Cohort learning journey, not generic question banks.

---

## Demo Video

**[Watch Demo on Google Drive](https://drive.google.com/drive/folders/100gjcWwHruSy7jKCiovidybI486h7Yof?usp=drive_link)**

*(Full walkthrough video will be uploaded here before submission)*

---

## Live Demo

**[http://3.109.91.205](http://3.109.91.205)** - Deployed on AWS EC2 Free Tier

---

## What Makes It Different

| Feature | ProofTalk | Generic Tools |
|--------|-----------|---------------|
| Signal-Aware Questioning | Adapts based on what you struggled with, skipped, or mastered | Same questions for all |
| Curriculum-Grounded | Every question traceable to a real cohort day | Random topic coverage |
| Face-to-Face Ready | TruGen AI video avatar for realistic delivery | Text-only |
| Structured Feedback | Strengths, gaps, and clear next steps | Simple pass/fail |
| Adaptive Depth | Auto follow-up on weak answers | Fixed question count |

---

## Key Features

- **Candidate Profiles** - Browse 31-day cohort candidates with signal-rich data (commit days, missions passed, attempts)
- **Learning Journey Viewer** - Visual day-by-day breakdown of a candidate's cohort journey
- **Text Mode Interview** - Real-time AI interviewer powered by Groq (Llama 3.3 70B)
- **Video Mode Interview** - TruGen AI avatar delivers questions face-to-face
- **Feedback Report** - Structured summary with strengths, skill gaps, and next steps
- **Smart Planning** - Buckets candidates into CONFIDENT / STRUGGLED / SKIPPED and builds a focused question queue
- **Adaptive Follow-ups** - If an answer is weak, the AI probes deeper before moving on

---

## How It Works

```
Candidate Selected
       |
       v
InterviewPlanner
  - Reads missions (passed/struggled/skipped)
  - Buckets topics: CONFIDENT, STRUGGLED, SKIPPED
  - Builds prioritized 8-question plan
       |
       v
InterviewEvaluator (per turn)
  - Sends answer + last question to LLM for evaluation
  - If weak: generate follow-up (max 1 per topic)
  - If strong: advance to next topic
  - After 8+ questions covering 4+ days: Generate Feedback
       |
       v
FeedbackReport
  - summary: Overall performance narrative
  - strengths: What the candidate demonstrated well
  - gaps: Areas needing improvement
  - next: Concrete recommended actions
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.11, FastAPI, Pydantic v2 |
| Frontend | React 18, Vite, Vanilla CSS |
| LLM | Groq API - Llama 3.3 70B Versatile |
| Video Interview | TruGen AI Avatar |
| Session Store | In-memory (stateful per session) |
| Deployment | AWS EC2 t2.micro (Ubuntu 24.04 LTS) |
| Reverse Proxy | Nginx |
| Process Manager | systemd |

---

## Project Structure

```
ProofTalk/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI endpoint - POST /api/interview
│   │   ├── models.py                # Pydantic schemas
│   │   ├── data/
│   │   │   ├── candidates.json      # 10 candidate profiles with missions and signals
│   │   │   ├── curriculum.json      # 31-day AI Cohort curriculum
│   │   │   └── loader.py            # Data access helpers
│   │   ├── orchestrator/
│   │   │   ├── planner.py           # Adaptive interview plan builder
│   │   │   ├── evaluator.py         # Per-turn evaluation and follow-up logic
│   │   │   └── state_machine.py     # Session state machine
│   │   ├── llm/
│   │   │   ├── groq_client.py       # Groq API calls
│   │   │   └── prompts.py           # All LLM prompt templates
│   │   └── session/
│   │       └── store.py             # In-memory session storage
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── LandingPage.jsx          # Hero landing / entry point
│   │   │   ├── CandidateSelectPage.jsx  # Browse and filter candidates
│   │   │   ├── JourneyPage.jsx          # 31-day mission timeline viewer
│   │   │   ├── PreInterviewPage.jsx     # Mode selection (Text / Video)
│   │   │   ├── InterviewRoomPage.jsx    # Live AI interview chat UI
│   │   │   └── FeedbackPage.jsx         # Structured feedback report viewer
│   │   ├── components/
│   │   │   ├── Sidebar.jsx              # Navigation sidebar
│   │   │   ├── CandidateCard.jsx        # Candidate profile card
│   │   │   └── MissionTimeline.jsx      # Day-by-day journey visualization
│   │   └── context/
│   │       └── SessionContext.jsx       # Global state: candidate, sessionId, feedback
│   ├── vite.config.js
│   └── package.json
├── setup_service.sh                 # One-command EC2 backend setup script
├── nginx.conf.template              # Nginx reverse proxy config template
├── technical-spec.md                # Hackathon API contract specification
└── README.md
```

---

## Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API key - [Get one free](https://console.groq.com)

### 1. Clone the repo

```bash
git clone https://github.com/Harshal-ydv/ViCodathon-ABTalks.git
cd ViCodathon-ABTalks
```

### 2. Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
echo "GROQ_API_KEY=gsk_your_key_here" > .env
python run.py
```

Backend runs at: http://localhost:8000

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## API Contract

### Single Endpoint: POST /api/interview

**Step 1 - Start Interview** (includes full candidate profile)

```json
{
  "sessionId": "abc-123",
  "candidate": {
    "member": {
      "id": "1",
      "name": "Priya Sharma",
      "jobRole": "AI Engineer",
      "yearsExperience": 2,
      "education": "B.Tech CS",
      "status": "COMPLETED"
    },
    "missions": [
      { "day": 1, "title": "Intro to AI", "passed": true, "attempts": 1 }
    ],
    "signals": {
      "commitDays": 28,
      "missionsCompleted": 27,
      "missionsFirstTry": 15
    }
  }
}
```

**Step 2 - Conversation Turn**

```json
{ "sessionId": "abc-123", "message": "I used LangChain to build the pipeline..." }
```

**Step 3 - Interview Ends Automatically**

```json
{
  "reply": "Thank you for completing this interview.",
  "done": true,
  "feedback": {
    "summary": "Strong grasp of fundamentals with gaps in deployment.",
    "strengths": ["Clear explanation of RAG", "Good understanding of prompting"],
    "gaps": ["Limited knowledge of vector databases", "No fine-tuning experience"],
    "next": ["Complete a vector DB project", "Explore LoRA fine-tuning"]
  }
}
```

---

## AWS Deployment

The project runs on a single t2.micro EC2 instance with:
- Nginx serving the React frontend from /var/www/prooftalk
- Nginx proxying /api/* to FastAPI on port 8000
- systemd managing the FastAPI process

One-command setup on EC2:

```bash
bash setup_service.sh gsk_your_groq_key_here
```

Rebuild and deploy frontend:

```bash
cd frontend && npm run build
sudo cp -r dist/* /var/www/prooftalk/
```

---

## Team

Built for **ABtalks ViCodathon 2026** - The Interview Agent challenge.

| Name | Role |
|------|------|
| Harshal Yadav | Full Stack + AI Architecture |

---

## License

MIT

---

*ProofTalk - Because real learning deserves a real interview.*

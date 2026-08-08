# ProofTalk — AI Interview Agent

> **Build the interviewer, not the interview.**

ProofTalk is an AI-powered technical interview agent built for the [ABtalks ViCodathon 2026](https://www.abtalks.in/hackathon). It conducts personalized, adaptive interviews based on a candidate's actual learning journey through the 31-day AI Cohort — not generic question banks.

## What Makes It Different

- **Signal-Aware Questioning** — Questions adapt based on what candidates struggled with, skipped, or mastered
- **Curriculum-Grounded** — Every question is traceable to a real cohort day's objectives and tools
- **Face-to-Face Ready** — TruGen AI video avatar for realistic interview delivery
- **Structured Feedback** — Actionable strengths, gaps, and next steps

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, FastAPI, Pydantic |
| Frontend | React, Vite |
| LLM | Groq API (Llama 3.3 70B) |
| Session Store | SQLite (local) / DynamoDB (AWS) |
| Video Interview | TruGen AI |
| Deployment | AWS Free Tier (Lambda + API Gateway + S3 + CloudFront) |

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API key ([get one free](https://console.groq.com))

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
python run.py
```

Backend runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## API Contract

Single endpoint: `POST /api/interview`

| Call | Request | Response |
|------|---------|----------|
| Start | `{ sessionId, candidate: {...} }` | `{ reply, done: false }` |
| Turn | `{ sessionId, message: "..." }` | `{ reply, done: false }` |
| End | *(auto when complete)* | `{ reply, done: true, feedback: { summary, strengths[], gaps[], next[] } }` |

## Project Structure

```
ProofTalk/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI endpoint
│   │   ├── models.py            # Pydantic schemas
│   │   ├── data/                # Curriculum + candidate data
│   │   ├── orchestrator/        # Planner, evaluator, state machine
│   │   ├── llm/                 # Groq client + prompt templates
│   │   └── session/             # Session persistence
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── routes/              # 5 page components
│   │   ├── components/          # Reusable UI elements
│   │   └── context/             # React session state
│   └── package.json
├── PROMPTS.md                   # AI conversation log
└── README.md
```

## Team

Built for the ABtalks ViCodathon 2026 — "The Interview Agent" challenge.

## License

MIT

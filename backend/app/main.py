from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import json

from app.models import InterviewRequest, InterviewResponse, FeedbackReport
from app.session import get_session_store
from app.orchestrator.state_machine import SessionData, InterviewState
from app.orchestrator.planner import InterviewPlanner
from app.orchestrator.evaluator import InterviewEvaluator
from app.llm.groq_client import GroqClient
from app.data.loader import get_curriculum, get_candidates

app = FastAPI(title="ProofTalk Interview API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

session_store = get_session_store()
planner = InterviewPlanner()
evaluator = InterviewEvaluator()
groq_client = GroqClient()

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/candidates")
def list_candidates():
    return get_candidates()

@app.post("/api/interview", response_model=InterviewResponse)
def interview_endpoint(req: InterviewRequest):
    if req.candidate:
        # START flow
        curriculum = get_curriculum()
        plan = planner.plan_interview(req.candidate.model_dump(), curriculum)
        
        if not plan:
            raise HTTPException(status_code=400, detail="Could not generate interview plan.")
        
        session_data = SessionData(
            session_id=req.sessionId,
            candidate=req.candidate.model_dump(),
            plan=plan,
            current_topic_index=0,
            questions_asked=1,
            days_covered=[plan[0]["day"]],
            state=InterviewState.AWAITING
        )

        welcome_text = groq_client.generate_welcome(session_data.candidate, curriculum)
        first_topic = plan[0]
        first_q = groq_client.generate_question(
            day_info=next((d for d in curriculum.get("days", []) if d["day"] == first_topic["day"]), {}),
            module_name=first_topic["module"],
            performance_bucket=first_topic["bucket"],
            candidate_profile=session_data.candidate
        )

        full_reply = f"{welcome_text}\n\n{first_q}"
        
        session_data.transcript.append({"role": "interviewer", "content": full_reply, "topic_day": first_topic["day"]})
        session_store.create_session(req.sessionId, session_data.model_dump())
        
        return InterviewResponse(reply=full_reply, done=False)

    elif req.message:
        # TURN flow
        data = session_store.get_session(req.sessionId)
        if not data:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session_data = SessionData(**data)
        
        if session_data.state == InterviewState.DONE:
            return InterviewResponse(reply="Interview already completed.", done=True)
            
        reply, is_done, feedback = evaluator.evaluate_and_respond(session_data, req.message)
        
        # update session
        session_store.update_session(req.sessionId, session_data.model_dump())
        
        response = InterviewResponse(reply=reply, done=is_done)
        if feedback:
            response.feedback = FeedbackReport(**feedback)
            
        return response
    else:
        raise HTTPException(status_code=400, detail="Must provide either candidate (to start) or message (for turn)")

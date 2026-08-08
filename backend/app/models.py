from pydantic import BaseModel
from typing import List, Optional

class CandidateMember(BaseModel):
    id: str
    name: str
    jobRole: str
    yearsExperience: int
    education: str
    status: str

class Mission(BaseModel):
    day: int
    title: str
    passed: Optional[bool] = None
    attempts: Optional[int] = None
    skipped: Optional[bool] = None

class CandidateSignals(BaseModel):
    commitDays: int
    missionsCompleted: int
    missionsFirstTry: int

class CandidateProfile(BaseModel):
    member: CandidateMember
    missions: List[Mission]
    signals: CandidateSignals

class FeedbackReport(BaseModel):
    summary: str
    strengths: List[str]
    gaps: List[str]
    next: List[str]

class InterviewRequest(BaseModel):
    sessionId: str
    candidate: Optional[CandidateProfile] = None
    message: Optional[str] = None

class InterviewResponse(BaseModel):
    reply: str
    done: bool
    feedback: Optional[FeedbackReport] = None

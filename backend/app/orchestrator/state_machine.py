from enum import Enum
from typing import List, Dict, Any, Set
from pydantic import BaseModel, Field

class InterviewState(str, Enum):
    INIT = "INIT"
    PLANNING = "PLANNING"
    ASKING = "ASKING"
    AWAITING = "AWAITING"
    EVALUATING = "EVALUATING"
    FOLLOWUP = "FOLLOWUP"
    CLOSING = "CLOSING"
    DONE = "DONE"

class SessionData(BaseModel):
    session_id: str
    candidate: dict = Field(default_factory=dict)
    plan: List[dict] = Field(default_factory=list)
    current_topic_index: int = 0
    questions_asked: int = 0
    days_covered: List[int] = Field(default_factory=list)
    transcript: List[dict] = Field(default_factory=list)
    state: InterviewState = InterviewState.INIT
    followup_used_for_current: bool = False

from app.llm.groq_client import GroqClient
from app.orchestrator.state_machine import SessionData, InterviewState
from app.data.loader import get_curriculum_day
from typing import Tuple, Optional
import json

class InterviewEvaluator:
    def __init__(self):
        self.llm = GroqClient()

    def evaluate_and_respond(self, session_data: SessionData, candidate_message: str) -> Tuple[str, bool, Optional[dict]]:
        # Append candidate message
        current_topic = session_data.plan[session_data.current_topic_index]
        day_info = get_curriculum_day(current_topic["day"])
        
        session_data.transcript.append({
            "role": "candidate",
            "content": candidate_message,
            "topic_day": current_topic["day"]
        })

        # Get the last question asked by the interviewer
        last_question = ""
        for turn in reversed(session_data.transcript):
            if turn["role"] == "interviewer":
                last_question = turn["content"]
                break

        evaluation = self.llm.evaluate_answer(last_question, candidate_message, day_info)
        action = evaluation.get("action", "advance")
        reasoning = evaluation.get("reasoning", "")

        should_followup = (
            action == "follow_up" 
            and not session_data.followup_used_for_current 
            and session_data.questions_asked < 12
        )

        if should_followup:
            follow_up_q = self.llm.generate_followup(last_question, candidate_message, reasoning, day_info)
            session_data.followup_used_for_current = True
            session_data.questions_asked += 1
            session_data.transcript.append({
                "role": "interviewer",
                "content": follow_up_q,
                "topic_day": current_topic["day"]
            })
            return follow_up_q, False, None

        # Move to next topic or end
        session_data.current_topic_index += 1
        
        if (session_data.questions_asked >= 8 and len(set(session_data.days_covered)) >= 4) or session_data.current_topic_index >= len(session_data.plan):
            # Generate Feedback and End
            topics_covered = [f"Day {d}" for d in set(session_data.days_covered)]
            feedback = self.llm.generate_feedback(session_data.transcript, session_data.candidate, topics_covered)
            closing_msg = "Thank you for completing this interview. It was great talking to you!"
            session_data.transcript.append({
                "role": "interviewer",
                "content": closing_msg,
                "topic_day": None
            })
            session_data.state = InterviewState.DONE
            return closing_msg, True, feedback

        # Ask next topic question
        next_topic = session_data.plan[session_data.current_topic_index]
        next_day_info = get_curriculum_day(next_topic["day"])
        new_question = self.llm.generate_question(
            day_info=next_day_info,
            module_name=next_topic["module"],
            performance_bucket=next_topic["bucket"],
            candidate_profile=session_data.candidate
        )

        session_data.followup_used_for_current = False
        session_data.questions_asked += 1
        if next_topic["day"] not in session_data.days_covered:
            session_data.days_covered.append(next_topic["day"])

        session_data.transcript.append({
            "role": "interviewer",
            "content": new_question,
            "topic_day": next_topic["day"]
        })
        
        return new_question, False, None

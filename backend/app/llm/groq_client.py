import json
import logging
from groq import Groq
from app.config import GROQ_API_KEY, GROQ_MODEL
from .prompts import (
    WELCOME_PROMPT,
    QUESTION_GENERATION_PROMPT,
    EVALUATION_PROMPT,
    FOLLOWUP_PROMPT,
    FEEDBACK_PROMPT
)

logger = logging.getLogger(__name__)

class GroqClient:
    def __init__(self):
        if not GROQ_API_KEY:
            logger.warning("GROQ_API_KEY is not set. API calls will fail.")
        self.client = Groq(api_key=GROQ_API_KEY)
        self.model = GROQ_MODEL

    def chat(self, system_prompt: str, user_prompt: str, json_mode: bool = False, temperature: float = 0.7) -> str:
        try:
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            if user_prompt:
                messages.append({"role": "user", "content": user_prompt})

            kwargs = {
                "model": self.model,
                "messages": messages,
                "temperature": temperature
            }
            
            if json_mode:
                kwargs["response_format"] = {"type": "json_object"}

            response = self.client.chat.completions.create(**kwargs)
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq API Error: {str(e)}")
            return f"Error connecting to AI service: {str(e)}"

    def generate_welcome(self, candidate_profile: dict, curriculum: dict) -> str:
        member = candidate_profile.get("member", {})
        prompt = WELCOME_PROMPT.format(
            candidate_name=member.get("name", "Candidate"),
            job_role=member.get("jobRole", "Developer"),
            years_experience=member.get("yearsExperience", 0)
        )
        return self.chat(system_prompt=prompt, user_prompt="", temperature=0.7)

    def generate_question(self, day_info: dict, module_name: str, performance_bucket: str, candidate_profile: dict) -> str:
        member = candidate_profile.get("member", {})
        prompt = QUESTION_GENERATION_PROMPT.format(
            job_role=member.get("jobRole", "Developer"),
            years_experience=member.get("yearsExperience", 0),
            day=day_info.get("day"),
            title=day_info.get("title"),
            module_name=module_name,
            objectives=", ".join(day_info.get("objectives", [])),
            tools=", ".join(day_info.get("tools", [])),
            performance_bucket=performance_bucket
        )
        return self.chat(system_prompt=prompt, user_prompt="", temperature=0.7)

    def evaluate_answer(self, question: str, answer: str, day_info: dict) -> dict:
        prompt = EVALUATION_PROMPT.format(
            day=day_info.get("day"),
            title=day_info.get("title"),
            objectives=", ".join(day_info.get("objectives", [])),
            tools=", ".join(day_info.get("tools", [])),
            question=question,
            answer=answer
        )
        response_text = self.chat(system_prompt=prompt, user_prompt="", json_mode=True, temperature=0.3)
        try:
            return json.loads(response_text)
        except:
            return {"action": "advance", "reasoning": "Failed to parse evaluation", "quality": "adequate"}

    def generate_followup(self, question: str, answer: str, reasoning: str, day_info: dict) -> str:
        prompt = FOLLOWUP_PROMPT.format(
            question=question,
            answer=answer,
            reasoning=reasoning,
            day=day_info.get("day"),
            title=day_info.get("title")
        )
        return self.chat(system_prompt=prompt, user_prompt="", temperature=0.7)

    def generate_feedback(self, transcript: list, candidate_profile: dict, topics_covered: list) -> dict:
        member = candidate_profile.get("member", {})
        formatted_transcript = ""
        for turn in transcript:
            role = turn.get("role", "unknown").upper()
            formatted_transcript += f"{role}: {turn.get('content', '')}\n\n"
        
        prompt = FEEDBACK_PROMPT.format(
            candidate_name=member.get("name", "Candidate"),
            job_role=member.get("jobRole", "Developer"),
            years_experience=member.get("yearsExperience", 0),
            topics_covered=", ".join(topics_covered),
            transcript=formatted_transcript
        )
        response_text = self.chat(system_prompt=prompt, user_prompt="", json_mode=True, temperature=0.3)
        try:
            return json.loads(response_text)
        except:
            return {
                "summary": "Failed to generate structured feedback.",
                "strengths": [],
                "gaps": [],
                "next": []
            }

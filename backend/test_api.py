import unittest
import json
import uuid
import os
import sys
from fastapi.testclient import TestClient

# Ensure app is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Mock Groq API if GROQ_API_KEY is not set to allow local offline testing
if not os.environ.get("GROQ_API_KEY"):
    os.environ["GROQ_API_KEY"] = "mock_key_for_testing"
    
from app.main import app
from app.llm.groq_client import GroqClient

class TestProofTalkAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.session_id = f"test-session-{uuid.uuid4()}"

        # Mock the GroqClient methods to return stable responses during testing
        self.original_generate_welcome = GroqClient.generate_welcome
        self.original_generate_question = GroqClient.generate_question
        self.original_evaluate_answer = GroqClient.evaluate_answer
        self.original_generate_followup = GroqClient.generate_followup
        self.original_generate_feedback = GroqClient.generate_feedback

        GroqClient.generate_welcome = lambda self, candidate_profile, curriculum: "Welcome candidate! Let's start the interview."
        GroqClient.generate_question = lambda self, day_info, module_name, performance_bucket, candidate_profile: f"Can you explain day {day_info.get('day')} topic?"
        GroqClient.evaluate_answer = lambda self, question, answer, day_info: {"action": "advance", "reasoning": "Good explanation.", "quality": "strong"}
        GroqClient.generate_followup = lambda self, question, answer, reasoning, day_info: "Can you elaborate on that?"
        GroqClient.generate_feedback = lambda self, transcript, candidate_profile, topics_covered: {
            "summary": "The candidate has demonstrated strong conceptual understanding.",
            "strengths": ["Good understanding of vector search", "Solid RAG reasoning"],
            "gaps": ["Needs minor review of deployment strategies"],
            "next": ["Read Docker/K8s docs"]
        }

    def tearDown(self):
        # Restore original methods
        GroqClient.generate_welcome = self.original_generate_welcome
        GroqClient.generate_question = self.original_generate_question
        GroqClient.evaluate_answer = self.original_evaluate_answer
        GroqClient.generate_followup = self.original_generate_followup
        GroqClient.generate_feedback = self.original_generate_feedback

    def test_health_check(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_list_candidates(self):
        response = self.client.get("/api/candidates")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)
        self.assertEqual(data[0]["member"]["id"], "CAND-001")

    def test_interview_full_flow(self):
        # Get candidates to select one
        response = self.client.get("/api/candidates")
        candidate = response.json()[0]

        # 1. Start Interview
        payload = {
            "sessionId": self.session_id,
            "candidate": candidate
        }
        res = self.client.post("/api/interview", json=payload)
        self.assertEqual(res.status_code, 200)
        start_data = res.json()
        self.assertIn("reply", start_data)
        self.assertIn("Welcome candidate!", start_data["reply"])
        self.assertFalse(start_data["done"])
        self.assertIsNotNone(start_data.get("daysCovered"))
        self.assertIsNotNone(start_data.get("topicDay"))
        self.assertIn(start_data["topicDay"], start_data["daysCovered"])
        self.assertIsNone(start_data.get("feedback"))

        # 2. Simulate conversation turns
        # We need to answer at least 8 questions to finish.
        # Let's perform 8 turns of conversation.
        for i in range(7):
            turn_payload = {
                "sessionId": self.session_id,
                "message": f"This is my answer to question {i+1}."
            }
            res = self.client.post("/api/interview", json=turn_payload)
            self.assertEqual(res.status_code, 200)
            turn_data = res.json()
            self.assertIn("reply", turn_data)
            self.assertFalse(turn_data["done"])
            self.assertIsNotNone(turn_data.get("daysCovered"))
            self.assertIsNotNone(turn_data.get("topicDay"))
            self.assertIsNone(turn_data.get("feedback"))

        # The 8th answer should trigger evaluation and finish the interview
        final_payload = {
            "sessionId": self.session_id,
            "message": "This is my final answer."
        }
        res = self.client.post("/api/interview", json=final_payload)
        self.assertEqual(res.status_code, 200)
        final_data = res.json()
        self.assertIn("reply", final_data)
        self.assertTrue(final_data["done"])
        self.assertIsNotNone(final_data["feedback"])
        
        # Verify feedback structure matches tech-spec.md
        feedback = final_data["feedback"]
        self.assertIn("summary", feedback)
        self.assertIn("strengths", feedback)
        self.assertIn("gaps", feedback)
        self.assertIn("next", feedback)
        self.assertIsInstance(feedback["strengths"], list)
        self.assertIsInstance(feedback["gaps"], list)
        self.assertIsInstance(feedback["next"], list)

    def test_missing_session_or_body(self):
        # Test posting empty body
        res = self.client.post("/api/interview", json={})
        self.assertEqual(res.status_code, 422) # Validation error (missing fields)

        # Test posting turn for non-existent session
        res = self.client.post("/api/interview", json={"sessionId": "non-existent-session-id", "message": "hello"})
        self.assertEqual(res.status_code, 404)

if __name__ == "__main__":
    unittest.main()

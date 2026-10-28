from typing import List, Dict, Any, Optional
from app.ai.llm_service import llm_service
from app.core.logging import logger


class QuizGenerator:
    async def generate_questions_from_content(
        self,
        content: str,
        topic: str = "General",
        question_count: int = 5,
        difficulty: str = "medium",
    ) -> List[Dict[str, Any]]:
        """Generate multiple choice questions from study notes or document chunks."""
        prompt = f"""
You are an expert university examiner. Generate {question_count} high-quality multiple choice assessment questions based strictly on the provided content and topic.

Topic: {topic}
Target Difficulty: {difficulty}
Reference Content:
\"\"\"{content[:4000]}\"\"\"

Return a JSON object containing an array of questions:
{{
  "questions": [
    {{
      "question_text": "Clear question stem?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Option A",
      "explanation": "Detailed explanation of why Option A is correct and why other distractors are incorrect.",
      "difficulty": "{difficulty}",
      "skill": "{topic}"
    }}
  ]
}}
"""
        parsed = await llm_service.generate_json(
            prompt=prompt,
            system_prompt="You are an expert assessment specialist. Generate rigorous, unambiguous technical assessment items."
        )

        questions = []
        if parsed and isinstance(parsed, dict) and "questions" in parsed:
            questions = parsed["questions"]
        elif parsed and isinstance(parsed, list):
            questions = parsed

        # Validate questions
        validated = []
        for q in questions:
            if not isinstance(q, dict):
                continue
            text = q.get("question_text")
            options = q.get("options")
            correct = q.get("correct_answer")
            if text and isinstance(options, list) and len(options) >= 2 and correct:
                if correct not in options:
                    options.append(correct)
                validated.append({
                    "question_text": text,
                    "options": options,
                    "correct_answer": correct,
                    "explanation": q.get("explanation", "Correct based on reference material analysis."),
                    "difficulty": q.get("difficulty", difficulty),
                    "skill": q.get("skill", topic),
                    "marks": 5.0,
                })

        if validated:
            return validated

        # If LLM response was empty or parsing failed, return deterministic vetted questions
        logger.info("Using deterministic fallback quiz questions.")
        return self._get_fallback_questions(topic, question_count, difficulty)

    def _get_fallback_questions(self, topic: str, count: int, difficulty: str) -> List[Dict[str, Any]]:
        bank = [
            {
                "question_text": f"In the context of {topic}, which principle guarantees fault isolation and modularity?",
                "options": ["Loose Coupling and High Cohesion", "Tight Integration", "Global State Sharing", "Unconstrained Inheritance"],
                "correct_answer": "Loose Coupling and High Cohesion",
                "explanation": "Loose coupling ensures components interact through well-defined contracts without depending on internal implementation details.",
                "difficulty": difficulty,
                "skill": topic,
                "marks": 5.0,
            },
            {
                "question_text": f"What is the primary trade-off when optimizing data structures for {topic}?",
                "options": ["Time complexity vs Space complexity", "Compiler overhead vs Network latency", "Disk block size vs Cache lines", "Instruction pipelining vs Register allocation"],
                "correct_answer": "Time complexity vs Space complexity",
                "explanation": "Algorithmic engineering inherently balances CPU operation cycles against auxiliary memory allocation footprints.",
                "difficulty": difficulty,
                "skill": topic,
                "marks": 5.0,
            },
            {
                "question_text": f"When scaling systems handling {topic}, which technique effectively mitigates database bottlenecks?",
                "options": ["Read-replicas and distributed caching", "Monolithic table locking", "Synchronous network polling", "Disabling foreign key constraints"],
                "correct_answer": "Read-replicas and distributed caching",
                "explanation": "Read replicas offload read-heavy transactional traffic, while caching (e.g. Redis) prevents repeated queries.",
                "difficulty": difficulty,
                "skill": topic,
                "marks": 5.0,
            },
            {
                "question_text": f"Which metric best reflects system resilience under heavy {topic} workloads?",
                "options": ["p99 Latency and Error Rate", "Average CPU temperature", "Lines of Code committed", "Total RAM size installed"],
                "correct_answer": "p99 Latency and Error Rate",
                "explanation": "p99 latency captures the worst-case tail experience of real users, serving as the industry benchmark for SLA compliance.",
                "difficulty": difficulty,
                "skill": topic,
                "marks": 5.0,
            },
            {
                "question_text": f"What is the recommended approach for validating inputs in {topic} pipelines?",
                "options": ["Strict schema validation at boundary layers", "Relying on client-side checks only", "Silent type casting", "Skipping validation for internal calls"],
                "correct_answer": "Strict schema validation at boundary layers",
                "explanation": "Defensive API design mandates parsing and validating untrusted payloads before processing them in domain logic.",
                "difficulty": difficulty,
                "skill": topic,
                "marks": 5.0,
            },
        ]
        return bank[:count]


quiz_generator = QuizGenerator()

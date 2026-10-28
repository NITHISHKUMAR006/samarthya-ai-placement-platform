from fastapi import APIRouter, Depends, HTTPException
from app.schemas.all_schemas import GenerateQuizRequest, ExplainQuestionRequest, MockInterviewRequest
from app.core.permissions import CurrentUser, get_current_user
from app.core.config import settings
from app.ai.llm_service import llm_service
from app.ai.embedding_service import embedding_service
from app.ai.quiz_generator import quiz_generator

router = APIRouter()

@router.get("/ai/status")
def get_ai_status():
    return {
        "ai_enabled": settings.AI_ENABLED,
        "llm_provider_configured": llm_service.is_configured,
        "model_id": settings.OPENAI_MODEL_ID or "gpt-4o-mini",
        "base_url": settings.OPENAI_BASE_URL or "https://api.openai.com/v1",
        "embeddings_configured": embedding_service.is_configured,
        "embedding_model": settings.EMBEDDING_MODEL_ID or "text-embedding-3-small",
        "rag_enabled": settings.ENABLE_RAG,
    }

@router.post("/ai/generate-quiz")
async def generate_quiz(req: GenerateQuizRequest, user: CurrentUser = Depends(get_current_user)):
    questions = await quiz_generator.generate_questions_from_content(
        content=req.content or f"Core study concepts, practical applications, and edge cases in {req.topic}.",
        topic=req.topic,
        question_count=req.question_count,
        difficulty=req.difficulty,
    )
    return {
        "topic": req.topic,
        "difficulty": req.difficulty,
        "question_count": len(questions),
        "questions": questions,
    }

@router.post("/ai/explain-question")
async def explain_question(req: ExplainQuestionRequest, user: CurrentUser = Depends(get_current_user)):
    prompt = f"""
Explain this technical assessment question clearly and thoroughly:
Question: {req.question_text}
Correct Answer: {req.correct_answer}
Student Answer: {req.user_answer or "Not attempted"}

Provide:
1. Concept explanation.
2. Step-by-step reasoning why the correct answer is right.
3. Why common alternative choices are incorrect or suboptimal.
"""
    explanation = await llm_service.chat_completion(
        messages=[
            {"role": "system", "content": "You are a distinguished computer science and placement mentor. Provide insightful, step-by-step diagnostic feedback."},
            {"role": "user", "content": prompt},
        ]
    )
    return {
        "question": req.question_text,
        "correct_answer": req.correct_answer,
        "ai_explanation": explanation,
    }

@router.post("/ai/mock-interview-questions")
async def generate_mock_interview_questions(req: MockInterviewRequest, user: CurrentUser = Depends(get_current_user)):
    prompt = f"""
Generate 4 targeted interview questions for a candidate interviewing for the role of '{req.job_role}' at '{req.company_name}'.
Focus area: {req.focus_area}

Output a JSON array of objects:
[
  {{
    "round": "Technical Architecture / Coding / Behavioral",
    "question": "Question text?",
    "what_interviewer_looks_for": "Evaluation criteria and key points to hit",
    "recommended_approach": "Structure of a strong candidate answer"
  }}
]
"""
    parsed = await llm_service.generate_json(
        prompt=prompt,
        system_prompt="You are a senior hiring manager and tech lead at a premier tech firm."
    )
    if parsed and isinstance(parsed, list):
        return {"questions": parsed}
    
    # Fallback mock interview questions
    return {
        "questions": [
            {
                "round": "Technical Problem Solving",
                "question": f"How would you architect a scalable, low-latency microservice for {req.company_name}'s high-throughput workloads?",
                "what_interviewer_looks_for": "Understanding of asynchronous queues, database sharding, caching tiers, and idempotent APIs.",
                "recommended_approach": "Start with requirements, estimate QPS and storage, draw high-level components, then dive into bottlenecks.",
            },
            {
                "round": "Data Structures & Complexity",
                "question": "Describe an algorithmic scenario where a balanced binary tree outperforms a hash map in practice.",
                "what_interviewer_looks_for": "Awareness of range queries, sorted traversals, predictable worst-case bounds, and memory overhead.",
                "recommended_approach": "Highlight ordered iteration, range queries [low, high], and avoidance of rehashing spikes.",
            },
            {
                "round": "System Resilience",
                "question": "How do you detect and mitigate cascading failures across microservice dependencies?",
                "what_interviewer_looks_for": "Familiarity with circuit breakers, exponential backoff with jitter, rate limiters, and bulkhead patterns.",
                "recommended_approach": "Explain the circuit breaker state machine (Closed, Open, Half-Open) and graceful degradation.",
            },
            {
                "round": "Behavioral & Culture (STAR)",
                "question": "Tell me about a time when you discovered a subtle bug in production right before a major institutional deadline.",
                "what_interviewer_looks_for": "Composure under pressure, root cause investigation, transparent communication, and post-mortem mindset.",
                "recommended_approach": "Use Situation, Task, Action, Result. Emphasize verification and long-term regression testing.",
            },
        ]
    }

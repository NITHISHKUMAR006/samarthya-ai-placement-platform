import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.schemas.all_schemas import AssessmentCreate, SubmitAssessmentRequest
from app.core.permissions import CurrentUser, get_current_user, require_faculty_or_admin
from app.db.store import store

router = APIRouter()

@router.get("/assessments")
def get_assessments(
    category: Optional[str] = Query(None),
    user: CurrentUser = Depends(get_current_user),
):
    inst_id = str(user.institution_id) if user.institution_id else "a0000000-0000-0000-0000-000000000001"
    res = []
    for a in store.assessments.values():
        if not user.is_super_admin and a.get("institution_id") != inst_id:
            continue
        if category and a.get("category") != category:
            continue
        # Question count
        q_count = len([q for q in store.questions.values() if q.get("assessment_id") == a["id"]])
        # User attempt status
        user_attempts = [att for att in store.assessment_attempts.values() if att.get("assessment_id") == a["id"] and att.get("user_id") == str(user.id)]
        
        a_copy = a.copy()
        a_copy["question_count"] = q_count
        a_copy["attempts_count"] = len(user_attempts)
        a_copy["user_completed"] = any(att.get("status") == "evaluated" for att in user_attempts)
        a_copy["best_score"] = max([att.get("score", 0.0) for att in user_attempts], default=0.0) if user_attempts else 0.0
        res.append(a_copy)
    return res

@router.get("/assessments/{assessment_id}")
def get_assessment(assessment_id: str, user: CurrentUser = Depends(get_current_user)):
    a = store.assessments.get(assessment_id)
    if not a:
        raise HTTPException(status_code=404, detail="Assessment not found.")
    
    # Get questions
    raw_questions = [q for q in store.questions.values() if q.get("assessment_id") == assessment_id]
    
    # Check if student is actively taking or if faculty/admin
    is_staff = user.role in ["faculty", "institution_admin", "super_admin"]
    
    sanitized_questions = []
    for q in raw_questions:
        q_item = {
            "id": q["id"],
            "assessment_id": q["assessment_id"],
            "question_text": q["question_text"],
            "question_type": q.get("question_type", "mcq"),
            "options": q.get("options", []),
            "marks": q.get("marks", 5.0),
            "skill": q.get("skill"),
            "difficulty": q.get("difficulty", "medium"),
        }
        # Only expose correct_answer and explanation to faculty or admin
        if is_staff:
            q_item["correct_answer"] = q.get("correct_answer")
            q_item["explanation"] = q.get("explanation")
        sanitized_questions.append(q_item)

    a_copy = a.copy()
    a_copy["questions"] = sanitized_questions
    return a_copy

@router.post("/assessments")
def create_assessment(req: AssessmentCreate, user: CurrentUser = Depends(require_faculty_or_admin)):
    inst_id = str(user.institution_id) if user.institution_id else "a0000000-0000-0000-0000-000000000001"
    new_id = str(uuid.uuid4())
    a_obj = {
        "id": new_id,
        "institution_id": inst_id,
        "title": req.title,
        "description": req.description or "",
        "category": req.category,
        "difficulty": req.difficulty,
        "duration_minutes": req.duration_minutes,
        "total_marks": req.total_marks,
        "pass_marks": req.pass_marks,
        "max_attempts": req.max_attempts,
        "is_published": True,
        "created_by": str(user.id),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    store.assessments[new_id] = a_obj

    # Create embedded questions if provided
    if req.questions:
        for q in req.questions:
            q_id = str(uuid.uuid4())
            store.questions[q_id] = {
                "id": q_id,
                "assessment_id": new_id,
                "question_text": q.question_text,
                "question_type": q.question_type,
                "options": q.options,
                "correct_answer": q.correct_answer,
                "explanation": q.explanation or "",
                "marks": q.marks,
                "skill": q.skill or req.category,
                "difficulty": q.difficulty,
            }

    return a_obj

@router.post("/assessments/{assessment_id}/start")
def start_assessment_attempt(assessment_id: str, user: CurrentUser = Depends(get_current_user)):
    a = store.assessments.get(assessment_id)
    if not a:
        raise HTTPException(status_code=404, detail="Assessment not found.")
    
    # Check attempt limits
    existing_attempts = [
        att for att in store.assessment_attempts.values()
        if att.get("assessment_id") == assessment_id and att.get("user_id") == str(user.id)
    ]
    if len(existing_attempts) >= a.get("max_attempts", 3):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Maximum attempt limit ({a.get('max_attempts')}) reached for this assessment."
        )

    attempt_id = str(uuid.uuid4())
    attempt = {
        "id": attempt_id,
        "assessment_id": assessment_id,
        "user_id": str(user.id),
        "status": "in_progress",
        "start_time": datetime.now(timezone.utc).isoformat(),
        "score": 0.0,
        "percentage": 0.0,
        "passed": False,
    }
    store.assessment_attempts[attempt_id] = attempt
    return {"attempt_id": attempt_id, "duration_minutes": a.get("duration_minutes", 30)}

@router.post("/assessments/attempts/{attempt_id}/submit")
def submit_assessment_attempt(attempt_id: str, req: SubmitAssessmentRequest, user: CurrentUser = Depends(get_current_user)):
    attempt = store.assessment_attempts.get(attempt_id)
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt record not found.")
    if attempt.get("status") == "evaluated":
        raise HTTPException(status_code=400, detail="This assessment attempt has already been submitted.")

    assessment_id = attempt["assessment_id"]
    assessment = store.assessments.get(assessment_id)
    
    # Server-side verification and deterministic scoring
    total_score = 0.0
    max_possible = 0.0
    breakdown = {}
    strengths = []
    weaknesses = []

    answer_map = {ans.question_id: ans.user_answer for ans in req.answers}
    questions = [q for q in store.questions.values() if q.get("assessment_id") == assessment_id]

    for q in questions:
        q_id = q["id"]
        q_marks = float(q.get("marks", 5.0))
        max_possible += q_marks
        user_ans = answer_map.get(q_id, "").strip()
        correct_ans = q.get("correct_answer", "").strip()

        is_correct = (user_ans.lower() == correct_ans.lower()) if user_ans else False
        skill = q.get("skill") or "General"
        
        if is_correct:
            total_score += q_marks
            strengths.append(skill)
        else:
            weaknesses.append(skill)
            
        breakdown[skill] = breakdown.get(skill, 0.0) + (q_marks if is_correct else 0.0)

    percentage = round((total_score / max_possible * 100.0) if max_possible > 0 else 0.0, 2)
    pass_marks = float(assessment.get("pass_marks", 40.0))
    passed = total_score >= pass_marks

    # Update attempt
    attempt["status"] = "evaluated"
    attempt["submit_time"] = datetime.now(timezone.utc).isoformat()
    attempt["score"] = total_score
    attempt["percentage"] = percentage
    attempt["passed"] = passed
    attempt["feedback"] = "Great work! Excellent performance." if passed else "Review your weaker skills in the practice section to improve readiness."

    # Record result
    result = {
        "id": str(uuid.uuid4()),
        "attempt_id": attempt_id,
        "user_id": str(user.id),
        "assessment_id": assessment_id,
        "score_breakdown": breakdown,
        "strengths": list(set(strengths)),
        "weaknesses": list(set(weaknesses)),
    }
    store.assessment_results[attempt_id] = result

    return {
        "attempt_id": attempt_id,
        "score": total_score,
        "max_marks": max_possible,
        "percentage": percentage,
        "passed": passed,
        "feedback": attempt["feedback"],
        "strengths": result["strengths"],
        "weaknesses": result["weaknesses"],
    }

@router.get("/assessments/attempts/history")
def get_user_attempts_history(user: CurrentUser = Depends(get_current_user)):
    user_id = str(user.id)
    attempts = [att for att in store.assessment_attempts.values() if att.get("user_id") == user_id]
    
    enriched = []
    for att in sorted(attempts, key=lambda x: x.get("start_time", ""), reverse=True):
        a = store.assessments.get(att.get("assessment_id"))
        att_copy = att.copy()
        att_copy["assessment_title"] = a.get("title", "Assessment") if a else "Assessment"
        att_copy["category"] = a.get("category", "General") if a else "General"
        enriched.append(att_copy)
    return enriched

@router.get("/assessments/attempts/{attempt_id}/result")
def get_attempt_result(attempt_id: str, user: CurrentUser = Depends(get_current_user)):
    attempt = store.assessment_attempts.get(attempt_id)
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found.")
    
    assessment = store.assessments.get(attempt["assessment_id"])
    result = store.assessment_results.get(attempt_id, {})
    questions = [q for q in store.questions.values() if q.get("assessment_id") == attempt["assessment_id"]]

    return {
        "attempt": attempt,
        "assessment": assessment,
        "result": result,
        "questions": questions,
    }

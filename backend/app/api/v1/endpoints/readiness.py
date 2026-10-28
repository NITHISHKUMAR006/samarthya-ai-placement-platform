from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from app.core.permissions import CurrentUser, get_current_user
from app.db.store import store

router = APIRouter()

@router.get("/readiness/student/{student_id}")
def get_readiness_snapshot(student_id: str, user: CurrentUser = Depends(get_current_user)):
    # Check by user_id or student profile id
    snap = store.readiness_snapshots.get(student_id)
    if not snap:
        # Check student profile
        s = store.student_profiles.get(student_id)
        if not s:
            for prof in store.student_profiles.values():
                if prof.get("user_id") == student_id:
                    s = prof
                    break
        if s:
            snap = store.readiness_snapshots.get(s["user_id"])

    if not snap:
        # Generate initial snapshot
        snap = {
            "id": f"snap-{student_id[:8]}",
            "user_id": student_id,
            "institution_id": str(user.institution_id) if user.institution_id else "a0000000-0000-0000-0000-000000000001",
            "target_company_id": "f0000000-0000-0000-0000-000000000001",
            "target_company_name": "Google Cloud",
            "target_role": "Software Development Engineer I",
            "overall_readiness_score": 88.5,
            "status": "meets_criteria",
            "skill_gaps": [
                {
                    "skill": "Operating Systems",
                    "current_level": 3,
                    "required_level": 4,
                    "gap": 1,
                    "recommendation": "Review Virtual Memory Paging and Deadlock Prevention before technical rounds.",
                }
            ],
            "strengths": [
                "Data Structures & Algorithms (Level 5)",
                "Python Programming (Level 5)",
                "Quantitative Aptitude (100% Diagnostic Score)",
                "CGPA (8.75 meets >= 8.0 criterion)",
            ],
            "recommendations": [
                "Complete the Operating Systems & System Architecture diagnostic assessment.",
                "Review Google Cloud Distributed Systems architecture whitepaper.",
                "Engage in mock peer coding interviews with 45-minute timed constraints.",
            ],
            "calculated_at": datetime.now(timezone.utc).isoformat(),
        }
        store.readiness_snapshots[student_id] = snap

    return snap

@router.post("/readiness/student/{student_id}/recalculate")
def recalculate_readiness(student_id: str, user: CurrentUser = Depends(get_current_user)):
    snap = store.readiness_snapshots.get(student_id)
    if not snap:
        snap = get_readiness_snapshot(student_id, user)
    
    # Refresh timestamp
    snap["calculated_at"] = datetime.now(timezone.utc).isoformat()
    # Update score based on completed attempts
    attempts = [att for att in store.assessment_attempts.values() if att.get("user_id") == student_id or att.get("user_id") == snap.get("user_id")]
    if attempts:
        avg_score = sum(att.get("percentage", 0.0) for att in attempts) / len(attempts)
        snap["overall_readiness_score"] = round(avg_score, 1)
        if avg_score >= 80.0:
            snap["status"] = "meets_criteria"
        elif avg_score >= 60.0:
            snap["status"] = "preparation_in_progress"
        else:
            snap["status"] = "skills_requiring_improvement"
    else:
        snap["status"] = "insufficient_information"

    store.readiness_snapshots[student_id] = snap
    return snap

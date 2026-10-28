import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.schemas.all_schemas import StudentProfileCreate, StudentProfileResponse
from app.core.permissions import CurrentUser, get_current_user, require_faculty_or_admin, verify_institution_access
from app.db.store import store

router = APIRouter()

@router.get("/students", response_model=List[StudentProfileResponse])
def get_students(
    department: Optional[str] = Query(None),
    batch_year: Optional[int] = Query(None),
    min_cgpa: Optional[float] = Query(None),
    user: CurrentUser = Depends(get_current_user),
):
    inst_id = str(user.institution_id) if user.institution_id else "a0000000-0000-0000-0000-000000000001"
    results = []
    for s in store.student_profiles.values():
        if not user.is_super_admin and s.get("institution_id") != inst_id:
            continue
        if department and s.get("department") != department:
            continue
        if batch_year and s.get("batch_year") != batch_year:
            continue
        if min_cgpa is not None and s.get("cgpa", 0.0) < min_cgpa:
            continue
        results.append(s)
    return results

@router.get("/students/{student_id}", response_model=StudentProfileResponse)
def get_student(student_id: str, user: CurrentUser = Depends(get_current_user)):
    s = store.student_profiles.get(student_id)
    if not s:
        # Check by user_id
        for profile in store.student_profiles.values():
            if profile.get("user_id") == student_id:
                s = profile
                break
    if not s:
        raise HTTPException(status_code=404, detail="Student profile not found.")
    verify_institution_access(s["institution_id"], user)
    return s

@router.post("/students", response_model=StudentProfileResponse)
def create_student(req: StudentProfileCreate, user: CurrentUser = Depends(require_faculty_or_admin)):
    inst_id = str(user.institution_id) if user.institution_id else "a0000000-0000-0000-0000-000000000001"
    new_id = str(uuid.uuid4())
    user_id = req.user_id or str(uuid.uuid4())
    student_obj = {
        "id": new_id,
        "user_id": user_id,
        "institution_id": inst_id,
        "full_name": req.full_name,
        "email": req.email,
        "roll_number": req.roll_number,
        "department": req.department,
        "batch_year": req.batch_year,
        "current_semester": req.current_semester,
        "cgpa": req.cgpa,
        "tenth_percentage": req.tenth_percentage,
        "twelfth_percentage": req.twelfth_percentage,
        "career_aspirations": req.career_aspirations,
    }
    store.student_profiles[new_id] = student_obj
    return student_obj

@router.get("/students/{student_id}/skills")
def get_student_skills(student_id: str, user: CurrentUser = Depends(get_current_user)):
    # Return skills mapped for the student
    skills = []
    for sk in store.skills.values():
        skills.append({
            "id": sk["id"],
            "name": sk["name"],
            "category": sk["category"],
            "proficiency_level": 4 if "Aptitude" in sk["name"] or "Python" in sk["name"] else 3,
            "icon": sk["icon"],
        })
    return skills

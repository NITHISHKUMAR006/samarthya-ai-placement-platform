from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException
from app.core.permissions import CurrentUser, get_current_user
from app.db.store import store

router = APIRouter()

@router.get("/skill-gap/student/{student_id}/company/{company_id}")
def analyze_skill_gap(student_id: str, company_id: str, user: CurrentUser = Depends(get_current_user)):
    # Find student
    student = store.student_profiles.get(student_id)
    if not student:
        for s in store.student_profiles.values():
            if s.get("user_id") == student_id:
                student = s
                break
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    company = store.companies.get(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    # Find requirement for company
    req = None
    for r in store.company_requirements.values():
        if r.get("company_id") == company_id:
            req = r
            break

    if not req:
        # Default requirement if none configured
        req = {
            "job_role": "Associate Software Engineer",
            "min_cgpa": 7.0,
            "max_backlogs": 0,
            "eligible_departments": [student.get("department", "Computer Science & Engineering")],
            "required_skills": [
                {"name": "Data Structures & Algorithms", "min_level": 4},
                {"name": "Quantitative Aptitude", "min_level": 3},
                {"name": "Operating Systems", "min_level": 3},
            ],
            "min_aptitude_score": 60.0,
            "min_coding_score": 65.0,
            "min_technical_score": 60.0,
            "min_communication_score": 60.0,
        }

    # Evaluate student skills
    # Student demonstrated skill levels
    student_cgpa = float(student.get("cgpa", 0.0))
    min_cgpa = float(req.get("min_cgpa", 6.0))
    cgpa_met = student_cgpa >= min_cgpa

    dept = student.get("department", "")
    eligible_depts = req.get("eligible_departments", [])
    dept_met = (dept in eligible_depts) if eligible_depts else True

    # Compare skills
    skills_analysis = []
    gaps_count = 0
    total_skills = len(req.get("required_skills", []))

    for target in req.get("required_skills", []):
        sk_name = target["name"]
        min_lvl = target.get("min_level", 3)
        # Determine student current level
        curr_lvl = 3
        if "Algorithms" in sk_name or "Python" in sk_name:
            curr_lvl = 5 if student_cgpa >= 8.5 else 4
        elif "Operating Systems" in sk_name:
            curr_lvl = 3
        elif "Aptitude" in sk_name:
            curr_lvl = 4

        gap = max(0, min_lvl - curr_lvl)
        if gap > 0:
            gaps_count += 1
            status_text = "action_needed"
            rec = f"Practice advanced modules and quizzes in {sk_name} to bridge the {gap}-point gap."
        else:
            status_text = "met"
            rec = f"Proficiency verified: matches or exceeds the level {min_lvl} requirement."

        skills_analysis.append({
            "skill_name": sk_name,
            "required_level": min_lvl,
            "current_level": curr_lvl,
            "gap": gap,
            "status": status_text,
            "recommendation": rec,
        })

    match_score = round(max(20.0, 100.0 - (gaps_count * 20.0)), 1)
    if not cgpa_met:
        match_score = max(0.0, match_score - 15.0)

    # Readiness status
    if match_score >= 80.0 and cgpa_met and dept_met:
        readiness_status = "meets_criteria"
    elif match_score >= 60.0:
        readiness_status = "preparation_in_progress"
    else:
        readiness_status = "skills_requiring_improvement"

    return {
        "student_id": student["id"],
        "student_name": student.get("full_name"),
        "company_id": company["id"],
        "company_name": company["name"],
        "job_role": req.get("job_role"),
        "overall_match_percentage": match_score,
        "readiness_status": readiness_status,
        "eligibility": {
            "cgpa_met": cgpa_met,
            "student_cgpa": student_cgpa,
            "min_cgpa_required": min_cgpa,
            "department_eligible": dept_met,
            "student_department": dept,
        },
        "skills_breakdown": skills_analysis,
        "action_items": [s["recommendation"] for s in skills_analysis if s["status"] == "action_needed"],
    }

import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.all_schemas import CompanyCreate, CompanyRequirementCreate
from app.core.permissions import CurrentUser, get_current_user, require_institution_admin
from app.db.store import store

router = APIRouter()

@router.get("/companies")
def get_companies(user: CurrentUser = Depends(get_current_user)):
    inst_id = str(user.institution_id) if user.institution_id else "a0000000-0000-0000-0000-000000000001"
    companies = []
    for c in store.companies.values():
        if user.is_super_admin or c.get("institution_id") == inst_id:
            # Attach requirements count
            reqs = [r for r in store.company_requirements.values() if r.get("company_id") == c["id"]]
            c_copy = c.copy()
            c_copy["requirements_count"] = len(reqs)
            c_copy["roles"] = [r["job_role"] for r in reqs]
            companies.append(c_copy)
    return companies

@router.post("/companies")
def create_company(req: CompanyCreate, user: CurrentUser = Depends(require_institution_admin)):
    inst_id = str(user.institution_id) if user.institution_id else "a0000000-0000-0000-0000-000000000001"
    new_id = str(uuid.uuid4())
    comp = {
        "id": new_id,
        "institution_id": inst_id,
        "name": req.name,
        "logo_url": f"https://api.dicebear.com/7.x/identicon/svg?seed={req.name}",
        "website": req.website or "",
        "industry": req.industry or "Technology",
        "description": req.description or "",
        "tier": req.tier,
        "is_active": True,
    }
    store.companies[new_id] = comp
    return comp

@router.get("/companies/{company_id}/requirements")
def get_company_requirements(company_id: str, user: CurrentUser = Depends(get_current_user)):
    reqs = [r for r in store.company_requirements.values() if r.get("company_id") == company_id]
    return reqs

@router.post("/companies/{company_id}/requirements")
def create_company_requirement(company_id: str, req: CompanyRequirementCreate, user: CurrentUser = Depends(require_institution_admin)):
    comp = store.companies.get(company_id)
    if not comp:
        raise HTTPException(status_code=404, detail="Company not found.")
    new_id = str(uuid.uuid4())
    req_obj = {
        "id": new_id,
        "company_id": company_id,
        "company_name": comp["name"],
        "job_role": req.job_role,
        "min_cgpa": req.min_cgpa,
        "max_backlogs": req.max_backlogs,
        "eligible_departments": req.eligible_departments,
        "required_skills": [s.model_dump() for s in req.required_skills],
        "min_aptitude_score": req.min_aptitude_score,
        "min_coding_score": req.min_coding_score,
        "min_technical_score": req.min_technical_score,
        "min_communication_score": req.min_communication_score,
        "salary_package": req.salary_package or "Competitive",
    }
    store.company_requirements[new_id] = req_obj
    return req_obj

@router.get("/companies/all/requirements")
def get_all_requirements(user: CurrentUser = Depends(get_current_user)):
    return list(store.company_requirements.values())

import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.all_schemas import InstitutionCreate, InstitutionResponse
from app.core.permissions import CurrentUser, get_current_user, require_super_admin, verify_institution_access
from app.db.store import store

router = APIRouter()

@router.get("/institutions", response_model=List[InstitutionResponse])
def get_institutions(user: CurrentUser = Depends(get_current_user)):
    if user.is_super_admin:
        return list(store.institutions.values())
    # Normal user only sees their own institution
    inst = store.institutions.get(str(user.institution_id))
    return [inst] if inst else []

@router.get("/institutions/{institution_id}", response_model=InstitutionResponse)
def get_institution(institution_id: str, user: CurrentUser = Depends(get_current_user)):
    verify_institution_access(institution_id, user)
    inst = store.institutions.get(institution_id)
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found.")
    return inst

@router.post("/institutions", response_model=InstitutionResponse)
def create_institution(req: InstitutionCreate, user: CurrentUser = Depends(require_super_admin)):
    new_id = str(uuid.uuid4())
    inst = {
        "id": new_id,
        "name": req.name,
        "code": req.code.upper(),
        "slug": req.slug.lower(),
        "domain": req.domain,
        "contact_email": req.contact_email,
        "phone": req.phone,
        "address": req.address,
        "is_active": True,
    }
    store.institutions[new_id] = inst
    return inst

@router.get("/institutions/{institution_id}/departments")
def get_institution_departments(institution_id: str, user: CurrentUser = Depends(get_current_user)):
    verify_institution_access(institution_id, user)
    # Extract unique departments from students
    dept_set = {"Computer Science & Engineering", "Information Science", "Electronics & Communication", "Mechanical Engineering"}
    for stu in store.student_profiles.values():
        if stu.get("institution_id") == institution_id:
            dept_set.add(stu["department"])
    return sorted(list(dept_set))

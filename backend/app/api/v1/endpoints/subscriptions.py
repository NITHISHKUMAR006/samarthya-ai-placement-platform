from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.core.permissions import CurrentUser, get_current_user, require_super_admin
from app.db.store import store

router = APIRouter()

@router.get("/subscriptions")
def get_subscriptions(user: CurrentUser = Depends(get_current_user)):
    if user.is_super_admin:
        return list(store.subscriptions.values())
    inst_sub = store.subscriptions.get(str(user.institution_id))
    return [inst_sub] if inst_sub else []

@router.put("/subscriptions/{institution_id}")
def update_subscription(institution_id: str, plan_tier: str, max_students: int = 1000, user: CurrentUser = Depends(require_super_admin)):
    sub = store.subscriptions.get(institution_id)
    if not sub:
        inst = store.institutions.get(institution_id)
        sub = {
            "id": f"sub-{institution_id[:8]}",
            "institution_id": institution_id,
            "institution_name": inst["name"] if inst else "College",
            "plan_tier": plan_tier,
            "status": "active",
            "max_students": max_students,
            "max_faculty": 100,
            "ai_quota_monthly": 20000,
        }
    else:
        sub["plan_tier"] = plan_tier
        sub["max_students"] = max_students

    store.subscriptions[institution_id] = sub
    return sub

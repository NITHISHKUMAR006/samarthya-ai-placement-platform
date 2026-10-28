from typing import List, Dict, Any, Optional
from fastapi import Depends, HTTPException, status
from app.core.security import get_current_user_payload
from app.core.logging import logger


class CurrentUser:
    def __init__(self, payload: Dict[str, Any]):
        self.id = payload.get("id") or payload.get("sub")
        self.email = payload.get("email", "")
        self.full_name = payload.get("full_name") or payload.get("user_metadata", {}).get("full_name", "User")
        self.role = payload.get("role") or payload.get("user_metadata", {}).get("role", "student")
        self.institution_id = payload.get("institution_id") or payload.get("user_metadata", {}).get("institution_id")
        self.department = payload.get("department") or payload.get("user_metadata", {}).get("department")
        self.is_super_admin = payload.get("is_super_admin", False) or (self.role == "super_admin")


def get_current_user(payload: Dict[str, Any] = Depends(get_current_user_payload)) -> CurrentUser:
    return CurrentUser(payload)


def require_roles(allowed_roles: List[str]):
    def role_verifier(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        if user.is_super_admin:
            return user
        if user.role not in allowed_roles:
            logger.warning(f"Access forbidden: User {user.id} with role {user.role} attempted access to {allowed_roles}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation requires one of the following roles: {', '.join(allowed_roles)}",
            )
        return user
    return role_verifier


def require_institution_admin(user: CurrentUser = Depends(require_roles(["institution_admin", "super_admin"]))) -> CurrentUser:
    return user


def require_faculty_or_admin(user: CurrentUser = Depends(require_roles(["faculty", "institution_admin", "super_admin"]))) -> CurrentUser:
    return user


def require_super_admin(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if not user.is_super_admin and user.role != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation strictly restricted to platform super administrators.",
        )
    return user


def verify_institution_access(target_institution_id: str, user: CurrentUser) -> None:
    """Ensure user belongs to the institution or is super admin."""
    if user.is_super_admin:
        return
    if user.institution_id and str(user.institution_id) != str(target_institution_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cross-tenant access violation: You cannot access or modify another institution's data.",
        )

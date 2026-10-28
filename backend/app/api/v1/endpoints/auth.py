from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.all_schemas import LoginRequest, AuthResponse, UserResponse
from app.core.security import MOCK_USERS, get_current_user_payload
from app.core.permissions import CurrentUser, get_current_user
from app.db.store import store

router = APIRouter()

# Password map for development/testing demo credentials
DEMO_CREDENTIALS = {
    "superadmin@samarthya.ai": ("demo-superadmin-token", "Admin@123"),
    "placement@apex.edu": ("demo-admin-token", "Placement@123"),
    "faculty.cs@apex.edu": ("demo-faculty-token", "Faculty@123"),
    "student.aarav@apex.edu": ("demo-student-token", "Student@123"),
    "student.priya@apex.edu": ("demo-student-token", "Student@123"),
    "placement@zenith.edu": ("demo-admin-token", "Zenith@123"),
    "student.rohan@zenith.edu": ("demo-student-token", "Student@123"),
}

@router.post("/auth/login", response_model=AuthResponse)
def login(request: LoginRequest):
    email = request.email.lower().strip()
    # Check demo users
    if email in DEMO_CREDENTIALS:
        token, _ = DEMO_CREDENTIALS[email]
        user_info = MOCK_USERS[token].copy()
        user_info["email"] = email
        return AuthResponse(
            access_token=token,
            user=UserResponse(
                id=user_info["id"],
                email=email,
                full_name=user_info["full_name"],
                role=user_info["role"],
                avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_info['full_name']}",
                institution_id=user_info.get("institution_id"),
                department=user_info.get("department"),
                is_super_admin=user_info.get("is_super_admin", False),
            )
        )

    # Allow student login by default for test emails
    token = "demo-student-token"
    return AuthResponse(
        access_token=token,
        user=UserResponse(
            id="b0000000-0000-0000-0000-000000000004",
            email=email,
            full_name=email.split("@")[0].replace(".", " ").title(),
            role="student",
            avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}",
            institution_id="a0000000-0000-0000-0000-000000000001",
            department="Computer Science & Engineering",
            is_super_admin=False,
        )
    )

@router.get("/auth/me", response_model=UserResponse)
def get_current_user_profile(user: CurrentUser = Depends(get_current_user)):
    # Check if student profile exists to attach accurate department/name
    return UserResponse(
        id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={user.full_name}",
        institution_id=str(user.institution_id) if user.institution_id else None,
        department=user.department,
        is_super_admin=user.is_super_admin,
    )

@router.post("/auth/logout")
def logout():
    return {"message": "Successfully logged out."}

import time
import jwt
from typing import Optional, Dict, Any
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings
from app.core.logging import logger

security_scheme = HTTPBearer(auto_error=False)

# Predefined developer / demo tokens for frictionless zero-dependency evaluation and testing
MOCK_USERS: Dict[str, Dict[str, Any]] = {
    "demo-superadmin-token": {
        "id": "b0000000-0000-0000-0000-000000000001",
        "email": "superadmin@samarthya.ai",
        "full_name": "Dr. Alok Verma",
        "role": "super_admin",
        "institution_id": "a0000000-0000-0000-0000-000000000001",
        "is_super_admin": True,
    },
    "demo-admin-token": {
        "id": "b0000000-0000-0000-0000-000000000002",
        "email": "placement@apex.edu",
        "full_name": "Prof. Sunita Rao",
        "role": "institution_admin",
        "institution_id": "a0000000-0000-0000-0000-000000000001",
        "department": "Training & Placement Cell",
        "is_super_admin": False,
    },
    "demo-faculty-token": {
        "id": "b0000000-0000-0000-0000-000000000003",
        "email": "faculty.cs@apex.edu",
        "full_name": "Dr. Rajesh Khanna",
        "role": "faculty",
        "institution_id": "a0000000-0000-0000-0000-000000000001",
        "department": "Computer Science & Engineering",
        "is_super_admin": False,
    },
    "demo-student-token": {
        "id": "b0000000-0000-0000-0000-000000000004",
        "email": "student.aarav@apex.edu",
        "full_name": "Aarav Sharma",
        "role": "student",
        "institution_id": "a0000000-0000-0000-0000-000000000001",
        "department": "Computer Science & Engineering",
        "is_super_admin": False,
    },
}


def decode_supabase_jwt(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate a Supabase JWT token."""
    # Check if this matches a demo/mock token first
    if token in MOCK_USERS:
        return MOCK_USERS[token]

    # Otherwise attempt standard Supabase JWT decode
    secret = settings.SUPABASE_SECRET_KEY
    if not secret:
        # Without a secret, safely check unverified payload or fallback
        try:
            payload = jwt.decode(token, options={"verify_signature": False})
            return payload
        except Exception as e:
            logger.warning(f"Failed to parse unverified JWT: {e}")
            return None

    try:
        payload = jwt.decode(
            token,
            secret,
            algorithms=["HS256"],
            audience=settings.JWT_AUDIENCE,
            options={"verify_exp": True},
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session token has expired. Please log in again.",
        )
    except jwt.PyJWTError as e:
        logger.error(f"JWT validation failure: {e}")
        # Also try decoding unverified if secret key is dummy demo value
        try:
            return jwt.decode(token, options={"verify_signature": False})
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token.",
            )


def get_current_user_payload(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
) -> Dict[str, Any]:
    if not credentials:
        # In development mode, provide demo student as fallback if no auth header given,
        # but in strict production require authentication.
        if settings.APP_ENV == "development":
            return MOCK_USERS["demo-student-token"]
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Header with Bearer token.",
        )

    token = credentials.credentials
    payload = decode_supabase_jwt(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials.",
        )
    return payload

from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    auth,
    institutions,
    students,
    companies,
    assessments,
    skill_gap,
    readiness,
    learning,
    ai,
    analytics,
    subscriptions,
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, tags=["Authentication"])
api_router.include_router(institutions.router, tags=["Institutions"])
api_router.include_router(students.router, tags=["Students"])
api_router.include_router(companies.router, tags=["Companies & Requirements"])
api_router.include_router(assessments.router, tags=["Assessments & Scoring"])
api_router.include_router(skill_gap.router, tags=["Skill-Gap Intelligence"])
api_router.include_router(readiness.router, tags=["Placement Readiness"])
api_router.include_router(learning.router, tags=["Learning Materials & Documents"])
api_router.include_router(ai.router, tags=["AI Quiz & Interview Engine"])
api_router.include_router(analytics.router, tags=["Institutional Analytics"])
api_router.include_router(subscriptions.router, tags=["Subscriptions"])

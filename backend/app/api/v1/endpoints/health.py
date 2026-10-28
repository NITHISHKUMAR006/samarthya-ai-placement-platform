from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.config import settings
from app.ai.llm_service import llm_service
from app.ai.embedding_service import embedding_service

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "ports": {
            "frontend": 8010,
            "backend": settings.APP_PORT,
        },
        "ai": {
            "enabled": settings.AI_ENABLED,
            "llm_configured": llm_service.is_configured,
            "model_id": settings.OPENAI_MODEL_ID or "default",
            "vector_search_enabled": settings.ENABLE_VECTOR_SEARCH,
            "embedding_configured": embedding_service.is_configured,
        },
        "database": {
            "provider": "Supabase PostgreSQL",
            "status": "connected",
        }
    }

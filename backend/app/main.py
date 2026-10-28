from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

from app.core.config import settings
from app.core.logging import logger
from app.api.v1.api import api_router
from app.ai.llm_service import llm_service
from app.ai.embedding_service import embedding_service

app = FastAPI(
    title="SAMARTHYA AI — Adaptive Learning and Placement Readiness Platform",
    description="Full-stack enterprise backend powering multi-tenant college workspaces, student assessments, AI document analysis, and placement readiness intelligence.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS Configuration
origins = settings.cors_origins
logger.info(f"Configuring CORS for origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):(8010|5173|3000)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_PREFIX)

# Root-level health check endpoint for Docker and monitoring
@app.get("/health", tags=["Health"])
def root_health():
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

@app.get("/", tags=["Root"])
def root_info():
    return {
        "name": "SAMARTHYA AI API",
        "tagline": "Every College Is Different. Every Student Deserves a Personalized Path.",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "api_v1": settings.API_PREFIX,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.APP_HOST, port=settings.APP_PORT, reload=True)

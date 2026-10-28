import os
from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator


def find_env_file() -> str:
    current = Path(__file__).resolve().parent
    for _ in range(4):
        candidate = current / "config.env"
        if candidate.exists():
            return str(candidate)
        candidate_parent = current.parent
        if candidate_parent == current:
            break
        current = candidate_parent
    return "config.env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=find_env_file(),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Core Application
    APP_NAME: str = "SAMARTHYA_AI"
    APP_ENV: str = "development"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 5190
    LOG_LEVEL: str = "INFO"

    # URLs & CORS
    FRONTEND_URL: str = "http://localhost:8010"
    API_BASE_URL: str = "http://localhost:5190"
    API_PREFIX: str = "/api/v1"
    CORS_ALLOWED_ORIGINS: str = "http://localhost:8010"

    # Supabase Configuration
    SUPABASE_URL: str = "https://your-project.supabase.co"
    SUPABASE_PUBLISHABLE_KEY: str = ""
    SUPABASE_SECRET_KEY: str = ""

    # Supabase PostgreSQL
    DATABASE_URL: Optional[str] = None

    # Supabase Storage Buckets
    SUPABASE_LEARNING_BUCKET: str = "learning-materials"
    SUPABASE_PROFILE_BUCKET: str = "profile-avatars"
    SUPABASE_STUDENT_DOCUMENTS_BUCKET: str = "student-documents"
    MAX_UPLOAD_SIZE_MB: int = 20

    # OpenAI-Compatible LLM Configuration
    OPENAI_BASE_URL: str = ""
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL_ID: str = ""
    OPENAI_TIMEOUT_SECONDS: int = 60
    OPENAI_MAX_RETRIES: int = 2

    # AI Feature Flags
    AI_ENABLED: bool = False
    ENABLE_AI_QUIZZES: bool = True
    ENABLE_RAG: bool = True
    ENABLE_VECTOR_SEARCH: bool = True

    # Embedding Configuration
    EMBEDDING_BASE_URL: str = ""
    EMBEDDING_API_KEY: str = ""
    EMBEDDING_MODEL_ID: str = ""
    EMBEDDING_DIMENSIONS: Optional[int] = None

    # Assessment defaults
    DEFAULT_ASSESSMENT_DURATION_MINUTES: int = 30
    MAX_ASSESSMENT_ATTEMPTS: int = 3

    # Security
    JWT_AUDIENCE: str = "authenticated"
    RATE_LIMIT_ENABLED: bool = True

    # Document Processing
    DOCUMENT_PROCESSING_WORKERS: int = 2

    # Optional Email Settings
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: Optional[str] = None

    @property
    def cors_origins(self) -> List[str]:
        if not self.CORS_ALLOWED_ORIGINS:
            return [self.FRONTEND_URL]
        return [origin.strip() for origin in self.CORS_ALLOWED_ORIGINS.split(",") if origin.strip()]


settings = Settings()

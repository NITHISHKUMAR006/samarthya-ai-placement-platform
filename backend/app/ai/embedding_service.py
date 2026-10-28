import httpx
from typing import List, Optional
from app.core.config import settings
from app.core.logging import logger


class EmbeddingService:
    def __init__(self):
        self.base_url = settings.EMBEDDING_BASE_URL.rstrip("/") if settings.EMBEDDING_BASE_URL else (
            settings.OPENAI_BASE_URL.rstrip("/") if settings.OPENAI_BASE_URL else "https://api.openai.com/v1"
        )
        self.api_key = settings.EMBEDDING_API_KEY or settings.OPENAI_API_KEY
        self.model_id = settings.EMBEDDING_MODEL_ID or "text-embedding-3-small"
        self.dimensions = settings.EMBEDDING_DIMENSIONS or 1536
        self.enabled = settings.ENABLE_VECTOR_SEARCH

    @property
    def is_configured(self) -> bool:
        if "localhost" in self.base_url or "127.0.0.1" in self.base_url:
            return True
        return bool(self.api_key)

    async def generate_embedding(self, text: str) -> Optional[List[float]]:
        if not self.enabled or not self.is_configured:
            return None

        endpoint = f"{self.base_url}/embeddings"
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        payload = {
            "model": self.model_id,
            "input": text[:8000],
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(endpoint, json=payload, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    vector = data["data"][0]["embedding"]
                    return vector
                else:
                    logger.warning(f"Embedding API responded with status {resp.status_code}: {resp.text[:200]}")
                    return None
        except Exception as e:
            logger.error(f"Embedding generation error: {e}")
            return None


embedding_service = EmbeddingService()

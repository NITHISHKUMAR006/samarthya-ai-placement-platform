import json
import re
import httpx
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.core.logging import logger


class LLMService:
    def __init__(self):
        self.base_url = settings.OPENAI_BASE_URL.rstrip("/") if settings.OPENAI_BASE_URL else "https://api.openai.com/v1"
        self.api_key = settings.OPENAI_API_KEY
        self.model_id = settings.OPENAI_MODEL_ID or "gpt-4o-mini"
        self.timeout = settings.OPENAI_TIMEOUT_SECONDS
        self.max_retries = settings.OPENAI_MAX_RETRIES
        self.enabled = settings.AI_ENABLED

    @property
    def is_configured(self) -> bool:
        # If using local ollama or lmstudio, api_key may be blank, but base_url is set.
        # If using OpenAI/OpenRouter/Groq, api_key is required.
        if "localhost" in self.base_url or "127.0.0.1" in self.base_url:
            return True
        return bool(self.api_key)

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        response_format: Optional[Dict[str, str]] = None,
    ) -> str:
        """Execute an asynchronous chat completion with bounded retries."""
        if not self.enabled and not self.is_configured:
            logger.info("AI provider is not enabled or not configured. Using deterministic fallback response.")
            return self._fallback_chat_reply(messages)

        endpoint = f"{self.base_url}/chat/completions"
        headers = {
            "Content-Type": "application/json",
        }
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        payload: Dict[str, Any] = {
            "model": self.model_id,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if response_format:
            payload["response_format"] = response_format

        for attempt in range(self.max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.post(endpoint, json=payload, headers=headers)
                    if response.status_code == 200:
                        data = response.json()
                        return data["choices"][0]["message"]["content"]
                    else:
                        logger.warning(
                            f"LLM API error (attempt {attempt + 1}/{self.max_retries + 1}) "
                            f"status={response.status_code}: {response.text[:200]}"
                        )
            except Exception as e:
                logger.error(f"LLM connection error (attempt {attempt + 1}): {e}")
                if attempt == self.max_retries:
                    break

        # If live remote LLM fails, fall back gracefully
        return self._fallback_chat_reply(messages)

    async def generate_json(
        self,
        prompt: str,
        system_prompt: str = "You are an AI assessment engine that outputs strict JSON.",
    ) -> Any:
        """Request structured JSON and parse the response safely."""
        messages = [
            {"role": "system", "content": f"{system_prompt}\nIMPORTANT: Respond with valid raw JSON only. Do not wrap in markdown quotes or extra conversational text."},
            {"role": "user", "content": prompt},
        ]
        raw_text = await self.chat_completion(
            messages,
            temperature=0.3,
            max_tokens=2500,
            response_format={"type": "json_object"} if "openai" in self.base_url or not self.base_url else None
        )

        try:
            # Strip markdown code fences if present
            cleaned = re.sub(r"^```(?:json)?\s*", "", raw_text.strip(), flags=re.MULTILINE)
            cleaned = re.sub(r"\s*```$", "", cleaned.strip(), flags=re.MULTILINE)
            return json.loads(cleaned)
        except Exception as e:
            logger.warning(f"Failed to parse LLM JSON response: {e}. Raw: {raw_text[:200]}")
            # Try finding the first JSON array or object
            match = re.search(r"(\[.*\]|\{.*\})", raw_text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(1))
                except Exception:
                    pass
            return None

    def _fallback_chat_reply(self, messages: List[Dict[str, str]]) -> str:
        last_msg = messages[-1]["content"] if messages else ""
        return (
            "SAMARTHYA AI Preparation Assistant: Focus on core algorithms (graphs, DP), "
            "system synchronization, and quantitative problem solving. Review your targeted "
            "skill gaps in the dashboard to optimize your placement readiness."
        )


llm_service = LLMService()

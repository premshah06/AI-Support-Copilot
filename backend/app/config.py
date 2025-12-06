from functools import lru_cache
from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AI Incident Support Copilot"
    database_url: str = Field(
        default=f"sqlite:///{Path(__file__).resolve().parent / 'app.db'}"
    )
    
    # JWT settings
    jwt_secret_key: str = Field(default="your-secret-key-change-in-production-min-32-chars")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours
    
    # AI Provider settings - supports "openai" or "gemini"
    ai_provider: str = "gemini"
    rag_enabled: bool = True
    
    # OpenAI settings
    openai_api_key: str | None = None
    embeddings_model: str = "text-embedding-3-small"
    llm_model: str = "gpt-4o-mini"
    
    # Gemini settings
    gemini_api_key: str | None = None
    gemini_model: str = "gemini-1.5-flash"

    class Config:
        env_file = Path(__file__).resolve().parents[2] / ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[arg-type]

from pydantic_settings import BaseSettings
from typing import Optional, List

class Settings(BaseSettings):
    PROJECT_NAME: str = "HSK Mastery 2026 - Ultra Performance"
    API_V1_STR: str = "/api/v1"

    # Database — override in .env for production
    DATABASE_URL: str = "postgresql+asyncpg://hsk_user:hsk_password_2026@127.0.0.1:5432/hsk_database"
    SYNC_DATABASE_URL: str = "postgresql://hsk_user:hsk_password_2026@127.0.0.1:5432/hsk_database"

    # Redis
    REDIS_URL: str = "redis://127.0.0.1:6380/0"

    # Performance
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 10

    # Auth — MUST be set via .env in production
    JWT_SECRET_KEY: str = "CHANGE_THIS_IN_PRODUCTION_USE_ENV_VAR"
    GOOGLE_CLIENT_ID: str = ""
    FIRST_ADMIN_EMAIL: str = ""

    # CORS — comma-separated list of allowed origins
    # Example in .env: ALLOWED_ORIGINS=https://hskmastery.app,https://www.hskmastery.app
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

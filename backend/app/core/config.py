from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "HSK Mastery 2026 - Ultra Performance"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://hsk_user:hsk_password_2026@127.0.0.1:5432/hsk_database"
    SYNC_DATABASE_URL: str = "postgresql://hsk_user:hsk_password_2026@127.0.0.1:5432/hsk_database"

    # Redis
    REDIS_URL: str = "redis://127.0.0.1:6380/0"

    # Performance
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 10

    # Auth — set these via environment variables or .env file
    JWT_SECRET_KEY: str = "CHANGE_THIS_IN_PRODUCTION_USE_ENV_VAR"
    GOOGLE_CLIENT_ID: str = ""
    # If set, the first user matching this email gets admin; otherwise first-registered user becomes admin
    FIRST_ADMIN_EMAIL: str = ""

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

from pathlib import Path
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_PATH)


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://supplymind:supplymind@localhost:5432/supplymind_db"

    # JWT
    SECRET_KEY: str = "supplymind-dev-secret-key-change-in-production-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # PayPal
    PAYPAL_CLIENT_ID: str = "sb"
    PAYPAL_CLIENT_SECRET: str = "sb"
    PAYPAL_BASE_URL: str = "https://api-m.sandbox.paypal.com"
    PAYPAL_SANDBOX_MODE: bool = True

    # App
    APP_ENV: str = "development"
    FRONTEND_URL: str = "http://localhost:3000"
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    class Config:
        env_file = str(ENV_PATH)


settings = Settings()


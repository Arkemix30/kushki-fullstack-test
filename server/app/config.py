"""Application configuration loaded from environment variables."""

import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    """Base configuration."""

    IMAGGA_API_KEY: str = os.getenv("IMAGGA_API_KEY", "")
    IMAGGA_API_SECRET: str = os.getenv("IMAGGA_API_SECRET", "")

    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5 MB
    ALLOWED_MIME_TYPES: set[str] = {"image/jpeg", "image/png"}

    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")


class TestConfig(Config):
    """Testing configuration."""

    TESTING = True
    IMAGGA_API_KEY = "test-key"
    IMAGGA_API_SECRET = "test-secret"

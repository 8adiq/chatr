import os
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    app_name: str = 'chatr'
    secret_key: str = Field(min_length=32)
    database_url: str
    cors_allowed_origins: str = "http://localhost:3000"
    access_token_expires_minutes: int = Field(30, ge=1, le=1440)
    refresh_token_expires_days: int = 7
    environment: str = "local"

    class Config:
        env_file = get_env_file()

    @classmethod
    def get_env_file(cls):
        """Use single environment file for all local development"""
        # Check if we're in Docker
        if os.path.exists("/.dockerenv"):
            return None  # Use environment variables passed to container
        
        # For local development, use the single config file
        return "env.config"


settings = Settings()
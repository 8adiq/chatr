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
    smtp_host: str
    smtp_port: int
    smtp_username: str
    smtp_password: str
    smtp_admin_email: str
    smtp_default_from_email:str
    environment: str = "local"

    class Config:
        # env_file = ".env.config"
        # env_file = ".env.config" if os.path.exists(".env.config") else None
        env_file_encoding = "utf-8"



settings = Settings()
import os
from pydantic_settings import BaseSettings, SettingsConfigDict
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
    smtp_default_from_email: str
    brevo_api_key: str
    environment: str = "local"

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=False,
        extra='ignore'
    )

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls,
        init_settings,
        env_settings,
        dotenv_settings,
        file_secret_settings,
    ):
        # Prioritize actual environment variables over .env file
        return (
            init_settings,
            env_settings,      # os.environ - highest priority
            dotenv_settings,   # .env file - fallback
            file_secret_settings,
        )


# Don't initialize here
settings = None

def get_settings():
    global settings
    if settings is None:
        settings = Settings()
    return settings

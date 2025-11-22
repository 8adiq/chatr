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
# from pydantic_settings import BaseSettings
# from pydantic import Field
# import os

# class Settings(BaseSettings):
#     secret_key: str = Field(..., env="SECRET_KEY")
#     database_url: str = Field(..., env="DATABASE_URL")

#     smtp_host: str = Field(..., env="SMTP_HOST")
#     smtp_port: int = Field(..., env="SMTP_PORT")
#     smtp_username: str = Field(..., env="SMTP_USERNAME")
#     smtp_password: str = Field(..., env="SMTP_PASSWORD")
#     smtp_admin_email: str = Field(..., env="SMTP_ADMIN_EMAIL")
#     smtp_default_from_email: str = Field(..., env="SMTP_DEFAULT_FROM_EMAIL")

#     brevo_api_key: str = Field(..., env="BREVO_API_KEY")

#     class Config:
#         case_sensitive = True

#         @classmethod
#         def customise_sources(cls, init_settings, env_settings, file_secret_settings):
#             # Force reading from os.environ first
#             return (
#                 lambda _: os.environ,  # <-- use os.environ explicitly
#                 init_settings,
#                 file_secret_settings,
#             )

# # Singleton to prevent multiple initializations
# _settings: Settings | None = None

# def get_settings() -> Settings:
#     global _settings
#     if _settings is None:
#         _settings = Settings()
#         # debug prints
#         print("SECRET_KEY:", _settings.secret_key)
#         print("SMTP_HOST:", _settings.smtp_host)
#         print("SMTP_PORT:", _settings.smtp_port)
#         print("BREVO_API_KEY:", _settings.brevo_api_key)
#     return _settings

import os
from pydantic_settings import BaseSettings
from pydantic import Field

# class Settings(BaseSettings):
#     app_name: str = 'chatr'
#     secret_key: str = Field(min_length=32)
#     database_url: str
#     cors_allowed_origins: str = "http://localhost:3000"
#     access_token_expires_minutes: int = Field(30, ge=1, le=1440)
#     refresh_token_expires_days: int = 7
#     smtp_host: str
#     smtp_port: int
#     smtp_username: str
#     smtp_password: str
#     smtp_admin_email: str
#     smtp_default_from_email:str
#     brevo_api_key: str
#     environment: str = "local"

#     class Config:

#         # In a Docker environment, variables are passed directly, so we don't load a .env file.
#         env_file = '.env'


# # Don't initialize here
# settings = None

# def get_settings():
#     global settings
#     if settings is None:
#         settings = Settings()
#     return settings

import os
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    # App settings
    # app_name: str = "chatr"
    # secret_key: str = Field(..., min_length=32)
    # database_url: str
    # cors_allowed_origins: str = "http://localhost:3000"
    # access_token_expires_minutes: int = Field(30, ge=1, le=1440)
    # refresh_token_expires_days: int = 7
    # environment: str = "local"

    # # SMTP / Email settings
    # smtp_host: str
    # smtp_port: int
    # smtp_username: str
    # smtp_password: str
    # smtp_admin_email: str
    # smtp_default_from_email: str

    # # Brevo API key
    # brevo_api_key: str = Field(..., env="BREVO_API_KEY")

    # App settings
    app_name: str = "chatr"
    secret_key: str = Field(..., min_length=32, env="SECRET_KEY")
    database_url: str = Field(..., env="DATABASE_URL")
    cors_allowed_origins: str = Field("http://localhost:3000", env="CORS_ALLOWED_ORIGINS")
    access_token_expires_minutes: int = Field(30, ge=1, le=1440, env="ACCESS_TOKEN_EXPIRES_MINUTES")
    refresh_token_expires_days: int = Field(7, env="REFRESH_TOKEN_EXPIRES_DAYS")
    environment: str = Field("local", env="ENVIRONMENT")

    # SMTP / Email settings
    smtp_host: str = Field(..., env="SMTP_HOST")
    smtp_port: int = Field(..., env="SMTP_PORT")
    smtp_username: str = Field(..., env="SMTP_USERNAME")
    smtp_password: str = Field(..., env="SMTP_PASSWORD")
    smtp_admin_email: str = Field(..., env="SMTP_ADMIN_EMAIL")
    smtp_default_from_email: str = Field(..., env="SMTP_DEFAULT_FROM_EMAIL")

    # Brevo API key
    brevo_api_key: str = Field(..., env="BREVO_API_KEY")


    class Config:
        env_file = None        # Local dev .env
        env_file_encoding = "utf-8"
        case_sensitive = True    # Ensure variable names match exactly

# Singleton pattern for app-wide settings
_settings = None

def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
        # DEBUG: Log to verify
        print("Loaded BREVO_API_KEY:", _settings.brevo_api_key)
        print("From OS getenv:", os.getenv("BREVO_API_KEY"))
    return _settings

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "E-Ticaret Güven Analizi API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    GEMINI_API_KEY: str = ""

    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    SCRAPING_TIMEOUT: int = 15

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    app_name: str = "HinglishFlow"
    version: str = "1.0.0"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000

    database_url: str = "sqlite:///./hinglishflow.db"
    model_name: str = "ai4bharat/IndicTrans2"
    model_cache_dir: str = "./model_cache"
    max_input_length: int = 500
    allowed_origins: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://localhost:8000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

@lru_cache()
def get_settings() -> Settings:
    return Settings()

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ai_model_provider: str = "openrouter"
    ai_model_name: str = "qwen/qwen2.5-72b-instruct:free"
    openrouter_api_key: str = os.getenv("OPENROUTER_API_KEY", "")
    
    class Config:
        env_file = ".env"

settings = Settings()

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ai_model_provider: str = "openrouter"
    ai_model_name: str = "qwen/qwen3-235b-a22b:free"
    openrouter_api_key: str

    class Config:
        env_file = ".env"

settings = Settings()

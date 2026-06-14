from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SPRING_BOOT_URL: str = "http://localhost:8001"
    GATEWAY_PORT: int = 8000
    TIMEOUT_SECONDS: int = 10
    NODE_SERVICE_URL: str = "http://localhost:5001"

    class Config:
        env_file = ".env"

settings = Settings()

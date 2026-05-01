from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://user:password@localhost:5432/pi3db"
    secret_key: str = "dev-secret-key"
    environment: str = "development"
    app_name: str = "Pi3 - Gestão Financeira"

    class Config:
        env_file = ".env"


settings = Settings()

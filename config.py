from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional  

class Settings(BaseSettings):
    database_url: Optional[str] = None 

    db_user: Optional[str] = None
    db_pass: Optional[str] = None
    db_name: Optional[str] = None

    db_host: str = "localhost"
    db_port: int = 5432
    flask_port: int = 3667
    secret_key: str
    weather_api_url: str

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

settings = Settings()
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_user: str
    db_pass: str
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str

    flask_port: int = 3667
    secret_key: str
    weather_api_url: str

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()

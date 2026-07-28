from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Homework AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Supabase / PostgreSQL Connection String
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/postgres"
    
    # Gemini Configuration
    GEMINI_API_KEY: str = "dummy_gemini_api_key"
    
    # Supabase Credentials (for Storage REST API / Client)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()

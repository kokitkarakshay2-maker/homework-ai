from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.config import settings
from app.database.database import engine, Base
from app.api.routes import homework, history
from app.middleware.error_handler import global_exception_handler, validation_exception_handler
from app.middleware.rate_limit import SimpleRateLimitMiddleware
from fastapi.exceptions import RequestValidationError
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)

# Create tables (In a real scenario, use Alembic strictly)
# Since we have Alembic, we might skip this, but for dev it helps if run without alembic
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate Limiter
app.add_middleware(SimpleRateLimitMiddleware, max_requests=60, window=60)

# Exception Handlers
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# Routers
app.include_router(homework.router, prefix=settings.API_V1_STR)
app.include_router(history.router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": settings.VERSION}

import os
from google import genai

@app.get(f"{settings.API_V1_STR}/debug/gemini")
async def debug_gemini():
    api_key = settings.GEMINI_API_KEY
    masked_key = api_key[:8] + "..." if api_key else "None"
    status = "Loaded" if api_key else "Empty"
    
    print("================ DEBUG GEMINI ================")
    print(f"GEMINI_API_KEY: {masked_key}")
    print(f"Status: {status}")
    print(f"Reading from: settings.GEMINI_API_KEY")
    
    try:
        print("Initializing genai.Client(api_key=...)")
        client = genai.Client(api_key=api_key)
        
        print("Sending 'Hello' to gemini-1.5-flash...")
        response = await client.aio.models.generate_content(
            model="gemini-1.5-flash",
            contents="Hello"
        )
        print("Success!")
        return {"status": "ok", "response": response.text}
    except Exception as e:
        import traceback
        print(f"Exception type: {type(e)}")
        print(f"Exception message: {str(e)}")
        traceback.print_exc()
        return {"status": "error", "type": str(type(e)), "message": str(e)}

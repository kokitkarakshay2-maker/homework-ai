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

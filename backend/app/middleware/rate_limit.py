from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
import time

# A very basic in-memory rate limiter for demonstration.
# In a production environment with multiple workers, Redis should be used.

class SimpleRateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 10, window: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window = window
        self.ip_records = {}

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        
        # Cleanup old records
        current_time = time.time()
        self.ip_records[client_ip] = [
            t for t in self.ip_records.get(client_ip, [])
            if current_time - t < self.window
        ]
        
        if len(self.ip_records[client_ip]) >= self.max_requests:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again later."}
            )
            
        self.ip_records[client_ip].append(current_time)
        return await call_next(request)

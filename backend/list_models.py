import os
from google import genai
from app.database.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)
print("Available models:")
for m in client.models.list():
    if "gemini" in m.name:
        print(f"- {m.name} (generateContent supported: {'generateContent' in m.supported_generation_methods})")

import time
from google import genai
from google.genai import types
from fastapi import HTTPException
from app.database.config import settings
from app.schemas.homework import HomeworkResponseSchema
from app.utils.prompts import SYSTEM_PROMPT
from app.utils.logger import logger
from pydantic import ValidationError

class GeminiService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = "gemini-2.5-flash"
        
    async def analyze_image(self, base64_image: bytes, mime_type: str) -> dict:
        start_time = time.time()
        logger.info("Sending image to Gemini Vision...")
        
        max_retries = 2
        for attempt in range(max_retries):
            try:
                response = await self.client.aio.models.generate_content(
                    model=self.model_name,
                    contents=[
                        types.Part.from_bytes(
                            data=base64_image,
                            mime_type=mime_type
                        )
                    ],
                    config=types.GenerateContentConfig(
                        system_instruction=SYSTEM_PROMPT,
                        response_mime_type="application/json",
                        response_schema=HomeworkResponseSchema,
                        temperature=0.2, # Low temperature for more deterministic accuracy
                    )
                )
                
                latency = time.time() - start_time
                logger.info(f"Gemini processing complete in {latency:.2f}s (Attempt {attempt+1})")
                
                return response.text
                
            except Exception as e:
                logger.error(f"Gemini API Error on attempt {attempt+1}: {str(e)}")
                if attempt == max_retries - 1:
                    raise HTTPException(status_code=502, detail="Error communicating with AI service after retries.")
                logger.info("Retrying Gemini request...")
                time.sleep(2)

import httpx
import uuid
import base64
from typing import Optional
from app.database.config import settings
from app.utils.logger import logger

class SupabaseStorageService:
    @staticmethod
    async def upload_thumbnail(base64_data: str, content_type: str = "image/jpeg") -> Optional[str]:
        """
        Uploads a base64 encoded image to Supabase Storage in the 'thumbnails' bucket.
        Returns the public URL of the uploaded image, or None if the upload fails.
        """
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            logger.warning("Supabase credentials not configured. Skipping thumbnail upload.")
            return None

        # Clean the base64 string if it contains a data URI scheme
        if "," in base64_data:
            base64_data = base64_data.split(",")[1]

        try:
            image_bytes = base64.b64decode(base64_data)
            filename = f"{uuid.uuid4()}.jpg"
            bucket = "thumbnails"
            
            # Supabase Storage REST API endpoint
            url = f"{settings.SUPABASE_URL}/storage/v1/object/{bucket}/{filename}"
            
            headers = {
                "Authorization": f"Bearer {settings.SUPABASE_KEY}",
                "Content-Type": content_type
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(url, content=image_bytes, headers=headers, timeout=15.0)
                
                if response.status_code in [200, 201]:
                    # Construct public URL
                    public_url = f"{settings.SUPABASE_URL}/storage/v1/object/public/{bucket}/{filename}"
                    logger.info(f"Successfully uploaded thumbnail to {public_url}")
                    return public_url
                else:
                    logger.error(f"Failed to upload to Supabase Storage: {response.status_code} {response.text}")
                    return None
                    
        except Exception as e:
            logger.error(f"Exception during Supabase thumbnail upload: {str(e)}")
            return None

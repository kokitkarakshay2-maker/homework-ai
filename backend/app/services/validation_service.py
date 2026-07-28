import magic
from fastapi import UploadFile, HTTPException, status
from app.utils.constants import ALLOWED_MIME_TYPES, MAX_FILE_SIZE
from app.utils.logger import logger

class ValidationService:
    @staticmethod
    async def validate_image(file: UploadFile) -> str:
        # Check size without loading entire file in memory
        file.file.seek(0, 2) # Go to end
        size = file.file.tell()
        file.file.seek(0) # Reset to beginning
        
        if size > MAX_FILE_SIZE:
            logger.warning(f"File {file.filename} exceeded maximum size: {size} bytes")
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB."
            )
            
        # Check mime type using magic
        header = await file.read(2048)
        file.file.seek(0)
        
        try:
            mime_type = magic.from_buffer(header, mime=True)
        except Exception as e:
            logger.error(f"Error reading magic bytes: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or corrupted file."
            )
            
        if mime_type not in ALLOWED_MIME_TYPES:
            logger.warning(f"Invalid MIME type for {file.filename}: {mime_type}")
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=f"Unsupported media type: {mime_type}. Allowed types are: {', '.join(ALLOWED_MIME_TYPES.keys())}"
            )
            
        return mime_type

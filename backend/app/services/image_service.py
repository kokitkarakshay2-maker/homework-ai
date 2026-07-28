from io import BytesIO
from PIL import Image, ImageOps, ImageEnhance
import base64
from fastapi import UploadFile
from app.utils.constants import MAX_IMAGE_DIMENSION
from app.utils.logger import logger

class ImageService:
    @staticmethod
    async def process_and_optimize(file: UploadFile) -> tuple[str, str]:
        """
        Reads the upload, auto-rotates via EXIF, resizes if too large,
        and returns (optimized_base64, thumbnail_base64)
        """
        try:
            image_bytes = await file.read()
            img = Image.open(BytesIO(image_bytes))
            
            # Auto-rotate based on EXIF
            img = ImageOps.exif_transpose(img)
            
            # RGB conversion if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')
                
            # Enhance brightness slightly if image is dark, and improve contrast
            # Simple heuristic: we just slightly boost both for better legibility
            enhancer = ImageEnhance.Brightness(img)
            img = enhancer.enhance(1.1)
            
            contrast_enhancer = ImageEnhance.Contrast(img)
            img = contrast_enhancer.enhance(1.15)
                
            # Resize if it exceeds max dimension
            if max(img.width, img.height) > MAX_IMAGE_DIMENSION:
                img.thumbnail((MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION), Image.Resampling.LANCZOS)
                
            # Generate optimized full image base64
            optimized_buffer = BytesIO()
            img.save(optimized_buffer, format="JPEG", quality=85)
            optimized_b64 = base64.b64encode(optimized_buffer.getvalue()).decode("utf-8")
            
            # Generate thumbnail base64
            thumb_img = img.copy()
            thumb_img.thumbnail((256, 256), Image.Resampling.LANCZOS)
            thumb_buffer = BytesIO()
            thumb_img.save(thumb_buffer, format="JPEG", quality=70)
            thumbnail_b64 = base64.b64encode(thumb_buffer.getvalue()).decode("utf-8")
            
            return optimized_b64, thumbnail_b64
            
        except Exception as e:
            logger.error(f"Failed to process image: {str(e)}")
            raise ValueError(f"Failed to process image: {str(e)}")

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, Header, BackgroundTasks
from sqlalchemy.orm import Session
import json
import time
import base64
from datetime import datetime
import uuid
from typing import Optional

from app.database.database import get_db, SessionLocal
from app.models.homework import HomeworkHistory
from app.services.validation_service import ValidationService
from app.services.image_service import ImageService
from app.services.gemini_service import GeminiService
from app.services.history_service import HistoryService
from app.services.supabase_storage_service import SupabaseStorageService
from app.schemas.history import HistoryResponseSchema
from app.utils.logger import logger

router = APIRouter(prefix="/homework", tags=["Homework"])
gemini_service = GeminiService()

async def upload_thumbnail_bg(history_id: str, thumbnail_b64: str):
    url = await SupabaseStorageService.upload_thumbnail(thumbnail_b64, content_type="image/jpeg")
    if url:
        db = SessionLocal()
        try:
            history = db.query(HomeworkHistory).filter(HomeworkHistory.id == history_id).first()
            if history:
                history.thumbnail_url = url
                db.commit()
        except Exception as e:
            logger.error(f"Failed to update thumbnail in bg: {e}")
        finally:
            db.close()

@router.post("/analyze", response_model=HistoryResponseSchema)
async def analyze_homework(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    x_device_id: Optional[str] = Header(None, description="Unique Device ID"),
    x_workspace_id: Optional[str] = Header(None, description="Workspace ID"),
    db: Session = Depends(get_db)
):
    total_start = time.time()
    def get_ts():
        return f"[{int((time.time() - total_start) * 1000)}ms]"

    logger.info(f"{get_ts()} Request received for file: {file.filename}, Device: {x_device_id}")
    telemetry = {}
    
    device_id = x_device_id or "anonymous_device"
    
    # 1. Validate
    mime_type = await ValidationService.validate_image(file)
    
    # 2. Optimize & prepare base64
    try:
        t0 = time.time()
        logger.info(f"{get_ts()} Image preprocessing started")
        optimized_b64, thumbnail_b64 = await ImageService.process_and_optimize(file)
        logger.info(f"{get_ts()} Image preprocessing completed")
        telemetry["preprocessing"] = round((time.time() - t0) * 1000)
    except Exception as e:
        raise HTTPException(status_code=422, detail="Failed to process image.")
        
    # 3. Upload thumbnail to Supabase Storage in background
    # We delay the actual upload to background_tasks later, using thumbnail_url = None for now
    thumbnail_url = None
    telemetry["storage_upload"] = 0
        
    # 4. Analyze with Gemini
    try:
        t0 = time.time()
        raw_b64_bytes = base64.b64decode(optimized_b64)
        logger.info(f"{get_ts()} Gemini request started")
        raw_ai_text = await gemini_service.analyze_image(raw_b64_bytes, mime_type)
        logger.info(f"{get_ts()} Gemini response received")
        telemetry["gemini"] = round((time.time() - t0) * 1000)
        
        t0 = time.time()
        processed_response = json.loads(raw_ai_text)
        logger.info(f"{get_ts()} JSON validation completed")
        telemetry["json_parsing"] = round((time.time() - t0) * 1000)
    except Exception as e:
        logger.error(f"AI Analysis Failed: {str(e)}")
        raise HTTPException(status_code=502, detail="AI analysis failed.")
        
    # 5. Save to History - Decoupled DB Saving
    t0 = time.time()
    logger.info(f"{get_ts()} Database save started")
    history_service = HistoryService(db)
    
    # Try to save to DB. If it fails, it returns None.
    print(f"Inserted workspace_id: {x_workspace_id}")
    history_record = history_service.create_history(
        device_id=device_id,
        filename=file.filename,
        thumbnail_url=thumbnail_url,
        processed_response=processed_response,
        time_ms=int((time.time() - total_start) * 1000),
        workspace_id=x_workspace_id
    )
    
    telemetry["db_save"] = round((time.time() - t0) * 1000)
    telemetry["total"] = round((time.time() - total_start) * 1000)
    
    # Return successfully regardless of DB insertion success
    if history_record:
        # Schedule the background upload now that we have history_id
        background_tasks.add_task(upload_thumbnail_bg, history_record.id, thumbnail_b64)
        logger.info(f"{get_ts()} Database save completed successfully")
        history_record.telemetry = telemetry
        return history_record
    else:
        logger.warning(f"{get_ts()} Database save failed. Returning Gemini response directly to unblock user.")
        # Construct mock response so user isn't blocked
        mock_record = HistoryResponseSchema(
            id=str(uuid.uuid4()),
            device_id=device_id,
            filename=file.filename,
            subject=processed_response.get("subject", "Unknown"),
            worksheet_title=processed_response.get("worksheet_title", "Unknown"),
            thumbnail_url=thumbnail_url,
            status="completed",
            created_at=datetime.utcnow(),
            processed_response=processed_response,
            telemetry=telemetry
        )
        return mock_record

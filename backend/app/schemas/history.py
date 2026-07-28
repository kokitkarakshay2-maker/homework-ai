from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any
from datetime import datetime

class WorksheetQuestionSchema(BaseModel):
    id: str
    question_number: int
    question_type: Optional[str] = None
    question: str
    answer: str
    write_this: Optional[str] = None
    explanation: Optional[Any] = None
    color: Optional[str] = None
    shape: Optional[str] = None
    metadata_json: Optional[dict] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class HistoryResponseSchema(BaseModel):
    id: str
    device_id: Optional[str] = None
    filename: str
    subject: Optional[str] = None
    worksheet_title: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: str
    created_at: datetime
    
    # We maintain this structure so the frontend continues to work seamlessly
    # The 'processed_response' key on the frontend expects a 'questions' array.
    processed_response: dict
    telemetry: Optional[dict] = None

    model_config = ConfigDict(from_attributes=True)

class HistoryListResponse(BaseModel):
    items: List[HistoryResponseSchema]
    total: int

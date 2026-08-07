from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.homework import HomeworkHistory, WorksheetQuestion
from app.schemas.history import HistoryResponseSchema, WorksheetQuestionSchema
from typing import List, Tuple
from app.utils.logger import logger
import json

class HistoryService:
    def __init__(self, db: Session):
        self.db = db

    def _serialize_history(self, db_history: HomeworkHistory) -> HistoryResponseSchema:
        # Construct the processed_response payload the frontend expects
        qs = db_history.questions
        # Order questions by question_number
        qs_sorted = sorted(qs, key=lambda x: x.question_number)
        
        questions_payload = []
        for q in qs_sorted:
            questions_payload.append({
                "id": q.id,
                "question_number": q.question_number,
                "question_type": q.question_type,
                "question": q.question,
                "answer": q.answer,
                "answers": q.metadata_json.get("answers") if q.metadata_json else None,
                "write_this": q.write_this,
                "steps": q.explanation,
                "warnings": q.metadata_json.get("warnings", []) if q.metadata_json else [],
                "interactive_data": q.metadata_json.get("interactive_data") if q.metadata_json else None,
                "color": q.color,
                "shape": q.shape,
                "metadata_json": q.metadata_json,
                "created_at": q.created_at.isoformat() if q.created_at else None,
            })

        processed_response = {
            "subject": db_history.subject,
            "worksheet_title": db_history.worksheet_title,
            "questions": questions_payload
        }

        return HistoryResponseSchema(
            id=db_history.id,
            device_id=db_history.device_id,
            filename=db_history.filename,
            subject=db_history.subject,
            worksheet_title=db_history.worksheet_title,
            thumbnail_url=db_history.thumbnail_url,
            status=db_history.status,
            created_at=db_history.created_at,
            processed_response=processed_response
        )

    def create_history(self, device_id: str, filename: str, thumbnail_url: str, processed_response: dict, time_ms: int = None, workspace_id: str = None) -> HistoryResponseSchema | None:
        """
        Creates the History record and all associated questions.
        Returns the parsed schema on success, or None if the DB transaction fails.
        """
        try:
            subject = processed_response.get("subject", "Unknown")
            title = processed_response.get("worksheet_title", "Unknown")
            questions = processed_response.get("questions", [])

            db_history = HomeworkHistory(
                device_id=device_id,
                workspace_id=workspace_id,
                filename=filename,
                subject=subject,
                worksheet_title=title,
                thumbnail_url=thumbnail_url,
                question_count=len(questions),
                processing_time_ms=time_ms,
                status="completed"
            )
            self.db.add(db_history)
            self.db.flush() # flush to get history.id

            db_questions = []
            for idx, q_data in enumerate(questions):
                # Save extra fields in metadata_json
                meta = q_data.get("metadata", {})
                if not isinstance(meta, dict):
                    meta = {}
                if "answers" in q_data:
                    meta["answers"] = q_data["answers"]
                if "warnings" in q_data:
                    meta["warnings"] = q_data["warnings"]
                if "interactive_data" in q_data:
                    meta["interactive_data"] = q_data["interactive_data"]

                db_question = WorksheetQuestion(
                    history_id=db_history.id,
                    question_number=idx + 1,
                    question_type=q_data.get("question_type", q_data.get("type")),
                    question=q_data.get("question", ""),
                    answer=q_data.get("answer", ""),
                    write_this=q_data.get("write_this"),
                    explanation=q_data.get("steps"), # Frontend uses 'steps' internally
                    color=q_data.get("color"),
                    shape=q_data.get("shape"),
                    metadata_json=meta
                )
                db_questions.append(db_question)
                
            self.db.add_all(db_questions)

            self.db.commit()
            self.db.refresh(db_history)
            return self._serialize_history(db_history)
        except Exception as e:
            self.db.rollback()
            logger.error(f"Database insertion failed during create_history: {str(e)}")
            return None

    def get_history(self, history_id: str) -> HistoryResponseSchema | None:
        db_history = self.db.query(HomeworkHistory).filter(
            HomeworkHistory.id == history_id,
            HomeworkHistory.deleted_at == None
        ).first()
        
        if db_history:
            return self._serialize_history(db_history)
        return None

    def list_history(self, device_id: str, skip: int = 0, limit: int = 20, workspace_id: str = None) -> Tuple[List[HistoryResponseSchema], int]:
        if not workspace_id:
            return [], 0
            
        query = self.db.query(HomeworkHistory).filter(
            HomeworkHistory.deleted_at == None,
            HomeworkHistory.workspace_id == workspace_id
        )
        
        total = query.count()
        db_histories = query.order_by(HomeworkHistory.created_at.desc()).offset(skip).limit(limit).all()
        
        return [self._serialize_history(h) for h in db_histories], total

    def delete_history(self, history_id: str, device_id: str, workspace_id: str = None) -> bool:
        if not workspace_id:
            return False
            
        from datetime import datetime, timezone
        query = self.db.query(HomeworkHistory).filter(
            HomeworkHistory.id == history_id,
            HomeworkHistory.deleted_at == None,
            HomeworkHistory.workspace_id == workspace_id
        )
        db_history = query.first()
        
        if db_history:
            db_history.deleted_at = datetime.now(timezone.utc)
            self.db.commit()
            return True
        return False

    def delete_all_history(self, device_id: str, workspace_id: str = None) -> bool:
        if not workspace_id:
            return False
            
        from datetime import datetime, timezone
        query = self.db.query(HomeworkHistory).filter(
            HomeworkHistory.deleted_at == None,
            HomeworkHistory.workspace_id == workspace_id
        )
        db_histories = query.all()
        
        for db_history in db_histories:
            db_history.deleted_at = datetime.now(timezone.utc)
        self.db.commit()
        return True

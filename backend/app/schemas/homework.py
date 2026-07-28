from pydantic import BaseModel, Field
from typing import List, Optional

class QuestionSchema(BaseModel):
    id: int
    question: str
    answer: str
    answers: Optional[List[str]] = None
    write_this: str
    steps: List[str]
    warnings: List[str]
    question_type: str
    metadata: dict

class HomeworkResponseSchema(BaseModel):
    subject: str
    worksheet_title: str
    questions: List[QuestionSchema]

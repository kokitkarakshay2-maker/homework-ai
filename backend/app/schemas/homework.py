from pydantic import BaseModel, Field
from typing import List, Optional

class InteractiveOption(BaseModel):
    text: str
    selected: Optional[bool] = None
    is_correct: Optional[bool] = None
    color: Optional[str] = None
    shape: Optional[str] = None

class InteractiveMatch(BaseModel):
    left: str
    right: str

class LegendItem(BaseModel):
    concept: str
    color: str

class InteractiveData(BaseModel):
    text: Optional[str] = None
    blank: Optional[str] = None
    options: Optional[List[InteractiveOption]] = None
    matches: Optional[List[InteractiveMatch]] = None
    question_text: Optional[str] = None
    answer_text: Optional[str] = None
    state: Optional[bool] = None
    legend: Optional[List[LegendItem]] = None
    total: Optional[int] = None
    subtract: Optional[int] = None
    shape: Optional[str] = None
    operation: Optional[str] = None
    start: Optional[int] = None
    steps: Optional[int] = None
    result: Optional[int] = None
    max: Optional[int] = None


class QuestionSchema(BaseModel):
    id: int
    question: str
    answer: str
    answers: Optional[List[str]] = None
    write_this: str
    steps: List[str]
    warnings: List[str]
    question_type: str
    interactive_data: Optional[InteractiveData] = None

class HomeworkResponseSchema(BaseModel):
    subject: str
    worksheet_title: str
    questions: List[QuestionSchema]

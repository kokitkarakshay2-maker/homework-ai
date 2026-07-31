from pydantic import BaseModel, Field
from typing import List, Optional

class InteractiveOption(BaseModel):
    text: str
    selected: Optional[bool] = None
    is_correct: Optional[bool] = None

class InteractiveMatch(BaseModel):
    left: str
    right: str

class InteractiveData(BaseModel):
    text: Optional[str] = None
    blank: Optional[str] = None
    options: Optional[List[InteractiveOption]] = None
    matches: Optional[List[InteractiveMatch]] = None
    question_text: Optional[str] = None
    answer_text: Optional[str] = None
    state: Optional[bool] = None

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

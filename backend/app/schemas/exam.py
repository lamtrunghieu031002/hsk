from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict
from uuid import UUID

class ExamQuestionSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    section: str
    question_number: int
    question_type: str
    audio_text: Optional[str] = None
    stimulus: Optional[str] = None
    question_text: str
    options: Optional[List[str]] = None
    # We omit correct_answer for test taking or include for review

class ExamQuestionWithAnswerSchema(ExamQuestionSchema):
    correct_answer: str
    explanation_vi: Optional[str] = None

class ExamSummarySchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    hsk_level: int
    title: str
    description: Optional[str] = None
    duration_minutes: int
    total_score: int
    question_count: int = 0

class ExamDetailSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    hsk_level: int
    title: str
    description: Optional[str] = None
    duration_minutes: int
    total_score: int
    questions: List[ExamQuestionSchema] = []

class ExamSubmitRequest(BaseModel):
    answers: Dict[str, str] # question_id (str) -> user's selected answer

class ExamResultQuestionDetail(BaseModel):
    question_id: UUID
    question_number: int
    section: str
    user_answer: Optional[str]
    correct_answer: str
    is_correct: bool
    explanation_vi: Optional[str] = None

class ExamResultResponse(BaseModel):
    total_questions: int
    correct_count: int
    score: float
    passed: bool
    details: List[ExamResultQuestionDetail]

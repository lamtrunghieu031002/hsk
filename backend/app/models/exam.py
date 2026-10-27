import uuid
from sqlalchemy import Column, String, Integer, Text, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base

class Exam(Base):
    __tablename__ = "exams"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hsk_level = Column(Integer, nullable=False, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, default=35)
    total_score = Column(Integer, default=100)

    questions = relationship("ExamQuestion", back_populates="exam", cascade="all, delete-orphan", lazy="selectin", order_by="ExamQuestion.question_number")

class ExamQuestion(Base):
    __tablename__ = "exam_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exams.id", ondelete="CASCADE"), nullable=False, index=True)
    section = Column(String(50), nullable=False)  # listening, reading, writing
    question_number = Column(Integer, nullable=False)
    question_type = Column(String(50), nullable=False)  # multiple_choice, true_false, reorder, fill_blank
    audio_text = Column(Text, nullable=True)  # text for browser speech synthesis or audio url
    stimulus = Column(Text, nullable=True)    # Reading passage or context
    question_text = Column(Text, nullable=False)
    options = Column(JSONB, nullable=True)     # list of options e.g. ["A. 苹果", "B. 香蕉", ...]
    correct_answer = Column(String(50), nullable=False) # "A", "True", etc.
    explanation_vi = Column(Text, nullable=True)

    exam = relationship("Exam", back_populates="questions")

    __table_args__ = (
        Index("idx_exam_q_order", "exam_id", "question_number"),
    )

import uuid
from sqlalchemy import Column, String, Integer, Text, Index
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class WritingSentence(Base):
    __tablename__ = "writing_sentences"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hsk_level = Column(Integer, nullable=False, index=True)
    chinese = Column(Text, nullable=False)
    pinyin = Column(Text, nullable=False)
    meaning_vi = Column(Text, nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)
    __table_args__ = (Index("idx_sentences_hsk", "hsk_level"),)

import uuid
from sqlalchemy import Column, String, Integer, Text, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import validates
from app.core.database import Base

class GrammarPoint(Base):
    __tablename__ = "grammar_points"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hsk_level = Column(Integer, nullable=False, index=True)
    title = Column(String(200), nullable=False)
    title_vi = Column(String(200), nullable=True)
    structure = Column(String(300), nullable=False)
    pattern = Column(String(300), nullable=True)
    explanation_vi = Column(Text, nullable=False)
    examples = Column(JSONB, nullable=False, default=list)  # list of {chinese, pinyin, meaning_vi}

    def __init__(self, **kwargs):
        if "title_vi" in kwargs and "title" not in kwargs:
            kwargs["title"] = kwargs["title_vi"]
        elif "title" in kwargs and "title_vi" not in kwargs:
            kwargs["title_vi"] = kwargs["title"]

        if "pattern" in kwargs and "structure" not in kwargs:
            kwargs["structure"] = kwargs["pattern"]
        elif "structure" in kwargs and "pattern" not in kwargs:
            kwargs["pattern"] = kwargs["structure"]

        super().__init__(**kwargs)

    __table_args__ = (
        Index("idx_grammar_hsk", "hsk_level"),
    )

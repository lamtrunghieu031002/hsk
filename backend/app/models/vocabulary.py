import uuid
from sqlalchemy import Column, String, Integer, Text, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base

class Vocabulary(Base):
    __tablename__ = "vocabularies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hsk_level = Column(Integer, nullable=False, index=True)  # 1 to 6
    simplified = Column(String(50), nullable=False, index=True)
    traditional = Column(String(50), nullable=True)
    pinyin = Column(String(100), nullable=False)
    pinyin_clean = Column(String(100), nullable=False, index=True)  # e.g., 'ni hao' without tones
    han_viet = Column(String(100), nullable=True, index=True)      # Âm Hán Việt
    meaning_vi = Column(Text, nullable=False)                      # Nghĩa tiếng Việt
    meaning_en = Column(Text, nullable=True)                       # Meaning in English
    part_of_speech = Column(String(50), nullable=True)             # Từ loại (danh từ, động từ...)
    stroke_count = Column(Integer, nullable=True)
    stroke_data = Column(JSONB, nullable=True)                     # HanziWriter stroke lines/medians
    audio_url = Column(String(255), nullable=True)
    frequency_rank = Column(Integer, default=0, index=True)

    examples = relationship("VocabExample", back_populates="vocabulary", cascade="all, delete-orphan", lazy="selectin")

    __table_args__ = (
        Index("idx_vocab_hsk_rank", "hsk_level", "frequency_rank"),
        Index("idx_vocab_trgm_simplified", "simplified", postgresql_using="gin", postgresql_ops={"simplified": "gin_trgm_ops"}),
        Index("idx_vocab_trgm_pinyin", "pinyin_clean", postgresql_using="gin", postgresql_ops={"pinyin_clean": "gin_trgm_ops"}),
    )

class VocabExample(Base):
    __tablename__ = "vocab_examples"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vocab_id = Column(UUID(as_uuid=True), ForeignKey("vocabularies.id", ondelete="CASCADE"), nullable=False, index=True)
    chinese = Column(Text, nullable=False)
    pinyin = Column(Text, nullable=False)
    meaning_vi = Column(Text, nullable=False)
    meaning_en = Column(Text, nullable=True)

    vocabulary = relationship("Vocabulary", back_populates="examples")

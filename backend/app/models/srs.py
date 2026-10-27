import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base

class SRSCard(Base):
    __tablename__ = "srs_cards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(100), nullable=False, default="guest_user", index=True)
    vocab_id = Column(UUID(as_uuid=True), ForeignKey("vocabularies.id", ondelete="CASCADE"), nullable=False, index=True)
    
    easiness_factor = Column(Float, default=2.5) # SM-2 EF
    repetitions = Column(Integer, default=0)
    interval_days = Column(Integer, default=0)
    next_review_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
    last_reviewed_at = Column(DateTime(timezone=True), nullable=True)
    review_history = Column(JSONB, default=list)

    vocabulary = relationship("Vocabulary", lazy="joined")

    __table_args__ = (
        Index("idx_srs_user_review", "user_id", "next_review_at"),
    )

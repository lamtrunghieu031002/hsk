from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.schemas.vocabulary import VocabularySchema

class SRSReviewRequest(BaseModel):
    user_id: str = "guest_user"
    vocab_id: UUID
    # quality rating: 0 (Blackout), 1 (Wrong), 2 (Hard), 3 (Good), 4 (Easy)
    quality: int

class SRSCardResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: str
    vocab_id: UUID
    easiness_factor: float
    repetitions: int
    interval_days: int
    next_review_at: datetime
    vocabulary: Optional[VocabularySchema] = None

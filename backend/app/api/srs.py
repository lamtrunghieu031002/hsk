from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from datetime import datetime, timezone
from typing import List
from app.core.database import get_db
from app.models.srs import SRSCard
from app.schemas.srs import SRSReviewRequest, SRSCardResponse
from app.services.srs_service import SRSService

router = APIRouter(prefix="/srs", tags=["Spaced Repetition System"])

@router.get("/due", response_model=List[SRSCardResponse])
async def get_due_cards(
    user_id: str = Query("guest_user"),
    limit: int = Query(30, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    stmt = (
        select(SRSCard)
        .where(
            and_(
                SRSCard.user_id == user_id,
                SRSCard.next_review_at <= now
            )
        )
        .order_by(SRSCard.next_review_at.asc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/review", response_model=SRSCardResponse)
async def submit_card_review(
    payload: SRSReviewRequest,
    db: AsyncSession = Depends(get_db)
):
    card = await SRSService.review_card(
        db=db,
        user_id=payload.user_id,
        vocab_id=payload.vocab_id,
        quality=payload.quality
    )
    return card

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.core.database import get_db
from app.models.sentence import WritingSentence
from app.schemas.sentence import WritingSentenceSchema

router = APIRouter(prefix="/sentences", tags=["Sentences"])

@router.get("/", response_model=List[WritingSentenceSchema])
async def list_sentences(
    hsk_level: Optional[int] = Query(None, ge=1, le=6),
    db: AsyncSession = Depends(get_db)
):
    q = select(WritingSentence)
    if hsk_level:
        q = q.where(WritingSentence.hsk_level == hsk_level)
    q = q.order_by(WritingSentence.hsk_level.asc(), WritingSentence.sort_order.asc())
    result = await db.execute(q)
    return result.scalars().all()

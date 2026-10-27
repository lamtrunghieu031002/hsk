from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from uuid import UUID
from app.core.database import get_db
from app.models.grammar import GrammarPoint
from app.schemas.grammar import GrammarPointSchema

router = APIRouter(prefix="/grammar", tags=["Grammar"])

@router.get("/", response_model=List[GrammarPointSchema])
async def list_grammar_points(
    hsk_level: Optional[int] = Query(None, ge=1, le=6),
    db: AsyncSession = Depends(get_db)
):
    query = select(GrammarPoint)
    if hsk_level:
        query = query.where(GrammarPoint.hsk_level == hsk_level)
    
    query = query.order_by(GrammarPoint.hsk_level.asc(), GrammarPoint.title.asc())
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{grammar_id}", response_model=GrammarPointSchema)
async def get_grammar_detail(grammar_id: UUID, db: AsyncSession = Depends(get_db)):
    query = select(GrammarPoint).where(GrammarPoint.id == grammar_id)
    result = await db.execute(query)
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Grammar point not found")
    return item

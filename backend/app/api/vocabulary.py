from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from typing import Optional
from uuid import UUID
from app.core.database import get_db
from app.core.cache import cache_get, cache_set
from app.models.vocabulary import Vocabulary
from app.schemas.vocabulary import VocabularySchema, VocabularyListResponse

router = APIRouter(prefix="/vocabulary", tags=["Vocabulary"])


@router.get("/", response_model=VocabularyListResponse)
async def list_vocabulary(
    hsk_level: Optional[int] = Query(None, ge=1, le=6, description="HSK Level 1-6"),
    search: Optional[str] = Query(None, description="Search Chinese, Pinyin, or Vietnamese meaning"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=500),
    db: AsyncSession = Depends(get_db)
):
    # Only cache full-level fetches (no search, page 1, large page_size)
    cache_key = None
    if hsk_level and not search and page == 1 and page_size >= 200:
        cache_key = f"vocab:level:{hsk_level}:full"
        cached = await cache_get(cache_key)
        if cached:
            return VocabularyListResponse(**cached)

    query = select(Vocabulary)

    if hsk_level:
        query = query.where(Vocabulary.hsk_level == hsk_level)

    if search:
        search_clean = search.strip().lower()
        search_pattern = f"%{search_clean}%"
        query = query.where(
            or_(
                Vocabulary.simplified.ilike(search_pattern),
                Vocabulary.pinyin_clean.ilike(search_pattern),
                Vocabulary.pinyin.ilike(search_pattern),
                Vocabulary.han_viet.ilike(search_pattern),
                Vocabulary.meaning_vi.ilike(search_pattern)
            )
        )

    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    query = query.order_by(Vocabulary.hsk_level.asc(), Vocabulary.frequency_rank.asc())
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    items = result.scalars().all()

    response = VocabularyListResponse(total=total, page=page, page_size=page_size, items=items)

    if cache_key:
        await cache_set(cache_key, response.model_dump())

    return response


@router.get("/stats")
async def get_vocabulary_stats(db: AsyncSession = Depends(get_db)):
    cached = await cache_get("vocab:stats")
    if cached:
        return cached

    query = select(Vocabulary.hsk_level, func.count(Vocabulary.id)).group_by(Vocabulary.hsk_level).order_by(Vocabulary.hsk_level.asc())
    result = await db.execute(query)
    rows = result.all()
    stats = {f"hsk{row[0]}": row[1] for row in rows}
    data = {"total": sum(stats.values()), "by_level": stats}

    await cache_set("vocab:stats", data, ttl=3600)
    return data


@router.get("/{vocab_id}", response_model=VocabularySchema)
async def get_vocabulary_detail(vocab_id: UUID, db: AsyncSession = Depends(get_db)):
    query = select(Vocabulary).where(Vocabulary.id == vocab_id)
    result = await db.execute(query)
    vocab = result.scalar_one_or_none()
    if not vocab:
        raise HTTPException(status_code=404, detail="Vocabulary not found")
    return vocab

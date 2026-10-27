import uuid as uuid_lib
from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel, ConfigDict

from app.core.database import get_db
from app.models.youtube_video import YoutubeVideo
from app.api.deps import require_admin

router = APIRouter(tags=["YouTube Videos"])


class VideoOut(BaseModel):
    id: UUID
    video_id: str
    title: str
    channel: str
    hsk_level: int
    description: Optional[str] = None
    is_active: bool
    sort_order: int

    model_config = ConfigDict(from_attributes=True)


class VideoCreate(BaseModel):
    video_id: str
    title: str
    channel: str = ''
    hsk_level: int
    description: Optional[str] = None
    sort_order: int = 0


class VideoUpdate(BaseModel):
    title: Optional[str] = None
    channel: Optional[str] = None
    hsk_level: Optional[int] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


@router.get("/videos/", response_model=List[VideoOut])
async def list_videos(hsk_level: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    q = select(YoutubeVideo).where(YoutubeVideo.is_active == True)
    if hsk_level:
        q = q.where(YoutubeVideo.hsk_level == hsk_level)
    q = q.order_by(YoutubeVideo.hsk_level, YoutubeVideo.sort_order)
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/admin/videos/", response_model=List[VideoOut])
async def admin_list_videos(db: AsyncSession = Depends(get_db), _: None = Depends(require_admin)):
    q = select(YoutubeVideo).order_by(YoutubeVideo.hsk_level, YoutubeVideo.sort_order)
    result = await db.execute(q)
    return result.scalars().all()


@router.post("/admin/videos/", response_model=VideoOut, status_code=201)
async def create_video(body: VideoCreate, db: AsyncSession = Depends(get_db), _: None = Depends(require_admin)):
    existing = await db.execute(select(YoutubeVideo).where(YoutubeVideo.video_id == body.video_id))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Video ID này đã tồn tại trong hệ thống")
    video = YoutubeVideo(**body.model_dump())
    db.add(video)
    await db.commit()
    await db.refresh(video)
    return video


@router.patch("/admin/videos/{video_db_id}", response_model=VideoOut)
async def update_video(
    video_db_id: str,
    body: VideoUpdate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_admin),
):
    try:
        uid = uuid_lib.UUID(video_db_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="ID không hợp lệ")
    video = await db.get(YoutubeVideo, uid)
    if not video:
        raise HTTPException(status_code=404, detail="Không tìm thấy video")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(video, field, value)
    await db.commit()
    await db.refresh(video)
    return video


@router.delete("/admin/videos/{video_db_id}", status_code=204)
async def delete_video(
    video_db_id: str,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_admin),
):
    try:
        uid = uuid_lib.UUID(video_db_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="ID không hợp lệ")
    video = await db.get(YoutubeVideo, uid)
    if not video:
        raise HTTPException(status_code=404, detail="Không tìm thấy video")
    await db.delete(video)
    await db.commit()

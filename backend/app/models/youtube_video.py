import uuid
from sqlalchemy import Column, String, Integer, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class YoutubeVideo(Base):
    __tablename__ = "youtube_videos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    video_id = Column(String(20), nullable=False, unique=True, index=True)
    title = Column(String(300), nullable=False)
    channel = Column(String(100), nullable=False, server_default='')
    hsk_level = Column(Integer, nullable=False, index=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, server_default='true')
    sort_order = Column(Integer, nullable=False, server_default='0')

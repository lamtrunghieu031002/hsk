from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID

class WritingSentenceSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    hsk_level: int
    chinese: str
    pinyin: str
    meaning_vi: str
    sort_order: int

class WritingSentenceCreate(BaseModel):
    hsk_level: int
    chinese: str
    pinyin: str
    meaning_vi: str
    sort_order: int = 0

class WritingSentenceUpdate(BaseModel):
    hsk_level: Optional[int] = None
    chinese: Optional[str] = None
    pinyin: Optional[str] = None
    meaning_vi: Optional[str] = None
    sort_order: Optional[int] = None

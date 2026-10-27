from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from uuid import UUID

class VocabExampleSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    chinese: str
    pinyin: str
    meaning_vi: str
    meaning_en: Optional[str] = None

class VocabularySchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    hsk_level: int
    simplified: str
    traditional: Optional[str] = None
    pinyin: str
    pinyin_clean: str
    han_viet: Optional[str] = None
    meaning_vi: str
    meaning_en: Optional[str] = None
    part_of_speech: Optional[str] = None
    stroke_count: Optional[int] = None
    stroke_data: Optional[dict] = None
    audio_url: Optional[str] = None
    frequency_rank: int
    examples: List[VocabExampleSchema] = []

class VocabularyListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[VocabularySchema]

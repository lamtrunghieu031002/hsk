from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from uuid import UUID

class GrammarExample(BaseModel):
    chinese: str
    pinyin: str
    meaning_vi: str

class GrammarPointSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    hsk_level: int
    title: str
    title_vi: Optional[str] = None
    structure: str
    pattern: Optional[str] = None
    explanation_vi: str
    examples: List[GrammarExample] = []

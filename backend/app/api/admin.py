import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from typing import Literal, Optional
from app.core.database import get_db
from app.models.user import User
from app.api.deps import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


def _user_row(u: User) -> dict:
    return {
        "id": str(u.id),
        "email": u.email,
        "name": u.name,
        "avatar_url": u.avatar_url,
        "role": u.role,
        "created_at": u.created_at.isoformat() if u.created_at else None,
        "last_login": u.last_login.isoformat() if u.last_login else None,
    }


@router.get("/users")
async def list_users(
    page: int = 1,
    page_size: int = 20,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    offset = (page - 1) * page_size
    res = await db.execute(select(User).order_by(User.created_at.desc()).offset(offset).limit(page_size))
    users = res.scalars().all()
    total_res = await db.execute(select(func.count(User.id)))
    total = total_res.scalar()
    return {"total": total, "page": page, "page_size": page_size, "items": [_user_row(u) for u in users]}


class RoleBody(BaseModel):
    role: Literal["admin", "user"]


@router.patch("/users/{user_id}/role")
async def update_role(
    user_id: str,
    body: RoleBody,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    if user_id == str(current_admin.id):
        raise HTTPException(status_code=400, detail="Không thể thay đổi quyền của chính mình")
    user = await db.get(User, uuid.UUID(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
    user.role = body.role
    await db.commit()
    return {"success": True, "user_id": user_id, "role": body.role}


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    if user_id == str(current_admin.id):
        raise HTTPException(status_code=400, detail="Không thể xóa tài khoản của chính mình")
    user = await db.get(User, uuid.UUID(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
    await db.delete(user)
    await db.commit()
    return {"success": True}


# ── Admin Vocabulary ──────────────────────────────────────────────────────
from app.models.vocabulary import Vocabulary
from app.schemas.vocabulary import VocabularySchema
import re as _re


class VocabCreate(BaseModel):
    hsk_level: int
    simplified: str
    pinyin: str
    pinyin_clean: str = ""
    meaning_vi: str
    part_of_speech: Optional[str] = None
    han_viet: Optional[str] = None
    meaning_en: Optional[str] = None


class VocabUpdate(BaseModel):
    hsk_level: Optional[int] = None
    simplified: Optional[str] = None
    pinyin: Optional[str] = None
    meaning_vi: Optional[str] = None
    part_of_speech: Optional[str] = None
    han_viet: Optional[str] = None
    meaning_en: Optional[str] = None


@router.post("/vocab/", response_model=VocabularySchema)
async def admin_create_vocab(
    body: VocabCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    pc = body.pinyin_clean or _re.sub(r'[^a-z ]', '', body.pinyin.lower())
    v = Vocabulary(
        hsk_level=body.hsk_level,
        simplified=body.simplified,
        pinyin=body.pinyin,
        pinyin_clean=pc,
        meaning_vi=body.meaning_vi,
        part_of_speech=body.part_of_speech,
        han_viet=body.han_viet,
        meaning_en=body.meaning_en,
        frequency_rank=9999,
    )
    db.add(v)
    await db.commit()
    await db.refresh(v)
    return v


@router.patch("/vocab/{vocab_id}", response_model=VocabularySchema)
async def admin_update_vocab(
    vocab_id: str,
    body: VocabUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    v = await db.get(Vocabulary, uuid.UUID(vocab_id))
    if not v:
        raise HTTPException(status_code=404, detail="Không tìm thấy từ vựng")
    for field, val in body.model_dump(exclude_unset=True).items():
        setattr(v, field, val)
    if body.pinyin:
        v.pinyin_clean = _re.sub(r'[^a-z ]', '', body.pinyin.lower())
    await db.commit()
    await db.refresh(v)
    return v


@router.delete("/vocab/{vocab_id}")
async def admin_delete_vocab(
    vocab_id: str,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    v = await db.get(Vocabulary, uuid.UUID(vocab_id))
    if not v:
        raise HTTPException(status_code=404, detail="Không tìm thấy từ vựng")
    await db.delete(v)
    await db.commit()
    return {"success": True}


# ── Admin Grammar ─────────────────────────────────────────────────────────
from app.models.grammar import GrammarPoint
from app.schemas.grammar import GrammarPointSchema
from typing import List as _List


class GrammarExampleCreate(BaseModel):
    chinese: str
    pinyin: str
    meaning_vi: str


class GrammarCreate(BaseModel):
    hsk_level: int
    title: str
    structure: str
    explanation_vi: str
    examples: _List[GrammarExampleCreate] = []


class GrammarUpdate(BaseModel):
    hsk_level: Optional[int] = None
    title: Optional[str] = None
    structure: Optional[str] = None
    explanation_vi: Optional[str] = None
    examples: Optional[_List[GrammarExampleCreate]] = None


@router.post("/grammar/", response_model=GrammarPointSchema)
async def admin_create_grammar(
    body: GrammarCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    g = GrammarPoint(
        hsk_level=body.hsk_level,
        title=body.title,
        title_vi=body.title,
        structure=body.structure,
        pattern=body.structure,
        explanation_vi=body.explanation_vi,
        examples=[ex.model_dump() for ex in body.examples],
    )
    db.add(g)
    await db.commit()
    await db.refresh(g)
    return g


@router.patch("/grammar/{grammar_id}", response_model=GrammarPointSchema)
async def admin_update_grammar(
    grammar_id: str,
    body: GrammarUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    g = await db.get(GrammarPoint, uuid.UUID(grammar_id))
    if not g:
        raise HTTPException(status_code=404, detail="Không tìm thấy ngữ pháp")
    for field, val in body.model_dump(exclude_unset=True).items():
        if field == 'examples' and val is not None:
            g.examples = [ex if isinstance(ex, dict) else ex.model_dump() for ex in val]
        elif field != 'examples':
            setattr(g, field, val)
    if body.title:
        g.title_vi = body.title
    if body.structure:
        g.pattern = body.structure
    await db.commit()
    await db.refresh(g)
    return g


@router.delete("/grammar/{grammar_id}")
async def admin_delete_grammar(
    grammar_id: str,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    g = await db.get(GrammarPoint, uuid.UUID(grammar_id))
    if not g:
        raise HTTPException(status_code=404, detail="Không tìm thấy ngữ pháp")
    await db.delete(g)
    await db.commit()
    return {"success": True}


# ── Admin WritingSentences ────────────────────────────────────────────────
from app.models.sentence import WritingSentence
from app.schemas.sentence import WritingSentenceSchema, WritingSentenceCreate, WritingSentenceUpdate


@router.get("/sentences/", response_model=list[WritingSentenceSchema])
async def admin_list_sentences(
    hsk_level: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    q = select(WritingSentence)
    if hsk_level:
        q = q.where(WritingSentence.hsk_level == hsk_level)
    q = q.order_by(WritingSentence.hsk_level.asc(), WritingSentence.sort_order.asc())
    result = await db.execute(q)
    return result.scalars().all()


@router.post("/sentences/", response_model=WritingSentenceSchema)
async def admin_create_sentence(
    body: WritingSentenceCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    s = WritingSentence(**body.model_dump())
    db.add(s)
    await db.commit()
    await db.refresh(s)
    return s


@router.patch("/sentences/{sentence_id}", response_model=WritingSentenceSchema)
async def admin_update_sentence(
    sentence_id: str,
    body: WritingSentenceUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    s = await db.get(WritingSentence, uuid.UUID(sentence_id))
    if not s:
        raise HTTPException(status_code=404, detail="Không tìm thấy câu")
    for field, val in body.model_dump(exclude_unset=True).items():
        setattr(s, field, val)
    await db.commit()
    await db.refresh(s)
    return s


@router.delete("/sentences/{sentence_id}")
async def admin_delete_sentence(
    sentence_id: str,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    s = await db.get(WritingSentence, uuid.UUID(sentence_id))
    if not s:
        raise HTTPException(status_code=404, detail="Không tìm thấy câu")
    await db.delete(s)
    await db.commit()
    return {"success": True}

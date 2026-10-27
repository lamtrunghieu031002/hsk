import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from typing import Literal
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

import uuid
from typing import Optional
from fastapi import Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError
from app.core.database import get_db
from app.core.security import decode_access_token, COOKIE_NAME
from app.core.cache import is_token_blacklisted
from app.models.user import User


def _extract_token(request: Request) -> Optional[str]:
    """Cookie first (httpOnly), then Authorization header (Swagger/API clients)."""
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    return token or None


async def get_current_user_optional(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    token = _extract_token(request)
    if not token:
        return None
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        jti = payload.get("jti", "")
        if not user_id:
            return None
        if jti and await is_token_blacklisted(jti):
            return None
    except JWTError:
        return None
    return await db.get(User, uuid.UUID(user_id))


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    token = _extract_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Chưa đăng nhập")
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        jti = payload.get("jti", "")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token không hợp lệ hoặc đã hết hạn")

    if jti and await is_token_blacklisted(jti):
        raise HTTPException(status_code=401, detail="Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")

    user = await db.get(User, uuid.UUID(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="Tài khoản không tồn tại")
    return user


async def require_admin(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    current_user = await get_current_user(request, db)
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Chỉ quản trị viên mới có quyền truy cập")
    return current_user

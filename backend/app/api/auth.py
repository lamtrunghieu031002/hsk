import asyncio
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from app.core.database import get_db
from app.core.config import settings
from app.core.security import create_access_token
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

_thread_pool = ThreadPoolExecutor(max_workers=4)


class GoogleLoginBody(BaseModel):
    token: str


def _verify_google_token_sync(token: str) -> dict:
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests
    return id_token.verify_oauth2_token(
        token,
        google_requests.Request(),
        audience=settings.GOOGLE_CLIENT_ID,
    )


def _user_to_dict(u: User) -> dict:
    return {
        "id": str(u.id),
        "email": u.email,
        "name": u.name,
        "avatar_url": u.avatar_url,
        "role": u.role,
    }


@router.post("/google")
async def google_login(body: GoogleLoginBody, db: AsyncSession = Depends(get_db)):
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google OAuth chưa được cấu hình (GOOGLE_CLIENT_ID)")

    loop = asyncio.get_event_loop()
    try:
        idinfo = await loop.run_in_executor(_thread_pool, _verify_google_token_sync, body.token)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Token Google không hợp lệ: {exc}")

    google_id = idinfo["sub"]
    email = idinfo.get("email", "")
    name = idinfo.get("name", email)
    avatar_url = idinfo.get("picture")

    result = await db.execute(select(User).where(User.google_id == google_id))
    user = result.scalar_one_or_none()

    if not user:
        # Determine role: admin if first user OR email matches FIRST_ADMIN_EMAIL
        count_res = await db.execute(select(func.count(User.id)))
        total = count_res.scalar()
        is_first = total == 0
        is_admin_email = bool(settings.FIRST_ADMIN_EMAIL and email == settings.FIRST_ADMIN_EMAIL)
        role = "admin" if (is_first or is_admin_email) else "user"

        user = User(google_id=google_id, email=email, name=name, avatar_url=avatar_url, role=role)
        db.add(user)
    else:
        user.name = name
        user.avatar_url = avatar_url
        user.last_login = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": _user_to_dict(user)}


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return _user_to_dict(current_user)


@router.delete("/me")
async def delete_me(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await db.delete(current_user)
    await db.commit()
    return {"success": True}

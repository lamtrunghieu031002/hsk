from datetime import datetime, timedelta, timezone
from typing import Literal
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from app.core.database import get_db
from app.models.user import User
from app.models.study_session import StudySession
from app.api.deps import get_current_user

router = APIRouter(prefix="/progress", tags=["Progress"])


class SessionBody(BaseModel):
    session_type: Literal["flashcard", "meaning_drill", "exam", "listening", "speaking", "sentence_writing"]
    hsk_level: int
    items_count: int
    correct_count: int
    score: float  # 0.0–1.0


@router.post("/session")
async def log_session(
    body: SessionBody,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = StudySession(
        user_id=current_user.id,
        session_type=body.session_type,
        hsk_level=body.hsk_level,
        items_count=body.items_count,
        correct_count=body.correct_count,
        score=max(0.0, min(1.0, body.score)),
    )
    db.add(session)
    await db.commit()
    return {"success": True, "id": str(session.id)}


@router.get("")
async def get_progress(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    res = await db.execute(
        select(StudySession)
        .where(StudySession.user_id == current_user.id)
        .order_by(StudySession.created_at.desc())
    )
    sessions = res.scalars().all()

    total_sessions = len(sessions)
    total_words = sum(s.items_count for s in sessions)

    # Streak — consecutive study days up to today
    today = datetime.now(timezone.utc).date()
    study_dates = sorted({s.created_at.date() for s in sessions}, reverse=True)
    streak = 0
    for i, d in enumerate(study_dates):
        expected = today - timedelta(days=i)
        if d == expected:
            streak += 1
        else:
            break

    # Per-level breakdown
    by_level: dict = {}
    for level in range(1, 7):
        lvl_sessions = [s for s in sessions if s.hsk_level == level]
        if lvl_sessions:
            by_level[str(level)] = {
                "sessions": len(lvl_sessions),
                "words": sum(s.items_count for s in lvl_sessions),
                "accuracy": round(sum(s.score for s in lvl_sessions) / len(lvl_sessions), 3),
            }

    recent = [
        {
            "id": str(s.id),
            "session_type": s.session_type,
            "hsk_level": s.hsk_level,
            "items_count": s.items_count,
            "correct_count": s.correct_count,
            "score": round(s.score, 3),
            "created_at": s.created_at.isoformat(),
        }
        for s in sessions[:15]
    ]

    return {
        "total_sessions": total_sessions,
        "total_words": total_words,
        "streak_days": streak,
        "by_level": by_level,
        "recent": recent,
    }


@router.get("/leaderboard")
async def get_leaderboard(db: AsyncSession = Depends(get_db)):
    """Public leaderboard — top 20 users by streak days."""
    res = await db.execute(select(User).where(User.role.in_(["admin", "user"])))
    users = res.scalars().all()

    today = datetime.now(timezone.utc).date()
    board = []
    for u in users:
        sess_res = await db.execute(
            select(StudySession.created_at)
            .where(StudySession.user_id == u.id)
            .order_by(StudySession.created_at.desc())
        )
        dates = sorted({r.created_at.date() for r in sess_res}, reverse=True)
        streak = 0
        for i, d in enumerate(dates):
            if d == today - timedelta(days=i):
                streak += 1
            else:
                break
        total_res = await db.execute(
            select(func.sum(StudySession.items_count))
            .where(StudySession.user_id == u.id)
        )
        total_words = total_res.scalar() or 0
        sessions_res = await db.execute(
            select(func.count(StudySession.id)).where(StudySession.user_id == u.id)
        )
        total_sessions = sessions_res.scalar() or 0
        if streak > 0 or total_sessions > 0:
            # Only expose display_name (first name + last initial) and avatar — no email or full name
            parts = (u.name or "").split()
            display = parts[0] if parts else "Ẩn danh"
            if len(parts) > 1:
                display += f" {parts[-1][0]}."
            board.append({
                "display_name": display,
                "avatar_url": u.avatar_url,
                "streak_days": streak,
                "total_words": int(total_words),
                "total_sessions": int(total_sessions),
            })

    board.sort(key=lambda x: (-x["streak_days"], -x["total_words"]))
    return board[:20]

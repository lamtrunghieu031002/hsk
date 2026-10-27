from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from app.models.srs import SRSCard

class SRSService:
    @staticmethod
    def calculate_sm2(quality: int, repetitions: int, interval_days: int, easiness_factor: float):
        """
        SuperMemo SM-2 algorithm:
        quality:
          0: complete blackout
          1: incorrect response; the correct one remembered
          2: incorrect response; where the correct one seemed easy to recall
          3: correct response recalled with serious difficulty (Hard)
          4: correct response after hesitation (Good)
          5: perfect response (Easy)
        """
        # Map frontend 0..4 to standard 0..5
        q = min(max(quality, 0), 5)
        
        if q >= 3:
            # Correct answer
            if repetitions == 0:
                new_interval = 1
            elif repetitions == 1:
                new_interval = 6
            else:
                new_interval = int(round(interval_days * easiness_factor))
            new_repetitions = repetitions + 1
        else:
            # Incorrect answer - reset streak
            new_repetitions = 0
            new_interval = 1

        # Calculate new easiness factor
        new_ef = easiness_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        if new_ef < 1.3:
            new_ef = 1.3

        return new_repetitions, new_interval, new_ef

    @classmethod
    async def review_card(cls, db: AsyncSession, user_id: str, vocab_id: UUID, quality: int) -> SRSCard:
        stmt = select(SRSCard).where(SRSCard.user_id == user_id, SRSCard.vocab_id == vocab_id)
        result = await db.execute(stmt)
        card = result.scalar_one_or_none()

        now = datetime.now(timezone.utc)
        if not card:
            card = SRSCard(
                user_id=user_id,
                vocab_id=vocab_id,
                easiness_factor=2.5,
                repetitions=0,
                interval_days=0
            )
            db.add(card)

        reps, interval, ef = cls.calculate_sm2(
            quality=quality,
            repetitions=card.repetitions,
            interval_days=card.interval_days,
            easiness_factor=card.easiness_factor
        )

        card.repetitions = reps
        card.interval_days = interval
        card.easiness_factor = ef
        card.last_reviewed_at = now
        card.next_review_at = now + timedelta(days=interval)
        
        # Keep recent 20 review entries
        history = list(card.review_history or [])
        history.append({
            "reviewed_at": now.isoformat(),
            "quality": quality,
            "interval_days": interval
        })
        card.review_history = history[-20:]

        await db.commit()
        await db.refresh(card)
        return card

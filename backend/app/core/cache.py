import json
import redis.asyncio as redis
from typing import Any, Optional
from app.core.config import settings

_client: Optional[redis.Redis] = None

def get_redis() -> redis.Redis:
    global _client
    if _client is None:
        _client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    return _client

VOCAB_TTL = 3600  # 1 giờ — từ vựng ít thay đổi


async def cache_get(key: str) -> Optional[Any]:
    try:
        raw = await get_redis().get(key)
        return json.loads(raw) if raw else None
    except Exception:
        return None


async def cache_set(key: str, value: Any, ttl: int = VOCAB_TTL) -> None:
    try:
        await get_redis().setex(key, ttl, json.dumps(value, default=str))
    except Exception:
        pass  # Cache miss is acceptable — fall through to DB


async def cache_delete_pattern(pattern: str) -> None:
    try:
        r = get_redis()
        keys = await r.keys(pattern)
        if keys:
            await r.delete(*keys)
    except Exception:
        pass


async def blacklist_token(jti: str, ttl_seconds: int) -> None:
    try:
        await get_redis().setex(f"bl:{jti}", ttl_seconds, "1")
    except Exception:
        pass


async def is_token_blacklisted(jti: str) -> bool:
    try:
        return bool(await get_redis().exists(f"bl:{jti}"))
    except Exception:
        return False  # Redis down → fail open, don't lock out users

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import select, func
from app.core.config import settings
from app.core.database import engine, Base, AsyncSessionLocal
import app.models  # ensure models are registered
from app.api import vocabulary, grammar, exam, srs, transcript, auth, admin, progress
from app.api import youtube
from app.api import sentence
import time
import asyncio
from collections import defaultdict

# 16 curated videos seeded once when the table is empty
_INITIAL_VIDEOS = [
    {"video_id": "MYQrQvbR8Vk", "title": "HSK 1–2 | 我的一天 My Daily Routine | Learn Everyday Chinese", "channel": "Chinese Daily Podcast", "hsk_level": 1, "description": "Hội thoại sinh hoạt hàng ngày, từ vựng cơ bản, tốc độ chậm", "sort_order": 1},
    {"video_id": "47fGvpEV_Go", "title": "HSK 1–2 | A Natural Chinese Conversation About Food | 中国美食对话", "channel": "Chinese Daily Podcast", "hsk_level": 1, "description": "Hội thoại tự nhiên về ẩm thực Trung Quốc, từ vựng HSK 1-2", "sort_order": 2},
    {"video_id": "eD3sKIMFuK8", "title": "HSK 2+ | Modern Survival Skills: Don't Buy, Don't Do | 现代生存技能", "channel": "Chinese Daily Podcast", "hsk_level": 2, "description": "Kỹ năng sống hiện đại, từ vựng HSK 2+ thực dụng", "sort_order": 1},
    {"video_id": "GFPOvOvFgQI", "title": "HSK 1–3 | 像泡茶一样学中文 | Learn Chinese Like Making Tea", "channel": "Chinese Daily Podcast", "hsk_level": 2, "description": "Học tiếng Trung qua câu chuyện pha trà — nhẹ nhàng, dễ theo", "sort_order": 2},
    {"video_id": "ARQHZCOH10A", "title": "Daily Chinese Podcast for Beginner and Intermediate Learners", "channel": "Chinese Daily Podcast", "hsk_level": 2, "description": "Podcast hàng ngày dành cho người học sơ & trung cấp", "sort_order": 3},
    {"video_id": "MJTAYI52T3w", "title": "HSK 3 | What Is the Lantern Festival? | 什么是元宵节？", "channel": "Chinese Daily Podcast", "hsk_level": 3, "description": "Tìm hiểu lễ Nguyên Tiêu — văn hóa & từ vựng HSK 3", "sort_order": 1},
    {"video_id": "DvSaq8UPv_w", "title": "HSK 3–4 | The Legend of the 12 Zodiac Animals | 十二生肖的传说", "channel": "Chinese Daily Podcast", "hsk_level": 3, "description": "Truyền thuyết 12 con giáp — kể chuyện sinh động cấp 3-4", "sort_order": 2},
    {"video_id": "kVsxl4gbPrw", "title": "HSK 3–4 | Why Lunar New Year Matters in Chinese Culture | 春节为什么这么重要？", "channel": "Chinese Daily Podcast", "hsk_level": 3, "description": "Tết Âm lịch trong văn hóa Trung Hoa — HSK 3-4", "sort_order": 3},
    {"video_id": "0WsXRQFkY4s", "title": "HSK 3+ | Learn Chinese with Stories about Happiness | 听故事学中文", "channel": "Chinese Daily Podcast", "hsk_level": 3, "description": "Học tiếng Trung qua câu chuyện về hạnh phúc — HSK 3+", "sort_order": 4},
    {"video_id": "cF6ur3rkhM8", "title": "HSK 1–4 | Chinese Listening Practice | Why You Must Listen First", "channel": "Chinese Daily Podcast", "hsk_level": 4, "description": "Vì sao phải luyện nghe trước? Podcast đa cấp HSK 1-4", "sort_order": 1},
    {"video_id": "3mHlegzXELA", "title": "HSK 3–5 | Ancient Wisdom | 3 Chinese Fables | 成语故事", "channel": "Chinese Daily Podcast", "hsk_level": 4, "description": "3 câu chuyện ngụ ngôn thành ngữ Trung Hoa — tư duy phản biện", "sort_order": 2},
    {"video_id": "AI6Y37T772k", "title": "学会倾听与消除误会 | How to Listen & Avoid Misunderstandings | Chinese Bedtime Story", "channel": "Chinese Daily Podcast", "hsk_level": 4, "description": "Câu chuyện ngủ bằng tiếng Trung — kỹ năng lắng nghe & tránh hiểu lầm", "sort_order": 3},
    {"video_id": "V1xjCi-1EKU", "title": "HSK 4–5 | Conversations on Habits | Chinese Listening Practice", "channel": "Chinese Daily Podcast", "hsk_level": 5, "description": "Hội thoại về thói quen hàng ngày — tốc độ tự nhiên HSK 4-5", "sort_order": 1},
    {"video_id": "KtbmTlU9d3M", "title": "HSK 4–5 | 酒逢知己千杯少 | Drinking with a True Friend", "channel": "Chinese Daily Podcast", "hsk_level": 5, "description": "Thành ngữ 'rượu gặp tri kỷ ngàn chén vẫn ít' — HSK 4-5", "sort_order": 2},
    {"video_id": "MZbnUUWtZv4", "title": "你真的变了吗？成年人的成长瞬间 | Subtle Signs of Growing Up", "channel": "Chinese Daily Podcast", "hsk_level": 6, "description": "Những khoảnh khắc trưởng thành tinh tế — tốc độ bản ngữ", "sort_order": 1},
    {"video_id": "468fViDwrlE", "title": "孝顺还是盲从？ | Filial Piety vs Obedience in China", "channel": "Chinese Daily Podcast", "hsk_level": 6, "description": "Hiếu thuận hay tuân lệnh mù quáng? — chủ đề xã hội học thuật", "sort_order": 2},
]


async def _seed_videos_if_empty():
    from app.models.youtube_video import YoutubeVideo
    async with AsyncSessionLocal() as db:
        count_result = await db.execute(select(func.count(YoutubeVideo.id)))
        if count_result.scalar() > 0:
            return
        for data in _INITIAL_VIDEOS:
            db.add(YoutubeVideo(**data))
        await db.commit()
    print("✅ Seeded 16 initial YouTube videos into DB")


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await _seed_videos_if_empty()
    yield
    await engine.dispose()

# Simple in-memory rate limiter for auth endpoint (5 requests / 60 seconds per IP)
_auth_hits: dict[str, list[float]] = defaultdict(list)
_AUTH_LIMIT = 5
_AUTH_WINDOW = 60.0

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Nền tảng Học tiếng Trung HSK 1 - HSK 6 (Chuẩn 2026) tối ưu hóa hiệu năng cực đại với Python FastAPI, PostgreSQL và asyncpg.",
    lifespan=lifespan
)


@app.middleware("http")
async def auth_rate_limit(request: Request, call_next):
    if request.url.path == f"{settings.API_V1_STR}/auth/google" and request.method == "POST":
        ip = request.client.host if request.client else "unknown"
        now = time.time()
        hits = _auth_hits[ip]
        _auth_hits[ip] = [t for t in hits if now - t < _AUTH_WINDOW]
        if len(_auth_hits[ip]) >= _AUTH_LIMIT:
            return JSONResponse(status_code=429, content={"detail": "Quá nhiều yêu cầu đăng nhập. Thử lại sau 1 phút."})
        _auth_hits[ip].append(now)
    return await call_next(request)

# Gzip compression for payload optimization
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(vocabulary.router, prefix=settings.API_V1_STR)
app.include_router(grammar.router, prefix=settings.API_V1_STR)
app.include_router(exam.router, prefix=settings.API_V1_STR)
app.include_router(exam.admin_router, prefix=settings.API_V1_STR)
app.include_router(srs.router, prefix=settings.API_V1_STR)
app.include_router(transcript.router, prefix=settings.API_V1_STR)
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(progress.router, prefix=settings.API_V1_STR)
app.include_router(youtube.router, prefix=settings.API_V1_STR)
app.include_router(sentence.router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "status": "online",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "engine": "asyncpg", "version": "2026.1"}

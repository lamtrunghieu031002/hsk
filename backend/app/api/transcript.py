import re
import logging
from fastapi import APIRouter, HTTPException, Path
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import NoTranscriptFound, TranscriptsDisabled, VideoUnavailable

router = APIRouter(prefix="/transcript", tags=["transcript"])
logger = logging.getLogger(__name__)

CHINESE_LANGS = ["zh-Hans", "zh", "zh-CN", "zh-TW", "zh-Hant"]
_VIDEO_ID_RE = re.compile(r'^[a-zA-Z0-9_-]{11}$')

_api = YouTubeTranscriptApi()


@router.get("/{video_id}")
async def get_transcript(
    video_id: str = Path(..., min_length=11, max_length=11),
):
    if not _VIDEO_ID_RE.match(video_id):
        raise HTTPException(status_code=400, detail="Video ID không hợp lệ")
    try:
        fetched = _api.fetch(video_id, languages=CHINESE_LANGS)
    except TranscriptsDisabled:
        raise HTTPException(status_code=404, detail="Video này đã tắt phụ đề")
    except VideoUnavailable:
        raise HTTPException(status_code=404, detail="Video không tồn tại hoặc không thể truy cập")
    except NoTranscriptFound:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy phụ đề tiếng Trung. Video có thể chỉ có phụ đề tiếng khác."
        )
    except Exception as e:
        logger.error("Transcript fetch failed for %s: %s", video_id, e, exc_info=True)
        raise HTTPException(status_code=500, detail="Không thể tải transcript. Vui lòng thử lại sau.")

    segments = []
    for snippet in fetched:
        start = float(snippet.start)
        text = str(snippet.text).strip()
        if not text or not any('一' <= c <= '鿿' for c in text):
            continue
        m = int(start // 60)
        s = int(start % 60)
        segments.append({
            "start": start,
            "text": text,
            "formatted": f"[{m}:{s:02d}] {text}",
        })

    if not segments:
        raise HTTPException(
            status_code=404,
            detail="Transcript không chứa nội dung tiếng Trung"
        )

    return {
        "video_id": video_id,
        "count": len(segments),
        "transcript_text": "\n".join(s["formatted"] for s in segments),
    }

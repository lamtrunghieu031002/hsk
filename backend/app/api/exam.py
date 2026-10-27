from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional, Literal
from uuid import UUID
from pydantic import BaseModel
from app.core.database import get_db
from app.models.exam import Exam, ExamQuestion
from app.models.user import User
from app.schemas.exam import (
    ExamSummarySchema,
    ExamDetailSchema,
    ExamSubmitRequest,
    ExamResultResponse,
    ExamResultQuestionDetail
)
from app.api.deps import require_admin

router = APIRouter(prefix="/exams", tags=["Exams"])
admin_router = APIRouter(tags=["Admin Exams"])


# ── Admin create/delete schemas ───────────────────────────────────────────────

class ExamQuestionCreate(BaseModel):
    section: Literal["listening", "reading"]
    question_number: int
    question_type: Literal["multiple_choice", "true_false"]
    audio_text: Optional[str] = None
    stimulus: Optional[str] = None
    question_text: str
    options: Optional[List[str]] = None
    correct_answer: str
    explanation_vi: Optional[str] = None


class ExamCreate(BaseModel):
    hsk_level: int
    title: str
    description: Optional[str] = None
    duration_minutes: int = 35
    total_score: int = 100
    questions: List[ExamQuestionCreate]


# ── Admin endpoints ───────────────────────────────────────────────────────────

@admin_router.get("/admin/exams/", response_model=List[ExamSummarySchema])
async def admin_list_exams(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    result = await db.execute(select(Exam).order_by(Exam.hsk_level.asc(), Exam.title.asc()))
    exams = result.scalars().all()
    response = []
    for exam in exams:
        count_res = await db.execute(
            select(func.count(ExamQuestion.id)).where(ExamQuestion.exam_id == exam.id)
        )
        q_count = count_res.scalar_one()
        response.append(ExamSummarySchema(
            id=exam.id,
            hsk_level=exam.hsk_level,
            title=exam.title,
            description=exam.description,
            duration_minutes=exam.duration_minutes,
            total_score=exam.total_score,
            question_count=q_count,
        ))
    return response


@admin_router.post("/admin/exams/", response_model=ExamSummarySchema, status_code=201)
async def admin_create_exam(
    body: ExamCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    if not body.questions:
        raise HTTPException(status_code=400, detail="Đề thi phải có ít nhất 1 câu hỏi")
    if not 1 <= body.hsk_level <= 6:
        raise HTTPException(status_code=400, detail="hsk_level phải từ 1 đến 6")

    exam = Exam(
        hsk_level=body.hsk_level,
        title=body.title.strip(),
        description=body.description,
        duration_minutes=body.duration_minutes,
        total_score=body.total_score,
    )
    db.add(exam)
    await db.flush()

    for i, q in enumerate(body.questions):
        db.add(ExamQuestion(
            exam_id=exam.id,
            section=q.section,
            question_number=q.question_number if q.question_number else (i + 1),
            question_type=q.question_type,
            audio_text=q.audio_text or None,
            stimulus=q.stimulus or None,
            question_text=q.question_text.strip(),
            options=q.options or None,
            correct_answer=q.correct_answer.strip(),
            explanation_vi=q.explanation_vi or None,
        ))

    await db.commit()
    return ExamSummarySchema(
        id=exam.id,
        hsk_level=exam.hsk_level,
        title=exam.title,
        description=exam.description,
        duration_minutes=exam.duration_minutes,
        total_score=exam.total_score,
        question_count=len(body.questions),
    )


@admin_router.delete("/admin/exams/{exam_id}", status_code=204)
async def admin_delete_exam(
    exam_id: UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    result = await db.execute(select(Exam).where(Exam.id == exam_id))
    exam = result.scalar_one_or_none()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    await db.delete(exam)
    await db.commit()

@router.get("/", response_model=List[ExamSummarySchema])
async def list_exams(
    hsk_level: Optional[int] = Query(None, ge=1, le=6),
    db: AsyncSession = Depends(get_db)
):
    query = select(Exam)
    if hsk_level:
        query = query.where(Exam.hsk_level == hsk_level)
    
    query = query.order_by(Exam.hsk_level.asc(), Exam.title.asc())
    result = await db.execute(query)
    exams = result.scalars().all()
    
    response = []
    for exam in exams:
        count_q = select(func.count(ExamQuestion.id)).where(ExamQuestion.exam_id == exam.id)
        count_res = await db.execute(count_q)
        q_count = count_res.scalar_one()
        response.append(ExamSummarySchema(
            id=exam.id,
            hsk_level=exam.hsk_level,
            title=exam.title,
            description=exam.description,
            duration_minutes=exam.duration_minutes,
            total_score=exam.total_score,
            question_count=q_count
        ))
    return response

@router.get("/{exam_id}", response_model=ExamDetailSchema)
async def get_exam_detail(exam_id: UUID, db: AsyncSession = Depends(get_db)):
    query = select(Exam).where(Exam.id == exam_id)
    result = await db.execute(query)
    exam = result.scalar_one_or_none()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam

@router.post("/{exam_id}/submit", response_model=ExamResultResponse)
async def submit_exam(
    exam_id: UUID,
    payload: ExamSubmitRequest,
    db: AsyncSession = Depends(get_db)
):
    query = select(Exam).where(Exam.id == exam_id)
    result = await db.execute(query)
    exam = result.scalar_one_or_none()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    correct_count = 0
    details = []

    for q in exam.questions:
        q_id_str = str(q.id)
        user_ans = payload.answers.get(q_id_str, "").strip()
        is_corr = (user_ans.lower() == q.correct_answer.strip().lower())
        if is_corr:
            correct_count += 1

        details.append(ExamResultQuestionDetail(
            question_id=q.id,
            question_number=q.question_number,
            section=q.section,
            user_answer=user_ans if user_ans else None,
            correct_answer=q.correct_answer,
            is_correct=is_corr,
            explanation_vi=q.explanation_vi
        ))

    total = len(exam.questions)
    score = (correct_count / total * exam.total_score) if total > 0 else 0
    passed = (score >= 0.6 * exam.total_score)

    return ExamResultResponse(
        total_questions=total,
        correct_count=correct_count,
        score=round(score, 1),
        passed=passed,
        details=details
    )

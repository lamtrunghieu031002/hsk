from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from uuid import UUID
from app.core.database import get_db
from app.models.exam import Exam, ExamQuestion
from app.schemas.exam import (
    ExamSummarySchema,
    ExamDetailSchema,
    ExamSubmitRequest,
    ExamResultResponse,
    ExamResultQuestionDetail
)

router = APIRouter(prefix="/exams", tags=["Exams"])

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

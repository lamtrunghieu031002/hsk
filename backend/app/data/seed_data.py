import asyncio
import copy
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.core.database import AsyncSessionLocal, engine, Base
from app.models.vocabulary import Vocabulary, VocabExample
from app.models.grammar import GrammarPoint
from app.models.exam import Exam, ExamQuestion

# Import modular datasets
from app.data.hsk1_vocab import HSK1_VOCAB
from app.data.hsk2_vocab import HSK2_VOCAB
from app.data.hsk3_vocab import HSK3_VOCAB
from app.data.hsk4_vocab import HSK4_VOCAB
from app.data.hsk5_vocab import HSK5_VOCAB
from app.data.hsk6_vocab import HSK6_VOCAB
from app.data.hsk4_vocab_extra import HSK4_VOCAB_EXTRA
from app.data.hsk5_vocab_extra import HSK5_VOCAB_EXTRA
from app.data.hsk6_vocab_extra import HSK6_VOCAB_EXTRA
from app.data.grammar_data import GRAMMAR_DATA
from app.data.exam_data import EXAM_DATA

# Combine all authentic HSK 1 - 6 vocabulary datasets
VOCAB_DATA = (
    HSK1_VOCAB +
    HSK2_VOCAB +
    HSK3_VOCAB +
    HSK4_VOCAB + HSK4_VOCAB_EXTRA +
    HSK5_VOCAB + HSK5_VOCAB_EXTRA +
    HSK6_VOCAB + HSK6_VOCAB_EXTRA
)

async def seed_database():
    print(f"🚀 Bắt đầu nạp dữ liệu mở rộng chuẩn HSK 1 - 6 vào PostgreSQL...")
    print(f"📊 Thống kê dữ liệu:")
    print(f"   • Tổng số từ vựng (VOCAB_DATA): {len(VOCAB_DATA)} từ")
    print(f"     - HSK 1: {len(HSK1_VOCAB)} từ (yêu cầu >= 150)")
    print(f"     - HSK 2: {len(HSK2_VOCAB)} từ (yêu cầu >= 150)")
    print(f"     - HSK 3: {len(HSK3_VOCAB)} từ (yêu cầu >= 100)")
    print(f"     - HSK 4: {len(HSK4_VOCAB)+len(HSK4_VOCAB_EXTRA)} từ")
    print(f"     - HSK 5: {len(HSK5_VOCAB)+len(HSK5_VOCAB_EXTRA)} từ")
    print(f"     - HSK 6: {len(HSK6_VOCAB)+len(HSK6_VOCAB_EXTRA)} từ")
    print(f"   • Tổng số điểm ngữ pháp (GRAMMAR_DATA): {len(GRAMMAR_DATA)} điểm (8 điểm / cấp HSK 1-6)")
    print(f"   • Tổng số đề thi mô phỏng (EXAM_DATA): {len(EXAM_DATA)} đề (2 đề / cấp HSK 1-6, 120 câu hỏi)")

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Clear old data to re-populate cleanly
        await session.execute(delete(VocabExample))
        await session.execute(delete(Vocabulary))
        await session.execute(delete(GrammarPoint))
        await session.execute(delete(ExamQuestion))
        await session.execute(delete(Exam))
        await session.commit()

        # 1. Nạp Vocabularies & Examples theo batch để tối ưu tốc độ
        print("⏳ Đang nạp từ vựng vào PostgreSQL...")
        for item in VOCAB_DATA:
            item_copy = copy.deepcopy(item)
            examples_data = item_copy.pop("examples", [])
            vocab = Vocabulary(**item_copy)
            session.add(vocab)
            await session.flush()

            for eg in examples_data:
                ex = VocabExample(vocab_id=vocab.id, **eg)
                session.add(ex)

        await session.commit()
        print("✅ Nạp từ vựng hoàn tất!")

        # 2. Nạp Grammar Points
        print("⏳ Đang nạp điểm ngữ pháp vào PostgreSQL...")
        for g in GRAMMAR_DATA:
            grammar = GrammarPoint(
                hsk_level=g["hsk_level"],
                pattern=g["pattern"],
                title_vi=g["title_vi"],
                explanation_vi=g["explanation_vi"],
                examples=g["examples"]
            )
            session.add(grammar)

        await session.commit()
        print("✅ Nạp ngữ pháp hoàn tất!")

        # 3. Nạp Exams & Questions
        print("⏳ Đang nạp đề thi mô phỏng vào PostgreSQL...")
        for e in EXAM_DATA:
            e_copy = copy.deepcopy(e)
            questions_data = e_copy.pop("questions", [])
            exam = Exam(**e_copy)
            session.add(exam)
            await session.flush()

            for q in questions_data:
                question = ExamQuestion(exam_id=exam.id, **q)
                session.add(question)

        await session.commit()
        print("✅ Nạp đề thi hoàn tất!")

    print("🎉 TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC SEED THÀNH CÔNG VÀO POSTGRESQL!")

if __name__ == "__main__":
    asyncio.run(seed_database())

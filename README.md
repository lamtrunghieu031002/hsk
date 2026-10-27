# HSK Mastery 2026 - Nền Tảng Học & Luyện Thi Tiếng Trung Siêu Tốc

Hệ thống học và luyện thi tiếng Trung từ **HSK 1 đến HSK 6** (Chuẩn mới 2026) được thiết kế tối ưu hóa hiệu năng cực đại với kiến trúc **Python FastAPI + PostgreSQL + React 19 / Vite + Framer Motion**.

---

## 🌟 Tính Năng Nổi Bật

1. **Chuẩn HSK 1 đến HSK 6 (Mới nhất 2026)**:
   - Dữ liệu từ vựng chi tiết: Chữ Hán (giản thể + phồn thể), Bính âm (Pinyin) chuẩn, **Âm Hán-Việt**, Nghĩa tiếng Việt, Từ loại và câu ví dụ song ngữ.
   - Ngữ pháp trọng tâm từng cấp độ có công thức và ví dụ minh họa trực quan.
2. **Flashcards 3D & Thuật Toán Ghi Nhớ Ngắt Quãng (SRS / SM-2)**:
   - Lật thẻ 3D mượt mà 60-120fps.
   - Thuật toán SuperMemo SM-2 tự động phân tích độ khó (Chưa nhớ / Khó / Tốt / Rất dễ) để lên lịch ôn tập tối ưu trí nhớ dài hạn.
3. **Luyện Viết Chữ Hán Trực Quan (Interactive Hanzi Stroke Order)**:
   - Tích hợp công nghệ SVG vector mô phỏng chính xác từng nét bút chữ Hán.
   - Chế độ Quiz tập viết tay bắt đúng thứ tự nét và chấm điểm độ chính xác.
4. **Luyện Đề Thi Mô Phỏng (HSK Đề / Mock Exams)**:
   - Đồng hồ bấm giờ chuẩn kỳ thi quốc tế.
   - Phần thi Nghe (có phát âm trực tiếp) và Đọc hiểu.
   - Nộp bài tự động chấm điểm và hiển thị giải thích chi tiết đáp án.
5. **Tra Cứu Tức Thời (Sub-5ms Instant Search)**:
   - Sử dụng PostgreSQL GIN Index (`pg_trgm`) tìm kiếm siêu tốc theo Chữ Hán, Pinyin (có dấu hoặc không dấu), hoặc tiếng Việt.
6. **Phát Âm Tự Nhiên Không Độ Trễ**:
   - Sử dụng Web Speech API native chọn giọng tiếng Quan Thoại chuẩn, phát âm tức thì trong 0 mili-giây không cần tải file audio qua mạng.

---

## 🛠️ Ngăn Xếp Công Nghệ (Tech Stack)

- **Backend**:
  - Python 3.12 + FastAPI (Asynchronous non-blocking architecture)
  - `asyncpg` (PostgreSQL async driver tốc độ cao nhất)
  - SQLAlchemy 2.0 (Async Engine & Connection Pooling)
  - Pydantic v2 (Validation tốc độ Rust)
  - Redis 7 Caching
- **Database**:
  - PostgreSQL 15/16 với extension `pg_trgm` & Composite Indexes.
- **Frontend**:
  - React + TypeScript + Vite
  - Tailwind CSS + Lucide Icons
  - Framer Motion (Hiệu ứng 3D perspective 60-120fps)
  - HanziWriter (Stroke order animation & Canvas quiz)
  - TanStack Query (React Query)

---

## 🚀 Hướng Dẫn Khởi Động Nhanh

Tại thư mục `/home/admin1/hskde`:

```bash
# Khởi động toàn bộ Database, Backend & Frontend chỉ với 1 câu lệnh:
./start.sh
```

- **Giao diện Web**: [http://localhost:3000](http://localhost:3000)
- **API Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **PostgreSQL Connection**: `postgresql://hsk_user:hsk_password_2026@localhost:5432/hsk_database`

---

## 📂 Cấu Trúc Thư Mục

```
hskde/
├── docker-compose.yml       # PostgreSQL 15 & Redis 7
├── start.sh                 # Script khởi động 1-click
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application entry point
│   │   ├── core/            # Config & Database asyncpg pool
│   │   ├── models/          # SQLAlchemy async models
│   │   ├── schemas/         # Pydantic v2 validation
│   │   ├── api/             # API Routes (Vocabulary, Grammar, Exam, SRS)
│   │   ├── services/        # SRS SM-2 Algorithm & Business Logic
│   │   └── data/            # Seed data HSK 1-6 & Script nạp CSDL
│   ├── requirements.txt
│   └── run.sh
└── frontend/
    ├── src/
    │   ├── components/      # Navbar, LevelSelector, FlashcardDeck, HanziCanvas, ExamView...
    │   ├── services/        # Axios API clients
    │   ├── utils/           # Web Speech API Mandarin Synthesizer
    │   ├── types/           # TypeScript interfaces
    │   ├── App.tsx          # Main dashboard & tab switching
    │   └── main.tsx
    ├── package.json
    ├── vite.config.ts
    └── run.sh
```

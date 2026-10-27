# HSK Mastery 2026 — Nhật ký tiến độ
> Cập nhật: 2026-10-26

---

## Khởi động nhanh

```bash
# Terminal 1 — Backend
cd /home/admin1/hskde/backend
./run.sh                  # dev (auto-reload)
./run.sh prod             # production (4 workers)

# Terminal 2 — Frontend
cd /home/admin1/hskde/frontend
npm run dev -- --port 3000

# Mở trình duyệt: http://localhost:3000
# API docs: http://localhost:8000/docs
```

**Env files bắt buộc:**
```
frontend/.env.local   →  VITE_GOOGLE_CLIENT_ID=...apps.googleusercontent.com
backend/.env          →  GOOGLE_CLIENT_ID=...
                         JWT_SECRET_KEY=...
                         FIRST_ADMIN_EMAIL=onemarketkn@gmail.com
```

---

## Stack kỹ thuật

| Layer | Công nghệ | Cổng |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS | 3000 |
| Backend | Python FastAPI + asyncpg + SQLAlchemy async | 8000 |
| Database | PostgreSQL — `hsk_database` | 5432 |
| Cache | Redis | 6380 |
| Venv | `/home/admin1/hskde/backend/venv` | — |

**Server:** 12 CPU, 15GB RAM, 96GB disk — đủ cho ~200–500 người dùng đồng thời.

---

## Đã hoàn thành

### 1. Từ vựng HSK
- Tab "Từ Vựng HSK" hiển thị toàn bộ từ mỗi cấp (không phân trang)
- **747 từ trong DB**: HSK1=225, HSK2=158, HSK3=111, HSK4=88, HSK5=81, HSK6=84
- Mỗi từ: chữ giản thể, pinyin, Hán Việt, nghĩa VI/EN, từ loại, ví dụ câu
- Nút phát âm TTS, nút chuyển sang tab Tập Viết
- **File:** `frontend/src/App.tsx` (VocabCard component + grid)
- **API:** `GET /api/v1/vocabulary/?hsk_level=1&page_size=500`

### 2. Flashcard SRS
- Lật thẻ 3D (framer-motion), tự động phát âm khi chuyển thẻ
- Thuật toán SM-2: đánh giá 1–4, tính interval ngày ôn tiếp theo
- Phím tắt: Space (lật), ←→ (chuyển thẻ), 1-4 (đánh giá)
- Khi đăng nhập: SRS cards lưu theo user ID thật (không còn "guest_user")
- **File:** `frontend/src/components/FlashcardDeck.tsx`
- **API:** `POST /api/v1/srs/review`

### 3. Tập viết chữ Hán
- Canvas SVG với thứ tự nét bút chuẩn (hanzi-writer)
- Chọn từ trong danh sách HSK hiện tại để tập viết
- **File:** `frontend/src/components/HanziCanvas.tsx`

### 4. Đề thi mô phỏng
- Danh sách đề theo cấp HSK, đếm ngược thời gian
- Chấm điểm tự động, hiển thị đáp án đúng/sai chi tiết
- Khi đăng nhập: tự động lưu kết quả vào `study_sessions`
- **File:** `frontend/src/components/ExamView.tsx`
- **API:** `POST /api/v1/exams/{id}/submit`

### 5. Ngữ pháp HSK
- Danh sách điểm ngữ pháp theo cấp, ví dụ câu có pinyin
- **File:** `frontend/src/components/GrammarList.tsx`

### 6. Luyện nghe YouTube
- 16 video ChineseDailyPodcast nhúng sẵn
- Transcript hiển thị từng dòng, bấm để phát đúng đoạn
- Chế độ DictationMode: nghe → gõ lại → chấm điểm LCS diff
- **Tự fetch transcript:** Bấm nút → server gọi YouTube API → điền sẵn vào ô
- **File:** `frontend/src/components/YoutubeListening.tsx`, `DictationMode.tsx`
- **API:** `GET /api/v1/transcript/{video_id}`

### 7. Viết Theo Nghĩa (MeaningDrill)
- Xáo trộn 20 từ ngẫu nhiên trong cấp HSK đang chọn
- Thấy nghĩa tiếng Việt → gõ chữ Hán → Enter để kiểm tra
- Nút gợi ý pinyin (ẩn/hiện), tự phát âm sau mỗi câu trả lời
- Màn hình tổng kết: % đúng, danh sách từ sai
- Khi đăng nhập: tự động lưu vào `study_sessions`
- **File:** `frontend/src/components/MeaningDrill.tsx`

### 8. Đăng nhập Google OAuth
- Nút "Đăng nhập" góc phải Navbar → dropdown → Google Sign-In button
- Backend xác thực Google ID token, tạo user nếu lần đầu, trả JWT 7 ngày
- JWT lưu trong `localStorage`, tự restore khi reload trang
- **Email `onemarketkn@gmail.com` → tự động thành Admin**
- User dropdown: avatar, tên, role, nút Đăng xuất, nút Xóa tài khoản
- **Files:** `frontend/src/contexts/AuthContext.tsx`, `components/Navbar.tsx`
- **API:** `POST /api/v1/auth/google`, `GET /api/v1/auth/me`, `DELETE /api/v1/auth/me`

### 9. Phân quyền Admin / User
- Role: `admin` hoặc `user`
- Tab "Quản Trị" chỉ hiện với Admin
- Admin panel: bảng user, đổi role (admin↔user), xóa tài khoản người khác
- **File:** `frontend/src/components/AdminPanel.tsx`
- **API:** `GET /api/v1/admin/users`, `PATCH /api/v1/admin/users/{id}/role`, `DELETE /api/v1/admin/users/{id}`

### 10. Tiến trình học tập
- Tab "Tiến Trình" chỉ hiện khi đã đăng nhập
- **Tự động ghi nhận:** Flashcard xong, MeaningDrill xong, nộp Đề Thi
- Dashboard gồm:
  - 3 ô: 🔥 Streak ngày liên tiếp · Tổng buổi học · Tổng lượt ôn từ
  - Grid HSK 1–6: số buổi, số từ, thanh độ chính xác (xanh/vàng/đỏ)
  - Timeline 15 buổi gần nhất: loại, cấp, tỉ lệ đúng, thời gian
- **File:** `frontend/src/components/ProgressDashboard.tsx`
- **API:** `GET /api/v1/progress`, `POST /api/v1/progress/session`
- **DB:** bảng `study_sessions` (user_id FK → users, session_type, hsk_level, score...)

### 11. Tối ưu hiệu năng
- `React.lazy` + `Suspense` cho tất cả tab nặng (mỗi tab là 1 chunk JS riêng)
- `VocabCard` = `React.memo` (không re-render khi parent thay đổi)
- Vite `manualChunks`: react-core, motion, icons, hanzi, pinyin, http — bundle chính chỉ 20KB
- **Redis cache** vocab queries: cold 25ms → warm 9ms, TTL 1 giờ
- **Frontend in-memory cache** theo HSK level: HSK1→HSK2→HSK1 chỉ fetch 1 lần
- `AbortController` trong VocabSearchModal (hủy request cũ khi gõ tiếp)
- Backend `run.sh prod` chạy 4 Uvicorn workers (4/12 CPU)

---

## Cần làm tiếp

### Ưu tiên cao
- [ ] **Thêm dữ liệu từ vựng HSK 4–6** — hiện chỉ có 81–88 từ/cấp, chuẩn HSK mới cần 600–2500 từ/cấp. Cần import thêm data vào DB.
- [ ] **Quản lý video YouTube qua Admin panel** — hiện 16 video cứng trong code (`YoutubeListening.tsx`). Cần chuyển sang bảng DB `youtube_videos` và cho admin thêm/xóa/sửa qua UI.

### Ưu tiên vừa
- [ ] **Thêm từ vựng qua Admin panel** — CRUD vocab trong DB, không cần vào terminal
- [ ] **Lưu kết quả Dictation** — DictationMode chưa lưu vào `study_sessions`
- [ ] **Tìm kiếm nâng cao** — lọc theo từ loại (danh từ, động từ...), theo Hán Việt
- [ ] **Backup DB tự động** — cron job `pg_dump` hàng ngày

### Khi deploy ra internet
- [ ] Nginx reverse proxy đứng trước Uvicorn
- [ ] HTTPS / SSL (Let's Encrypt)
- [ ] Rate limiting trên `/api/v1/auth/google` (chống spam)
- [ ] Biến môi trường production tách riêng

### Tính năng mới (ý tưởng)
- [ ] Nhắc nhở học hàng ngày (streak reminder qua email hoặc notification)
- [ ] Export tiến trình ra PDF
- [ ] Leaderboard (bảng xếp hạng streak giữa users)
- [ ] Chế độ ôn theo Hán Việt thay vì nghĩa tiếng Việt

---

## Cấu trúc thư mục chính

```
hskde/
├── backend/
│   ├── app/
│   │   ├── api/          vocabulary, grammar, exam, srs, transcript, auth, admin, progress
│   │   ├── core/         config, database, security, cache (Redis)
│   │   └── models/       Vocabulary, GrammarPoint, Exam, SRSCard, User, StudySession
│   ├── .env              GOOGLE_CLIENT_ID, JWT_SECRET_KEY, FIRST_ADMIN_EMAIL
│   └── run.sh            dev / prod mode
└── frontend/
    ├── src/
    │   ├── components/   Navbar, FlashcardDeck, HanziCanvas, ExamView, GrammarList,
    │   │                 YoutubeListening, DictationMode, MeaningDrill,
    │   │                 AdminPanel, ProgressDashboard, VocabSearchModal
    │   ├── contexts/     AuthContext.tsx  (JWT + Google login state)
    │   └── services/     api.ts  (vocabApi, authApi, adminApi, progressApi, srsApi...)
    ├── .env.local        VITE_GOOGLE_CLIENT_ID
    └── index.html        Google Identity Services script tag
```

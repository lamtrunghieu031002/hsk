#!/bin/bash
cd "$(dirname "$0")"
source venv/bin/activate
export PYTHONPATH=.

# Dùng --reload cho development, bỏ để chạy production
if [ "$1" = "prod" ]; then
  # Production: 4 workers (dùng 4/12 CPU, mỗi worker xử lý requests song song)
  exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
else
  # Development: 1 worker + auto-reload khi sửa code
  exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
fi

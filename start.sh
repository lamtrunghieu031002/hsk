#!/bin/bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "=================================================="
echo "🚀 Khởi động HSK Mastery 2026 Platform"
echo "=================================================="

# 1. Khởi động PostgreSQL & Redis
echo "📦 [1/3] Đang kiểm tra Docker containers..."
docker compose up -d

# 2. Khởi động Backend FastAPI
echo "🐍 [2/3] Đang khởi động Backend FastAPI (Port 8000)..."
if ! pgrep -f "uvicorn app.main:app" > /dev/null; then
    "$DIR/backend/run.sh" > /tmp/hsk_backend.log 2>&1 &
    sleep 2
fi

# 3. Khởi động Frontend React
echo "⚡ [3/3] Đang khởi động Frontend Vite (Port 3000)..."
if ! pgrep -f "vite --host 0.0.0.0 --port 3000" > /dev/null; then
    "$DIR/frontend/run.sh" > /tmp/hsk_frontend.log 2>&1 &
    sleep 2
fi

echo ""
echo "🎉 Toàn bộ hệ thống đã sẵn sàng!"
echo "👉 Giao diện ứng dụng:  http://localhost:3000"
echo "👉 Backend API Docs:    http://localhost:8000/docs"
echo "👉 PostgreSQL 15:       localhost:5432 (hsk_database)"
echo "=================================================="

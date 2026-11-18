#!/usr/bin/env bash
# HTTPS/TLS Certificate Inspector - Quick Launch Script (macOS / Linux)

set -e

echo "=== Starting HTTPS/TLS Certificate Inspector ==="

# 1. Check Python
if command -v python3 >/dev/null 2>&1; then
    PY_CMD="python3"
elif command -v python >/dev/null 2>&1; then
    PY_CMD="python"
else
    echo "Error: Python is not installed. Please install Python 3.10+."
    exit 1
fi

# 2. Check Node & npm
if ! command -v npm >/dev/null 2>&1; then
    echo "Error: npm is not installed. Please install Node.js 18+."
    exit 1
fi

# 3. Setup Backend venv if missing
if [ ! -d "backend/venv" ]; then
    echo "--> Creating Python virtual environment in backend/venv..."
    $PY_CMD -m venv backend/venv
    backend/venv/bin/pip install --upgrade pip
    backend/venv/bin/pip install -r backend/requirements.txt
fi

# 4. Setup Frontend dependencies if missing
if [ ! -d "frontend/node_modules" ]; then
    echo "--> Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

echo ""
echo "=== Environment Ready! ==="
echo "To run the application:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend && source venv/bin/activate && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo "==============================================="

# Optional: Run backend in background and frontend in foreground if executed directly
read -p "Would you like to start both servers now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Start backend
    backend/venv/bin/python -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000 &
    BACKEND_PID=$!
    trap "kill $BACKEND_PID 2>/dev/null || true" EXIT

    # Start frontend
    cd frontend && npm run dev
fi

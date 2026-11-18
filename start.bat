@echo off
REM HTTPS/TLS Certificate Inspector - Quick Launch Script (Windows)

echo === Starting HTTPS/TLS Certificate Inspector ===

REM 1. Check Python
where python >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Python is not found in PATH. Please install Python 3.10+ from python.org.
    pause
    exit /b 1
)

REM 2. Check Node & npm
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: npm is not found in PATH. Please install Node.js 18+ from nodejs.org.
    pause
    exit /b 1
)

REM 3. Setup Backend venv if missing
if not exist "backend\venv" (
    echo --^> Creating Python virtual environment in backend\venv...
    python -m venv backend\venv
    call backend\venv\Scripts\activate.bat
    python -m pip install --upgrade pip
    pip install -r backend\requirements.txt
)

REM 4. Setup Frontend dependencies if missing
if not exist "frontend\node_modules" (
    echo --^> Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo === Environment Ready! ===
echo Starting Backend on http://127.0.0.1:8000 ...
start "TLS Inspector - FastAPI Backend" cmd /k "cd backend && venv\Scripts\activate.bat && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo Starting Frontend on http://localhost:5173 ...
start "TLS Inspector - Vite React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers started in separate terminal windows.
echo Open your browser at: http://localhost:5173
pause

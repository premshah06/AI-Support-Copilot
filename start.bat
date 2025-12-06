@echo off
REM AI Incident Support Copilot - Startup Script (Windows)
REM This script starts both backend and frontend servers

echo ================================================================
echo.
echo        AI Incident Support Copilot - Starting...
echo.
echo ================================================================
echo.

REM Check if backend virtual environment exists
if not exist "backend\venv" (
    echo [ERROR] Backend virtual environment not found!
    echo Please run: cd backend ^&^& python -m venv venv ^&^& venv\Scripts\activate ^&^& pip install -r requirements.txt
    pause
    exit /b 1
)

REM Check if frontend node_modules exists
if not exist "frontend\node_modules" (
    echo [ERROR] Frontend dependencies not found!
    echo Please run: cd frontend ^&^& npm install
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo [WARNING] .env file not found. Using .env.example
    if exist ".env.example" (
        copy .env.example .env
        echo [OK] Created .env from .env.example
        echo Please edit .env and add your GEMINI_API_KEY
    )
)

echo Starting Backend Server...
echo ================================================================
echo.

REM Start backend server in a new window
start "Backend Server" cmd /k "cd backend && venv\Scripts\activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Wait for backend to start
timeout /t 3 /nobreak > nul

echo [OK] Backend server started
echo     - http://localhost:8000
echo     - API Docs: http://localhost:8000/docs
echo.

echo Starting Frontend Server...
echo ================================================================
echo.

REM Start frontend server in a new window
start "Frontend Server" cmd /k "cd frontend && npm run dev"

REM Wait for frontend to start
timeout /t 3 /nobreak > nul

echo [OK] Frontend server started
echo     - http://localhost:5173
echo.

echo ================================================================
echo.
echo              All Servers Running!
echo.
echo ================================================================
echo.
echo Application URLs:
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:8000
echo   API Docs:  http://localhost:8000/docs
echo.
echo Default Login:
echo   Email:     admin@example.com
echo   Password:  admin123
echo.
echo Close the server windows to stop the servers
echo.
pause

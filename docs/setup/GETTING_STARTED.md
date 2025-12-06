================================================================================
                    STARTUP SCRIPTS - QUICK GUIDE
================================================================================

## OVERVIEW
================================================================================

Three easy ways to start the AI Incident Support Copilot application:

1. **Bash Script (Mac/Linux)** - Recommended
2. **Batch File (Windows)** - For Windows users
3. **NPM Scripts** - Alternative method

All methods start both backend and frontend servers automatically!

================================================================================
## METHOD 1: BASH SCRIPT (Mac/Linux) - RECOMMENDED
================================================================================

### Quick Start:
```bash
./start.sh
```

### What It Does:
✓ Checks if dependencies are installed
✓ Verifies .env file exists
✓ Starts backend server (port 8000)
✓ Starts frontend server (port 5173)
✓ Shows all URLs and login credentials
✓ Handles graceful shutdown with Ctrl+C

### Features:
- Color-coded output
- Error checking
- Automatic cleanup on exit
- Log files (backend.log, frontend.log)
- Process management

### To Stop:
Press `Ctrl+C` in the terminal

### View Logs:
```bash
# Backend logs
tail -f backend.log

# Frontend logs
tail -f frontend.log
```

================================================================================
## METHOD 2: BATCH FILE (Windows)
================================================================================

### Quick Start:
```cmd
start.bat
```

Or double-click `start.bat` in File Explorer

### What It Does:
✓ Checks if dependencies are installed
✓ Verifies .env file exists
✓ Opens backend server in new window
✓ Opens frontend server in new window
✓ Shows all URLs and login credentials

### Features:
- Separate windows for each server
- Easy to monitor each service
- Simple to close individual servers

### To Stop:
Close the server windows or press Ctrl+C in each window

================================================================================
## METHOD 3: NPM SCRIPTS (Alternative)
================================================================================

### Install concurrently (first time only):
```bash
npm install
```

### Quick Start:
```bash
npm run dev
```

### Other Available Scripts:
```bash
# Start with bash script
npm start

# Start on Windows
npm run start:windows

# Install all dependencies
npm run install:all

# Run tests
npm test

# Build for production
npm run build

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend
```

================================================================================
## FIRST TIME SETUP
================================================================================

Before running any startup script, make sure you've completed these steps:

### 1. Backend Setup:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 2. Frontend Setup:
```bash
cd frontend
npm install
cd ..
```

### 3. Environment Configuration:
```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_api_key_here
```

### 4. Database Initialization (Optional):
```bash
cd backend
python -m app.data.seed_demo_data
cd ..
```

================================================================================
## APPLICATION URLS
================================================================================

Once started, access the application at:

Frontend Application:
  → http://localhost:5173

Backend API:
  → http://localhost:8000

API Documentation:
  → http://localhost:8000/docs
  → http://localhost:8000/redoc

================================================================================
## DEFAULT LOGIN CREDENTIALS
================================================================================

Email:    admin@example.com
Password: admin123

================================================================================
## TROUBLESHOOTING
================================================================================

### Issue: "Backend virtual environment not found"
Solution:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

### Issue: "Frontend dependencies not found"
Solution:
```bash
cd frontend
npm install
cd ..
```

### Issue: "Port already in use"
Solution:
```bash
# Find and kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Find and kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Issue: "GEMINI_API_KEY not found"
Solution:
1. Get API key from https://makersuite.google.com/app/apikey
2. Edit .env file
3. Add: GEMINI_API_KEY=your_api_key_here
4. Restart servers

### Issue: "Database not initialized"
Solution:
```bash
cd backend
source venv/bin/activate
python -m app.data.seed_demo_data
cd ..
```

### Issue: "Module not found" errors
Solution:
```bash
# Reinstall backend dependencies
cd backend
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Reinstall frontend dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
cd ..
```

================================================================================
## LOGS AND DEBUGGING
================================================================================

### Log Files:
- `backend.log` - Backend server logs
- `frontend.log` - Frontend server logs

### View Logs in Real-Time:
```bash
# Backend
tail -f backend.log

# Frontend
tail -f frontend.log

# Both (in separate terminals)
tail -f backend.log &
tail -f frontend.log
```

### Clear Logs:
```bash
> backend.log
> frontend.log
```

================================================================================
## PRODUCTION DEPLOYMENT
================================================================================

For production deployment, use:

```bash
# Build frontend
cd frontend
npm run build
cd ..

# Start backend with gunicorn (production server)
cd backend
source venv/bin/activate
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

Or use Docker:
```bash
docker-compose up -d
```

================================================================================
## SCRIPT COMPARISON
================================================================================

| Feature              | Bash Script | Batch File | NPM Scripts |
|---------------------|-------------|------------|-------------|
| Mac/Linux           | ✅          | ❌         | ✅          |
| Windows             | ❌          | ✅         | ✅          |
| Color Output        | ✅          | ❌         | ❌          |
| Error Checking      | ✅          | ✅         | ❌          |
| Log Files           | ✅          | ❌         | ❌          |
| Graceful Shutdown   | ✅          | ❌         | ✅          |
| Separate Windows    | ❌          | ✅         | ❌          |
| Easy to Use         | ✅          | ✅         | ✅          |

**Recommendation:**
- Mac/Linux: Use `./start.sh`
- Windows: Use `start.bat`
- Cross-platform: Use `npm run dev`

================================================================================
## QUICK REFERENCE
================================================================================

### Start Application:
```bash
# Mac/Linux
./start.sh

# Windows
start.bat

# Any platform
npm run dev
```

### Stop Application:
```bash
# Bash script: Ctrl+C
# Batch file: Close windows
# NPM: Ctrl+C
```

### View Logs:
```bash
tail -f backend.log
tail -f frontend.log
```

### Access Application:
```
http://localhost:5173
```

### Login:
```
admin@example.com / admin123
```

================================================================================
                    HAPPY CODING! 🚀
================================================================================

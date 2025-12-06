# Quick Start Guide

Get your AI Incident Support Copilot running in 3 simple steps!

## 🚀 Start the Application

### Option 1: One-Command Startup (Recommended)

**Mac/Linux:**
```bash
./start.sh
```

**Windows:**
```cmd
start.bat
```

**Any Platform:**
```bash
npm install  # First time only
npm run dev
```

### Option 2: Manual Startup

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt  # First time only
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # First time only
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔑 Default Login

- **Email**: `admin@example.com`
- **Password**: `admin123`

## ⚙️ Configuration

1. Copy environment file:
   ```bash
   cp .env.example .env
   ```

2. Add your AI API key to `.env`:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_key_here
   ```

3. Get API key:
   - **Gemini**: https://makersuite.google.com/app/apikey
   - **OpenAI**: https://platform.openai.com/api-keys

## 📚 Need More Help?

- **Complete Setup**: [docs/setup/GETTING_STARTED.md](docs/setup/GETTING_STARTED.md)
- **AI Configuration**: [docs/setup/AI_SETUP_GUIDE.md](docs/setup/AI_SETUP_GUIDE.md)
- **Full Documentation**: [docs/README.md](docs/README.md)
- **Main README**: [README.md](README.md)

## 🐛 Troubleshooting

**Backend won't start?**
- Check Python version: `python --version` (need 3.11+)
- Install dependencies: `pip install -r backend/requirements.txt`

**Frontend won't start?**
- Check Node version: `node --version` (need 18+)
- Clear cache: `rm -rf frontend/node_modules && cd frontend && npm install`

**AI not working?**
- Verify API key in `.env`
- Check `AI_PROVIDER` setting matches your key type
- Ensure you have API credits/access

## ✨ Features to Try

1. **Create a Ticket** - Click "New Ticket" button
2. **Get AI Suggestions** - Open a ticket and click "Get AI Assistance"
3. **View Analytics** - Check the dashboard for metrics
4. **Toggle Dark Mode** - Click the theme toggle in header
5. **Search & Filter** - Use the search bar and filters

## 🎯 What's Next?

- Explore the [Component Library](frontend/COMPONENT_LIBRARY.md)
- Read the [Project Summary](docs/PROJECT_SUMMARY.md)
- Check out [Contributing Guidelines](CONTRIBUTING.md)
- Deploy to GitHub using [Deployment Checklist](GITHUB_DEPLOYMENT_CHECKLIST.md)

---

**Happy coding! 🚀**

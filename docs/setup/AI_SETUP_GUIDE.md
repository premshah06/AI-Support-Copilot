# AI Features Setup Guide

## Overview

Your AI Incident Support Copilot has comprehensive AI capabilities powered by either OpenAI or Google Gemini. This guide explains how to properly configure and use these features.

## Current Status

✅ **Application is fully functional** - AI features are currently disabled (`AI_PROVIDER=none`)
✅ **Fallback responses work** - The app provides generic suggestions when AI is disabled
✅ **All core features work** - Login, tickets, database, UI all operational

## AI Features Available

### 1. AI Ticket Assistant (`/api/tickets/{id}/ai-assist`)
- **Analyzes ticket content** and customer context
- **Searches knowledge base** using RAG (Retrieval Augmented Generation)
- **Generates suggestions**:
  - Summary of the issue
  - Recommended category and priority
  - Suggested reply to customer
  - Recommended actions to take

### 2. AI Incident Playbook (`/api/tickets/{id}/ai-playbook`)
- **Generates structured incident response plans**
- **Includes**:
  - Step-by-step resolution guide
  - Prerequisites needed
  - Rollback procedures
  - Best practices from knowledge base

### 3. RAG (Retrieval Augmented Generation)
- **Vector search** through knowledge base articles
- **Semantic matching** to find relevant documentation
- **Context enhancement** for better AI responses

## Configuration Options

### Option 1: Use OpenAI (Recommended)

**Pros:**
- Most reliable and tested
- Best quality responses
- Supports embeddings for RAG

**Setup:**

1. Get an API key from https://platform.openai.com/api-keys

2. Update `.env`:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-key-here
LLM_MODEL=gpt-4o-mini
EMBEDDINGS_MODEL=text-embedding-3-small
```

3. Restart backend:
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Cost:** ~$0.15 per 1M input tokens, $0.60 per 1M output tokens (gpt-4o-mini)

### Option 2: Use Google Gemini

**Pros:**
- Free tier available
- Fast responses
- Good for development

**Cons:**
- No native embeddings support (uses FakeEmbeddings for RAG)
- Model availability varies by region

**Setup:**

1. Get an API key from https://makersuite.google.com/app/apikey

2. Update `.env`:
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-actual-gemini-key
GEMINI_MODEL=gemini-pro
```

3. Restart backend

**Note:** The Gemini integration uses FakeEmbeddings for the vector store since Gemini doesn't have direct embeddings API in LangChain. For production, consider using OpenAI embeddings separately.

### Option 3: Disable AI (Current Setting)

**When to use:**
- Development without API costs
- Testing non-AI features
- No API keys available

**Current configuration:**
```env
AI_PROVIDER=none
```

**Behavior:**
- AI assist button shows fallback responses
- Generic suggestions provided
- No API calls made
- No costs incurred

## How AI Works in the Application

### 1. Ticket Analysis Flow

```
User clicks "AI Assist" 
    ↓
Backend receives request
    ↓
Loads ticket + customer data
    ↓
Searches knowledge base (RAG)
    ↓
Builds prompt with context
    ↓
Calls LLM (OpenAI/Gemini)
    ↓
Parses JSON response
    ↓
Returns suggestions to UI
    ↓
Logs action in database
```

### 2. RAG (Knowledge Base Search)

```
Query: "API timeout error"
    ↓
Convert to embeddings
    ↓
Search vector store (FAISS)
    ↓
Find top 3 similar articles
    ↓
Include in AI prompt
    ↓
AI generates context-aware response
```

### 3. Fallback Mechanism

If AI fails (no API key, error, timeout):
```python
{
  "summary": "First 200 chars of description",
  "category": "Current category",
  "priority": "Current priority",
  "suggested_reply": "Generic acknowledgment",
  "suggested_actions": ["review_ticket_details", "follow_up_with_customer"]
}
```

## Code Structure

### Backend Services

**`backend/app/services/ai_agent.py`**
- `assist_ticket()` - Main AI assistant function
- `generate_playbook()` - Incident playbook generator
- `_call_llm()` - LLM provider abstraction
- `_fallback_response()` - Graceful degradation

**`backend/app/services/rag.py`**
- `search_kb()` - Semantic search in knowledge base
- `refresh_vector_store()` - Rebuild embeddings index
- `_get_embeddings()` - Embeddings provider selection

**`backend/app/routers/ai.py`**
- `/tickets/{id}/ai-assist` - Get AI suggestions
- `/tickets/{id}/ai-playbook` - Generate playbook
- `/tickets/{id}/ai-feedback` - Submit feedback

### Configuration

**`backend/app/config.py`**
```python
ai_provider: str = "gemini"  # or "openai" or "none"
rag_enabled: bool = True
openai_api_key: str | None = None
gemini_api_key: str | None = None
llm_model: str = "gpt-4o-mini"
embeddings_model: str = "text-embedding-3-small"
gemini_model: str = "gemini-pro"
```

## Testing AI Features

### 1. Test AI Assist

```bash
# Login and get token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=alex.agent@example.com&password=demo123"

# Use AI assist on a ticket
curl -X POST http://localhost:8000/api/tickets/1/ai-assist \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Test Playbook Generation

```bash
curl -X POST http://localhost:8000/api/tickets/1/ai-playbook \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Test Knowledge Base Search

The RAG system automatically searches the knowledge base when you use AI assist. Check the logs to see which articles were found.

## Troubleshooting

### Issue: "404 models/gemini-pro not found"

**Solution:** Your Gemini API key doesn't have access to the model. Either:
1. Switch to OpenAI: `AI_PROVIDER=openai`
2. Disable AI: `AI_PROVIDER=none`
3. Try a different Gemini model (check available models in your region)

### Issue: "No module named 'openai'"

**Solution:** Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### Issue: AI responses are generic

**Possible causes:**
1. `AI_PROVIDER=none` - Check `.env` file
2. No API key configured
3. API key invalid
4. Rate limit exceeded

**Check logs** for specific error messages

### Issue: RAG not finding relevant articles

**Solutions:**
1. Ensure knowledge base has articles: `python backend/check_db.py`
2. Refresh vector store: Restart backend
3. Check if `RAG_ENABLED=true` in `.env`

## Best Practices

### 1. API Key Security
- Never commit `.env` file to git
- Use environment variables in production
- Rotate keys regularly
- Monitor usage and costs

### 2. Cost Management
- Use `gpt-4o-mini` instead of `gpt-4` for lower costs
- Set usage limits in OpenAI dashboard
- Monitor token usage in logs
- Consider caching frequent queries

### 3. Quality Assurance
- Review AI suggestions before sending to customers
- Use AI feedback feature to improve responses
- Regularly update knowledge base articles
- Monitor AI accuracy metrics

### 4. Production Deployment
- Use separate API keys for dev/staging/prod
- Enable rate limiting
- Set up monitoring and alerts
- Have fallback responses ready

## Monitoring

### Check AI Usage

```bash
# View AI actions in database
sqlite3 backend/app/app.db "SELECT * FROM ticket_actions WHERE actor_type='AI' ORDER BY created_at DESC LIMIT 10;"
```

### Check AI Feedback

```bash
# View feedback on AI suggestions
sqlite3 backend/app/app.db "SELECT * FROM ai_feedback ORDER BY created_at DESC;"
```

## Future Enhancements

Potential improvements to consider:

1. **Fine-tuning** - Train custom models on your ticket data
2. **Multi-modal** - Add image analysis for screenshots
3. **Streaming** - Real-time AI response streaming
4. **Caching** - Cache common queries to reduce costs
5. **A/B Testing** - Compare different models/prompts
6. **Analytics** - Track AI accuracy and user satisfaction

## Summary

Your AI features are properly implemented with:
- ✅ Dual provider support (OpenAI/Gemini)
- ✅ RAG for knowledge base integration
- ✅ Graceful fallbacks when AI unavailable
- ✅ Comprehensive error handling
- ✅ Feedback collection system
- ✅ Production-ready architecture

**Current state:** AI disabled, app fully functional with fallback responses.

**To enable:** Add API key to `.env`, set `AI_PROVIDER`, restart backend.

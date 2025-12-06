# Using Google Gemini with AI Incident Support Copilot

This guide explains how to configure and use Google Gemini as the AI provider for the AI Incident Support Copilot application.

## Why Gemini?

Google Gemini offers several advantages:
- **Cost-effective**: Gemini 1.5 Flash is very affordable for production use
- **Fast**: Low latency responses
- **Capable**: Strong performance on support ticket analysis and response generation
- **Free tier**: Generous free tier for development and testing

## Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## Configuration

### 1. Update your `.env` file

```env
# Set Gemini as the AI provider
AI_PROVIDER=gemini

# Add your Gemini API key
GEMINI_API_KEY=your_gemini_api_key_here

# Choose your Gemini model (optional, defaults to gemini-1.5-flash)
GEMINI_MODEL=gemini-1.5-flash
```

### 2. Available Gemini Models

- `gemini-1.5-flash` - Fast and cost-effective (recommended for most use cases)
- `gemini-1.5-pro` - More capable, higher quality responses
- `gemini-1.0-pro` - Previous generation model

### 3. Install Dependencies

If you haven't already installed the backend dependencies:

```bash
cd backend
pip install -r requirements.txt
```

## Testing the Integration

### 1. Start the Backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### 2. Test the AI Assist Endpoint

You can test the Gemini integration by:

1. Starting the frontend: `cd frontend && npm run dev`
2. Opening a ticket in the UI
3. Clicking "Ask AI to Help" button
4. Verifying that AI suggestions are generated

Or use curl:

```bash
curl -X POST http://localhost:8000/api/tickets/1/ai-assist
```

## Switching Between Providers

You can easily switch between Gemini and OpenAI by changing the `AI_PROVIDER` environment variable:

### Use Gemini:
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_key
```

### Use OpenAI:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_key
```

No code changes are required - just restart the backend server after updating `.env`.

## Troubleshooting

### Error: "API key not found"

**Solution**: Make sure you've set `GEMINI_API_KEY` in your `.env` file and restarted the backend server.

### Error: "Invalid API key"

**Solution**: Verify your API key is correct. You can test it directly at [Google AI Studio](https://makersuite.google.com/).

### Error: "Quota exceeded"

**Solution**: Check your API usage at [Google Cloud Console](https://console.cloud.google.com/). You may need to enable billing or wait for quota reset.

### Responses are slow

**Solution**: Try using `gemini-1.5-flash` instead of `gemini-1.5-pro` for faster responses.

### JSON parsing errors

**Solution**: The AI sometimes returns malformed JSON. The application has fallback logic to handle this, but you can try:
- Adjusting the temperature (lower = more consistent)
- Using a more capable model like `gemini-1.5-pro`

## Cost Comparison

### Gemini 1.5 Flash (Recommended)
- **Input**: $0.075 per 1M tokens
- **Output**: $0.30 per 1M tokens
- **Free tier**: 15 requests per minute

### Gemini 1.5 Pro
- **Input**: $1.25 per 1M tokens
- **Output**: $5.00 per 1M tokens
- **Free tier**: 2 requests per minute

### OpenAI GPT-4o-mini (for comparison)
- **Input**: $0.15 per 1M tokens
- **Output**: $0.60 per 1M tokens

## Best Practices

1. **Use Flash for development**: Gemini 1.5 Flash is perfect for development and most production use cases
2. **Monitor usage**: Keep an eye on your API usage in Google Cloud Console
3. **Handle errors gracefully**: The application includes fallback responses when AI is unavailable
4. **Test thoroughly**: Always test AI responses before deploying to production
5. **Set rate limits**: Consider implementing rate limiting in production to control costs

## Additional Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)
- [Pricing Information](https://ai.google.dev/pricing)
- [LangChain Gemini Integration](https://python.langchain.com/docs/integrations/chat/google_generative_ai)

## Support

If you encounter issues with the Gemini integration:

1. Check the backend logs for detailed error messages
2. Verify your API key and configuration
3. Test the API key directly in Google AI Studio
4. Open an issue on GitHub with error details

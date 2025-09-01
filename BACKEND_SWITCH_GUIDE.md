# Backend Switch Guide: From Node.js Express to Python FastAPI

## Current Architecture

**Currently Running:** Node.js Express backend (server/routes.ts)
- Port: 5000
- Mock AI responses with template text
- In-memory storage (MemStorage class)

**Available:** Python FastAPI backend (backend/ folder)  
- Real OpenRouter API integration with Qwen model
- Proper error handling and timeouts
- Environment-based configuration

## Switching Steps

### 1. Stop Current Application
```bash
# Stop the current Node.js backend
# The workflow will automatically stop when you restart with Python
```

### 2. Install Python Dependencies
```bash
cd backend
pip install fastapi uvicorn requests python-dotenv pydantic
```

### 3. Set Environment Variables
```bash
# Create .env file in backend/ directory
echo "OPENROUTER_API_KEY=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" > backend/.env
```

### 4. Update Package.json Scripts
Edit root package.json to run Python backend:
```json
{
  "scripts": {
    "dev": "cd backend && uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload",
    "start": "cd backend && uvicorn app.main:app --host 0.0.0.0 --port 5000"
  }
}
```

### 5. Update Frontend API Endpoints
The Python backend uses different endpoint structure:
```javascript
// Current Node.js endpoints:
/api/conversations/:id/messages

// Python FastAPI endpoints:
/chat/send
/chat/history/:conversation_id
```

You'll need to update frontend calls in:
- `src/pages/Desktop.tsx` (createMessageMutation)
- Any other API calls to match FastAPI routes

### 6. Test the Switch
```bash
npm run dev
# Should now start Python FastAPI backend with real AI integration
```

## Key Differences

| Feature | Node.js (Current) | Python FastAPI |
|---------|-------------------|-----------------|
| AI Integration | Mock responses | Real OpenRouter API |
| Model | Template text | qwen/qwen2.5-72b-instruct:free |
| Error Handling | Basic | Comprehensive with timeouts |
| API Structure | REST with conversations | Chat-focused endpoints |
| Storage | In-memory | Database ready |

## Frontend API Communication Points

The following frontend components communicate with the backend:

1. **Desktop.tsx - createMessageMutation**: Main message sending
2. **PromptInput.tsx - handleSend**: User input trigger  
3. **All fetch() calls**: Direct API communication

When switching, update these endpoints to match the Python FastAPI structure.

## Rollback Plan

To switch back to Node.js:
1. Revert package.json scripts to original
2. Restart application
3. Node.js backend will resume with mock responses
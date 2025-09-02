import requests
import json
from app.models.schema import MessageCreate, ChatResponse
from app.core.config import settings

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

async def process_user_message(message: MessageCreate) -> ChatResponse:
    """
    Call OpenRouter Qwen model to get AI response
    Uses the Qwen 2.5 72B model via OpenRouter API
    """
    headers = {
        "Authorization": f"Bearer {settings.openrouter_api_key}",
        "Content-Type": "application/json",
        #"HTTP-Referer": "https://replit.com",
        #"X-Title": "AI Chatbot MVP"
    }

    payload = {
        "model": settings.ai_model_name,
        "messages": [
            {"role": "user", "content": message.content}
        ],
        "max_tokens": 2000,
        "temperature": 0.7,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
    }

    try:
        response = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()

        if "choices" in data and len(data["choices"]) > 0:
            ai_reply = data["choices"][0]["message"]["content"]
        else:
            ai_reply = "I apologize, but I couldn't generate a response at this time. Please try again."

        return ChatResponse(
            conversation_id=message.conversation_id or 1,
            user_message=message.content,
            ai_response=ai_reply
        )
    
    except requests.exceptions.RequestException as e:
        print(f"Error calling OpenRouter API: {e}")
        return ChatResponse(
            conversation_id=message.conversation_id or 1,
            user_message=message.content,
            ai_response="I'm experiencing technical difficulties. Please try again later."
        )
    except Exception as e:
        print(f"Unexpected error: {e}")
        return ChatResponse(
            conversation_id=message.conversation_id or 1,
            user_message=message.content,
            ai_response="An unexpected error occurred. Please try again."
        )

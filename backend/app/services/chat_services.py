import requests
from app.models.schema import MessageCreate, ChatResponse
from app.core.config import settings

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

async def process_user_message(message: MessageCreate) -> ChatResponse:
    """
    Call OpenRouter Qwen model to get AI response
    """
    headers = {
        "Authorization": f"Bearer {settings.openrouter_api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": settings.ai_model_name,
        "messages": [
            {"role": "user", "content": message.content}
        ],
    }

    response = requests.post(OPENROUTER_URL, headers=headers, json=payload)
    data = response.json()

    ai_reply = data["choices"][0]["message"]["content"]

    return ChatResponse(
        conversation_id=message.conversation_id or 1,
        user_message=message.content,
        ai_response=ai_reply
    )

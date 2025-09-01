from fastapi import APIRouter
from app.models.schema import MessageCreate, ChatResponse
from app.services.chat_services import process_user_message

router = APIRouter()

@router.post("/send", response_model=ChatResponse)
async def send_message(message: MessageCreate):
    """
    Accepts a user message, processes with AI, returns response.
    """
    return await process_user_message(message)

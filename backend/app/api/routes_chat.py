# File: backend/app/api/routes_chat.py

from fastapi import APIRouter, HTTPException
from app.models.schema import (
    MessageCreate, ChatResponse,
    ConversationCreate, ConversationOut, ConversationUpdate,
    MessageOut
)
from app.services.chat_services import process_user_message
from app.services.mem_storage import storage
from typing import List

router = APIRouter()

# Endpoint untuk mengelola percakapan
@router.get("/conversations", response_model=List[ConversationOut])
async def get_conversations():
    return storage.get_conversations(user_id=1)

@router.post("/conversations", response_model=ConversationOut)
async def create_new_conversation(conversation_data: ConversationCreate):
    new_conversation = storage.create_conversation(user_id=1, title=conversation_data.title)
    if not new_conversation:
        raise HTTPException(status_code=500, detail="Failed to create new conversation")
    return new_conversation

@router.patch("/conversations/{id}", response_model=ConversationOut)
async def update_conversation(id: int, updates: ConversationUpdate):
    storage.update_conversation(id, updates.title, updates.is_pinned)
    updated_conv = storage.conversations.get(id)
    if not updated_conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return updated_conv

@router.delete("/conversations/{id}")
async def delete_conversation(id: int):
    if not storage.delete_conversation(id):
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"message": "Conversation deleted successfully"}

# Endpoint untuk mengelola pesan
@router.get("/conversations/{id}/messages", response_model=List[MessageOut])
async def get_messages(id: int):
    return storage.get_messages(id)

@router.post("/conversations/{id}/messages", response_model=MessageOut)
async def create_message(id: int, message_data: MessageCreate):
    # Simpan pesan pengguna ke memori
    user_message = storage.create_message(id, "user", message_data.content)
    
    # Panggil layanan AI untuk mendapatkan respons
    ai_response = await process_user_message(message_data)
    
    # Simpan respons AI ke memori
    storage.create_message(id, "assistant", ai_response.ai_response)
    
    # Mengembalikan pesan pengguna yang baru dibuat sebagai respons
    return user_message